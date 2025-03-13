// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./EarthfastEntrypoint.sol";

/// @dev This contract is a modified version of EarthfastEntrypoint that adds a new function to get the version of the contract.
/// @dev It is used to test the upgradeability of the contract.
contract EarthfastEntrypointV2 is EarthfastEntrypoint {
  
  // Version identifier (added in V2)
  string public constant VERSION = "2.0.0";
  
  /// @notice Get the version of the contract (added in V2)
  /// @return The version string
  function getVersion() external pure returns (string memory) {
    return VERSION;
  }

  // Reserve storage slots for future upgrades
  uint256[9] private __gap;
}
