import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider";
import { AddressZero } from "@ethersproject/constants";
import { expect } from "chai";
import { Contract, ethers, randomBytes, Result } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ArmadaBilling } from "../typechain-types/contracts/ArmadaBilling";
import { ArmadaGovernor } from "../typechain-types/contracts/ArmadaGovernor";
import { ArmadaNodes } from "../typechain-types/contracts/ArmadaNodes";
import { ArmadaNodesV2 } from "../typechain-types/contracts/ArmadaNodesV2";
import { ArmadaOperators } from "../typechain-types/contracts/ArmadaOperators";
import { ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";
import { ArmadaRegistry } from "../typechain-types/contracts/ArmadaRegistry";
import { ArmadaReservations } from "../typechain-types/contracts/ArmadaReservations";
import { ArmadaTimelock } from "../typechain-types/contracts/ArmadaTimelock";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";
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
  token: ArmadaToken;
  registry: ArmadaRegistry;
  billing: ArmadaBilling;
  nodes: ArmadaNodesV2;
  operators: ArmadaOperators;
  projects: ArmadaProjects;
  reservations: ArmadaReservations;
  timelock: ArmadaTimelock;
  governor: ArmadaGovernor;
}> {
  const { admin, deployer } = await signers(hre);

  const usdcFactory = await hre.ethers.getContractFactory("USDC");
  const usdcArgs = [admin.address];
  const usdc = <USDC>await usdcFactory.deploy(...usdcArgs);
  const usdcAddress = await usdc.getAddress();

  const initialSupply = parseTokens("1000000000");
  const tokenFactory = await hre.ethers.getContractFactory("ArmadaToken");
  const tokenArgs = ["Armada", "ARMADA", [admin.address], [admin.address], [admin.address]];
  const token = <ArmadaToken>await tokenFactory.deploy(...tokenArgs);
  const tokenAddress = await token.getAddress();
  const tokenMint = await token.connect(admin).mint(admin.address, initialSupply);
  await tokenMint.wait();

  // timelockArgs: minDelay, admins, proposers, executors
  const timelockArgs = [0, [deployer.address], [deployer.address], [AddressZero]];
  const timelockFactory = await hre.ethers.getContractFactory("ArmadaTimelock");
  const timelock = <ArmadaTimelock>await timelockFactory.deploy(...timelockArgs);
  const timelockAddress = await timelock.getAddress();

  // governorArgs: token, timelock, votingDelay, votingPeriod, proposalThreshold, quorumNumerator
  const governorArgs = [admin.address, tokenAddress, timelockAddress, 0, 25, 0, 51];
  const governorFactory = await hre.ethers.getContractFactory("ArmadaGovernor");
  const governor = <ArmadaGovernor>await governorFactory.deploy(...governorArgs);
  const governorAddress = await governor.getAddress();

  // Grant govenor ability to execute, queue proposals
  await timelock.grantRole(await timelock.PROPOSER_ROLE(), governorAddress);

  const registryFactory = await hre.ethers.getContractFactory("ArmadaRegistry");
  const registry = <ArmadaRegistry>await hre.upgrades.deployProxy(registryFactory, { kind: "uups", initializer: false }); // prettier-ignore
  const registryAddress = await registry.getAddress();

  const nodesImplFactory = await hre.ethers.getContractFactory("ArmadaNodesImpl");
  const nodesImpl = <ArmadaNodes>await nodesImplFactory.deploy();
  const nodesImplAddress = await nodesImpl.getAddress();

  const nodesFactory = await hre.ethers.getContractFactory("ArmadaNodes", { libraries: { ArmadaNodesImpl: nodesImplAddress } }); // prettier-ignore
  const nodesArgs = [[admin.address], registryAddress, true];
  const nodes = <ArmadaNodes>await hre.upgrades.deployProxy(nodesFactory, nodesArgs, { kind: "uups" });
  const nodesAddress = await nodes.getAddress();
  await hre.network.provider.request({ method: "hardhat_impersonateAccount", params: [nodesAddress] });

  const stakePerNode = parseTokens("1");
  const operatorsFactory = await hre.ethers.getContractFactory("ArmadaOperators");
  const operatorsArgs = [[admin.address], registryAddress, stakePerNode, true];
  const operators = <ArmadaOperators>await hre.upgrades.deployProxy(operatorsFactory, operatorsArgs, { kind: "uups" });
  const operatorsAddress = await operators.getAddress();
  await hre.network.provider.request({ method: "hardhat_impersonateAccount", params: [operatorsAddress] });

  const projectsFactory = await hre.ethers.getContractFactory("ArmadaProjects");
  const projectsArgs = [[admin.address], registryAddress, true];
  const projects = <ArmadaProjects>await hre.upgrades.deployProxy(projectsFactory, projectsArgs, { kind: "uups" });
  const projectsAddress = await projects.getAddress();

  const reservationsFactory = await hre.ethers.getContractFactory("ArmadaReservations");
  const reservationsArgs = [[admin.address], registryAddress, true];
  const reservations = <ArmadaReservations>await hre.upgrades.deployProxy(reservationsFactory, reservationsArgs, { kind: "uups" }); // prettier-ignore
  const reservationsAddress = await reservations.getAddress();

  const billingFactory = await hre.ethers.getContractFactory("ArmadaBilling");
  const billingArgs = [[admin.address], registryAddress];
  const billing = <ArmadaBilling>await hre.upgrades.deployProxy(billingFactory, billingArgs, { kind: "uups" });
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

  const nodesV2Factory = await hre.ethers.getContractFactory("ArmadaNodesV2", {
    signer: admin,
    libraries: { ArmadaNodesImpl: nodesImplAddress },
  });
  const nodesV2 = <ArmadaNodesV2>await hre.upgrades.upgradeProxy(nodesAddress, nodesV2Factory);

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
