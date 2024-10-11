import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const registry = await attach(hre, "ArmadaRegistry");
  const registryAddress = await registry.getAddress();
  const args = [admins, registryAddress];
  await deployProxy(hre, "ArmadaBilling", { args, from: deployer.address });
}

main.tags = ["v1"];
