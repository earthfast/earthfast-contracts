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
  "0x6117f961003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80632959fadb146100505780638b90c5b314610072578063a480e19b14610092575b600080fd5b81801561005c57600080fd5b5061007061006b36600461113f565b6100b2565b005b81801561007e57600080fd5b5061007061008d36600461121a565b61055b565b81801561009e57600080fd5b506100706100ad36600461130a565b610af7565b81518351146100dc5760405162461bcd60e51b81526004016100d3906113f1565b60405180910390fd5b80518351146100fd5760405162461bcd60e51b81526004016100d3906113f1565b60005b835181101561055257600083828151811061011d5761011d61141a565b602002602001015151116101605760405162461bcd60e51b815260206004820152600a602482015269195b5c1d1e481a1bdcdd60b21b60448201526064016100d3565b6101008382815181106101755761017561141a565b60200260200101515111156101bc5760405162461bcd60e51b815260206004820152600d60248201526c686f737420746f6f206c6f6e6760981b60448201526064016100d3565b60008282815181106101d0576101d061141a565b602002602001015151116102155760405162461bcd60e51b815260206004820152600c60248201526b32b6b83a3c903932b3b4b7b760a11b60448201526064016100d3565b60028282815181106102295761022961141a565b60200260200101515111156102725760405162461bcd60e51b815260206004820152600f60248201526e726567696f6e20746f6f206c6f6e6760881b60448201526064016100d3565b60008760008684815181106102895761028961141a565b60200260200101518152602001908152602001600020905080600001546000801b14156102c85760405162461bcd60e51b81526004016100d390611430565b858160010154146102eb5760405162461bcd60e51b81526004016100d390611456565b86806103065750600781015415801561030657506008810154155b6103425760405162461bcd60e51b815260206004820152600d60248201526c1b9bd919481c995cd95c9d9959609a1b60448201526064016100d3565b600081600201805461035390611481565b80601f016020809104026020016040519081016040528092919081815260200182805461037f90611481565b80156103cc5780601f106103a1576101008083540402835291602001916103cc565b820191906000526020600020905b8154815290600101906020018083116103af57829003601f168201915b5050505050905060008260030180546103e490611481565b80601f016020809104026020016040519081016040528092919081815260200182805461041090611481565b801561045d5780601f106104325761010080835404028352916020019161045d565b820191906000526020600020905b81548152906001019060200180831161044057829003601f168201915b505050505090508584815181106104765761047661141a565b6020026020010151836002019080519060200190610495929190610eaa565b508484815181106104a8576104a861141a565b60200260200101518360030190805190602001906104c7929190610eaa565b5082600001547ff939895421dc7faad365f1a6c3add39f1dbe41938423d98182e2df720718c8b283838988815181106105025761050261141a565b602002602001015189898151811061051c5761051c61141a565b60200260200101516040516105349493929190611512565b60405180910390a2505050808061054a9061156a565b915050610100565b50505050505050565b815183511461057c5760405162461bcd60e51b81526004016100d3906113f1565b6000866001600160a01b031663e29581aa6040518163ffffffff1660e01b815260040160206040518083038186803b1580156105b757600080fd5b505afa1580156105cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105ef9190611593565b90506000876001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b15801561062c57600080fd5b505afa158015610640573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106649190611593565b90506000886001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b1580156106a157600080fd5b505afa1580156106b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106d99190611593565b905060005b8651811015610aeb5760008960008984815181106106fe576106fe61141a565b60200260200101518152602001908152602001600020905080600001546000801b141561073d5760405162461bcd60e51b81526004016100d390611430565b888160010154146107605760405162461bcd60e51b81526004016100d390611456565b600481015460ff16156107a55760405162461bcd60e51b815260206004820152600d60248201526c746f706f6c6f6779206e6f646560981b60448201526064016100d3565b600581015460068201546107bc60208901896115b7565b15610836576007830154156108035760405162461bcd60e51b815260206004820152600d60248201526c1b9bd919481c995cd95c9d9959609a1b60448201526064016100d3565b8884815181106108155761081561141a565b6020026020010151836005016000600281106108335761083361141a565b01555b6108466040890160208a016115b7565b15610a7a5788848151811061085d5761085d61141a565b60200260200101518360050160016002811061087b5761087b61141a565b015560088301548015610a7857866001600160a01b031663da481dd682848d89815181106108ab576108ab61141a565b60200260200101516040518463ffffffff1660e01b81526004016108e2939291909283526020830191909152604082015260600190565b600060405180830381600087803b1580156108fc57600080fd5b505af1158015610910573d6000803e3d6000fd5b50506040516325afba4560e11b815260048101849052600092506001600160a01b038a169150634b5f748a9060240160006040518083038186803b15801561095757600080fd5b505afa15801561096b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610993919081019061162a565b90508060a0015181608001511015610a76578e6001600160a01b0316638c1d0f416040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156109e057600080fd5b505af11580156109f4573d6000803e3d6000fd5b50506040805180820182526000815260016020820152885491516324b2e69b60e21b81529093506001600160a01b038b1692506392cb9a6c91610a42918e918e918991908890600401611741565b600060405180830381600087803b158015610a5c57600080fd5b505af1158015610a70573d6000803e3d6000fd5b50505050505b505b505b82600001547f055b91d27a22fa7278a8976495eb88088023f4b0f8862aa797c7ceeb61f2eba383838c8881518110610ab457610ab461141a565b60200260200101518c604051610acd9493929190611782565b60405180910390a25050508080610ae39061156a565b9150506106de565b50505050505050505050565b8051825114610b185760405162461bcd60e51b81526004016100d3906113f1565b6000856001600160a01b031663e29581aa6040518163ffffffff1660e01b815260040160206040518083038186803b158015610b5357600080fd5b505afa158015610b67573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b8b9190611593565b90506000866001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b158015610bc857600080fd5b505afa158015610bdc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c009190611593565b90506000876001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b158015610c3d57600080fd5b505afa158015610c51573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c759190611593565b905060005b8551811015610e9f576000886000888481518110610c9a57610c9a61141a565b60200260200101518152602001908152602001600020905080600001546000801b1415610cd95760405162461bcd60e51b81526004016100d390611430565b87816001015414610cfc5760405162461bcd60e51b81526004016100d390611456565b60008160040160019054906101000a900460ff169050868381518110610d2457610d2461141a565b60209081029190910101516004830180549115156101000261ff001990921691909117905560088201548015610e25578b6001600160a01b0316638c1d0f416040518163ffffffff1660e01b8152600401600060405180830381600087803b158015610d8f57600080fd5b505af1158015610da3573d6000803e3d6000fd5b50506040805180820182526000815260016020820152865491516324b2e69b60e21b81529093506001600160a01b03891692506392cb9a6c91610df1918c918c918891908890600401611741565b600060405180830381600087803b158015610e0b57600080fd5b505af1158015610e1f573d6000803e3d6000fd5b50505050505b82600001547fbd8bc64d24321dcae6059f4a6108793a3c9613c0964637b8f811de2d3b2affc2838a8781518110610e5e57610e5e61141a565b6020026020010151604051610e8192919091151582521515602082015260400190565b60405180910390a25050508080610e979061156a565b915050610c7a565b505050505050505050565b828054610eb690611481565b90600052602060002090601f016020900481019282610ed85760008555610f1e565b82601f10610ef157805160ff1916838001178555610f1e565b82800160010185558215610f1e579182015b82811115610f1e578251825591602001919060010190610f03565b50610f2a929150610f2e565b5090565b5b80821115610f2a5760008155600101610f2f565b80358015158114610f5357600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b604051610120810167ffffffffffffffff81118282101715610f9257610f92610f58565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610fc157610fc1610f58565b604052919050565b600067ffffffffffffffff821115610fe357610fe3610f58565b5060051b60200190565b600082601f830112610ffe57600080fd5b8135602061101361100e83610fc9565b610f98565b82815260059290921b8401810191818101908684111561103257600080fd5b8286015b8481101561104d5780358352918301918301611036565b509695505050505050565b600067ffffffffffffffff82111561107257611072610f58565b50601f01601f191660200190565b600082601f83011261109157600080fd5b813560206110a161100e83610fc9565b82815260059290921b840181019181810190868411156110c057600080fd5b8286015b8481101561104d57803567ffffffffffffffff8111156110e45760008081fd5b8701603f810189136110f65760008081fd5b84810135604061110861100e83611058565b8281528b8284860101111561111d5760008081fd5b82828501898301376000928101880192909252508452509183019183016110c4565b60008060008060008060c0878903121561115857600080fd5b8635955061116860208801610f43565b945060408701359350606087013567ffffffffffffffff8082111561118c57600080fd5b6111988a838b01610fed565b945060808901359150808211156111ae57600080fd5b6111ba8a838b01611080565b935060a08901359150808211156111d057600080fd5b506111dd89828a01611080565b9150509295509295509295565b6001600160a01b03811681146111ff57600080fd5b50565b60006040828403121561121457600080fd5b50919050565b60008060008060008060e0878903121561123357600080fd5b863561123e816111ea565b9550602087810135955060408801359450606088013567ffffffffffffffff8082111561126a57600080fd5b6112768b838c01610fed565b955060808a013591508082111561128c57600080fd5b508801601f81018a1361129e57600080fd5b80356112ac61100e82610fc9565b81815260059190911b8201830190838101908c8311156112cb57600080fd5b928401925b828410156112e9578335825292840192908401906112d0565b80965050505050506112fe8860a08901611202565b90509295509295509295565b600080600080600060a0868803121561132257600080fd5b853561132d816111ea565b9450602086810135945060408701359350606087013567ffffffffffffffff8082111561135957600080fd5b6113658a838b01610fed565b9450608089013591508082111561137b57600080fd5b508701601f8101891361138d57600080fd5b803561139b61100e82610fc9565b81815260059190911b8201830190838101908b8311156113ba57600080fd5b928401925b828410156113df576113d084610f43565b825292840192908401906113bf565b80955050505050509295509295909350565b6020808252600f908201526e0d8cadccee8d040dad2e6dac2e8c6d608b1b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b6020808252600c908201526b756e6b6e6f776e206e6f646560a01b604082015260600190565b6020808252601190820152700dee0cae4c2e8dee440dad2e6dac2e8c6d607b1b604082015260600190565b600181811c9082168061149557607f821691505b6020821081141561121457634e487b7160e01b600052602260045260246000fd5b60005b838110156114d15781810151838201526020016114b9565b838111156114e0576000848401525b50505050565b600081518084526114fe8160208601602086016114b6565b601f01601f19169290920160200192915050565b60808152600061152560808301876114e6565b828103602084015261153781876114e6565b9050828103604084015261154b81866114e6565b9050828103606084015261155f81856114e6565b979650505050505050565b600060001982141561158c57634e487b7160e01b600052601160045260246000fd5b5060010190565b6000602082840312156115a557600080fd5b81516115b0816111ea565b9392505050565b6000602082840312156115c957600080fd5b6115b082610f43565b8051610f53816111ea565b600082601f8301126115ee57600080fd5b81516115fc61100e82611058565b81815284602083860101111561161157600080fd5b6116228260208301602087016114b6565b949350505050565b60006020828403121561163c57600080fd5b815167ffffffffffffffff8082111561165457600080fd5b90830190610120828603121561166957600080fd5b611671610f6e565b82518152611681602084016115d2565b602082015260408301518281111561169857600080fd5b6116a4878286016115dd565b6040830152506060830151828111156116bc57600080fd5b6116c8878286016115dd565b6060830152506080830151608082015260a083015160a082015260c0830151828111156116f457600080fd5b611700878286016115dd565b60c08301525060e083015160e0820152610100808401518381111561172457600080fd5b611730888287016115dd565b918301919091525095945050505050565b6001600160a01b039586168152939094166020808501919091526040840192909252606083015282511515608083015290910151151560a082015260c00190565b848152602081018490526040810183905260a081016117a083610f43565b151560608301526117b360208401610f43565b151560808301529594505050505056fea26469706673582212206edc768784b8332149d5adb703ef8b984e941834b7c18cb1115c3fcaff6a303b64736f6c63430008090033";

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
