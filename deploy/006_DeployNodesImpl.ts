import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { signers } from "../lib/util";

export default main;
async function main() {
  const { deployer } = await signers(hre);
  const salt = hre.ethers.utils.id(hre.network.name);
  await deployDeterministic(hre, "ArmadaNodesImpl", { from: deployer.address, salt });
}

main.tags = ["v1", "ArmadaNodesImpl"];
