import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { BigNumber, Result, SignerWithAddress, ZeroAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine, mineWith } from "../lib/test";
import { approve, formatUSDC, parseTokens, parseUSDC, signers } from "../lib/util";
import { EarthfastBilling } from "../typechain-types/contracts/EarthfastBilling";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators, EarthfastOperatorStruct } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastBilling", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let usdc: USDC;
  let token: EarthfastToken;
  let registry: EarthfastRegistry;
  let billing: EarthfastBilling;
  let nodes: EarthfastNodes;
  let operators: EarthfastOperators;
  let projects: EarthfastProjects;
  let reservations: EarthfastReservations;

  let registryAddress: string;
  let operatorsAddress: string;
  let projectsAddress: string;

  let nodeId0: string;
  let nodeId1: string;
  let nodeId2: string;
  let projectId1: string;
  let operatorId1: string;

  const price = parseUSDC("1");

  let pricePerSec: BigNumber;
  let epochLength: number;
  let gracePeriod: number;
  let snapshotId: string;

  // Returns the number of seconds remaining in the current epoch as of the next block to be mined
  async function epochRemainder(): Promise<BigNumber> {
    const block = await hre.ethers.provider.getBlock("latest");
    const blockTimestamp = BigInt(block.timestamp);
    const start = await registry.getLastEpochStart();
    const length = await registry.getLastEpochLength();
    const remaining = start + length - (blockTimestamp + BigInt(1));
    expect(remaining).to.be.greaterThan(BigInt(1));
    expect(remaining).to.be.lessThanOrEqual(epochLength);
    return remaining;
  }

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, token, billing, nodes, operators, projects, reservations, registry } = await fixtures(hre));

    registryAddress = await registry.getAddress();
    operatorsAddress = await operators.getAddress();
    projectsAddress = await projects.getAddress();

    epochLength = await registry.getLastEpochLength();
    gracePeriod = await registry.getGracePeriod();
    pricePerSec = price / epochLength; // Node price per second

    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: EarthfastCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r0", price: parseUSDC("0") };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    ({ nodeId: nodeId0 } = createNodes0Result as Result);

    // Create content nodes
    const n1: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };
    const n2: EarthfastCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price };
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, false, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    [{ nodeId: nodeId1 }, { nodeId: nodeId2 }] = createNodes12Result;

    // Create project
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;

    // Jump to the next epoch start and mark the previous epoch as reconciled,
    // and force align epoch start to a multiple of epochLength for convenience.
    // await mine(hre, 100 - ((await hre.ethers.provider.getBlock("latest")).timestamp % 100) - 1);
    let block = await hre.ethers.provider.getBlock("latest");
    let blockTimestamp = BigInt(block.timestamp);
    let delta = epochLength - (blockTimestamp % epochLength); // 1..100
    if (delta < BigInt(2)) delta += epochLength; // Fit unsafeSetLastEpochStart()
    console.log(`    > Block timestamp ${blockTimestamp} + ${delta} => ${blockTimestamp + delta}, mine ${delta - BigInt(2)}`);
    await mineWith(hre, async () => await registry.connect(admin).unsafeSetLastEpochStart(blockTimestamp + delta));
    await mine(hre, delta - BigInt(2));

    block = await hre.ethers.provider.getBlock("latest");
    blockTimestamp = BigInt(block.timestamp);
    delta = await epochRemainder();
    expect(blockTimestamp % epochLength).to.be.equal(BigInt(99));
    expect(delta).to.be.equal(BigInt(100));
    console.log(`    > Block timestamp ${blockTimestamp}, epoch start sec ${await registry.getLastEpochStart()}`);
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);

    if (!hre.network.tags.ganache) {
      // Restore block timestamp since it's not part of snapshot
      const block = await hre.ethers.provider.getBlock("latest");
      await hre.ethers.provider.send("evm_setNextBlockTimestamp", [block.timestamp + 1]);
    }
  });

  it("Should disallow empty admins", async function () {
    const billingFactory = await hre.ethers.getContractFactory("EarthfastBilling");
    const billingArgs = [[], registryAddress];
    await expect(hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const billingFactory = await hre.ethers.getContractFactory("EarthfastBilling");
    const billingArgs = [[ZeroAddress], registryAddress];
    await expect(hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should auto-release non-renew nodes", async function () {
    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(1);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    if (hre.network.tags.ganache) await mine(hre, 1);
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should not allow non-reconciler to reconcile without topology node", async function () {
    await expect(billing.connect(project).processBilling(ZeroHash, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("not reconciler");
    await expect(billing.connect(project).processRenewal(ZeroHash, [nodeId1, nodeId2])).to.be.revertedWith("not reconciler");
    await expect(billing.connect(admin).processBilling(ZeroHash, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("not reconciler");
    await expect(billing.connect(admin).processRenewal(ZeroHash, [nodeId1, nodeId2])).to.be.revertedWith("not reconciler");
  });

  it("Should allow reconciler to reconcile without topology node", async function () {
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    await mine(hre, epochLength);
    expect(await billing.connect(admin).grantRole(billing.RECONCILER_ROLE(), admin.address)).to.be.ok;
    expect(await billing.connect(admin).processBilling(ZeroHash, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(admin).processRenewal(ZeroHash, [nodeId1, nodeId2])).to.be.ok;
  });

  it("Should check node reconcilication order", async function () {
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    await mine(hre, epochLength);
    expect(await billing.connect(admin).grantRole(billing.RECONCILER_ROLE(), admin.address)).to.be.ok;
    await expect(billing.connect(admin).processBilling(ZeroHash, [nodeId2, nodeId1], [10000, 10000])).to.be.revertedWith("order mismatch");
    expect(await billing.connect(admin).processBilling(ZeroHash, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    await expect(billing.connect(admin).processRenewal(ZeroHash, [nodeId2, nodeId1])).to.be.revertedWith("order mismatch");
  });

  it("Should check node uptime bounds", async function () {
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    await mine(hre, epochLength);
    expect(await billing.connect(admin).grantRole(billing.RECONCILER_ROLE(), admin.address)).to.be.ok;
    await expect(billing.connect(admin).processBilling(ZeroHash, [nodeId1, nodeId2], [10001, 10001])).to.be.revertedWith("invalid uptime");
    expect(await billing.connect(admin).processBilling(ZeroHash, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
  });

  it("Should allow admin to unsafe set registry", async function () {
    // check current registry
    expect(await billing.getRegistry()).to.equal(registryAddress);

    // deploy new registry
    const registryFactory = await hre.ethers.getContractFactory("EarthfastRegistry");
    const newRegistry = <EarthfastRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    const newRegistryAddress = await newRegistry.getAddress();

    // unsafeSetRegistry() is only used in tests
    expect(await billing.connect(admin).unsafeSetRegistry(newRegistryAddress)).to.be.ok;

    // check new registry
    expect(await billing.getRegistry()).to.equal(newRegistryAddress);
  });

  it("Should auto-release nodes that were disabled by operator", async function () {
    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(1);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal((proratedPrice + price) * BigInt(2));
    expect(await registry.connect(admin).setGracePeriod(epochLength)).to.be.ok;
    await expect(nodes.connect(operator).setNodeDisabled(operatorId1, [nodeId1, nodeId2], [true, true])).to.be.revertedWith("grace period");
    expect(await registry.connect(admin).setGracePeriod(gracePeriod)).to.be.ok;
    expect(await nodes.connect(operator).setNodeDisabled(operatorId1, [nodeId1, nodeId2], [true, true])).to.be.ok;
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should auto-release nodes that were repriced by operator", async function () {
    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(1);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal((proratedPrice + price) * BigInt(2));
    expect(await registry.connect(admin).setGracePeriod(epochLength)).to.be.ok;
    await expect(nodes.connect(operator).setNodePrices(operatorId1, [nodeId1, nodeId2], [price * BigInt(100), price * BigInt(100)], { last: false, next: true })).to.be.revertedWith("grace period");
    expect(await registry.connect(admin).setGracePeriod(gracePeriod)).to.be.ok;
    expect(await nodes.connect(operator).setNodePrices(operatorId1, [nodeId1, nodeId2], [price * BigInt(100), price * BigInt(100)], { last: false, next: true })).to.be.ok;
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should auto-release nodes if project runs out of escrow", async function () {
    await mineWith(hre, async () => expect(await projects.connect(project).withdrawProjectEscrow(projectId1, price * BigInt(94), project.address)).to.be.ok);

    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(0.99);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(6));
    expect((await projects.getProject(projectId1)).reserve).to.equal((proratedPrice + price) * BigInt(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(6) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(4));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(4) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(2) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should increase epoch duration", async function () {
    await mineWith(hre, async () => expect(await registry.connect(admin).setCuedEpochLength(epochLength * BigInt(2))).to.be.ok);

    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(0.99);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await registry.getLastEpochLength()).to.equal(BigInt(100));
    expect(await registry.getNextEpochLength()).to.equal(BigInt(100));
    expect(await registry.getCuedEpochLength()).to.equal(BigInt(200));
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(proratedPrice);
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(proratedPrice);
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price);
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price);
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal((proratedPrice + price) * BigInt(2));

    // Reconcile last epoch
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(BigInt(100));
    expect(await registry.getNextEpochLength()).to.equal(BigInt(200));
    expect(await registry.getCuedEpochLength()).to.equal(BigInt(200));
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price);
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price);
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(6));

    // Reconcile next epoch
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(BigInt(200));
    expect(await registry.getNextEpochLength()).to.equal(BigInt(200));
    expect(await registry.getCuedEpochLength()).to.equal(BigInt(200));
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal((proratedPrice + price) * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(98) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(8));

    // Reconcile cued epoch
    await mine(hre, epochLength * BigInt(2));
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(BigInt(200));
    expect(await registry.getNextEpochLength()).to.equal(BigInt(200));
    expect(await registry.getCuedEpochLength()).to.equal(BigInt(200));
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price * BigInt(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(price * BigInt(6) + proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(94) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(8));
  });

  it("Should decrease epoch duration", async function () {
    expect(await projects.connect(project).withdrawProjectEscrow(projectId1, parseUSDC("95.5"), project.address)).to.be.ok;
    await mineWith(hre, async () => expect(await registry.connect(admin).setCuedEpochLength(epochLength / BigInt(2))).to.be.ok);

    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(0.98);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await registry.getLastEpochLength()).to.equal(BigInt(100));
    expect(await registry.getNextEpochLength()).to.equal(BigInt(100));
    expect(await registry.getCuedEpochLength()).to.equal(BigInt(50));
    expect(await reservations.getReservationCount(projectId1)).to.equal(BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(proratedPrice);
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(proratedPrice);
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price);
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price);
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5"));
    expect((await projects.getProject(projectId1)).reserve).to.equal((proratedPrice + parseUSDC("1")) * BigInt(2));

    // Reconcile last epoch - node #2 gets loses renewal
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(100);
    expect(await registry.getNextEpochLength()).to.equal(50);
    expect(await registry.getCuedEpochLength()).to.equal(50);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price);
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price);
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(ZeroHash);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5") - proratedPrice * BigInt(2)); // 2.54
    expect((await projects.getProject(projectId1)).reserve).to.equal(parseUSDC("1") * BigInt(2) + parseUSDC("0.5"));

    // Reconcile next epoch - node #1 loses renewal, node #2 gets released
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(50);
    expect(await registry.getNextEpochLength()).to.equal(50);
    expect(await registry.getCuedEpochLength()).to.equal(50);
    expect(await reservations.getReservationCount(projectId1)).to.equal(1);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(ZeroHash);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(ZeroHash);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(ZeroHash);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal((proratedPrice + price) * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5") - (proratedPrice + price) * BigInt(2)); // 0.54
    expect((await projects.getProject(projectId1)).reserve).to.equal(parseUSDC("0.5"));

    // Reconcile cued epoch - node #1 gets released
    await mine(hre, epochLength / BigInt(2));
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(50);
    expect(await registry.getNextEpochLength()).to.equal(50);
    expect(await registry.getCuedEpochLength()).to.equal(50);
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price / BigInt(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(ZeroHash);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(ZeroHash);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(ZeroHash);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(ZeroHash);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal((proratedPrice + price) * BigInt(2) + price / BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5") - ((proratedPrice + price) * BigInt(2) + price / BigInt(2))); // 0.04
    expect((await projects.getProject(projectId1)).reserve).to.equal(0);
  });

  it("Should allow admin to pause and unpause ", async function () {
    // pause
    expect(await billing.connect(admin).pause()).to.be.ok;

    // check paused
    expect(await billing.paused()).to.be.true;

    // unpause
    expect(await billing.connect(admin).unpause()).to.be.ok;

    // check unpaused
    expect(await billing.paused()).to.be.false;
  });

  it("Should allow admin to upgrade billing contract address", async function () {
    const notAdminBillingFactory = await hre.ethers.getContractFactory("EarthfastBilling", { signer: operator });
    const adminBillingFactory = await hre.ethers.getContractFactory("EarthfastBilling", { signer: admin });

    const proxy = billing;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminBillingFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminBillingFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    // implementation call is disallowed from EOA
    await expect(billing.setBillingNodeIndexImpl(0)).to.be.revertedWith("not impl");
    await expect(billing.setRenewalNodeIndexImpl(0)).to.be.revertedWith("not impl");

    // implementation call is disallowed from unauthorized signer
    await expect(billing.connect(project).setBillingNodeIndexImpl(0)).to.be.revertedWith("not impl");
    await expect(billing.connect(project).setRenewalNodeIndexImpl(0)).to.be.revertedWith("not impl");
  });
});
