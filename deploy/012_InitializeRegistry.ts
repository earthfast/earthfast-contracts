import { BigNumber } from "ethers";
import hre from "hardhat";
import { attach, confirm, loadData, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaRegistry = import("../typechain-types").ArmadaRegistry;

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

  const args = [
    admins,
    {
      version: data?.ArmadaRegistry?.version ?? "",
      nonce: data?.ArmadaRegistry?.nonce ?? "0",
      epochStart,
      lastEpochLength,
      nextEpochLength,
      gracePeriod: data?.ArmadaRegistry?.gracePeriod ?? "86400", // 1 day
      epochSlot: data?.ArmadaRegistry?.epochSlot ?? "0",
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
