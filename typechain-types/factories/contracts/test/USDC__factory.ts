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
import type { NonPayableOverrides } from "../../../common";
import type { USDC, USDCInterface } from "../../../contracts/test/USDC";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
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
    inputs: [],
    name: "EIP712DomainChanged",
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
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101606040523480156200001257600080fd5b50604051620018e7380380620018e78339810160408190526200003591620003e9565b604051806040016040528060098152602001682aa9a2219021b7b4b760b91b81525080604051806040016040528060018152602001603160f81b815250604051806040016040528060098152602001682aa9a2219021b7b4b760b91b815250604051806040016040528060048152602001635553444360e01b8152508160039080519060200190620000c992919062000343565b508051620000df90600490602084019062000343565b505050620000fd600583620001e260201b620006331790919060201c565b610120526200011a816006620001e2602090811b6200063317901c565b61014052815160208084019190912060e052815190820120610100524660a052620001a860e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c05250620001db81620001c56012600a6200052e565b620001d590633b9aca006200053f565b62000236565b5062000633565b60006020835110156200020257620001fa83620002fd565b905062000230565b8262000219836200034060201b6200066a1760201c565b81516200022a926020019062000343565b5060ff90505b92915050565b6001600160a01b038216620002925760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b8060026000828254620002a6919062000561565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600080829050601f815111156200032b578260405163305a27a960e01b81526004016200028991906200057c565b80516200033882620005d4565b179392505050565b90565b8280546200035190620005fc565b90600052602060002090601f016020900481019282620003755760008555620003c0565b82601f106200039057805160ff1916838001178555620003c0565b82800160010185558215620003c0579182015b82811115620003c0578251825591602001919060010190620003a3565b50620003ce929150620003d2565b5090565b5b80821115620003ce5760008155600101620003d3565b600060208284031215620003fc57600080fd5b81516001600160a01b03811681146200041457600080fd5b9392505050565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115620004725781600019048211156200045657620004566200041b565b808516156200046457918102915b93841c939080029062000436565b509250929050565b6000826200048b5750600162000230565b816200049a5750600062000230565b8160018114620004b35760028114620004be57620004de565b600191505062000230565b60ff841115620004d257620004d26200041b565b50506001821b62000230565b5060208310610133831016604e8410600b841016171562000503575081810a62000230565b6200050f838362000431565b80600019048211156200052657620005266200041b565b029392505050565b60006200041460ff8416836200047a565b60008160001904831182151516156200055c576200055c6200041b565b500290565b600082198211156200057757620005776200041b565b500190565b600060208083528351808285015260005b81811015620005ab578581018301518582016040015282016200058d565b81811115620005be576000604083870101525b50601f01601f1916929092016040019392505050565b80516020808301519190811015620005f6576000198160200360031b1b821691505b50919050565b600181811c908216806200061157607f821691505b60208210811415620005f657634e487b7160e01b600052602260045260246000fd5b60805160a05160c05160e0516101005161012051610140516112596200068e60003960006103b70152600061038c01526000610a8901526000610a61015260006109bc015260006109e601526000610a1001526112596000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806370a0823111610097578063a457c2d711610066578063a457c2d714610211578063a9059cbb14610224578063d505accf14610237578063dd62ed3e1461024c57600080fd5b806370a08231146101b25780637ecebe00146101db57806384b0196e146101ee57806395d89b411461020957600080fd5b8063313ce567116100d3578063313ce5671461016b5780633644e5151461017a578063395093511461018257806354fd4d501461019557600080fd5b806306fdde0314610105578063095ea7b31461012357806318160ddd1461014657806323b872dd14610158575b600080fd5b61010d61025f565b60405161011a9190610f9b565b60405180910390f35b610136610131366004610fd1565b6102f1565b604051901515815260200161011a565b6002545b60405190815260200161011a565b610136610166366004610ffb565b61030b565b6040516012815260200161011a565b61014a61032f565b610136610190366004610fd1565b61033e565b6040805180820190915260018152603160f81b602082015261010d565b61014a6101c0366004611037565b6001600160a01b031660009081526020819052604090205490565b61014a6101e9366004611037565b610360565b6101f661037e565b60405161011a9796959493929190611052565b61010d610407565b61013661021f366004610fd1565b610416565b610136610232366004610fd1565b610496565b61024a6102453660046110e8565b6104a4565b005b61014a61025a36600461115b565b610608565b60606003805461026e9061118e565b80601f016020809104026020016040519081016040528092919081815260200182805461029a9061118e565b80156102e75780601f106102bc576101008083540402835291602001916102e7565b820191906000526020600020905b8154815290600101906020018083116102ca57829003601f168201915b5050505050905090565b6000336102ff81858561066d565b60019150505b92915050565b600033610319858285610791565b61032485858561080b565b506001949350505050565b60006103396109af565b905090565b6000336102ff8185856103518383610608565b61035b91906111c3565b61066d565b6001600160a01b038116600090815260076020526040812054610305565b6000606080828080836103b27f00000000000000000000000000000000000000000000000000000000000000006005610ada565b6103dd7f00000000000000000000000000000000000000000000000000000000000000006006610ada565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b60606004805461026e9061118e565b600033816104248286610608565b9050838110156104895760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b610324828686840361066d565b6000336102ff81858561080b565b834211156104f45760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e650000006044820152606401610480565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886105238c610b7e565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061057e82610ba6565b9050600061058e82878787610bd3565b9050896001600160a01b0316816001600160a01b0316146105f15760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e617475726500006044820152606401610480565b6105fc8a8a8a61066d565b50505050505050505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b600060208351101561064f5761064883610bfb565b9050610305565b828281516106609260200190610eb5565b5060ff9050610305565b90565b6001600160a01b0383166106cf5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610480565b6001600160a01b0382166107305760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610480565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061079d8484610608565b9050600019811461080557818110156107f85760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610480565b610805848484840361066d565b50505050565b6001600160a01b03831661086f5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610480565b6001600160a01b0382166108d15760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610480565b6001600160a01b038316600090815260208190526040902054818110156109495760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610480565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610805565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610a0857507f000000000000000000000000000000000000000000000000000000000000000046145b15610a3257507f000000000000000000000000000000000000000000000000000000000000000090565b610339604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b606060ff8314610aed5761064883610c39565b818054610af99061118e565b80601f0160208091040260200160405190810160405280929190818152602001828054610b259061118e565b8015610b725780601f10610b4757610100808354040283529160200191610b72565b820191906000526020600020905b815481529060010190602001808311610b5557829003601f168201915b50505050509050610305565b6001600160a01b03811660009081526007602052604090208054600181018255905b50919050565b6000610305610bb36109af565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000610be487878787610c78565b91509150610bf181610d3c565b5095945050505050565b600080829050601f81511115610c26578260405163305a27a960e01b81526004016104809190610f9b565b8051610c31826111e9565b179392505050565b60606000610c4683610e8d565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115610caf5750600090506003610d33565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610d03573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610d2c57600060019250925050610d33565b9150600090505b94509492505050565b6000816004811115610d5057610d5061120d565b1415610d595750565b6001816004811115610d6d57610d6d61120d565b1415610dbb5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610480565b6002816004811115610dcf57610dcf61120d565b1415610e1d5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610480565b6003816004811115610e3157610e3161120d565b1415610e8a5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610480565b50565b600060ff8216601f81111561030557604051632cd44ac360e21b815260040160405180910390fd5b828054610ec19061118e565b90600052602060002090601f016020900481019282610ee35760008555610f29565b82601f10610efc57805160ff1916838001178555610f29565b82800160010185558215610f29579182015b82811115610f29578251825591602001919060010190610f0e565b50610f35929150610f39565b5090565b5b80821115610f355760008155600101610f3a565b6000815180845260005b81811015610f7457602081850181015186830182015201610f58565b81811115610f86576000602083870101525b50601f01601f19169290920160200192915050565b602081526000610fae6020830184610f4e565b9392505050565b80356001600160a01b0381168114610fcc57600080fd5b919050565b60008060408385031215610fe457600080fd5b610fed83610fb5565b946020939093013593505050565b60008060006060848603121561101057600080fd5b61101984610fb5565b925061102760208501610fb5565b9150604084013590509250925092565b60006020828403121561104957600080fd5b610fae82610fb5565b60ff60f81b881681526000602060e08184015261107260e084018a610f4e565b8381036040850152611084818a610f4e565b606085018990526001600160a01b038816608086015260a0850187905284810360c0860152855180825283870192509083019060005b818110156110d6578351835292840192918401916001016110ba565b50909c9b505050505050505050505050565b600080600080600080600060e0888a03121561110357600080fd5b61110c88610fb5565b965061111a60208901610fb5565b95506040880135945060608801359350608088013560ff8116811461113e57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561116e57600080fd5b61117783610fb5565b915061118560208401610fb5565b90509250929050565b600181811c908216806111a257607f821691505b60208210811415610ba057634e487b7160e01b600052602260045260246000fd5b600082198211156111e457634e487b7160e01b600052601160045260246000fd5b500190565b80516020808301519190811015610ba05760001960209190910360031b1b16919050565b634e487b7160e01b600052602160045260246000fdfea2646970667358221220ce6353f004b981a6615880e7d1886c4268ef8a495ea042279c83e5f2e13008f064736f6c63430008090033";

type USDCConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: USDCConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class USDC__factory extends ContractFactory {
  constructor(...args: USDCConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    owner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(owner, overrides || {});
  }
  override deploy(
    owner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(owner, overrides || {}) as Promise<
      USDC & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): USDC__factory {
    return super.connect(runner) as USDC__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): USDCInterface {
    return new Interface(_abi) as USDCInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): USDC {
    return new Contract(address, _abi, runner) as unknown as USDC;
  }
}
