// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./EarthfastRegistry.sol";
import "./EarthfastNodesImpl.sol";

/// @title Entry point for managing instances of content nodes
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract EarthfastNodes is AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // Controls who can do data import during contract initialization
  bytes32 public constant IMPORTER_ROLE = keccak256("IMPORTER_ROLE");

  EarthfastRegistry private _registry;

  mapping(bytes32 => EarthfastNode) private _nodes;
  EnumerableSet.Bytes32Set private _contentNodeIds;

  mapping(bytes32 => EnumerableSet.Bytes32Set) private _operatorContentNodeIds;

  // NOTE: These events must match the corresponding events in EarthfastNodesImpl library
  event NodeCreated(bytes32 indexed nodeId, bytes32 indexed operatorId, string host, string region, bool disabled, uint256 price);
  event NodeDeleted(bytes32 indexed nodeId, bytes32 indexed operatorId, string host, string region, bool disabled, uint256 price);
  event NodeHostChanged(bytes32 indexed nodeId, string oldHost, string oldRegion, string newHost, string newRegion);
  event NodePriceChanged(bytes32 indexed nodeId, uint256 oldLastPrice, uint256 oldNextPrice, uint256 newPrice, EarthfastSlot slot);
  event NodeDisabledChanged(bytes32 indexed nodeId, bool oldDisabled, bool newDisabled);

  modifier onlyImpl {
    require(
      msg.sender == address(_registry.getBilling()) ||
      msg.sender == address(_registry.getOperators()) ||
      msg.sender == address(_registry.getProjects()) ||
      msg.sender == address(_registry.getReservations()),
      "not impl");
    _;
  }

  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    _;
  }

  modifier onlyOperator(bytes32 operatorId) {
    EarthfastOperators operators = _registry.getOperators();
    EarthfastOperator memory operator = operators.getOperator(operatorId);
    require(msg.sender == operator.owner, "not operator");
    _;
  }

  modifier onlyAdminOrOperator(bytes32 operatorId) {
    EarthfastOperators operators = _registry.getOperators();
    EarthfastOperator memory operator = operators.getOperator(operatorId);
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
      msg.sender == operator.owner, "not admin or operator");
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

  /// @dev Allows to import initial contract data. Used for proxy-less upgrades.
  /// @param revokeImporterRole stops further data import by revoking the role.
  /// CAUTION: Once import is finished, the role should be explicitly revoked.
  function unsafeImportData(EarthfastNode[] calldata nodes, bool revokeImporterRole)
  public onlyRole(IMPORTER_ROLE) {
    for (uint256 i = 0; i < nodes.length; i++) {
      bytes32 nodeId = nodes[i].id;
      _nodes[nodeId] = nodes[i];
      require(getNodeIdsRef().add(nodeId), "duplicate id");
      assert(getOperatorNodeIdsRef()[nodes[i].operatorId].add(nodeId));
    }
    if (revokeImporterRole) {
      _revokeRole(IMPORTER_ROLE, msg.sender);
    }
  }

  /// @dev Adjusts multiple content nodes prices relative to their current values.
  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetPrices(uint256 skip, uint256 size, uint256 mul, uint256 div)
  public virtual onlyAdmin {
    require(mul != 0, "zero mul");
    uint256 length = _contentNodeIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    for (uint256 i = 0; i < n; i++) {
      EarthfastNode storage node = _nodes[_contentNodeIds.at(skip + i)];
      node.prices[EARTHFAST_LAST_EPOCH] = node.prices[EARTHFAST_LAST_EPOCH] * mul / div;
      node.prices[EARTHFAST_NEXT_EPOCH] = node.prices[EARTHFAST_NEXT_EPOCH] * mul / div;
    }
  }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getRegistry() public virtual view returns (EarthfastRegistry) { return _registry; }

  function getNodeIdsRef()
  internal virtual view returns (EnumerableSet.Bytes32Set storage) {
    return _contentNodeIds;
  }

  function getOperatorNodeIdsRef()
  internal virtual view returns (mapping(bytes32 => EnumerableSet.Bytes32Set) storage) {
    return _operatorContentNodeIds;
  }

  function setNodePriceImpl(bytes32 nodeId, uint256 epochSlot, uint256 price)
  public virtual onlyImpl whenNotPaused {
    EarthfastNode storage node = _nodes[nodeId];
    require(node.id != 0, "unknown node");
    node.prices[epochSlot] = price;
  }

  function setNodeProjectImpl(bytes32 nodeId, uint256 epochSlot, bytes32 projectId)
  public virtual onlyImpl whenNotPaused {
    EarthfastNode storage node = _nodes[nodeId];
    require(node.id != 0, "unknown node");
    node.projectIds[epochSlot] = projectId;
  }

  function advanceNodeEpochImpl(bytes32 nodeId)
  public virtual onlyImpl whenNotPaused {
    EarthfastNode storage node = _nodes[nodeId];
    require(node.id != 0, "unknown node");
    if (node.projectIds[EARTHFAST_LAST_EPOCH] != node.projectIds[EARTHFAST_NEXT_EPOCH])
      node.projectIds[EARTHFAST_LAST_EPOCH] = node.projectIds[EARTHFAST_NEXT_EPOCH];
    if (node.prices[EARTHFAST_LAST_EPOCH] != node.prices[EARTHFAST_NEXT_EPOCH])
      node.prices[EARTHFAST_LAST_EPOCH] = node.prices[EARTHFAST_NEXT_EPOCH];
  }

  // FIXME: move bytes32 return out of this function
  /// @dev Validates data for creating a new content node
  /// @dev Avoids stack too deep issue
  /// @return ID of the created node
  function _validateCreateNodeData(EarthfastCreateNodeData memory node)
  internal virtual returns (bytes32) {
    // require(node.price == 0, "node price");
    require(bytes(node.host).length > 0, "empty host");
    require(bytes(node.host).length <= EARTHFAST_MAX_HOST_BYTES, "host too long");
    require(bytes(node.region).length > 0, "empty region");
    require(bytes(node.region).length <= EARTHFAST_MAX_REGION_BYTES, "region too long");
    return keccak256(abi.encodePacked(_registry.newNonceImpl()));
  }

  /// @notice Registers new nodes on the network and locks operator stake. Reverts if stake is insufficient.
  /// @dev Does not check host or region for validity or uniqueness
  /// @param operatorId Unique identifier of the operator running the nodes
  /// @param nodes Data for each node to create
  /// @return nodeIds IDs of the created nodes
  function createNodes(bytes32 operatorId, EarthfastCreateNodeData[] memory nodes)
  public virtual onlyOperator(operatorId) whenNotReconciling whenNotPaused returns (bytes32[] memory nodeIds) {
    EarthfastOperators operators = _registry.getOperators();
    EarthfastOperator memory operatorCopy = operators.getOperator(operatorId);

    // validate operator stake
    // nodeCount * stakePerNode
    uint256 lockedStake = (_operatorContentNodeIds[operatorId].length() + nodes.length) * operators.getStakePerNode();
    require(operatorCopy.stake >= lockedStake, "not enough stake");

    nodeIds = new bytes32[](nodes.length);
    for (uint256 i = 0; i < nodes.length; i++) {
      EarthfastCreateNodeData memory node = nodes[i];
      bytes32 nodeId = _validateCreateNodeData(node);
      _nodes[nodeId] = EarthfastNode({
        id: nodeId, operatorId: operatorId, host: node.host, region: node.region,
        disabled: node.disabled, prices: [node.price, node.price], projectIds: [bytes32(0), bytes32(0)]
      });
      assert(getNodeIdsRef().add(nodeId));
      assert(getOperatorNodeIdsRef()[operatorId].add(nodeId));
      emit NodeCreated(nodeId, operatorId, node.host, node.region, node.disabled, node.price);
      nodeIds[i] = nodeId;
    }
  }

  /// @notice Unregisters nodes from the network and unlocks operator stake. Reverts if nodes are reserved.
  /// @param operatorId Unique identifier of the operator running the nodes
  /// @param nodeIds IDs of the nodes to delete
  function deleteNodes(bytes32 operatorId, bytes32[] memory nodeIds)
  public virtual onlyOperator(operatorId) whenNotReconciling whenNotPaused {
    for (uint256 i = 0; i < nodeIds.length; i++) {
      bytes32 nodeId = nodeIds[i];
      EarthfastNode memory nodeCopy = _nodes[nodeId];
      require(nodeCopy.id != 0, "unknown node");
      require(nodeCopy.operatorId == operatorId, "operator mismatch");
      require(nodeCopy.projectIds[EARTHFAST_LAST_EPOCH] == 0 &&
        nodeCopy.projectIds[EARTHFAST_NEXT_EPOCH] == 0, "node reserved");
      delete _nodes[nodeId];
      assert(getNodeIdsRef().remove(nodeId));
      assert(getOperatorNodeIdsRef()[operatorId].remove(nodeId));
      emit NodeDeleted(nodeId, nodeCopy.operatorId, nodeCopy.host, nodeCopy.region,
        nodeCopy.disabled, nodeCopy.prices[EARTHFAST_NEXT_EPOCH]);
    }
  }

  /// @notice Changes content node hosts and regions. Reverts if nodes are reserved (unless admin).
  /// @dev Does not check host or region for validity or uniqueness
  function setNodeHosts(bytes32 operatorId, bytes32[] memory nodeIds, string[] memory hosts, string[] memory regions)
  public virtual onlyAdminOrOperator(operatorId) whenNotReconciling whenNotPaused {
    bool admin = hasRole(DEFAULT_ADMIN_ROLE, msg.sender);
    EarthfastNodesImpl.setNodeHostsImpl(_nodes, admin, operatorId, nodeIds, hosts, regions);
  }

  /// @notice Changes content node prices: spot price (current epoch only), renewal price (starting from next epoch).
  /// Reverts if changing the spot price and the nodes are already reserved in the current epoch.
  /// Reverts if changing the renewal price too close before next epoch start, as set by EarthfastRegistry gracePeriod.
  /// Cancels node renewal if the node price went up and the project escrow is no longer enough.
  /// @param slot specifies which type of node prices to change - spot price, renewal price, or both.
  function setNodePrices(bytes32 operatorId, bytes32[] memory nodeIds, uint256[] memory prices, EarthfastSlot calldata slot)
  public virtual onlyOperator(operatorId) whenNotReconciling whenNotPaused {
    EarthfastNodesImpl.setNodePricesImpl(_registry, _nodes, operatorId, nodeIds, prices, slot);
  }

  /// @notice Disabled nodes won't take new reservations and won't renew when epoch ends.
  /// Disabled nodes will still keep their current reservations until the end of the current epoch.
  /// Reenabled nodes will not retain their old reservations, and will need to be reserved again.
  /// Reverts if enabling or disabling nodes too close before next epoch start, as set by EarthfastRegistry gracePeriod.
  function setNodeDisabled(bytes32 operatorId, bytes32[] memory nodeIds, bool[] memory disabled)
  public virtual onlyOperator(operatorId) whenNotReconciling whenNotPaused {
    EarthfastNodesImpl.setNodeDisabledImpl(_registry, _nodes, operatorId, nodeIds, disabled);
  }

  /// @notice Returns the node associated to an ID
  /// @dev Reverts if the id is unknown
  function getNode(bytes32 nodeId)
  public virtual view returns (EarthfastNode memory) {
    EarthfastNode storage node = _nodes[nodeId];
    require(node.id != 0, "unknown node");
    return node;
  }

  /// @notice Returns the number of nodes for the operator or total count of nodes if operatorIdOrZero is 0
  /// @param operatorIdOrZero Unique identifier of the operator or 0 for all nodes
  /// @return count Count of nodes
  function getNodeCount(bytes32 operatorIdOrZero)
  public virtual view returns (uint256 count) {
    EnumerableSet.Bytes32Set storage nodeIds = operatorIdOrZero == 0 ?
      getNodeIdsRef() : getOperatorNodeIdsRef()[operatorIdOrZero];
    return nodeIds.length();
  }

  /// @notice Returns all nodes for the operator or all nodes if operatorIdOrZero is 0
  /// @dev Truncates the results if skip or size are out of bounds
  function getNodes(bytes32 operatorIdOrZero, uint256 skip, uint256 size)
  public virtual view returns (EarthfastNode[] memory values) {
    EnumerableSet.Bytes32Set storage nodeIds = operatorIdOrZero == 0 ?
      getNodeIdsRef() : getOperatorNodeIdsRef()[operatorIdOrZero];
    uint256 length = nodeIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    values = new EarthfastNode[](n);
    for (uint256 i = 0; i < n; i++) {
      values[i] = _nodes[nodeIds.at(skip + i)];
    }
  }

  // Reserve storage for future upgrades
  uint256[10] private __gap;

}
