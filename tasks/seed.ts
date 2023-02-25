import { HashZero } from "@ethersproject/constants";
import { task } from "hardhat/config";
import { approve, attach, decodeEvent, parseTokens, parseUSDC, signers, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaToken = import("../typechain-types").Token;
// @ts-ignore Type created during hardhat compile
type ArmadaRegistry = import("../typechain-types").ArmadaRegistry;
// @ts-ignore Type created during hardhat compile
type ArmadaNodes = import("../typechain-types").ArmadaNodes;
// @ts-ignore Type created during hardhat compile
type ArmadaOperators = import("../typechain-types").ArmadaOperators;
// @ts-ignore Type created during hardhat compile
type ArmadaOperatorStruct = import("../typechain-types").ArmadaOperatorStruct;
// @ts-ignore Type created during hardhat compile
type ArmadaProjects = import("../typechain-types").ArmadaProjects;
// @ts-ignore Type created during hardhat compile
type ArmadaReservations = import("../typechain-types").ArmadaReservations;
// @ts-ignore Type created during hardhat compile
type ArmadaCreateNodeDataStruct = import("../typechain-types").ArmadaCreateNodeDataStruct;
// @ts-ignore Type created during hardhat compile
type ArmadaCreateProjectDataStruct = import("../typechain-types").ArmadaCreateProjectDataStruct;
// @ts-ignore Type created during hardhat compile
type USDC = import("../typechain-types").USDC;

task("seed", "Uploads dummy programmatic contract data").setAction(async (_args, hre) => {
  if (!hre.network.tags.dev) {
    throw Error("Should not seed data for production");
  }

  const { admin, operator, project } = await signers(hre);

  const usdc = <USDC>await attach(hre, "USDC");
  const token = <ArmadaToken>await attach(hre, "ArmadaToken");
  const registry = <ArmadaRegistry>await attach(hre, "ArmadaRegistry");
  const nodes = <ArmadaNodes>await attach(hre, "ArmadaNodes");
  const operators = <ArmadaOperators>await attach(hre, "ArmadaOperators");
  const projects = <ArmadaProjects>await attach(hre, "ArmadaProjects");
  const reservations = <ArmadaReservations>await attach(hre, "ArmadaReservations");

  if (!(await registry.getNonce()).isZero()) {
    throw Error("Contracts already have data");
  }

  const price0 = parseUSDC("0");
  const price1 = parseUSDC("1");

  // Create operator
  const o1: ArmadaOperatorStruct = { id: HashZero, name: "o1", owner: operator.address, email: "", stake: 0 };
  const createOperator1 = await wait(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
  const [operatorId1] = await decodeEvent(createOperator1, operators, "OperatorCreated");
  const operatorsPermit = await approve(hre, token, admin.address, operators.address, parseTokens("100"));
  await wait(operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit));

  // Create nodes
  await wait(nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address));
  const n1: ArmadaCreateNodeDataStruct = { topology: true, disabled: false, host: "h1", region: "r1", price: price0 };
  const n2: ArmadaCreateNodeDataStruct = { topology: false, disabled: false, host: "h2", region: "r1", price: price1 };
  await wait(nodes.connect(operator).createNodes(operatorId1, true, [n1]));
  const createNodes2 = await wait(nodes.connect(operator).createNodes(operatorId1, false, [n2]));
  const [nodeId2] = await decodeEvent(createNodes2, nodes, "NodeCreated");

  // Create project
  await wait(projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address));
  const p1: ArmadaCreateProjectDataStruct = { owner: project.address, name: "p1", email: "", content: "", checksum: HashZero }; // prettier-ignore
  const createProject1 = await wait(projects.connect(project).createProject(p1));
  const [projectId1] = await decodeEvent(createProject1, projects, "ProjectCreated");
  const projectsPermit = await approve(hre, usdc, admin.address, projects.address, parseUSDC("100"));
  await wait(projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit));

  // Create reservation
  await wait(reservations.connect(project).createReservations(projectId1, [nodeId2], [price1], { last: false, next: true })); // prettier-ignore
});
