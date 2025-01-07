// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import { EarthfastCreateProjectData } from "./EarthfastProjects.sol";

/// @title Entry point for creating multiple sub projects and escrows pointing to a single project
contract ProjectMultiplex is ReentrancyGuard {

  // // FIXME: determine if a single creator can create multiple sub projects
  //   // and if a token can have multiple sub projects
  // TODO: determine if payment is needed in the same token as is used for the site

  /// @notice Mapping of sub-project id to sub-project details
  mapping(bytes32 => SubProject) public subProjects;

  // list of sub projects
  bytes32[] public subProjectIds;

  /// @notice Struct to hold sub-project details
  struct SubProject {
    uint32 chainId; // Chain on which the token exists
    string tokenName; // name of the token
    address token; // Address of the token to use for the escrow
    string caster; // Username of the original caster
    bytes castHash; // Hash id of the project creation cast
  }

  /// @notice Address of the projects contract
  address public projects;
  /// @notice Id of the project to create sub projects for
  bytes32 public projectId;
  /// @notice Address of the owner
  address public owner;

  /// @notice Emitted when a sub project is created
  event SubProjectCreated(uint32 indexed chainId, bytes32 indexed subProjectId, address indexed token, bytes castHash);

  constructor(address _projects, bytes32 _projectId, address _owner) {
    projects = _projects;
    projectId = _projectId;
    owner = _owner;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
  }

  //////////////////////////
  /////// PUBLIC ///////////
  //////////////////////////

  // TODO: add support for escrow payments and signature permits
  /// @notice Creates a new sub project and escrow
  /// @param chainId The chain id of the token
  /// @param tokenName The name of the token
  /// @param tokenAddress The address of the token
  /// @param caster The username of the caster
  /// @param castHash The hash of the project creation cast
  function createProject(
    uint32 chainId,
    string memory tokenName,
    address tokenAddress,
    string memory caster,
    bytes memory castHash
  ) external nonReentrant returns (bytes32 subProjectId) {
    // create the sub project
    subProjectId = getSubProjectId(chainId, tokenAddress, caster);
    SubProject memory subProject = SubProject({
      chainId: chainId,
      tokenName: tokenName,
      token: tokenAddress,
      caster: caster,
      castHash: castHash
    });

    // write the sub project to storage
    subProjects[subProjectId] = subProject;
    subProjectIds.push(subProjectId);

    emit SubProjectCreated(chainId, subProjectId, tokenAddress, castHash);
  }

  /// @notice Deletes a sub project
  /// @param subProjectId The id of the sub project to delete
  function deleteSubProject(bytes32 subProjectId) external onlyOwner {
    delete subProjects[subProjectId];
    _removeFromArray(subProjectIds, subProjectId);
  }

  //////////////////////////
  /////// VIEW /////////////
  //////////////////////////

  function getSubProjectId(uint32 chainId, address tokenAddress, string memory caster) public view returns (bytes32) {
    return keccak256(abi.encode(chainId, projectId, tokenAddress, caster));
  }

  function getSubProjectIds() external view returns (bytes32[] memory) {
    return subProjectIds;
  }

  //////////////////////////
  /////// INTERNAL /////////
  //////////////////////////

  function _removeFromArray(bytes32[] storage arr, bytes32 element) internal {
    for (uint i = 0; i < arr.length; i++) {
        if (arr[i] == element) {
            arr[i] = arr[arr.length - 1];
            arr.pop();
            break;
        }
    }
  }

}
