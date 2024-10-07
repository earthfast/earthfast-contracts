import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaProjects = import("../typechain-types").ArmadaProjects;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const registry = await attach(hre, "ArmadaRegistry");
  const registryAddress = await registry.getAddress();
  const args = [admins, registryAddress, true];
  await deployProxy(hre, "ArmadaProjects", { args, from: deployer.address });
  const data = await loadData(hre);
  const projects = <ArmadaProjects>await attach(hre, "ArmadaProjects");
  const projectsData = data?.ArmadaProjects?.projects ?? [];
  for (const project of projectsData) {
    if (project?.escrow !== undefined) project.escrow = parseUSDC(project.escrow).toString();
    if (project?.reserve !== undefined) project.reserve = parseUSDC(project.reserve).toString();
  }
  const creators = data?.ArmadaProjects?.projectCreators ?? [];
  const importArgs = [projectsData, creators, true] as const;
  if (confirm(hre, `Execute ArmadaProjects.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(projects.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
