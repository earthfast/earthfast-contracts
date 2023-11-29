import { BigNumber } from "ethers";
import hre from "hardhat";
import { attach, confirm, loadData, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaRegistry = import("../typechain-types").ArmadaRegistry;

const USDC_GOERLI_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
// deployed and minted by hand on sepolia
const USDC_SEPOLIA_ADDRESS = "0x0e9ad5c78b926f3368b1bcfc2dede9042c2d2a18";
const USDC_MAINNET_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export default main;
async function main() {
  const { guardian } = await signers(hre);
  const timelock = await attach(hre, "ArmadaTimelock");
  const admins = [guardian.address, timelock.address];

  const data = await loadData(hre);
  const token = await attach(hre, "ArmadaToken");
  const billing = await attach(hre, "ArmadaBilling");
  const nodes = await attach(hre, "ArmadaNodes");
  const operators = await attach(hre, "ArmadaOperators");
  const projects = await attach(hre, "ArmadaProjects");
  const reservations = await attach(hre, "ArmadaReservations");
  const registry = <ArmadaRegistry>await attach(hre, "ArmadaRegistry");

  const nodesData = data?.ArmadaNodes?.nodes ?? [];
  const operatorsData = data?.ArmadaOperators?.operators ?? [];
  const projectsData = data?.ArmadaProjects?.projects ?? [];
  const idCount = nodesData.length + operatorsData.length + projectsData.length;
  if (!BigNumber.from(data?.ArmadaRegistry?.nonce ?? "0").eq(idCount)) {
    throw Error("Mismatched nonce");
  }

  // Round epoch start to the preceding Sunday
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  console.log(`Setting epochStart to ${date}`);
  const epochStart = Math.round(date.getTime() / 1000);
  if (![undefined, epochStart].includes(data?.ArmadaRegistry?.epochStart)) {
    throw Error("Mismatched epochStart");
  }

  const lastEpochLength = data?.ArmadaRegistry?.lastEpochLength ?? "604800"; // 1 week
  const nextEpochLength = data?.ArmadaRegistry?.nextEpochLength ?? "604800"; // 1 week
  const cuedEpochLength = data?.ArmadaRegistry?.cuedEpochLength ?? "604800"; // 1 week
  if (cuedEpochLength !== nextEpochLength) {
    throw Error("Mismatched cuedEpochStart");
  }

  let usdc;
  if (hre.network.tags.local) {
    usdc = await attach(hre, "USDC");
  } else if (hre.network.tags.goerli) {
    usdc = await hre.ethers.getContractAt([], USDC_GOERLI_ADDRESS);
  } else if (hre.network.tags.sepolia) {
    usdc = await hre.ethers.getContractAt([], USDC_SEPOLIA_ADDRESS);
  } else if (hre.network.name === "mainnet") {
    usdc = await hre.ethers.getContractAt([], USDC_MAINNET_ADDRESS);
  } else {
    throw Error("Unexpected network");
  }

  const args = [
    admins,
    {
      version: data?.ArmadaRegistry?.version ?? "",
      nonce: data?.ArmadaRegistry?.nonce ?? "0",
      epochStart,
      lastEpochLength,
      nextEpochLength,
      gracePeriod: data?.ArmadaRegistry?.gracePeriod ?? "86400", // 1 day
      usdc: usdc.address,
      token: token.address,
      billing: billing.address,
      nodes: nodes.address,
      operators: operators.address,
      projects: projects.address,
      reservations: reservations.address,
    },
  ] as const;

  if (confirm(hre, `Execute ArmadaRegistry.initialize args: ${stringify(args)}`)) {
    await wait(registry.initialize(...args));
  }
}

main.tags = ["v1"];
