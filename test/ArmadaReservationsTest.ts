import { AddressZero, HashZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { BigNumber } from "ethers";
import { Result } from "ethers/lib/utils";
import hre from "hardhat";
import { automine, expectEvent, expectReceipt, fixtures, mine, mineWith, newId } from "../lib/test";
import { approve, parseTokens, signers } from "../lib/util";
import { ArmadaBilling } from "../typechain-types/contracts/ArmadaBilling";
import { ArmadaCreateNodeDataStruct, ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators, ArmadaOperatorStruct } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaCreateProjectDataStruct, ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";

chai.use(shallowDeepEqual);

describe("ArmadaReservations", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;
  let deployer: SignerWithAddress;

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

  const price = parseTokens("1");

  let pricePerSec: BigNumber;
  let epochLength: number;
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
    ({ admin, operator, project, deployer } = await signers(hre));
    ({ token, billing, nodes, operators, projects, reservations, registry } = await fixtures(hre));

    epochLength = (await registry.getLastEpochLength()).toNumber();
    pricePerSec = price.div(epochLength); // Node price per second

    // Create operator
    const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "e1", stake: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operators.address, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r0", price: parseTokens("0") };
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
    const projectsPermit = await approve(hre, token, admin.address, projects.address, parseTokens("100"));
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), ...projectsPermit)).to.be.ok;

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
    const reservationsFactory = await hre.ethers.getContractFactory("ArmadaReservations");
    const reservationsArgs = [[], registry.address, true];
    await expect(hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const reservationsFactory = await hre.ethers.getContractFactory("ArmadaReservations");
    const reservationsArgs = [[AddressZero], registry.address, true];
    await expect(hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should not grant importer role", async function () {
    const reservationsFactory = await hre.ethers.getContractFactory("ArmadaReservations");
    const reservationsArgs = [[admin.address], registry.address, false];
    expect(await hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" })).to.be.ok;
  });

  it("Should not reserve a disabled node", async function () {
    expect(await nodes.connect(operator).setNodeDisabled(operatorId1, [nodeId1], [true])).to.be.ok;
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.revertedWith("node disabled");
  });

  it("Should reserve/release nodes", async function () {
    await expect(reservations.connect(admin).deleteReservations(projectId1, [nodeId1], { last: true, next: false })).to.be.revertedWith("node not reserved");
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1], { last: false, next: true })).to.be.revertedWith("node not reserved");
    await expect(reservations.connect(operator).createReservations(projectId1, [nodeId1], [price], { last: false, next: true })).to.be.revertedWith("not project owner");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: false, next: false })).to.be.revertedWith("no slot");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price, price], { last: false, next: true })).to.be.revertedWith("length mismatch");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price.div(2)], { last: true, next: false })).to.be.revertedWith("price mismatch");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price.div(2)], { last: false, next: true })).to.be.revertedWith("price mismatch");
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: false, next: true })).to.be.ok;
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId2], [price], { last: true, next: false })).to.be.ok;
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: false, next: true })).to.be.revertedWith("node reserved");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId2], [price], { last: true, next: false })).to.be.revertedWith("node reserved");
    await expect(reservations.connect(project).createReservations(projectId1, [newId()], [price], { last: false, next: true })).to.be.revertedWith("unknown node");
    await expect(reservations.connect(project).createReservations(projectId1, [HashZero], [price], { last: false, next: true })).to.be.revertedWith("unknown node");
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1], { last: false, next: false })).to.be.revertedWith("no slot");
    await expect(reservations.connect(operator).deleteReservations(projectId1, [nodeId1], { last: false, next: true })).to.be.revertedWith("not admin or project owner");
    expect(await reservations.connect(project).deleteReservations(projectId1, [nodeId1], { last: false, next: true })).to.be.ok;
  });

  it("Should reserve non-spot nodes and immediately manually release them", async function () {
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: false, next: true })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(2));
    expect(await reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: false, next: true })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should reserve spot nodes and immediately manually release them if admin", async function () {
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(2));
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: false })).to.be.revertedWith("not admin");
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(2));
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should restore this epoch price to next epoch price if releasing node as admin", async function () {
    expect(await nodes.connect(operator).setNodePrices(operatorId1, [nodeId1], [price], { last: true, next: false })).to.be.ok;
    expect(await nodes.connect(operator).setNodePrices(operatorId1, [nodeId1], [price.mul(2)], { last: false, next: true })).to.be.ok;

    const proratedPrice1 = pricePerSec.mul(await epochRemainder());
    expect(proratedPrice1.lt(price));
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice1);
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(0);

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;

    const proratedPrice2 = pricePerSec.mul(2).mul(await epochRemainder());
    expect(proratedPrice2.gt(price));
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price.mul(2)], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice2);
  });

  it("Should delete reservation in current epoch only if admin", async function () {
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: true })).to.be.revertedWith("not admin");
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok;
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: true })).to.be.ok;
  });

  it("Should reserve nodes in the same block after epoch start", async function () {
    try {
      // NOTE: Can't see transaction reverts when automine=false
      // https://github.com/NomicFoundation/hardhat/issues/2238
      await automine(hre, false);
      await mine(hre, epochLength);
      if (hre.network.tags.ganache) await mine(hre, 1);
      expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
      if (hre.network.tags.ganache) await mine(hre, 0);
      expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
      if (hre.network.tags.ganache) await mine(hre, 0);
      expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
      if (hre.network.tags.ganache) await mine(hre, 0);
      expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok;
      if (hre.network.tags.ganache) await mine(hre, 0);
      if (!hre.network.tags.ganache) await mine(hre, 1);
    } finally {
      await automine(hre, true);
    }

    const proratedPrice = price;
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(price.mul(100));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(price.mul(100).add(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price.mul(100).sub(proratedPrice.mul(2)));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price.mul(0));
  });

  it("Should not reserve nodes while reconciling", async function () {
    let proratedPrice = pricePerSec.mul(await epochRemainder());
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));

    await mine(hre, epochLength);
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.revertedWith("reconciling");
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));

    expect(await billing.connect(operator).processBilling(nodeId0, [nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, [nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await projects.getProject(projectId1)).reserve).to.equal(0);

    proratedPrice = pricePerSec.mul(await epochRemainder());
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice.mul(2));
  });

  it("Should get reseverations", async function () {
    // create a reservation
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: false, next: true })).to.be.ok;

    const reservationsRes = await reservations.getReservations(projectId1, 0, 10);
    expect(reservationsRes.length).to.equal(2);
    expect(reservationsRes[0].id).to.equal(nodeId1);
    expect(reservationsRes[1].id).to.equal(nodeId2);

    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
  });

  it("Should allow reservations importer to unsafeImportData", async function () {
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: false, next: true })).to.be.ok;
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId2], [price], { last: true, next: false })).to.be.ok;

    const newReservations = await reservations.getReservations(projectId1, 0, 10);
    expect(newReservations.length).to.equal(2);

    // delete reservations
    expect(await reservations.connect(project).deleteReservations(projectId1, [nodeId1], { last: false, next: true })).to.be.ok;
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId2], { last: true, next: false })).to.be.revertedWith("not admin");
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId2], { last: true, next: false })).to.be.ok;

    // check reservations is deleted
    expect(await reservations.getReservations(projectId1, 0, 10)).to.have.length(0);

    // importer role calls unsafeImportData and reinstates the reservations
    expect(await reservations.connect(deployer).unsafeImportData(newReservations, false)).to.be.ok;

    const importedReservations = await reservations.getReservations(projectId1, 0, 10);
    expect(importedReservations.length).to.equal(2);

    // revoke importer role
    expect(await reservations.hasRole(reservations.IMPORTER_ROLE(), deployer.address)).to.be.true;
    expect(await reservations.connect(deployer).unsafeImportData([], true)).to.be.ok;
    expect(await reservations.hasRole(reservations.IMPORTER_ROLE(), deployer.address)).to.be.false;
  });

  it("Should allow admin to pause and unpause ", async function () {
    // pause
    expect(await reservations.connect(admin).pause()).to.be.ok;

    // check paused
    expect(await reservations.paused()).to.be.true;

    // unpause
    expect(await reservations.connect(admin).unpause()).to.be.ok;

    // check unpaused
    expect(await reservations.paused()).to.be.false;
  });

  // allow admin to unsafeSetRegistry
  it("Should allow admin to update registry address in projects", async () => {
    // check old registry
    expect(await reservations.getRegistry()).to.equal(registry.address);

    // create new registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    expect(await reservations.connect(admin).unsafeSetRegistry(newRegistry.address)).to.be.ok;

    // check new registry
    expect(await reservations.getRegistry()).to.equal(newRegistry.address);
  });

  it("Should allow admin to pause and unpause", async function () {
    // pause
    expect(await reservations.connect(admin).pause()).to.be.ok;
    expect(await reservations.paused()).to.be.true;

    // unpause
    expect(await reservations.connect(admin).unpause()).to.be.ok;
    expect(await reservations.paused()).to.be.false;
  });

  it("Should allow admin to upgrade reservations contract address", async function () {
    const notAdminFactory = await hre.ethers.getContractFactory("ArmadaReservations", { signer: operator });
    const adminFactory = await hre.ethers.getContractFactory("ArmadaReservations", { signer: admin });

    const proxy = reservations;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    // deploy another registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    // implementation call is disallowed from EOA
    await expect(reservations.removeProjectNodeIdImpl(HashZero, HashZero)).to.be.revertedWith("not impl");
    await expect(reservations.deleteReservationImpl(HashZero, HashZero, 0, 0, { last: false, next: false })).to.be.revertedWith("not impl");

    // implementation call is disallowed from unauthorized contract
    await expect(reservations.connect(newRegistry.signer).removeProjectNodeIdImpl(HashZero, HashZero)).to.be.revertedWith("not impl");
    await expect(reservations.connect(newRegistry.signer).deleteReservationImpl(HashZero, HashZero, 0, 0, { last: false, next: false })).to.be.revertedWith("not impl");
  });
});
