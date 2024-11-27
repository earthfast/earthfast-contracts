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
import { ProjectMultiplex } from "../typechain-types/contracts/ProjectMultiplex";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("ProjectMultiplex", function () {
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
  let multiplex: ProjectMultiplex;

  // store contract addresses after awaiting fixture
  let registryAddress: string;
  let nodesAddress: string;
  let operatorsAddress: string;
  let projectsAddress: string;
  let usdcAddress: string;
  let multiplexAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project, deployer } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, registry } = await fixtures(hre));

    // set contract addresses as string
    registryAddress = await registry.getAddress();
    nodesAddress = await nodes.getAddress();
    operatorsAddress = await operators.getAddress();
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

    const createProjectReceipt = await expectReceipt(multiplex.connect(project).createProject(usdcAddress, project.address, parseUSDC("1000"), ZeroHash));

    const [subProjectId] = await expectEvent(createProjectReceipt, multiplex, "SubProjectCreated");
    expect(subProjectId !== ZeroHash);

    const subProject = await multiplex.subProjects(subProjectId);
    console.log("subProject", subProject);
    expect(subProject.token).to.equal(usdcAddress);
    expect(subProject.escrow).to.equal(parseUSDC("1000"));
    expect(subProject.castHash).to.equal(ZeroHash);
  });
});
