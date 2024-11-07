// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./EarthfastNodes.sol";

/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract EarthfastNodesV2 is EarthfastNodes {
  uint256 private _test;

  function getTest() public virtual view returns (uint256) { return _test; }
  function setTest(uint256 newTest) public virtual { _test = newTest; }
}
