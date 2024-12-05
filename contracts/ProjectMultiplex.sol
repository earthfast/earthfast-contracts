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
  // TODO: determine if the project creator should be stored here

  /// @notice Mapping of sub-project id to sub-project details
  mapping(bytes32 => SubProject) public subProjects;

  /// @notice Struct to hold sub-project details
  struct SubProject {
    uint32 chainId; // Chain on which the token exists
    address token; // Address of the token to use for the escrow
    bytes32 subProjectId; // Id of the sub-project
    bytes castHash; // Hash id of the project creation cast
    // uint256 escrow; // Amount of tokens to escrow
  }

  /// @notice Address of the projects contract
  address public projects;
  /// @notice Id of the project to create sub projects for
  bytes32 public projectId;
  /// @notice Address to withdraw tokens to
  address public withdrawalAddress;

  /// @notice Emitted when a sub project is created
  event SubProjectCreated(uint32 indexed chainId, bytes32 indexed subProjectId, address indexed token, bytes castHash);

  constructor(address _projects, bytes32 _projectId, address _withdrawalAddress) {
    projects = _projects;
    projectId = _projectId;
    withdrawalAddress = _withdrawalAddress;
  }

  // TODO: add support for escrow payments and signature permits
  /// @notice Creates a new sub project and escrow
  function createProject(
    uint32 chainId,
    address tokenAddress,
    address caster,
    // uint256 escrowAmount,
    bytes memory castHash
  ) external nonReentrant returns (bytes32 subProjectId) {
    // TODO: add additional validation checks
    // require(escrowAmount != 0, "must deposit escrow");

    // create the sub project
    subProjectId = getSubProjectId(chainId, tokenAddress, caster);
    SubProject memory subProject = SubProject({
      chainId: chainId,
      token: tokenAddress,
      subProjectId: subProjectId,
      castHash: castHash
    });

    // transfer the tokens to the escrow
    // IERC20(tokenAddress).transferFrom(caster, address(this), escrowAmount);

    // add the sub project to the mapping
    subProjects[subProjectId] = subProject;

    emit SubProjectCreated(chainId, subProjectId, tokenAddress, castHash);
  }

  // TODO: add support for checking escrow
  function withdrawTokens(address token, uint256 amount) external {
    // transfer tokens to the whitelisted address
    IERC20(token).transfer(withdrawalAddress, amount);
  }

  function getSubProjectId(uint32 chainId, address tokenAddress, address caster) public view returns (bytes32) {
    return keccak256(abi.encode(chainId, projectId, tokenAddress, caster));
  }

}
