import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastEntrypoint = import("../typechain-types").EarthfastEntrypoint;

export default main;
async function main() {
  // Get the deployer and guardian to use as admins
  const { deployer, guardian } = await signers(hre);
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
