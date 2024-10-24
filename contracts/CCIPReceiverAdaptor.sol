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

// TODO: how do we determine project owner in a cross-chain environment?
// TODO: how do we determine which message type to use? -> Create custom struct with two fields: messageType and data

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

  // 
  // Projects.createProject
  // Projects.depositProjectEscrow
  // Projects.withdrawProjectEscrow
  // Projects.setProjectContent
  // Reservations.createReservations
  // Reservations.deleteReservations

  function _ccipReceive(
      Client.Any2EVMMessage memory message
  ) internal override {
    CCArmadaMessage memory decodedMessage = abi.decode(message.data, (CCArmadaMessage));
    address contractAddress = decodedMessage.contractAddress;
    bytes32 functionSelector = decodedMessage.functionSelector;
    bytes memory data = decodedMessage.data;

    // Decode the ArmadaCreateProjectData struct
    (string memory name, address owner, string memory email, string memory content, bytes32 checksum, string memory metadata) = abi.decode(data, (string, address, string, string, bytes32, string));
    ArmadaCreateProjectData memory projectData = ArmadaCreateProjectData({
        name: name,
        owner: owner,
        email: email,
        content: content,
        checksum: checksum,
        metadata: metadata
    });
    console.log("project owner:", projectData.owner);
    console.logBytes(abi.encode(message.messageId));
  
    // // store the message in the mapping
    // messages[message.messageId] = decodedMessage;

    // // emit the event
    // emit MessageReceived(message.messageId);

    // Call the createProject function
    try projects.createProject(projectData) returns (bytes32 projectId) {
        console.log("Project created successfully with ID:");
        console.logBytes(abi.encode(projectId));
    } catch Error(string memory reason) {
        console.log("createProject failed with reason:", reason);
        revert(string(abi.encodePacked("createProject failed: ", reason)));
    }  catch Panic(uint errorCode) {
        console.log("createProject failed with panic code:", errorCode);
        string memory panicReason = getPanicReason(errorCode);
        revert(string(abi.encodePacked("createProject failed with panic: ", panicReason)));
    } catch (bytes memory lowLevelData) {
        console.log("createProject failed due to low-level error");
        console.logBytes(lowLevelData);
        if (lowLevelData.length > 4) {
            bytes4 errorSelector = bytes4(lowLevelData);
            console.log("Error selector:");
            console.logBytes4(errorSelector);
        }
        revert("createProject failed due to low-level error");
    }

    // ArmadaCreateProjectData memory projectData = abi.decode(data, (ArmadaCreateProjectData));
    // console.log("project owner:", projectData.owner);


    // // TODO: also check contract address against projects contract address in constructor
    // // Decode the data based on the function selector
    // if (functionSelector == bytes4(keccak256("createProject(ArmadaCreateProjectData)"))) {
    // ArmadaCreateProjectData memory projectData = abi.decode(data, (ArmadaCreateProjectData));
    // projects.createProject(projectData);
    // } else if (functionSelector == bytes4(keccak256("setProjectContent(bytes32,string,bytes32)"))) {
    //     (bytes32 projectId, string memory content, bytes32 checksum) = abi.decode(data, (bytes32, string, bytes32));
    //     projects.setProjectContent(projectId, content, checksum);
    // } else if (functionSelector == bytes4(keccak256("setProjectMetadata(bytes32,string)"))) {
    //     (bytes32 projectId, string memory metadata) = abi.decode(data, (bytes32, string));
    //     projects.setProjectMetadata(projectId, metadata);
    // } else {
    //     revert("Unknown function selector");
    // }

    // call the contract
    // _callContract(contractAddress, functionSelector, data);

  }

  function _callContract(address contractAddress, bytes32 functionSelector, bytes memory data) internal {
    (bool success, bytes memory returnData) = contractAddress.call(abi.encode(functionSelector, data));
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

  function checkProjectCreatorRole() public view returns (bool) {
      return projects.hasRole(projects.PROJECT_CREATOR_ROLE(), address(this));
  }


  function getPanicReason(uint errorCode) internal pure returns (string memory) {
      if (errorCode == 0x01) return "Assertion failed";
      if (errorCode == 0x11) return "Arithmetic operation underflowed or overflowed outside of an unchecked block";
      if (errorCode == 0x12) return "Division or modulo division by zero";
      if (errorCode == 0x21) return "Tried to convert a value into an enum outside of its range";
      if (errorCode == 0x22) return "Accessed storage byte array that is incorrectly encoded";
      if (errorCode == 0x31) return "Called .pop() on an empty array";
      if (errorCode == 0x32) return "Array index is out of bounds";
      if (errorCode == 0x41) return "Allocated too much memory or created an array which is too large";
      if (errorCode == 0x51) return "Called a zero-initialized variable of internal function type";
      return "Unknown panic code";
  }

}
