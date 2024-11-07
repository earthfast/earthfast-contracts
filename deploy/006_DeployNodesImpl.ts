import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { signers } from "../lib/util";

export default main;
async function main() {
  const { deployer } = await signers(hre);
  const salt = hre.ethers.id(hre.network.name);
  await deployDeterministic(hre, "EarthfastNodesImpl", { from: deployer.address, salt });
}

main.tags = ["v1", "EarthfastNodesImpl"];
