import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaNodes = import("../typechain-types").ArmadaNodes;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const registry = await attach(hre, "ArmadaRegistry");
  const registryAddress = await registry.getAddress();
  const args = [admins, registryAddress, true];
  await deployProxy(hre, "ArmadaNodes", { args, from: deployer.address, libraries: ["ArmadaNodesImpl"] });
  const data = await loadData(hre);
  const nodes = <ArmadaNodes>await attach(hre, "ArmadaNodes");
  const nodesData = data?.ArmadaNodes?.nodes ?? [];
  for (const node of nodesData) {
    if (node?.prices?.[0] !== undefined) node.prices[0] = parseUSDC(node.prices[0]).toString();
    if (node?.prices?.[1] !== undefined) node.prices[1] = parseUSDC(node.prices[1]).toString();
  }
  const creators = data?.ArmadaNodes?.topologyCreators ?? [];
  const importArgs = [nodesData, creators, true] as const;
  if (confirm(hre, `Execute ArmadaNodes.unsafeImportData ${stringify(importArgs)}`)) {
    await wait(nodes.unsafeImportData(...importArgs));
  }
}

main.tags = ["v1"];
