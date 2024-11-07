import hre from "hardhat";
import { deployDeterministic } from "../lib/deploy";
import { attach, signers } from "../lib/util";

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const token = await attach(hre, "EarthfastToken");
  const tokenAddress = await token.getAddress();
  const timelock = await attach(hre, "EarthfastTimelock");
  const timelockAddress = await timelock.getAddress();
  const votingDelay = 0; // blocks
  const votingPeriod = 25; // blocks
  const proposalThreshold = 0; // votes
  const quorumNumerator = 51; // percentage
  const admin = guardian.address;
  const args = [admin, tokenAddress, timelockAddress, votingDelay, votingPeriod, proposalThreshold, quorumNumerator];
  const salt = hre.ethers.id(hre.network.name);
  await deployDeterministic(hre, "EarthfastGovernor", { args, from: deployer.address, salt });
}

main.tags = ["v1", "EarthfastGovernor"];
