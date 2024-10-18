// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

import { ArmadaCreateProjectData } from './ArmadaTypes.sol';
import { ArmadaProjects } from './ArmadaProjects.sol';

contract CCMPReceiver is AxelarExecutable {

    ArmadaProjects public projects;

    constructor(address gateway_, address projects_) AxelarExecutable(gateway_) {
        projects = ArmadaProjects(projects_);
    }

    struct CCArmadaMessage {
        address contractAddress; // the address of the contract to be called
        bytes32 functionSelector; // the function selector to be called
        bytes data; // the data to be sent to the contract
    }

    function _execute(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        CCArmadaMessage memory message = abi.decode(payload, (CCArmadaMessage));

        address contractAddress = message.contractAddress;
        bytes32 functionSelector = message.functionSelector;
        bytes memory data = message.data;

        // TODO: also check contract address against projects contract address in constructor
        // Decode the data based on the function selector
        if (functionSelector == bytes4(keccak256("createProject(ArmadaCreateProjectData)"))) {
            ArmadaCreateProjectData memory projectData = abi.decode(data, (ArmadaCreateProjectData));
            projects.createProject(projectData);
        } else if (functionSelector == bytes4(keccak256("setProjectContent(bytes32,string,bytes32)"))) {
            (bytes32 projectId, string memory content, bytes32 checksum) = abi.decode(data, (bytes32, string, bytes32));
            projects.setProjectContent(projectId, content, checksum);
        } else if (functionSelector == bytes4(keccak256("setProjectMetadata(bytes32,string)"))) {
            (bytes32 projectId, string memory metadata) = abi.decode(data, (bytes32, string));
            projects.setProjectMetadata(projectId, metadata);
        } else {
            revert("Unknown function selector");
        }
    }

    function _callContract(address contractAddress, bytes32 functionSelector, bytes memory data) internal {
        (bool success, ) = contractAddress.call(abi.encode(functionSelector, data));
        require(success, "Function call failed");
    }

}
