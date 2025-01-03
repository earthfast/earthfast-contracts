import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { SignerWithAddress, ZeroAddress, ZeroHash } from "ethers";
import hre from "hardhat";

import { expectEvent, expectReceipt, fixtures } from "../lib/test";
import { parseUSDC, signers } from "../lib/util";

import { EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { ProjectMultiplex } from "../typechain-types/contracts/ProjectMultiplex";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("ProjectMultiplex", function () {
  let admin: SignerWithAddress;
  let project: SignerWithAddress;

  let usdc: USDC;
  let projects: EarthfastProjects;
  let multiplex: ProjectMultiplex;

  // store contract addresses after awaiting fixture
  let projectsAddress: string;
  let usdcAddress: string;
  let multiplexAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, project } = await signers(hre));
    ({ usdc, projects } = await fixtures(hre));

    // set contract addresses as string
    projectsAddress = await projects.getAddress();
    usdcAddress = await usdc.getAddress();

    // create the main host project
    const mainProjectReceipt = await expectReceipt(projects.connect(project).createProject({ owner: project.address, name: "MainProject", email: "@", content: "", checksum: ZeroHash, metadata: "" }));
    const [mainProjectId] = await expectEvent(mainProjectReceipt, projects, "ProjectCreated");

    // deploy the multiplex contract
    const multiplexFactory = await hre.ethers.getContractFactory("ProjectMultiplex");
    multiplex = await multiplexFactory.deploy(projectsAddress, mainProjectId, project.address);
    multiplexAddress = await multiplex.getAddress();
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should create sub projects", async function () {
    // First approve USDC transfer from admin to project
    await usdc.connect(admin).approve(project.address, parseUSDC("1000"));

    // Then transfer USDC from admin to project
    await usdc.connect(admin).transfer(project.address, parseUSDC("1000"));

    // Now project needs to approve multiplex contract to spend its USDC
    await usdc.connect(project).approve(multiplexAddress, parseUSDC("1000"));

    // Get chainId
    const network = await hre.ethers.provider.getNetwork();
    const chainId = hre.ethers.getBigInt(network.chainId);
    const caster = "testCaster";

    // Test the hash function directly
    const expectedHash = await multiplex.getSubProjectId(chainId, usdcAddress, caster);

    // Create the sub project
    const tokenName = "testToken";
    const createProjectReceipt = await expectReceipt(multiplex.connect(project).createProject(chainId, tokenName, usdcAddress, caster, ZeroHash));

    // Get the sub project id
    const results = await expectEvent(createProjectReceipt, multiplex, "SubProjectCreated");
    const subProjectId = results[1];
    expect(subProjectId !== ZeroHash);
    expect(subProjectId).to.equal(expectedHash);

    // Use the getter function instead of direct mapping access
    const subProject = await multiplex.subProjects(subProjectId);
    expect(subProject.chainId).to.equal(chainId);
    expect(subProject.tokenName).to.equal(tokenName);
    expect(subProject.token).to.equal(usdcAddress);
    expect(subProject.castHash).to.equal(ZeroHash);
    expect(subProject.caster).to.equal(caster);

    // Check the sub project list
    const subProjectIds = await multiplex.getSubProjectIds();
    expect(subProjectIds).to.deep.equal([subProjectId]);
  });

  it("Should delete sub projects", async function () {
    // Get project params
    const network = await hre.ethers.provider.getNetwork();
    const chainId = hre.ethers.getBigInt(network.chainId);
    const caster = "testCaster";

    // Create a sub project
    const tokenName = "testToken";
    const createProjectReceipt = await expectReceipt(multiplex.connect(project).createProject(chainId, tokenName, usdcAddress, caster, ZeroHash));

    // Get the sub project id
    const results = await expectEvent(createProjectReceipt, multiplex, "SubProjectCreated");
    const subProjectId = results[1];
    expect(subProjectId !== ZeroHash);

    // Check the first sub project
    let subProjectOne = await multiplex.subProjects(subProjectId);
    expect(subProjectOne.chainId).to.equal(chainId);
    expect(subProjectOne.tokenName).to.equal(tokenName);
    expect(subProjectOne.token).to.equal(usdcAddress);
    expect(subProjectOne.castHash).to.equal(ZeroHash);
    expect(subProjectOne.caster).to.equal(caster);

    // create a second sub project
    const tokenNameTwo = "testTokenTwo";
    const tokenTwoAddress = "0x1234567890123456789012345678901234567890";
    const createProjectReceiptTwo = await expectReceipt(multiplex.connect(project).createProject(chainId, tokenNameTwo, tokenTwoAddress, caster, ZeroHash));

    // Get the second sub project id
    const resultsTwo = await expectEvent(createProjectReceiptTwo, multiplex, "SubProjectCreated");
    const subProjectIdTwo = resultsTwo[1];
    expect(subProjectIdTwo !== ZeroHash);

    // Check the second sub project
    let subProjectTwo = await multiplex.subProjects(subProjectIdTwo);
    expect(subProjectTwo.chainId).to.equal(chainId);
    expect(subProjectTwo.tokenName).to.equal(tokenNameTwo);
    expect(subProjectTwo.token).to.equal(tokenTwoAddress);
    expect(subProjectTwo.castHash).to.equal(ZeroHash);
    expect(subProjectTwo.caster).to.equal(caster);

    // Delete the first sub project
    await multiplex.connect(project).deleteSubProject(subProjectId);

    // Check the sub project list
    const subProjectIds = await multiplex.getSubProjectIds();
    expect(subProjectIds).to.deep.equal([subProjectIdTwo]);

    // Check the first sub project is deleted
    subProjectOne = await multiplex.subProjects(subProjectId);
    expect(subProjectOne.chainId).to.equal(0n);
    expect(subProjectOne.tokenName).to.equal("");
    expect(subProjectOne.token).to.equal(ZeroAddress);
    expect(subProjectOne.caster).to.equal("");

    // Check the second sub project is still there
    subProjectTwo = await multiplex.subProjects(subProjectIdTwo);
    expect(subProjectTwo.chainId).to.equal(chainId);
    expect(subProjectTwo.tokenName).to.equal(tokenNameTwo);
    expect(subProjectTwo.token).to.equal(tokenTwoAddress);
    expect(subProjectTwo.castHash).to.equal(ZeroHash);
    expect(subProjectTwo.caster).to.equal(caster);
  });
});
