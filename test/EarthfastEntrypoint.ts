import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { SignerWithAddress, ZeroHash } from "ethers";
import hre from "hardhat";

import { expectEvent, expectReceipt, fixtures } from "../lib/test";
import { approve, parseTokens, parseUSDC, signApproval, signers } from "../lib/util";

import { EarthfastEntrypoint } from "../typechain-types/contracts/EarthfastEntrypoint";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastNodesImpl } from "../typechain-types/contracts/EarthfastNodesImpl";
import { EarthfastOperators } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects, EarthfastSlot } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastEntrypoint", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let usdc: USDC;
  let entrypoint: EarthfastEntrypoint;
  let token: EarthfastToken;
  let nodes: EarthfastNodes;
  let nodesImpl: EarthfastNodesImpl;
  let operators: EarthfastOperators;
  let projects: EarthfastProjects;
  let reservations: EarthfastReservations;

  // store contract addresses after awaiting fixture
  let nodesAddress: string;
  let nodesImplAddress: string;
  let operatorsAddress: string;
  let projectsAddress: string;
  let reservationsAddress: string;
  let entrypointAddress: string;
  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, nodesImpl } = await fixtures(hre));

    // set contract addresses as string
    nodesAddress = await nodes.getAddress();
    nodesImplAddress = await nodesImpl.getAddress();
    operatorsAddress = await operators.getAddress();
    projectsAddress = await projects.getAddress();
    reservationsAddress = await reservations.getAddress();

    // deploy entrypoint
    const entrypointFactory = await hre.ethers.getContractFactory("EarthfastEntrypoint");
    const entrypointArgs = [[admin.address], nodesAddress, projectsAddress, reservationsAddress];
    entrypoint = <EarthfastEntrypoint>await hre.upgrades.deployProxy(entrypointFactory, entrypointArgs, { kind: "uups" });

    // Authorize the entrypoint in the Reservations contract
    entrypointAddress = await entrypoint.getAddress();
    await reservations.connect(admin).authorizeEntrypoint(entrypointAddress);
  }

  before(async function () {
    await fixture();

    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should create a project via deploySite", async function () {
    // create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // create node
    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");
    expect(nodeId1).to.not.equal(ZeroHash);

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const nodesToReserve = 1;
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // FIXME: this is redundant with the signature move into a separate test
    // Approve the entrypoint contract to spend USDC
    await usdc.connect(project).approve(entrypointAddress, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    const tx = await expectReceipt(entrypoint.connect(project).deploySite(projectData, project.address, nodesToReserve, escrowAmount, slot, deadline, signature.serialized));

    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);

    // check that the escrow was deposited
    const deployedProject = await projects.getProject(projectId);
    expect(deployedProject.escrow).to.equal(escrowAmount);

    // get the nodes and verify they are assigned to the project
    const node1Data = await nodes.getNode(nodeId1);
    expect(node1Data.projectIds[0]).to.equal(projectId);
  });

  it("Should retrieve the correct number of available nodes", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o2", "e2"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create multiple nodes with different prices
    const price1 = parseUSDC("1");
    const price2 = parseUSDC("2");
    const price3 = parseUSDC("3");

    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: price1 };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r2", price: price2 };
    const node3: EarthfastCreateNodeDataStruct = { disabled: false, host: "h3", region: "r3", price: price3 };

    // Create nodes one by one to get their IDs
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");

    const createNode2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const [nodeId2] = await expectEvent(createNode2, nodes, "NodeCreated");

    const createNode3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node3]));
    const [nodeId3] = await expectEvent(createNode3, nodes, "NodeCreated");

    // Test getting available nodes for last epoch
    const slotLast: EarthfastSlot = { last: true, next: false };
    const [nodeIdsLast, nodePricesLast] = await entrypoint.getAvailableNodes(2, slotLast);

    // Verify we got 2 nodes
    expect(nodeIdsLast.length).to.equal(2);
    expect(nodePricesLast.length).to.equal(2);

    // Verify the node IDs are valid (should be among the ones we created)
    expect([nodeId1, nodeId2, nodeId3]).to.include(nodeIdsLast[0]);
    expect([nodeId1, nodeId2, nodeId3]).to.include(nodeIdsLast[1]);

    // Verify the prices and nodeIds match the nodes returned
    for (let i = 0; i < nodeIdsLast.length; i++) {
      const nodeId = nodeIdsLast[i];
      const price = nodePricesLast[i];

      if (nodeId === nodeId1) {
        expect(price).to.equal(price1);
      } else if (nodeId === nodeId2) {
        expect(price).to.equal(price2);
      } else if (nodeId === nodeId3) {
        expect(price).to.equal(price3);
      }
    }

    // Test getting available nodes for next epoch
    const slotNext: EarthfastSlot = { last: false, next: true };
    const [nodeIdsNext, nodePricesNext] = await entrypoint.getAvailableNodes(3, slotNext);

    // Verify we got all 3 nodes
    expect(nodeIdsNext.length).to.equal(3);
    expect(nodePricesNext.length).to.equal(3);

    // Verify all node IDs are included
    expect(nodeIdsNext).to.include(nodeId1);
    expect(nodeIdsNext).to.include(nodeId2);
    expect(nodeIdsNext).to.include(nodeId3);

    // Verify the prices and nodeIds match the nodes returned
    for (let i = 0; i < nodeIdsNext.length; i++) {
      const nodeId = nodeIdsNext[i];
      const price = nodePricesNext[i];

      if (nodeId === nodeId1) {
        expect(price).to.equal(price1);
      } else if (nodeId === nodeId2) {
        expect(price).to.equal(price2);
      } else if (nodeId === nodeId3) {
        expect(price).to.equal(price3);
      }
    }

    // Test requesting more nodes than available
    await expect(entrypoint.getAvailableNodes(4, slotNext)).to.be.revertedWith("Not enough available nodes");
  });

  it("Should create a project via deploySiteWithNodeIds", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o3", "e3"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create multiple nodes with different prices
    const price1 = parseUSDC("1");
    const price2 = parseUSDC("2");

    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: price1 };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r2", price: price2 };

    // Create nodes one by one to get their IDs
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");

    const createNode2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const [nodeId2] = await expectEvent(createNode2, nodes, "NodeCreated");

    // Create project data
    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    // Prepare node IDs and prices arrays
    const nodeIds = [nodeId1, nodeId2];
    const nodePrices = [price1, price2];
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    // Call deploySiteWithNodeIds
    const tx = await expectReceipt(entrypoint.connect(project).deploySiteWithNodeIds(projectData, project.address, nodeIds, nodePrices, escrowAmount, slot, deadline, signature.serialized));

    // Verify project was created
    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);

    // check that the escrow was deposited
    const deployedProject = await projects.getProject(projectId);
    expect(deployedProject.escrow).to.equal(escrowAmount);

    // Get the nodes and verify they are assigned to the project
    const node1Data = await nodes.getNode(nodeId1);
    const node2Data = await nodes.getNode(nodeId2);

    // check if the nodes are assigned to the project
    expect(node1Data.projectIds[0]).to.equal(projectId);
    expect(node2Data.projectIds[0]).to.equal(projectId);
  });

  it("Should create a project via deploySiteWithNodeIds with a different funding wallet", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o4", "e4"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const price1 = parseUSDC("1");
    const price2 = parseUSDC("2");

    // create a node
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: price1 };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");

    // create a node
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r2", price: price2 };
    const createNode2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const [nodeId2] = await expectEvent(createNode2, nodes, "NodeCreated");

    // Create project data
    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    // Prepare node IDs and prices arrays
    const nodeIds = [nodeId1, nodeId2];
    const nodePrices = [price1, price2];
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the funding wallet
    await usdc.connect(admin).transfer(operator.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, operator.address, projectsAddress, escrowAmount, deadline);

    // Call deploySiteWithNodeIds
    const tx = await expectReceipt(entrypoint.connect(project).deploySiteWithNodeIds(projectData, operator.address, nodeIds, nodePrices, escrowAmount, slot, deadline, signature.serialized));

    // Verify project was created
    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);

    // check that the escrow was deposited
    const deployedProject = await projects.getProject(projectId);
    expect(deployedProject.escrow).to.equal(escrowAmount);

    // get the nodes and verify they are assigned to the project
    const node1Data = await nodes.getNode(nodeId1);
    const node2Data = await nodes.getNode(nodeId2);

    // check if the nodes are assigned to the project
    expect(node1Data.projectIds[0]).to.equal(projectId);
    expect(node2Data.projectIds[0]).to.equal(projectId);

    // check that the project owner is project.address not the operator.address which submitted the funds and transaction
    expect(deployedProject.owner).to.equal(project.address);
  });

  it("Should be upgradeable", async function () {
    // Deploy a modified implementation to ensure it's different
    const entrypointV2Factory = await hre.ethers.getContractFactory("EarthfastEntrypointV2", admin);

    // Get the current implementation address
    const proxyAddress = await entrypoint.getAddress();
    const ERC1967_IMPLEMENTATION_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
    const currentImplementationData = await hre.ethers.provider.getStorage(proxyAddress, ERC1967_IMPLEMENTATION_SLOT);
    const currentImplementation = "0x" + currentImplementationData.substring(26); // Remove padding

    // Upgrade to the V2 implementation using the admin account
    const upgraded = await hre.upgrades.upgradeProxy(proxyAddress, entrypointV2Factory);
    await upgraded.waitForDeployment();

    // Verify the implementation was upgraded
    const newImplementationData = await hre.ethers.provider.getStorage(proxyAddress, ERC1967_IMPLEMENTATION_SLOT);
    const upgradedImplementation = "0x" + newImplementationData.substring(26); // Remove padding

    // The implementation address should be different after the upgrade
    expect(upgradedImplementation.toLowerCase()).to.not.equal(currentImplementation.toLowerCase());

    // Check that the new function exists
    const version = await upgraded.getVersion();
    expect(version).to.equal("2.0.0");

    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o3", "e3"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // deploy a node
    const node3: EarthfastCreateNodeDataStruct = { disabled: false, host: "h3", region: "r3", price: parseUSDC("3") };
    const createNode3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node3]));
    await expectEvent(createNode3, nodes, "NodeCreated");

    // Verify the contract still works after upgrade
    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project After Upgrade",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const nodesToReserve = 1;
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    const tx = await expectReceipt(upgraded.connect(project).deploySite(projectData, project.address, nodesToReserve, escrowAmount, slot, deadline, signature.serialized));

    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);
  });

  it("Should revert when deadline has expired", async function () {
    // Create operator and node
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o5", "e5"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    await expectEvent(createNode1, nodes, "NodeCreated");

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const nodesToReserve = 1;
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Create a signature with an expired deadline
    const expiredDeadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour in the past
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, expiredDeadline);

    // Should revert when trying to use an expired deadline
    await expect(entrypoint.connect(project).deploySite(projectData, project.address, nodesToReserve, escrowAmount, slot, expiredDeadline, signature.serialized)).to.be.reverted;
  });

  it("Should revert when nodeIds and nodePrices arrays have different lengths", async function () {
    // Create operator and nodes
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o6", "e6"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const price1 = parseUSDC("1");
    const price2 = parseUSDC("2");

    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: price1 };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r2", price: price2 };

    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");

    const createNode2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const [nodeId2] = await expectEvent(createNode2, nodes, "NodeCreated");

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    // Mismatched arrays: 2 nodeIds but only 1 price
    const nodeIds = [nodeId1, nodeId2];
    const nodePrices = [price1]; // Missing price2
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    // Should revert when nodeIds and nodePrices arrays have different lengths
    await expect(entrypoint.connect(project).deploySiteWithNodeIds(projectData, project.address, nodeIds, nodePrices, escrowAmount, slot, deadline, signature.serialized)).to.be.revertedWith(
      "length mismatch"
    );
  });

  it("Should revert when escrow amount is zero", async function () {
    // Create operator and node
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o7", "e7"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    await expectEvent(createNode1, nodes, "NodeCreated");

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const nodesToReserve = 1;
    const zeroEscrowAmount = parseUSDC("0");
    const slot: EarthfastSlot = { last: true, next: false };

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, zeroEscrowAmount, deadline);

    // Should revert when escrow amount is zero
    await expect(entrypoint.connect(project).deploySite(projectData, project.address, nodesToReserve, zeroEscrowAmount, slot, deadline, signature.serialized)).to.be.revertedWith(
      "Escrow amount must be greater than 0"
    );
  });

  it("Should properly update contract references", async function () {
    // Deploy mock contracts to use as new references
    const mockNodesFactory = await hre.ethers.getContractFactory("EarthfastNodes", {
      libraries: {
        EarthfastNodesImpl: nodesImplAddress,
      },
    });
    const mockNodes = await mockNodesFactory.deploy();
    await mockNodes.waitForDeployment();
    const mockNodesAddress = await mockNodes.getAddress();

    const mockProjectsFactory = await hre.ethers.getContractFactory("EarthfastProjects");
    const mockProjects = await mockProjectsFactory.deploy();
    await mockProjects.waitForDeployment();
    const mockProjectsAddress = await mockProjects.getAddress();

    const mockReservationsFactory = await hre.ethers.getContractFactory("EarthfastReservations");
    const mockReservations = await mockReservationsFactory.deploy();
    await mockReservations.waitForDeployment();
    const mockReservationsAddress = await mockReservations.getAddress();

    // Update contract references
    await entrypoint.connect(admin).updateContracts(mockNodesAddress, mockProjectsAddress, mockReservationsAddress);

    // Verify the contract references were updated
    const [nodesAddress, projectsAddress, reservationsAddress] = await entrypoint.getContracts();
    expect(nodesAddress).to.equal(mockNodesAddress);
    expect(projectsAddress).to.equal(mockProjectsAddress);
    expect(reservationsAddress).to.equal(mockReservationsAddress);
  });

  it("Should allow partial contract reference updates", async function () {
    // Get current contract references
    const [, currentProjectsAddress, currentReservationsAddress] = await entrypoint.getContracts();

    // Deploy a mock contract to use as a new reference for nodes only
    const mockNodesFactory = await hre.ethers.getContractFactory("EarthfastNodes", {
      libraries: {
        EarthfastNodesImpl: nodesImplAddress,
      },
    });
    const mockNodes = await mockNodesFactory.deploy();
    await mockNodes.waitForDeployment();
    const mockNodesAddress = await mockNodes.getAddress();

    // Update only the nodes contract reference
    await entrypoint.connect(admin).updateContracts(
      mockNodesAddress,
      hre.ethers.ZeroAddress, // Don't update projects
      hre.ethers.ZeroAddress // Don't update reservations
    );

    // Verify only the nodes reference was updated
    const [updatedNodesAddress, updatedProjectsAddress, updatedReservationsAddress] = await entrypoint.getContracts();
    expect(updatedNodesAddress).to.equal(mockNodesAddress);
    expect(updatedProjectsAddress).to.equal(currentProjectsAddress);
    expect(updatedReservationsAddress).to.equal(currentReservationsAddress);
  });

  it("Should prevent non-admins from updating contract references", async function () {
    // Try to update contract references as a non-admin
    await expect(entrypoint.connect(project).updateContracts(hre.ethers.ZeroAddress, hre.ethers.ZeroAddress, hre.ethers.ZeroAddress)).to.be.reverted; // Should revert with an access control error
  });

  it("Should prevent non-admins from upgrading the contract", async function () {
    // Get the proxy address
    const proxyAddress = await entrypoint.getAddress();

    // Try to upgrade the contract as a non-admin
    const entrypointV2Factory = await hre.ethers.getContractFactory("EarthfastEntrypointV2", project);

    // This should fail because project is not an admin
    await expect(hre.upgrades.upgradeProxy(proxyAddress, entrypointV2Factory)).to.be.reverted; // Should revert with an access control error
  });

  it("Should verify the signature splitting function works correctly", async function () {
    // This test indirectly tests the splitSignature function by using it in deploySite
    // Create operator and node
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o8", "e8"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    await expectEvent(createNode1, nodes, "NodeCreated");

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const nodesToReserve = 1;
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Create a valid signature
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    // Create an invalid signature (wrong length)
    const invalidSignature = "0x1234"; // Too short

    // Should revert when signature has invalid length
    await expect(entrypoint.connect(project).deploySite(projectData, project.address, nodesToReserve, escrowAmount, slot, deadline, invalidSignature)).to.be.revertedWith("Invalid signature length");

    // now deploy the site with the valid signature
    const tx = await expectReceipt(entrypoint.connect(project).deploySite(projectData, project.address, nodesToReserve, escrowAmount, slot, deadline, signature.serialized));

    // Verify project was created
    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);
  });

  it("Should handle both last and next epoch slots simultaneously", async function () {
    // Create operator and node
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o10", "e10"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create node
    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    // Reserve for both last and next epochs
    const bothSlot: EarthfastSlot = { last: true, next: true };
    const escrowAmount = parseUSDC("100");

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    // Deploy site with specific node IDs for both epochs
    const tx = await expectReceipt(entrypoint.connect(project).deploySiteWithNodeIds(projectData, project.address, [nodeId1], [price], escrowAmount, bothSlot, deadline, signature.serialized));

    // Verify project was created
    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);

    // Get the node and verify it's assigned to the project in both epochs
    const nodeData = await nodes.getNode(nodeId1);

    // Check if the node is assigned to the project in both epochs
    expect(nodeData.projectIds).to.include(projectId);
  });

  it("Should verify that getAvailableNodes returns the correct nodes when some are already reserved", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o12", "e12"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create multiple nodes
    const price1 = parseUSDC("1");
    const price2 = parseUSDC("2");
    const price3 = parseUSDC("3");

    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: price1 };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r2", price: price2 };
    const node3: EarthfastCreateNodeDataStruct = { disabled: false, host: "h3", region: "r3", price: price3 };

    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");

    const createNode2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const [nodeId2] = await expectEvent(createNode2, nodes, "NodeCreated");

    const createNode3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node3]));
    const [nodeId3] = await expectEvent(createNode3, nodes, "NodeCreated");

    // Create a project and reserve node1
    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const escrowAmount = parseUSDC("100");
    const slotLast: EarthfastSlot = { last: true, next: false };

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    // Reserve node1
    await entrypoint.connect(project).deploySiteWithNodeIds(projectData, project.address, [nodeId1], [price1], escrowAmount, slotLast, deadline, signature.serialized);

    // Now get available nodes - should not include node1
    const [availableNodeIds, availableNodePrices] = await entrypoint.getAvailableNodes(2, slotLast);

    // Should get 2 nodes (node2 and node3)
    expect(availableNodeIds.length).to.equal(2);
    expect(availableNodePrices.length).to.equal(2);

    // Should not include node1
    expect(availableNodeIds).to.not.include(nodeId1);
    expect(availableNodeIds).to.include(nodeId2);
    expect(availableNodeIds).to.include(nodeId3);
  });
});
