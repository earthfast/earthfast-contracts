// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { TestBase } from "./TestBase.sol";
import { GovernorHandler } from "./GovernorHandler.sol";

import { IVotes } from "@oz/governance/utils/IVotes.sol";

import { ArmadaGovernor } from "../../../contracts/ArmadaGovernor.sol";
import { ArmadaToken } from "../../../contracts/ArmadaToken.sol";
import { ArmadaTimelock } from "../../../contracts/ArmadaTimelock.sol";

contract GovernorTestBase is TestBase {

  GovernorHandler internal _governorHandler;
  address internal _governor;
  address internal _token;

  ArmadaGovernor internal _armadaGovernor;
  ArmadaTimelock internal _armadaTimelock;
  ArmadaToken internal _armadaToken;

  // TODO: change these to a single address?
  address internal _admin;
  address internal _minter;
  address internal _pauser;

  function setUp() public {

    // TODO: convert roles to mock contracts?
    // generate roles and deploy armada token
    address[] memory adminRole = new address[](1);
    address[] memory minterRole = new address[](1);
    address[] memory pauserRole = new address[](1);
    _admin = makeAddr("admin");
    _minter = makeAddr("minter");
    _pauser = makeAddr("pauser");
    adminRole[0] = _admin;
    minterRole[0] = _minter;
    pauserRole[0] = _pauser;
    _deployArmadaToken(adminRole, minterRole, pauserRole);

    // deploy governance contracts

    // instantiate handlers
    _governorHandler = new GovernorHandler(_governor, _token);

    // target governance handler
    targetContract(address(_governorHandler));

  }

  // TODO: point at test lib fixtures -> via environment variables
  function _deployArmadaToken(
    address[] memory admins_,
    address[] memory minters_,
    address[] memory pausers_
  ) internal {
    _armadaToken = new ArmadaToken("Armada", "ARMADA", admins_, minters_, pausers_);
  }

  function _deployGovernanceContracts(address[] memory admins_) internal {
    vm.startPrank(admins_[0]);

    // TODO: determine correct vales
    uint256 votingDelay = 2 days;
    uint256 votingPeriod = 3 days;
    uint256 proposalThreshold = 1000;
    uint256 quorumNumerator = 1000;

    // deploy timelock
    // default timelock to only having an admin
    address[] memory proposers = new address[](1);
    address[] memory executors = new address[](1);
    proposers[0] = address(0);
    executors[0] = address(0);
    _armadaTimelock = new ArmadaTimelock(votingDelay, admins_, proposers, executors);

    // TODO: fix IVotes reference... need to point the remappings at the node_modules
    // deploy governor
    IVotes token = IVotes(address(_armadaToken));
    _armadaGovernor = new ArmadaGovernor(admins_[0], token, _armadaTimelock, votingDelay, votingPeriod, proposalThreshold, quorumNumerator);


  }

}
