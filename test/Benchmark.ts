import { HashZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Result } from "ethers/lib/utils";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine } from "../lib/test";
import { approve, parseTokens, signers } from "../lib/util";
import { ArmadaBilling } from "../typechain-types/contracts/ArmadaBilling";
import { ArmadaCreateNodeDataStruct, ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaOperators } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaCreateProjectDataStruct, ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";

describe("Benchmark", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let token: ArmadaToken;
  let registry: ArmadaRegistry;
  let billing: ArmadaBilling;
  let nodes: ArmadaNodes;
  let operators: ArmadaOperators;
  let projects: ArmadaProjects;
  let reservations: ArmadaReservations;

  let epochLength: number;
  let snapshotId: string;

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ token, operators, projects, reservations, nodes, billing, registry } = await fixtures(hre));

    epochLength = (await registry.getLastEpochLength()).toNumber();
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
    const operatorsPermit = await approve(hre, token, admin.address, operators.address, parseTokens("100"));
    expect(await operators.connect(admin).depositOperatorStake(operatorId, parseTokens("100"), ...operatorsPermit)).to.be.ok;

    // Create topology node
    expect(await nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address)).to.be.ok;
    const n0: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h0", region: "r0", price: parseTokens("0") };
    const createNodes0 = await expectReceipt(nodes.connect(operator).createNodes(operatorId, true, [n0]));
    const createNodes0Result = await expectEvent(createNodes0, nodes, "NodeCreated");
    const { nodeId: nodeId0 } = createNodes0Result as Result;

    // Create content nodes
    const nodesData = new Array(20).fill(0).map(() => ({ topology: false, disabled: false, host: "h", region: "r1", price: 1 }));
    const createNodes = await expectReceipt(nodes.connect(operator).createNodes(operatorId, false, nodesData));
    const results = await expectEvent(createNodes, nodes, "NodeCreated");
    const nodeIds = results.map(([nodeId]) => nodeId);

    // Create project
    expect(await projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address)).to.be.ok;
    const p: ArmadaCreateProjectDataStruct = { name: "p", owner: project.address, email: "e", content: "c", checksum: HashZero };
    const createProject = await expectReceipt(projects.connect(project).createProject(p));
    const [projectId] = await expectEvent(createProject, projects, "ProjectCreated");
    const projectsPermit = await approve(hre, token, admin.address, projects.address, parseTokens("1"));
    expect(await projects.connect(admin).depositProjectEscrow(projectId, parseTokens("1"), ...projectsPermit)).to.be.ok;

    // Create reservations
    const prices = (nodeIds as []).map(() => 1);
    const createReservations = await expectReceipt(reservations.connect(project).createReservations(projectId, nodeIds, prices, { last: true, next: true }));
    await expectEvent(createReservations, reservations, "ReservationCreated");

    await mine(hre, epochLength);
    const uptimes = (nodeIds as []).map(() => 10000);
    expect(await billing.connect(operator).processBilling(nodeId0, nodeIds, uptimes)).to.be.ok;
    expect(await billing.connect(operator).processRenewal(nodeId0, nodeIds)).to.be.ok;
    expect(await registry.connect(operator).advanceEpoch(nodeId0)).to.be.ok;
  });
});
