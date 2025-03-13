import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  // Get the contract signers
  const { deployer, guardian } = await signers(hre);

  // attach to governance timelock
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];

  // Get the addresses of the deployed contracts used by the entrypoint
  const nodes = await attach(hre, "EarthfastNodes");
  const nodesAddress = await nodes.getAddress();
  const projects = await attach(hre, "EarthfastProjects");
  const projectsAddress = await projects.getAddress();
  const reservations = await attach(hre, "EarthfastReservations");
  const reservationsAddress = await reservations.getAddress();

  // Deploy the entrypoint
  const args = [admins, nodesAddress, projectsAddress, reservationsAddress];
  await deployProxy(hre, "EarthfastEntrypoint", { args, from: deployer.address });
}

main.tags = ["v1", "DeployEntrypoint"];
