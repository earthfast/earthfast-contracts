// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./EarthfastRegistry.sol";
import "./EarthfastNodes.sol";

/// @title Internal helper library to reduce deployent size of EarthfastNodes contract
library EarthfastNodesImpl {
  // NOTE: These events must match the corresponding events in EarthfastNodes contract
  event NodeHostChanged(bytes32 indexed nodeId, string oldHost, string oldRegion, string newHost, string newRegion);
  event NodePriceChanged(bytes32 indexed nodeId, uint256 oldLastPrice, uint256 oldNextPrice, uint256 newPrice, EarthfastSlot slot);
  event NodeDisabledChanged(bytes32 indexed nodeId, bool oldDisabled, bool newDisabled);

  function setNodeHostsImpl(
    mapping(bytes32 => EarthfastNode) storage _nodes, bool admin,
    bytes32 operatorId, bytes32[] memory nodeIds, string[] memory hosts, string[] memory regions)
  public {
    require(nodeIds.length == hosts.length, "length mismatch");
    require(nodeIds.length == regions.length, "length mismatch");
    for (uint256 i = 0; i < nodeIds.length; i++) {
      require(bytes(hosts[i]).length > 0, "empty host");
      require(bytes(hosts[i]).length <= EARTHFAST_MAX_HOST_BYTES, "host too long");
      require(bytes(regions[i]).length > 0, "empty region");
      require(bytes(regions[i]).length <= EARTHFAST_MAX_REGION_BYTES, "region too long");
      EarthfastNode storage node = _nodes[nodeIds[i]];
      require(node.id != 0, "unknown node");
      require(node.operatorId == operatorId, "operator mismatch");
      require(admin || (node.projectIds[EARTHFAST_LAST_EPOCH] == 0 &&
        node.projectIds[EARTHFAST_NEXT_EPOCH] == 0), "node reserved");
      string memory oldHost = node.host;
      string memory oldRegion = node.region;
      node.host = hosts[i];
      node.region = regions[i];
      emit NodeHostChanged(node.id, oldHost, oldRegion, hosts[i], regions[i]);
    }
  }

  function setNodePricesImpl(
    EarthfastRegistry _registry, mapping(bytes32 => EarthfastNode) storage _nodes,
    bytes32 operatorId, bytes32[] memory nodeIds, uint256[] memory prices, EarthfastSlot calldata slot)
  public {
    require(nodeIds.length == prices.length, "length mismatch");
    EarthfastNodes allNodes = _registry.getNodes();
    EarthfastProjects projects = _registry.getProjects();
    EarthfastReservations reservations = _registry.getReservations();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      EarthfastNode storage node = _nodes[nodeIds[i]];
      require(node.id != 0, "unknown node");
      require(node.operatorId == operatorId, "operator mismatch");
      uint256 oldLastPrice = node.prices[EARTHFAST_LAST_EPOCH];
      uint256 oldNextPrice = node.prices[EARTHFAST_NEXT_EPOCH];
      if (slot.last) {
        require(node.projectIds[EARTHFAST_LAST_EPOCH] == 0, "node reserved");
        node.prices[EARTHFAST_LAST_EPOCH] = prices[i];
      }
      if (slot.next) {
        node.prices[EARTHFAST_NEXT_EPOCH] = prices[i];
        bytes32 projectId = node.projectIds[EARTHFAST_NEXT_EPOCH];
        if (projectId != 0) {
          projects.setProjectReserveImpl(projectId, oldNextPrice, prices[i]);
          EarthfastProject memory projectCopy = projects.getProject(projectId);
          if (projectCopy.escrow < projectCopy.reserve) {
            _registry.requireNotGracePeriod();
            EarthfastSlot memory slot_ = EarthfastSlot({ last: false, next: true });
            reservations.deleteReservationImpl(allNodes, projects, projectId, node.id, slot_);
          }
        }
      }
      emit NodePriceChanged(node.id, oldLastPrice, oldNextPrice, prices[i], slot);
    }
  }

  function setNodeDisabledImpl(
    EarthfastRegistry _registry, mapping(bytes32 => EarthfastNode) storage _nodes,
    bytes32 operatorId, bytes32[] memory nodeIds, bool[] memory disabled)
  public {
    require(nodeIds.length == disabled.length, "length mismatch");
    EarthfastNodes allNodes = _registry.getNodes();
    EarthfastProjects projects = _registry.getProjects();
    EarthfastReservations reservations = _registry.getReservations();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      EarthfastNode storage node = _nodes[nodeIds[i]];
      require(node.id != 0, "unknown node");
      require(node.operatorId == operatorId, "operator mismatch");
      bool oldDisabled = node.disabled;
      node.disabled = disabled[i];
      bytes32 projectId = node.projectIds[EARTHFAST_NEXT_EPOCH];
      if (projectId != 0) {
        _registry.requireNotGracePeriod();
        EarthfastSlot memory slot_ = EarthfastSlot({ last: false, next: true });
        reservations.deleteReservationImpl(allNodes, projects, projectId, node.id, slot_);
      }
      emit NodeDisabledChanged(node.id, oldDisabled, disabled[i]);
    }
  }
}
