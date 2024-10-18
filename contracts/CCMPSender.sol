// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';


// https://www.axelar.network/blog/how-to-build-interchain-dapp-with-next-js-solidity-and-axelar
contract CCMPSender {
    IAxelarGasService public immutable gasService;
    IAxelarGateway public immutable gateway;

    constructor(address gateway_, address gasService_) {
        gateway = IAxelarGateway(gateway_);
        gasService = IAxelarGasService(gasService_);
    }

    function sendMessage(
        string calldata destinationChain,
        string calldata destinationAddress,
        bytes calldata payload
    ) external payable {
        gasService.payNativeGasForContractCall{value: msg.value} (
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );

        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    // create a struct for the message to be properly encoded and decoded on the receiving chain
    struct CCArmadaMessage {
        address contractAddress; // the address of the contract to be called
        bytes32 functionSelector; // the function selector to be called
        bytes data; // the data to be sent to the contract
    }

    // @notice create a message to be sent to the receiving chain
    // @dev Expected to be called by the client to construct the message prior to sending
    // @param contractAddress the address of the contract to be called
    // @param data the data to be sent to the contract
    // @param functionSignature the function signature to be called
    // @return the encoded message
    function createMessage(address contractAddress, bytes calldata data, string calldata functionSignature) external pure returns (bytes memory) {
        CCArmadaMessage memory message;
        message.contractAddress = contractAddress;
        message.functionSelector = bytes4(keccak256(bytes(functionSignature)));
        message.data = data;

        // encode the message struct
        return abi.encode(message);
    }

}
