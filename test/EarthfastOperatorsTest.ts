import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { Result, SignerWithAddress, ZeroAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, newId } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators, EarthfastOperatorStruct } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastOperators", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let deployer: SignerWithAddress;

  let usdc: USDC;
  let token: EarthfastToken;
  let registry: EarthfastRegistry;
  let nodes: EarthfastNodes;
  let operators: EarthfastOperators;

  let registryAddress: string;
  let nodesAddress: string;
  let operatorsAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, deployer } = await signers(hre));
    ({ usdc, token, registry, nodes, operators } = await fixtures(hre));

    registryAddress = await registry.getAddress();
    nodesAddress = await nodes.getAddress();
    operatorsAddress = await operators.getAddress();
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
    const stakePerNode = parseTokens("1");
    const operatorsFactory = await hre.ethers.getContractFactory("EarthfastOperators");
    const operatorsArgs = [[], registryAddress, stakePerNode, true];
    await expect(hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const stakePerNode = parseTokens("1");
    const operatorsFactory = await hre.ethers.getContractFactory("EarthfastOperators");
    const operatorsArgs = [[ZeroAddress], registryAddress, stakePerNode, true];
    await expect(hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should not grant importer role", async function () {
    const stakePerNode = parseTokens("1");
    const operatorsFactory = await hre.ethers.getContractFactory("EarthfastOperators");
    const operatorsArgs = [[admin.address], registryAddress, stakePerNode, false];
    expect(await hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" })).to.be.ok;
  });

  it("Should require topology node", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o", "@"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");

    // Deposit stake
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Grant creator role
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;

    // Create topology node
    const n0: EarthfastCreateNodeDataStruct = { topology: true, disabled: false, host: "h", region: "xx", price: parseUSDC("0") };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;

    // Create content node
    const n1: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h", region: "xx", price: parseUSDC("0") };
    const createNodes1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, [n1]));
    const createNodes1Result = await expectEvent(createNodes1, nodes, "NodeCreated");
    const { nodeId: nodeId1 } = createNodes1Result as Result;

    expect(await operators.requireTopologyNode(nodeId0, operator.address)).to.be.ok;
    await expect(operators.requireTopologyNode(nodeId0, deployer.address)).to.be.revertedWith("not operator");
    await expect(operators.requireTopologyNode(nodeId0, ZeroAddress)).to.be.revertedWith("zero sender");
    await expect(operators.requireTopologyNode(nodeId1, ZeroAddress)).to.be.revertedWith("not topology node");
  });

  it("Should check operator create parameters", async function () {
    await expect(operators.connect(admin).createOperator(ZeroAddress, "", "@")).to.be.revertedWith("zero owner");
    await expect(operators.connect(admin).createOperator(operator.address, "", "@")).to.be.revertedWith("empty name");
    await expect(operators.connect(admin).createOperator(operator.address, "x".repeat(257), "@")).to.be.revertedWith("name too long");
    await expect(operators.connect(admin).createOperator(operator.address, "o", "x".repeat(257))).to.be.revertedWith("email too long");
  });

  it("Should create/delete operators", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    // Get operator
    await expect(operators.getOperator(ZeroHash)).to.be.revertedWith("unknown operator");
    expect(await operators.getOperator(o1.id)).to.be.shallowDeepEqual(o1);

    // Create identical operator
    const o2: EarthfastOperatorStruct = { ...o1 };
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(o2.owner, o2.name, o2.email));
    [o2.id] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(o2.id !== ZeroHash);
    expect(o2.id !== o1.id);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 2, 0: o1, 1: o2 });

    // doesn't allow non-admin or operator to delete
    await expect(operators.connect(deployer).deleteOperator(o1.id)).to.be.revertedWith("not admin or operator");

    // Delete operator
    expect(await operators.connect(admin).deleteOperator(o1.id)).to.be.ok;
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o2 });

    // Delete missing operator
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("unknown operator");
    await expect(operators.connect(admin).deleteOperator(newId())).to.be.revertedWith("unknown operator");
    await expect(operators.connect(admin).deleteOperator(ZeroHash)).to.be.revertedWith("unknown operator");

    // Create previously deleted operator
    const o3: EarthfastOperatorStruct = { ...o1 };
    const createOperator3 = await expectReceipt(operators.connect(admin).createOperator(o3.owner, o3.name, o3.email));
    [o3.id] = await expectEvent(createOperator3, operators, "OperatorCreated");
    expect(o3.id !== ZeroHash);
    expect(o3.id !== o1.id);
    expect(o3.id !== o2.id);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 2, 0: o2, 1: o3 });
    expect(await operators.getOperatorCount()).to.eq(2);
  });

  it("Should change operator details", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id).to.not.eq(ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    const newEmail = "hello@gmail.com";
    const newName = "hello";
    await expect(operators.setOperatorProps(ZeroHash, newName, newEmail)).to.be.revertedWith("unknown operator");
    await expect(operators.setOperatorProps(o1.id, newName, newEmail)).to.be.revertedWith("not operator");
    await expect(operators.connect(operator).setOperatorProps(o1.id, "", newEmail)).to.be.revertedWith("empty name");
    await expect(operators.connect(operator).setOperatorProps(o1.id, "x".repeat(257), newEmail)).to.be.revertedWith("name too long");
    await expect(operators.connect(operator).setOperatorProps(o1.id, newName, "x".repeat(257))).to.be.revertedWith("email too long");
    expect(await operators.connect(operator).setOperatorProps(o1.id, newName, newEmail)).to.be.ok;

    const operatorDetails = await operators.getOperator(o1.id);
    expect(operatorDetails.name).to.eq(newName);
    expect(operatorDetails.email).to.eq(newEmail);
  });

  it("Should change operator owner", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    await expect(operators.connect(operator).setOperatorOwner(o1.id, ZeroAddress)).to.be.revertedWith("zero owner");
    await expect(operators.connect(operator).setOperatorOwner(ZeroHash, deployer.address)).to.be.revertedWith("unknown operator");
    await expect(operators.setOperatorOwner(o1.id, deployer.address)).to.be.revertedWith("not admin or operator");
    expect(await operators.connect(admin).setOperatorOwner(o1.id, admin.address)).to.be.ok;
    const operatorDetails = await operators.getOperator(o1.id);
    expect(operatorDetails.owner).to.eq(admin.address);
  });

  it("Should deposit/withdraw stake", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    // Create topology node as non-admin
    const n0: EarthfastCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r1", price: parseUSDC("0") };
    await expect(nodes.connect(operator).createNodes(o1.id, true, [n0])).to.be.revertedWith("not topology creator");

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;
    expect(nodeId0).to.not.equal(ZeroHash);

    // Create content nodes without stake
    const n1: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const n2: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price: parseUSDC("1") };
    await expect(nodes.connect(operator).createNodes(o1.id, false, [n1, n2])).to.be.revertedWith("not enough stake");

    // Deposit stake
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    await expect(operators.connect(admin).depositOperatorStake(ZeroHash, parseTokens("100"), ...operatorsPermit)).to.be.revertedWith("unknown operator");
    expect(await operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), ...operatorsPermit)).to.be.ok;
    expect(await token.connect(admin).balanceOf(operator.address)).to.equal(parseTokens("0"));
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(parseTokens("100"));
    expect((await operators.getOperator(o1.id)).stake).to.equal(parseTokens("100"));

    // Create content nodes
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, false, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    const { length: createNodes12Length, 0: { nodeId: nodeId1 }, 1: { nodeId: nodeId2 } } = createNodes12Result; // prettier-ignore
    expect(createNodes12Length).to.equal(2);
    expect(nodeId1).to.not.equal(ZeroHash);
    expect(nodeId2).to.not.equal(ZeroHash);

    // Withdraw stake with nodes
    await expect(operators.withdrawOperatorStake(o1.id, parseTokens("100"), operator.address)).to.be.revertedWith("not admin or operator");
    await expect(operators.connect(operator).withdrawOperatorStake(ZeroHash, parseTokens("100"), operator.address)).to.be.revertedWith("unknown operator");
    await expect(operators.connect(operator).withdrawOperatorStake(o1.id, parseTokens("100"), operator.address)).to.be.revertedWith("not enough stake");
    expect(await operators.connect(operator).withdrawOperatorStake(o1.id, parseTokens("98"), operator.address)).to.be.ok;
    expect(await token.connect(admin).balanceOf(operator.address)).to.equal(parseTokens("98"));
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(parseTokens("2"));
    expect((await operators.getOperator(o1.id)).stake).to.equal(parseTokens("2"));
    await expect(operators.connect(operator).withdrawOperatorStake(o1.id, parseTokens("2"), operator.address)).to.be.revertedWith("not enough stake");

    // Delete operator with nodes
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has nodes");

    // Delete topology node
    expect(await nodes.connect(operator).deleteNodes(o1.id, true, [nodeId0])).to.be.ok;

    // Delete operator with nodes
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has nodes");

    // Delete content nodes
    expect(await nodes.connect(operator).deleteNodes(o1.id, false, [nodeId1, nodeId2])).to.be.ok;

    // Delete operator with stake
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has stake");

    // Withdraw stake
    expect(await operators.connect(operator).withdrawOperatorStake(o1.id, parseTokens("2"), operator.address)).to.be.ok;
    expect(await token.connect(admin).balanceOf(operator.address)).to.equal(parseTokens("100"));
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(parseTokens("0"));
    expect((await operators.getOperator(o1.id)).stake).to.equal(parseTokens("0"));

    // Delete operator
    expect(await operators.connect(admin).deleteOperator(o1.id)).to.be.ok;
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 0 });
  });

  it("Should deposit stake with token allowance", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);

    // Check invalid permits
    await expect(operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), 1, 0, ZeroHash, ZeroHash)).to.be.revertedWith("invalid permit");
    await expect(operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), 0, 1, ZeroHash, ZeroHash)).to.be.revertedWith("invalid permit");
    await expect(operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), 0, 0, o1.id, ZeroHash)).to.be.revertedWith("invalid permit");

    // Deposit with allowance
    await expect(operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), 0, 0, ZeroHash, ZeroHash)).to.be.revertedWith("ERC20: insufficient allowance");
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });
    expect(await token.connect(admin).approve(operatorsAddress, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), 0, 0, ZeroHash, ZeroHash)).to.be.ok;
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: { ...o1, stake: parseTokens("100") } });
  });

  it("Should deposit/withdraw balance", async function () {
    // Create operators
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const o2: EarthfastOperatorStruct = { id: ZeroHash, name: "o2", owner: operator.address, email: "e2", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(o2.owner, o2.name, o2.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    [o2.id] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(o2.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 2, 0: o1, 1: o2 });

    // Deposit balance
    const operatorsPermit = await approve(hre, usdc, admin.address, operatorsAddress, parseUSDC("2"));
    await expect(operators.connect(admin).depositOperatorBalance(ZeroHash, parseUSDC("2"), ...operatorsPermit)).to.be.revertedWith("unknown operator");
    expect(await operators.connect(admin).depositOperatorBalance(o1.id, parseUSDC("2"), ...operatorsPermit)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(operator.address)).to.equal(parseUSDC("0"));
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(parseUSDC("2"));
    expect((await operators.getOperator(o1.id)).balance).to.equal(parseUSDC("2"));
    expect((await operators.getOperator(o2.id)).balance).to.equal(parseUSDC("0"));

    // Delete operator with balance
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has balance");

    // Withdraw balance
    await expect(operators.connect(operator).withdrawOperatorBalance(o2.id, parseUSDC("1"), operator.address)).to.be.revertedWith("not enough balance");
    await expect(operators.connect(operator).withdrawOperatorBalance(o1.id, parseUSDC("3"), operator.address)).to.be.revertedWith("not enough balance");
    expect(await operators.connect(operator).withdrawOperatorBalance(o1.id, parseUSDC("2"), operator.address)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(operator.address)).to.equal(parseUSDC("2"));
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(parseUSDC("0"));
    expect((await operators.getOperator(o1.id)).balance).to.equal(parseUSDC("0"));

    // Delete operators
    expect(await operators.connect(admin).deleteOperator(o1.id)).to.be.ok;
    expect(await operators.connect(admin).deleteOperator(o2.id)).to.be.ok;
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 0 });
  });

  it("Should deposit stake with token allowance", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);

    // Check invalid permits
    await expect(operators.connect(admin).depositOperatorBalance(o1.id, parseTokens("100"), 1, 0, ZeroHash, ZeroHash)).to.be.revertedWith("invalid permit");
    await expect(operators.connect(admin).depositOperatorBalance(o1.id, parseTokens("100"), 0, 1, ZeroHash, ZeroHash)).to.be.revertedWith("invalid permit");
    await expect(operators.connect(admin).depositOperatorBalance(o1.id, parseTokens("100"), 0, 0, o1.id, ZeroHash)).to.be.revertedWith("invalid permit");

    // Deposit with allowance
    await expect(operators.connect(admin).depositOperatorBalance(o1.id, parseTokens("100"), 0, 0, ZeroHash, ZeroHash)).to.be.revertedWith("ERC20: insufficient allowance");
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });
    expect(await usdc.connect(admin).approve(operatorsAddress, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorBalance(o1.id, parseTokens("100"), 0, 0, ZeroHash, ZeroHash)).to.be.ok;
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: { ...o1, balance: parseTokens("100") } });
  });

  it("Should allow importer to unsafeImportData", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    // Create identical operator
    const o2: EarthfastOperatorStruct = { ...o1 };
    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(o2.owner, o2.name, o2.email));
    [o2.id] = await expectEvent(createOperator2, operators, "OperatorCreated");
    expect(o2.id !== ZeroHash);
    expect(o2.id !== o1.id);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 2, 0: o1, 1: o2 });

    // operators
    const currentOperators = await operators.getOperators(0, 10);
    const operatorsToImport = currentOperators.map((o) => ({ ...o.toObject(true), id: newId() }));

    // unsafeImportData
    expect(await operators.connect(deployer).unsafeImportData(operatorsToImport, false)).to.be.ok;

    // import duplicates
    await expect(operators.connect(deployer).unsafeImportData(operatorsToImport, false)).to.be.revertedWith("duplicate id");

    // revoke importer role
    expect(await operators.hasRole(operators.IMPORTER_ROLE(), deployer.address)).to.be.true;
    expect(await operators.connect(deployer).unsafeImportData([], true)).to.be.ok;
    expect(await operators.hasRole(operators.IMPORTER_ROLE(), deployer.address)).to.be.false;
  });

  it("Should allow admin to pause and unpause", async function () {
    // pause
    expect(await operators.connect(admin).pause()).to.be.ok;
    expect(await operators.paused()).to.be.true;

    // unpause
    expect(await operators.connect(admin).unpause()).to.be.ok;
    expect(await operators.paused()).to.be.false;
  });

  it("Should allow admin to set stake per node", async function () {
    // check initial stake per node
    expect(await operators.getStakePerNode()).to.equal(parseTokens("1"));

    // setStakePerNode
    expect(await operators.connect(admin).setStakePerNode(parseTokens("1"))).to.be.ok;
    expect(await operators.getStakePerNode()).to.equal(parseTokens("1"));
  });

  it("Should allow admin to update registry address in operators", async function () {
    // check old registry
    expect(await operators.getRegistry()).to.equal(registryAddress);

    // create new registry
    const registryFactory = await hre.ethers.getContractFactory("EarthfastRegistry");
    const newRegistry = <EarthfastRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    const newRegistryAddress = await newRegistry.getAddress();

    // unsafeSetRegistry by non-admin
    await expect(operators.connect(operator).unsafeSetRegistry(newRegistryAddress)).to.be.revertedWith("not admin");

    // unsafeSetRegistry by admin
    expect(await operators.connect(admin).unsafeSetRegistry(newRegistryAddress)).to.be.ok;

    // check new registry
    expect(await operators.getRegistry()).to.equal(newRegistryAddress);
  });

  it("Should allow admin to adjust balances", async function () {
    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);

    // Deposit balance
    const operatorsPermit = await approve(hre, usdc, admin.address, operatorsAddress, parseUSDC("2"));
    expect(await operators.connect(admin).depositOperatorBalance(o1.id, parseUSDC("2"), ...operatorsPermit)).to.be.ok;
    expect((await operators.getOperator(o1.id)).balance).to.equal(parseUSDC("2"));

    // Adjust balance
    await expect(operators.connect(operator).unsafeSetBalances(0, 1, 3, 2)).to.be.revertedWith("not admin");
    await expect(operators.connect(admin).unsafeSetBalances(0, 1, 0, 1)).to.be.revertedWith("zero mul");
    expect(await operators.connect(admin).unsafeSetBalances(0, 1, 3, 2)).to.be.ok;
    expect((await operators.getOperator(o1.id)).balance).to.equal(parseUSDC("3"));
  });

  it("Should allow admin to upgrade operators contract address", async function () {
    const notAdminOperatorsFactory = await hre.ethers.getContractFactory("EarthfastOperators", { signer: operator });
    const adminOperatorsFactory = await hre.ethers.getContractFactory("EarthfastOperators", { signer: admin });

    const proxy = operators;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminOperatorsFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminOperatorsFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    const nodesSigner = await hre.ethers.getSigner(nodesAddress);

    // unknown operator id is disallowed
    await expect(operators.connect(nodesSigner).setOperatorBalanceImpl(ZeroHash, 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown operator");

    // implementation call is disallowed from unauthorized address
    await expect(operators.setOperatorBalanceImpl(ZeroHash, 0, 0)).to.be.revertedWith("not impl");
  });

  it("should allow admin to force delete operators with nodes", async function () {
    // create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(o1.id !== ZeroHash);
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 1, 0: o1 });

    // Deposit balance
    let operatorsPermit = await approve(hre, usdc, admin.address, operatorsAddress, parseUSDC("2"));
    expect(await operators.connect(admin).depositOperatorBalance(o1.id, parseUSDC("2"), ...operatorsPermit)).to.be.ok;
    expect((await operators.getOperator(o1.id)).balance).to.equal(parseUSDC("2"));

    // Deposit stake
    operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), ...operatorsPermit)).to.be.ok;
    expect((await operators.getOperator(o1.id)).stake).to.equal(parseTokens("100"));

    // create nodes
    const n1: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const n2: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price: parseUSDC("1") };
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, false, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    const { 0: { nodeId: nodeId1 }, 1: { nodeId: nodeId2 } } = createNodes12Result; // prettier-ignore

    // verify can't delete operator with nodes
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has nodes");

    // verify can't delete operator with nodes
    expect(await nodes.connect(admin).deleteNodes(o1.id, false, [nodeId1, nodeId2])).to.be.ok;

    // verify can't delete operator with stake
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has stake");
    // withdraw operator stake
    expect(await operators.connect(admin).withdrawOperatorStake(o1.id, parseTokens("100"), operator.address)).to.be.ok;

    // verify can delete operator with balance
    await expect(operators.connect(admin).deleteOperator(o1.id)).to.be.revertedWith("operator has balance");
    // withdraw operator balance
    expect(await operators.connect(admin).withdrawOperatorBalance(o1.id, parseUSDC("2"), operator.address)).to.be.ok;

    // delete operator
    expect(await operators.connect(admin).deleteOperator(o1.id)).to.be.ok;
    expect(await operators.getOperators(0, 10)).to.shallowDeepEqual({ length: 0 });
  });
});
