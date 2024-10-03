import { AddressZero, HashZero } from "@ethersproject/constants";
import { expect } from "chai";
import { Result, SignerWithAddress } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { ArmadaBilling } from "../typechain-types/contracts/ArmadaBilling";
import { ArmadaCreateNodeDataStruct, ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators, ArmadaOperatorStruct } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

describe("ArmadaRegistry", function () {
  let admin: SignerWithAddress;
  let deployer: SignerWithAddress;
  let operator: SignerWithAddress;

  let usdc: USDC;
  let token: ArmadaToken;
  let registry: ArmadaRegistry;
  let billing: ArmadaBilling;
  let nodes: ArmadaNodes;
  let operators: ArmadaOperators;
  let projects: ArmadaProjects;
  let reservations: ArmadaReservations;

  let usdcAddress: string;
  let tokenAddress: string;
  let registryAddress: string;
  let billingAddress: string;
  let nodesAddress: string;
  let operatorsAddress: string;
  let projectsAddress: string;
  let reservationsAddress: string;

  let epochLength: number;
  let snapshotId: string;

  async function fixture() {
    ({ admin, deployer, operator } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, billing, registry } = await fixtures(hre));

    usdcAddress = await usdc.getAddress();
    tokenAddress = await token.getAddress();
    registryAddress = await registry.getAddress();
    billingAddress = await billing.getAddress();
    nodesAddress = await nodes.getAddress();
    operatorsAddress = await operators.getAddress();
    projectsAddress = await projects.getAddress();
    reservationsAddress = await reservations.getAddress();

    epochLength = await registry.getLastEpochLength();
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

  it("Should emergency deposit/withdraw tokens", async function () {
    const tokens = parseTokens("100");

    // Deposit
    expect(await token.connect(admin).transfer(registryAddress, tokens)).to.be.ok;
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(tokens);

    // Deposit
    expect(await token.connect(admin).transfer(deployer.address, tokens)).to.be.ok;
    expect(await token.connect(deployer).transfer(registryAddress, tokens)).to.be.ok;
    expect(await token.connect(deployer).balanceOf(registryAddress)).to.equal(tokens * BigInt(2));

    // Withdraw
    await expect(registry.connect(deployer).unsafeWithdrawToken(admin.address, tokens)).to.be.revertedWith("not admin");

    // Withdraw
    expect(await registry.connect(admin).unsafeWithdrawToken(admin.address, tokens)).to.be.ok;
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(tokens * BigInt(1));

    // Withdraw
    expect(await registry.connect(admin).unsafeWithdrawToken(admin.address, tokens)).to.be.ok;
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(tokens * BigInt(0));
    await expect(registry.connect(admin).unsafeWithdrawToken(admin.address, tokens)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should emergency deposit/withdraw USDC", async function () {
    const amount = parseUSDC("100");

    // Deposit
    expect(await usdc.connect(admin).transfer(registryAddress, amount)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(amount);

    // Deposit
    expect(await usdc.connect(admin).transfer(deployer.address, amount)).to.be.ok;
    expect(await usdc.connect(deployer).transfer(registryAddress, amount)).to.be.ok;
    expect(await usdc.connect(deployer).balanceOf(registryAddress)).to.equal(amount * BigInt(2));

    // Withdraw
    await expect(registry.connect(deployer).unsafeWithdrawUSDC(admin.address, amount)).to.be.revertedWith("not admin");

    // Withdraw
    expect(await registry.connect(admin).unsafeWithdrawUSDC(admin.address, amount)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(amount * BigInt(1));

    // Withdraw
    expect(await registry.connect(admin).unsafeWithdrawUSDC(admin.address, amount)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(amount * BigInt(0));
    await expect(registry.connect(admin).unsafeWithdrawUSDC(admin.address, amount)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should respect reconciliation order", async function () {
    // Create operator
    const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    const [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r0", price: parseUSDC("0") };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;

    // Create content nodes
    const n1: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price: parseUSDC("1") };
    const n2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price: parseUSDC("1") };
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

  it("Should allow admin to unsafeSet{USDC|Token|Projects|Operators}", async function () {
    // Get projects address
    expect(await registry.connect(operator).getProjects()).to.be.deep.equal(projectsAddress);

    // Get operators address
    expect(await registry.connect(operator).getOperators()).to.be.deep.equal(operatorsAddress);

    // Get token address
    expect(await registry.connect(operator).getToken()).to.be.deep.equal(tokenAddress);

    // Get USDC address
    expect(await registry.connect(operator).getUSDC()).to.be.deep.equal(usdcAddress);

    // Should skip token approval if new projects is zero address
    expect(await registry.connect(admin).unsafeSetProjects(AddressZero)).to.be.ok;
    expect(await token.allowance(registryAddress, AddressZero)).to.be.deep.equal(0);
    expect(await usdc.allowance(registryAddress, AddressZero)).to.be.deep.equal(0);
    expect(await registry.connect(admin).unsafeSetToken(tokenAddress)).to.be.ok;
    expect(await registry.connect(admin).unsafeSetUSDC(usdcAddress)).to.be.ok;

    // Set projects address to real address should pass
    const projectsFactory = await hre.ethers.getContractFactory("ArmadaProjects");
    const projectsArgs = [[admin.address], registryAddress, true];
    const newProjectsContract = <ArmadaProjects>await hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" });
    const newProjectsAddress = await newProjectsContract.getAddress();
    expect(await registry.connect(admin).unsafeSetProjects(newProjectsAddress)).to.be.ok;
    expect(await registry.connect(operator).getProjects()).to.be.deep.equal(newProjectsAddress);

    // Should skip token approval if new operators is zero address
    expect(await registry.connect(admin).unsafeSetOperators(AddressZero)).to.be.ok;
    expect(await token.allowance(registryAddress, AddressZero)).to.be.deep.equal(0);
    expect(await usdc.allowance(registryAddress, AddressZero)).to.be.deep.equal(0);
    expect(await registry.connect(admin).unsafeSetToken(tokenAddress)).to.be.ok;
    expect(await registry.connect(admin).unsafeSetUSDC(usdcAddress)).to.be.ok;

    // Should fail if token is reused
    await expect(registry.connect(admin).unsafeSetToken(usdcAddress)).to.be.revertedWith("reused token");
    await expect(registry.connect(admin).unsafeSetUSDC(tokenAddress)).to.be.revertedWith("reused token");

    // Set operators address
    const stakePerNode = parseTokens("1");
    const operatorsFactory = await hre.ethers.getContractFactory("ArmadaOperators");
    const operatorsArgs = [[admin.address], registryAddress, stakePerNode, true];
    const newOperatorsContract = <ArmadaOperators>await hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" });
    const newOperatorsAddress = await newOperatorsContract.getAddress();
    expect(await registry.connect(admin).unsafeSetOperators(newOperatorsAddress)).to.be.ok;
    expect(await registry.connect(operator).getOperators()).to.be.deep.equal(newOperatorsAddress);

    // Set token address
    const tokenFactory = await hre.ethers.getContractFactory("ArmadaToken");
    const tokenArgs = ["Armada", "ARMADA", [admin.address], [admin.address], [admin.address]];
    const newTokenContract = <ArmadaToken>await tokenFactory.deploy(...tokenArgs);
    const newTokenAddress = await newTokenContract.getAddress();
    expect(await registry.connect(admin).unsafeSetToken(newTokenAddress)).to.be.ok;
    expect(await registry.connect(operator).getToken()).to.be.deep.equal(newTokenAddress);
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
    expect(await registry.getNonce()).to.eq(0);

    // Verify non-onlyImpl cannot call newNonceImpl
    await expect(registry.newNonceImpl()).to.be.revertedWith("not impl");
  });

  it("Should allow admin to unsafeSetBilling, unsafeSetNodes & unsafeSetReservations", async function () {
    // Get billing address
    expect(await registry.getBilling()).to.be.deep.equal(billingAddress);

    // Get nodes address
    expect(await registry.getNodes()).to.be.deep.equal(nodesAddress);

    // Get reservations address
    expect(await registry.getReservations()).to.be.deep.equal(reservationsAddress);

    // Deploy new billing contract
    const billingFactory = await hre.ethers.getContractFactory("ArmadaBilling");
    const billingArgs = [[admin.address], registryAddress];
    const newBilling = <ArmadaBilling>await hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" });
    const newBillingAddress = await newBilling.getAddress();

    // Set new billing
    await expect(registry.unsafeSetBilling(newBillingAddress)).to.be.revertedWith("not admin");
    expect(await registry.connect(admin).unsafeSetBilling(newBillingAddress)).to.be.ok;

    // Check new billing
    expect(await registry.getBilling()).to.be.deep.equal(newBillingAddress);

    // Deploy new nodes contract
    const nodesImplFactory = await hre.ethers.getContractFactory("ArmadaNodesImpl");
    const nodesImpl = <ArmadaNodes>await nodesImplFactory.deploy();
    const nodesImplAddress = await nodesImpl.getAddress();
    const nodesFactory = await hre.ethers.getContractFactory("ArmadaNodes", { libraries: { ArmadaNodesImpl: nodesImplAddress } });
    const nodesArgs = [[admin.address], registryAddress, true];
    const newNodes = <ArmadaNodes>await hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" });
    const newNodesAddress = await newNodes.getAddress();

    // Set new nodes
    expect(await registry.connect(admin).unsafeSetNodes(newNodesAddress)).to.be.ok;

    // Check new nodes
    expect(await registry.getNodes()).to.be.deep.equal(newNodesAddress);

    // Deploy new reservations contract
    const reservationsFactory = await hre.ethers.getContractFactory("ArmadaReservations");
    const reservationsArgs = [[admin.address], registryAddress, true];
    const newReservations = <ArmadaReservations>await hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" });
    const newReservationsAddress = await newReservations.getAddress();

    // Set new reservations
    expect(await registry.connect(admin).unsafeSetReservations(newReservationsAddress)).to.be.ok;

    // Check new reservations
    expect(await registry.getReservations()).to.be.deep.equal(newReservationsAddress);
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

  it("Should not allow non-reconciler to advance epoch without topology node", async function () {
    // non-reconciler call should revert
    await expect(registry.advanceEpoch(HashZero)).to.be.revertedWith("not reconciler");
    await expect(registry.connect(admin).advanceEpoch(HashZero)).to.be.revertedWith("not reconciler");

    // reconciler call should pass "not reconciler" check and fail "not reconciling" check
    expect(await registry.connect(admin).grantRole(registry.RECONCILER_ROLE(), admin.address)).to.be.ok;
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
      usdc: usdcAddress,
      token: tokenAddress,
      billing: billingAddress,
      nodes: nodesAddress,
      operators: operatorsAddress,
      projects: projectsAddress,
      reservations: reservationsAddress,
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

    // no admins provided
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    await expect(newRegistry.connect(admin).initialize([], registryArgs)).to.be.revertedWith("no admins");

    // admin address is zero
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    await expect(newRegistry.connect(admin).initialize([admin.address, AddressZero], registryArgs)).to.be.revertedWith("zero admin");

    // reused token
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, usdc: tokenAddress };
    await expect(newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.revertedWith("reused token");

    // operators address is zero then token approval stays at 0
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, operators: AddressZero };
    expect(await newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.ok;
    let newRegistryAddress = await newRegistry.getAddress();
    expect(await token.allowance(newRegistryAddress, AddressZero)).to.be.equal(0);
    expect(await usdc.allowance(newRegistryAddress, AddressZero)).to.be.equal(0);

    // projects address is zero then token approval stays at 0
    newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    newRegistryArgs = { ...registryArgs, projects: AddressZero };
    expect(await newRegistry.connect(admin).initialize([admin.address], newRegistryArgs)).to.be.ok;
    newRegistryAddress = await newRegistry.getAddress();
    expect(await token.allowance(newRegistryAddress, AddressZero)).to.be.equal(0);
    expect(await usdc.allowance(newRegistryAddress, AddressZero)).to.be.equal(0);
  });

  // in mainnet the unsafeSetToken would be called in a single transaction with the token transfer to the registry
  // if it's not in the same transaction then the token transfer should be first
  // this test is written with the upgrade first so we can test that the old token doesn't work
  it("Should test the ArmadaToken upgrade path", async function () {
    // Deploy new ArmadaToken contract
    const tokenFactory = await hre.ethers.getContractFactory("ArmadaToken");
    const tokenArgs = ["Armada", "ARMADA", [admin.address], [admin.address], [admin.address]];
    const newTokenContract = <ArmadaToken>await tokenFactory.deploy(...tokenArgs);
    const newTokenAddress = await newTokenContract.getAddress();
    expect(await newTokenContract.connect(admin).mint(admin.address, parseTokens("1000"))).to.be.ok;

    // create two operators 100 old tokens staked
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    const createOperator2 = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId2] = await expectEvent(createOperator2, operators, "OperatorCreated");
    const operatorsPermit2 = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId2, parseTokens("100"), ...operatorsPermit2)).to.be.ok;

    expect(await token.balanceOf(registryAddress)).to.be.equal(parseTokens("200"));
    expect((await operators.connect(admin).getOperator(operatorId)).stake.toString()).to.be.equal(parseTokens("100"));
    expect((await operators.connect(admin).getOperator(operatorId2)).stake.toString()).to.be.equal(parseTokens("100"));

    // upgrade to new ArmadaToken in the registry
    expect(await registry.connect(admin).unsafeSetToken(newTokenAddress)).to.be.ok;
    expect(await registry.connect(admin).getToken()).to.be.deep.equal(newTokenAddress);

    // get operator information after token upgrade - should be the same as before even though the token contract changed
    expect((await operators.connect(admin).getOperator(operatorId)).stake.toString()).to.be.equal(parseTokens("100"));
    expect((await operators.connect(admin).getOperator(operatorId2)).stake.toString()).to.be.equal(parseTokens("100"));

    // transfer new token to registry to make whole the current operators
    // old tokens in registry should equal new tokens
    const oldTokenBalance = await token.balanceOf(registryAddress);
    expect(await newTokenContract.connect(admin).transfer(registryAddress, oldTokenBalance)).to.be.ok;
    const newTokenBalance = await newTokenContract.balanceOf(registryAddress);
    expect(oldTokenBalance).to.be.equal(newTokenBalance);

    // withdraw stake from operator 1 and verify consistent token balances
    expect(await operators.connect(operator).withdrawOperatorStake(operatorId, parseTokens("1"), operator.address)).to.be.ok;
    expect(await newTokenContract.balanceOf(operator.address)).to.be.equal(parseTokens("1"));
    expect(await newTokenContract.balanceOf(registryAddress)).to.be.equal(parseTokens("199"));

    // withdraw stake from operator 2 and verify consistent token balances
    expect(await operators.connect(operator).withdrawOperatorStake(operatorId2, parseTokens("100"), operator.address)).to.be.ok;
    expect(await newTokenContract.balanceOf(operator.address)).to.be.equal(parseTokens("101"));
    expect(await newTokenContract.balanceOf(registryAddress)).to.be.equal(parseTokens("99"));
  });
});
