import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/defender-sdk";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import { AdminClient } from "@openzeppelin/defender-sdk";
import { ProposalFunctionInputs } from "@openzeppelin/defender-sdk/lib/models/proposal";
import { fromChainId } from "@openzeppelin/defender-sdk";
import { Contract } from "ethers";
import { Create2DeployOptions, DeployOptions } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { confirm, resolve, stringify } from "./util";

// Deploys a contract
export async function deploy(hre: HardhatRuntimeEnvironment, name: string, opts: DeployOptions): Promise<void> {
  if (confirm(hre, `Deploy ${name} ${stringify(opts.args ?? [])}`)) {
    const deployment = await hre.deployments.deploy(name, { ...opts, log: true });
    console.log(`...reused ${!deployment.newlyDeployed}`);
    if (hre.config.defender) {
      await updateDefender(hre, name, name, deployment.address);
    }
  }
}

// Deploys a contract at deterministic address
export async function deployDeterministic(
  hre: HardhatRuntimeEnvironment,
  name: string,
  opts: Create2DeployOptions
): Promise<void> {
  const deterministic = await hre.deployments.deterministic(name, { ...opts, log: true });
  if (confirm(hre, `Deploy ${name} at ${deterministic.address} ${stringify(opts.args ?? [])}`)) {
    const deployment = await deterministic.deploy();
    console.log(`...reused ${!deployment.newlyDeployed}`);
    if (hre.config.defender) {
      await updateDefender(hre, name, name, deterministic.address);
    }
  }
}

// Deploys proxy contract and an upgradable proxy logic contract
export async function deployProxy(
  hre: HardhatRuntimeEnvironment,
  name: string,
  opts: {
    args?: any[];
    from: string;
    initializer?: string | false;
    libraries?: string[];
  }
) {
  if (confirm(hre, `Deploy ${name} proxy ${stringify(opts.args ?? [])}`)) {
    const signer = await hre.ethers.getSigner(opts.from);
    const libraries = await resolve(hre, opts.libraries);
    const factory = await hre.ethers.getContractFactory(name, { signer, libraries });
    console.log(`...deploying ${name}`);
    const contract = await hre.upgrades.deployProxy(factory, opts.args, {
      kind: "uups",
      initializer: opts.initializer,
    });
    console.log(`...transaction ${contract.deployTransaction.hash}`);
    await contract.deployed();
    console.log(`...deployed at ${contract.address}`);
    if (hre.config.defender) {
      await updateDefender(hre, name, name, contract.address);
    }
    await saveDeployment(hre, name, contract.address, name, contract);
  }
}

// Upgrades a proxy logic contract either directly or through a Defender proposal
export async function upgradeProxy(
  hre: HardhatRuntimeEnvironment,
  name: string,
  opts: { contract: string; from: string; libraries?: string[] }
) {
  if (!hre.config.defender) {
    await deployUpgrade(hre, name, opts);
  } else {
    await proposeUpgrade(hre, name, opts);
  }
}

// Upgrades a proxy logic contract (when not using Defender)
export async function deployUpgrade(
  hre: HardhatRuntimeEnvironment,
  name: string,
  opts: { contract: string; from: string; libraries?: string[] }
): Promise<void> {
  if (confirm(hre, `Upgrade ${name} to ${opts.contract}`)) {
    const signer = await hre.ethers.getSigner(opts.from);
    const deployment = await hre.deployments.get(name);
    const libraries = await resolve(hre, opts.libraries);
    const factory = await hre.ethers.getContractFactory(opts.contract, { signer, libraries });
    console.log(`...deploying ${opts.contract}`);
    const contract = await hre.upgrades.upgradeProxy(deployment.address, factory);
    console.log(`...transaction ${contract.deployTransaction.hash}`);
    await contract.deployed();
    console.log(`...deployed at ${contract.address}`);
    if (hre.config.defender) {
      await updateDefender(hre, name, opts.contract, contract.address);
    }
    await saveDeployment(hre, name, deployment.address, opts.contract, contract);
  }
}

// Creates a Defender proposal to upgrade a proxy logic contract
// TODO: Create Tally proposal (as arbitrary signer instead of guardian)
export async function proposeUpgrade(
  hre: HardhatRuntimeEnvironment,
  name: string,
  opts: { contract: string; from: string; libraries?: string[] }
): Promise<void> {
  if (confirm(hre, `Propose upgrade ${name} to ${opts.contract}`)) {
    const deployment = await hre.deployments.get(name);
    const libraries = await resolve(hre, opts.libraries);
    const factory = await hre.ethers.getContractFactory(opts.contract, { libraries });
    console.log(`...deploying ${opts.contract}`);
    const proposal = await hre.defender.proposeUpgrade(deployment.address, factory, {
      title: `Upgrade to ${opts.contract}`,
      multisig: opts.from,
    });
    const contract = await hre.ethers.getContractAt(opts.contract, proposal.metadata!.newImplementationAddress!);
    console.log(`...deployed contract at ${contract.address}`);
    console.log(`...created proposal at ${proposal.url}`);
    await saveDeployment(hre, name, deployment.address, opts.contract, contract);
  }
}

// Creates a Defender proposal to execute a contract call
export async function createProposal(
  hre: HardhatRuntimeEnvironment,
  contract: string,
  address: string,
  via: string,
  call: string,
  inputs: ProposalFunctionInputs
): Promise<void> {
  const defender = new AdminClient({ apiKey: hre.config.defender!.apiKey, apiSecret: hre.config.defender!.apiSecret });
  const network = fromChainId(parseInt(await hre.getChainId()))!;
  console.log(`...proposing ${call}`);
  const artifact = await hre.deployments.getExtendedArtifact(contract);
  const func = artifact.abi.find((value) => value.name === call);
  const proposal = await defender.createProposal({
    contract: { address, network },
    title: `Execute ${call}`,
    description: "",
    type: "custom",
    functionInterface: func,
    functionInputs: inputs,
    via,
    viaType: "Gnosis Multisig",
  });
  console.log(`...created proposal at ${proposal.url}`);
}

// Registers a contract with Defender
export async function updateDefender(hre: HardhatRuntimeEnvironment, name: string, contract: string, address: string) {
  const defender = new AdminClient({ apiKey: hre.config.defender!.apiKey, apiSecret: hre.config.defender!.apiSecret });
  const network = fromChainId(parseInt(await hre.getChainId()))!;
  const artifact = await hre.deployments.getExtendedArtifact(contract);
  console.log(`...update defender`);
  const detailedName = `${name} (${hre.network.name})`;
  console.log("defender debug", detailedName, address, network, hre.network, await hre.getChainId());
  await defender.addContract({ name: detailedName, address, network, abi: JSON.stringify(artifact.abi) });
}

export async function saveDeployment(
  hre: HardhatRuntimeEnvironment,
  deploymentName: string,
  deploymentAddress: string,
  implementationName: string,
  implementationContract: Contract
) {
  const artifact = await hre.deployments.getExtendedArtifact(implementationName);
  await hre.deployments.save(deploymentName, {
    ...artifact,
    address: deploymentAddress,
    transactionHash: implementationContract.deployTransaction?.hash,
  });
}
