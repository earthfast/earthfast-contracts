import { AddressZero } from "@ethersproject/constants";
import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { signers } from "../lib/util";

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const minDelay = 0; // seconds
  const admins = [guardian.address, deployer.address];
  const proposers = [guardian.address] as const;
  const executors = [AddressZero]; // everyone
  const args = [minDelay, admins, proposers, executors];
  const salt = hre.ethers.utils.id(hre.network.name);
  await deployDeterministic(hre, "ArmadaTimelock", { args, from: deployer.address, salt });
}

main.tags = ["v1", "ArmadaTimelock"];
