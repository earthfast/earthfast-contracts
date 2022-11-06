// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract ArmadaGovernor is AccessControl, GovernorSettings, GovernorCountingSimple, GovernorVotesQuorumFraction, GovernorTimelockControl {
  constructor(address admin, IVotes token, TimelockController timelock, uint256 votingDelay, uint256 votingPeriod,
    uint256 proposalThreshold_, uint256 quorumNumerator)
    Governor("Armada")
    GovernorSettings(votingDelay, votingPeriod, proposalThreshold_)
    GovernorVotes(token)
    GovernorVotesQuorumFraction(quorumNumerator)
    GovernorTimelockControl(timelock) {
    if (admin != address(0)) {
      _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }
  }

  function cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
  public onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256) {
    return _cancel(targets, values, calldatas, descriptionHash);
  }

  // The following functions are overrides required by Solidity.

  function proposalThreshold()
  public view override(Governor, GovernorSettings) returns (uint256) {
    return super.proposalThreshold();
  }

  function supportsInterface(bytes4 interfaceId)
  public view override(AccessControl, Governor, GovernorTimelockControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function state(uint256 proposalId)
  public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
    return super.state(proposalId);
  }

  function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
  internal override(Governor, GovernorTimelockControl) {
    super._execute(proposalId, targets, values, calldatas, descriptionHash);
  }

  function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
  internal override(Governor, GovernorTimelockControl) returns (uint256) {
    return super._cancel(targets, values, calldatas, descriptionHash);
  }

  function _executor()
  internal view override(Governor, GovernorTimelockControl) returns (address) {
    return super._executor();
  }
}
