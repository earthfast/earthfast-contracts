import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  // Get the contract deployer
  const { deployer } = await signers(hre);

  // Get the addresses of the deployed contracts used by the entrypoint
  const nodes = await attach(hre, "EarthfastNodes");
  const nodesAddress = await nodes.getAddress();
  const projects = await attach(hre, "EarthfastProjects");
  const projectsAddress = await projects.getAddress();
  const reservations = await attach(hre, "EarthfastReservations");
  const reservationsAddress = await reservations.getAddress();

  // Deploy the entrypoint
  const salt = hre.ethers.id(hre.network.name);
  const args = [nodesAddress, projectsAddress, reservationsAddress];
  await deployDeterministic(hre, "EarthfastEntrypoint", { args, from: deployer.address, salt });
}

main.tags = ["v1", "DeployEntrypoint"];
