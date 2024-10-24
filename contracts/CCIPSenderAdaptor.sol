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

  // TODO: move this to a shared library
  struct CCArmadaMessage {
      address contractAddress; // the address of the contract to be called
      bytes32 functionSelector; // the function selector to be called
      bytes data; // the data to be sent to the contract
  }

  constructor(address router, address link) {
      i_router = router;
      i_link = link;
  }

  // TODO: enable passing in gas limit
  // @notice create a message to be sent to the receiving chain
  // @dev Expected to be called by the client to construct the message prior to sending
  // @param contractAddress the address of the contract to be called by the receiver
  // @param data the data to be sent to the contract
  // @param functionSignature the function signature to be called
  // @param receiver the address of the receiver on the destination chain
  // @param payFeesIn the type of fees to be paid
  // @return the encoded message in CCIP format
  function createMessage(
    address contractAddress,
    bytes calldata data,
    string calldata functionSignature,
    address receiver,
    PayFeesIn payFeesIn
  ) external view returns (Client.EVM2AnyMessage memory) {

    // set the message struct
    CCArmadaMessage memory message;
    message.contractAddress = contractAddress;
    message.functionSelector = bytes4(keccak256(bytes(functionSignature)));
    message.data = data;

    // encode the message struct
    bytes memory encodedMessage = abi.encode(message);

    // set the CCIP message struct
    Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
      receiver: abi.encode(receiver),
      data: encodedMessage,
      tokenAmounts: new Client.EVMTokenAmount[](0),
      extraArgs: Client._argsToBytes(
        Client.EVMExtraArgsV1({gasLimit: 500_000}) // Additional arguments, setting gas limit and non-strict sequency mode
      ),
      feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
    });

    return ccipMessage;
  }

  function sendMessage(
    uint64 destinationChainSelector,
    Client.EVM2AnyMessage memory message,
    PayFeesIn payFeesIn
  ) external returns (bytes32 messageId) {
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
