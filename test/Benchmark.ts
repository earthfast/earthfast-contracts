import { expect } from "chai";
import { SignerWithAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";
import { EarthfastBilling } from "../typechain-types/contracts/EarthfastBilling";
import { EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastOperators } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastCreateProjectDataStruct, EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";

describe("Benchmark", function () {
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

  let projectsAddress: string;
  let operatorsAddress: string;

  let epochLength: number;
  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, token, operators, projects, reservations, nodes, billing, registry } = await fixtures(hre));

    projectsAddress = await projects.getAddress();
    operatorsAddress = await operators.getAddress();

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

  it("Should benchmark reconciliation of 20 nodes", async function () {
    // Create operator
    const createOperator = await expectReceipt(operators.connect(admin).createOperator(operator.address, "o", "e"));
    const [operatorId] = await expectEvent(createOperator, operators, "OperatorCreated");
    const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create content nodes
    const nodesData = new Array(20).fill(0).map(() => ({ disabled: false, host: "h", region: "r1", price: 1 }));
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, nodesData));
    const results = await expectEvent(createNodes, nodes, "NodeCreated");
    const nodeIds = results.map(([nodeId]) => nodeId);

    // Create project
    const p: EarthfastCreateProjectDataStruct = { name: "p", owner: project.address, email: "e", content: "c", checksum: ZeroHash, metadata: "" };
    const createProject = await expectReceipt(projects.connect(project).createProject(p));
    const [projectId] = await expectEvent(createProject, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("1"));
    expect(await projects.connect(admin).depositProjectEscrow(admin.address, projectId, parseUSDC("1"), ...projectsPermit)).to.be.ok;

    // Create reservations
    const prices = (nodeIds as []).map(() => 1);
    const createReservations = await expectReceipt(reservations.connect(project).createReservations(projectId, nodeIds, prices, { last: true, next: true }));
    await expectEvent(createReservations, reservations, "ReservationCreated");

    await mine(hre, epochLength);
    const uptimes = (nodeIds as []).map(() => 10000);
    expect(await billing.connect(operator).processBilling(nodeIds, uptimes)).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeIds)).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch()).to.be.ok;
  });
});
