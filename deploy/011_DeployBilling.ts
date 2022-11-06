import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const admins = [guardian.address, timelock.address];
  const registry = await attach(hre, "ArmadaRegistry");
  const args = [admins, registry.address];
  await deployProxy(hre, "ArmadaBilling", { args, from: deployer.address });
}

main.tags = ["v1"];
