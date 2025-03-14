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
import type { NonPayableOverrides } from "../../common";
import type {
  EarthfastNodesImpl,
  EarthfastNodesImplInterface,
} from "../../contracts/EarthfastNodesImpl";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "oldDisabled",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "newDisabled",
        type: "bool",
      },
    ],
    name: "NodeDisabledChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "oldHost",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "oldRegion",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newHost",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newRegion",
        type: "string",
      },
    ],
    name: "NodeHostChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "nodeId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldLastPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldNextPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
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
        indexed: false,
        internalType: "struct EarthfastSlot",
        name: "slot",
        type: "tuple",
      },
    ],
    name: "NodePriceChanged",
    type: "event",
  },
] as const;

const _bytecode =
  "0x6117a461003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80632959fadb146100505780638b90c5b314610072578063a480e19b14610092575b600080fd5b81801561005c57600080fd5b5061007061006b3660046110ea565b6100b2565b005b81801561007e57600080fd5b5061007061008d3660046111c5565b61055b565b81801561009e57600080fd5b506100706100ad3660046112b5565b610ab2565b81518351146100dc5760405162461bcd60e51b81526004016100d39061139c565b60405180910390fd5b80518351146100fd5760405162461bcd60e51b81526004016100d39061139c565b60005b835181101561055257600083828151811061011d5761011d6113c5565b602002602001015151116101605760405162461bcd60e51b815260206004820152600a602482015269195b5c1d1e481a1bdcdd60b21b60448201526064016100d3565b610100838281518110610175576101756113c5565b60200260200101515111156101bc5760405162461bcd60e51b815260206004820152600d60248201526c686f737420746f6f206c6f6e6760981b60448201526064016100d3565b60008282815181106101d0576101d06113c5565b602002602001015151116102155760405162461bcd60e51b815260206004820152600c60248201526b32b6b83a3c903932b3b4b7b760a11b60448201526064016100d3565b6002828281518110610229576102296113c5565b60200260200101515111156102725760405162461bcd60e51b815260206004820152600f60248201526e726567696f6e20746f6f206c6f6e6760881b60448201526064016100d3565b6000876000868481518110610289576102896113c5565b60200260200101518152602001908152602001600020905080600001546000801b14156102c85760405162461bcd60e51b81526004016100d3906113db565b858160010154146102eb5760405162461bcd60e51b81526004016100d390611401565b86806103065750600781015415801561030657506008810154155b6103425760405162461bcd60e51b815260206004820152600d60248201526c1b9bd919481c995cd95c9d9959609a1b60448201526064016100d3565b60008160020180546103539061142c565b80601f016020809104026020016040519081016040528092919081815260200182805461037f9061142c565b80156103cc5780601f106103a1576101008083540402835291602001916103cc565b820191906000526020600020905b8154815290600101906020018083116103af57829003601f168201915b5050505050905060008260030180546103e49061142c565b80601f01602080910402602001604051908101604052809291908181526020018280546104109061142c565b801561045d5780601f106104325761010080835404028352916020019161045d565b820191906000526020600020905b81548152906001019060200180831161044057829003601f168201915b50505050509050858481518110610476576104766113c5565b6020026020010151836002019080519060200190610495929190610e55565b508484815181106104a8576104a86113c5565b60200260200101518360030190805190602001906104c7929190610e55565b5082600001547ff939895421dc7faad365f1a6c3add39f1dbe41938423d98182e2df720718c8b28383898881518110610502576105026113c5565b602002602001015189898151811061051c5761051c6113c5565b602002602001015160405161053494939291906114bd565b60405180910390a2505050808061054a90611515565b915050610100565b50505050505050565b815183511461057c5760405162461bcd60e51b81526004016100d39061139c565b6000866001600160a01b031663e29581aa6040518163ffffffff1660e01b815260040160206040518083038186803b1580156105b757600080fd5b505afa1580156105cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105ef919061153e565b90506000876001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b15801561062c57600080fd5b505afa158015610640573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610664919061153e565b90506000886001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b1580156106a157600080fd5b505afa1580156106b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106d9919061153e565b905060005b8651811015610aa65760008960008984815181106106fe576106fe6113c5565b60200260200101518152602001908152602001600020905080600001546000801b141561073d5760405162461bcd60e51b81526004016100d3906113db565b888160010154146107605760405162461bcd60e51b81526004016100d390611401565b600581015460068201546107776020890189611562565b156107f1576007830154156107be5760405162461bcd60e51b815260206004820152600d60248201526c1b9bd919481c995cd95c9d9959609a1b60448201526064016100d3565b8884815181106107d0576107d06113c5565b6020026020010151836005016000600281106107ee576107ee6113c5565b01555b6108016040890160208a01611562565b15610a3557888481518110610818576108186113c5565b602002602001015183600501600160028110610836576108366113c5565b015560088301548015610a3357866001600160a01b031663da481dd682848d8981518110610866576108666113c5565b60200260200101516040518463ffffffff1660e01b815260040161089d939291909283526020830191909152604082015260600190565b600060405180830381600087803b1580156108b757600080fd5b505af11580156108cb573d6000803e3d6000fd5b50506040516325afba4560e11b815260048101849052600092506001600160a01b038a169150634b5f748a9060240160006040518083038186803b15801561091257600080fd5b505afa158015610926573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261094e91908101906115d5565b90508060a0015181608001511015610a31578e6001600160a01b0316638c1d0f416040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561099b57600080fd5b505af11580156109af573d6000803e3d6000fd5b50506040805180820182526000815260016020820152885491516324b2e69b60e21b81529093506001600160a01b038b1692506392cb9a6c916109fd918e918e9189919088906004016116ec565b600060405180830381600087803b158015610a1757600080fd5b505af1158015610a2b573d6000803e3d6000fd5b50505050505b505b505b82600001547f055b91d27a22fa7278a8976495eb88088023f4b0f8862aa797c7ceeb61f2eba383838c8881518110610a6f57610a6f6113c5565b60200260200101518c604051610a88949392919061172d565b60405180910390a25050508080610a9e90611515565b9150506106de565b50505050505050505050565b8051825114610ad35760405162461bcd60e51b81526004016100d39061139c565b6000856001600160a01b031663e29581aa6040518163ffffffff1660e01b815260040160206040518083038186803b158015610b0e57600080fd5b505afa158015610b22573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b46919061153e565b90506000866001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b158015610b8357600080fd5b505afa158015610b97573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bbb919061153e565b90506000876001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b158015610bf857600080fd5b505afa158015610c0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c30919061153e565b905060005b8551811015610e4a576000886000888481518110610c5557610c556113c5565b60200260200101518152602001908152602001600020905080600001546000801b1415610c945760405162461bcd60e51b81526004016100d3906113db565b87816001015414610cb75760405162461bcd60e51b81526004016100d390611401565b6004810154865160ff90911690879084908110610cd657610cd66113c5565b602090810291909101015160048301805460ff191691151591909117905560088201548015610dd0578b6001600160a01b0316638c1d0f416040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610d3a57600080fd5b505af1158015610d4e573d6000803e3d6000fd5b50506040805180820182526000815260016020820152865491516324b2e69b60e21b81529093506001600160a01b03891692506392cb9a6c91610d9c918c918c9188919088906004016116ec565b600060405180830381600087803b158015610db657600080fd5b505af1158015610dca573d6000803e3d6000fd5b50505050505b82600001547fbd8bc64d24321dcae6059f4a6108793a3c9613c0964637b8f811de2d3b2affc2838a8781518110610e0957610e096113c5565b6020026020010151604051610e2c92919091151582521515602082015260400190565b60405180910390a25050508080610e4290611515565b915050610c35565b505050505050505050565b828054610e619061142c565b90600052602060002090601f016020900481019282610e835760008555610ec9565b82601f10610e9c57805160ff1916838001178555610ec9565b82800160010185558215610ec9579182015b82811115610ec9578251825591602001919060010190610eae565b50610ed5929150610ed9565b5090565b5b80821115610ed55760008155600101610eda565b80358015158114610efe57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b604051610120810167ffffffffffffffff81118282101715610f3d57610f3d610f03565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610f6c57610f6c610f03565b604052919050565b600067ffffffffffffffff821115610f8e57610f8e610f03565b5060051b60200190565b600082601f830112610fa957600080fd5b81356020610fbe610fb983610f74565b610f43565b82815260059290921b84018101918181019086841115610fdd57600080fd5b8286015b84811015610ff85780358352918301918301610fe1565b509695505050505050565b600067ffffffffffffffff82111561101d5761101d610f03565b50601f01601f191660200190565b600082601f83011261103c57600080fd5b8135602061104c610fb983610f74565b82815260059290921b8401810191818101908684111561106b57600080fd5b8286015b84811015610ff857803567ffffffffffffffff81111561108f5760008081fd5b8701603f810189136110a15760008081fd5b8481013560406110b3610fb983611003565b8281528b828486010111156110c85760008081fd5b828285018983013760009281018801929092525084525091830191830161106f565b60008060008060008060c0878903121561110357600080fd5b8635955061111360208801610eee565b945060408701359350606087013567ffffffffffffffff8082111561113757600080fd5b6111438a838b01610f98565b9450608089013591508082111561115957600080fd5b6111658a838b0161102b565b935060a089013591508082111561117b57600080fd5b5061118889828a0161102b565b9150509295509295509295565b6001600160a01b03811681146111aa57600080fd5b50565b6000604082840312156111bf57600080fd5b50919050565b60008060008060008060e087890312156111de57600080fd5b86356111e981611195565b9550602087810135955060408801359450606088013567ffffffffffffffff8082111561121557600080fd5b6112218b838c01610f98565b955060808a013591508082111561123757600080fd5b508801601f81018a1361124957600080fd5b8035611257610fb982610f74565b81815260059190911b8201830190838101908c83111561127657600080fd5b928401925b828410156112945783358252928401929084019061127b565b80965050505050506112a98860a089016111ad565b90509295509295509295565b600080600080600060a086880312156112cd57600080fd5b85356112d881611195565b9450602086810135945060408701359350606087013567ffffffffffffffff8082111561130457600080fd5b6113108a838b01610f98565b9450608089013591508082111561132657600080fd5b508701601f8101891361133857600080fd5b8035611346610fb982610f74565b81815260059190911b8201830190838101908b83111561136557600080fd5b928401925b8284101561138a5761137b84610eee565b8252928401929084019061136a565b80955050505050509295509295909350565b6020808252600f908201526e0d8cadccee8d040dad2e6dac2e8c6d608b1b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6020808252600c908201526b756e6b6e6f776e206e6f646560a01b604082015260600190565b6020808252601190820152700dee0cae4c2e8dee440dad2e6dac2e8c6d607b1b604082015260600190565b600181811c9082168061144057607f821691505b602082108114156111bf57634e487b7160e01b600052602260045260246000fd5b60005b8381101561147c578181015183820152602001611464565b8381111561148b576000848401525b50505050565b600081518084526114a9816020860160208601611461565b601f01601f19169290920160200192915050565b6080815260006114d06080830187611491565b82810360208401526114e28187611491565b905082810360408401526114f68186611491565b9050828103606084015261150a8185611491565b979650505050505050565b600060001982141561153757634e487b7160e01b600052601160045260246000fd5b5060010190565b60006020828403121561155057600080fd5b815161155b81611195565b9392505050565b60006020828403121561157457600080fd5b61155b82610eee565b8051610efe81611195565b600082601f83011261159957600080fd5b81516115a7610fb982611003565b8181528460208386010111156115bc57600080fd5b6115cd826020830160208701611461565b949350505050565b6000602082840312156115e757600080fd5b815167ffffffffffffffff808211156115ff57600080fd5b90830190610120828603121561161457600080fd5b61161c610f19565b8251815261162c6020840161157d565b602082015260408301518281111561164357600080fd5b61164f87828601611588565b60408301525060608301518281111561166757600080fd5b61167387828601611588565b6060830152506080830151608082015260a083015160a082015260c08301518281111561169f57600080fd5b6116ab87828601611588565b60c08301525060e083015160e082015261010080840151838111156116cf57600080fd5b6116db88828701611588565b918301919091525095945050505050565b6001600160a01b039586168152939094166020808501919091526040840192909252606083015282511515608083015290910151151560a082015260c00190565b848152602081018490526040810183905260a0810161174b83610eee565b1515606083015261175e60208401610eee565b151560808301529594505050505056fea2646970667358221220a492fe28f6b42f3a0479e179bd70066ddb6035ec6198f2b063285637b362424164736f6c63430008090033";

type EarthfastNodesImplConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EarthfastNodesImplConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EarthfastNodesImpl__factory extends ContractFactory {
  constructor(...args: EarthfastNodesImplConstructorParams) {
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
      EarthfastNodesImpl & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EarthfastNodesImpl__factory {
    return super.connect(runner) as EarthfastNodesImpl__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EarthfastNodesImplInterface {
    return new Interface(_abi) as EarthfastNodesImplInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EarthfastNodesImpl {
    return new Contract(address, _abi, runner) as unknown as EarthfastNodesImpl;
  }
}
