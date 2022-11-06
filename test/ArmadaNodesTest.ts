import { AddressZero, HashZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { Result } from "ethers/lib/utils";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, newId } from "../lib/test";
import { parseTokens, signers } from "../lib/util";
import { ArmadaCreateNodeDataStruct, ArmadaNodes, ArmadaNodeStruct } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators, ArmadaOperatorStruct } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaCreateProjectDataStruct, ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";

chai.use(shallowDeepEqual);

describe("ArmadaNodes", function () {
  let admin: SignerWithAddress;
  let deployer: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let token: ArmadaToken;
  let nodes: ArmadaNodes;
  let operators: ArmadaOperators;
  let registry: ArmadaRegistry;
  let projects: ArmadaProjects;

  let snapshotId: string;

  async function fixture() {
    ({ admin, deployer, operator, project } = await signers(hre));
    ({ token, nodes, operators, registry, projects } = await fixtures(hre));
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should upgrade", async function () {
    const { nodes } = await fixtures(hre);
    expect(await nodes.setTest(1)).to.be.ok;
    expect(await nodes.getTest()).to.be.eq(1);
  });

  it("Should respect importer role", async function () {
    // Fixes PromiseRejectionHandledWarning
    expect(await nodes.IMPORTER_ROLE()).to.be.ok;
    // Even admin does not have this role, only deployer does
    await expect(nodes.connect(admin).unsafeImportData([], [], false)).to.be.revertedWith(`AccessControl: account ${admin.address.toLowerCase()} is missing role ${await nodes.IMPORTER_ROLE()}`);
    expect(await nodes.connect(deployer).unsafeImportData([], [], false)).to.be.ok;
    expect(await nodes.connect(deployer).unsafeImportData([], [], true)).to.be.ok;
    // Once this role is revoked, nobody can grant it again
    await expect(nodes.connect(deployer).grantRole(nodes.IMPORTER_ROLE(), deployer.address)).to.be.revertedWith(
      `AccessControl: account ${deployer.address.toLowerCase()} is missing role ${await nodes.IMPORTER_ROLE()}`
    );
    await expect(nodes.connect(admin).grantRole(nodes.IMPORTER_ROLE(), deployer.address)).to.be.revertedWith(
      `AccessControl: account ${admin.address.toLowerCase()} is missing role ${await nodes.IMPORTER_ROLE()}`
    );
  });

  it("Should create/delete nodes", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"))).to.be.ok;

    const price = parseTokens("1");
    const node1: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };
    const node2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };
    const node3: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };

    // Ensure all the create nodes checks are working
    const topologyMismatchNode1 = { ...node1, topology: true };
    await expect(nodes.connect(operator).createNodes(operatorId, false, [topologyMismatchNode1])).to.be.revertedWith("topology mismatch");
    const emptyHostNode1 = { ...node1, host: "" };
    await expect(nodes.connect(operator).createNodes(operatorId, false, [emptyHostNode1])).to.be.revertedWith("empty host");
    const hostTooLongNode1 = { ...node1, host: "h".repeat(10000) };
    await expect(nodes.connect(operator).createNodes(operatorId, false, [hostTooLongNode1])).to.be.revertedWith("host too long");
    const emptyRegionNode1 = { ...node1, region: "" };
    await expect(nodes.connect(operator).createNodes(operatorId, false, [emptyRegionNode1])).to.be.revertedWith("empty region");
    const regionTooLongNode1 = { ...node1, region: "r".repeat(10000) };
    await expect(nodes.connect(operator).createNodes(operatorId, false, [regionTooLongNode1])).to.be.revertedWith("region too long");
    await expect(nodes.connect(admin).createNodes(operatorId, false, [regionTooLongNode1])).to.be.revertedWith("not operator");

    // Create
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });

    // Create another
    const createNodes2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node2]));
    const createNodes2Result = await expectEvent(createNodes2, nodes, "NodeCreated");
    const { nodeId: nodeId2 } = createNodes2Result as Result;
    expect(nodeId2).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });

    // Ensure all the delete nodes checks are working
    await expect(nodes.connect(operator).deleteNodes(operatorId2, false, [nodeId1])).to.be.revertedWith("operator mismatch");
    expect(await nodes.connect(operator).hasRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.false;
    await expect(nodes.connect(operator).deleteNodes(operatorId, true, [nodeId1])).to.be.revertedWith("not topology creator");
    const invalidNodeId = newId();
    await expect(nodes.getNode(invalidNodeId)).to.be.revertedWith("unknown node");

    // Grant topology creator role
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    expect(await nodes.connect(operator).hasRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.true;
    await expect(nodes.connect(operator).deleteNodes(operatorId, true, [nodeId1])).to.be.revertedWith("topology mismatch");

    // Delete
    expect(await nodes.connect(operator).deleteNodes(operatorId, false, [nodeId1])).to.be.ok;
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });

    // Delete missing
    await expect(nodes.connect(operator).deleteNodes(operatorId, false, [nodeId1])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).deleteNodes(operatorId, false, [newId()])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).deleteNodes(operatorId, false, [HashZero])).to.be.revertedWith("unknown node");

    // Create another
    const createNodes3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node3]));
    const createNodes3Result = await expectEvent(createNodes3, nodes, "NodeCreated");
    const { nodeId: nodeId3 } = createNodes3Result as Result;
    expect(nodeId3).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId2 }, 1: { id: nodeId3 } });

    // Create another
    const createNodes1b = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node3]));
    const createNodes1bResult = await expectEvent(createNodes1b, nodes, "NodeCreated");
    const { nodeId: nodeId1b } = createNodes1bResult as Result;
    expect(nodeId1b).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId1b } });

    // Ranged get
    expect(await nodes.getNodeCount(operatorId, false)).to.eq(3);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId1b } });
    expect(await nodes.getNodes(operatorId, false, 1, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId3 }, 1: { id: nodeId1b } });
    expect(await nodes.getNodes(operatorId, false, 2, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1b } });
    expect(await nodes.getNodes(operatorId, false, 3, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId, false, 4, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId, false, 5, 10)).to.shallowDeepEqual({ length: 0 });

    // Global get
    expect(await nodes.getNodeCount(HashZero, false)).to.eq(3);
    expect(await nodes.getNodes(HashZero, false, 0, 10)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId1b } });
    expect(await nodes.getNodes(HashZero, false, 1, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId3 }, 1: { id: nodeId1b } });
    expect(await nodes.getNodes(HashZero, false, 2, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1b } });
    expect(await nodes.getNodes(HashZero, false, 3, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 4, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 5, 10)).to.shallowDeepEqual({ length: 0 });
  });

  it("Should require topolgy nodes have a price of 0", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    const node3: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h1", region: "r1", price: parseTokens("1") };

    // grant topology creator role
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    expect(await nodes.connect(operator).hasRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.true;

    // Create toplogy node with price of 0
    await expect(nodes.connect(operator).createNodes(operatorId, true, [{ ...node3 }])).to.be.revertedWith("topology price");
  });

  it("Should check if a node is reserved before deleting or setting host", async function () {
    // Allows calls from operator smart contract
    const operatorsSigner = await hre.ethers.getSigner(operators.address);

    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    const node3: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseTokens("1") };

    // Create node
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node3]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(HashZero);

    // Check last epoch slot
    const lastEpochSlot = await registry.lastEpochSlot();
    const nextEpochSlot = await registry.nextEpochSlot();

    // Create project
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(await token.connect(admin).approve(projects.address, parseTokens("100"))).to.be.ok;
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"))).to.be.ok;

    // Set last or next project of node to have a project to simulate "node is reserved" state
    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId1, lastEpochSlot, projectId1, { gasPrice: 0 });
    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId1, nextEpochSlot, projectId1, { gasPrice: 0 });

    // Delete reserved node
    await expect(nodes.connect(operator).deleteNodes(operatorId, false, [nodeId1])).to.be.revertedWith("node reserved");

    // Set host of reserved node
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId1], ["h2"], ["r2"])).to.be.revertedWith("node reserved");
  });

  it("Should allow importer role to unsafeImportData", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    const price = parseTokens("1");
    const node1: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };
    const node2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };

    // Create
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });

    // Create another
    const createNodes2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node2]));
    const createNodes2Result = await expectEvent(createNodes2, nodes, "NodeCreated");
    const { nodeId: nodeId2 } = createNodes2Result as Result;
    expect(nodeId2).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });

    // Save current node info
    const preImportNodes = await nodes.getNodes(operatorId, false, 0, 10);
    const nodesToImport = preImportNodes.map((n: ArmadaNodeStruct) => ({ ...n, id: newId() }));

    // Add the new nodes data using import
    expect(await nodes.connect(deployer).unsafeImportData(nodesToImport, [operator.address], false)).to.be.ok;

    const postImportNodes = await nodes.getNodes(operatorId, false, 0, 10);
    const postImportNodesIds = postImportNodes.map((n: ArmadaNodeStruct) => n.id);

    expect(postImportNodes).to.have.lengthOf(4);
    [...nodesToImport, ...preImportNodes].map((n) => {
      expect(postImportNodesIds).to.include(n.id);
      return n;
    });

    // Import duplicates
    await expect(nodes.connect(deployer).unsafeImportData(nodesToImport as ArmadaNodeStruct[], [operator.address], false)).to.be.revertedWith("duplicate id");
  });

  it("Should get nodes in range", async function () {
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"))).to.be.ok;

    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"))).to.be.ok;
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;

    const node1: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h1", region: "r1", price: parseTokens("0") };
    const node2: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h2", region: "r1", price: parseTokens("0") };
    const node3: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h3", region: "r1", price: parseTokens("1") };
    const node4: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h4", region: "r1", price: parseTokens("1") };
    const node5: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h5", region: "r1", price: parseTokens("0") };

    // Create
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, true, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;

    // Create
    const createNodes2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, true, [node2]));
    const createNodes2Result = await expectEvent(createNodes2, nodes, "NodeCreated");
    const { nodeId: nodeId2 } = createNodes2Result as Result;

    // Create
    const createNodes3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, false, [node3]));
    const createNodes3Result = await expectEvent(createNodes3, nodes, "NodeCreated");
    const { nodeId: nodeId3 } = createNodes3Result as Result;

    // Create
    const createNodes4 = await expectReceipt(nodes.connect(operator).createNodes(operatorId2, false, [node4]));
    const createNodes4Result = await expectEvent(createNodes4, nodes, "NodeCreated");
    const { nodeId: nodeId4 } = createNodes4Result as Result;

    // Create
    const createNodes5 = await expectReceipt(nodes.connect(operator).createNodes(operatorId2, true, [node5]));
    const createNodes5Result = await expectEvent(createNodes5, nodes, "NodeCreated");
    const { nodeId: nodeId5 } = createNodes5Result as Result;

    // Ranged get
    expect(await nodes.getNodeCount(operatorId1, true)).to.eq(2);
    expect(await nodes.getNodes(operatorId1, true, 0, 9)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });
    expect(await nodes.getNodes(operatorId1, true, 0, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });
    expect(await nodes.getNodes(operatorId1, true, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });
    expect(await nodes.getNodes(operatorId1, true, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, true, 1, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });
    expect(await nodes.getNodes(operatorId1, true, 1, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });
    expect(await nodes.getNodes(operatorId1, true, 1, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, true, 2, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, true, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, true, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, true, 5, 9)).to.shallowDeepEqual({ length: 0 });

    expect(await nodes.getNodeCount(operatorId1, false)).to.eq(1);
    expect(await nodes.getNodes(operatorId1, false, 0, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId3 } });
    expect(await nodes.getNodes(operatorId1, false, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId3 } });
    expect(await nodes.getNodes(operatorId1, false, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, false, 1, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, false, 2, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, false, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, false, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, false, 5, 9)).to.shallowDeepEqual({ length: 0 });

    expect(await nodes.getNodeCount(operatorId2, true)).to.eq(1);
    expect(await nodes.getNodes(operatorId2, true, 0, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId5 } });
    expect(await nodes.getNodes(operatorId2, true, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId5 } });
    expect(await nodes.getNodes(operatorId2, true, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, true, 1, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, true, 2, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, true, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, true, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, true, 5, 9)).to.shallowDeepEqual({ length: 0 });

    expect(await nodes.getNodeCount(operatorId2, false)).to.eq(1);
    expect(await nodes.getNodes(operatorId2, false, 0, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId4 } });
    expect(await nodes.getNodes(operatorId2, false, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId4 } });
    expect(await nodes.getNodes(operatorId2, false, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, false, 1, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, false, 2, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, false, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, false, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, false, 5, 9)).to.shallowDeepEqual({ length: 0 });

    // Global get
    expect(await nodes.getNodeCount(HashZero, true)).to.eq(3);
    expect(await nodes.getNodes(HashZero, true, 0, 9)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId1 }, 1: { id: nodeId2 }, 2: { id: nodeId5 } });
    expect(await nodes.getNodes(HashZero, true, 0, 3)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId1 }, 1: { id: nodeId2 }, 2: { id: nodeId5 } });
    expect(await nodes.getNodes(HashZero, true, 0, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });
    expect(await nodes.getNodes(HashZero, true, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });
    expect(await nodes.getNodes(HashZero, true, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, true, 1, 9)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId2 }, 1: { id: nodeId5 } });
    expect(await nodes.getNodes(HashZero, true, 1, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId2 }, 1: { id: nodeId5 } });
    expect(await nodes.getNodes(HashZero, true, 1, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });
    expect(await nodes.getNodes(HashZero, true, 1, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, true, 2, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId5 } });
    expect(await nodes.getNodes(HashZero, true, 2, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId5 } });
    expect(await nodes.getNodes(HashZero, true, 2, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, true, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, true, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, true, 5, 9)).to.shallowDeepEqual({ length: 0 });

    expect(await nodes.getNodeCount(HashZero, false)).to.eq(2);
    expect(await nodes.getNodes(HashZero, false, 0, 9)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId3 }, 1: { id: nodeId4 } });
    expect(await nodes.getNodes(HashZero, false, 0, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId3 }, 1: { id: nodeId4 } });
    expect(await nodes.getNodes(HashZero, false, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId3 } });
    expect(await nodes.getNodes(HashZero, false, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 1, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId4 } });
    expect(await nodes.getNodes(HashZero, false, 1, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId4 } });
    expect(await nodes.getNodes(HashZero, false, 1, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 2, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(HashZero, false, 5, 9)).to.shallowDeepEqual({ length: 0 });
  });

  it("Should change node host", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    // create another
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"))).to.be.ok;

    const node: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseTokens("1") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // check inputs
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], [], ["r2"])).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], [])).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], [""])).to.be.reverted;
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], [""], ["r2"])).to.be.revertedWith("empty host");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2".repeat(1000)], ["r2"])).to.be.revertedWith("host too long");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], ["r2".repeat(1000)])).to.be.revertedWith("region too long");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [HashZero], ["h2"], ["r2"])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).setNodeHosts(operatorId2, [nodeId], ["h2"], ["r2"])).to.be.revertedWith("operator mismatch");
    await expect(nodes.connect(operator).setNodeHosts(HashZero, [nodeId], ["h2"], ["r2"])).to.be.revertedWith("unknown operator");
    const notAdminOrOperator = project;
    await expect(nodes.connect(notAdminOrOperator).setNodeHosts(operatorId, [nodeId], ["h2"], ["r2"])).to.be.revertedWith("not admin or operator");

    const setNodeHosts = await expectReceipt(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], ["r2"]));
    const setNodeHostsResult = await expectEvent(setNodeHosts, nodes, "NodeHostChanged");
    expect(setNodeHostsResult).to.be.ok;
  });

  it("Should change node price", async function () {
    // allows calls from smart contract
    const operatorsSigner = await hre.ethers.getSigner(operators.address);

    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    // create another
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"))).to.be.ok;

    // create a content node
    const node: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseTokens("1") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // create a topology node
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r1", price: parseTokens("0") };
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;
    expect(nodeId0).to.not.equal(HashZero);

    // create project with escrow
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(await token.connect(admin).approve(projects.address, parseTokens("100"))).to.be.ok;
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"))).to.be.ok;

    // check inputs
    await expect(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [], { last: true, next: true })).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodePrices(operatorId, [HashZero], [parseTokens("2")], { last: true, next: true })).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).setNodePrices(operatorId2, [nodeId], [parseTokens("2")], { last: true, next: true })).to.be.revertedWith("operator mismatch");
    await expect(nodes.connect(operator).setNodePrices(operatorId, [nodeId0], [parseTokens("2")], { last: true, next: true })).to.be.revertedWith("topology node");

    // set price should work
    const setNodePrices = await expectReceipt(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseTokens("2")], { last: true, next: true }));
    const setNodePricesResult = await expectEvent(setNodePrices, nodes, "NodePriceChanged");
    expect(setNodePricesResult).to.be.ok;

    // set price should work
    const setNodePrices2 = await expectReceipt(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseTokens("2")], { last: true, next: false }));
    const setNodePrices2Result = await expectEvent(setNodePrices2, nodes, "NodePriceChanged");
    expect(setNodePrices2Result).to.be.ok;

    // set price should fail if node is reserved (e.g. last project is set)
    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId, await registry.lastEpochSlot(), projectId1, { gasPrice: 0 });
    await expect(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseTokens("2")], { last: true, next: true })).to.be.revertedWith("node reserved");
  });

  it("Should keep reservation if has enough escrow when raising price", async function () {
    // allow calls from smart contract
    const operatorsSigner = await hre.ethers.getSigner(operators.address);

    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    const node: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseTokens("0") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // create project with escrow
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(await token.connect(admin).approve(projects.address, parseTokens("100"))).to.be.ok;
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"))).to.be.ok;

    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId, await registry.nextEpochSlot(), projectId1, { gasPrice: 0 });
    await nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseTokens("1")], { last: false, next: true });
  });

  it("Should change node disabled status", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"))).to.be.ok;

    // create another
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"))).to.be.ok;

    const node: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseTokens("1") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(HashZero);
    expect(await nodes.getNodes(operatorId, false, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // check inputs
    await expect(nodes.connect(operator).setNodeDisabled(operatorId, [nodeId], [])).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodeDisabled(operatorId, [HashZero], [true])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).setNodeDisabled(operatorId2, [nodeId], [true])).to.be.revertedWith("operator mismatch");

    const setNodeDisabled = await expectReceipt(nodes.connect(operator).setNodeDisabled(operatorId, [nodeId], [true]));
    const setNodeDisabledResult = await expectEvent(setNodeDisabled, nodes, "NodeDisabledChanged");
    expect(setNodeDisabledResult).to.be.ok;
  });

  it("Should allow admin to pause and unpause nodes", async function () {
    // expect non admin call to revert
    await expect(nodes.connect(operator).pause()).to.be.revertedWith("not admin");

    // pause nodes
    expect(await nodes.connect(admin).pause()).to.be.ok;
    expect(await nodes.paused()).to.be.true;

    // unpause nodes
    expect(await nodes.connect(admin).unpause()).to.be.ok;
    expect(await nodes.paused()).to.be.false;
  });

  it("Should allow admin to use unsafeSetRegistry", async function () {
    // check current registry
    expect(await nodes.getRegistry()).to.equal(registry.address);

    // deploy new registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    // unsafeSetRegistry
    expect(await nodes.connect(admin).unsafeSetRegistry(newRegistry.address)).to.be.ok;

    // expect non admins to revert
    await expect(nodes.connect(operator).unsafeSetRegistry(newRegistry.address)).to.be.revertedWith("not admin");

    // check new registry
    expect(await nodes.getRegistry()).to.equal(newRegistry.address);
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    // deploy another registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    // implementation call is disallowed from EOA
    await expect(nodes.setNodePriceImpl(HashZero, 0, 0)).to.be.revertedWith("not impl");
    await expect(nodes.setNodeProjectImpl(HashZero, 0, HashZero)).to.be.revertedWith("not impl");
    await expect(nodes.advanceNodeEpochImpl(HashZero)).to.be.revertedWith("not impl");

    // implementation call is disallowed from unauthorized contract
    await expect(nodes.connect(newRegistry.signer).setNodePriceImpl(HashZero, 0, 0)).to.be.revertedWith("not impl");
    await expect(nodes.connect(newRegistry.signer).setNodeProjectImpl(HashZero, 0, HashZero)).to.be.revertedWith("not impl");
    await expect(nodes.connect(newRegistry.signer).advanceNodeEpochImpl(HashZero)).to.be.revertedWith("not impl");
  });

  it("Should check for valid inputs within the set price, set node, and advance epoch calls", async function () {
    // allows calls from smart contract
    const operatorsSigner = await hre.ethers.getSigner(operators.address);

    // create operator
    const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "e1", stake: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== HashZero);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    // create topology node
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r1", price: parseTokens("0") };
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;
    expect(nodeId0).to.not.equal(HashZero);

    // create project
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(await token.connect(admin).approve(projects.address, parseTokens("100"))).to.be.ok;
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"))).to.be.ok;

    // ensure the node id is valid
    await expect(nodes.connect(operatorsSigner).setNodePriceImpl(newId(), 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operatorsSigner).setNodeProjectImpl(newId(), 0, projectId1, { gasPrice: 0 })).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operatorsSigner).advanceNodeEpochImpl(newId(), { gasPrice: 0 })).to.be.revertedWith("unknown node");

    // ensure price can't be set for topology nodes
    await expect(nodes.connect(operatorsSigner).setNodePriceImpl(nodeId0, 0, 0, { gasPrice: 0 })).to.be.revertedWith("topology node");
    await expect(nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId0, 0, projectId1, { gasPrice: 0 })).to.be.revertedWith("topology node");
    await expect(nodes.connect(operatorsSigner).advanceNodeEpochImpl(nodeId0, { gasPrice: 0 })).to.be.revertedWith("topology node");
  });

  it("Should allow initialization without granting importer role", async function () {
    const nodesImplFactory = await hre.ethers.getContractFactory("ArmadaNodesImpl");
    const nodesImpl = <ArmadaNodes>await nodesImplFactory.deploy();

    const nodesFactory = await hre.ethers.getContractFactory("ArmadaNodes", { libraries: { ArmadaNodesImpl: nodesImpl.address } });
    const nodesArgs = [[admin.address], registry.address, false];
    const newNodes = <ArmadaNodes>await hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" });
    expect(newNodes).to.be.ok;

    // check deployer doesn't have importer role
    expect(await newNodes.hasRole(await newNodes.IMPORTER_ROLE(), deployer.address)).to.be.false;
  });

  it("Should prevent zero address admins", async function () {
    const nodesImplFactory = await hre.ethers.getContractFactory("ArmadaNodesImpl");
    const nodesImpl = <ArmadaNodes>await nodesImplFactory.deploy();

    const nodesFactory = await hre.ethers.getContractFactory("ArmadaNodes", { libraries: { ArmadaNodesImpl: nodesImpl.address } });
    const nodesArgs = [[AddressZero], registry.address, false];
    await expect(hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });
});
