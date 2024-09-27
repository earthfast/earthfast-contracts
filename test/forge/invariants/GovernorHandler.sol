// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Handler } from "./Handler.sol";

import { ArmadaGovernor } from "../../../contracts/ArmadaGovernor.sol";
import { ArmadaToken } from "../../../contracts/ArmadaToken.sol";
import { ArmadaTimelock } from "../../../contracts/ArmadaTimelock.sol";

contract GovernorHandler is Handler {

  // TODO: rely on public variants of these variables instantiated in test base?
  ArmadaGovernor internal _governor;
  ArmadaTimelock internal _timelock;
  ArmadaToken internal _token;

  constructor(
    ArmadaGovernor governor_,
    ArmadaTimelock timelock_,
    ArmadaToken token_
  ) Handler() {
    _governor = governor_;
    _timelock = timelock_;
    _token = token_;
  }

  /*************************/
  /*** Wrapped Functions ***/
  /*************************/

  function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  ) external {
    numberOfCalls['propose']++;

    try _governor.propose(targets, values, calldatas, description) returns (uint256 proposalId) {
      // TODO: record the new proposal
    } catch Error(string memory _err) {
      // check if error is expected
      // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.5/contracts/governance/Governor.sol#L268
      bytes32 encodedError = keccak256(abi.encodePacked(_err));
      require(
        encodedError == keccak256(abi.encodePacked("Governor: proposer votes below proposal threshold")) ||
        encodedError == keccak256(abi.encodePacked("Governor: invalid proposal length")) ||
        encodedError == keccak256(abi.encodePacked("Governor: proposal already exists")) ||
        encodedError == keccak256(abi.encodePacked("Governor: empty proposal")),
        UNEXPECTED_REVERT
      );
    }
  }

  function castVote(uint256 proposalId, uint8 support) external {
    _governor.castVote(proposalId, support);
  }

  function execute(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) external {
    _governor.execute(targets, values, calldatas, descriptionHash);
  }

  /**********************************/
  /*** External Utility Functions ***/
  /**********************************/

}
