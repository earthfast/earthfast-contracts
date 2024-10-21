// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

import "./ArmadaBilling.sol";
import "./ArmadaNodes.sol";
import "./ArmadaProjects.sol";
import "./ArmadaRegistry.sol";
import "./ArmadaReservations.sol";
import "./ArmadaTypes.sol";


// TODO: how do we determine project owner in a cross-chain environment?
// TODO: how do we determine which message type to use? -> Create custom struct with two fields: messageType and data

contract CCIPReceiverAdaptor {

  ArmadaNodes immutable nodes;
  ArmadaProjects immutable projects;
  ArmadaRegistry immutable registry;
  ArmadaReservations immutable reservations;

  constructor(address router, address nodes_, address projects_, address registry_, address reservations_) CCIPReceiver(router) {
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
    // TODO: determine how to switch between message types
    // decode message and call the appropriate function
    ArmadaTypes.ArmadaCreateProjectData createProjetMessage = abi.decode(message.data, (ArmadaTypes.ArmadaCreateProjectData));
    (bool success, ) = address(nft).call(message.data);
    require(success);

    // TODO: add message specific events
    // emit MintCallSuccessfull();
  }

}
