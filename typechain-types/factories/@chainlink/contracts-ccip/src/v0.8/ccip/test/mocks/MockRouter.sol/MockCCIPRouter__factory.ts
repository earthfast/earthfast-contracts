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
import type { NonPayableOverrides } from "../../../../../../../../../common";
import type {
  MockCCIPRouter,
  MockCCIPRouterInterface,
} from "../../../../../../../../../@chainlink/contracts-ccip/src/v0.8/ccip/test/mocks/MockRouter.sol/MockCCIPRouter";

const _abi = [
  {
    inputs: [],
    name: "InsufficientFeeTokenAmount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedAddress",
        type: "bytes",
      },
    ],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidExtraArgsTag",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMsgValue",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOffRamp",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "err",
        type: "bytes",
      },
    ],
    name: "ReceiverError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destChainSelector",
        type: "uint64",
      },
    ],
    name: "UnsupportedDestinationChain",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "calldataHash",
        type: "bytes32",
      },
    ],
    name: "MessageExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "retData",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
    ],
    name: "MsgExecuted",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_GAS_LIMIT",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GAS_FOR_CALL_EXACT_CHECK",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "receiver",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            components: [
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
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          {
            internalType: "address",
            name: "feeToken",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "extraArgs",
            type: "bytes",
          },
        ],
        internalType: "struct Client.EVM2AnyMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "ccipSend",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "receiver",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            components: [
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
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          {
            internalType: "address",
            name: "feeToken",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "extraArgs",
            type: "bytes",
          },
        ],
        internalType: "struct Client.EVM2AnyMessage",
        name: "",
        type: "tuple",
      },
    ],
    name: "getFee",
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
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "getOnRamp",
    outputs: [
      {
        internalType: "address",
        name: "onRampAddress",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "getSupportedTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    name: "isChainSupported",
    outputs: [
      {
        internalType: "bool",
        name: "supported",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isOffRamp",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "messageId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "sender",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            components: [
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
            internalType: "struct Client.EVMTokenAmount[]",
            name: "destTokenAmounts",
            type: "tuple[]",
          },
        ],
        internalType: "struct Client.Any2EVMMessage",
        name: "message",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "gasForCallExactCheck",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "gasLimit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "routeMessage",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "retData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
    ],
    name: "setFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061166e806100206000396000f3fe6080604052600436106100915760003560e01c8063a48a905811610059578063a48a905814610160578063a8d87a3b14610181578063d6be695a146101bd578063ee18e0d3146101e9578063fbca3b741461021257600080fd5b806320487ded146100965780633cf97983146100c957806369fe0e2d146100f857806383826b2b1461011a57806396f4e9f91461014d575b600080fd5b3480156100a257600080fd5b506100b66100b1366004610ec4565b61024d565b6040519081526020015b60405180910390f35b3480156100d557600080fd5b506100e96100e4366004610f29565b610257565b6040516100c093929190610fe9565b34801561010457600080fd5b50610118610113366004611014565b600055565b005b34801561012657600080fd5b5061013d61013536600461102d565b600192915050565b60405190151581526020016100c0565b6100b661015b366004611060565b610281565b34801561016c57600080fd5b5061013d61017b3660046110a3565b50600190565b34801561018d57600080fd5b506101a561019c3660046110a3565b5063499602d290565b6040516001600160a01b0390911681526020016100c0565b3480156101c957600080fd5b506101d462030d4081565b60405163ffffffff90911681526020016100c0565b3480156101f557600080fd5b506101ff61138881565b60405161ffff90911681526020016100c0565b34801561021e57600080fd5b5061024061022d3660046110a3565b5060408051600081526020810190915290565b6040516100c091906110be565b6000545b92915050565b60006060816102706102688861110b565b8787876105a1565b9250925092505b9450945094915050565b600061028d82806111ab565b90506020146102c4576102a082806111ab565b60405163370d875f60e01b81526004016102bb929190611221565b60405180910390fd5b60006102d083806111ab565b8101906102dd9190611014565b90506001600160a01b038111806102f45750600a81105b15610303576102a083806111ab565b6000610312856100b186611235565b905060006103266080860160608701611241565b6001600160a01b03160361035a5780341015610355576040516303ed377360e11b815260040160405180910390fd5b6103a0565b341561037957604051631841b4e160e01b815260040160405180910390fd5b6103a033308361038f6080890160608a01611241565b6001600160a01b0316929190610719565b8160006103b86103b360808801886111ab565b610779565b6000015190506000866040516020016103d191906112f2565b60408051808303601f19018152828252805160209182012060a08401835280845267de41ba4fc9d91ad98285015282513381840152835180820384018152908401845292840192909252909250600091906060820190610433908b018b6111ab565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050509082525060200161047a60408b018b6113f1565b808060200260200160405190810160405280939291908181526020016000905b828210156104c6576104b76040830286013681900381019061143a565b8152602001906001019061049a565b5050505050815250905060005b6104e060408a018a6113f1565b905081101561055b5761054b33866104fb60408d018d6113f1565b8581811061050b5761050b611456565b905060400201602001358c806040019061052591906113f1565b8681811061053557610535611456565b61038f9260206040909202019081019150611241565b6105548161146c565b90506104d3565b5060008061056d8361138887896105a1565b50915091508161059257806040516302a35ba360e21b81526004016102bb9190611493565b50919998505050505050505050565b60006060600086606001515160001480156105ba575084155b806105cd57506001600160a01b0384163b155b806105ef57506105ed6001600160a01b0385166385572ffb60e01b610803565b155b1561060f5750506040805160208101909152600080825260019250610277565b60006385572ffb60e01b8860405160240161062a91906114a6565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152905061066c8186888a608461081f565b60405192965090945092507fa8b0355886b5b7a28bb97e4f0a24feb172618407402721c4012d8b7c6433102f906106a890869086908690610fe9565b60405180910390a187516020808a0151835184830120604080519485526001600160401b0390921692840192909252339083015260608201527f9b877de93ea9895756e337442c657f95a34fc68e7eb988bdfa693d5be83016b69060800160405180910390a1509450945094915050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b1790526107739085906108f9565b50505050565b60408051602081019091526000815260008290036107a85750604080516020810190915262030d408152610251565b6397a657c960e01b6107ba838561155f565b6001600160e01b031916146107e257604051632923fee760e11b815260040160405180910390fd5b6107ef826004818661158f565b8101906107fc91906115b9565b9392505050565b600061080e836109d0565b80156107fc57506107fc8383610a03565b6000606060008361ffff166001600160401b0381111561084157610841610c29565b6040519080825280601f01601f19166020018201604052801561086b576020820181803683370190505b509150863b6108855763030ed58f60e21b60005260046000fd5b5a8581101561089f57632be8ca8b60e21b60005260046000fd5b85900360408104810387106108bf576337c3be2960e01b60005260046000fd5b505a6000808a5160208c0160008c8cf193505a900390503d848111156108e25750835b808352806000602085013e50955095509592505050565b600061094e826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610a8d9092919063ffffffff16565b8051909150156109cb578080602001905181019061096c91906115fa565b6109cb5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016102bb565b505050565b60006109e3826301ffc9a760e01b610a03565b801561025157506109fc826001600160e01b0319610a03565b1592915050565b6040516001600160e01b031982166024820152600090819060440160408051601f19818403018152919052602080820180516001600160e01b03166301ffc9a760e01b178152825192935060009283928392909183918a617530fa92503d91506000519050828015610a76575060208210155b8015610a825750600081115b979650505050505050565b6060610a9c8484600085610aa4565b949350505050565b606082471015610b055760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016102bb565b600080866001600160a01b03168587604051610b21919061161c565b60006040518083038185875af1925050503d8060008114610b5e576040519150601f19603f3d011682016040523d82523d6000602084013e610b63565b606091505b5091509150610a828783838760608315610bde578251600003610bd7576001600160a01b0385163b610bd75760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102bb565b5081610a9c565b610a9c8383815115610bf35781518083602001fd5b8060405162461bcd60e51b81526004016102bb9190611493565b80356001600160401b0381168114610c2457600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60405160a081016001600160401b0381118282101715610c6157610c61610c29565b60405290565b604051601f8201601f191681016001600160401b0381118282101715610c8f57610c8f610c29565b604052919050565b600082601f830112610ca857600080fd5b81356001600160401b03811115610cc157610cc1610c29565b610cd4601f8201601f1916602001610c67565b818152846020838601011115610ce957600080fd5b816020850160208301376000918101602001919091529392505050565b80356001600160a01b0381168114610c2457600080fd5b600060408284031215610d2f57600080fd5b604051604081018181106001600160401b0382111715610d5157610d51610c29565b604052905080610d6083610d06565b8152602083013560208201525092915050565b600082601f830112610d8457600080fd5b813560206001600160401b03821115610d9f57610d9f610c29565b610dad818360051b01610c67565b82815260069290921b84018101918181019086841115610dcc57600080fd5b8286015b84811015610df057610de28882610d1d565b835291830191604001610dd0565b509695505050505050565b600060a08284031215610e0d57600080fd5b610e15610c3f565b905081356001600160401b0380821115610e2e57600080fd5b610e3a85838601610c97565b83526020840135915080821115610e5057600080fd5b610e5c85838601610c97565b60208401526040840135915080821115610e7557600080fd5b610e8185838601610d73565b6040840152610e9260608501610d06565b60608401526080840135915080821115610eab57600080fd5b50610eb884828501610c97565b60808301525092915050565b60008060408385031215610ed757600080fd5b610ee083610c0d565b915060208301356001600160401b03811115610efb57600080fd5b610f0785828601610dfb565b9150509250929050565b600060a08284031215610f2357600080fd5b50919050565b60008060008060808587031215610f3f57600080fd5b84356001600160401b03811115610f5557600080fd5b610f6187828801610f11565b945050602085013561ffff81168114610f7957600080fd5b925060408501359150610f8e60608601610d06565b905092959194509250565b60005b83811015610fb4578181015183820152602001610f9c565b50506000910152565b60008151808452610fd5816020860160208601610f99565b601f01601f19169290920160200192915050565b83151581526060602082015260006110046060830185610fbd565b9050826040830152949350505050565b60006020828403121561102657600080fd5b5035919050565b6000806040838503121561104057600080fd5b61104983610c0d565b915061105760208401610d06565b90509250929050565b6000806040838503121561107357600080fd5b61107c83610c0d565b915060208301356001600160401b0381111561109757600080fd5b610f0785828601610f11565b6000602082840312156110b557600080fd5b6107fc82610c0d565b6020808252825182820181905260009190848201906040850190845b818110156110ff5783516001600160a01b0316835292840192918401916001016110da565b50909695505050505050565b600060a0823603121561111d57600080fd5b611125610c3f565b8235815261113560208401610c0d565b602082015260408301356001600160401b038082111561115457600080fd5b61116036838701610c97565b6040840152606085013591508082111561117957600080fd5b61118536838701610c97565b6060840152608085013591508082111561119e57600080fd5b50610eb836828601610d73565b6000808335601e198436030181126111c257600080fd5b8301803591506001600160401b038211156111dc57600080fd5b6020019150368190038213156111f157600080fd5b9250929050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b602081526000610a9c6020830184866111f8565b60006102513683610dfb565b60006020828403121561125357600080fd5b6107fc82610d06565b6000808335601e1984360301811261127357600080fd5b83016020810192503590506001600160401b0381111561129257600080fd5b8036038213156111f157600080fd5b8183526000602080850194508260005b858110156112e7576001600160a01b036112ca83610d06565b1687528183013583880152604096870196909101906001016112b1565b509495945050505050565b602081526000611302838461125c565b60a0602085015261131760c0850182846111f8565b915050611327602085018561125c565b601f198086850301604087015261133f8483856111f8565b935060408701359250601e1987360301831261135a57600080fd5b6020928701928301923591506001600160401b0382111561137a57600080fd5b8160061b360383131561138c57600080fd5b808685030160608701526113a18483856112a1565b93506113af60608801610d06565b6001600160a01b038116608088015292506113cd608088018861125c565b93509150808685030160a0870152506113e78383836111f8565b9695505050505050565b6000808335601e1984360301811261140857600080fd5b8301803591506001600160401b0382111561142257600080fd5b6020019150600681901b36038213156111f157600080fd5b60006040828403121561144c57600080fd5b6107fc8383610d1d565b634e487b7160e01b600052603260045260246000fd5b60006001820161148c57634e487b7160e01b600052601160045260246000fd5b5060010190565b6020815260006107fc6020830184610fbd565b600060208083528351818401528084015160406001600160401b0382168186015280860151915060a060608601526114e160c0860183610fbd565b91506060860151601f19808785030160808801526114ff8483610fbd565b608089015188820390920160a089015281518082529186019450600092508501905b8083101561155357845180516001600160a01b0316835286015186830152938501936001929092019190830190611521565b50979650505050505050565b6001600160e01b031981358181169160048510156115875780818660040360031b1b83161692505b505092915050565b6000808585111561159f57600080fd5b838611156115ac57600080fd5b5050820193919092039150565b6000602082840312156115cb57600080fd5b604051602081018181106001600160401b03821117156115ed576115ed610c29565b6040529135825250919050565b60006020828403121561160c57600080fd5b815180151581146107fc57600080fd5b6000825161162e818460208701610f99565b919091019291505056fea26469706673582212204f12f5d2f79164d57c5c13703e92b5ca08b566e4660de2748dd8e4922ced0d5564736f6c63430008140033";

type MockCCIPRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockCCIPRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockCCIPRouter__factory extends ContractFactory {
  constructor(...args: MockCCIPRouterConstructorParams) {
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
      MockCCIPRouter & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockCCIPRouter__factory {
    return super.connect(runner) as MockCCIPRouter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockCCIPRouterInterface {
    return new Interface(_abi) as MockCCIPRouterInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MockCCIPRouter {
    return new Contract(address, _abi, runner) as unknown as MockCCIPRouter;
  }
}
