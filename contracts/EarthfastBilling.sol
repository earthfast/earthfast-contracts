// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./EarthfastNodes.sol";
import "./EarthfastProjects.sol";
import "./EarthfastRegistry.sol";
import "./EarthfastReservations.sol";
import "./EarthfastTypes.sol";

/// @title Entry point for managing node reservations by projects
contract EarthfastBilling is AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  EarthfastRegistry private _registry;

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

  modifier whenReconciling() {
    _registry.requireReconciling();
    _;
  }

  /// @dev Called once to set up the contract. Not called during proxy upgrades.
  function initialize(address[] calldata admins, EarthfastRegistry registry)
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
  function unsafeSetRegistry(EarthfastRegistry registry) public virtual onlyAdmin { _registry = registry; }

  function pause() public virtual onlyAdmin { _pause(); }
  function unpause() public virtual onlyAdmin { _unpause(); }

  function getRegistry() public virtual view returns (EarthfastRegistry) { return _registry; }
  function getBillingNodeIndex() public virtual view returns (uint256) { return _billingNodeIndex; }
  function getRenewalNodeIndex() public virtual view returns (uint256) { return _renewalNodeIndex; }
  function setBillingNodeIndexImpl(uint256 index) public virtual onlyImpl { _billingNodeIndex = index; }
  function setRenewalNodeIndexImpl(uint256 index) public virtual onlyImpl { _renewalNodeIndex = index; }

  /// @notice Called to disburse escrow payments to operators.
  /// @dev This must be called sequentially and fully, for all the nodes in the network.
  /// @dev See EarthfastRegistry.advanceEpoch() for more details about reconciliation process.
  /// @param nodeIds Content nodes being reported
  /// @param uptimeBips Uptime of corresponding content node in basis points (1 is 0.01%)
  /// @dev Note that uptimeBips is ignored (forced to 100%) if RECONCILER_ROLE is granted to zero address.
  function processBilling(bytes32[] memory nodeIds, uint256[] memory uptimeBips)
  public virtual whenReconciling whenNotPaused {
    EarthfastNodes allNodes = _registry.getNodes();
    EarthfastProjects projects = _registry.getProjects();
    EarthfastOperators operators = _registry.getOperators();
    require(_renewalNodeIndex == 0, "renewal in progress");
    require(_billingNodeIndex < allNodes.getNodeCount(0), "billing finished");
    uint256 lastEpochStart = _registry.getLastEpochStart();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      EarthfastNode[] memory nodeCopy0 = allNodes.getNodes(0, _billingNodeIndex++, 1);
      EarthfastNode memory nodeCopy = allNodes.getNode(nodeIds[i]);
      require(nodeCopy.id == nodeCopy0[0].id, "order mismatch");
      require(uptimeBips[i] <= 10000, "invalid uptime");

      if (nodeCopy.nodeType == EARTHFAST_NODE_SHARED) {
        processSharedNodeBilling(projects, operators, nodeCopy, lastEpochStart);
      } else if (nodeCopy.projectIds[EARTHFAST_LAST_EPOCH] != 0) {
        processDedicatedNodeBilling(projects, operators, nodeCopy, lastEpochStart);
      }
    }
  }

  function processSharedNodeBilling(
    EarthfastProjects projects,
    EarthfastOperators operators,
    EarthfastNode memory nodeCopy,
    uint256 lastEpochStart
  ) internal {
    bytes32[] memory projectIds = _registry.getNodes().getNodeShares(nodeCopy.id);
    uint256 uptimeBip = 10000;

    for (uint256 j = 0; j < projectIds.length; j++) {
      bytes32 projectId = projectIds[j];
      if (projectId != 0) {
        uint256 sharePrice = _registry.getNodes().getNodeSharePrice(nodeCopy.id, projectId, EARTHFAST_LAST_EPOCH);
        uint256 sharePayout = sharePrice * uptimeBip / 10000;

        projects.setProjectEscrowImpl(projectId, sharePayout, 0);
        projects.setProjectReserveImpl(projectId, sharePrice, 0);
        operators.setOperatorBalanceImpl(nodeCopy.operatorId, 0, sharePayout);
        emit ReservationResolved(
          nodeCopy.id,
          nodeCopy.operatorId,
          projectId,
          sharePrice,
          uptimeBip,
          sharePayout,
          lastEpochStart
        );
      }
    }
  }

  function processDedicatedNodeBilling(
    EarthfastProjects projects,
    EarthfastOperators operators,
    EarthfastNode memory nodeCopy,
    uint256 lastEpochStart
  ) internal {
    bytes32 projectId = nodeCopy.projectIds[EARTHFAST_LAST_EPOCH];
    uint256 uptimeBip = 10000;
    uint256 price = nodeCopy.prices[EARTHFAST_LAST_EPOCH];
    uint256 payout = price * uptimeBip / 10000;

    projects.setProjectEscrowImpl(projectId, payout, 0);
    projects.setProjectReserveImpl(projectId, price, 0);
    operators.setOperatorBalanceImpl(nodeCopy.operatorId, 0, payout);
    
    emit ReservationResolved(
      nodeCopy.id,
      nodeCopy.operatorId,
      projectId,
      price,
      uptimeBip,
      payout,
      lastEpochStart
    );

    if (nodeCopy.projectIds[EARTHFAST_NEXT_EPOCH] != projectId) {
      assert(_registry.getReservations().removeProjectNodeIdImpl(projectId, nodeCopy.id));
    }
  }

  /// @notice Called to roll over reservations between epochs.
  /// @dev This must be called sequentially and fully, for all the nodes in the network.
  /// @dev See EarthfastRegistry.advanceEpoch() for more details about reconciliation process.
  /// @param nodeIds Content nodes being reported
  function processRenewal(bytes32[] memory nodeIds)
  public virtual whenReconciling whenNotPaused {
    EarthfastNodes allNodes = _registry.getNodes();
    EarthfastProjects projects = _registry.getProjects();
    require(_billingNodeIndex == allNodes.getNodeCount(0), "billing in progress");
    require(_renewalNodeIndex < allNodes.getNodeCount(0), "renewal finished");
    bool epochLengthChanged = _registry.getNextEpochLength() != _registry.getCuedEpochLength();
    for (uint256 i = 0; i < nodeIds.length; i++) {
      allNodes.advanceNodeEpochImpl(nodeIds[i]);
      EarthfastNode[] memory nodeCopy0 = allNodes.getNodes(0, _renewalNodeIndex++, 1);
      EarthfastNode memory nodeCopy = allNodes.getNode(nodeIds[i]);
      require(nodeCopy.id == nodeCopy0[0].id, "order mismatch");
      if (nodeCopy.projectIds[EARTHFAST_NEXT_EPOCH] != 0) {
        bytes32 projectId = nodeCopy.projectIds[EARTHFAST_NEXT_EPOCH];
        uint256 nextPrice = nodeCopy.prices[EARTHFAST_NEXT_EPOCH];
        if (epochLengthChanged) {
          nextPrice /= _registry.getNextEpochLength();
          nextPrice *= _registry.getCuedEpochLength();
          allNodes.setNodePriceImpl(nodeCopy.id, EARTHFAST_NEXT_EPOCH, nextPrice);
        }
        projects.setProjectReserveImpl(projectId, 0, nextPrice);
        EarthfastProject memory projectCopy = projects.getProject(projectId);
        if (projectCopy.escrow < projectCopy.reserve) {
          allNodes.setNodeProjectImpl(nodeCopy.id, EARTHFAST_NEXT_EPOCH, 0);
          projects.setProjectReserveImpl(projectId, nextPrice, 0);
          emit ReservationCanceled(nodeCopy.id, nodeCopy.operatorId, projectId, nodeCopy.prices[EARTHFAST_LAST_EPOCH]);
        }
      }
    }
  }

  // Reserve storage for future upgrades
  uint256[10] private __gap;

}
