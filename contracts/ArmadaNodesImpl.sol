// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ArmadaRegistry.sol";
import "./ArmadaNodes.sol";

/// @title Internal helper library to reduce deployent size of ArmadaNodes contract
library ArmadaNodesImpl {
  // NOTE: These events must match the corresponding events in ArmadaNodes contract
  event NodeHostChanged(bytes32 indexed nodeId, string oldHost, string oldRegion, string newHost, string newRegion);
  event NodePriceChanged(bytes32 indexed nodeId, uint256 oldLastPrice, uint256 oldNextPrice, uint256 newPrice, ArmadaSlot slot);
  event NodeDisabledChanged(bytes32 indexed nodeId, bool oldDisabled, bool newDisabled);

  function setNodeHostsImpl(
    mapping(bytes32 => ArmadaNode) storage _nodes, bool admin,
    bytes32 operatorId, bytes32[] memory nodeIds, string[] memory hosts, string[] memory regions)
  public {
    require(nodeIds.length == hosts.length, "length mismatch");
    require(nodeIds.length == regions.length, "length mismatch");
    for (uint256 i = 0; i < nodeIds.length; i++) {
      require(bytes(hosts[i]).length > 0, "empty host");
      require(bytes(hosts[i]).length <= ARMADA_MAX_HOST_BYTES, "host too long");
      require(bytes(regions[i]).length > 0, "empty region");
      require(bytes(regions[i]).length <= ARMADA_MAX_REGION_BYTES, "region too long");
      ArmadaNode storage node = _nodes[nodeIds[i]];
      require(node.id != 0, "unknown node");
      require(node.operatorId == operatorId, "operator mismatch");
      require(admin || (node.projectIds[ARMADA_LAST_EPOCH] == 0 &&
        node.projectIds[ARMADA_NEXT_EPOCH] == 0), "node reserved");
      string memory oldHost = node.host;
      string memory oldRegion = node.region;
      node.host = hosts[i];
      node.region = regions[i];
      emit NodeHostChanged(node.id, oldHost, oldRegion, hosts[i], regions[i]);
    }
  }

  function setNodePricesImpl(
    ArmadaRegistry _registry, mapping(bytes32 => ArmadaNode) storage _nodes,
    bytes32 operatorId, bytes32[] memory nodeIds, uint256[] memory prices, ArmadaSlot calldata slot)
  public {
    require(nodeIds.length == prices.length, "length mismatch");
    ArmadaNodes allNodes = _registry.getNodes();
    ArmadaProjects projects = _registry.getProjects();
    ArmadaReservations reservations = _registry.getReservations();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      ArmadaNode storage node = _nodes[nodeIds[i]];
      require(node.id != 0, "unknown node");
      require(node.operatorId == operatorId, "operator mismatch");
      require(!node.topology, "topology node");
      uint256 oldLastPrice = node.prices[ARMADA_LAST_EPOCH];
      uint256 oldNextPrice = node.prices[ARMADA_NEXT_EPOCH];
      if (slot.last) {
        require(node.projectIds[ARMADA_LAST_EPOCH] == 0, "node reserved");
        node.prices[ARMADA_LAST_EPOCH] = prices[i];
      }
      if (slot.next) {
        node.prices[ARMADA_NEXT_EPOCH] = prices[i];
        bytes32 projectId = node.projectIds[ARMADA_NEXT_EPOCH];
        if (projectId != 0) {
          projects.setProjectReserveImpl(projectId, oldNextPrice, prices[i]);
          ArmadaProject memory projectCopy = projects.getProject(projectId);
          if (projectCopy.escrow < projectCopy.reserve) {
            _registry.requireNotGracePeriod();
            ArmadaSlot memory slot_ = ArmadaSlot({ last: false, next: true });
            reservations.deleteReservationImpl(allNodes, projects, projectId, node.id, slot_);
          }
        }
      }
      emit NodePriceChanged(node.id, oldLastPrice, oldNextPrice, prices[i], slot);
    }
  }

  function setNodeDisabledImpl(
    ArmadaRegistry _registry, mapping(bytes32 => ArmadaNode) storage _nodes,
    bytes32 operatorId, bytes32[] memory nodeIds, bool[] memory disabled)
  public {
    require(nodeIds.length == disabled.length, "length mismatch");
    ArmadaNodes allNodes = _registry.getNodes();
    ArmadaProjects projects = _registry.getProjects();
    ArmadaReservations reservations = _registry.getReservations();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      ArmadaNode storage node = _nodes[nodeIds[i]];
      require(node.id != 0, "unknown node");
      require(node.operatorId == operatorId, "operator mismatch");
      bool oldDisabled = node.disabled;
      node.disabled = disabled[i];
      bytes32 projectId = node.projectIds[ARMADA_NEXT_EPOCH];
      if (projectId != 0) {
        _registry.requireNotGracePeriod();
        ArmadaSlot memory slot_ = ArmadaSlot({ last: false, next: true });
        reservations.deleteReservationImpl(allNodes, projects, projectId, node.id, slot_);
      }
      emit NodeDisabledChanged(node.id, oldDisabled, disabled[i]);
    }
  }
}
