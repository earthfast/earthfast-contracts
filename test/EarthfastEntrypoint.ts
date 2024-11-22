import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { SignerWithAddress, ZeroHash } from "ethers";
import hre from "hardhat";

import { expectEvent, expectReceipt, fixtures } from "../lib/test";
import { approve, parseTokens, parseUSDC, signApproval, signers } from "../lib/util";

import { EarthfastEntrypoint } from "../typechain-types/contracts/EarthfastEntrypoint";
import { EarthfastCreateNodeDataStruct, EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects, EarthfastSlot } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

chai.use(shallowDeepEqual);

describe("EarthfastEntrypoint", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let usdc: USDC;
  let entrypoint: EarthfastEntrypoint;
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
  let reservationsAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, registry } = await fixtures(hre));

    // set contract addresses as string
    registryAddress = await registry.getAddress();
    nodesAddress = await nodes.getAddress();
    operatorsAddress = await operators.getAddress();
    projectsAddress = await projects.getAddress();
    reservationsAddress = await reservations.getAddress();

    // deploy entrypoint
    const entrypointFactory = await hre.ethers.getContractFactory("EarthfastEntrypoint");
    const deployment = await entrypointFactory.deploy(nodesAddress, projectsAddress, registryAddress, reservationsAddress);
    entrypoint = (await deployment.waitForDeployment()) as EarthfastEntrypoint;
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should create a project via deploySite", async function () {
    // create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o1", "e1"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // create node
    const price = parseUSDC("1");
    const node1: EarthfastCreateNodeDataStruct = { disabled: false, host: "h1", region: "r1", price };
    const createNode1 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, [node1]));
    const [nodeId1] = await expectEvent(createNode1, nodes, "NodeCreated");
    expect(nodeId1).to.not.equal(ZeroHash);

    const projectData: EarthfastCreateProjectDataStruct = {
      owner: project.address,
      name: "Test Project",
      email: "test@test.com",
      content: "Test Content",
      checksum: ZeroHash,
      metadata: "Test Metadata",
    };

    const nodesToReserve = 1;
    const escrowAmount = parseUSDC("100");
    const slot: EarthfastSlot = { last: true, next: false };

    // Get permit values
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signature = await signApproval(hre, usdc, project.address, projectsAddress, escrowAmount);

    const tx = await expectReceipt(entrypoint.connect(project).deploySite(projectData, nodesToReserve, escrowAmount, slot, deadline, signature.serialized));

    const [projectId] = await expectEvent(tx, projects, "ProjectCreated");
    expect(projectId).to.not.eq(ZeroHash);
  });
});
