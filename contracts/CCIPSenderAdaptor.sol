// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

import { ArmadaCreateProjectData } from "./ArmadaTypes.sol";

/// @title Entrypoint for messages sent from a source chain to the Earthfast contracts via CCIP.
contract CCIPSenderAdaptor {

  enum PayFeesIn {
      Native,
      LINK
  }

  address immutable i_router;
  address immutable i_link;

  event MessageSent(bytes32 messageId);

  constructor(address router, address link) {
      i_router = router;
      i_link = link;
  }

  /**
    * @notice Create a project on the Earthfast platform.
    * @dev This function is called on the source chain to create a project on the Earthfast platform.
    * @param project The data required to instantiate a new project.
    * @param destinationChainSelector The chain ID of the destination chain.
    * @param receiver The address of the earthfast destination adaptor to interact with.
   */
  function createProject(
    ArmadaCreateProjectData memory project,
    uint64 destinationChainSelector,
    address receiver,
    PayFeesIn payFeesIn
  ) external payable returns (bytes32 messageId) {
    Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
      receiver: abi.encode(receiver),
      data: abi.encodeWithSignature("createProject(ArmadaCreateProjectData)", project),
      tokenAmounts: new Client.EVMTokenAmount[](0),
      extraArgs: "",
      feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
    });

    messageId = _sendMessage(message, destinationChainSelector, payFeesIn);
  }

  function _sendMessage(
    Client.EVM2AnyMessage memory message,
    uint64 destinationChainSelector,
    PayFeesIn payFeesIn
  ) internal returns (bytes32 messageId) {
    // calculate the fee required to send and receive the message
    uint256 fee = IRouterClient(i_router).getFee(
        destinationChainSelector,
        message
    );

    if (payFeesIn == PayFeesIn.LINK) {
        LinkTokenInterface(i_link).approve(i_router, fee);
        messageId = IRouterClient(i_router).ccipSend(
            destinationChainSelector,
            message
        );
    } else {
        messageId = IRouterClient(i_router).ccipSend{value: fee}(
            destinationChainSelector,
            message
        );
    }

    emit MessageSent(messageId);
  }

  /// @notice Fallback function to receive Ether.
  receive() external payable {}
}
