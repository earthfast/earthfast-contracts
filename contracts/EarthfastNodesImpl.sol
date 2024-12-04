// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./EarthfastRegistry.sol";
import "./EarthfastNodes.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title Internal helper library to reduce deployent size of EarthfastNodes contract
library EarthfastNodesImpl {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // NOTE: These events must match the corresponding events in EarthfastNodes contract
  event NodeHostChanged(bytes32 indexed nodeId, string oldHost, string oldRegion, string newHost, string newRegion);
  event NodePriceChanged(bytes32 indexed nodeId, uint256 oldLastPrice, uint256 oldNextPrice, uint256 newPrice, EarthfastSlot slot);
  event NodeDisabledChanged(bytes32 indexed nodeId, bool oldDisabled, bool newDisabled);
  event SharedNodeReserved(bytes32 indexed nodeId, bytes32 indexed projectId, uint256 sharePrice, EarthfastSlot slot);
  event SharedNodeReleased(bytes32 indexed nodeId, bytes32 indexed projectId, EarthfastSlot slot);

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

  function validateCreateNodeData(EarthfastCreateNodeData memory node) internal pure {
    require(bytes(node.host).length > 0, "empty host");
    require(bytes(node.host).length <= EARTHFAST_MAX_HOST_BYTES, "host too long");
    require(bytes(node.region).length > 0, "empty region");
    require(bytes(node.region).length <= EARTHFAST_MAX_REGION_BYTES, "region too long");
    
    if (node.nodeType == EARTHFAST_NODE_SHARED) {
      require(node.maxShares > 0, "shared node needs maxShares > 0");
    } else {
      require(node.nodeType == EARTHFAST_NODE_DEDICATED, "invalid node type");
      require(node.maxShares == 0, "dedicated node must have maxShares = 0");
    }
  }

  function reserveSharedNode(
    mapping(bytes32 => EarthfastNode) storage nodes,
    mapping(bytes32 => EnumerableSet.Bytes32Set) storage nodeShares,
    bytes32 nodeId,
    bytes32 projectId,
    uint256 epochSlot
  ) internal returns (bool) {
    EarthfastNode storage node = nodes[nodeId];
    require(node.nodeType == EARTHFAST_NODE_SHARED, "not a shared node");
    require(!node.disabled, "node disabled");

    EnumerableSet.Bytes32Set storage shares = nodeShares[nodeId];
    require(shares.length() < node.maxShares, "node fully shared");

    // Add project to shares
    if (shares.add(projectId)) {
      uint256 sharePrice = node.prices[epochSlot];
      emit SharedNodeReserved(nodeId, projectId, sharePrice, EarthfastSlot({
        last: epochSlot == EARTHFAST_LAST_EPOCH,
        next: epochSlot == EARTHFAST_NEXT_EPOCH
      }));
      return true;
    }
    return false;
  }

  function releaseSharedNode(
    mapping(bytes32 => EarthfastNode) storage nodes,
    mapping(bytes32 => EnumerableSet.Bytes32Set) storage nodeShares,
    bytes32 nodeId,
    bytes32 projectId,
    uint256 epochSlot
  ) internal returns (bool) {
    EarthfastNode storage node = nodes[nodeId];
    require(node.nodeType == EARTHFAST_NODE_SHARED, "not a shared node");

    if (nodeShares[nodeId].remove(projectId)) {
      emit SharedNodeReleased(nodeId, projectId, EarthfastSlot({
        last: epochSlot == EARTHFAST_LAST_EPOCH,
        next: epochSlot == EARTHFAST_NEXT_EPOCH
      }));
      return true;
    }
    return false;
  }
}
