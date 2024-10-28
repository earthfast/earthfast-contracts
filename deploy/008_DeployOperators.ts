import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseTokens, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastOperators = import("../typechain-types").EarthfastOperators;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const data = await loadData(hre);
  const registry = await attach(hre, "EarthfastRegistry");
  const registryAddress = await registry.getAddress();
  const stakePerNode = parseTokens(data?.EarthfastOperators?.stakePerNode ?? "0").toString();
  const args = [admins, registryAddress, stakePerNode, true];
  await deployProxy(hre, "EarthfastOperators", { args, from: deployer.address });
  const operators = <EarthfastOperators>await attach(hre, "EarthfastOperators");
  const operatorsData = data?.EarthfastOperators?.operators ?? [];
  for (const operator of operatorsData) {
    if (operator?.stake !== undefined) {
      operator.stake = parseTokens(operator.stake).toString();
    }
    if (operator?.balance !== undefined) {
      operator.balance = parseUSDC(operator.balance).toString();
    }
  }
  const importArgs = [operatorsData, true] as const;
  if (confirm(hre, `Execute EarthfastOperators.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(operators.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
