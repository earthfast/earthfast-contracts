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
        name: "_owner",
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
        internalType: "bytes32",
        name: "subProjectId",
        type: "bytes32",
      },
    ],
    name: "deleteSubProject",
    outputs: [],
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
    name: "owner",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610d4e380380610d4e83398101604081905261002f91610087565b6001600055600380546001600160a01b039485166001600160a01b031991821617909155600492909255600580549190931691161790556100c3565b80516001600160a01b038116811461008257600080fd5b919050565b60008060006060848603121561009c57600080fd5b6100a58461006b565b9250602084015191506100ba6040850161006b565b90509250925092565b610c7c806100d26000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80638da5cb5b116100665780638da5cb5b146101055780638e67eac114610118578063b93971be1461012b578063d426552d14610140578063da6e6a191461015557600080fd5b80630c0b674f146100985780633fafa127146100be57806341252ec9146100c75780638b79543c146100da575b600080fd5b6100ab6100a6366004610921565b610179565b6040519081526020015b60405180910390f35b6100ab60045481565b6100ab6100d53660046109df565b6102f7565b6003546100ed906001600160a01b031681565b6040516001600160a01b0390911681526020016100b5565b6005546100ed906001600160a01b031681565b6100ab6101263660046109f8565b610318565b61013e6101393660046109df565b610352565b005b610148610422565b6040516100b59190610a56565b6101686101633660046109df565b61047a565b6040516100b5959493929190610ae7565b6000610183610658565b61018e868585610318565b6040805160a08101825263ffffffff898116825260208083018a81526001600160a01b038a16848601526060840189905260808401889052600086815260018084529590208451815463ffffffff1916941693909317835551805195965092948594929361020093850192019061076f565b5060408201516002820180546001600160a01b0319166001600160a01b039092169190911790556060820151805161024291600384019160209091019061076f565b506080820151805161025e91600484019160209091019061076f565b5050600280546001810182556000919091527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace01839055506040516001600160a01b03861690839063ffffffff8a16907ff74c263188381085292ee5229a96e405a8f1615a1d2e97e2c46f5c7854e1da74906102db908890610b47565b60405180910390a4506102ee6001600055565b95945050505050565b6002818154811061030757600080fd5b600091825260209091200154905081565b60008360045484846040516020016103339493929190610b5a565b6040516020818303038152906040528051906020012090509392505050565b6005546001600160a01b031633146103bb5760405162461bcd60e51b815260206004820152602160248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6044820152603760f91b60648201526084015b60405180910390fd5b60008181526001602081905260408220805463ffffffff1916815591906103e4908301826107f3565b6002820180546001600160a01b03191690556104046003830160006107f3565b6104126004830160006107f3565b505061041f6002826106b2565b50565b6060600280548060200260200160405190810160405280929190818152602001828054801561047057602002820191906000526020600020905b81548152602001906001019080831161045c575b5050505050905090565b60016020819052600091825260409091208054918101805463ffffffff909316926104a490610b97565b80601f01602080910402602001604051908101604052809291908181526020018280546104d090610b97565b801561051d5780601f106104f25761010080835404028352916020019161051d565b820191906000526020600020905b81548152906001019060200180831161050057829003601f168201915b505050600284015460038501805494956001600160a01b0390921694919350915061054790610b97565b80601f016020809104026020016040519081016040528092919081815260200182805461057390610b97565b80156105c05780601f10610595576101008083540402835291602001916105c0565b820191906000526020600020905b8154815290600101906020018083116105a357829003601f168201915b5050505050908060040180546105d590610b97565b80601f016020809104026020016040519081016040528092919081815260200182805461060190610b97565b801561064e5780601f106106235761010080835404028352916020019161064e565b820191906000526020600020905b81548152906001019060200180831161063157829003601f168201915b5050505050905085565b600260005414156106ab5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016103b2565b6002600055565b60005b825481101561076a57818382815481106106d1576106d1610bd2565b9060005260206000200154141561075857825483906106f290600190610bfe565b8154811061070257610702610bd2565b906000526020600020015483828154811061071f5761071f610bd2565b90600052602060002001819055508280548061073d5761073d610c15565b60019003818190600052602060002001600090559055505050565b8061076281610c2b565b9150506106b5565b505050565b82805461077b90610b97565b90600052602060002090601f01602090048101928261079d57600085556107e3565b82601f106107b657805160ff19168380011785556107e3565b828001600101855582156107e3579182015b828111156107e35782518255916020019190600101906107c8565b506107ef929150610829565b5090565b5080546107ff90610b97565b6000825580601f1061080f575050565b601f01602090049060005260206000209081019061041f91905b5b808211156107ef576000815560010161082a565b803563ffffffff8116811461085257600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600067ffffffffffffffff8084111561088857610888610857565b604051601f8501601f19908116603f011681019082821181831017156108b0576108b0610857565b816040528093508581528686860111156108c957600080fd5b858560208301376000602087830101525050509392505050565b600082601f8301126108f457600080fd5b6109038383356020850161086d565b9392505050565b80356001600160a01b038116811461085257600080fd5b600080600080600060a0868803121561093957600080fd5b6109428661083e565b9450602086013567ffffffffffffffff8082111561095f57600080fd5b61096b89838a016108e3565b95506109796040890161090a565b9450606088013591508082111561098f57600080fd5b61099b89838a016108e3565b935060808801359150808211156109b157600080fd5b508601601f810188136109c357600080fd5b6109d28882356020840161086d565b9150509295509295909350565b6000602082840312156109f157600080fd5b5035919050565b600080600060608486031215610a0d57600080fd5b610a168461083e565b9250610a246020850161090a565b9150604084013567ffffffffffffffff811115610a4057600080fd5b610a4c868287016108e3565b9150509250925092565b6020808252825182820181905260009190848201906040850190845b81811015610a8e57835183529284019291840191600101610a72565b50909695505050505050565b6000815180845260005b81811015610ac057602081850181015186830182015201610aa4565b81811115610ad2576000602083870101525b50601f01601f19169290920160200192915050565b63ffffffff8616815260a060208201526000610b0660a0830187610a9a565b6001600160a01b03861660408401528281036060840152610b278186610a9a565b90508281036080840152610b3b8185610a9a565b98975050505050505050565b6020815260006109036020830184610a9a565b63ffffffff8516815283602082015260018060a01b0383166040820152608060608201526000610b8d6080830184610a9a565b9695505050505050565b600181811c90821680610bab57607f821691505b60208210811415610bcc57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082821015610c1057610c10610be8565b500390565b634e487b7160e01b600052603160045260246000fd5b6000600019821415610c3f57610c3f610be8565b506001019056fea2646970667358221220f8f5d7d4b81839efb835033ef37514ab950e32c6651da996ee908af7daa8825f64736f6c63430008090033";

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
    _owner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _projects,
      _projectId,
      _owner,
      overrides || {}
    );
  }
  override deploy(
    _projects: AddressLike,
    _projectId: BytesLike,
    _owner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _projects,
      _projectId,
      _owner,
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
