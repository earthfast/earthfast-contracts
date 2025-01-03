import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  const { deployer } = await signers(hre);

  // get constructor args
  const projects = await attach(hre, "EarthfastProjects");
  const projectsAddress = await projects.getAddress();
  const projectId = hre.ethers.id("test");
  const owner = deployer.address;
  const args = [projectsAddress, projectId, owner];

  // deploy contract
  const salt = hre.ethers.id(hre.network.name);
  await deployDeterministic(hre, "ProjectMultiplex", { args, from: deployer.address, salt });
}

main.tags = ["v1", "ProjectMultiplex"];
