// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./ArmadaNodes.sol";
import "./ArmadaProjects.sol";
import "./ArmadaRegistry.sol";
import "./ArmadaReservations.sol";
import "./ArmadaTypes.sol";

/// @title Entry point for managing node reservations by projects
contract ArmadaBilling is AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  // Controls who in addition to topology nodes can reconcile the network. Grant to zero address to allow everybody.
  bytes32 public constant RECONCILER_ROLE = keccak256("RECONCILER_ROLE");

  ArmadaRegistry private _registry;

  uint256 private _billingNodeIndex; // Ensures consistency during incremental reconciliation
  uint256 private _renewalNodeIndex; // Ensures consistency during incremental reconciliation

  event ReservationCanceled(bytes32 indexed nodeId, bytes32 indexed operatorId, bytes32 indexed projectId, uint256 price);
  event ReservationResolved(bytes32 indexed nodeId, bytes32 indexed operatorId, bytes32 indexed projectId, uint256 price,
    uint256 uptime, uint256 payout, uint256 epochStart);

  modifier onlyImpl {
    require(msg.sender == address(_registry), "not impl");
    _;
  }

  modifier onlyAdmin {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "not admin");
    _;
  }

  modifier onlyReconcilerOrTopologyNode(bytes32 nodeIdOrZero) {
    if (nodeIdOrZero == 0) {
      require(
        hasRole(RECONCILER_ROLE, address(0)) ||
        hasRole(RECONCILER_ROLE, msg.sender),
        "not reconciler");
    } else {
      _registry.getOperators().requireTopologyNode(nodeIdOrZero, msg.sender);
    }
    _;
  }

  modifier whenReconciling() {
    _registry.requireReconciling();
    _;
  }

  /// @dev Called once to set up the contract. Not called during proxy upgrades.
  function initialize(address[] calldata admins, ArmadaRegistry registry)
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
  }

  /// @dev Reverts if proxy upgrade of this contract by msg.sender is not allowed
  function _authorizeUpgrade(address) internal virtual override onlyAdmin {}

  /// @dev CAUTION: This can break data consistency. Used for proxy-less upgrades.
  function unsafeSetRegistry(ArmadaRegistry registry) public virtual onlyAdmin { _registry = registry; }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getRegistry() public virtual view returns (ArmadaRegistry) { return _registry; }
  function getBillingNodeIndex() public virtual view returns (uint256) { return _billingNodeIndex; }
  function getRenewalNodeIndex() public virtual view returns (uint256) { return _renewalNodeIndex; }
  function setBillingNodeIndexImpl(uint256 index) public virtual onlyImpl { _billingNodeIndex = index; }
  function setRenewalNodeIndexImpl(uint256 index) public virtual onlyImpl { _renewalNodeIndex = index; }

  /// @notice Called by the leader topology node to disburse escrow payments to operators.
  /// @dev This must be called sequentially and fully, for all the nodes in the network.
  /// @dev See ArmadaRegistry.advanceEpoch() for more details about reconciliation process.
  /// @param topologyNodeId The topology node calling this function (zero is OK if caller has reconciler role)
  /// @param nodeIds Content nodes being reported
  /// @param uptimeBips Uptime of corresponding content node in basis points (1 is 0.01%)
  /// @dev Note that uptimeBips is ignored (forced to 100%) if RECONCILER_ROLE is granted to zero address.
  function processBilling(bytes32 topologyNodeId, bytes32[] memory nodeIds, uint256[] memory uptimeBips)
  public virtual onlyReconcilerOrTopologyNode(topologyNodeId) whenReconciling whenNotPaused {
    ArmadaNodes allNodes = _registry.getNodes();
    ArmadaProjects projects = _registry.getProjects();
    ArmadaOperators operators = _registry.getOperators();
    require(_renewalNodeIndex == 0, "renewal in progress");
    require(_billingNodeIndex < allNodes.getNodeCount(0, false), "billing finished");
    uint256 lastEpochStart = _registry.getLastEpochStart();
    bool everybody = hasRole(RECONCILER_ROLE, address(0));
    for (uint256 i = 0; i < nodeIds.length; i++) {
      ArmadaNode[] memory nodeCopy0 = allNodes.getNodes(0, false, _billingNodeIndex++, 1);
      ArmadaNode memory nodeCopy = allNodes.getNode(nodeIds[i]);
      require(nodeCopy.id == nodeCopy0[0].id, "order mismatch");
      require(uptimeBips[i] <= 10000, "invalid uptime");
      if (nodeCopy.projectIds[ARMADA_LAST_EPOCH] != 0) {
        bytes32 projectId = nodeCopy.projectIds[ARMADA_LAST_EPOCH];
        uint256 uptimeBip = everybody ? 10000 : uptimeBips[i];
        uint256 payout = nodeCopy.prices[ARMADA_LAST_EPOCH] * uptimeBip / 10000;
        projects.setProjectEscrowImpl(projectId, payout, 0);
        projects.setProjectReserveImpl(projectId, nodeCopy.prices[ARMADA_LAST_EPOCH], 0);
        operators.setOperatorBalanceImpl(nodeCopy.operatorId, 0, payout);
        emit ReservationResolved(nodeCopy.id, nodeCopy.operatorId, projectId, nodeCopy.prices[ARMADA_LAST_EPOCH],
          uptimeBip, payout, lastEpochStart);
        if (nodeCopy.projectIds[ARMADA_NEXT_EPOCH] != projectId) {
          assert(_registry.getReservations().removeProjectNodeIdImpl(projectId, nodeCopy.id));
        }
      }
    }
  }

  /// @notice Called by the leader topology node to roll over reservations between epochs.
  /// @dev This must be called sequentially and fully, for all the nodes in the network.
  /// @dev See ArmadaRegistry.advanceEpoch() for more details about reconciliation process.
  /// @param topologyNodeId The topology node calling this function (zero is OK if caller has reconciler role)
  /// @param nodeIds Content nodes being reported
  function processRenewal(bytes32 topologyNodeId, bytes32[] memory nodeIds)
  public virtual onlyReconcilerOrTopologyNode(topologyNodeId) whenReconciling whenNotPaused {
    ArmadaNodes allNodes = _registry.getNodes();
    ArmadaProjects projects = _registry.getProjects();
    require(_billingNodeIndex == allNodes.getNodeCount(0, false), "billing in progress");
    require(_renewalNodeIndex < allNodes.getNodeCount(0, false), "renewal finished");
    bool epochLengthChanged = _registry.getNextEpochLength() != _registry.getCuedEpochLength();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      allNodes.advanceNodeEpochImpl(nodeIds[i]);
      ArmadaNode[] memory nodeCopy0 = allNodes.getNodes(0, false, _renewalNodeIndex++, 1);
      ArmadaNode memory nodeCopy = allNodes.getNode(nodeIds[i]);
      require(nodeCopy.id == nodeCopy0[0].id, "order mismatch");
      if (nodeCopy.projectIds[ARMADA_NEXT_EPOCH] != 0) {
        bytes32 projectId = nodeCopy.projectIds[ARMADA_NEXT_EPOCH];
        uint256 nextPrice = nodeCopy.prices[ARMADA_NEXT_EPOCH];
        if (epochLengthChanged) {
          nextPrice /= _registry.getNextEpochLength();
          nextPrice *= _registry.getCuedEpochLength();
          allNodes.setNodePriceImpl(nodeCopy.id, ARMADA_NEXT_EPOCH, nextPrice);
        }
        projects.setProjectReserveImpl(projectId, 0, nextPrice);
        ArmadaProject memory projectCopy = projects.getProject(projectId);
        if (projectCopy.escrow < projectCopy.reserve) {
          allNodes.setNodeProjectImpl(nodeCopy.id, ARMADA_NEXT_EPOCH, 0);
          projects.setProjectReserveImpl(projectId, nextPrice, 0);
          emit ReservationCanceled(nodeCopy.id, nodeCopy.operatorId, projectId, nodeCopy.prices[ARMADA_LAST_EPOCH]);
        }
      }
    }
  }

  // Reserve storage for future upgrades
  uint256[10] private __gap;

}
