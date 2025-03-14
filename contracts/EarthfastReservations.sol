// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./EarthfastNodes.sol";
import "./EarthfastProjects.sol";
import "./EarthfastRegistry.sol";
import "./EarthfastTypes.sol";

/// @title Entry point for managing node reservations by projects
contract EarthfastReservations is AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // Controls who can do data import during contract initialization
  bytes32 public constant IMPORTER_ROLE = keccak256("IMPORTER_ROLE");

  EarthfastRegistry private _registry;
  mapping(address => bool) private _authorizedEntrypoints;

  mapping(bytes32 => EnumerableSet.Bytes32Set) private _projectNodeIds; // Union of last and next epoch

  event ReservationCreated(bytes32 indexed nodeId, bytes32 indexed operatorId, bytes32 indexed projectId,
    uint256 lastPrice, uint256 nextPrice, EarthfastSlot slot);
  event ReservationDeleted(bytes32 indexed nodeId, bytes32 indexed operatorId, bytes32 indexed projectId,
    uint256 lastPrice, uint256 nextPrice, EarthfastSlot slot);

  modifier onlyImpl {
    require(
      msg.sender == address(_registry) ||
      msg.sender == address(_registry.getBilling()) ||
      msg.sender == address(_registry.getNodes()) ||
      msg.sender == address(_registry.getOperators()) ||
      msg.sender == address(_registry.getProjects()),
      "not impl");
    _;
  }

  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    _;
  }

  modifier onlyProjectOwner(bytes32 projectId) {
    EarthfastProjects projects = _registry.getProjects();
    EarthfastProject memory project = projects.getProject(projectId);
    require(msg.sender == project.owner || 
           (_authorizedEntrypoints[msg.sender]), 
           "not project owner");
    _;
  }

  modifier onlyAdminOrProjectOwner(bytes32 projectId) {
    EarthfastProjects projects = _registry.getProjects();
    EarthfastProject memory project = projects.getProject(projectId);
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
      msg.sender == project.owner, "not admin or project owner");
    _;
  }

  modifier whenNotReconciling() {
    _registry.requireNotReconciling();
    _;
  }

  /// @dev Called once to set up the contract. Not called during proxy upgrades.
  ///
  /// @param grantImporterRole allows the contract deployer to import initial data into
  /// the contract using unsafeImport* functions, which is used for proxy-less upgrades.
  /// CAUTION: Once import is finished, the importer role should be explicitly revoked.
  function initialize(address[] calldata admins, EarthfastRegistry registry, bool grantImporterRole)
  public initializer {
    __Context_init();
    __ERC165_init();
    __ERC1967Upgrade_init();
    __AccessControl_init();
    __Pausable_init();
    __UUPSUpgradeable_init();

    _registry = registry;
    require(admins.length > 0, "no admins");
    for (uint256 i = 0; i < admins.length; ++i) {
      require(admins[i] != address(0), "zero admin");
      _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
    }

    if (grantImporterRole) {
      // solhint-disable-next-line avoid-tx-origin
      _grantRole(IMPORTER_ROLE, tx.origin); // Only the contract deployer will have this role
      _setRoleAdmin(IMPORTER_ROLE, IMPORTER_ROLE); // Admin must not be able to grant this role
    }
  }

  /// @dev Reverts if proxy upgrade of this contract by msg.sender is not allowed
  function _authorizeUpgrade(address) internal virtual override onlyAdmin {}

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetRegistry(EarthfastRegistry registry) public virtual onlyAdmin { _registry = registry; }

  /// @dev Authorizes an entrypoint to call functions on behalf of users
  function authorizeEntrypoint(address entrypoint) public virtual onlyAdmin { 
    _authorizedEntrypoints[entrypoint] = true; 
  }

  /// @dev Revokes authorization for an entrypoint
  function revokeEntrypoint(address entrypoint) public virtual onlyAdmin { 
    _authorizedEntrypoints[entrypoint] = false; 
  }

  /// @dev Checks if an address is an authorized entrypoint
  function isAuthorizedEntrypoint(address entrypoint) public virtual view returns (bool) { 
    return _authorizedEntrypoints[entrypoint]; 
  }

  /// @dev Allows to import initial contract data. Used for proxy-less upgrades.
  /// @param revokeImporterRole stops further data import by revoking the role.
  /// CAUTION: Once import is finished, the role should be explicitly revoked.
  function unsafeImportData(EarthfastNode[] calldata nodes, bool revokeImporterRole)
  public onlyRole(IMPORTER_ROLE) {
    for (uint256 i = 0; i < nodes.length; i++) {
      bytes32 nodeId = nodes[i].id;
      if (nodes[i].projectIds[0] != 0)
        _projectNodeIds[nodes[i].projectIds[0]].add(nodeId);
      if (nodes[i].projectIds[1] != 0)
        _projectNodeIds[nodes[i].projectIds[1]].add(nodeId);
    }
    if (revokeImporterRole) {
      _revokeRole(IMPORTER_ROLE, msg.sender);
    }
  }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getRegistry() public virtual view returns (EarthfastRegistry) { return _registry; }

  function removeProjectNodeIdImpl(bytes32 projectId, bytes32 nodeId)
  public virtual onlyImpl whenNotPaused returns (bool) {
    return _projectNodeIds[projectId].remove(nodeId);
  }

  /// @notice Reserves content nodes and locks corresponding escrow amount. Reverts if escrow is insufficient.
  /// @param projectId The ID of the project to reserve nodes for.
  /// @param nodeIds The IDs of the nodes to reserve.
  /// @param maxPrices At what max price to reserve. A safety mechanism in case price changes during this call.
  /// @param slot When to reserve the nodes.
  ///
  /// Use slot.last to reserve immediately in the current epoch (AKA spot), instead of at the start of next epoch.
  /// In this case, the node prices will be prorated, but the project won't be able to immediately release these
  /// nodes until next epoch. Use slot.next to auto-renew reservation in the next epoch (required if !slot.last).
  function createReservations(
    bytes32 projectId, bytes32[] memory nodeIds, uint256[] memory maxPrices, EarthfastSlot calldata slot)
  public virtual onlyProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(slot.last || slot.next, "no slot");
    require(nodeIds.length == maxPrices.length, "length mismatch");
    EarthfastNodes allNodes = _registry.getNodes();
    EarthfastProjects projects = _registry.getProjects();
    uint256 epochRemainder = _registry.getEpochRemainder();
    
    EarthfastCreateReservationData memory params;
    params.nodes = allNodes;
    params.projects = projects;
    params.projectId = projectId;
    params.epochRemainder = epochRemainder;
    params.slot = slot;
    
    for (uint256 i = 0; i < nodeIds.length; i++) {
      params.node = allNodes.getNode(nodeIds[i]);
      params.maxPrice = maxPrices[i];
      createReservationImpl(params);
    }
    
    EarthfastProject memory projectCopy = projects.getProject(projectId);
    require(projectCopy.escrow >= projectCopy.reserve, "not enough escrow");
  }

  function createReservationImpl(EarthfastCreateReservationData memory params)
  internal virtual {
    require(!params.node.disabled, "node disabled");
    uint256 lastPrice = 0;
    uint256 nextPrice = 0;
    if (params.slot.last) {
      require(params.node.projectIds[EARTHFAST_LAST_EPOCH] == 0, "node reserved");
      lastPrice = params.node.prices[EARTHFAST_LAST_EPOCH];
      require(lastPrice <= params.maxPrice, "price mismatch");
      uint256 proratedPrice = lastPrice * params.epochRemainder / _registry.getLastEpochLength(); 
      params.nodes.setNodeProjectImpl(params.node.id, EARTHFAST_LAST_EPOCH, params.projectId);
      params.nodes.setNodePriceImpl(params.node.id, EARTHFAST_LAST_EPOCH, proratedPrice);
      params.projects.setProjectReserveImpl(params.projectId, 0, proratedPrice);
    }
    if (params.slot.next) {
      require(params.node.projectIds[EARTHFAST_NEXT_EPOCH] == 0, "node reserved");
      nextPrice = params.node.prices[EARTHFAST_NEXT_EPOCH];
      require(nextPrice <= params.maxPrice, "price mismatch");
      params.nodes.setNodeProjectImpl(params.node.id, EARTHFAST_NEXT_EPOCH, params.projectId);
      params.projects.setProjectReserveImpl(params.projectId, 0, nextPrice);
    }
    _projectNodeIds[params.projectId].add(params.node.id);
    emit ReservationCreated(params.node.id, params.node.operatorId, params.projectId, lastPrice, nextPrice, params.slot);
  }

  /// @notice Releases content nodes starting from next epoch and unlocks project escrow
  ///
  /// Project owner can use slot.next to schedule reservation to be deleted in the next epoch.
  /// Admin can additionally use slot.last to immediately delete reservation in the current epoch.
  /// The latter is an emergency mechanism. As a side effect, the project won't be billed for the
  /// node usage in the epoch so far, and the operator won't be credited for providing this node.
  /// Moreover, the current epoch price of the released node will be set to its next epoch price,
  /// so if there was a price change scheduled by the operator, it will be accelerated to happen
  /// in this epoch.
  function deleteReservations(bytes32 projectId, bytes32[] memory nodeIds, EarthfastSlot calldata slot)
  public virtual onlyAdminOrProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(slot.last || slot.next, "no slot");
    require(!slot.last || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    EarthfastNodes allNodes = _registry.getNodes();
    EarthfastProjects projects = _registry.getProjects();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      bytes32 nodeId = nodeIds[i];
      EarthfastNode memory nodeCopy = allNodes.getNode(nodeId);
      deleteReservationImpl(allNodes, projects, projectId, nodeCopy, slot);
    }
  }

  function deleteReservationImpl(
    EarthfastNodes allNodes, EarthfastProjects projects, bytes32 projectId, bytes32 nodeId, EarthfastSlot calldata slot)
  public virtual onlyImpl whenNotPaused {
    EarthfastNode memory nodeCopy = allNodes.getNode(nodeId);
    deleteReservationImpl(allNodes, projects, projectId, nodeCopy, slot);
  }

  function deleteReservationImpl(
    EarthfastNodes allNodes, EarthfastProjects projects, bytes32 projectId, EarthfastNode memory nodeCopy,
    EarthfastSlot calldata slot)
  internal virtual {
    uint256 lastPrice = 0;
    uint256 nextPrice = 0;
    if (slot.last) {
      lastPrice = nodeCopy.prices[EARTHFAST_LAST_EPOCH];
      nextPrice = nodeCopy.prices[EARTHFAST_NEXT_EPOCH];
      require(nodeCopy.projectIds[EARTHFAST_LAST_EPOCH] == projectId, "node not reserved");
      allNodes.setNodePriceImpl(nodeCopy.id, EARTHFAST_LAST_EPOCH, nextPrice);
      allNodes.setNodeProjectImpl(nodeCopy.id, EARTHFAST_LAST_EPOCH, 0);
      projects.setProjectReserveImpl(projectId, lastPrice, 0);
      if (nodeCopy.projectIds[EARTHFAST_NEXT_EPOCH] != projectId) {
        assert(_projectNodeIds[projectId].remove(nodeCopy.id));
      }
    }
    if (slot.next) {
      nextPrice = nodeCopy.prices[EARTHFAST_NEXT_EPOCH];
      require(nodeCopy.projectIds[EARTHFAST_NEXT_EPOCH] == projectId, "node not reserved");
      allNodes.setNodeProjectImpl(nodeCopy.id, EARTHFAST_NEXT_EPOCH, 0);
      projects.setProjectReserveImpl(projectId, nextPrice, 0);
      if (nodeCopy.projectIds[EARTHFAST_LAST_EPOCH] != projectId) {
        assert(_projectNodeIds[projectId].remove(nodeCopy.id));
      }
    }
    if (slot.last && slot.next) {
      assert(_projectNodeIds[projectId].remove(nodeCopy.id));
    }
    emit ReservationDeleted(nodeCopy.id, nodeCopy.operatorId, projectId, lastPrice, nextPrice, slot);
  }

  function getReservationCount(bytes32 projectId)
  public virtual view returns (uint256) {
    return _projectNodeIds[projectId].length();
  }

  /// @dev Truncates the results if skip or size are out of bounds
  function getReservations(bytes32 projectId, uint256 skip, uint256 size)
  public virtual view returns (EarthfastNode[] memory result) {
    EarthfastNodes allNodes = _registry.getNodes();
    EnumerableSet.Bytes32Set storage nodeIds = _projectNodeIds[projectId];
    uint256 length = nodeIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    result = new EarthfastNode[](n);
    for (uint256 i = 0; i < n; i++) {
      result[i] = allNodes.getNode(nodeIds.at(skip + i));
    }
  }

  // Reserve storage for future upgrades
  uint256[10] private __gap;

}
