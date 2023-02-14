import { AddressZero, HashZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { BigNumber } from "ethers";
import { Result } from "ethers/lib/utils";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine, mineWith } from "../lib/test";
import { approve, formatUSDC, parseTokens, parseUSDC, signers } from "../lib/util";
import { ArmadaBilling } from "../typechain-types/contracts/ArmadaBilling";
import { ArmadaCreateNodeDataStruct, ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators, ArmadaOperatorStruct } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaCreateProjectDataStruct, ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("ArmadaBilling", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let usdc: USDC;
  let token: ArmadaToken;
  let registry: ArmadaRegistry;
  let billing: ArmadaBilling;
  let nodes: ArmadaNodes;
  let operators: ArmadaOperators;
  let projects: ArmadaProjects;
  let reservations: ArmadaReservations;

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
  async function epochRemainder(): Promise<number> {
    const block = await hre.ethers.provider.getBlock("latest");
    const start = (await registry.getLastEpochStart()).toNumber();
    const length = (await registry.getLastEpochLength()).toNumber();
    const remaining = start + length - (block.timestamp + 1);
    expect(remaining).to.be.greaterThan(1);
    expect(remaining).to.be.lessThanOrEqual(epochLength);
    return remaining;
  }

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, token, billing, nodes, operators, projects, reservations, registry } = await fixtures(hre));

    epochLength = (await registry.getLastEpochLength()).toNumber();
    gracePeriod = (await registry.getGracePeriod()).toNumber();
    pricePerSec = price.div(epochLength); // Node price per second

    // Create operator
    const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operators.address, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r0", price: parseUSDC("0") };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    ({ nodeId: nodeId0 } = createNodes0Result as Result);

    // Create content nodes
    const n1: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };
    const n2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price };
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, false, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    [{ nodeId: nodeId1 }, { nodeId: nodeId2 }] = createNodes12Result;

    // Create project
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projects.address, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;

    // Jump to the next epoch start and mark the previous epoch as reconciled,
    // and force align epoch start to a multiple of epochLength for convenience.
    // await mine(hre, 100 - ((await hre.ethers.provider.getBlock("latest")).timestamp % 100) - 1);
    let block = await hre.ethers.provider.getBlock("latest");
    let delta = epochLength - (block.timestamp % epochLength); // 1..100
    if (delta < 2) delta += epochLength; // Fit unsafeSetLastEpochStart()
    console.log(`    > Block timestamp ${block.timestamp} + ${delta} => ${block.timestamp + delta}, mine ${delta - 2}`);
    await mineWith(hre, async () => await registry.connect(admin).unsafeSetLastEpochStart(block.timestamp + delta));
    await mine(hre, delta - 2);

    block = await hre.ethers.provider.getBlock("latest");
    delta = await epochRemainder();
    expect(block.timestamp % epochLength).to.be.equal(99);
    expect(delta).to.be.equal(100);
    console.log(`    > Block timestamp ${block.timestamp}, epoch start sec ${await registry.getLastEpochStart()}`);
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
    const billingFactory = await hre.ethers.getContractFactory("ArmadaBilling");
    const billingArgs = [[], registry.address];
    await expect(hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const billingFactory = await hre.ethers.getContractFactory("ArmadaBilling");
    const billingArgs = [[AddressZero], registry.address];
    await expect(hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should auto-release non-renew nodes", async function () {
    const proratedPrice = pricePerSec.mul(await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(1);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    if (hre.network.tags.ganache) await mine(hre, 1);
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should not allow non-admin to reconcile without topology node", async function () {
    await expect(billing.connect(project).processBilling(HashZero, [nodeId1, nodeId2], [10000, 10000])).to.be.revertedWith("not admin");
    await expect(billing.connect(project).processRenewal(HashZero, [nodeId1, nodeId2])).to.be.revertedWith("not admin");
  });

  it("Should allow admin to reconcile without topology node", async function () {
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    await mine(hre, epochLength);
    expect(await billing.connect(admin).processBilling(HashZero, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(admin).processRenewal(HashZero, [nodeId1, nodeId2])).to.be.ok;
  });

  it("Should check node reconcilication order", async function () {
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    await mine(hre, epochLength);
    await expect(billing.connect(admin).processBilling(HashZero, [nodeId2, nodeId1], [10000, 10000])).to.be.revertedWith("order mismatch");
    expect(await billing.connect(admin).processBilling(HashZero, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    await expect(billing.connect(admin).processRenewal(HashZero, [nodeId2, nodeId1])).to.be.revertedWith("order mismatch");
  });

  it("Should check node uptime bounds", async function () {
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    await mine(hre, epochLength);
    await expect(billing.connect(admin).processBilling(HashZero, [nodeId1, nodeId2], [10001, 10001])).to.be.revertedWith("invalid uptime");
    expect(await billing.connect(admin).processBilling(HashZero, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
  });

  it("Should allow admin to unsafe set registry", async function () {
    // check current registry
    expect(await billing.getRegistry()).to.equal(registry.address);

    // deploy new registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    // unsafeSetRegistry() is only used in tests
    expect(await billing.connect(admin).unsafeSetRegistry(newRegistry.address)).to.be.ok;

    // check new registry
    expect(await billing.getRegistry()).to.equal(newRegistry.address);
  });

  it("Should auto-release nodes that were disabled by operator", async function () {
    const proratedPrice = pricePerSec.mul(await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(1);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.add(price).mul(2));
    expect(await registry.connect(admin).setGracePeriod(epochLength)).to.be.ok;
    await expect(nodes.connect(operator).setNodeDisabled(operatorId1, [nodeId1, nodeId2], [true, true])).to.be.revertedWith("grace period");
    expect(await registry.connect(admin).setGracePeriod(gracePeriod)).to.be.ok;
    expect(await nodes.connect(operator).setNodeDisabled(operatorId1, [nodeId1, nodeId2], [true, true])).to.be.ok;
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should auto-release nodes that were repriced by operator", async function () {
    const proratedPrice = pricePerSec.mul(await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(1);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.add(price).mul(2));
    expect(await registry.connect(admin).setGracePeriod(epochLength)).to.be.ok;
    await expect(nodes.connect(operator).setNodePrices(operatorId1, [nodeId1, nodeId2], [price.mul(100), price.mul(100)], { last: false, next: true })).to.be.revertedWith("grace period");
    expect(await registry.connect(admin).setGracePeriod(gracePeriod)).to.be.ok;
    expect(await nodes.connect(operator).setNodePrices(operatorId1, [nodeId1, nodeId2], [price.mul(100), price.mul(100)], { last: false, next: true })).to.be.ok;
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should auto-release nodes if project runs out of escrow", async function () {
    await mineWith(hre, async () => expect(await projects.connect(project).withdrawProjectEscrow(projectId1, price.mul(94), project.address)).to.be.ok);

    const proratedPrice = pricePerSec.mul(await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(0.99);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(6));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.add(price).mul(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(6).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(4));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(4).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(2).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should increase epoch duration", async function () {
    await mineWith(hre, async () => expect(await registry.connect(admin).setCuedEpochLength(epochLength * 2)).to.be.ok);

    const proratedPrice = pricePerSec.mul(await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(0.99);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await registry.getLastEpochLength()).to.equal(100);
    expect(await registry.getNextEpochLength()).to.equal(100);
    expect(await registry.getCuedEpochLength()).to.equal(200);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(proratedPrice);
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(proratedPrice);
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price);
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price);
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.add(price).mul(2));

    // Reconcile last epoch
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(100);
    expect(await registry.getNextEpochLength()).to.equal(200);
    expect(await registry.getCuedEpochLength()).to.equal(200);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price);
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price);
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(6));

    // Reconcile next epoch
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(200);
    expect(await registry.getNextEpochLength()).to.equal(200);
    expect(await registry.getCuedEpochLength()).to.equal(200);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.add(price).mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(98).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(8));

    // Reconcile cued epoch
    await mine(hre, epochLength * 2);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(200);
    expect(await registry.getNextEpochLength()).to.equal(200);
    expect(await registry.getCuedEpochLength()).to.equal(200);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price.mul(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(projectId1);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(price.mul(6).add(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(94).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(8));
  });

  it("Should decrease epoch duration", async function () {
    expect(await projects.connect(project).withdrawProjectEscrow(projectId1, parseUSDC("95.5"), project.address)).to.be.ok;
    await mineWith(hre, async () => expect(await registry.connect(admin).setCuedEpochLength(epochLength / 2)).to.be.ok);

    const proratedPrice = pricePerSec.mul(await epochRemainder());
    expect(Number.parseFloat(formatUSDC(proratedPrice))).to.be.equal(0.98);
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok);
    expect(await registry.getLastEpochLength()).to.equal(100);
    expect(await registry.getNextEpochLength()).to.equal(100);
    expect(await registry.getCuedEpochLength()).to.equal(50);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
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
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.add(parseUSDC("1")).mul(2));

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
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(HashZero);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5").sub(proratedPrice.mul(2))); // 2.54
    expect((await projects.getProject(projectId1)).reserve).to.equal(parseUSDC("1").mul(2).add(parseUSDC("0.5")));

    // Reconcile next epoch - node #1 loses renewal, node #2 gets released
    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(50);
    expect(await registry.getNextEpochLength()).to.equal(50);
    expect(await registry.getCuedEpochLength()).to.equal(50);
    expect(await reservations.getReservationCount(projectId1)).to.equal(1);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(projectId1);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(HashZero);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(HashZero);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(HashZero);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.add(price).mul(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5").sub(proratedPrice.add(price).mul(2))); // 0.54
    expect((await projects.getProject(projectId1)).reserve).to.equal(parseUSDC("0.5"));

    // Reconcile cued epoch - node #1 gets released
    await mine(hre, epochLength / 2);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await registry.getLastEpochLength()).to.equal(50);
    expect(await registry.getNextEpochLength()).to.equal(50);
    expect(await registry.getCuedEpochLength()).to.equal(50);
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await nodes.getNode(nodeId1)).prices[0]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId2)).prices[0]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId1)).prices[1]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId2)).prices[1]).to.equal(price.div(2));
    expect((await nodes.getNode(nodeId1)).projectIds[0]).to.equal(HashZero);
    expect((await nodes.getNode(nodeId2)).projectIds[0]).to.equal(HashZero);
    expect((await nodes.getNode(nodeId1)).projectIds[1]).to.equal(HashZero);
    expect((await nodes.getNode(nodeId2)).projectIds[1]).to.equal(HashZero);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice.add(price).mul(2).add(price.div(2)));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("4.5").sub(proratedPrice.add(price).mul(2).add(price.div(2)))); // 0.04
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
    const notAdminBillingFactory = await hre.ethers.getContractFactory("ArmadaBilling", { signer: operator });
    const adminBillingFactory = await hre.ethers.getContractFactory("ArmadaBilling", { signer: admin });

    const proxy = billing;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminBillingFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminBillingFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    // deploy another registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    // implementation call is disallowed from EOA
    await expect(billing.setBillingNodeIndexImpl(0)).to.be.revertedWith("not impl");
    await expect(billing.setRenewalNodeIndexImpl(0)).to.be.revertedWith("not impl");

    // implementation call is disallowed from unauthorized contract
    await expect(billing.connect(newRegistry.signer).setBillingNodeIndexImpl(0)).to.be.revertedWith("not impl");
    await expect(billing.connect(newRegistry.signer).setRenewalNodeIndexImpl(0)).to.be.revertedWith("not impl");
  });
});
