import { expect } from "chai";
import { Contract, ethers, randomBytes, Result, TransactionReceipt, TransactionResponse, ZeroAddress } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EarthfastBilling } from "../typechain-types/contracts/EarthfastBilling";
import { EarthfastGovernor } from "../typechain-types/contracts/EarthfastGovernor";
import { EarthfastNodes } from "../typechain-types/contracts/EarthfastNodes";
import { EarthfastNodesV2 } from "../typechain-types/contracts/EarthfastNodesV2";
import { EarthfastOperators } from "../typechain-types/contracts/EarthfastOperators";
import { EarthfastProjects } from "../typechain-types/contracts/EarthfastProjects";
import { EarthfastRegistry } from "../typechain-types/contracts/EarthfastRegistry";
import { EarthfastReservations } from "../typechain-types/contracts/EarthfastReservations";
import { EarthfastTimelock } from "../typechain-types/contracts/EarthfastTimelock";
import { EarthfastToken } from "../typechain-types/contracts/EarthfastToken";
import { USDC } from "../typechain-types/contracts/test/USDC";
import { decodeEvent, parseTokens, signers, toHexString } from "./util";

export const newId = (): string => ethers.zeroPadValue(randomBytes(32), 32);

// Mines given transaction with exact timestamp
export async function mineWith(hre: HardhatRuntimeEnvironment, fn: () => Promise<any>): Promise<void> {
  try {
    if (hre.network.tags.ganache) await automine(hre, false);
    await fn();
    if (hre.network.tags.ganache) await mine(hre, 1);
  } finally {
    if (hre.network.tags.ganache) await automine(hre, true);
  }
}

// Replacement for hardhat_mine that works with ganache network used by solidity-coverage
export async function mine(hre: HardhatRuntimeEnvironment, incrementSeconds: number): Promise<void> {
  if (incrementSeconds < 0) throw Error(`${incrementSeconds}`);
  if (!hre.network.tags.ganache) {
    await hre.ethers.provider.send("hardhat_mine", [toHexString(incrementSeconds)]);
  } else {
    const block = await hre.ethers.provider.getBlock("latest");
    await hre.ethers.provider.send("evm_mine", [block.timestamp + incrementSeconds]);
  }
}

// Works with both hardhat and ganache network used by solidity-coverage
export async function automine(hre: HardhatRuntimeEnvironment, automine: boolean): Promise<void> {
  if (!hre.network.tags.ganache) {
    await hre.ethers.provider.send("evm_setAutomine", [automine]);
  } else {
    if (automine) {
      await hre.ethers.provider.send("miner_start", []);
    } else {
      await hre.ethers.provider.send("miner_stop", []);
    }
  }
}

