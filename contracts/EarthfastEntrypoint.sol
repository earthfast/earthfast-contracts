// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./EarthfastNodes.sol";
import "./EarthfastProjects.sol";
import "./EarthfastReservations.sol";
import "./EarthfastTypes.sol";

/// @title Entrypoint for interacting with Earthfast and atomically creating projects and reservations
contract EarthfastEntrypoint is
    Initializable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
  // Role for admin functions
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  // Event for when a site is deployed
  event SiteDeployed(
    bytes32 indexed projectId,
    address indexed owner,
    uint256 escrowAmount,
    bytes32[] nodeIds,
    EarthfastSlot slot
  );

  EarthfastNodes private _nodes;
  EarthfastProjects private _projects;
  EarthfastReservations private _reservations;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Initializes the contract
  /// @param admins Array of admin addresses
  /// @param nodes Address of the EarthfastNodes contract
  /// @param projects Address of the EarthfastProjects contract
  /// @param reservations Address of the EarthfastReservations contract
  function initialize(
    address[] calldata admins,
    address nodes,
    address projects,
    address reservations
  ) public initializer {
    __AccessControl_init();
    __ReentrancyGuard_init();
    __UUPSUpgradeable_init();

    _nodes = EarthfastNodes(nodes);
    _projects = EarthfastProjects(projects);
    _reservations = EarthfastReservations(reservations);

    // Set up admin roles
    for (uint256 i = 0; i < admins.length; i++) {
      _grantRole(ADMIN_ROLE, admins[i]);
      _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
    }
  }

  /// @dev Function that authorizes upgrades, only callable by admins
  function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

  /// @notice Updates the contract references
  /// @param nodes New address of the EarthfastNodes contract
  /// @param projects New address of the EarthfastProjects contract
  /// @param reservations New address of the EarthfastReservations contract
  function updateContracts(
    address nodes,
    address projects,
    address reservations
  ) external onlyRole(ADMIN_ROLE) {
    if (nodes != address(0)) {
      _nodes = EarthfastNodes(nodes);
    }
    if (projects != address(0)) {
      _projects = EarthfastProjects(projects);
    }
    if (reservations != address(0)) {
      _reservations = EarthfastReservations(reservations);
    }
  }

  /// @notice Creates a new project and reserves content nodes for it
  /// @param project Data for the new project
  /// @param fundingWallet Address of the wallet depositing escrow for the new project
  /// @param nodesToReserve Number of nodes to reserve
  /// @param escrowAmount Amount of escrow to deposit
  /// @param slot When to start the reservation. If slot.last is true, the reservation will start immediately.
  /// If slot.next is true, the reservation will start at the beginning of the next epoch.
  /// @return projectId ID of the newly created project
  function deploySite(
    EarthfastCreateProjectData memory project,
    address fundingWallet,
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

    // Call depositProjectEscrow directly
    _projects.depositProjectEscrow(fundingWallet, projectId, escrowAmount, deadline, v, r, s);

    // Get available nodes for reservation
    (bytes32[] memory nodeIds, uint256[] memory nodePrices) = getAvailableNodes(nodesToReserve, slot);

    // Call createReservations directly
    _reservations.createReservations(projectId, nodeIds, nodePrices, slot);

    emit SiteDeployed(
      projectId,
      project.owner,
      escrowAmount,
      nodeIds,
      slot
    );
  }

  /// @notice Creates a new project and reserves specific nodes
  /// @param project Data for the new project
  /// @param fundingWallet Address of the wallet depositing escrow for the new project
  /// @param nodeIds IDs of the nodes to reserve
  /// @param nodePrices Prices of the nodes to reserve
  /// @param escrowAmount Amount of escrow to deposit
  /// @param slot When to start the reservation
  /// @param deadline The deadline for the permit
  /// @param signature The signature for the permit
  function deploySiteWithNodeIds(
    EarthfastCreateProjectData memory project,
    address fundingWallet,
    bytes32[] memory nodeIds,
    uint256[] memory nodePrices,
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

    // Call depositProjectEscrow directly
    _projects.depositProjectEscrow(fundingWallet, projectId, escrowAmount, deadline, v, r, s);

    // Call createReservations directly
    _reservations.createReservations(projectId, nodeIds, nodePrices, slot);

    emit SiteDeployed(
      projectId,
      project.owner,
      escrowAmount,
      nodeIds,
      slot
    );
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
    // Validate slot configuration
    require(slot.last || slot.next, "Invalid slot configuration");

    uint256 nodeCount = _nodes.getNodeCount(0);
    EarthfastNode[] memory nodes = _nodes.getNodes(0, 0, nodeCount);

    nodeIds = new bytes32[](nodesToReserve);
    nodePrices = new uint256[](nodesToReserve);
    uint256 nodeIndex = 0;
    for (uint256 i = 0; i < nodeCount; ++i) {
        // Skip disabled nodes
        if (nodes[i].disabled) {
            continue;
        }

      // Check if the node is available for reservation at the specified slot and also available for reservation at the next slot
      bool isAvailable = slot.last ?
        nodes[i].projectIds[EARTHFAST_LAST_EPOCH] == 0 && nodes[i].projectIds[EARTHFAST_NEXT_EPOCH] == 0 :
        nodes[i].projectIds[EARTHFAST_NEXT_EPOCH] == 0;

      if (isAvailable) {
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

  /// @notice Get the addresses of the contracts used by the entrypoint
  /// @return nodes Address of the EarthfastNodes contract
  /// @return projects Address of the EarthfastProjects contract
  /// @return reservations Address of the EarthfastReservations contract
  function getContracts() external view returns (address nodes, address projects, address reservations) {
    return (address(_nodes), address(_projects), address(_reservations));
  }

  // Reserve storage slots for future upgrades
  uint256[10] private __gap;
}
