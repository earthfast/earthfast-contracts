// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Test }   from "@std/Test.sol";

contract TestBase is Test {

  /*****************/
  /*** Modifiers ***/
  /*****************/

  modifier useCurrentBlock() {
      vm.roll(currentBlock);

      _;

      setCurrentBlock(block.number);
  }

  /***************************/
  /**** Utility Functions ****/
  /***************************/

  function setCurrentBlock(uint256 currentBlock_) public {
      currentBlock = currentBlock_;
  }

  function getDiff(uint256 x, uint256 y) internal pure returns (uint256 diff) {
      diff = x > y ? x - y : y - x;
  }

  function requireWithinDiff(uint256 x, uint256 y, uint256 expectedDiff, string memory err) internal pure {
      require(getDiff(x, y) <= expectedDiff, err);
  }
}
