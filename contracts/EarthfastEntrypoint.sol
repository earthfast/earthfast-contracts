// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./EarthfastNodes.sol";
import "./EarthfastProjects.sol";
import "./EarthfastReservations.sol";
import "./EarthfastTypes.sol";

/// @title Entrypoint for interacting with Earthfast and atomically creating projects and reservations
contract EarthfastEntrypoint is ReentrancyGuard {

/**
 * @dev Reserved storage gap to prevent storage collisions when using delegatecall.
 * EarthfastProjects and EarthfastReservations use up to 20 storage slots in their
 * delegatecalled functions. This gap ensures those writes don't overwrite our
 * actual state variables.
 * DO NOT REMOVE OR REDUCE THE SIZE OF THIS GAP without careful analysis of
 * storage layouts in all delegatecalled contracts.
 */
  uint256[30] private __gap;

  EarthfastNodes private _nodes;
  EarthfastProjects private _projects;
  EarthfastReservations private _reservations;

  constructor(address nodes, address projects, address reservations) {
    _nodes = EarthfastNodes(nodes);
    _projects = EarthfastProjects(projects);
    _reservations = EarthfastReservations(reservations);
  }

  /// @notice Creates a new project and reserves content nodes for it
  /// @dev This function used delegatecall to call the projects and reservations contracts to preserve msg.sender.
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
    uint256 deadline,
    bytes memory signature
  ) public nonReentrant returns (bytes32 projectId) {
    // Create project
    projectId = _projects.createProject(project);

    // split signature into v, r, s
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

    // Deposit escrow
    require(escrowAmount > 0, "Escrow amount must be greater than 0");

    // call depositProjectEscrow on projects contract via delegatecall
    (bool success, ) = address(_projects).delegatecall(abi.encodeWithSelector(EarthfastProjects.depositProjectEscrow.selector, projectId, escrowAmount, deadline, v, r, s));
    require(success, "Deposit failed");

    // Get available nodes for reservation
    (bytes32[] memory nodeIds, uint256[] memory nodePrices) = getAvailableNodes(nodesToReserve, slot);

    // Create reservations for the available nodes via delegatecall
    (bool createReservationsSuccess, ) = address(_reservations).delegatecall(abi.encodeWithSelector(EarthfastReservations.createReservations.selector, projectId, nodeIds, nodePrices, slot));
    require(createReservationsSuccess, "Reservation failed");
  }

  // TODO: potentially optimize by returning the cheapest set of nodes
  // TODO: Potentially optimize by returning a list of available nodes if full number not available
  /// @notice Returns a list of available nodes for reservation
  /// @param nodesToReserve Number of nodes to reserve
  /// @param slot When to start the reservation. If slot.last is true, the reservation will start immediately.
  /// If slot.next is true, the reservation will start at the beginning of the next epoch.
  /// @return nodeIds IDs of the available nodes
  /// @return nodePrices Prices of the available nodes
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
        nodeIds[nodeIndex] = nodes[i].id;
        nodePrices[nodeIndex] = nodes[i].prices[slot.last ? EARTHFAST_LAST_EPOCH : EARTHFAST_NEXT_EPOCH];
        nodeIndex++;
        
        // Stop if enough nodes have been found
        if (nodeIndex == nodesToReserve) {
          break;
        }
      }
    }

    require(nodeIndex == nodesToReserve, "Not enough available nodes");
  }

  /// @notice Splits a signature into v, r, s components
  /// @param sig The signature to split
  /// @return v The v component of the signature
  /// @return r The r component of the signature
  /// @return s The s component of the signature
  function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    require(sig.length == 65, "Invalid signature length");

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }
  }

}
