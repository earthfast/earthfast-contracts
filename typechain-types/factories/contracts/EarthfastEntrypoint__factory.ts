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
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "nodePrices",
        type: "uint256[]",
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
    name: "deploySiteWithNodeIds",
    outputs: [],
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
  "0x608060405234801561001057600080fd5b5060405161127c38038061127c83398101604081905261002f91610092565b6001600055601f80546001600160a01b039485166001600160a01b0319918216179091556020805493851693821693909317909255602180549190931691161790556100d5565b80516001600160a01b038116811461008d57600080fd5b919050565b6000806000606084860312156100a757600080fd5b6100b084610076565b92506100be60208501610076565b91506100cc60408501610076565b90509250925092565b611198806100e46000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632f7a6e8c14610046578063aafd1b111461005b578063c3566b6414610081575b600080fd5b610059610054366004610ada565b6100a2565b005b61006e610069366004610bad565b61025b565b6040519081526020015b60405180910390f35b61009461008f366004610c3e565b610434565b604051610078929190610ca6565b6100aa61076b565b6020546040516326dc39b160e11b81526000916001600160a01b031690634db87362906100db908b90600401610d30565b602060405180830381600087803b1580156100f557600080fd5b505af1158015610109573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012d9190610dc1565b9050600080600061013d856107c5565b9250925092506000881161016c5760405162461bcd60e51b815260040161016390610dda565b60405180910390fd5b6020548b516040516371a9d89f60e11b81526001600160a01b039092169163e353b13e916101a89188908d908c908a908a908a90600401610e1e565b600060405180830381600087803b1580156101c257600080fd5b505af11580156101d6573d6000803e3d6000fd5b50506021548d516040516356790ca360e01b81526001600160a01b0390921693506356790ca392506102129188908f908f908e90600401610e6d565b600060405180830381600087803b15801561022c57600080fd5b505af1158015610240573d6000803e3d6000fd5b50505050505050506102526001600055565b50505050505050565b600061026561076b565b6020546040516326dc39b160e11b81526001600160a01b0390911690634db8736290610295908a90600401610d30565b602060405180830381600087803b1580156102af57600080fd5b505af11580156102c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102e79190610dc1565b905060008060006102f7856107c5565b9250925092506000881161031d5760405162461bcd60e51b815260040161016390610dda565b6020548a516040516371a9d89f60e11b81526001600160a01b039092169163e353b13e916103599188908d908c908a908a908a90600401610e1e565b600060405180830381600087803b15801561037357600080fd5b505af1158015610387573d6000803e3d6000fd5b505050506000806103988b8a610434565b91509150602160009054906101000a90046001600160a01b03166001600160a01b03166356790ca38d600001518885858e6040518663ffffffff1660e01b81526004016103e9959493929190610e6d565b600060405180830381600087803b15801561040357600080fd5b505af1158015610417573d6000803e3d6000fd5b50505050505050505061042a6001600055565b9695505050505050565b601f5460405163da0549ab60e01b815260006004820181905260609283926001600160a01b039091169063da0549ab9060240160206040518083038186803b15801561047f57600080fd5b505afa158015610493573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b79190610dc1565b601f546040516379ca4a3960e01b815260006004820181905260248201819052604482018490529293506001600160a01b03909116906379ca4a399060640160006040518083038186803b15801561050e57600080fd5b505afa158015610522573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261054a9190810190610fa4565b90508567ffffffffffffffff81111561056557610565610837565b60405190808252806020026020018201604052801561058e578160200160208202803683370190505b5093508567ffffffffffffffff8111156105aa576105aa610837565b6040519080825280602002602001820160405280156105d3578160200160208202803683370190505b5092506000805b83811015610711578281815181106105f4576105f46110ff565b602002602001015160c001518760000160208101906106139190611115565b61061e576001610621565b60005b60028110610631576106316110ff565b60200201516107015782818151811061064c5761064c6110ff565b60200260200101516000015186838151811061066a5761066a6110ff565b602002602001018181525050828181518110610688576106886110ff565b602002602001015160a001518760000160208101906106a79190611115565b6106b25760016106b5565b60005b600281106106c5576106c56110ff565b60200201518583815181106106dc576106dc6110ff565b6020908102919091010152816106f181611139565b9250508782141561070157610711565b61070a81611139565b90506105da565b508681146107615760405162461bcd60e51b815260206004820152601a60248201527f4e6f7420656e6f75676820617661696c61626c65206e6f6465730000000000006044820152606401610163565b5050509250929050565b600260005414156107be5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610163565b6002600055565b6000806000835160411461081b5760405162461bcd60e51b815260206004820152601860248201527f496e76616c6964207369676e6174757265206c656e67746800000000000000006044820152606401610163565b5050506020810151604082015160609092015160001a92909190565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff8111828210171561087057610870610837565b60405290565b60405160e0810167ffffffffffffffff8111828210171561087057610870610837565b604051601f8201601f1916810167ffffffffffffffff811182821017156108c2576108c2610837565b604052919050565b80356001600160a01b03811681146108e157600080fd5b919050565b600067ffffffffffffffff82111561090057610900610837565b50601f01601f191660200190565b600082601f83011261091f57600080fd5b813561093261092d826108e6565b610899565b81815284602083860101111561094757600080fd5b816020850160208301376000918101602001919091529392505050565b600060c0828403121561097657600080fd5b61097e61084d565b9050610989826108ca565b8152602082013567ffffffffffffffff808211156109a657600080fd5b6109b28583860161090e565b602084015260408401359150808211156109cb57600080fd5b6109d78583860161090e565b604084015260608401359150808211156109f057600080fd5b6109fc8583860161090e565b60608401526080840135608084015260a0840135915080821115610a1f57600080fd5b50610a2c8482850161090e565b60a08301525092915050565b600067ffffffffffffffff821115610a5257610a52610837565b5060051b60200190565b600082601f830112610a6d57600080fd5b81356020610a7d61092d83610a38565b82815260059290921b84018101918181019086841115610a9c57600080fd5b8286015b84811015610ab75780358352918301918301610aa0565b509695505050505050565b600060408284031215610ad457600080fd5b50919050565b6000806000806000806000610100888a031215610af657600080fd5b873567ffffffffffffffff80821115610b0e57600080fd5b610b1a8b838c01610964565b985060208a0135915080821115610b3057600080fd5b610b3c8b838c01610a5c565b975060408a0135915080821115610b5257600080fd5b610b5e8b838c01610a5c565b965060608a01359550610b748b60808c01610ac2565b945060c08a0135935060e08a0135915080821115610b9157600080fd5b50610b9e8a828b0161090e565b91505092959891949750929550565b60008060008060008060e08789031215610bc657600080fd5b863567ffffffffffffffff80821115610bde57600080fd5b610bea8a838b01610964565b97506020890135965060408901359550610c078a60608b01610ac2565b945060a0890135935060c0890135915080821115610c2457600080fd5b50610c3189828a0161090e565b9150509295509295509295565b60008060608385031215610c5157600080fd5b82359150610c628460208501610ac2565b90509250929050565b600081518084526020808501945080840160005b83811015610c9b57815187529582019590820190600101610c7f565b509495945050505050565b604081526000610cb96040830185610c6b565b8281036020840152610ccb8185610c6b565b95945050505050565b60005b83811015610cef578181015183820152602001610cd7565b83811115610cfe576000848401525b50505050565b60008151808452610d1c816020860160208601610cd4565b601f01601f19169290920160200192915050565b602080825282516001600160a01b03168282015282015160c06040830152600090610d5e60e0840182610d04565b90506040840151601f1980858403016060860152610d7c8383610d04565b92506060860151915080858403016080860152610d998383610d04565b9250608086015160a086015260a08601519150808584030160c086015250610ccb8282610d04565b600060208284031215610dd357600080fd5b5051919050565b60208082526024908201527f457363726f7720616d6f756e74206d75737420626520677265617465722074686040820152630616e20360e41b606082015260800190565b6001600160a01b0397909716875260208701959095526040860193909352606085019190915260ff16608084015260a083015260c082015260e00190565b8015158114610e6a57600080fd5b50565b60018060a01b038616815284602082015260c060408201526000610e9460c0830186610c6b565b8281036060840152610ea68186610c6b565b9150508235610eb481610e5c565b151560808301526020830135610ec981610e5c565b80151560a0840152509695505050505050565b600082601f830112610eed57600080fd5b8151610efb61092d826108e6565b818152846020838601011115610f1057600080fd5b610f21826020830160208701610cd4565b949350505050565b80516108e181610e5c565b600082601f830112610f4557600080fd5b6040516040810181811067ffffffffffffffff82111715610f6857610f68610837565b8060405250806040840185811115610f7f57600080fd5b845b81811015610f99578051835260209283019201610f81565b509195945050505050565b60006020808385031215610fb757600080fd5b825167ffffffffffffffff80821115610fcf57600080fd5b818501915085601f830112610fe357600080fd5b8151610ff161092d82610a38565b81815260059190911b8301840190848101908883111561101057600080fd5b8585015b838110156110f25780518581111561102c5760008081fd5b8601610120818c03601f190112156110445760008081fd5b61104c610876565b8882015181526040808301518a830152606080840151898111156110705760008081fd5b61107e8f8d83880101610edc565b83850152506080915081840151898111156110995760008081fd5b6110a78f8d83880101610edc565b82850152505060a06110ba818501610f29565b8284015260c091506110ce8e838601610f34565b908301526110e08d6101008501610f34565b90820152845250918601918601611014565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561112757600080fd5b813561113281610e5c565b9392505050565b600060001982141561115b57634e487b7160e01b600052601160045260246000fd5b506001019056fea26469706673582212201b86b58204530eb645bbe004e225fcfa0c7bbfa4dede8790c425e62d1a12131e64736f6c63430008090033";

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
