import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { Result, SignerWithAddress, ZeroAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, newId } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { EarthfastCreateNodeDataStruct, EarthfastNodes, EarthfastNodeStruct } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators, EarthfastOperatorStruct } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastNodes", function () {
  let admin: SignerWithAddress;
  let deployer: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let usdc: USDC;
  let token: EarthfastToken;
  let nodes: EarthfastNodes;
  let operators: EarthfastOperators;
  let registry: EarthfastRegistry;
  let projects: EarthfastProjects;

  let snapshotId: string;

  // store contract addresses after awaiting fixture
  let operatorsAddress: string;
  let registryAddress: string;
  let projectsAddress: string;

  async function fixture() {
    ({ admin, deployer, operator, project } = await signers(hre));
    ({ usdc, token, nodes, operators, registry, projects } = await fixtures(hre));

    // set contract addresses as string
    operatorsAddress = await operators.getAddress();
    registryAddress = await registry.getAddress();
    projectsAddress = await projects.getAddress();
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should disallow empty admins", async function () {
    const nodesImplFactory = await hre.ethers.getContractFactory("EarthfastNodesImpl");
    const nodesImpl = await nodesImplFactory.deploy();
    const nodesImplAddress = await nodesImpl.getAddress();

    const nodesFactory = await hre.ethers.getContractFactory("EarthfastNodes", { libraries: { EarthfastNodesImpl: nodesImplAddress } });
    const nodesArgs = [[], registryAddress, true];
    await expect(hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" })).to.be.revertedWith("no admins");
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
    await expect(nodes.connect(admin).unsafeImportData([], false)).to.be.revertedWith(`AccessControl: account ${admin.address.toLowerCase()} is missing role ${await nodes.IMPORTER_ROLE()}`);
    expect(await nodes.connect(deployer).unsafeImportData([], false)).to.be.ok;
    expect(await nodes.connect(deployer).unsafeImportData([], true)).to.be.ok;
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
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    const operatorsPermit2 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"), ...operatorsPermit2)).to.be.ok;

    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const node3: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };

    // Ensure all the create nodes checks are working
    const emptyHostNode1 = { ...node1, host: "" };
    await expect(nodes.connect(operator).createNodes(operatorId, [emptyHostNode1])).to.be.revertedWith("empty host");
    const hostTooLongNode1 = { ...node1, host: "h".repeat(10000) };
    await expect(nodes.connect(operator).createNodes(operatorId, [hostTooLongNode1])).to.be.revertedWith("host too long");
    const emptyRegionNode1 = { ...node1, region: "" };
    await expect(nodes.connect(operator).createNodes(operatorId, [emptyRegionNode1])).to.be.revertedWith("empty region");
    const regionTooLongNode1 = { ...node1, region: "r".repeat(10000) };
    await expect(nodes.connect(operator).createNodes(operatorId, [regionTooLongNode1])).to.be.revertedWith("region too long");
    await expect(nodes.connect(admin).createNodes(operatorId, [regionTooLongNode1])).to.be.revertedWith("not operator");

    // Create node
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });

    // Create another
    const createNodes2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const createNodes2Result = await expectEvent(createNodes2, nodes, "NodeCreated");
    const { nodeId: nodeId2 } = createNodes2Result as Result;
    expect(nodeId2).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });

    // Ensure all the delete nodes checks are working
    await expect(nodes.connect(operator).deleteNodes(operatorId2, [nodeId1])).to.be.revertedWith("operator mismatch");
    const invalidNodeId = newId();
    await expect(nodes.getNode(invalidNodeId)).to.be.revertedWith("unknown node");

    // Delete
    expect(await nodes.connect(operator).deleteNodes(operatorId, [nodeId1])).to.be.ok;
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });

    // Delete missing
    await expect(nodes.connect(operator).deleteNodes(operatorId, [nodeId1])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).deleteNodes(operatorId, [newId()])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).deleteNodes(operatorId, [ZeroHash])).to.be.revertedWith("unknown node");

    // Create another
    const createNodes3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node3]));
    const createNodes3Result = await expectEvent(createNodes3, nodes, "NodeCreated");
    const { nodeId: nodeId3 } = createNodes3Result as Result;
    expect(nodeId3).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId2 }, 1: { id: nodeId3 } });

    // Create another
    const createNodes1b = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node3]));
    const createNodes1bResult = await expectEvent(createNodes1b, nodes, "NodeCreated");
    const { nodeId: nodeId1b } = createNodes1bResult as Result;
    expect(nodeId1b).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId1b } });

    // Ranged get
    expect(await nodes.getNodeCount(operatorId)).to.eq(3);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId1b } });
    expect(await nodes.getNodes(operatorId, 1, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId3 }, 1: { id: nodeId1b } });
    expect(await nodes.getNodes(operatorId, 2, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1b } });
    expect(await nodes.getNodes(operatorId, 3, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId, 4, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId, 5, 10)).to.shallowDeepEqual({ length: 0 });

    // Global get
    expect(await nodes.getNodeCount(ZeroHash)).to.eq(3);
    expect(await nodes.getNodes(ZeroHash, 0, 10)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId1b } });
    expect(await nodes.getNodes(ZeroHash, 1, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId3 }, 1: { id: nodeId1b } });
    expect(await nodes.getNodes(ZeroHash, 2, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1b } });
    expect(await nodes.getNodes(ZeroHash, 3, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(ZeroHash, 4, 10)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(ZeroHash, 5, 10)).to.shallowDeepEqual({ length: 0 });
  });

  it("Should check if a node is reserved before deleting or setting host", async function () {
    // Allows calls from operator smart contract
    const operatorsSigner = await hre.ethers.getSigner(operatorsAddress);

    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const node3: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };

    // Create node
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node3]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(ZeroHash);

    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(admin.address, projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;

    // Set last or next project of node to have a project to simulate "node is reserved" state
    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId1, 0, projectId1, { gasPrice: 0 });
    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId1, 1, projectId1, { gasPrice: 0 });

    // Delete reserved node
    await expect(nodes.connect(operator).deleteNodes(operatorId, [nodeId1])).to.be.revertedWith("node reserved");

    // Set host of reserved node
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId1], ["h2"], ["r2"])).to.be.revertedWith("node reserved");
  });

  it("Should allow importer role to unsafeImportData", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };

    // Create
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });

    // Create another
    const createNodes2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node2]));
    const createNodes2Result = await expectEvent(createNodes2, nodes, "NodeCreated");
    const { nodeId: nodeId2 } = createNodes2Result as Result;
    expect(nodeId2).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });

    // Save current node info
    const preImportNodes = await nodes.getNodes(operatorId, 0, 10);
    const nodesToImport = preImportNodes.map((n: EarthfastNodeStruct) => ({ ...n.toObject(true), id: newId() }));

    // Add the new nodes data using import
    expect(await nodes.connect(deployer).unsafeImportData(nodesToImport, false)).to.be.ok;

    const postImportNodes = await nodes.getNodes(operatorId, 0, 10);
    const postImportNodesIds = postImportNodes.map((n: EarthfastNodeStruct) => n.id);

    expect(postImportNodes).to.have.lengthOf(4);
    [...nodesToImport, ...preImportNodes].map((n) => {
      expect(postImportNodesIds).to.include(n.id);
      return n;
    });

    // Import duplicates
    await expect(nodes.connect(deployer).unsafeImportData(nodesToImport as EarthfastNodeStruct[], false)).to.be.revertedWith("duplicate id");
  });

  it("Should allow admin to adjust prices", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create node
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;
    expect(nodeId1).to.not.equal(ZeroHash);

    // Adjust price
    await expect(nodes.connect(operator).unsafeSetPrices(0, 1, 3, 2)).to.be.revertedWith("not admin");
    await expect(nodes.connect(admin).unsafeSetPrices(0, 1, 0, 1)).to.be.revertedWith("zero mul");
    expect(await nodes.connect(admin).unsafeSetPrices(0, 1, 3, 2)).to.be.ok;
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(parseUSDC("1.5"));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(parseUSDC("1.5"));
  });

  it("Should get nodes in range", async function () {
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit1 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit1)).to.be.ok;

    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    const operatorsPermit2 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"), ...operatorsPermit2)).to.be.ok;

    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("0") };
    const node2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r1", price: parseUSDC("0") };
    const node3: EarthfastCreateNodeDataStruct = { disabled: false, host: "h3", region: "r1", price: parseUSDC("1") };
    const node4: EarthfastCreateNodeDataStruct = { disabled: false, host: "h4", region: "r1", price: parseUSDC("1") };
    const node5: EarthfastCreateNodeDataStruct = { disabled: false, host: "h5", region: "r1", price: parseUSDC("0") };

    // Create
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, [node1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;

    // Create
    const createNodes2 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, [node2]));
    const createNodes2Result = await expectEvent(createNodes2, nodes, "NodeCreated");
    const { nodeId: nodeId2 } = createNodes2Result as Result;

    // Create
    const createNodes3 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, [node3]));
    const createNodes3Result = await expectEvent(createNodes3, nodes, "NodeCreated");
    const { nodeId: nodeId3 } = createNodes3Result as Result;

    // Create
    const createNodes4 = await expectReceipt(nodes.connect(operator).createNodes(operatorId2, [node4]));
    const createNodes4Result = await expectEvent(createNodes4, nodes, "NodeCreated");
    const { nodeId: nodeId4 } = createNodes4Result as Result;

    // Create
    const createNodes5 = await expectReceipt(nodes.connect(operator).createNodes(operatorId2, [node5]));
    const createNodes5Result = await expectEvent(createNodes5, nodes, "NodeCreated");
    const { nodeId: nodeId5 } = createNodes5Result as Result;

    // Ranged get
    expect(await nodes.getNodeCount(operatorId1)).to.eq(3);
    expect(await nodes.getNodes(operatorId1, 0, 9)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId1 }, 1: { id: nodeId2 }, 2: { id: nodeId3 } });
    expect(await nodes.getNodes(operatorId1, 0, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });
    expect(await nodes.getNodes(operatorId1, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });
    expect(await nodes.getNodes(operatorId1, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, 1, 9)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId2 }, 1: { id: nodeId3 } });
    expect(await nodes.getNodes(operatorId1, 1, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });
    expect(await nodes.getNodes(operatorId1, 1, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, 2, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId3 } });
    expect(await nodes.getNodes(operatorId1, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId1, 5, 9)).to.shallowDeepEqual({ length: 0 });

    expect(await nodes.getNodeCount(operatorId2)).to.eq(2);
    expect(await nodes.getNodes(operatorId2, 0, 9)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId4 }, 1: { id: nodeId5 } });
    expect(await nodes.getNodes(operatorId2, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId4 } });
    expect(await nodes.getNodes(operatorId2, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, 1, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId5 } });
    expect(await nodes.getNodes(operatorId2, 2, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, 3, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, 4, 9)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(operatorId2, 5, 9)).to.shallowDeepEqual({ length: 0 });

    // Global get
    expect(await nodes.getNodeCount(ZeroHash)).to.eq(5);
    expect(await nodes.getNodes(ZeroHash, 0, 9)).to.shallowDeepEqual({ length: 5, 0: { id: nodeId1 }, 1: { id: nodeId2 }, 2: { id: nodeId3 }, 3: { id: nodeId4 }, 4: { id: nodeId5 } });
    expect(await nodes.getNodes(ZeroHash, 0, 3)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId1 }, 1: { id: nodeId2 }, 2: { id: nodeId3 } });
    expect(await nodes.getNodes(ZeroHash, 0, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId1 }, 1: { id: nodeId2 } });
    expect(await nodes.getNodes(ZeroHash, 0, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId1 } });
    expect(await nodes.getNodes(ZeroHash, 0, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(ZeroHash, 1, 9)).to.shallowDeepEqual({ length: 4, 0: { id: nodeId2 }, 1: { id: nodeId3 }, 2: { id: nodeId4 }, 3: { id: nodeId5 } });
    expect(await nodes.getNodes(ZeroHash, 1, 2)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId2 }, 1: { id: nodeId3 } });
    expect(await nodes.getNodes(ZeroHash, 1, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId2 } });
    expect(await nodes.getNodes(ZeroHash, 1, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(ZeroHash, 2, 9)).to.shallowDeepEqual({ length: 3, 0: { id: nodeId3 }, 1: { id: nodeId4 }, 2: { id: nodeId5 } });
    expect(await nodes.getNodes(ZeroHash, 2, 1)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId3 } });
    expect(await nodes.getNodes(ZeroHash, 2, 0)).to.shallowDeepEqual({ length: 0 });
    expect(await nodes.getNodes(ZeroHash, 3, 9)).to.shallowDeepEqual({ length: 2, 0: { id: nodeId4 }, 1: { id: nodeId5 } });
    expect(await nodes.getNodes(ZeroHash, 4, 9)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId5 } });
    expect(await nodes.getNodes(ZeroHash, 5, 9)).to.shallowDeepEqual({ length: 0 });
  });

  it("Should change node host", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // create another
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    const operatorsPermit2 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"), ...operatorsPermit2)).to.be.ok;

    const node: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // check inputs
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], [], ["r2"])).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], [])).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], [""])).to.be.reverted;
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], [""], ["r2"])).to.be.revertedWith("empty host");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2".repeat(1000)], ["r2"])).to.be.revertedWith("host too long");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], ["r2".repeat(1000)])).to.be.revertedWith("region too long");
    await expect(nodes.connect(operator).setNodeHosts(operatorId, [ZeroHash], ["h2"], ["r2"])).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).setNodeHosts(operatorId2, [nodeId], ["h2"], ["r2"])).to.be.revertedWith("operator mismatch");
    await expect(nodes.connect(operator).setNodeHosts(ZeroHash, [nodeId], ["h2"], ["r2"])).to.be.revertedWith("unknown operator");
    const notAdminOrOperator = project;
    await expect(nodes.connect(notAdminOrOperator).setNodeHosts(operatorId, [nodeId], ["h2"], ["r2"])).to.be.revertedWith("not admin or operator");

    const setNodeHosts = await expectReceipt(nodes.connect(operator).setNodeHosts(operatorId, [nodeId], ["h2"], ["r2"]));
    const setNodeHostsResult = await expectEvent(setNodeHosts, nodes, "NodeHostChanged");
    expect(setNodeHostsResult).to.be.ok;
  });

  it("Should change node price", async function () {
    // allows calls from smart contract
    const operatorsSigner = await hre.ethers.getSigner(operatorsAddress);

    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // create another
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    const operatorsPermit2 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"), ...operatorsPermit2)).to.be.ok;

    // create a content node
    const node: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // create project with escrow
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(admin.address, projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;

    // check inputs
    await expect(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [], { last: true, next: true })).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodePrices(operatorId, [ZeroHash], [parseUSDC("2")], { last: true, next: true })).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operator).setNodePrices(operatorId2, [nodeId], [parseUSDC("2")], { last: true, next: true })).to.be.revertedWith("operator mismatch");

    // set price should work
    const setNodePrices = await expectReceipt(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseUSDC("2")], { last: true, next: true }));
    const setNodePricesResult = await expectEvent(setNodePrices, nodes, "NodePriceChanged");
    expect(setNodePricesResult).to.be.ok;

    // set price should work
    const setNodePrices2 = await expectReceipt(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseUSDC("2")], { last: true, next: false }));
    const setNodePrices2Result = await expectEvent(setNodePrices2, nodes, "NodePriceChanged");
    expect(setNodePrices2Result).to.be.ok;

    // set price should fail if node is reserved (e.g. last project is set)
    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId, 0, projectId1, { gasPrice: 0 });
    await expect(nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseUSDC("2")], { last: true, next: true })).to.be.revertedWith("node reserved");
  });

  it("Should keep reservation if has enough escrow when raising price", async function () {
    // allow calls from smart contract
    const operatorsSigner = await hre.ethers.getSigner(operatorsAddress);

    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const node: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("0") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // create project with escrow
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(admin.address, projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;

    await nodes.connect(operatorsSigner).setNodeProjectImpl(nodeId, 1, projectId1, { gasPrice: 0 });
    await nodes.connect(operator).setNodePrices(operatorId, [nodeId], [parseUSDC("1")], { last: false, next: true });
  });

  it("Should change node disabled status", async function () {
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // create another
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    const operatorsPermit2 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"), ...operatorsPermit2)).to.be.ok;

    const node: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node]));
    const createNodesResult = await expectEvent(createNodes, nodes, "NodeCreated");
    const { nodeId } = createNodesResult as Result;
    expect(nodeId).to.not.equal(ZeroHash);
    expect(await nodes.getNodes(operatorId, 0, 10)).to.shallowDeepEqual({ length: 1, 0: { id: nodeId } });

    // check inputs
    await expect(nodes.connect(operator).setNodeDisabled(operatorId, [nodeId], [])).to.be.revertedWith("length mismatch");
    await expect(nodes.connect(operator).setNodeDisabled(operatorId, [ZeroHash], [true])).to.be.revertedWith("unknown node");
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
    expect(await nodes.getRegistry()).to.equal(registryAddress);

    // deploy new registry
    const registryFactory = await hre.ethers.getContractFactory("EarthfastRegistry");
    const newRegistry = <EarthfastRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    const newRegistryAddress = await newRegistry.getAddress();

    // unsafeSetRegistry
    expect(await nodes.connect(admin).unsafeSetRegistry(newRegistryAddress)).to.be.ok;

    // expect non admins to revert
    await expect(nodes.connect(operator).unsafeSetRegistry(newRegistryAddress)).to.be.revertedWith("not admin");

    // check new registry
    expect(await nodes.getRegistry()).to.equal(newRegistryAddress);
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    // implementation call is disallowed from EOA
    await expect(nodes.setNodePriceImpl(ZeroHash, 0, 0)).to.be.revertedWith("not impl");
    await expect(nodes.setNodeProjectImpl(ZeroHash, 0, ZeroHash)).to.be.revertedWith("not impl");
    await expect(nodes.advanceNodeEpochImpl(ZeroHash)).to.be.revertedWith("not impl");

    // implementation call is disallowed from unauthorized signer
    await expect(nodes.connect(deployer).setNodePriceImpl(ZeroHash, 0, 0)).to.be.revertedWith("not impl");
    await expect(nodes.connect(deployer).setNodeProjectImpl(ZeroHash, 0, ZeroHash)).to.be.revertedWith("not impl");
    await expect(nodes.connect(deployer).advanceNodeEpochImpl(ZeroHash)).to.be.revertedWith("not impl");
  });

  it("Should check for valid inputs within the set price, set node, and advance epoch calls", async function () {
    // allows calls from smart contract
    const operatorsSigner = await hre.ethers.getSigner(operatorsAddress);

    // create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    // create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(admin.address, projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;

    // ensure the node id is valid
    await expect(nodes.connect(operatorsSigner).setNodePriceImpl(newId(), 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operatorsSigner).setNodeProjectImpl(newId(), 0, projectId1, { gasPrice: 0 })).to.be.revertedWith("unknown node");
    await expect(nodes.connect(operatorsSigner).advanceNodeEpochImpl(newId(), { gasPrice: 0 })).to.be.revertedWith("unknown node");
  });

  it("Should allow initialization without granting importer role", async function () {
    const nodesImplFactory = await hre.ethers.getContractFactory("EarthfastNodesImpl");
    const nodesImpl = <EarthfastNodes>await nodesImplFactory.deploy();
    const nodesImplAddress = await nodesImpl.getAddress();

    const nodesFactory = await hre.ethers.getContractFactory("EarthfastNodes", { libraries: { EarthfastNodesImpl: nodesImplAddress } });
    const nodesArgs = [[admin.address], registryAddress, false];
    const newNodes = <EarthfastNodes>await hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" });
    expect(newNodes).to.be.ok;

    // check deployer doesn't have importer role
    expect(await newNodes.hasRole(await newNodes.IMPORTER_ROLE(), deployer.address)).to.be.false;
  });

  it("Should prevent zero address admins", async function () {
    const nodesImplFactory = await hre.ethers.getContractFactory("EarthfastNodesImpl");
    const nodesImpl = <EarthfastNodes>await nodesImplFactory.deploy();
    const nodesImplAddress = await nodesImpl.getAddress();

    const nodesFactory = await hre.ethers.getContractFactory("EarthfastNodes", { libraries: { EarthfastNodesImpl: nodesImplAddress } });
    const nodesArgs = [[ZeroAddress], registryAddress, false];
    await expect(hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });
});
