import { BigNumber } from "ethers";
import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, confirm, loadData, parseUSDC, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type USDC = import("../typechain-types").USDC;

export default main;
async function main() {
  if (!hre.network.tags.dev) {
    console.log("Skipping DeployUSDC for production");
    return;
  }

  const { deployer, admin } = await signers(hre);
  const args = [admin.address];
  const salt = hre.ethers.utils.id(hre.network.name);
  await deployDeterministic(hre, "USDC", { args, from: deployer.address, salt });

  // Transfer USDC to to registry
  let amount = BigNumber.from(0);
  const data = await loadData(hre);
  const usdc = <USDC>await attach(hre, "USDC");
  const registry = await attach(hre, "ArmadaRegistry");
  const projectsData = data?.ArmadaProjects?.projects ?? [];
  const operatorsData = data?.ArmadaOperators?.operators ?? [];
  for (const project of projectsData) {
    amount = amount.add(parseUSDC(project.escrow ?? "0"));
  }
  for (const operator of operatorsData) {
    amount = amount.add(parseUSDC(operator.balance ?? "0"));
  }
  const transferArgs = [registry.address, amount] as const;
  if (confirm(hre, `Execute USDC.transfer ${stringify(transferArgs)}`)) {
    await wait(usdc.connect(admin).transfer(...transferArgs));
  }
}

main.tags = ["v1"];
