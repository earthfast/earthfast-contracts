// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./ArmadaNodes.sol";
import "./ArmadaProjects.sol";
import "./ArmadaRegistry.sol";
import "./ArmadaTypes.sol";

/// @title Entry point for managing node reservations by projects
contract ArmadaReservations is AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // Controls who can do data import during contract initialization
  bytes32 public constant IMPORTER_ROLE = keccak256("IMPORTER_ROLE");

  ArmadaRegistry private _registry;

  mapping(bytes32 => EnumerableSet.Bytes32Set) private _projectNodeIds; // Union of last and next epoch

  event ReservationCreated(bytes32 indexed nodeId, bytes32 indexed operatorId, bytes32 indexed projectId,
    uint256 lastPrice, uint256 nextPrice, ArmadaSlot slot);
  event ReservationDeleted(bytes32 indexed nodeId, bytes32 indexed operatorId, bytes32 indexed projectId,
    uint256 lastPrice, uint256 nextPrice, ArmadaSlot slot);

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
    ArmadaProjects projects = _registry.getProjects();
    ArmadaProject memory project = projects.getProject(projectId);
    require(msg.sender == project.owner, "not project owner");
    _;
  }

  modifier onlyAdminOrProjectOwner(bytes32 projectId) {
    ArmadaProjects projects = _registry.getProjects();
    ArmadaProject memory project = projects.getProject(projectId);
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
  function initialize(address[] calldata admins, ArmadaRegistry registry, bool grantImporterRole)
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
  function unsafeSetRegistry(ArmadaRegistry registry) public virtual onlyAdmin { _registry = registry; }

  /// @dev Allows to import initial contract data. Used for proxy-less upgrades.
  /// @param revokeImporterRole stops further data import by revoking the role.
  /// CAUTION: Once import is finished, the role should be explicitly revoked.
  function unsafeImportData(ArmadaNode[] calldata nodes, bool revokeImporterRole)
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

  function getRegistry() public virtual view returns (ArmadaRegistry) { return _registry; }

  function removeProjectNodeIdImpl(bytes32 projectId, bytes32 nodeId)
  public virtual onlyImpl whenNotPaused returns (bool) {
    return _projectNodeIds[projectId].remove(nodeId);
  }

  /// @notice Reserves content nodes and locks corresponding escrow amount. Reverts if escrow is insufficient.
  /// @param maxPrices At what max price to reserve. A safety mechanism in case price changes during this call.
  ///
  /// Use slot.last to reserve immediately in the current epoch (AKA spot), instead of at the start of next epoch.
  /// In this case, the node prices will be prorated, but the project won't be able to immediately release these
  /// nodes until next epoch. Use slot.next to auto-renew reservation in the next epoch (required if !slot.last).
  function createReservations(
    bytes32 projectId, bytes32[] memory nodeIds, uint256[] memory maxPrices, ArmadaSlot calldata slot)
  public virtual onlyProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(slot.last || slot.next, "no slot");
    require(nodeIds.length == maxPrices.length, "length mismatch");
    uint256 lastEpoch = _registry.lastEpochSlot();
    uint256 nextEpoch = _registry.nextEpochSlot();
    uint256 epochRemainder = _registry.getEpochRemainder();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      ArmadaNode memory nodeCopy = _registry.getNodes().getNode(nodeIds[i]);
      createReservationImpl(projectId, nodeCopy, lastEpoch, nextEpoch, epochRemainder, maxPrices[i], slot);
    }
    ArmadaProject memory projectCopy = _registry.getProjects().getProject(projectId);
    require(projectCopy.escrow >= projectCopy.reserve, "not enough escrow");
  }

  function createReservationImpl(
    bytes32 projectId, ArmadaNode memory nodeCopy, uint256 lastEpoch, uint256 nextEpoch, uint256 epochRemainder,
    uint256 maxPrice, ArmadaSlot calldata slot)
  internal virtual {
    ArmadaNodes allNodes = _registry.getNodes();
    require(!nodeCopy.topology, "topology node");
    require(!nodeCopy.disabled, "node disabled");
    uint256 lastPrice = 0;
    uint256 nextPrice = 0;
    if (slot.last) {
      require(nodeCopy.projectIds[lastEpoch] == 0, "node reserved");
      lastPrice = nodeCopy.prices[lastEpoch];
      require(lastPrice <= maxPrice, "price mismatch");
      uint256 proratedPrice = lastPrice * epochRemainder / _registry.getLastEpochLength(); 
      allNodes.setNodeProjectImpl(nodeCopy.id, lastEpoch, projectId);
      allNodes.setNodePriceImpl(nodeCopy.id, lastEpoch, proratedPrice);
      _registry.getProjects().setProjectReserveImpl(projectId, 0, proratedPrice);
    }
    if (slot.next) {
      require(nodeCopy.projectIds[nextEpoch] == 0, "node reserved");
      nextPrice = nodeCopy.prices[nextEpoch];
      require(nextPrice <= maxPrice, "price mismatch");
      allNodes.setNodeProjectImpl(nodeCopy.id, nextEpoch, projectId);
      _registry.getProjects().setProjectReserveImpl(projectId, 0, nextPrice);
    }
    _projectNodeIds[projectId].add(nodeCopy.id);
    emit ReservationCreated(nodeCopy.id, nodeCopy.operatorId, projectId, lastPrice, nextPrice, slot);
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
  function deleteReservations(bytes32 projectId, bytes32[] memory nodeIds, ArmadaSlot calldata slot)
  public virtual onlyAdminOrProjectOwner(projectId) whenNotReconciling whenNotPaused {
    require(slot.last || slot.next, "no slot");
    require(!slot.last || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    ArmadaNodes allNodes = _registry.getNodes();
    uint256 lastEpoch = _registry.lastEpochSlot();
    uint256 nextEpoch = _registry.nextEpochSlot();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      bytes32 nodeId = nodeIds[i];
      ArmadaNode memory nodeCopy = allNodes.getNode(nodeId);
      deleteReservationImpl(projectId, nodeCopy, lastEpoch, nextEpoch, slot);
    }
  }

  function deleteReservationImpl(
    bytes32 projectId, bytes32 nodeId, uint256 lastEpoch, uint256 nextEpoch, ArmadaSlot calldata slot)
  public virtual onlyImpl whenNotPaused {
    ArmadaNodes allNodes = _registry.getNodes();
    ArmadaNode memory nodeCopy = allNodes.getNode(nodeId);
    deleteReservationImpl(projectId, nodeCopy, lastEpoch, nextEpoch, slot);
  }

  function deleteReservationImpl(
    bytes32 projectId, ArmadaNode memory nodeCopy, uint256 lastEpoch, uint256 nextEpoch, ArmadaSlot calldata slot)
  internal virtual {
    uint256 lastPrice = 0;
    uint256 nextPrice = 0;
    if (slot.last) {
      lastPrice = nodeCopy.prices[lastEpoch];
      nextPrice = nodeCopy.prices[nextEpoch];
      require(nodeCopy.projectIds[lastEpoch] == projectId, "node not reserved");
      _registry.getNodes().setNodePriceImpl(nodeCopy.id, lastEpoch, nextPrice);
      _registry.getNodes().setNodeProjectImpl(nodeCopy.id, lastEpoch, 0);
      _registry.getProjects().setProjectReserveImpl(projectId, lastPrice, 0);
      if (nodeCopy.projectIds[nextEpoch] != projectId) {
        assert(_projectNodeIds[projectId].remove(nodeCopy.id));
      }
    }
    if (slot.next) {
      nextPrice = nodeCopy.prices[nextEpoch];
      require(nodeCopy.projectIds[nextEpoch] == projectId, "node not reserved");
      _registry.getNodes().setNodeProjectImpl(nodeCopy.id, nextEpoch, 0);
      _registry.getProjects().setProjectReserveImpl(projectId, nextPrice, 0);
      if (nodeCopy.projectIds[lastEpoch] != projectId) {
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
  public virtual view returns (ArmadaNode[] memory result) {
    ArmadaNodes allNodes = _registry.getNodes();
    EnumerableSet.Bytes32Set storage nodeIds = _projectNodeIds[projectId];
    uint256 length = nodeIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    result = new ArmadaNode[](n);
    for (uint256 i = 0; i < n; i++) {
      result[i] = allNodes.getNode(nodeIds.at(skip + i));
    }
  }
}