// Deploys test contracts and uploads test data
export async function fixtures(hre: HardhatRuntimeEnvironment): Promise<{
  usdc: USDC;
  token: EarthfastToken;
  registry: EarthfastRegistry;
  billing: EarthfastBilling;
  nodes: EarthfastNodesV2;
  operators: EarthfastOperators;
  projects: EarthfastProjects;
  reservations: EarthfastReservations;
  timelock: EarthfastTimelock;
  governor: EarthfastGovernor;
}> {
  const { admin, deployer } = await signers(hre);

  const usdcFactory = await hre.ethers.getContractFactory("USDC");
  const usdcArgs = [admin.address];
  const usdc = <USDC>await usdcFactory.deploy(...usdcArgs);
  const usdcAddress = await usdc.getAddress();

  const initialSupply = parseTokens("1000000000");
  const tokenFactory = await hre.ethers.getContractFactory("EarthfastToken");
  const tokenArgs = ["Earthfast", "ARMADA", [admin.address], [admin.address], [admin.address]];
  const token = <EarthfastToken>await tokenFactory.deploy(...tokenArgs);
  const tokenAddress = await token.getAddress();
  const tokenMint = await token.connect(admin).mint(admin.address, initialSupply);
  await tokenMint.wait();

  // timelockArgs: minDelay, admins, proposers, executors
  const timelockArgs = [0, [deployer.address], [deployer.address], [ZeroAddress]];
  const timelockFactory = await hre.ethers.getContractFactory("EarthfastTimelock");
  const timelock = <EarthfastTimelock>await timelockFactory.deploy(...timelockArgs);
  const timelockAddress = await timelock.getAddress();

  // governorArgs: token, timelock, votingDelay, votingPeriod, proposalThreshold, quorumNumerator
  const governorArgs = [admin.address, tokenAddress, timelockAddress, 0, 25, 0, 51];
  const governorFactory = await hre.ethers.getContractFactory("EarthfastGovernor");
  const governor = <EarthfastGovernor>await governorFactory.deploy(...governorArgs);
  const governorAddress = await governor.getAddress();

  // Grant govenor ability to execute, queue proposals
  await timelock.grantRole(await timelock.PROPOSER_ROLE(), governorAddress);

  const registryFactory = await hre.ethers.getContractFactory("EarthfastRegistry");
  const registry = <EarthfastRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false }); // prettier-ignore
  const registryAddress = await registry.getAddress();

  const nodesImplFactory = await hre.ethers.getContractFactory("EarthfastNodesImpl");
  const nodesImpl = <EarthfastNodes>await nodesImplFactory.deploy();
  const nodesImplAddress = await nodesImpl.getAddress();

  const nodesFactory = await hre.ethers.getContractFactory("EarthfastNodes", { libraries: { EarthfastNodesImpl: nodesImplAddress } }); // prettier-ignore
  const nodesArgs = [[admin.address], registryAddress, true];
  const nodes = <EarthfastNodes>await hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" });
  const nodesAddress = await nodes.getAddress();
  await hre.network.provider.request({ method: "hardhat_impersonateAccount", params: [nodesAddress] });

  const stakePerNode = parseTokens("1");
  const operatorsFactory = await hre.ethers.getContractFactory("EarthfastOperators");
  const operatorsArgs = [[admin.address], registryAddress, stakePerNode, true];
  const operators = <EarthfastOperators>await hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" });
  const operatorsAddress = await operators.getAddress();
  await hre.network.provider.request({ method: "hardhat_impersonateAccount", params: [operatorsAddress] });

  const projectsFactory = await hre.ethers.getContractFactory("EarthfastProjects");
  const projectsArgs = [[admin.address], registryAddress, true];
  const projects = <EarthfastProjects>await hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" });
  const projectsAddress = await projects.getAddress();

  const reservationsFactory = await hre.ethers.getContractFactory("EarthfastReservations");
  const reservationsArgs = [[admin.address], registryAddress, true];
  const reservations = <EarthfastReservations>await hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" }); // prettier-ignore
  const reservationsAddress = await reservations.getAddress();

  const billingFactory = await hre.ethers.getContractFactory("EarthfastBilling");
  const billingArgs = [[admin.address], registryAddress];
  const billing = <EarthfastBilling>await hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" });
  const billingAddress = await billing.getAddress();

  const block = await hre.ethers.provider.getBlock("latest");
  const registryArgs = {
    version: "",
    nonce: 0,
    epochStart: block.timestamp,
    lastEpochLength: 100,
    nextEpochLength: 100,
    gracePeriod: 0,
    usdc: usdcAddress,
    token: tokenAddress,
    billing: billingAddress,
    nodes: nodesAddress,
    operators: operatorsAddress,
    projects: projectsAddress,
    reservations: reservationsAddress,
  };
  const registryInitialize = await registry.connect(admin).initialize([admin.address], registryArgs);
  await registryInitialize.wait();

  const nodesV2Factory = await hre.ethers.getContractFactory("EarthfastNodesV2", {
    signer: admin,
    libraries: { EarthfastNodesImpl: nodesImplAddress },
  });
  const nodesV2 = <EarthfastNodesV2>await hre.upgrades.upgradeProxy(nodesAddress, nodesV2Factory);

  return { usdc, token, registry, nodes: nodesV2, operators, projects, reservations, timelock, governor, billing };
}

export async function expectReceipt(txPromise: Promise<TransactionResponse>): Promise<TransactionReceipt> {
  return await (await txPromise).wait();
}

export async function expectEvent(
  receipt: TransactionReceipt,
  contract: Contract,
  event: string
): Promise<Result | Result[]> {
  const results = await decodeEvent(receipt, contract, event);
  expect(results.length > 0).is.true;
  return results.length === 1 ? results[0] : results;
}
