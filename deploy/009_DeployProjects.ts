import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastProjects = import("../typechain-types").EarthfastProjects;

const BATCH_SIZE = 50; // set the number of projects to import at a time

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

  // Parse the projects data
  const projectsData = data?.EarthfastProjects?.projects ?? [];
  for (const project of projectsData) {
    if (project?.escrow !== undefined) project.escrow = parseUSDC(project.escrow).toString();
    if (project?.reserve !== undefined) project.reserve = parseUSDC(project.reserve).toString();
  }
  const creators = data?.EarthfastProjects?.projectCreators ?? [];

  // Confirm the import
  if (confirm(hre, `Execute EarthfastProjects.unsafeImportData ${stringify([projectsData, creators])}`)) {
    // Split the projects array into smaller chunks
    for (let i = 0; i < projectsData.length; i += BATCH_SIZE) {
      const batch = projectsData.slice(i, i + BATCH_SIZE);

      console.log(`Importing projects batch ${i / BATCH_SIZE + 1} (${batch.length} projects)`);

      // Import this batch
      await wait(
        projects.unsafeImportData(
          batch,
          creators,
          i + BATCH_SIZE >= projectsData.length // Only revoke on last batch
        )
      );
    }
  }
}

main.tags = ["v1"];
