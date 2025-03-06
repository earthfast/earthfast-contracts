/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  EarthfastEntrypoint,
  EarthfastEntrypointInterface,
} from "../../contracts/EarthfastEntrypoint";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "nodes",
        type: "address",
      },
      {
        internalType: "address",
        name: "projects",
        type: "address",
      },
      {
        internalType: "address",
        name: "reservations",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "email",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "checksum",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct EarthfastCreateProjectData",
        name: "project",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "nodesToReserve",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "escrowAmount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "last",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "next",
            type: "bool",
          },
        ],
        internalType: "struct EarthfastSlot",
        name: "slot",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "deploySite",
    outputs: [
      {
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nodesToReserve",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "last",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "next",
            type: "bool",
          },
        ],
        internalType: "struct EarthfastSlot",
        name: "slot",
        type: "tuple",
      },
    ],
    name: "getAvailableNodes",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "nodePrices",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161101838038061101883398101604081905261002f91610092565b6001600055601f80546001600160a01b039485166001600160a01b0319918216179091556020805493851693821693909317909255602180549190931691161790556100d5565b80516001600160a01b038116811461008d57600080fd5b919050565b6000806000606084860312156100a757600080fd5b6100b084610076565b92506100be60208501610076565b91506100cc60408501610076565b90509250925092565b610f34806100e46000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063aafd1b111461003b578063c3566b6414610061575b600080fd5b61004e6100493660046108f7565b610082565b6040519081526020015b60405180910390f35b61007461006f366004610a3d565b6103af565b604051610058929190610aa5565b600061008c6106e6565b6020546040516326dc39b160e11b81526001600160a01b0390911690634db87362906100bc908a90600401610b2f565b602060405180830381600087803b1580156100d657600080fd5b505af11580156100ea573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061010e9190610bc0565b9050600080600061011e85610740565b925092509250600088116101855760405162461bcd60e51b8152602060048201526024808201527f457363726f7720616d6f756e74206d75737420626520677265617465722074686044820152630616e20360e41b60648201526084015b60405180910390fd5b602080546040805160248101889052604481018c9052606481018a905260ff8716608482015260a4810186905260c48082018690528251808303909101815260e4909101825292830180516001600160e01b031663491a8bbd60e01b179052516000926001600160a01b03909216916101fd91610bd9565b600060405180830381855af49150503d8060008114610238576040519150601f19603f3d011682016040523d82523d6000602084013e61023d565b606091505b505090508061027f5760405162461bcd60e51b815260206004820152600e60248201526d11195c1bdcda5d0819985a5b195960921b604482015260640161017c565b60008061028c8c8b6103af565b915091506000602160009054906101000a90046001600160a01b03166001600160a01b0316632a2d5b2e60e01b8985858f6040516024016102d09493929190610c06565b60408051601f198184030181529181526020820180516001600160e01b03166001600160e01b031990941693909317909252905161030e9190610bd9565b600060405180830381855af49150503d8060008114610349576040519150601f19603f3d011682016040523d82523d6000602084013e61034e565b606091505b50509050806103945760405162461bcd60e51b815260206004820152601260248201527114995cd95c9d985d1a5bdb8819985a5b195960721b604482015260640161017c565b505050505050506103a56001600055565b9695505050505050565b601f5460405163da0549ab60e01b815260006004820181905260609283926001600160a01b039091169063da0549ab9060240160206040518083038186803b1580156103fa57600080fd5b505afa15801561040e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104329190610bc0565b601f546040516379ca4a3960e01b815260006004820181905260248201819052604482018490529293506001600160a01b03909116906379ca4a399060640160006040518083038186803b15801561048957600080fd5b505afa15801561049d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526104c59190810190610d2e565b90508567ffffffffffffffff8111156104e0576104e06107b2565b604051908082528060200260200182016040528015610509578160200160208202803683370190505b5093508567ffffffffffffffff811115610525576105256107b2565b60405190808252806020026020018201604052801561054e578160200160208202803683370190505b5092506000805b8381101561068c5782818151811061056f5761056f610e9b565b602002602001015160c0015187600001602081019061058e9190610eb1565b61059957600161059c565b60005b600281106105ac576105ac610e9b565b602002015161067c578281815181106105c7576105c7610e9b565b6020026020010151600001518683815181106105e5576105e5610e9b565b60200260200101818152505082818151811061060357610603610e9b565b602002602001015160a001518760000160208101906106229190610eb1565b61062d576001610630565b60005b6002811061064057610640610e9b565b602002015185838151811061065757610657610e9b565b60209081029190910101528161066c81610ed5565b9250508782141561067c5761068c565b61068581610ed5565b9050610555565b508681146106dc5760405162461bcd60e51b815260206004820152601a60248201527f4e6f7420656e6f75676820617661696c61626c65206e6f646573000000000000604482015260640161017c565b5050509250929050565b600260005414156107395760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640161017c565b6002600055565b600080600083516041146107965760405162461bcd60e51b815260206004820152601860248201527f496e76616c6964207369676e6174757265206c656e6774680000000000000000604482015260640161017c565b5050506020810151604082015160609092015160001a92909190565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff811182821017156107eb576107eb6107b2565b60405290565b60405160e0810167ffffffffffffffff811182821017156107eb576107eb6107b2565b604051601f8201601f1916810167ffffffffffffffff8111828210171561083d5761083d6107b2565b604052919050565b80356001600160a01b038116811461085c57600080fd5b919050565b600067ffffffffffffffff82111561087b5761087b6107b2565b50601f01601f191660200190565b600082601f83011261089a57600080fd5b81356108ad6108a882610861565b610814565b8181528460208386010111156108c257600080fd5b816020850160208301376000918101602001919091529392505050565b6000604082840312156108f157600080fd5b50919050565b60008060008060008060e0878903121561091057600080fd5b863567ffffffffffffffff8082111561092857600080fd5b9088019060c0828b03121561093c57600080fd5b6109446107c8565b61094d83610845565b815260208301358281111561096157600080fd5b61096d8c828601610889565b60208301525060408301358281111561098557600080fd5b6109918c828601610889565b6040830152506060830135828111156109a957600080fd5b6109b58c828601610889565b6060830152506080830135608082015260a0830135828111156109d757600080fd5b6109e38c828601610889565b60a08301525097506020890135965060408901359550610a068a60608b016108df565b945060a0890135935060c0890135915080821115610a2357600080fd5b50610a3089828a01610889565b9150509295509295509295565b60008060608385031215610a5057600080fd5b82359150610a6184602085016108df565b90509250929050565b600081518084526020808501945080840160005b83811015610a9a57815187529582019590820190600101610a7e565b509495945050505050565b604081526000610ab86040830185610a6a565b8281036020840152610aca8185610a6a565b95945050505050565b60005b83811015610aee578181015183820152602001610ad6565b83811115610afd576000848401525b50505050565b60008151808452610b1b816020860160208601610ad3565b601f01601f19169290920160200192915050565b602080825282516001600160a01b03168282015282015160c06040830152600090610b5d60e0840182610b03565b90506040840151601f1980858403016060860152610b7b8383610b03565b92506060860151915080858403016080860152610b988383610b03565b9250608086015160a086015260a08601519150808584030160c086015250610aca8282610b03565b600060208284031215610bd257600080fd5b5051919050565b60008251610beb818460208701610ad3565b9190910192915050565b8015158114610c0357600080fd5b50565b84815260a060208201526000610c1f60a0830186610a6a565b8281036040840152610c318186610a6a565b9150508235610c3f81610bf5565b151560608301526020830135610c5481610bf5565b80151560808401525095945050505050565b600082601f830112610c7757600080fd5b8151610c856108a882610861565b818152846020838601011115610c9a57600080fd5b610cab826020830160208701610ad3565b949350505050565b805161085c81610bf5565b600082601f830112610ccf57600080fd5b6040516040810181811067ffffffffffffffff82111715610cf257610cf26107b2565b8060405250806040840185811115610d0957600080fd5b845b81811015610d23578051835260209283019201610d0b565b509195945050505050565b60006020808385031215610d4157600080fd5b825167ffffffffffffffff80821115610d5957600080fd5b818501915085601f830112610d6d57600080fd5b815181811115610d7f57610d7f6107b2565b8060051b610d8e858201610814565b9182528381018501918581019089841115610da857600080fd5b86860192505b83831015610e8e57825185811115610dc65760008081fd5b8601610120818c03601f19011215610dde5760008081fd5b610de66107f1565b8882015181526040808301518a83015260608084015189811115610e0a5760008081fd5b610e188f8d83880101610c66565b8385015250608091508184015189811115610e335760008081fd5b610e418f8d83880101610c66565b82850152505060a0610e54818501610cb3565b8284015260c09150610e688e838601610cbe565b90830152610e7a8d6101008501610cbe565b908201528352509186019190860190610dae565b9998505050505050505050565b634e487b7160e01b600052603260045260246000fd5b600060208284031215610ec357600080fd5b8135610ece81610bf5565b9392505050565b6000600019821415610ef757634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220e048442f1873fbbd6e9bf987777c511a3e3a87f2b6251330759b9964aad59bec64736f6c63430008090033";

type EarthfastEntrypointConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EarthfastEntrypointConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EarthfastEntrypoint__factory extends ContractFactory {
  constructor(...args: EarthfastEntrypointConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    nodes: AddressLike,
    projects: AddressLike,
    reservations: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      nodes,
      projects,
      reservations,
      overrides || {}
    );
  }
  override deploy(
    nodes: AddressLike,
    projects: AddressLike,
    reservations: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      nodes,
      projects,
      reservations,
      overrides || {}
    ) as Promise<
      EarthfastEntrypoint & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): EarthfastEntrypoint__factory {
    return super.connect(runner) as EarthfastEntrypoint__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EarthfastEntrypointInterface {
    return new Interface(_abi) as EarthfastEntrypointInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EarthfastEntrypoint {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as EarthfastEntrypoint;
  }
}
