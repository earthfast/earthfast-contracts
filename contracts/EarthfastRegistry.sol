// SPDX-License-Identifier: UNLICENSED
// solhint-disable not-rely-on-time
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "./EarthfastBilling.sol";
import "./EarthfastNodes.sol";
import "./EarthfastOperators.sol";
import "./EarthfastProjects.sol";
import "./EarthfastReservations.sol";
import "./EarthfastToken.sol";

/// @title Main entry point for the core contracts and functionality
contract EarthfastRegistry is AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {

  string private _version;          // Interpreted by the node software, used for automatic upgrading of the nodes
  uint256 private _nonce;           // Auto-incremented value used for generating unique ids
  uint256 private _lastEpochStart;  // Timestamp of the last epoch start in seconds since 1/1/1970 midnight UTC
  uint256 private _lastEpochLength; // Duration of the last epoch in seconds
  uint256 private _nextEpochLength; // Duration of the next epoch in seconds
  uint256 private _cuedEpochLength; // Pending change of the epoch duration, becomes effective after the next epoch
  uint256 private _gracePeriod;     // Period in seconds at the end of the epoch when node prices can't change

  ERC20Permit private _usdc;
  EarthfastToken private _token;
  EarthfastBilling private _billing;
  EarthfastNodes private _nodes;
  EarthfastOperators private _operators;
  EarthfastProjects private _projects;
  EarthfastReservations private _reservations;

  event EpochAdvanced(uint256 epochStart);

  modifier onlyImpl {
    require(
      msg.sender == address(_nodes) ||
      msg.sender == address(_operators) ||
      msg.sender == address(_projects) ||
      msg.sender == address(_reservations),
      "not impl");
    _;
  }

  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    _;
  }

  modifier whenReconciling() {
    requireReconciling();
    _;
  }

  /// @dev Called once to set up the contract. Not called during proxy upgrades.
  function initialize(address[] calldata admins, EarthfastRegistryInitializeData calldata data)
  public initializer {
    __Context_init();
    __ERC165_init();
    __ERC1967Upgrade_init();
    __AccessControl_init();
    __Pausable_init();
    __ReentrancyGuard_init();
    __UUPSUpgradeable_init();

    require(data.usdc != data.token, "reused token");
    require(data.epochStart <= block.timestamp, "late epoch start");
    require(data.lastEpochLength != 0, "zero last epoch length");
    require(data.nextEpochLength != 0, "zero next epoch length");

    _version = data.version;
    _nonce = data.nonce;
    _lastEpochStart = data.epochStart;
    _lastEpochLength = data.lastEpochLength;
    _nextEpochLength = data.nextEpochLength;
    _cuedEpochLength = data.nextEpochLength;
    _gracePeriod = data.gracePeriod;

    _usdc = data.usdc;
    _token = data.token;
    _billing = data.billing;
    _nodes = data.nodes;
    _operators = data.operators;
    _projects = data.projects;
    _reservations = data.reservations;

    require(admins.length > 0, "no admins");
    for (uint256 i = 0; i < admins.length; ++i) {
      require(admins[i] != address(0), "zero admin");
      _grantRole(DEFAULT_ADMIN_ROLE, admins[i]);
    }

    if (address(_operators) != address(0)) {
      _usdc.approve(address(_operators), type(uint256).max);
      _token.approve(address(_operators), type(uint256).max);
    }
    if (address(_projects) != address(0)) {
      _usdc.approve(address(_projects), type(uint256).max);
    }
  }

  /// @dev Reverts if proxy upgrade of this contract by msg.sender is not allowed
  function _authorizeUpgrade(address) internal virtual override onlyAdmin {}

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetUSDC(ERC20Permit usdc) public virtual onlyAdmin {
    require(usdc != _token, "reused token");
    if (address(_operators) != address(0)) {
      _usdc.approve(address(_operators), 0);
      usdc.approve(address(_operators), type(uint256).max);
    }
    if (address(_projects) != address(0)) {
      _usdc.approve(address(_projects), 0);
      usdc.approve(address(_projects), type(uint256).max);
    }
    _usdc = usdc;
  }

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetToken(EarthfastToken token) public virtual onlyAdmin {
    require(token != _usdc, "reused token");
    if (address(_operators) != address(0)) {
      _token.approve(address(_operators), 0);
      token.approve(address(_operators), type(uint256).max);
    }
    _token = token;
  }

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetOperators(EarthfastOperators operators) public virtual onlyAdmin {
    if (address(_operators) != address(0)) {
      _usdc.approve(address(_operators), 0);
      _token.approve(address(_operators), 0);
    }
    if (address(operators) != address(0)) {
      _usdc.approve(address(operators), type(uint256).max);
      _token.approve(address(operators), type(uint256).max);
    }
    _operators = operators;
  }

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetProjects(EarthfastProjects projects) public virtual onlyAdmin {
    if (address(_projects) != address(0)) {
      _usdc.approve(address(_projects), 0);
    }
    if (address(projects) != address(0)) {
      _usdc.approve(address(projects), type(uint256).max);
    }
    _projects = projects;
  }

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetBilling(EarthfastBilling billing) public virtual onlyAdmin { _billing = billing; }
  function unsafeSetNodes(EarthfastNodes nodes) public virtual onlyAdmin { _nodes = nodes; }
  function unsafeSetReservations(EarthfastReservations reservations) public virtual onlyAdmin { _reservations = reservations; }

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  /// @dev One can unsafe-deposit funds to this contract directly by token.transfer().
  function unsafeWithdrawUSDC(address to, uint256 amount) public onlyAdmin { _usdc.transfer(to, amount); }
  function unsafeWithdrawToken(address to, uint256 amount) public onlyAdmin { _token.transfer(to, amount); }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getVersion() public virtual view returns (string memory) { return _version; }
  function setVersion(string calldata version) public virtual onlyAdmin { _version = version; }

  function getNonce() public virtual view returns (uint256) { return _nonce; }
  function newNonceImpl() public virtual onlyImpl returns (uint256) { return _nonce++; }

  function getUSDC() public virtual view returns (ERC20Permit) { return _usdc; }
  function getToken() public virtual view returns (EarthfastToken) { return _token; }
  function getBilling() public virtual view returns (EarthfastBilling) { return _billing; }
  function getNodes() public virtual view returns (EarthfastNodes) { return _nodes; }
  function getOperators() public virtual view returns (EarthfastOperators) { return _operators; }
  function getProjects() public virtual view returns (EarthfastProjects) { return _projects; }
  function getReservations() public virtual view returns (EarthfastReservations) { return _reservations; }

  function getLastEpochStart() public virtual view returns (uint256) { return _lastEpochStart; }
  function unsafeSetLastEpochStart(uint256 start) public virtual onlyAdmin { _lastEpochStart = start; } // Used by tests
  function getLastEpochLength() public virtual view returns (uint256) { return _lastEpochLength; }
  function getNextEpochLength() public virtual view returns (uint256) { return _nextEpochLength; }
  function getCuedEpochLength() public virtual view returns (uint256) { return _cuedEpochLength; }
  function setCuedEpochLength(uint256 length) public virtual onlyAdmin { _cuedEpochLength = length; }

  /// @return Number of seconds left in the current epoch
  function getEpochRemainder() public virtual view returns (uint256) {
    uint256 epochEnd = _lastEpochStart + _lastEpochLength;
    return epochEnd > block.timestamp ? epochEnd - block.timestamp : 0;
  }

  function getGracePeriod() public virtual view returns (uint256) { return _gracePeriod; }
  function setGracePeriod(uint256 period) public virtual onlyAdmin { _gracePeriod = period; }

  function requireReconciling() public virtual {
    require(block.timestamp >= _lastEpochStart + _lastEpochLength, "not reconciling");
  }

  function requireNotReconciling() public virtual {
    require(block.timestamp < _lastEpochStart + _lastEpochLength, "reconciling");
  }

  function requireNotGracePeriod() public virtual {
    require(block.timestamp + _gracePeriod < _lastEpochStart + _lastEpochLength, "grace period");
  }

  /// @notice Called to finish epoch reconciliation and unfreeze the network state.
  ///
  /// The core contracts automatically enter reconciliation mode when the last epoch ends. During reconciliation,
  /// the operations that change contract state, such as node pricing or reservations, are disallowed and will revert.
  /// The leader topology node is expected to call processBilling(), processRenewal(), and advanceEpoch() in this
  /// order, to execute reconcilication. Calling advanceEpoch() completes reconciliation and unfreezes the contracts.
  /// The reconciliation process should normally only take a few blocks.
  function advanceEpoch() public virtual whenReconciling whenNotPaused {
    uint256 nodeCount = _nodes.getNodeCount(0, false);
    require(_billing.getBillingNodeIndex() == nodeCount, "billing in progress");
    require(_billing.getRenewalNodeIndex() == nodeCount, "renewal in progress");
    _billing.setBillingNodeIndexImpl(0);
    _billing.setRenewalNodeIndexImpl(0);
    _lastEpochStart += _lastEpochLength;
    _lastEpochLength = _nextEpochLength;
    _nextEpochLength = _cuedEpochLength;
    emit EpochAdvanced(_lastEpochStart);
  }

  // Reserve storage for future upgrades
  uint256[10] private __gap;

}
