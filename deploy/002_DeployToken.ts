import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const admins = [guardian.address, timelock.address];
  const minters = [...admins, deployer.address];
  const pausers = admins;
  const name = hre.network.name === "mainnet" ? "Armada Access" : "Armada";
  const symbol = hre.network.name === "mainnet" ? "ACCESS" : "ARMADA";
  const args = [name, symbol, admins, minters, pausers];
  const salt = hre.ethers.utils.id(hre.network.name);
  await deployDeterministic(hre, "ArmadaToken", { args, from: deployer.address, salt });
}

main.tags = ["v1", "ArmadaToken"];
