/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../../../common";
import type {
  Internal,
  InternalInterface,
} from "../../../../../../../@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Internal";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedAddress",
        type: "bytes",
      },
    ],
    name: "InvalidEVMAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ANY_2_EVM_MESSAGE_FIXED_BYTES",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ANY_2_EVM_MESSAGE_FIXED_BYTES_PER_TOKEN",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CHAIN_FAMILY_SELECTOR_EVM",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GAS_PRICE_BITS",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MESSAGE_FIXED_BYTES",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MESSAGE_FIXED_BYTES_PER_TOKEN",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRECOMPILE_SPACE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x61013161003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe7300000000000000000000000000000000000000003014608060405260043610607e5760003560e01c80637a4bb23211605f5780637a4bb2321460ae578063dc47c58b1460c6578063e5fb56521460ce578063fb633e9c1460d657600080fd5b806318994e7a146083578063424fb7a714609e578063514abc101460a6575b600080fd5b608b61022081565b6040519081526020015b60405180910390f35b608b61012081565b608b6101c081565b60b5607081565b60405160ff90911681526020016095565b608b61018081565b608b61040081565b60e3630a04b54b60e21b81565b6040516001600160e01b03199091168152602001609556fea264697066735822122030e6a14d8b18d5f632a392858cc577e1c55e2644be1e948ecc41cf0eada44c1264736f6c63430008140033";

type InternalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: InternalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Internal__factory extends ContractFactory {
  constructor(...args: InternalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Internal & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Internal__factory {
    return super.connect(runner) as Internal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InternalInterface {
    return new Interface(_abi) as InternalInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Internal {
    return new Contract(address, _abi, runner) as unknown as Internal;
  }
}
