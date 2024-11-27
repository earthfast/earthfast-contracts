// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import { EarthfastCreateProjectData } from "./EarthfastProjects.sol";


/// @title Entry point for creating multiple sub projects and escrows pointing to a single project
contract ProjectMultiplex is ReentrancyGuard {

  // // FIXME: determine if a single creator can create multiple sub projects
  //   // and if a token can have multiple sub projects
  // /// @notice Mapping of project creator to token address
  // mapping(address => address) public projectTokens;
  // /// @notice Mapping of project creator to sub-project id
  // mapping(address => bytes32) public projectIds;

  /// @notice Mapping of sub-project id to sub-project details
  mapping(bytes32 => SubProject) public subProjects;

  // TODO: determine if payment is needed in the same token as is used for the site
  // TODO: determine if the project creator should be stored here
  /// @notice Struct to hold sub-project details
  struct SubProject {
    address token; // Address of the token to use for the escrow
    uint256 escrow; // Amount of tokens to escrow
    bytes32 subProjectId; // Id of the sub-project
    bytes castHash; // Hash id of the project creation cast
  }

  /// @notice Address of the projects contract
  address public projects;
  /// @notice Id of the project to create sub projects for
  bytes32 public projectId;
  /// @notice Address to withdraw tokens to
  address public withdrawalAddress;

  /// @notice Emitted when a sub project is created
  event SubProjectCreated(bytes32 indexed subProjectId, address indexed token, uint256 escrow, bytes castHash);

  constructor(address _projects, bytes32 _projectId, address _withdrawalAddress) {
    projects = _projects;
    projectId = _projectId;
    withdrawalAddress = _withdrawalAddress;
  }

  // TODO: add support for incrementing the escrow?
  // TODO: add support for permit signatures
  /// @notice Creates a new sub project and escrow
  function createProject(
    address tokenAddress,
    address caster,
    uint256 escrowAmount,
    bytes memory castHash
  ) external nonReentrant returns (bytes32 subProjectId) {
    // TODO: add additional validation checks
    require(escrowAmount != 0, "must deposit escrow");

    // create the sub project
    subProjectId = keccak256(abi.encodePacked(projectId, tokenAddress, caster));
    SubProject memory subProject = SubProject({
      token: tokenAddress,
      escrow: escrowAmount,
      subProjectId: subProjectId,
      castHash: castHash
    });

    // transfer the tokens to the escrow
    IERC20(tokenAddress).transferFrom(caster, address(this), escrowAmount);

    // add the sub project to the mapping
    // projectTokens[caster] = tokenAddress;
    // projectIds[caster] = subProjectId;
    subProjects[subProjectId] = subProject;

    emit SubProjectCreated(subProjectId, tokenAddress, escrowAmount, castHash);
  }

  // TODO: add whitelisted withdrawal address
  // TODO: add support for decreasing the escrow?
  function withdrawTokens(address token, uint256 amount) external {
    // transfer tokens to the whitelisted address
    IERC20(token).transfer(withdrawalAddress, amount);
  }

}
