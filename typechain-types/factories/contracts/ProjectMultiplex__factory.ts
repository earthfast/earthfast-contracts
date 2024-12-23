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
  BytesLike,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  ProjectMultiplex,
  ProjectMultiplexInterface,
} from "../../contracts/ProjectMultiplex";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_projects",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_projectId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_withdrawalAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "subProjectId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "castHash",
        type: "bytes",
      },
    ],
    name: "SubProjectCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "caster",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "castHash",
        type: "bytes",
      },
    ],
    name: "createProject",
    outputs: [
      {
        internalType: "bytes32",
        name: "subProjectId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "caster",
        type: "string",
      },
    ],
    name: "getSubProjectId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSubProjectIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projectId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projects",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "subProjectIds",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "subProjects",
    outputs: [
      {
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "string",
        name: "caster",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "castHash",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawalAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610bf2380380610bf283398101604081905261002f91610087565b6001600055600380546001600160a01b039485166001600160a01b031991821617909155600492909255600580549190931691161790556100c3565b80516001600160a01b038116811461008257600080fd5b919050565b60008060006060848603121561009c57600080fd5b6100a58461006b565b9250602084015191506100ba6040850161006b565b90509250925092565b610b20806100d26000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638b79543c116100665780638b79543c146100ef5780638e67eac11461011a578063d426552d1461012d578063da6e6a1914610142578063f2bcd0221461016657600080fd5b806306b091f9146100985780630c0b674f146100ad5780633fafa127146100d357806341252ec9146100dc575b600080fd5b6100ab6100a6366004610726565b610179565b005b6100c06100bb366004610817565b610204565b6040519081526020015b60405180910390f35b6100c060045481565b6100c06100ea3660046108d5565b610382565b600354610102906001600160a01b031681565b6040516001600160a01b0390911681526020016100ca565b6100c06101283660046108ee565b6103a3565b6101356103dd565b6040516100ca919061094c565b6101556101503660046108d5565b610435565b6040516100ca9594939291906109dd565b600554610102906001600160a01b031681565b60055460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018390529083169063a9059cbb90604401602060405180830381600087803b1580156101c757600080fd5b505af11580156101db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101ff9190610a3d565b505050565b600061020e610613565b6102198685856103a3565b6040805160a08101825263ffffffff898116825260208083018a81526001600160a01b038a16848601526060840189905260808401889052600086815260018084529590208451815463ffffffff1916941693909317835551805195965092948594929361028b938501920190610671565b5060408201516002820180546001600160a01b0319166001600160a01b03909216919091179055606082015180516102cd916003840191602090910190610671565b50608082015180516102e9916004840191602090910190610671565b5050600280546001810182556000919091527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace01839055506040516001600160a01b03861690839063ffffffff8a16907ff74c263188381085292ee5229a96e405a8f1615a1d2e97e2c46f5c7854e1da7490610366908890610a5f565b60405180910390a4506103796001600055565b95945050505050565b6002818154811061039257600080fd5b600091825260209091200154905081565b60008360045484846040516020016103be9493929190610a72565b6040516020818303038152906040528051906020012090509392505050565b6060600280548060200260200160405190810160405280929190818152602001828054801561042b57602002820191906000526020600020905b815481526020019060010190808311610417575b5050505050905090565b60016020819052600091825260409091208054918101805463ffffffff9093169261045f90610aaf565b80601f016020809104026020016040519081016040528092919081815260200182805461048b90610aaf565b80156104d85780601f106104ad576101008083540402835291602001916104d8565b820191906000526020600020905b8154815290600101906020018083116104bb57829003601f168201915b505050600284015460038501805494956001600160a01b0390921694919350915061050290610aaf565b80601f016020809104026020016040519081016040528092919081815260200182805461052e90610aaf565b801561057b5780601f106105505761010080835404028352916020019161057b565b820191906000526020600020905b81548152906001019060200180831161055e57829003601f168201915b50505050509080600401805461059090610aaf565b80601f01602080910402602001604051908101604052809291908181526020018280546105bc90610aaf565b80156106095780601f106105de57610100808354040283529160200191610609565b820191906000526020600020905b8154815290600101906020018083116105ec57829003601f168201915b5050505050905085565b6002600054141561066a5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015260640160405180910390fd5b6002600055565b82805461067d90610aaf565b90600052602060002090601f01602090048101928261069f57600085556106e5565b82601f106106b857805160ff19168380011785556106e5565b828001600101855582156106e5579182015b828111156106e55782518255916020019190600101906106ca565b506106f19291506106f5565b5090565b5b808211156106f157600081556001016106f6565b80356001600160a01b038116811461072157600080fd5b919050565b6000806040838503121561073957600080fd5b6107428361070a565b946020939093013593505050565b803563ffffffff8116811461072157600080fd5b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561079557610795610764565b604051601f8501601f19908116603f011681019082821181831017156107bd576107bd610764565b816040528093508581528686860111156107d657600080fd5b858560208301376000602087830101525050509392505050565b600082601f83011261080157600080fd5b6108108383356020850161077a565b9392505050565b600080600080600060a0868803121561082f57600080fd5b61083886610750565b9450602086013567ffffffffffffffff8082111561085557600080fd5b61086189838a016107f0565b955061086f6040890161070a565b9450606088013591508082111561088557600080fd5b61089189838a016107f0565b935060808801359150808211156108a757600080fd5b508601601f810188136108b957600080fd5b6108c88882356020840161077a565b9150509295509295909350565b6000602082840312156108e757600080fd5b5035919050565b60008060006060848603121561090357600080fd5b61090c84610750565b925061091a6020850161070a565b9150604084013567ffffffffffffffff81111561093657600080fd5b610942868287016107f0565b9150509250925092565b6020808252825182820181905260009190848201906040850190845b8181101561098457835183529284019291840191600101610968565b50909695505050505050565b6000815180845260005b818110156109b65760208185018101518683018201520161099a565b818111156109c8576000602083870101525b50601f01601f19169290920160200192915050565b63ffffffff8616815260a0602082015260006109fc60a0830187610990565b6001600160a01b03861660408401528281036060840152610a1d8186610990565b90508281036080840152610a318185610990565b98975050505050505050565b600060208284031215610a4f57600080fd5b8151801515811461081057600080fd5b6020815260006108106020830184610990565b63ffffffff8516815283602082015260018060a01b0383166040820152608060608201526000610aa56080830184610990565b9695505050505050565b600181811c90821680610ac357607f821691505b60208210811415610ae457634e487b7160e01b600052602260045260246000fd5b5091905056fea264697066735822122098cc8a3d06e0c50104b2da6bbbcdfcd879cdfe140dd5f286e79de0311e7810fe64736f6c63430008090033";

type ProjectMultiplexConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ProjectMultiplexConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ProjectMultiplex__factory extends ContractFactory {
  constructor(...args: ProjectMultiplexConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _projects: AddressLike,
    _projectId: BytesLike,
    _withdrawalAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _projects,
      _projectId,
      _withdrawalAddress,
      overrides || {}
    );
  }
  override deploy(
    _projects: AddressLike,
    _projectId: BytesLike,
    _withdrawalAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _projects,
      _projectId,
      _withdrawalAddress,
      overrides || {}
    ) as Promise<
      ProjectMultiplex & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ProjectMultiplex__factory {
    return super.connect(runner) as ProjectMultiplex__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProjectMultiplexInterface {
    return new Interface(_abi) as ProjectMultiplexInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ProjectMultiplex {
    return new Contract(address, _abi, runner) as unknown as ProjectMultiplex;
  }
}
