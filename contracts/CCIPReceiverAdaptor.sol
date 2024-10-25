// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

import "./ArmadaBilling.sol";
import "./ArmadaNodes.sol";
import "./ArmadaProjects.sol";
import "./ArmadaRegistry.sol";
import "./ArmadaReservations.sol";
import { ArmadaCreateProjectData } from "./ArmadaTypes.sol";

// TODO: remove this, for debugging
import "hardhat/console.sol";

// TODO: how do we handle project owner in a cross-chain environment?
contract CCIPReceiverAdaptor is CCIPReceiver {

  // store messages in a mapping
  // messageId -> CCArmadaMessage
  mapping(bytes32 => CCArmadaMessage) public messages;

  ArmadaNodes immutable nodes;
  ArmadaProjects immutable projects;
  ArmadaRegistry immutable registry;
  ArmadaReservations immutable reservations;

  // TODO: move this to a shared library
  struct CCArmadaMessage {
      address contractAddress; // the address of the contract to be called
      bytes32 functionSelector; // the function selector to be called
      bytes data; // the data to be sent to the contract
  }

  event MessageReceived(
      bytes32 latestMessageId
  );

  constructor(
    address router,
    address nodes_,
    address projects_,
    address registry_,
    address reservations_
  ) CCIPReceiver(router) {
    nodes = ArmadaNodes(nodes_);
    projects = ArmadaProjects(projects_);
    registry = ArmadaRegistry(registry_);
    reservations = ArmadaReservations(reservations_);
  }

  // TODO: store messageId along with the message in the mapping?
  function _ccipReceive(
      Client.Any2EVMMessage memory message
  ) internal override {
    CCArmadaMessage memory decodedMessage = abi.decode(message.data, (CCArmadaMessage));
    address contractAddress = decodedMessage.contractAddress;
    bytes32 functionSelector = decodedMessage.functionSelector;
    bytes memory data = decodedMessage.data;

    console.logBytes(abi.encode(message.messageId));

    // call the contract
    _callContract(contractAddress, data);

  }

  function _callContract(address contractAddress,bytes memory data) internal {
    (bool success, bytes memory returnData) = contractAddress.call(data);
    if (!success) {
      if (returnData.length > 0) {
        // Bubble up the error message
        assembly {
            let returnDataSize := mload(returnData)
            revert(add(32, returnData), returnDataSize)
        }
      } else {
          revert("Function call failed");
      }
    }
  }

}