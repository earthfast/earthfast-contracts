// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ArmadaBilling.sol";
import "./ArmadaNodes.sol";
import "./ArmadaOperators.sol";
import "./ArmadaProjects.sol";
import "./ArmadaReservations.sol";
import "./ArmadaToken.sol";

uint256 constant ARMADA_MAX_FQDN_BYTES = 256;
uint256 constant ARMADA_MAX_HOST_BYTES = 256;
uint256 constant ARMADA_MAX_REGION_BYTES = 2;
uint256 constant ARMADA_MAX_NAME_BYTES = 256;
uint256 constant ARMADA_MAX_EMAIL_BYTES = 256;
uint256 constant ARMADA_MAX_CONTENT_BYTES = 2048;

// Indexes of epoch slots
uint256 constant ARMADA_LAST_EPOCH = 0;
uint256 constant ARMADA_NEXT_EPOCH = 1;

// Specifies an epoch slot
struct ArmadaSlot {
  bool last; // Starting and ending with the current epoch
  bool next; // Starting from next epoch and going forward
}

// On-chain operator entity
struct ArmadaOperator {
  bytes32 id;    // Hash of nonce
  address owner; // Who can change operator settings or withdraw stake
  string name;   // A human-friendly name for the operator
  string email;  // Used for administrative notifications
  uint256 stake; // Token amount deposited by the operator, determines how many nodes this operator can create
}

// On-chain project entity
struct ArmadaProject {
  bytes32 id;       // Hash of nonce
  address owner;    // Who can change project settings, publish content or withdraw escrow, e.g governance DAO
  string name;      // A human-friendly name for the project
  string email;     // Used for administrative notifications
  uint256 escrow;   // Token amount deposited by the project, used to reserve and pay for content nodes
  uint256 reserve;  // Part of escrow that is locked to fulfill payment obligations for the last and next epoch
  string content;   // What to serve by content nodes as interpreted by the node software, e.g. tarball URL
  bytes32 checksum; // Checksum of the content field above as interpreted by the node software, e.g. SHA-256
}

struct ArmadaCreateProjectData {
  address owner;
  string name;
  string email;
  string content;
  bytes32 checksum;
}

// On-chain node entity
struct ArmadaNode {
  bytes32 id;         // Hash of nonce
  bytes32 operatorId; // Who can change node settings, pricing, disable or delete this node
  string host;        // Interpreted by the node software
  string region;      // Interpreted by the node software
  bool topology;      // Whether this is a topology or content node
  bool disabled;      // Disabled node won't take new reservations, and won't renew when current epoch ends

  // Content nodes only. Slots that hold corresponding values for the last and the next epoch.
  uint256[2] prices;     // Full-epoch price if node is not reserved, or prorated price if node is reserved
  bytes32[2] projectIds; // Project that reserved this node for the respective epoch, or zero if not reserved
}

struct ArmadaCreateNodeData {
  string host;
  string region;
  bool topology;
  bool disabled;

  // Content nodes only
  uint256 price;
}

struct ArmadaRegistryInitializeData {
  string version;
  uint256 nonce;
  uint256 epochStart;
  uint256 lastEpochLength;
  uint256 nextEpochLength;
  uint256 gracePeriod;

  ArmadaToken token;
  ArmadaBilling billing;
  ArmadaNodes nodes;
  ArmadaOperators operators;
  ArmadaProjects projects;
  ArmadaReservations reservations;
}
