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
import type { NonPayableOverrides } from "../../../../../common";
import type {
  LinkToken,
  LinkTokenInterface,
} from "../../../../../@chainlink/local/src/shared/LinkToken";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "transferAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600f81526020016e21b430b4b72634b735902a37b5b2b760891b815250604051806040016040528060048152602001634c494e4b60e01b815250818181600390816200006a91906200021d565b5060046200007982826200021d565b50505050506200008e6200009460201b60201c565b62000311565b620000ac336b033b2e3c9fd0803ce8000000620000ae565b565b6001600160a01b038216620001095760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b80600260008282546200011d9190620002e9565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b505050565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620001a457607f821691505b602082108103620001c557634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200017457600081815260208120601f850160051c81016020861015620001f45750805b601f850160051c820191505b81811015620002155782815560010162000200565b505050505050565b81516001600160401b0381111562000239576200023962000179565b62000251816200024a84546200018f565b84620001cb565b602080601f831160018114620002895760008415620002705750858301515b600019600386901b1c1916600185901b17855562000215565b600085815260208120601f198616915b82811015620002ba5788860151825594840194600190910190840162000299565b5085821015620002d95787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b808201808211156200030b57634e487b7160e01b600052601160045260246000fd5b92915050565b610a8480620003216000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80634000aea0116100715780634000aea01461014157806370a082311461015457806395d89b411461017d578063a457c2d714610185578063a9059cbb14610198578063dd62ed3e146101ab57600080fd5b806306fdde03146100b9578063095ea7b3146100d757806318160ddd146100fa57806323b872dd1461010c578063313ce5671461011f578063395093511461012e575b600080fd5b6100c16101be565b6040516100ce91906107d7565b60405180910390f35b6100ea6100e536600461080d565b610250565b60405190151581526020016100ce565b6002545b6040519081526020016100ce565b6100ea61011a366004610837565b61026a565b604051601281526020016100ce565b6100ea61013c36600461080d565b61028e565b6100ea61014f366004610889565b6102b0565b6100fe610162366004610954565b6001600160a01b031660009081526020819052604090205490565b6100c1610387565b6100ea61019336600461080d565b610396565b6100ea6101a636600461080d565b610416565b6100fe6101b936600461096f565b610424565b6060600380546101cd906109a2565b80601f01602080910402602001604051908101604052809291908181526020018280546101f9906109a2565b80156102465780601f1061021b57610100808354040283529160200191610246565b820191906000526020600020905b81548152906001019060200180831161022957829003601f168201915b5050505050905090565b60003361025e81858561044f565b60019150505b92915050565b600033610278858285610573565b6102838585856105ed565b506001949350505050565b60003361025e8185856102a18383610424565b6102ab91906109dc565b61044f565b60006102bc8484610416565b50836001600160a01b0316336001600160a01b03167fe19260aff97b920c7df27010903aeb9c8d2be5d310a2c67824cf3f15396e4c1685856040516103029291906109fd565b60405180910390a36001600160a01b0384163b1561037d57604051635260769b60e11b81526001600160a01b0385169063a4c0ed369061034a90339087908790600401610a1e565b600060405180830381600087803b15801561036457600080fd5b505af1158015610378573d6000803e3d6000fd5b505050505b5060019392505050565b6060600480546101cd906109a2565b600033816103a48286610424565b9050838110156104095760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b610283828686840361044f565b60003361025e8185856105ed565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166104b15760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610400565b6001600160a01b0382166105125760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610400565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061057f8484610424565b905060001981146105e757818110156105da5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610400565b6105e7848484840361044f565b50505050565b6001600160a01b0383166106515760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610400565b6001600160a01b0382166106b35760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610400565b6001600160a01b0383166000908152602081905260409020548181101561072b5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610400565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a36105e7565b6000815180845260005b818110156107b75760208185018101518683018201520161079b565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006107ea6020830184610791565b9392505050565b80356001600160a01b038116811461080857600080fd5b919050565b6000806040838503121561082057600080fd5b610829836107f1565b946020939093013593505050565b60008060006060848603121561084c57600080fd5b610855846107f1565b9250610863602085016107f1565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b60008060006060848603121561089e57600080fd5b6108a7846107f1565b925060208401359150604084013567ffffffffffffffff808211156108cb57600080fd5b818601915086601f8301126108df57600080fd5b8135818111156108f1576108f1610873565b604051601f8201601f19908116603f0116810190838211818310171561091957610919610873565b8160405282815289602084870101111561093257600080fd5b8260208601602083013760006020848301015280955050505050509250925092565b60006020828403121561096657600080fd5b6107ea826107f1565b6000806040838503121561098257600080fd5b61098b836107f1565b9150610999602084016107f1565b90509250929050565b600181811c908216806109b657607f821691505b6020821081036109d657634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561026457634e487b7160e01b600052601160045260246000fd5b828152604060208201526000610a166040830184610791565b949350505050565b60018060a01b0384168152826020820152606060408201526000610a456060830184610791565b9594505050505056fea26469706673582212201046238a84491b00ea4c5dcc362640106ed596d69ef483ea6c941bee38180b6464736f6c63430008140033";

type LinkTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LinkTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LinkToken__factory extends ContractFactory {
  constructor(...args: LinkTokenConstructorParams) {
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
      LinkToken & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): LinkToken__factory {
    return super.connect(runner) as LinkToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LinkTokenInterface {
    return new Interface(_abi) as LinkTokenInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): LinkToken {
    return new Contract(address, _abi, runner) as unknown as LinkToken;
  }
}