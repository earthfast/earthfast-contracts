import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const minters = [...admins, deployer.address];
  const pausers = admins;
  const name = hre.network.name === "mainnet" ? "Earthfast Access" : "Earthfast";
  const symbol = hre.network.name === "mainnet" ? "EFACCESS" : "EARTHFAST";
  const args = [name, symbol, admins, minters, pausers];
  const salt = hre.ethers.id(hre.network.name);
  await deployDeterministic(hre, "EarthfastToken", { args, from: deployer.address, salt });
}

main.tags = ["v1", "EarthfastToken"];
