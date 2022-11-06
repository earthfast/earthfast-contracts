import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseTokens, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaOperators = import("../typechain-types").ArmadaOperators;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const admins = [guardian.address, timelock.address];
  const data = await loadData(hre);
  const registry = await attach(hre, "ArmadaRegistry");
  const stakePerNode = parseTokens(data?.ArmadaOperators?.stakePerNode ?? "0").toString();
  const args = [admins, registry.address, stakePerNode, true];
  await deployProxy(hre, "ArmadaOperators", { args, from: deployer.address });
  const operators = <ArmadaOperators>await attach(hre, "ArmadaOperators");
  const operatorsData = data?.ArmadaOperators?.operators ?? [];
  for (const operator of operatorsData) {
    if (operator?.stake !== undefined) {
      operator.stake = parseTokens(operator.stake).toString();
    }
  }
  const importArgs = [operatorsData, true] as const;
  if (confirm(hre, `Execute ArmadaOperators.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(operators.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
