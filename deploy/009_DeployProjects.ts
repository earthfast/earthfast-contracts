import hre from "hardhat";
import { ZeroAddress } from "ethers";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastProjects = import("../typechain-types").EarthfastProjects;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const registry = await attach(hre, "EarthfastRegistry");
  const registryAddress = await registry.getAddress();
  const args = [admins, registryAddress, true];
  await deployProxy(hre, "EarthfastProjects", { args, from: deployer.address });
  const data = await loadData(hre);
  const projects = <EarthfastProjects>await attach(hre, "EarthfastProjects");
  const projectsData = data?.EarthfastProjects?.projects ?? [];

  // grant project creator role to address(0) to circumvent the need for a project creator
  await projects.connect(guardian).grantRole(projects.PROJECT_CREATOR_ROLE(), ZeroAddress);

  // load and format projects data for unsafeImportData
  for (const project of projectsData) {
    if (project?.escrow !== undefined) project.escrow = parseUSDC(project.escrow).toString();
    if (project?.reserve !== undefined) project.reserve = parseUSDC(project.reserve).toString();
  }
  const creators = data?.EarthfastProjects?.projectCreators ?? [];
  const importArgs = [projectsData, creators, true] as const;
  if (confirm(hre, `Execute EarthfastProjects.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(projects.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
