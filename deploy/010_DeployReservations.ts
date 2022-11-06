import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseTokens, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaReservations = import("../typechain-types").ArmadaReservations;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const admins = [guardian.address, timelock.address];
  const registry = await attach(hre, "ArmadaRegistry");
  const args = [admins, registry.address, true];
  await deployProxy(hre, "ArmadaReservations", { args, from: deployer.address });
  const data = await loadData(hre);
  const reservations = <ArmadaReservations>await attach(hre, "ArmadaReservations");
  const nodesData = data?.ArmadaNodes?.nodes ?? [];
  for (const node of nodesData) {
    if (node?.prices?.[0] !== undefined) node.prices[0] = parseTokens(node.prices[0]).toString();
    if (node?.prices?.[1] !== undefined) node.prices[1] = parseTokens(node.prices[1]).toString();
  }
  const importArgs = [nodesData, true] as const;
  if (confirm(hre, `Execute ArmadaReservations.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(reservations.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
