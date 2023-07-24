import { AddressZero, HashZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { Result } from "ethers/lib/utils";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, newId } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { ArmadaCreateNodeDataStruct, ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators, ArmadaOperatorStruct } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaCreateProjectDataStruct, ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("ArmadaProjects", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;
  let deployer: SignerWithAddress;

  let usdc: USDC;
  let token: ArmadaToken;
  let registry: ArmadaRegistry;
  let nodes: ArmadaNodes;
  let operators: ArmadaOperators;
  let projects: ArmadaProjects;
  let reservations: ArmadaReservations;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project, deployer } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, registry } = await fixtures(hre));
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
    const projectsFactory = await hre.ethers.getContractFactory("ArmadaProjects");
    const projectsArgs = [[], registry.address, true];
    await expect(hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const projectsFactory = await hre.ethers.getContractFactory("ArmadaProjects");
    const projectsArgs = [[AddressZero], registry.address, true];
    await expect(hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should not grant importer role", async function () {
    const projectsFactory = await hre.ethers.getContractFactory("ArmadaProjects");
    const projectsArgs = [[admin.address], registry.address, false];
    expect(await hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" })).to.be.ok;
  });

  it("Should check create projects parameters", async function () {
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    await expect(projects.connect(project).createProject({ owner: AddressZero, name: "", email: "@", content: "", checksum: HashZero })).to.be.revertedWith("zero owner");
    await expect(projects.connect(project).createProject({ owner: project.address, name: "", email: "@", content: "", checksum: HashZero })).to.be.revertedWith("empty name");
    await expect(projects.connect(project).createProject({ owner: project.address, name: "x".repeat(257), email: "@", content: "", checksum: HashZero })).to.be.revertedWith("name too long");
    await expect(projects.connect(project).createProject({ owner: project.address, name: "p", email: "x".repeat(257), content: "", checksum: HashZero })).to.be.revertedWith("email too long");
    await expect(projects.connect(project).createProject({ owner: project.address, name: "p", email: "@", content: "x".repeat(2049), checksum: HashZero })).to.be.revertedWith("content too long");
  });

  it("Should create/delete projects", async function () {
    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    await expect(projects.connect(project).createProject(p1)).to.be.revertedWith("not project creator");
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1 !== HashZero);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });

    // Get project
    await expect(projects.connect(project).getProject(HashZero)).to.be.revertedWith("unknown project");
    expect(await projects.connect(project).getProject(projectId1)).to.be.shallowDeepEqual(p1);

    // Create identical project
    const p2: ArmadaCreateProjectDataStruct = { ...p1 };
    const createProject2 = await expectReceipt(projects.connect(project).createProject(p2));
    const [projectId2] = await expectEvent(createProject2, projects, "ProjectCreated");
    expect(projectId2 !== HashZero);
    expect(projectId2 !== projectId1);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 2, 0: p1, 1: p2 });

    // Delete missing as non-owner
    await expect(projects.connect(operator).deleteProject(projectId1)).to.be.revertedWith("not project owner");

    // Delete project
    expect(await projects.connect(project).deleteProject(projectId1)).to.be.ok;
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p2 });

    // Delete missing project
    await expect(projects.connect(project).deleteProject(projectId1)).to.be.revertedWith("unknown project");
    await expect(projects.connect(project).deleteProject(HashZero)).to.be.revertedWith("unknown project");
    await expect(projects.connect(project).deleteProject(newId())).to.be.revertedWith("unknown project");

    // Create previously deleted project
    const p3: ArmadaCreateProjectDataStruct = { ...p1 };
    const createProject3 = await expectReceipt(projects.connect(project).createProject(p3));
    const [projectId3] = await expectEvent(createProject3, projects, "ProjectCreated");
    expect(projectId3 !== HashZero);
    expect(projectId3 !== projectId1);
    expect(projectId3 !== projectId2);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 2, 0: p2, 1: p3 });
  });

  it("Should update content, email/name, owner on project", async function () {
    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(HashZero);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });

    // Update and check content
    const newContent = "new content";
    await expect(projects.connect(project).setProjectContent(projectId1, "x".repeat(2049), HashZero)).to.be.revertedWith("content too long");
    expect(await projects.connect(project).setProjectContent(projectId1, newContent, HashZero)).to.be.ok;
    const projectDetails1 = await projects.connect(project).getProject(projectId1);
    expect(projectDetails1.content).to.equal(newContent);

    // Update and check email name
    const newEmail = "new email";
    const newName = "new name";
    await expect(projects.connect(project).setProjectProps(projectId1, "", newEmail)).to.be.revertedWith("empty name");
    await expect(projects.connect(project).setProjectProps(projectId1, "x".repeat(257), newEmail)).to.be.revertedWith("name too long");
    await expect(projects.connect(project).setProjectProps(projectId1, newName, "x".repeat(257))).to.be.revertedWith("email too long");
    expect(await projects.connect(project).setProjectProps(projectId1, newName, newEmail)).to.be.ok;
    const projectDetails2 = await projects.connect(project).getProject(projectId1);
    expect(projectDetails2.email).to.equal(newEmail);
    expect(projectDetails2.name).to.equal(newName);

    // Update owner
    const newOwner = admin.address;
    await expect(projects.connect(project).setProjectOwner(HashZero, newOwner)).to.be.revertedWith("unknown project");
    await expect(projects.connect(operator).setProjectOwner(projectId1, newOwner)).to.be.revertedWith("not admin or project owner");
    await expect(projects.connect(project).setProjectOwner(projectId1, AddressZero)).to.be.revertedWith("zero owner");
    expect(await projects.connect(project).setProjectOwner(projectId1, newOwner)).to.be.ok;
    expect(await projects.connect(admin).setProjectOwner(projectId1, newOwner)).to.be.ok;
    const projectDetails3 = await projects.connect(project).getProject(projectId1);
    expect(projectDetails3.owner).to.equal(newOwner);

    // Get all projects
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: { ...p1, content: newContent, name: newName, email: newEmail, owner: newOwner } });
  });

  it("Should set project metadata", async function () {
    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(HashZero);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });

    // Set metadata
    const metadata = { customLandingPage: "https://example.com/page.html" };
    const metadataStr = JSON.stringify(metadata);
    await expect(projects.connect(project).setProjectMetadata(projectId1, metadataStr)).to.be.ok;
    const projectDetails1 = await projects.connect(project).getProject(projectId1);
    expect(projectDetails1.metadata).to.equal(metadataStr);
  });

  it("Should allow importer role to use unsafeImportData ", async function () {
    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(HashZero);

    // Use unsafeImportData
    const existingProjects = await projects.getProjects(0, 10);
    expect(existingProjects.length).to.equal(1);
    const projectsToImport = existingProjects.map((p) => ({ ...p, id: newId() }));
    const newCreatorAddr = operator.address;
    expect(await projects.connect(deployer).unsafeImportData(projectsToImport, [newCreatorAddr], false)).to.be.ok;

    // Check projects
    expect(await projects.getProjectCount()).to.eq(2);

    // Verify role
    expect(await projects.hasRole(projects.PROJECT_CREATOR_ROLE(), newCreatorAddr)).to.be.true;

    // Import duplicates
    await expect(projects.connect(deployer).unsafeImportData(projectsToImport, [newCreatorAddr], false)).to.be.revertedWith("duplicate id");

    // Verify importer role is revoked
    expect(await projects.hasRole(projects.IMPORTER_ROLE(), deployer.address)).to.be.true;
    expect(await projects.connect(deployer).unsafeImportData([], [], true)).to.be.ok;
    expect(await projects.hasRole(projects.IMPORTER_ROLE(), deployer.address)).to.be.false;
  });

  it("Should allow admin to adjust escrows", async function () {
    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(HashZero);

    // Deposit escrow
    const projectsPermit = await approve(hre, usdc, admin.address, projects.address, parseUSDC("100"));
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("100"));
    expect((await projects.getProject(projectId1)).reserve).to.equal(parseUSDC("0"));

    // Adjust escrow
    await expect(projects.connect(project).unsafeSetEscrows(0, 1, 3, 2)).to.be.revertedWith("not admin");
    await expect(projects.connect(admin).unsafeSetEscrows(0, 1, 0, 1)).to.be.revertedWith("zero mul");
    expect(await projects.connect(admin).unsafeSetEscrows(0, 1, 3, 2)).to.be.ok;
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("150"));
    expect((await projects.getProject(projectId1)).reserve).to.equal(parseUSDC("0"));
  });

  it("Should deposit/withdraw escrow", async function () {
    const price = parseUSDC("1");

    // Create operator, deposit stake, create nodes
    const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operators.address, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), ...operatorsPermit)).to.be.ok;
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r1", price: parseUSDC("0") };
    const n1: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h1", region: "r1", price };
    const n2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, false, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    const { 0: { nodeId: nodeId1 }, 1: { nodeId: nodeId2 } } = createNodes12Result; // prettier-ignore

    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1 !== HashZero);

    // Reserve topology nodes
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId0], [price], { last: false, next: true })).to.be.revertedWith("topology node");

    // Reserve content nodes without escrow
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.revertedWith("not enough escrow");

    // Deposit escrow
    const projectsPermit = await approve(hre, usdc, admin.address, projects.address, parseUSDC("100"));
    await expect(projects.connect(admin).depositProjectEscrow(HashZero, parseUSDC("100"), ...projectsPermit)).to.be.revertedWith("unknown project");
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(project.address)).to.equal(parseUSDC("0"));
    expect(await token.connect(admin).balanceOf(project.address)).to.equal(parseTokens("0"));
    expect(await usdc.connect(admin).balanceOf(registry.address)).to.equal(parseUSDC("100"));
    expect(await token.connect(admin).balanceOf(registry.address)).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("100"));

    // Reserve content nodes
    expect(await reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: false, next: true })).to.be.ok;

    // Delete project with reservations
    await expect(projects.connect(project).deleteProject(projectId1)).to.be.revertedWith("project has reservations");

    // Withdraw escrow with reservations
    await expect(projects.connect(project).withdrawProjectEscrow(projectId1, parseUSDC("100"), project.address)).to.be.revertedWith("not enough escrow");
    expect(await projects.connect(project).withdrawProjectEscrow(projectId1, parseUSDC("98"), project.address)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(project.address)).to.equal(parseUSDC("98"));
    expect(await token.connect(admin).balanceOf(project.address)).to.equal(parseTokens("0"));
    expect(await usdc.connect(admin).balanceOf(registry.address)).to.equal(parseUSDC("2"));
    expect(await token.connect(admin).balanceOf(registry.address)).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("2"));
    await expect(projects.connect(project).withdrawProjectEscrow(projectId1, parseUSDC("2"), project.address)).to.be.revertedWith("not enough escrow");

    // Release content nodes
    await expect(reservations.connect(project).deleteReservations(projectId1, [nodeId0], { last: false, next: true })).to.be.revertedWith("node not reserved");
    expect(await reservations.connect(project).deleteReservations(projectId1, [nodeId1, nodeId2], { last: false, next: true })).to.be.ok;

    // Delete project with escrow
    await expect(projects.connect(project).deleteProject(projectId1)).to.be.revertedWith("project has escrow");

    // Withdraw escrow
    expect(await projects.connect(project).withdrawProjectEscrow(projectId1, parseUSDC("2"), project.address)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(project.address)).to.equal(parseUSDC("100"));
    expect(await token.connect(admin).balanceOf(project.address)).to.equal(parseTokens("0"));
    expect(await usdc.connect(admin).balanceOf(registry.address)).to.equal(parseUSDC("0"));
    expect(await token.connect(admin).balanceOf(registry.address)).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("0"));

    // Delete project
    expect(await projects.connect(project).deleteProject(projectId1)).to.be.ok;
  });

  it("Should deposit escrow with token allowance", async function () {
    // Create project
    const p1: ArmadaCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: HashZero };
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1 !== HashZero);

    // Check invalid permits
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 1, 0, HashZero, HashZero)).to.be.revertedWith("invalid permit");
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 1, HashZero, HashZero)).to.be.revertedWith("invalid permit");
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 0, projectId1, HashZero)).to.be.revertedWith("invalid permit");

    // Deposit with allowance
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 0, HashZero, HashZero)).to.be.revertedWith("ERC20: insufficient allowance");
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });
    expect(await usdc.connect(admin).approve(projects.address, parseTokens("100"))).to.be.ok;
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 0, HashZero, HashZero)).to.be.ok;
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: { ...p1, escrow: parseTokens("100") } });
  });

  it("Should allow admin to update registry address in projects", async () => {
    // check old registry
    expect(await projects.getRegistry()).to.equal(registry.address);

    // create new registry
    const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
    const newRegistry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });

    expect(await projects.connect(admin).unsafeSetRegistry(newRegistry.address)).to.be.ok;

    // check new registry
    expect(await projects.getRegistry()).to.equal(newRegistry.address);
  });

  it("Should allow admin to pause and unpause", async function () {
    // pause
    expect(await projects.connect(admin).pause()).to.be.ok;
    expect(await projects.paused()).to.be.true;

    // unpause
    expect(await projects.connect(admin).unpause()).to.be.ok;
    expect(await projects.paused()).to.be.false;
  });

  it("Should allow admin to upgrade projects contract address", async function () {
    const notAdminProjectFactory = await hre.ethers.getContractFactory("ArmadaProjects", { signer: operator });
    const adminProjectFactory = await hre.ethers.getContractFactory("ArmadaProjects", { signer: admin });

    const proxy = projects;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminProjectFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminProjectFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    const nodesSigner = await hre.ethers.getSigner(nodes.address);

    // unknown project id is disallowed
    await expect(projects.connect(nodesSigner).setProjectEscrowImpl(HashZero, 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown project");
    await expect(projects.connect(nodesSigner).setProjectReserveImpl(HashZero, 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown project");

    // implementation call is disallowed from unauthorized address
    await expect(projects.setProjectEscrowImpl(HashZero, 0, 0)).to.be.revertedWith("not impl");
    await expect(projects.setProjectReserveImpl(HashZero, 0, 0)).to.be.revertedWith("not impl");
  });
});
