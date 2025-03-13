import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { SignerWithAddress, ZeroHash } from "ethers";
import hre from "hardhat";

import { expectEvent, expectReceipt, fixtures } from "../lib/test";
import { approve, parseTokens, parseUSDC, signApproval, signers } from "../lib/util";

import { EarthfastEntrypoint } from "../typechain-types/contracts/EarthfastEntrypoint";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
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
  let operators: EarthfastOperators;
  let projects: EarthfastProjects;
  let reservations: EarthfastReservations;

  // store contract addresses after awaiting fixture
  let nodesAddress: string;
  let operatorsAddress: string;
  let projectsAddress: string;
  let reservationsAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes } = await fixtures(hre));

    // set contract addresses as string
    nodesAddress = await nodes.getAddress();
    operatorsAddress = await operators.getAddress();
    projectsAddress = await projects.getAddress();
    reservationsAddress = await reservations.getAddress();

    // deploy entrypoint
    const entrypointFactory = await hre.ethers.getContractFactory("EarthfastEntrypoint");
    const deployment = await entrypointFactory.deploy(nodesAddress, projectsAddress, reservationsAddress);
    entrypoint = (await deployment.waitForDeployment()) as EarthfastEntrypoint;
  }

  before(async function () {
    await fixture();

    // Authorize the entrypoint in the Reservations contract
    const entrypointAddress = await entrypoint.getAddress();
    await reservations.connect(admin).authorizeEntrypoint(entrypointAddress);

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

    // Get the entrypoint address
    const entrypointAddress = await entrypoint.getAddress();
    const projectsAddress = await projects.getAddress();

    // FIXME: this is redundant with the signature move into a separate test
    // Approve the entrypoint contract to spend USDC
    await usdc.connect(project).approve(entrypointAddress, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    const tx = await expectReceipt(entrypoint.connect(project).deploySite(projectData, nodesToReserve, escrowAmount, slot, deadline, signature.serialized));

    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);
  });

  it("Should retrieve available nodes correctly", async function () {
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

    // Get the entrypoint address
    const entrypointAddress = await entrypoint.getAddress();
    const projectsAddress = await projects.getAddress();

    // Mint USDC to the project account
    await usdc.connect(admin).transfer(project.address, escrowAmount);

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount, deadline);

    // Call deploySiteWithNodeIds
    const tx = await expectReceipt(
      entrypoint.connect(project).deploySiteWithNodeIds(
        projectData,
        nodeIds,
        nodePrices,
        escrowAmount,
        slot,
        deadline,
        signature.serialized
      )
    );

    // Verify project was created
    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);

    // check that the escrow was deposited
    const deployedProject = await projects.getProject(projectId);
    console.log(deployedProject);
    expect(deployedProject.escrow).to.equal(escrowAmount);

    // Get the nodes and verify they are assigned to the project
    const node1Data = await nodes.getNode(nodeId1);
    const node2Data = await nodes.getNode(nodeId2);

    console.log(projectId);
    console.log(node1Data);
    console.log(node2Data);

    // check if the nodes are assigned to the project
    expect(node1Data.projectIds[0]).to.equal(projectId);
    expect(node2Data.projectIds[0]).to.equal(projectId);
    
    // // Check if the nodes are assigned to the project in the specified slot
    // // if (slot.last) {
    //   expect(node1Data.projectIds[0]).to.equal(projectId);
    //   expect(node2Data.projectIds[0]).to.equal(projectId);
    // // }
    
    // // if (slot.next) {
    //   expect(node1Data.projectIds[1]).to.equal(projectId);
    //   expect(node2Data.projectIds[1]).to.equal(projectId);
    // }
  });
});
