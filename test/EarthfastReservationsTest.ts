import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { BigNumber, SignerWithAddress, ZeroAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine, mineWith, newId } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { EarthfastBilling } from "../typechain-types/contracts/EarthfastBilling";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators, EarthfastOperatorStruct } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastReservations", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;
  let deployer: SignerWithAddress;

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

  let nodeId1: string;
  let nodeId2: string;
  let projectId1: string;
  let operatorId1: string;

  const price = parseUSDC("1");

  let pricePerSec: BigNumber;
  let epochLength: BigNumber;
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
    ({ admin, operator, project, deployer } = await signers(hre));
    ({ usdc, token, billing, nodes, operators, projects, reservations, registry } = await fixtures(hre));

    registryAddress = await registry.getAddress();
    operatorsAddress = await operators.getAddress();
    projectsAddress = await projects.getAddress();

    epochLength = await registry.getLastEpochLength();
    pricePerSec = price / epochLength; // Node price per second

    // Create operator
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [operatorId1] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create content nodes
    const n1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const n2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r1", price };
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(operatorId1, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    [{ nodeId: nodeId1 }, { nodeId: nodeId2 }] = createNodes12Result;

    // Create project
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
    const reservationsFactory = await hre.ethers.getContractFactory("EarthfastReservations");
    const reservationsArgs = [[], registryAddress, true];
    await expect(hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const reservationsFactory = await hre.ethers.getContractFactory("EarthfastReservations");
    const reservationsArgs = [[ZeroAddress], registryAddress, true];
    await expect(hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should not grant importer role", async function () {
    const reservationsFactory = await hre.ethers.getContractFactory("EarthfastReservations");
    const reservationsArgs = [[admin.address], registryAddress, false];
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
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price / BigInt(2)], { last: true, next: false })).to.be.revertedWith("price mismatch");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price / BigInt(2)], { last: false, next: true })).to.be.revertedWith("price mismatch");
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: false, next: true })).to.be.ok;
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId2], [price], { last: true, next: false })).to.be.ok;
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: false, next: true })).to.be.revertedWith("node reserved");
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId2], [price], { last: true, next: false })).to.be.revertedWith("node reserved");
    await expect(reservations.connect(project).createReservations(projectId1, [newId()], [price], { last: false, next: true })).to.be.revertedWith("unknown node");
    await expect(reservations.connect(project).createReservations(projectId1, [ZeroHash], [price], { last: false, next: true })).to.be.revertedWith("unknown node");
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1], { last: false, next: false })).to.be.revertedWith("no slot");
    await expect(reservations.connect(operator).deleteReservations(projectId1, [nodeId1], { last: false, next: true })).to.be.revertedWith("not admin or project owner");
    expect(await reservations.connect(project).deleteReservations(projectId1, [nodeId1], { last: false, next: true })).to.be.ok;
  });

  it("Should reserve non-spot nodes and immediately manually release them", async function () {
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: false, next: true })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(2));
    expect(await reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: false, next: true })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should reserve spot nodes and immediately manually release them if admin", async function () {
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(2));
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: false })).to.be.revertedWith("not admin");
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(2));
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should restore this epoch price to next epoch price if releasing node as admin", async function () {
    expect(await nodes.connect(operator).setNodePrices(operatorId1, [nodeId1], [price], { last: true, next: false })).to.be.ok;
    expect(await nodes.connect(operator).setNodePrices(operatorId1, [nodeId1], [price * BigInt(2)], { last: false, next: true })).to.be.ok;

    const proratedPrice1 = pricePerSec * (await epochRemainder());
    expect(proratedPrice1 < price);
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice1);
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(0);

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling([nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal([nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch()).to.be.ok;

    const proratedPrice2 = pricePerSec * BigInt(2) * (await epochRemainder());
    expect(proratedPrice2 > price);
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price * BigInt(2)], { last: true, next: false })).to.be.ok;
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice2);
  });

  it("Should delete reservation in current epoch only if admin", async function () {
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: true })).to.be.revertedWith("not admin");
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.ok;
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1, nodeId2], { last: true, next: true })).to.be.ok;
  });

  it("Should reserve nodes in the same block after epoch start", async function () {
    await mine(hre, epochLength);
    if (hre.network.tags.ganache) await mine(hre, 1);
    expect(await billing.connect(operator).processBilling([nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    if (hre.network.tags.ganache) await mine(hre, 0);
    expect(await billing.connect(operator).processRenewal([nodeId1, nodeId2])).to.be.ok;
    if (hre.network.tags.ganache) await mine(hre, 0);
    expect(await registry.connect(operator).advanceEpoch()).to.be.ok;
    if (hre.network.tags.ganache) await mine(hre, 0);
    const proratedPrice = pricePerSec * (await epochRemainder());
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok;
    if (hre.network.tags.ganache) await mine(hre, 0);
    if (!hre.network.tags.ganache) await mine(hre, 1);

    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100));
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));

    await mine(hre, epochLength);
    expect(await billing.connect(operator).processBilling([nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal([nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch()).to.be.ok;
    // FIXME: proratedPrice = pricePerSec * await epochRemainder(); should this be recalculated here since we are in a new epoch?
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await operators.getOperator(operatorId1)).stake).to.equal(parseTokens("100"));
    expect((await operators.getOperator(operatorId1)).balance).to.equal(proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).escrow).to.equal(price * BigInt(100) - proratedPrice * BigInt(2));
    expect((await projects.getProject(projectId1)).reserve).to.equal(price * BigInt(0));
  });

  it("Should not reserve nodes while reconciling", async function () {
    let proratedPrice = pricePerSec * (await epochRemainder());
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));

    await mine(hre, epochLength);
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.revertedWith("reconciling");
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));

    expect(await billing.connect(operator).processBilling([nodeId1, nodeId2], [10000, 10000])).to.be.ok;
    expect(await billing.connect(operator).processRenewal([nodeId1, nodeId2])).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch()).to.be.ok;
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);
    expect((await projects.getProject(projectId1)).reserve).to.equal(0);

    proratedPrice = pricePerSec * (await epochRemainder());
    await mineWith(hre, async () => expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: false })).to.be.ok);
    expect(await reservations.getReservationCount(projectId1)).to.equal(2);
    expect((await projects.getProject(projectId1)).reserve).to.equal(proratedPrice * BigInt(2));
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
    const reservationsToImport = newReservations.map((r) => ({ ...r.toObject(true) }));
    expect(await reservations.connect(deployer).unsafeImportData(reservationsToImport, false)).to.be.ok;

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
    expect(await reservations.getRegistry()).to.equal(registryAddress);

    // create new registry
    const registryFactory = await hre.ethers.getContractFactory("EarthfastRegistry");
    const newRegistry = <EarthfastRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    const newRegistryAddress = await newRegistry.getAddress();

    expect(await reservations.connect(admin).unsafeSetRegistry(newRegistryAddress)).to.be.ok;

    // check new registry
    expect(await reservations.getRegistry()).to.equal(newRegistryAddress);
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
    const notAdminFactory = await hre.ethers.getContractFactory("EarthfastReservations", { signer: operator });
    const adminFactory = await hre.ethers.getContractFactory("EarthfastReservations", { signer: admin });

    const proxy = reservations;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    // implementation call is disallowed from EOA
    await expect(reservations.removeProjectNodeIdImpl(ZeroHash, ZeroHash)).to.be.revertedWith("not impl");
    await expect(reservations.deleteReservationImpl(ZeroAddress, ZeroAddress, ZeroHash, ZeroHash, { last: false, next: false })).to.be.revertedWith("not impl");

    // implementation call is disallowed from unauthorized signer
    await expect(reservations.connect(deployer).removeProjectNodeIdImpl(ZeroHash, ZeroHash)).to.be.revertedWith("not impl");
    await expect(reservations.connect(deployer).deleteReservationImpl(ZeroAddress, ZeroAddress, ZeroHash, ZeroHash, { last: false, next: false })).to.be.revertedWith("not impl");
  });

  it("should allow admin to delete projects with reservations", async function () {
    // create project reservation in current epoch only
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1], [price], { last: true, next: false })).to.be.ok;

    // verify can't delete project with reservations
    await expect(projects.connect(admin).deleteProject(projectId1)).to.be.revertedWith("project has reservations");

    // delete reservation in current epoch
    expect(await reservations.connect(admin).deleteReservations(projectId1, [nodeId1], { last: true, next: false })).to.be.ok;

    // verify reservations are fully cleared
    expect(await reservations.getReservationCount(projectId1)).to.equal(0);

    // verify can't delete project with escrow
    await expect(projects.connect(admin).deleteProject(projectId1)).to.be.revertedWith("project has escrow");

    // withdraw non reserved escrow
    const escrowToWithdraw = (await projects.getProject(projectId1)).escrow - (await projects.getProject(projectId1)).reserve;
    expect(await projects.connect(admin).withdrawProjectEscrow(projectId1, escrowToWithdraw, project.address)).to.be.ok;

    // now delete project should work
    expect(await projects.connect(admin).deleteProject(projectId1)).to.be.ok;
  });
});
