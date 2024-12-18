import hre from "hardhat";
import { getEpochStart } from "../lib/date-util";
import { attach, confirm, loadData, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastRegistry = import("../typechain-types").EarthfastRegistry;

// deployed and minted by hand on sepolia
const USDC_SEPOLIA_ADDRESS = "0x0e9ad5c78b926f3368b1bcfc2dede9042c2d2a18";
const USDC_SEPOLIA_STAGING_ADDRESS = "0x152C5Ddd523890A49ba5b7E73eda0E6a3Bae7710";
const USDC_MAINNET_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export default main;
async function main() {
  const { guardian } = await signers(hre);
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const admins = [guardian.address, timelockAddress];

  const data = await loadData(hre);
  const token = await attach(hre, "EarthfastToken");
  const billing = await attach(hre, "EarthfastBilling");
  const nodes = await attach(hre, "EarthfastNodes");
  const operators = await attach(hre, "EarthfastOperators");
  const projects = await attach(hre, "EarthfastProjects");
  const reservations = await attach(hre, "EarthfastReservations");
  const registry = <EarthfastRegistry>await attach(hre, "EarthfastRegistry");

  // get addresses of deployed contracts
  const tokenAddress = await token.getAddress();
  const billingAddress = await billing.getAddress();
  const nodesAddress = await nodes.getAddress();
  const operatorsAddress = await operators.getAddress();
  const projectsAddress = await projects.getAddress();
  const reservationsAddress = await reservations.getAddress();

  // Round epoch start to Wednesday at 16:00 UTC
  const date = getEpochStart();
  console.log("Epoch start", date.toUTCString());
  const epochStart = Math.round(date.getTime() / 1000);
  if (![undefined, epochStart].includes(data?.EarthfastRegistry?.epochStart)) {
    throw Error("Mismatched epochStart");
  }

  const lastEpochLength = data?.EarthfastRegistry?.lastEpochLength ?? "604800"; // 1 week
  const nextEpochLength = data?.EarthfastRegistry?.nextEpochLength ?? "604800"; // 1 week
  const cuedEpochLength = data?.EarthfastRegistry?.cuedEpochLength ?? "604800"; // 1 week
  if (cuedEpochLength !== nextEpochLength) {
    throw Error("Mismatched cuedEpochStart");
  }

  let usdc;
  if (hre.network.tags.local) {
    usdc = await attach(hre, "USDC");
  } else if (hre.network.tags.sepolia) {
    usdc = await hre.ethers.getContractAt([], USDC_SEPOLIA_ADDRESS);
  } else if (hre.network.tags["sepolia-staging"]) {
    usdc = await hre.ethers.getContractAt([], USDC_SEPOLIA_STAGING_ADDRESS);
  } else if (hre.network.name === "mainnet") {
    usdc = await hre.ethers.getContractAt([], USDC_MAINNET_ADDRESS);
  } else {
    throw Error("Unexpected network");
  }
  const usdcAddress = await usdc.getAddress();

  const args = [
    admins,
    {
      version: data?.EarthfastRegistry?.version ?? "",
      nonce: data?.EarthfastRegistry?.nonce ?? "0",
      epochStart,
      lastEpochLength,
      nextEpochLength,
      gracePeriod: data?.EarthfastRegistry?.gracePeriod ?? "86400", // 1 day
      usdc: usdcAddress,
      token: tokenAddress,
      billing: billingAddress,
      nodes: nodesAddress,
      operators: operatorsAddress,
      projects: projectsAddress,
      reservations: reservationsAddress,
    },
  ] as const;

  if (confirm(hre, `Execute EarthfastRegistry.initialize args: ${stringify(args)}`)) {
    await wait(registry.initialize(...args));
  }
}

main.tags = ["v1", "InitializeRegistry"];
