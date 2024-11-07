import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { signers } from "../lib/util";

export default main;
async function main() {
  const { deployer } = await signers(hre);
  await deployProxy(hre, "EarthfastRegistry", { from: deployer.address, initializer: false });
}

main.tags = ["v1", "DeployRegistry"];
