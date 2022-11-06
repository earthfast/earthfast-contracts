import { AddressZero, HashZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Result } from "ethers/lib/utils";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine } from "../lib/test";
import { parseTokens, signers } from "../lib/util";
import { ArmadaBilling } from "../typechain-types/contracts/ArmadaBilling";
import { ArmadaCreateNodeDataStruct, ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators, ArmadaOperatorStruct } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";

describe("ArmadaRegistry", function () {
  let admin: SignerWithAddress;
  let deployer: SignerWithAddress;
  let operator: SignerWithAddress;

  let token: ArmadaToken;
  let registry: ArmadaRegistry;
  let billing: ArmadaBilling;
  let nodes: ArmadaNodes;
  let operators: ArmadaOperators;
  let projects: ArmadaProjects;
  let reservations: ArmadaReservations;

  let epochLength: number;
  let snapshotId: string;

  async function fixture() {
    ({ admin, deployer, operator } = await signers(hre));
    ({ token, operators, projects, reservations, nodes, billing, registry } = await fixtures(hre));

    epochLength = (await registry.getLastEpochLength()).toNumber();
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should be able to get epoch lengths", async function () {
    expect(await registry.getLastEpochLength()).to.equal(100);
    expect(await registry.getNextEpochLength()).to.equal(100);
  });

  it("Should emergency deposit/withdraw", async function () {
    const tokens = parseTokens("100");

    // Deposit
    expect(await token.connect(admin).transfer(registry.address, tokens)).to.be.ok;
    expect(await token.connect(admin).balanceOf(registry.address)).to.equal(tokens);

    // Deposit
    expect(await token.connect(admin).transfer(deployer.address, tokens)).to.be.ok;
    expect(await token.connect(deployer).transfer(registry.address, tokens)).to.be.ok;
    expect(await token.connect(deployer).balanceOf(registry.address)).to.equal(tokens.mul(2));

    // Withdraw
    await expect(registry.connect(deployer).unsafeWithdraw(admin.address, tokens)).to.be.revertedWith("not admin");

    // Withdraw
    expect(await registry.connect(admin).unsafeWithdraw(admin.address, tokens)).to.be.ok;
    expect(await token.connect(admin).balanceOf(registry.address)).to.equal(tokens.mul(1));

    // Withdraw
    expect(await registry.connect(admin).unsafeWithdraw(admin.address, tokens)).to.be.ok;
    expect(await token.connect(admin).balanceOf(registry.address)).to.equal(tokens.mul(0));
    await expect(registry.connect(admin).unsafeWithdraw(admin.address, tokens)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should respect reconciliation order", async function () {
    // Create operator
    const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "e1", stake: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    const [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    expect(await token.connect(admin).approve(operators.address, parseTokens("100"))).to.be.ok;
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"))).to.be.ok;

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r0", price: parseTokens("0") };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;

    // Create content nodes
    const n1: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseTokens("1") };
    const n2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price: parseTokens("1") };
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, false, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    const [{ nodeId: nodeId1 }, { nodeId: nodeId2 }] = createNodes12Result;

    await expect(billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("not reconciling");
    await expect(billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.revertedWith("not reconciling");
    await expect(registry.connect(operator).advanceEpoch(nodeId0)).to.be.revertedWith("not reconciling");

    await mine(hre, epochLength);

    await expect(operators.connect(admin).createOperator(operator.address, "o", "e")).to.be.revertedWith("reconciling");
    await expect(registry.connect(operator).advanceEpoch(nodeId0)).to.be.revertedWith("billing in progress");
    await expect(billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.revertedWith("billing in progress");
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;

    await expect(operators.connect(admin).createOperator(operator.address, "o", "e")).to.be.revertedWith("reconciling");
    await expect(billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("billing finished");
    await expect(registry.connect(operator).advanceEpoch(nodeId0)).to.be.revertedWith("renewal in progress");
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;

    await expect(operators.connect(admin).createOperator(operator.address, "o", "e")).to.be.revertedWith("reconciling");
    await expect(billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("renewal in progress");
    await expect(billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.revertedWith("renewal finished");
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;

    expect(await operators.connect(admin).createOperator(operator.address, "o", "e")).to.be.ok;
    await expect(billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("not reconciling");
    await expect(billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.revertedWith("not reconciling");
    await expect(registry.connect(operator).advanceEpoch(nodeId0)).to.be.revertedWith("not reconciling");
  });

  it("Should allow admin to unsafeSetProjects, unsafeSetToken & unsafeSetOperators", async function () {
    // Get projects address
    expect(await registry.connect(operator).getProjects()).to.be.deep.equal(projects.address);

    // Get operators address
    expect(await registry.connect(operator).getOperators()).to.be.deep.equal(operators.address);

    // Get token address
    expect(await registry.connect(operator).getToken()).to.be.deep.equal(token.address);

    // Should skip token approval if new projects is zero address
    expect(await registry.connect(admin).unsafeSetProjects(AddressZero)).to.be.ok;
    expect(await token.allowance(registry.address, AddressZero)).to.be.deep.equal(0);
    expect(await registry.connect(admin).unsafeSetToken(token.address)).to.be.ok;

    // Set projects address to real address should pass
    const projectsFactory = await hre.ethers.getContractFactory("ArmadaProjects");
    const projectsArgs = [[admin.address], registry.address, true];
    const newProjectsContract = <ArmadaProjects>await hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" });
    expect(await registry.connect(admin).unsafeSetProjects(newProjectsContract.address)).to.be.ok;
    expect(await registry.connect(operator).getProjects()).to.be.deep.equal(newProjectsContract.address);

    // Should skip token approval if new operators is zero address
    expect(await registry.connect(admin).unsafeSetOperators(AddressZero)).to.be.ok;
    expect(await token.allowance(registry.address, AddressZero)).to.be.deep.equal(0);
    expect(await registry.connect(admin).unsafeSetToken(token.address)).to.be.ok;

    // Set operators address
    const stakePerNode = parseTokens("1");
    const operatorsFactory = await hre.ethers.getContractFactory("ArmadaOperators");
    const operatorsArgs = [[admin.address], registry.address, stakePerNode, true];
    const newOperatorsContract = <ArmadaOperators>await hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" });
    expect(await registry.connect(admin).unsafeSetOperators(newOperatorsContract.address)).to.be.ok;
    expect(await registry.connect(operator).getOperators()).to.be.deep.equal(newOperatorsContract.address);

    // Set token address
    const tokenFactory = await hre.ethers.getContractFactory("ArmadaToken");
    const tokenArgs = [[admin.address], [admin.address], [admin.address]];
    const newTokenContract = <ArmadaToken>await tokenFactory.deploy(...tokenArgs);
    expect(await registry.connect(admin).unsafeSetToken(newTokenContract.address)).to.be.ok;
    expect(await registry.connect(operator).getToken()).to.be.deep.equal(newTokenContract.address);
  });

  it("Should allow admin to pause and unpause registry", async function () {
    // pause
    await expect(registry.pause()).to.be.revertedWith("not admin");
    expect(await registry.connect(admin).pause()).to.be.ok;

    // check paused
    expect(await registry.paused()).to.be.true;

    // unpause
    await expect(registry.unpause()).to.be.revertedWith("not admin");
    expect(await registry.connect(admin).unpause()).to.be.ok;

    // check unpaused
    expect(await registry.paused()).to.be.false;
  });

  it("Should allow admin to update version", async function () {
    // Update version
    await expect(registry.setVersion("v1")).to.be.revertedWith("not admin");
    expect(await registry.connect(admin).setVersion("v1")).to.be.ok;

    // Check version
    expect(await registry.getVersion()).to.be.equal("v1");
  });

  it("Should be able to get nonce", async function () {
    // Check nonce
    expect(await registry.getNonce()).to.eq(parseTokens("0"));

    // Verify non-onlyImpl cannot call newNonceImpl
    await expect(registry.newNonceImpl()).to.be.revertedWith("not impl");
  });

  it("Should allow admin to unsafeSetBilling, unsafeSetNodes & unsafeSetReservations", async function () {
    // Get billing address
    expect(await registry.getBilling()).to.be.deep.equal(billing.address);

    // Get nodes address
    expect(await registry.getNodes()).to.be.deep.equal(nodes.address);

    // Get reservations address
    expect(await registry.getReservations()).to.be.deep.equal(reservations.address);

    // Deploy new billing contract
    const billingFactory = await hre.ethers.getContractFactory("ArmadaBilling");
    const billingArgs = [[admin.address], registry.address];
    const newBilling = <ArmadaBilling>await hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" });

    // Set new billing
    await expect(registry.unsafeSetBilling(newBilling.address)).to.be.revertedWith("not admin");
    expect(await registry.connect(admin).unsafeSetBilling(newBilling.address)).to.be.ok;

    // Check new billing
    expect(await registry.getBilling()).to.be.deep.equal(newBilling.address);

    // Deploy new nodes contract
    const nodesImplFactory = await hre.ethers.getContractFactory("ArmadaNodesImpl");
    const nodesImpl = <ArmadaNodes>await nodesImplFactory.deploy();
    const nodesFactory = await hre.ethers.getContractFactory("ArmadaNodes", { libraries: { ArmadaNodesImpl: nodesImpl.address } });
    const nodesArgs = [[admin.address], registry.address, true];
    const newNodes = <ArmadaNodes>await hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" });

    // Set new nodes
    expect(await registry.connect(admin).unsafeSetNodes(newNodes.address)).to.be.ok;

    // Check new nodes
    expect(await registry.getNodes()).to.be.deep.equal(newNodes.address);

    // Deploy new reservations contract
    const reservationsFactory = await hre.ethers.getContractFactory("ArmadaReservations");
    const reservationsArgs = [[admin.address], registry.address, true];
    const newReservations = <ArmadaReservations>await hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" });

    // Set new reservations
    expect(await registry.connect(admin).unsafeSetReservations(newReservations.address)).to.be.ok;

    // Check new reservations
    expect(await registry.getReservations()).to.be.deep.equal(newReservations.address);
  });

  it("Should allow admin to upgrade registry contract address", async function () {
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry", { signer: admin });
    const notAdminRegistryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");

    const proxy = registry;

    // Non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminRegistryFactory)).to.be.reverted;

    // Set new registry by admin
    expect(await hre.upgrades.upgradeProxy(proxy, registryFactory)).to.be.ok;
  });

  it("Should not allow non-admin to advance epoch without topology node", async function () {
    // non-admin call should revert
    await expect(registry.advanceEpoch(HashZero)).to.be.revertedWith("not admin");

    // admin call should pass "not admin" check
    // and fail "not reconciling" check
    await expect(registry.connect(admin).advanceEpoch(HashZero)).to.be.revertedWith("not reconciling");
  });

  it("Should fail initialization if requirements aren't met", async function () {
    // default configs
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const block = await hre.ethers.provider.getBlock("latest");
    const registryArgs = {
      version: "",
      nonce: 0,
      epochStart: block.timestamp,
      lastEpochLength: 100,
      nextEpochLength: 100,
      gracePeriod: 0,
      epochSlot: 0,
      token: token.address,
      billing: billing.address,
      nodes: nodes.address,
      operators: operators.address,
      projects: projects.address,
      reservations: reservations.address,
    };

    // late epoch start
    let newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    let newRegistryArgs = { ...registryArgs, epochStart: block.timestamp + 100 };
    await expect(newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.revertedWith("late epoch start");

    // zero last epoch length
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, lastEpochLength: 0 };
    await expect(newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.revertedWith("zero last epoch length");

    // zero next epoch length
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, nextEpochLength: 0 };
    await expect(newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.revertedWith("zero next epoch length");

    // epoch slot
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, epochSlot: 100 };
    await expect(newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.revertedWith("epoch slot");

    // no admins provided
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    await expect(newRegistry.connect(admin).initialize([], registryArgs)).to.be.revertedWith("no admins");

    // admin address is zero
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    await expect(newRegistry.connect(admin).initialize([admin.address, AddressZero], registryArgs)).to.be.revertedWith("zero admin");

    // operators address is zero then token approval stays at 0
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, operators: AddressZero };
    expect(await newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.ok;
    expect(await token.allowance(newRegistry.address, AddressZero)).to.be.equal(0);

    // projects address is zero then token approval stays at 0
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, projects: AddressZero };
    expect(await newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.ok;
    expect(await token.allowance(newRegistry.address, AddressZero)).to.be.equal(0);
  });
});
