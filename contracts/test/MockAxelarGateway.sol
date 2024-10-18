// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title MockAxelarGateway
/// @dev This is a mock contract for testing purposes that simulates the behavior of AxelarGateway.
contract MockAxelarGateway {

  /// @notice Simulates the cross-chain contract call
  /// @param destinationChain The chain the contract call is destined for
  /// @param destinationContract The contract address on the destination chain
  /// @param payload The data payload sent to the destination contract
      function callContract(
      string memory destinationChain,
      string memory destinationContract,
      bytes memory payload
  ) external pure {}
}
