// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract ArmadaTimelock is TimelockController {
  constructor(uint256 minDelay, address[] memory admins, address[] memory proposers, address[] memory executors)
    TimelockController(minDelay, proposers, executors, address(0)) {
    // Use explicit admins for CREATE2 compatibility
    _revokeRole(TIMELOCK_ADMIN_ROLE, msg.sender);
    require(admins.length > 0, "no admins");
    for (uint256 i = 0; i < admins.length; ++i) {
      require(admins[i] != address(0), "zero admin");
      _grantRole(TIMELOCK_ADMIN_ROLE, admins[i]);
    }
  }
}
