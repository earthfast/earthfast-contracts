import hre from "hardhat";
import { deployProxy } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastNodes = import("../typechain-types").EarthfastNodes;

const BATCH_SIZE = 50; // set the number of nodes to import at a time

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];
  const registry = await attach(hre, "EarthfastRegistry");
  const registryAddress = await registry.getAddress();
  const args = [admins, registryAddress, true];
  await deployProxy(hre, "EarthfastNodes", { args, from: deployer.address, libraries: ["EarthfastNodesImpl"] });
  const data = await loadData(hre);
  const nodes = <EarthfastNodes>await attach(hre, "EarthfastNodes");
  const nodesData = data?.EarthfastNodes?.nodes ?? [];
  for (const node of nodesData) {
    if (node?.prices?.[0] !== undefined) node.prices[0] = parseUSDC(node.prices[0]).toString();
    if (node?.prices?.[1] !== undefined) node.prices[1] = parseUSDC(node.prices[1]).toString();
  }

  // import nodes data
  const importArgs = [nodesData, true] as const;
  if (confirm(hre, `Execute EarthfastNodes.unsafeImportData ${stringify(importArgs)}`)) {
    // Split the nodes array into smaller chunks
    for (let i = 0; i < nodesData.length; i += BATCH_SIZE) {
      const batch = nodesData.slice(i, i + BATCH_SIZE);

      console.log(`Importing nodes batch ${i / BATCH_SIZE + 1} (${batch.length} nodes)`);

      await wait(nodes.unsafeImportData(batch, i + BATCH_SIZE >= nodesData.length));
    }
  }
}

main.tags = ["v1", "DeployNodes"];
