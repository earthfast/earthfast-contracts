import { promises as fs } from "fs";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { Zero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as ethutil from "ethereumjs-util";
import * as ethwallet from "ethereumjs-wallet";
import { BigNumber, BigNumberish, Contract, ethers, TypedDataField } from "ethers";
import { formatUnits, Interface, parseUnits, Result } from "ethers/lib/utils";
import { HardhatRuntimeEnvironment, Libraries } from "hardhat/types";
import { keyIn } from "readline-sync";

// @ts-ignore Type created during hardhat compile
type ERC20Permit = import("../typechain-types").ERC20Permit;

export const stringify = (value: any): string => JSON.stringify(value, null, 2);
export const parseUSDC = (value: string): BigNumber => parseUnits(value, 6);
export const parseTokens = (value: string): BigNumber => parseUnits(value, 18);
export const formatUSDC = (value: BigNumberish): string => formatUnits(value, 6);
export const formatTokens = (value: BigNumberish): string => formatUnits(value, 18);
export const toHexString = (value: number): string => `0x${value.toString(16)}`;
export const coverage = (hre: HardhatRuntimeEnvironment): boolean => (hre as any).__SOLIDITY_COVERAGE_RUNNING === true;

export const Permit: Record<string, Array<TypedDataField>> = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

export async function approve(
  hre: HardhatRuntimeEnvironment,
  token: ERC20Permit,
  owner: string,
  spender: string,
  value: BigNumber
): Promise<[number, number, string, string]> {
  const chainId = await hre.getChainId();
  const deadline = Math.floor(Date.now() / 1000) + 3600;
  const nonce = await token.nonces(owner);
  const domain = { name: await token.name(), version: "1", chainId, verifyingContract: token.address };
  const values = { owner, spender, value, nonce, deadline };
  const signer = await hre.ethers.getSigner(owner);
  const signature = await (signer as unknown as TypedDataSigner)._signTypedData(domain, Permit, values);
  const sig = ethers.utils.splitSignature(signature);
  return [deadline, sig.v, sig.r, sig.s];
}

export async function signers(hre: HardhatRuntimeEnvironment): Promise<{
  deployer: SignerWithAddress;
  guardian: SignerWithAddress;
  operator: SignerWithAddress;
  project: SignerWithAddress;
  admin: SignerWithAddress;
}> {
  return {
    deployer: await hre.ethers.getSigner((await hre.getNamedAccounts()).deployer),
    guardian: await hre.ethers.getSigner((await hre.getNamedAccounts()).guardian),
    operator: await hre.ethers.getSigner((await hre.getNamedAccounts()).operator),
    project: await hre.ethers.getSigner((await hre.getNamedAccounts()).project),
    admin: await hre.ethers.getSigner((await hre.getNamedAccounts()).guardian),
  };
}

export function getAddress(privateKey: string | undefined): string | undefined {
  if (privateKey === undefined) return undefined;
  const buffer = ethutil.toBuffer(privateKey);
  const wallet = ethwallet.default.fromPrivateKey(buffer);
  const address = wallet.getAddressString();
  return address;
}

export async function getNamedSigners(hre: HardhatRuntimeEnvironment): Promise<{ name: string; address: string }> {
  const as = await hre.getNamedAccounts();
  const es = Object.entries(as);
  const ss = await Promise.all(es.map(async (s) => [s[0], await hre.ethers.getSigner(s[1])]));
  const ss1 = Object.fromEntries(ss);
  return ss1;
}

export async function loadData(hre: HardhatRuntimeEnvironment): Promise<any> {
  if (!hre.config.data) return undefined;
  const file = hre.config.data ?? `data/${hre.network.name === "hardhat" ? "localhost" : hre.network.name}.json`;
  console.log(`Using data ${file}`);
  const data = JSON.parse(await fs.readFile(file, "utf8"));
  return data;
}

export function confirm(hre: HardhatRuntimeEnvironment, query: any): boolean {
  console.log(`\n---${query}`);
  if (!hre.config.ask) return true;
  const key = keyIn("(y) yes (s) skip (q) quit > ", { limit: "ysq" });
  if (key === "q" || key === "Q") {
    console.log("Quit");
    process.exit(1); // eslint-disable-line no-process-exit
  }
  return key === "y" || key === "Y";
}

export async function wait(txPromise: Promise<TransactionResponse>): Promise<TransactionReceipt> {
  const tx = await txPromise;
  console.log(`...transaction ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`...status ${receipt.status}`);
  return receipt;
}

export async function attach(
  hre: HardhatRuntimeEnvironment,
  name: string,
  signer?: SignerWithAddress
): Promise<Contract> {
  const deployment = await hre.deployments.get(name);
  const contract = await hre.ethers.getContractAt(name, deployment.address, signer);
  console.log(`...attached ${name} at ${contract.address}`);
  return contract;
}

export async function resolve(hre: HardhatRuntimeEnvironment, names?: string[]): Promise<Libraries | undefined> {
  if (names === undefined) {
    return undefined;
  }
  const libraries: Libraries = {};
  for (const name of names) {
    const deployment = await hre.deployments.get(name);
    const contract = await hre.ethers.getContractAt(name, deployment.address);
    console.log(`...resolved ${name} at ${contract.address}`);
    libraries[name] = contract.address;
  }
  return libraries;
}

export async function decodeEvent(
  receipt: TransactionReceipt,
  contract: Contract,
  event: string
): Promise<Result | Result[]> {
  const results = [];
  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i];
    try {
      const args = contract.interface.decodeEventLog(event, log.data, log.topics);
      if (args) {
        results.push(args);
      }
    } catch {
      continue;
    }
  }
  return results.length === 1 ? results[0] : results;
}

export function getInterfaceID(contractInterface: Interface) {
  let interfaceID = Zero;
  const functions = Object.keys(contractInterface.functions);
  for (let i = 0; i < functions.length; i++) {
    interfaceID = interfaceID.xor(contractInterface.getSighash(functions[i]));
  }
  return interfaceID;
}
