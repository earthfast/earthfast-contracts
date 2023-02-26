/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  ArmadaNodesImpl,
  ArmadaNodesImplInterface,
} from "../../contracts/ArmadaNodesImpl";

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
        internalType: "struct ArmadaSlot",
        name: "slot",
        type: "tuple",
      },
    ],
    name: "NodePriceChanged",
    type: "event",
  },
];

const _bytecode =
  "0x6117d461003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80632d39312814610050578063c5914cfa14610072578063ebce996314610092575b600080fd5b81801561005c57600080fd5b5061007061006b366004611070565b6100b2565b005b81801561007e57600080fd5b5061007061008d36600461116f565b61046e565b81801561009e57600080fd5b506100706100ad366004611346565b610a0a565b80518251146100dc5760405162461bcd60e51b81526004016100d3906113f1565b60405180910390fd5b6000856001600160a01b031663e29581aa6040518163ffffffff1660e01b815260040160206040518083038186803b15801561011757600080fd5b505afa15801561012b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061014f919061141a565b90506000866001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b15801561018c57600080fd5b505afa1580156101a0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101c4919061141a565b90506000876001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b15801561020157600080fd5b505afa158015610215573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610239919061141a565b905060005b855181101561046357600088600088848151811061025e5761025e61143e565b60200260200101518152602001908152602001600020905080600001546000801b141561029d5760405162461bcd60e51b81526004016100d390611454565b878160010154146102c05760405162461bcd60e51b81526004016100d39061147a565b60008160040160019054906101000a900460ff1690508683815181106102e8576102e861143e565b60209081029190910101516004830180549115156101000261ff0019909216919091179055600882015480156103e9578b6001600160a01b0316638c1d0f416040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561035357600080fd5b505af1158015610367573d6000803e3d6000fd5b50506040805180820182526000815260016020820152865491516324b2e69b60e21b81529093506001600160a01b03891692506392cb9a6c916103b5918c918c9188919088906004016114a5565b600060405180830381600087803b1580156103cf57600080fd5b505af11580156103e3573d6000803e3d6000fd5b50505050505b82600001547fbd8bc64d24321dcae6059f4a6108793a3c9613c0964637b8f811de2d3b2affc2838a87815181106104225761042261143e565b602002602001015160405161044592919091151582521515602082015260400190565b60405180910390a2505050808061045b906114e6565b91505061023e565b505050505050505050565b815183511461048f5760405162461bcd60e51b81526004016100d3906113f1565b6000866001600160a01b031663e29581aa6040518163ffffffff1660e01b815260040160206040518083038186803b1580156104ca57600080fd5b505afa1580156104de573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610502919061141a565b90506000876001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b15801561053f57600080fd5b505afa158015610553573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610577919061141a565b90506000886001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b1580156105b457600080fd5b505afa1580156105c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105ec919061141a565b905060005b86518110156109fe5760008960008984815181106106115761061161143e565b60200260200101518152602001908152602001600020905080600001546000801b14156106505760405162461bcd60e51b81526004016100d390611454565b888160010154146106735760405162461bcd60e51b81526004016100d39061147a565b600481015460ff16156106b85760405162461bcd60e51b815260206004820152600d60248201526c746f706f6c6f6779206e6f646560981b60448201526064016100d3565b600581015460068201546106cf602089018961150f565b15610749576007830154156107165760405162461bcd60e51b815260206004820152600d60248201526c1b9bd919481c995cd95c9d9959609a1b60448201526064016100d3565b8884815181106107285761072861143e565b6020026020010151836005016000600281106107465761074661143e565b01555b6107596040890160208a0161150f565b1561098d578884815181106107705761077061143e565b60200260200101518360050160016002811061078e5761078e61143e565b01556008830154801561098b57866001600160a01b031663da481dd682848d89815181106107be576107be61143e565b60200260200101516040518463ffffffff1660e01b81526004016107f5939291909283526020830191909152604082015260600190565b600060405180830381600087803b15801561080f57600080fd5b505af1158015610823573d6000803e3d6000fd5b50506040516325afba4560e11b815260048101849052600092506001600160a01b038a169150634b5f748a9060240160006040518083038186803b15801561086a57600080fd5b505afa15801561087e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108a691908101906115b2565b90508060a0015181608001511015610989578e6001600160a01b0316638c1d0f416040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156108f357600080fd5b505af1158015610907573d6000803e3d6000fd5b50506040805180820182526000815260016020820152885491516324b2e69b60e21b81529093506001600160a01b038b1692506392cb9a6c91610955918e918e9189919088906004016114a5565b600060405180830381600087803b15801561096f57600080fd5b505af1158015610983573d6000803e3d6000fd5b50505050505b505b505b82600001547f055b91d27a22fa7278a8976495eb88088023f4b0f8862aa797c7ceeb61f2eba383838c88815181106109c7576109c761143e565b60200260200101518c6040516109e094939291906116a4565b60405180910390a250505080806109f6906114e6565b9150506105f1565b50505050505050505050565b8151835114610a2b5760405162461bcd60e51b81526004016100d3906113f1565b8051835114610a4c5760405162461bcd60e51b81526004016100d3906113f1565b60005b8351811015610ea1576000838281518110610a6c57610a6c61143e565b60200260200101515111610aaf5760405162461bcd60e51b815260206004820152600a602482015269195b5c1d1e481a1bdcdd60b21b60448201526064016100d3565b610100838281518110610ac457610ac461143e565b6020026020010151511115610b0b5760405162461bcd60e51b815260206004820152600d60248201526c686f737420746f6f206c6f6e6760981b60448201526064016100d3565b6000828281518110610b1f57610b1f61143e565b60200260200101515111610b645760405162461bcd60e51b815260206004820152600c60248201526b32b6b83a3c903932b3b4b7b760a11b60448201526064016100d3565b6002828281518110610b7857610b7861143e565b6020026020010151511115610bc15760405162461bcd60e51b815260206004820152600f60248201526e726567696f6e20746f6f206c6f6e6760881b60448201526064016100d3565b6000876000868481518110610bd857610bd861143e565b60200260200101518152602001908152602001600020905080600001546000801b1415610c175760405162461bcd60e51b81526004016100d390611454565b85816001015414610c3a5760405162461bcd60e51b81526004016100d39061147a565b8680610c5557506007810154158015610c5557506008810154155b610c915760405162461bcd60e51b815260206004820152600d60248201526c1b9bd919481c995cd95c9d9959609a1b60448201526064016100d3565b6000816002018054610ca2906116e5565b80601f0160208091040260200160405190810160405280929190818152602001828054610cce906116e5565b8015610d1b5780601f10610cf057610100808354040283529160200191610d1b565b820191906000526020600020905b815481529060010190602001808311610cfe57829003601f168201915b505050505090506000826003018054610d33906116e5565b80601f0160208091040260200160405190810160405280929190818152602001828054610d5f906116e5565b8015610dac5780601f10610d8157610100808354040283529160200191610dac565b820191906000526020600020905b815481529060010190602001808311610d8f57829003601f168201915b50505050509050858481518110610dc557610dc561143e565b6020026020010151836002019080519060200190610de4929190610eaa565b50848481518110610df757610df761143e565b6020026020010151836003019080519060200190610e16929190610eaa565b5082600001547ff939895421dc7faad365f1a6c3add39f1dbe41938423d98182e2df720718c8b28383898881518110610e5157610e5161143e565b6020026020010151898981518110610e6b57610e6b61143e565b6020026020010151604051610e839493929190611746565b60405180910390a25050508080610e99906114e6565b915050610a4f565b50505050505050565b828054610eb6906116e5565b90600052602060002090601f016020900481019282610ed85760008555610f1e565b82601f10610ef157805160ff1916838001178555610f1e565b82800160010185558215610f1e579182015b82811115610f1e578251825591602001919060010190610f03565b50610f2a929150610f2e565b5090565b5b80821115610f2a5760008155600101610f2f565b6001600160a01b0381168114610f5857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b604051610100810167ffffffffffffffff81118282101715610f9557610f95610f5b565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610fc457610fc4610f5b565b604052919050565b600067ffffffffffffffff821115610fe657610fe6610f5b565b5060051b60200190565b600082601f83011261100157600080fd5b8135602061101661101183610fcc565b610f9b565b82815260059290921b8401810191818101908684111561103557600080fd5b8286015b848110156110505780358352918301918301611039565b509695505050505050565b8035801515811461106b57600080fd5b919050565b600080600080600060a0868803121561108857600080fd5b853561109381610f43565b9450602086810135945060408701359350606087013567ffffffffffffffff808211156110bf57600080fd5b6110cb8a838b01610ff0565b945060808901359150808211156110e157600080fd5b508701601f810189136110f357600080fd5b803561110161101182610fcc565b81815260059190911b8201830190838101908b83111561112057600080fd5b928401925b82841015611145576111368461105b565b82529284019290840190611125565b80955050505050509295509295909350565b60006040828403121561116957600080fd5b50919050565b60008060008060008060e0878903121561118857600080fd5b863561119381610f43565b9550602087810135955060408801359450606088013567ffffffffffffffff808211156111bf57600080fd5b6111cb8b838c01610ff0565b955060808a01359150808211156111e157600080fd5b508801601f81018a136111f357600080fd5b803561120161101182610fcc565b81815260059190911b8201830190838101908c83111561122057600080fd5b928401925b8284101561123e57833582529284019290840190611225565b80965050505050506112538860a08901611157565b90509295509295509295565b600067ffffffffffffffff82111561127957611279610f5b565b50601f01601f191660200190565b600082601f83011261129857600080fd5b813560206112a861101183610fcc565b82815260059290921b840181019181810190868411156112c757600080fd5b8286015b8481101561105057803567ffffffffffffffff8111156112eb5760008081fd5b8701603f810189136112fd5760008081fd5b84810135604061130f6110118361125f565b8281528b828486010111156113245760008081fd5b82828501898301376000928101880192909252508452509183019183016112cb565b60008060008060008060c0878903121561135f57600080fd5b8635955061136f6020880161105b565b945060408701359350606087013567ffffffffffffffff8082111561139357600080fd5b61139f8a838b01610ff0565b945060808901359150808211156113b557600080fd5b6113c18a838b01611287565b935060a08901359150808211156113d757600080fd5b506113e489828a01611287565b9150509295509295509295565b6020808252600f908201526e0d8cadccee8d040dad2e6dac2e8c6d608b1b604082015260600190565b60006020828403121561142c57600080fd5b815161143781610f43565b9392505050565b634e487b7160e01b600052603260045260246000fd5b6020808252600c908201526b756e6b6e6f776e206e6f646560a01b604082015260600190565b6020808252601190820152700dee0cae4c2e8dee440dad2e6dac2e8c6d607b1b604082015260600190565b6001600160a01b039586168152939094166020808501919091526040840192909252606083015282511515608083015290910151151560a082015260c00190565b600060001982141561150857634e487b7160e01b600052601160045260246000fd5b5060010190565b60006020828403121561152157600080fd5b6114378261105b565b805161106b81610f43565b60005b83811015611550578181015183820152602001611538565b8381111561155f576000848401525b50505050565b600082601f83011261157657600080fd5b81516115846110118261125f565b81815284602083860101111561159957600080fd5b6115aa826020830160208701611535565b949350505050565b6000602082840312156115c457600080fd5b815167ffffffffffffffff808211156115dc57600080fd5b9083019061010082860312156115f157600080fd5b6115f9610f71565b825181526116096020840161152a565b602082015260408301518281111561162057600080fd5b61162c87828601611565565b60408301525060608301518281111561164457600080fd5b61165087828601611565565b6060830152506080830151608082015260a083015160a082015260c08301518281111561167c57600080fd5b61168887828601611565565b60c08301525060e083015160e082015280935050505092915050565b848152602081018490526040810183905260a081016116c28361105b565b151560608301526116d56020840161105b565b1515608083015295945050505050565b600181811c908216806116f957607f821691505b6020821081141561116957634e487b7160e01b600052602260045260246000fd5b60008151808452611732816020860160208601611535565b601f01601f19169290920160200192915050565b608081526000611759608083018761171a565b828103602084015261176b818761171a565b9050828103604084015261177f818661171a565b90508281036060840152611793818561171a565b97965050505050505056fea2646970667358221220792a924e1943b43db2bdea18df67519e11e34ca1c5ac97756cc8941e1c25ef5564736f6c63430008090033";

type ArmadaNodesImplConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ArmadaNodesImplConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ArmadaNodesImpl__factory extends ContractFactory {
  constructor(...args: ArmadaNodesImplConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ArmadaNodesImpl> {
    return super.deploy(overrides || {}) as Promise<ArmadaNodesImpl>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ArmadaNodesImpl {
    return super.attach(address) as ArmadaNodesImpl;
  }
  override connect(signer: Signer): ArmadaNodesImpl__factory {
    return super.connect(signer) as ArmadaNodesImpl__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ArmadaNodesImplInterface {
    return new utils.Interface(_abi) as ArmadaNodesImplInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ArmadaNodesImpl {
    return new Contract(address, _abi, signerOrProvider) as ArmadaNodesImpl;
  }
}
