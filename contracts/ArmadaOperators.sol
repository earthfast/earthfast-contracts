// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "./ArmadaNodes.sol";
import "./ArmadaProjects.sol";
import "./ArmadaRegistry.sol";
import "./ArmadaReservations.sol";
import "./ArmadaTypes.sol";

/// @title Entry point for managing network node operators
contract ArmadaOperators is AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // Controls who can do data import during contract initialization
  bytes32 public constant IMPORTER_ROLE = keccak256("IMPORTER_ROLE");

  ArmadaRegistry private _registry;
  uint256 private _stakePerNode; // Required stake to run one content node on the network

  mapping(bytes32 => ArmadaOperator) private _operators;
  EnumerableSet.Bytes32Set private _operatorIds;

  event OperatorCreated(bytes32 indexed operatorId, address indexed owner, string name, string email);
  event OperatorDeleted(bytes32 indexed operatorId, address indexed owner, string name, string email);
  event OperatorOwnerChanged(bytes32 indexed operatorId, address indexed oldOwner, address indexed newOwner);
  event OperatorPropsChanged(bytes32 indexed operatorId, string oldName, string oldEmail, string newName, string newEmail);
  event OperatorStakeChanged(bytes32 indexed operatorId, uint256 oldStake, uint256 newStake);
  event OperatorBalanceChanged(bytes32 indexed operatorId, uint256 oldBalance, uint256 newBalance);

  modifier onlyImpl {
    require(
      msg.sender == address(_registry.getBilling()) ||
      msg.sender == address(_registry.getNodes()) ||
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
    ArmadaOperator storage operator = _operators[operatorId];
    require(operator.id != 0, "unknown operator");
    require(msg.sender == operator.owner, "not operator");
    _;
  }

  modifier onlyAdminOrOperator(bytes32 operatorId) {
    ArmadaOperator storage operator = _operators[operatorId];
    require(operator.id != 0, "unknown operator");
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
      msg.sender == operator.owner, "not admin or operator");
    _;
  }

  modifier whenNotReconciling() {
    _registry.requireNotReconciling();
    _;
  }

  function requireTopologyNode(bytes32 nodeId, address sender) public virtual {
    ArmadaNodes nodes = _registry.getNodes();
    ArmadaNode memory nodeCopy = nodes.getNode(nodeId);
    require(nodeCopy.topology, "not topology node");
    ArmadaOperator storage operator = _operators[nodeCopy.operatorId];
    assert(operator.id != 0); // Impossible because of getNode()
    require(sender != address(0), "zero sender");
    require(operator.owner == sender, "not operator");
  }

  /// @dev Called once to set up the contract. Not called during proxy upgrades.
  ///
  /// @param grantImporterRole allows the contract deployer to import initial data into
  /// the contract using unsafeImport* functions, which is used for proxy-less upgrades.
  /// CAUTION: Once import is finished, the importer role should be explicitly revoked.
  function initialize(address[] calldata admins, ArmadaRegistry registry, uint256 stakePerNode, bool grantImporterRole)
  public initializer {
    __Context_init();
    __ERC165_init();
    __ERC1967Upgrade_init();
    __AccessControl_init();
    __Pausable_init();
    __ReentrancyGuard_init();
    __UUPSUpgradeable_init();

    _registry = registry;
    _stakePerNode = stakePerNode;
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
  function unsafeImportData(ArmadaOperator[] calldata operators, bool revokeImporterRole)
  public onlyRole(IMPORTER_ROLE) {
    for (uint256 i = 0; i < operators.length; i++) {
      _operators[operators[i].id] = operators[i];
      require(_operatorIds.add(operators[i].id), "duplicate id");
    }
    if (revokeImporterRole) {
      _revokeRole(IMPORTER_ROLE, msg.sender);
    }
  }

  /// @dev Adjusts multiple operators balances relative to their current values.
  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetBalances(uint256 skip, uint256 size, uint256 mul, uint256 div)
  public virtual onlyAdmin {
    require(mul != 0, "zero mul");
    uint256 length = _operatorIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    for (uint256 i = 0; i < n; i++) {
      ArmadaOperator storage operator = _operators[_operatorIds.at(skip + i)];
      operator.balance = operator.balance * mul / div;
    }
  }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getRegistry() public virtual view returns (ArmadaRegistry) { return _registry; }
  function getStakePerNode() public virtual view returns (uint256) { return _stakePerNode; }
  function setStakePerNode(uint256 stake) public virtual onlyAdmin { _stakePerNode = stake; }

  function setOperatorBalanceImpl(bytes32 operatorId, uint256 decrease, uint256 increase)
  public virtual onlyImpl whenNotPaused {
    ArmadaOperator storage operator = _operators[operatorId];
    require(operator.id != 0, "unknown operator");
    operator.balance -= decrease;
    operator.balance += increase;
  }

  /// @notice Registers a new network operator. Only admin can do this.
  /// @dev Does not check name or email for validity or uniqueness
  function createOperator(address owner, string calldata name, string calldata email)
  public onlyAdmin whenNotReconciling whenNotPaused returns (bytes32 operatorId) {
    require(owner != address(0), "zero owner");
    require(bytes(name).length > 0, "empty name");
    require(bytes(name).length <= ARMADA_MAX_NAME_BYTES, "name too long");
    require(bytes(email).length <= ARMADA_MAX_EMAIL_BYTES, "email too long");
    operatorId = keccak256(abi.encodePacked(_registry.newNonceImpl()));
    _operators[operatorId] = ArmadaOperator({id: operatorId, owner: owner, name: name, email: email, stake: 0, balance: 0});
    assert(_operatorIds.add(operatorId));
    emit OperatorCreated(operatorId, owner, name, email);
  }

  /// @notice Unregisters a network operator. Reverts if operator has stake or nodes.
  function deleteOperator(bytes32 operatorId)
  public virtual onlyAdmin whenNotReconciling whenNotPaused {
    ArmadaOperator memory operatorCopy = _operators[operatorId];
    require(operatorCopy.id != 0, "unknown operator");
    ArmadaNodes nodes = _registry.getNodes();
    require(nodes.getNodeCount(operatorId, true) == 0, "operator has nodes");
    require(nodes.getNodeCount(operatorId, false) == 0, "operator has nodes");
    require(operatorCopy.stake == 0, "operator has stake");
    require(operatorCopy.balance == 0, "operator has balance");
    delete _operators[operatorId];
    assert(_operatorIds.remove(operatorId));
    emit OperatorDeleted(operatorId, operatorCopy.owner, operatorCopy.name, operatorCopy.email);
  }

  function setOperatorOwner(bytes32 operatorId, address owner)
  public virtual onlyAdminOrOperator(operatorId) whenNotReconciling whenNotPaused {
    require(owner != address(0), "zero owner");
    ArmadaOperator storage operator = _operators[operatorId];
    assert(operator.id != 0); // Impossible because of onlyAdminOrOperator
    address oldOwner = operator.owner;
    operator.owner = owner;
    emit OperatorOwnerChanged(operatorId, oldOwner, owner);
  }

  /// @dev Does not check name or email for validity or uniqueness
  function setOperatorProps(bytes32 operatorId, string calldata name, string calldata email)
  public virtual onlyOperator(operatorId) whenNotReconciling whenNotPaused {
    require(bytes(name).length > 0, "empty name");
    require(bytes(name).length <= ARMADA_MAX_NAME_BYTES, "name too long");
    require(bytes(email).length <= ARMADA_MAX_EMAIL_BYTES, "email too long");
    ArmadaOperator storage operator = _operators[operatorId];
    assert(operator.id != 0); // Impossible because of onlyOperator
    string memory oldName = operator.name;
    string memory oldEmail = operator.email;
    operator.name = name;
    operator.email = email;
    emit OperatorPropsChanged(operatorId, oldName, oldEmail, name, email);
  }

  /// @notice Transfers tokens into the contract and applies them toward given operator stake.
  /// @dev CAUTION: To avoid loss of funds, do NOT deposit to this contract by token.transfer().
  function depositOperatorStake(bytes32 operatorId, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
  public virtual whenNotPaused {
    ArmadaOperator storage operator = _operators[operatorId];
    require(operator.id != 0, "unknown operator");
    uint256 oldStake = operator.stake;
    operator.stake += amount;
    _registry.getToken().permit(msg.sender, address(this), amount, deadline, v, r, s);
    _registry.getToken().transferFrom(msg.sender, address(_registry), amount);
    emit OperatorStakeChanged(operatorId, oldStake, operator.stake);
  }

  /// @notice Transfers stake from contract to given recipient. Reverts if stake is locked.
  function withdrawOperatorStake(bytes32 operatorId, uint256 amount, address to)
  public virtual nonReentrant onlyOperator(operatorId) whenNotReconciling whenNotPaused {
    ArmadaOperator storage operator = _operators[operatorId];
    assert(operator.id != 0); // Impossible because of onlyOperator
    ArmadaNodes nodes = _registry.getNodes();
    uint256 lockedStake = nodes.getNodeCount(operatorId, false) * _stakePerNode;
    require(operator.stake - amount >= lockedStake, "not enough stake");
    uint256 oldStake = operator.stake;
    operator.stake -= amount;
    _registry.getToken().transferFrom(address(_registry), to, amount);
    emit OperatorStakeChanged(operatorId, oldStake, operator.stake);
  }

  /// @notice Transfers USDC into the contract and applies them toward given operator balance.
  /// @dev CAUTION: To avoid loss of funds, do NOT deposit to this contract by token.transfer().
  function depositOperatorBalance(bytes32 operatorId, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
  public virtual whenNotPaused {
    ArmadaOperator storage operator = _operators[operatorId];
    require(operator.id != 0, "unknown operator");
    uint256 oldBalance = operator.balance;
    operator.balance += amount;
    _registry.getUSDC().permit(msg.sender, address(this), amount, deadline, v, r, s);
    _registry.getUSDC().transferFrom(msg.sender, address(_registry), amount);
    emit OperatorBalanceChanged(operatorId, oldBalance, operator.balance);
  }

  /// @notice Transfers earned USDC from contract to given recipient.
  function withdrawOperatorBalance(bytes32 operatorId, uint256 amount, address to)
  public virtual nonReentrant onlyOperator(operatorId) whenNotReconciling whenNotPaused {
    ArmadaOperator storage operator = _operators[operatorId];
    assert(operator.id != 0); // Impossible because of onlyOperator
    require(operator.balance >= amount, "not enough balance");
    uint256 oldBalance = operator.balance;
    operator.balance -= amount;
    _registry.getUSDC().transferFrom(address(_registry), to, amount);
    emit OperatorBalanceChanged(operatorId, oldBalance, operator.balance);
  }

  /// @dev Reverts if the id is unknown
  function getOperator(bytes32 operatorId)
  public virtual view returns (ArmadaOperator memory) {
    ArmadaOperator storage operator = _operators[operatorId];
    require(operator.id != 0, "unknown operator");
    return operator;
  }

  function getOperatorCount()
  public virtual view returns (uint256) {
    return _operatorIds.length();
  }

  /// @dev Truncates the results if skip or size are out of bounds
  function getOperators(uint256 skip, uint256 size)
  public virtual view returns (ArmadaOperator[] memory values) {
    uint256 length = _operatorIds.length();
    uint256 n = Math.min(size, length > skip ? length - skip : 0);
    values = new ArmadaOperator[](n);
    for (uint256 i = 0; i < n; i++) {
      values[i] = _operators[_operatorIds.at(skip + i)];
    }
  }
}
