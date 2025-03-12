import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type USDC = import("../typechain-types").USDC;

export default main;
async function main() {
  if (!hre.network.tags.local) {
    console.log("Skipping DeployUSDC for production");
    return;
  }

  const { deployer, admin } = await signers(hre);
  const args = [admin.address];
  const salt = hre.ethers.id(hre.network.name);
  await deployDeterministic(hre, "USDC", { args, from: deployer.address, salt });

  // Transfer USDC to to registry
  let amount = BigInt(0);
  const data = await loadData(hre);
  const usdc = <USDC>await attach(hre, "USDC");
  const registry = await attach(hre, "EarthfastRegistry");
  const registryAddress = await registry.getAddress();
  const projectsData = data?.EarthfastProjects?.projects ?? [];
  const operatorsData = data?.EarthfastOperators?.operators ?? [];
  for (const project of projectsData) {
    amount = amount + parseUSDC(project.escrow ?? "0");
  }
  for (const operator of operatorsData) {
    amount = amount + parseUSDC(operator.balance ?? "0");
  }
  const transferArgs = [registryAddress, amount] as const;
  if (confirm(hre, `Execute USDC.transfer ${registryAddress}, ${amount.toString()}`)) {
    await wait(usdc.connect(admin).transfer(...transferArgs));
  }
}

main.tags = ["v1", "DeployUSDC"];
