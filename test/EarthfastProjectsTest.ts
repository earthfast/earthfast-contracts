import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { Result, SignerWithAddress, ZeroAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, newId } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators, EarthfastOperatorStruct } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastProjects", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;
  let deployer: SignerWithAddress;

  let usdc: USDC;
  let token: EarthfastToken;
  let registry: EarthfastRegistry;
  let nodes: EarthfastNodes;
  let operators: EarthfastOperators;
  let projects: EarthfastProjects;
  let reservations: EarthfastReservations;

  // store contract addresses after awaiting fixture
  let registryAddress: string;
  let nodesAddress: string;
  let operatorsAddress: string;
  let projectsAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project, deployer } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, registry } = await fixtures(hre));

    // set contract addresses as string
    registryAddress = await registry.getAddress();
    nodesAddress = await nodes.getAddress();
    operatorsAddress = await operators.getAddress();
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
    const projectsFactory = await hre.ethers.getContractFactory("EarthfastProjects");
    const projectsArgs = [[], registryAddress, true];
    await expect(hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" })).to.be.revertedWith("no admins");
  });

  it("Should disallow zero admin", async function () {
    const projectsFactory = await hre.ethers.getContractFactory("EarthfastProjects");
    const projectsArgs = [[ZeroAddress], registryAddress, true];
    await expect(hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" })).to.be.revertedWith("zero admin");
  });

  it("Should not grant importer role", async function () {
    const projectsFactory = await hre.ethers.getContractFactory("EarthfastProjects");
    const projectsArgs = [[admin.address], registryAddress, false];
    expect(await hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" })).to.be.ok;
  });

  it("Should check create projects parameters", async function () {
    await expect(projects.connect(project).createProject({ owner: ZeroAddress, name: "", email: "@", content: "", checksum: ZeroHash, metadata: "" })).to.be.revertedWith("zero owner");
    await expect(projects.connect(project).createProject({ owner: project.address, name: "", email: "@", content: "", checksum: ZeroHash, metadata: "" })).to.be.revertedWith("empty name");
    await expect(projects.connect(project).createProject({ owner: project.address, name: "x".repeat(257), email: "@", content: "", checksum: ZeroHash, metadata: "" })).to.be.revertedWith(
      "name too long"
    );
    await expect(projects.connect(project).createProject({ owner: project.address, name: "p", email: "x".repeat(257), content: "", checksum: ZeroHash, metadata: "" })).to.be.revertedWith(
      "email too long"
    );
    await expect(projects.connect(project).createProject({ owner: project.address, name: "p", email: "@", content: "x".repeat(2049), checksum: ZeroHash, metadata: "" })).to.be.revertedWith(
      "content too long"
    );
    await expect(projects.connect(project).createProject({ owner: project.address, name: "p", email: "@", content: "", checksum: ZeroHash, metadata: "x".repeat(2049) })).to.be.revertedWith(
      "metadata too long"
    );
  });

  it("Should create/delete projects", async function () {
    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1 !== ZeroHash);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });

    // Get project
    await expect(projects.connect(project).getProject(ZeroHash)).to.be.revertedWith("unknown project");
    expect(await projects.connect(project).getProject(projectId1)).to.be.shallowDeepEqual(p1);

    // Create identical project
    const p2: EarthfastCreateProjectDataStruct = { ...p1 };
    const createProject2 = await expectReceipt(projects.connect(project).createProject(p2));
    const [projectId2] = await expectEvent(createProject2, projects, "ProjectCreated");
    expect(projectId2 !== ZeroHash);
    expect(projectId2 !== projectId1);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 2, 0: p1, 1: p2 });

    // Delete missing as non-owner
    await expect(projects.connect(operator).deleteProject(projectId1)).to.be.revertedWith("not admin or project owner");

    // Delete project
    expect(await projects.connect(project).deleteProject(projectId1)).to.be.ok;
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p2 });

    // Delete missing project
    await expect(projects.connect(project).deleteProject(projectId1)).to.be.revertedWith("unknown project");
    await expect(projects.connect(project).deleteProject(ZeroHash)).to.be.revertedWith("unknown project");
    await expect(projects.connect(project).deleteProject(newId())).to.be.revertedWith("unknown project");

    // Create previously deleted project
    const p3: EarthfastCreateProjectDataStruct = { ...p1 };
    const createProject3 = await expectReceipt(projects.connect(project).createProject(p3));
    const [projectId3] = await expectEvent(createProject3, projects, "ProjectCreated");
    expect(projectId3 !== ZeroHash);
    expect(projectId3 !== projectId1);
    expect(projectId3 !== projectId2);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 2, 0: p2, 1: p3 });
  });

  it("Should update content, email/name, owner, metadata on project", async function () {
    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(ZeroHash);
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });

    // Update and check content
    const newContent = "new content";
    await expect(projects.connect(project).setProjectContent(projectId1, "x".repeat(2049), ZeroHash)).to.be.revertedWith("content too long");
    expect(await projects.connect(project).setProjectContent(projectId1, newContent, ZeroHash)).to.be.ok;
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

    // Update and check metadata
    const metadataLong = { arbitraryValue: "123".repeat(750) };
    const metadataLongStr = JSON.stringify(metadataLong);
    await expect(projects.connect(project).setProjectMetadata(projectId1, metadataLongStr)).to.be.revertedWith("metadata too long");
    const metadata = { customLandingPage: "https://example.com/page.html" };
    const metadataStr = JSON.stringify(metadata);
    expect(await projects.connect(project).setProjectMetadata(projectId1, metadataStr)).to.be.ok;
    const projectDetails3 = await projects.connect(project).getProject(projectId1);
    expect(projectDetails3.metadata).to.equal(metadataStr);

    // Update owner
    const newOwner = admin.address;
    await expect(projects.connect(project).setProjectOwner(ZeroHash, newOwner)).to.be.revertedWith("unknown project");
    await expect(projects.connect(operator).setProjectOwner(projectId1, newOwner)).to.be.revertedWith("not admin or project owner");
    await expect(projects.connect(project).setProjectOwner(projectId1, ZeroAddress)).to.be.revertedWith("zero owner");
    expect(await projects.connect(project).setProjectOwner(projectId1, newOwner)).to.be.ok;
    expect(await projects.connect(admin).setProjectOwner(projectId1, newOwner)).to.be.ok;
    const projectDetails4 = await projects.connect(project).getProject(projectId1);
    expect(projectDetails4.owner).to.equal(newOwner);

    // Get all projects
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: { ...p1, content: newContent, name: newName, email: newEmail, owner: newOwner, metadata: metadataStr } });
  });

  it("Should allow importer role to use unsafeImportData ", async function () {
    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(ZeroHash);

    // Use unsafeImportData
    const existingProjects = await projects.getProjects(0, 10);
    expect(existingProjects.length).to.equal(1);
    const projectsToImport = existingProjects.map((p) => ({ ...p.toObject(true), id: newId() }));

    expect(await projects.connect(deployer).unsafeImportData(projectsToImport, false)).to.be.ok;

    // Check projects
    expect(await projects.getProjectCount()).to.eq(2);

    // Import duplicates
    await expect(projects.connect(deployer).unsafeImportData(projectsToImport, false)).to.be.revertedWith("duplicate id");
    // Verify importer role is revoked
    expect(await projects.hasRole(projects.IMPORTER_ROLE(), deployer.address)).to.be.true;
    expect(await projects.connect(deployer).unsafeImportData([], true)).to.be.ok;
    expect(await projects.hasRole(projects.IMPORTER_ROLE(), deployer.address)).to.be.false;
  });

  it("Should allow admin to adjust escrows", async function () {
    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1).to.not.eq(ZeroHash);

    // Deposit escrow
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
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
    const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "e1", stake: 0, balance: 0 };
    const createOperator1 = await expectReceipt(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
    [o1.id] = await expectEvent(createOperator1, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(o1.id, parseTokens("100"), ...operatorsPermit)).to.be.ok;
    const n0: EarthfastCreateNodeDataStruct = { disabled: false, host: "h0", region: "r1", price: parseUSDC("0") };
    const n1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const n2: EarthfastCreateNodeDataStruct = { disabled: false, host: "h2", region: "r1", price };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;
    const createNodes12 = await expectReceipt(nodes.connect(operator).createNodes(o1.id, [n1, n2]));
    const createNodes12Result = await expectEvent(createNodes12, nodes, "NodeCreated");
    const { 0: { nodeId: nodeId1 }, 1: { nodeId: nodeId2 } } = createNodes12Result; // prettier-ignore

    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1 !== ZeroHash);

    // Reserve content nodes without escrow
    await expect(reservations.connect(project).createReservations(projectId1, [nodeId1, nodeId2], [price, price], { last: true, next: true })).to.be.revertedWith("not enough escrow");

    // Deposit escrow
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
    await expect(projects.connect(admin).depositProjectEscrow(ZeroHash, parseUSDC("100"), ...projectsPermit)).to.be.revertedWith("unknown project");
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit)).to.be.ok;
    expect(await usdc.connect(admin).balanceOf(project.address)).to.equal(parseUSDC("0"));
    expect(await token.connect(admin).balanceOf(project.address)).to.equal(parseTokens("0"));
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(parseUSDC("100"));
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(parseTokens("100"));
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
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(parseUSDC("2"));
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(parseTokens("100"));
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
    expect(await usdc.connect(admin).balanceOf(registryAddress)).to.equal(parseUSDC("0"));
    expect(await token.connect(admin).balanceOf(registryAddress)).to.equal(parseTokens("100"));
    expect((await projects.getProject(projectId1)).escrow).to.equal(parseUSDC("0"));

    // Delete project
    expect(await projects.connect(project).deleteProject(projectId1)).to.be.ok;
  });

  it("Should deposit escrow with token allowance", async function () {
    // Create project
    const p1: EarthfastCreateProjectDataStruct = { name: "p1", owner: project.address, email: "e1", content: "", checksum: ZeroHash, metadata: "" };
    const createProject1 = await expectReceipt(projects.connect(project).createProject(p1));
    const [projectId1] = await expectEvent(createProject1, projects, "ProjectCreated");
    expect(projectId1 !== ZeroHash);

    // Check invalid permits
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 1, 0, ZeroHash, ZeroHash)).to.be.revertedWith("invalid permit");
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 1, ZeroHash, ZeroHash)).to.be.revertedWith("invalid permit");
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 0, projectId1, ZeroHash)).to.be.revertedWith("invalid permit");

    // Deposit with allowance
    await expect(projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 0, ZeroHash, ZeroHash)).to.be.revertedWith("ERC20: insufficient allowance");
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: p1 });
    expect(await usdc.connect(admin).approve(projectsAddress, parseTokens("100"))).to.be.ok;
    expect(await projects.connect(admin).depositProjectEscrow(projectId1, parseTokens("100"), 0, 0, ZeroHash, ZeroHash)).to.be.ok;
    expect(await projects.getProjects(0, 10)).to.shallowDeepEqual({ length: 1, 0: { ...p1, escrow: parseTokens("100") } });
  });

  it("Should allow admin to update registry address in projects", async () => {
    // check old registry
    expect(await projects.getRegistry()).to.equal(registryAddress);

    // create new registry
    const registryFactory = await hre.ethers.getContractFactory("EarthfastRegistry");
    const newRegistry = <EarthfastRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false });
    const newregistryAddress = await newRegistry.getAddress();

    expect(await projects.connect(admin).unsafeSetRegistry(newregistryAddress)).to.be.ok;

    // check new registry
    expect(await projects.getRegistry()).to.equal(newregistryAddress);
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
    const notAdminProjectFactory = await hre.ethers.getContractFactory("EarthfastProjects", { signer: operator });
    const adminProjectFactory = await hre.ethers.getContractFactory("EarthfastProjects", { signer: admin });

    const proxy = projects;

    // non-admin cannot upgrade
    await expect(hre.upgrades.upgradeProxy(proxy, notAdminProjectFactory)).to.be.reverted;

    // admin can upgrade
    expect(await hre.upgrades.upgradeProxy(proxy, adminProjectFactory)).to.be.ok;
  });

  it("Should disallow impl calls from unauthorized senders", async function () {
    const nodesSigner = await hre.ethers.getSigner(nodesAddress);

    // unknown project id is disallowed
    await expect(projects.connect(nodesSigner).setProjectEscrowImpl(ZeroHash, 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown project");
    await expect(projects.connect(nodesSigner).setProjectReserveImpl(ZeroHash, 0, 0, { gasPrice: 0 })).to.be.revertedWith("unknown project");

    // implementation call is disallowed from unauthorized address
    await expect(projects.setProjectEscrowImpl(ZeroHash, 0, 0)).to.be.revertedWith("not impl");
    await expect(projects.setProjectReserveImpl(ZeroHash, 0, 0)).to.be.revertedWith("not impl");
  });
});
