import { ZeroHash } from "ethers";
import { task } from "hardhat/config";
import { approve, attach, decodeEvent, parseTokens, parseUSDC, signers, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastToken = import("../typechain-types").Token;
// @ts-ignore Type created during hardhat compile
type EarthfastRegistry = import("../typechain-types").EarthfastRegistry;
// @ts-ignore Type created during hardhat compile
type EarthfastNodes = import("../typechain-types").EarthfastNodes;
// @ts-ignore Type created during hardhat compile
type EarthfastOperators = import("../typechain-types").EarthfastOperators;
// @ts-ignore Type created during hardhat compile
type EarthfastOperatorStruct = import("../typechain-types").EarthfastOperatorStruct;
// @ts-ignore Type created during hardhat compile
type EarthfastProjects = import("../typechain-types").EarthfastProjects;
// @ts-ignore Type created during hardhat compile
type EarthfastReservations = import("../typechain-types").EarthfastReservations;
// @ts-ignore Type created during hardhat compile
type EarthfastCreateNodeDataStruct = import("../typechain-types").EarthfastCreateNodeDataStruct;
// @ts-ignore Type created during hardhat compile
type EarthfastCreateProjectDataStruct = import("../typechain-types").EarthfastCreateProjectDataStruct;
// @ts-ignore Type created during hardhat compile
type USDC = import("../typechain-types").USDC;

task("seed", "Uploads dummy programmatic contract data").setAction(async (_args, hre) => {
  if (!hre.network.tags.local) {
    throw Error("Should not seed data for production");
  }

  const { admin, operator, project } = await signers(hre);

  const usdc = <USDC>await attach(hre, "USDC");
  const token = <EarthfastToken>await attach(hre, "EarthfastToken");
  const registry = <EarthfastRegistry>await attach(hre, "EarthfastRegistry");
  const nodes = <EarthfastNodes>await attach(hre, "EarthfastNodes");
  const operators = <EarthfastOperators>await attach(hre, "EarthfastOperators");
  const projects = <EarthfastProjects>await attach(hre, "EarthfastProjects");
  const reservations = <EarthfastReservations>await attach(hre, "EarthfastReservations");

  if (!(await registry.getNonce()).isZero()) {
    throw Error("Contracts already have data");
  }

  const price0 = parseUSDC("0");
  const price1 = parseUSDC("1");

  // Create operator
  const o1: EarthfastOperatorStruct = { id: ZeroHash, name: "o1", owner: operator.address, email: "", stake: 0 };
  const createOperator1 = await wait(operators.connect(admin).createOperator(o1.owner, o1.name, o1.email));
  const [operatorId1] = await decodeEvent(createOperator1, operators, "OperatorCreated");
  const operatorsAddress = await operators.getAddress();
  const operatorsPermit = await approve(hre, token, admin.address, operatorsAddress, parseTokens("100"));
  await wait(operators.connect(admin).depositOperatorStake(operatorId1, parseTokens("100"), ...operatorsPermit));

  // Create nodes
  await wait(nodes.connect(admin).grantRole(nodes.TOPOLOGY_CREATOR_ROLE(), operator.address));
  const n1: EarthfastCreateNodeDataStruct = {
    topology: true,
    disabled: false,
    host: "h1",
    region: "r1",
    price: price0,
  };
  const n2: EarthfastCreateNodeDataStruct = {
    topology: false,
    disabled: false,
    host: "h2",
    region: "r1",
    price: price1,
  };
  await wait(nodes.connect(operator).createNodes(operatorId1, true, [n1]));
  const createNodes2 = await wait(nodes.connect(operator).createNodes(operatorId1, false, [n2]));
  const [nodeId2] = await decodeEvent(createNodes2, nodes, "NodeCreated");

  // Create project
  await wait(projects.connect(admin).grantRole(projects.PROJECT_CREATOR_ROLE(), project.address));
  const p1: EarthfastCreateProjectDataStruct = { owner: project.address, name: "p1", email: "", content: "", checksum: ZeroHash, metadata: "" }; // prettier-ignore
  const createProject1 = await wait(projects.connect(project).createProject(p1));
  const [projectId1] = await decodeEvent(createProject1, projects, "ProjectCreated");
  const projectsAddress = await projects.getAddress();
  const projectsPermit = await approve(hre, usdc, admin.address, projectsAddress, parseUSDC("100"));
  await wait(projects.connect(admin).depositProjectEscrow(projectId1, parseUSDC("100"), ...projectsPermit));

  // Create reservation
  await wait(reservations.connect(project).createReservations(projectId1, [nodeId2], [price1], { last: false, next: true })); // prettier-ignore
});
