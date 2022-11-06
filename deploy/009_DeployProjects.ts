import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseTokens, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaProjects = import("../typechain-types").ArmadaProjects;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const admins = [guardian.address, timelock.address];
  const registry = await attach(hre, "ArmadaRegistry");
  const args = [admins, registry.address, true];
  await deployProxy(hre, "ArmadaProjects", { args, from: deployer.address });
  const data = await loadData(hre);
  const projects = <ArmadaProjects>await attach(hre, "ArmadaProjects");
  const projectsData = data?.ArmadaProjects?.projects ?? [];
  for (const project of projectsData) {
    if (project?.escrow !== undefined) project.escrow = parseTokens(project.escrow).toString();
    if (project?.reserve !== undefined) project.reserve = parseTokens(project.reserve).toString();
  }
  const creators = data?.ArmadaProjects?.projectCreators ?? [];
  const importArgs = [projectsData, creators, true] as const;
  if (confirm(hre, `Execute ArmadaProjects.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(projects.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
