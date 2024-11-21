// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { Multicall } from "@openzeppelin/contracts/utils/Multicall.sol";

import "./EarthfastNodes.sol";
import "./EarthfastProjects.sol";
import "./EarthfastRegistry.sol";
import "./EarthfastReservations.sol";
import "./EarthfastTypes.sol";

// TODO: add signature generation support
/// @title Entrypoint for interacting with Earthfast
contract EarthfastEntrypoint is Multicall {

  EarthfastNodes private _nodes;
  EarthfastProjects private _projects;
  EarthfastRegistry private _registry;
  EarthfastReservations private _reservations;

  /// @notice Creates a new project and reserves content nodes for it
  /// @param project Data for the new project
  /// @param nodesToReserve Number of nodes to reserve
  /// @param escrowAmount Amount of escrow to deposit
  /// @param slot When to start the reservation. If slot.last is true, the reservation will start immediately.
  /// If slot.next is true, the reservation will start at the beginning of the next epoch.
  /// @return projectId ID of the newly created project
  function deploySite(
    EarthfastCreateProjectData memory project,
    uint256 nodesToReserve,
    uint256 escrowAmount,
    EarthfastSlot calldata slot,
    bytes memory signature
  ) public returns (bytes32 projectId) {
    // Create project
    projectId = _projects.createProject(project);

    // split signature into v, r, s
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

    // Deposit escrow
    uint256 deadline = block.timestamp + 1 days; // 1 day deadline for permit
    require(escrowAmount > 0, "Escrow amount must be greater than 0");
    _projects.depositProjectEscrow(projectId, escrowAmount, deadline, v, r, s);

    // Get available nodes for reservation
    (bytes32[] memory nodeIds, uint256[] memory nodePrices) = getAvailableNodes(nodesToReserve, slot);
    
    // Create reservations for the available nodes
    _reservations.createReservations(projectId, nodeIds, nodePrices, slot);
  }

  // TODO: potentially optimize by returning the cheapest set of nodes
  // TODO: Potentially optimize by returning a list of available nodes if full number not available
  /// @notice Returns a list of available nodes for reservation
  /// @param nodesToReserve Number of nodes to reserve
  /// @param slot When to start the reservation. If slot.last is true, the reservation will start immediately.
  /// If slot.next is true, the reservation will start at the beginning of the next epoch.
  /// @return nodeIds IDs of the available nodes
  function getAvailableNodes(
    uint256 nodesToReserve,
    EarthfastSlot calldata slot
  ) public view returns (bytes32[] memory nodeIds, uint256[] memory nodePrices) {
    uint256 nodeCount = _nodes.getNodeCount(0);
    EarthfastNode[] memory nodes = _nodes.getNodes(0, 0, nodeCount);

    nodeIds = new bytes32[](nodesToReserve);
    nodePrices = new uint256[](nodesToReserve);
    uint256 nodeIndex = 0;
    for (uint256 i = 0; i < nodeCount; ++i) {
      // Check if the node is available for reservation at the specified slot
      if (nodes[i].projectIds[slot.last ? EARTHFAST_LAST_EPOCH : EARTHFAST_NEXT_EPOCH] == 0) {
        // Add the node to the list of available nodes
        nodeIndex++;
        nodeIds[nodeIndex] = nodes[i].id;
        nodePrices[nodeIndex] = nodes[i].prices[slot.last ? EARTHFAST_LAST_EPOCH : EARTHFAST_NEXT_EPOCH];
      }
      // Stop if enough nodes have been found
      if (nodeIndex == nodesToReserve) {
        break;
      }
    }

    require(nodeIndex == nodesToReserve, "Not enough available nodes");
  }

  function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    require(sig.length == 65, "Invalid signature length");

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }
  }

}
