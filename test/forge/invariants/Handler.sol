// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Handler {

  // Mapping to track number of calls made to a method
  mapping(bytes32 => uint256) public numberOfCalls;

  constructor() {
    
  }

}
