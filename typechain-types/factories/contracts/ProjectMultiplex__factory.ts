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
        internalType: "string",
        name: "chainId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "subProjectId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "string",
        name: "tokenAddress",
        type: "string",
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
        internalType: "string",
        name: "chainId",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenAddress",
        type: "string",
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
        internalType: "string",
        name: "chainId",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenAddress",
        type: "string",
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
        internalType: "string",
        name: "chainId",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenAddress",
        type: "string",
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
  "0x608060405234801561001057600080fd5b50604051610e93380380610e9383398101604081905261002f91610087565b6001600055600380546001600160a01b039485166001600160a01b031991821617909155600492909255600580549190931691161790556100c3565b80516001600160a01b038116811461008257600080fd5b919050565b60008060006060848603121561009c57600080fd5b6100a58461006b565b9250602084015191506100ba6040850161006b565b90509250925092565b610dc1806100d26000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063b93971be11610066578063b93971be14610105578063d3b2f02b1461011a578063d426552d1461012d578063da6e6a1914610142578063e58237e31461016657600080fd5b80633fafa1271461009857806341252ec9146100b45780638b79543c146100c75780638da5cb5b146100f2575b600080fd5b6100a160045481565b6040519081526020015b60405180910390f35b6100a16100c2366004610939565b610179565b6003546100da906001600160a01b031681565b6040516001600160a01b0390911681526020016100ab565b6005546100da906001600160a01b031681565b610118610113366004610939565b61019a565b005b6100a16101283660046109f5565b610264565b61013561029e565b6040516100ab9190610a7d565b610155610150366004610939565b6102f6565b6040516100ab959493929190610b1d565b6100a1610174366004610b8a565b6105cc565b6002818154811061018957600080fd5b600091825260209091200154905081565b6005546001600160a01b031633146102035760405162461bcd60e51b815260206004820152602160248201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6044820152603760f91b60648201526084015b60405180910390fd5b60008181526001602052604081209061021c8282610866565b61022a600183016000610866565b610238600283016000610866565b610246600383016000610866565b610254600483016000610866565b505061026160028261074f565b50565b600083600454848460405160200161027f9493929190610c5c565b6040516020818303038152906040528051906020012090509392505050565b606060028054806020026020016040519081016040528092919081815260200182805480156102ec57602002820191906000526020600020905b8154815260200190600101908083116102d8575b5050505050905090565b60016020526000908152604090208054819061031190610ca6565b80601f016020809104026020016040519081016040528092919081815260200182805461033d90610ca6565b801561038a5780601f1061035f5761010080835404028352916020019161038a565b820191906000526020600020905b81548152906001019060200180831161036d57829003601f168201915b50505050509080600101805461039f90610ca6565b80601f01602080910402602001604051908101604052809291908181526020018280546103cb90610ca6565b80156104185780601f106103ed57610100808354040283529160200191610418565b820191906000526020600020905b8154815290600101906020018083116103fb57829003601f168201915b50505050509080600201805461042d90610ca6565b80601f016020809104026020016040519081016040528092919081815260200182805461045990610ca6565b80156104a65780601f1061047b576101008083540402835291602001916104a6565b820191906000526020600020905b81548152906001019060200180831161048957829003601f168201915b5050505050908060030180546104bb90610ca6565b80601f01602080910402602001604051908101604052809291908181526020018280546104e790610ca6565b80156105345780601f1061050957610100808354040283529160200191610534565b820191906000526020600020905b81548152906001019060200180831161051757829003601f168201915b50505050509080600401805461054990610ca6565b80601f016020809104026020016040519081016040528092919081815260200182805461057590610ca6565b80156105c25780601f10610597576101008083540402835291602001916105c2565b820191906000526020600020905b8154815290600101906020018083116105a557829003601f168201915b5050505050905085565b60006105d661080c565b6105e1868585610264565b6040805160a0810182528881526020808201899052818301889052606082018790526080820186905260008481526001825292909220815180519495509193849391926106329284929101906108a0565b50602082810151805161064b92600185019201906108a0565b50604082015180516106679160028401916020909101906108a0565b50606082015180516106839160038401916020909101906108a0565b506080820151805161069f9160048401916020909101906108a0565b5050600280546001810182556000919091527f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace01839055506040516106e5908690610ce1565b604051809103902082886040516106fc9190610ce1565b60405180910390207f2e3ed4c9abb3b44d42f6d1de5cfbc5d1d52730ccc505ec858509a97a3b864786866040516107339190610cfd565b60405180910390a4506107466001600055565b95945050505050565b60005b8254811015610807578183828154811061076e5761076e610d17565b906000526020600020015414156107f5578254839061078f90600190610d43565b8154811061079f5761079f610d17565b90600052602060002001548382815481106107bc576107bc610d17565b9060005260206000200181905550828054806107da576107da610d5a565b60019003818190600052602060002001600090559055505050565b806107ff81610d70565b915050610752565b505050565b6002600054141561085f5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016101fa565b6002600055565b50805461087290610ca6565b6000825580601f10610882575050565b601f0160209004906000526020600020908101906102619190610924565b8280546108ac90610ca6565b90600052602060002090601f0160209004810192826108ce5760008555610914565b82601f106108e757805160ff1916838001178555610914565b82800160010185558215610914579182015b828111156109145782518255916020019190600101906108f9565b50610920929150610924565b5090565b5b808211156109205760008155600101610925565b60006020828403121561094b57600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261097957600080fd5b813567ffffffffffffffff8082111561099457610994610952565b604051601f8301601f19908116603f011681019082821181831017156109bc576109bc610952565b816040528381528660208588010111156109d557600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600060608486031215610a0a57600080fd5b833567ffffffffffffffff80821115610a2257600080fd5b610a2e87838801610968565b94506020860135915080821115610a4457600080fd5b610a5087838801610968565b93506040860135915080821115610a6657600080fd5b50610a7386828701610968565b9150509250925092565b6020808252825182820181905260009190848201906040850190845b81811015610ab557835183529284019291840191600101610a99565b50909695505050505050565b60005b83811015610adc578181015183820152602001610ac4565b83811115610aeb576000848401525b50505050565b60008151808452610b09816020860160208601610ac1565b601f01601f19169290920160200192915050565b60a081526000610b3060a0830188610af1565b8281036020840152610b428188610af1565b90508281036040840152610b568187610af1565b90508281036060840152610b6a8186610af1565b90508281036080840152610b7e8185610af1565b98975050505050505050565b600080600080600060a08688031215610ba257600080fd5b853567ffffffffffffffff80821115610bba57600080fd5b610bc689838a01610968565b96506020880135915080821115610bdc57600080fd5b610be889838a01610968565b95506040880135915080821115610bfe57600080fd5b610c0a89838a01610968565b94506060880135915080821115610c2057600080fd5b610c2c89838a01610968565b93506080880135915080821115610c4257600080fd5b50610c4f88828901610968565b9150509295509295909350565b608081526000610c6f6080830187610af1565b8560208401528281036040840152610c878186610af1565b90508281036060840152610c9b8185610af1565b979650505050505050565b600181811c90821680610cba57607f821691505b60208210811415610cdb57634e487b7160e01b600052602260045260246000fd5b50919050565b60008251610cf3818460208701610ac1565b9190910192915050565b602081526000610d106020830184610af1565b9392505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082821015610d5557610d55610d2d565b500390565b634e487b7160e01b600052603160045260246000fd5b6000600019821415610d8457610d84610d2d565b506001019056fea26469706673582212201b9d430fcd0a02736eeb18d9652d73bf1bf81e33710588de73dfd469d529da6764736f6c63430008090033";

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
