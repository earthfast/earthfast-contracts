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
  EarthfastBilling,
  EarthfastBillingInterface,
} from "../../contracts/EarthfastBilling";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
        indexed: true,
        internalType: "bytes32",
        name: "operatorId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "ReservationCanceled",
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
        indexed: true,
        internalType: "bytes32",
        name: "operatorId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "uptime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "epochStart",
        type: "uint256",
      },
    ],
    name: "ReservationResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
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
    name: "getBillingNodeIndex",
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
    name: "getRegistry",
    outputs: [
      {
        internalType: "contract EarthfastRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRenewalNodeIndex",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
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
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "admins",
        type: "address[]",
      },
      {
        internalType: "contract EarthfastRegistry",
        name: "registry",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "uptimeBips",
        type: "uint256[]",
      },
    ],
    name: "processBilling",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
      },
    ],
    name: "processRenewal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
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
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "setBillingNodeIndexImpl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "setRenewalNodeIndexImpl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract EarthfastRegistry",
        name: "registry",
        type: "address",
      },
    ],
    name: "unsafeSetRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5060805161318861004c60003960008181610dab01528181610deb015281816111070152818161114701526111d601526131886000f3fe6080604052600436106101355760003560e01c80635c975abb116100ab5780639795032e1161006f5780639795032e14610338578063a217fddf1461034e578063a923bf5314610363578063aabc898814610383578063b9a2adf0146103a3578063d547741f146103c357600080fd5b80635c975abb146102b557806368a539c1146102cd5780638456cb59146102ed57806391d148541461030257806395f3a5b11461032257600080fd5b80633659cfe6116100fd5780633659cfe61461020f5780633f4ba83a1461022f578063462d0b2e146102445780634f1ef2861461026457806352d1902d146102775780635ab1bd531461028c57600080fd5b806301ffc9a71461013a5780630ecc6a0c1461016f578063248a9ca3146101915780632f2ff15d146101cf57806336568abe146101ef575b600080fd5b34801561014657600080fd5b5061015a610155366004612686565b6103e3565b60405190151581526020015b60405180910390f35b34801561017b57600080fd5b5061018f61018a3660046127cf565b61041a565b005b34801561019d57600080fd5b506101c16101ac366004612889565b60009081526065602052604090206001015490565b604051908152602001610166565b3480156101db57600080fd5b5061018f6101ea3660046128b7565b610cf8565b3480156101fb57600080fd5b5061018f61020a3660046128b7565b610d22565b34801561021b57600080fd5b5061018f61022a3660046128e7565b610da0565b34801561023b57600080fd5b5061018f610e80565b34801561025057600080fd5b5061018f61025f366004612904565b610eb1565b61018f6102723660046129b0565b6110fc565b34801561028357600080fd5b506101c16111c9565b34801561029857600080fd5b5061012d546040516001600160a01b039091168152602001610166565b3480156102c157600080fd5b5060975460ff1661015a565b3480156102d957600080fd5b5061018f6102e8366004612a3d565b61127c565b3480156102f957600080fd5b5061018f611c98565b34801561030e57600080fd5b5061015a61031d3660046128b7565b611cc7565b34801561032e57600080fd5b5061012f546101c1565b34801561034457600080fd5b5061012e546101c1565b34801561035a57600080fd5b506101c1600081565b34801561036f57600080fd5b5061018f61037e366004612889565b611cf2565b34801561038f57600080fd5b5061018f61039e366004612889565b611d3e565b3480156103af57600080fd5b5061018f6103be3660046128e7565b611d8a565b3480156103cf57600080fd5b5061018f6103de3660046128b7565b611dd4565b60006001600160e01b03198216637965db0b60e01b148061041457506301ffc9a760e01b6001600160e01b03198316145b92915050565b61012d60009054906101000a90046001600160a01b03166001600160a01b0316631abdbe936040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561046b57600080fd5b505af115801561047f573d6000803e3d6000fd5b5050505061048b611df9565b61012d546040805163714ac0d560e11b815290516000926001600160a01b03169163e29581aa916004808301926020929190829003018186803b1580156104d157600080fd5b505afa1580156104e5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105099190612a71565b9050600061012d60009054906101000a90046001600160a01b03166001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b15801561055c57600080fd5b505afa158015610570573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105949190612a71565b9050600061012d60009054906101000a90046001600160a01b03166001600160a01b03166327a099d86040518163ffffffff1660e01b815260040160206040518083038186803b1580156105e757600080fd5b505afa1580156105fb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061061f9190612a71565b905061012f5460001461066f5760405162461bcd60e51b815260206004820152601360248201527272656e6577616c20696e2070726f677265737360681b60448201526064015b60405180910390fd5b60405163da0549ab60e01b8152600060048201526001600160a01b0384169063da0549ab9060240160206040518083038186803b1580156106af57600080fd5b505afa1580156106c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e79190612a8e565b61012e541061072b5760405162461bcd60e51b815260206004820152601060248201526f189a5b1b1a5b99c8199a5b9a5cda195960821b6044820152606401610666565b61012d5460408051631e6a3abb60e31b815290516000926001600160a01b03169163f351d5d8916004808301926020929190829003018186803b15801561077157600080fd5b505afa158015610785573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107a99190612a8e565b905060005b8651811015610cef576000856001600160a01b03166379ca4a39600061012e60008154809291906107de90612abd565b909155506040516001600160e01b031960e085901b168152600481019290925260248201526001604482015260640160006040518083038186803b15801561082557600080fd5b505afa158015610839573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108619190810190612c85565b90506000866001600160a01b03166350c946fe8a858151811061088657610886612d35565b60200260200101516040518263ffffffff1660e01b81526004016108ac91815260200190565b60006040518083038186803b1580156108c457600080fd5b505afa1580156108d8573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526109009190810190612d4b565b90508160008151811061091557610915612d35565b6020026020010151600001518160000151146109645760405162461bcd60e51b815260206004820152600e60248201526d0dee4c8cae440dad2e6dac2e8c6d60931b6044820152606401610666565b61271088848151811061097957610979612d35565b602002602001015111156109c05760405162461bcd60e51b815260206004820152600e60248201526d696e76616c696420757074696d6560901b6044820152606401610666565b60c08101515115610cda5760c08101515160a0820151516127109060009082906109eb908290612d7f565b6109f59190612d9e565b6040516383945d4b60e01b81526004810185905260248101829052600060448201529091506001600160a01b038a16906383945d4b90606401600060405180830381600087803b158015610a4857600080fd5b505af1158015610a5c573d6000803e3d6000fd5b50505050886001600160a01b031663da481dd6848660a00151600060028110610a8757610a87612d35565b60200201516040516001600160e01b031960e085901b1681526004810192909252602482015260006044820152606401600060405180830381600087803b158015610ad157600080fd5b505af1158015610ae5573d6000803e3d6000fd5b5050505060208401516040516337fd039760e11b8152600481019190915260006024820152604481018290526001600160a01b03891690636ffa072e90606401600060405180830381600087803b158015610b3f57600080fd5b505af1158015610b53573d6000803e3d6000fd5b50505050602084810151855160a08701515160408051918252938101869052928301849052606083018a905285927f6c6380fc2dcb8fe733fd19f6225aca88380860aef89ad645785f164869f4da829060800160405180910390a460c0840151602001518314610cd65761012d60009054906101000a90046001600160a01b03166001600160a01b0316639c200b886040518163ffffffff1660e01b815260040160206040518083038186803b158015610c0c57600080fd5b505afa158015610c20573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c449190612a71565b8451604051634e5b145f60e11b81526004810186905260248101919091526001600160a01b039190911690639cb628be90604401602060405180830381600087803b158015610c9257600080fd5b505af1158015610ca6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cca9190612dc0565b610cd657610cd6612ddb565b5050505b50508080610ce790612abd565b9150506107ae565b50505050505050565b600082815260656020526040902060010154610d1381611e3f565b610d1d8383611e49565b505050565b6001600160a01b0381163314610d925760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610666565b610d9c8282611ecf565b5050565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610de95760405162461bcd60e51b815260040161066690612df1565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610e3260008051602061310c833981519152546001600160a01b031690565b6001600160a01b031614610e585760405162461bcd60e51b815260040161066690612e3d565b610e6181611f36565b60408051600080825260208201909252610e7d91839190611f5d565b50565b610e8b600033611cc7565b610ea75760405162461bcd60e51b815260040161066690612e89565b610eaf6120d7565b565b600054610100900460ff1615808015610ed15750600054600160ff909116105b80610eeb5750303b158015610eeb575060005460ff166001145b610f4e5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610666565b6000805460ff191660011790558015610f71576000805461ff0019166101001790555b610f79612129565b610f81612129565b610f89612129565b610f91612129565b610f99612150565b610fa1612129565b61012d80546001600160a01b0319166001600160a01b03841617905582610ff65760405162461bcd60e51b81526020600482015260096024820152686e6f2061646d696e7360b81b6044820152606401610666565b60005b838110156110af57600085858381811061101557611015612d35565b905060200201602081019061102a91906128e7565b6001600160a01b0316141561106e5760405162461bcd60e51b815260206004820152600a6024820152693d32b9379030b236b4b760b11b6044820152606401610666565b61109f600086868481811061108557611085612d35565b905060200201602081019061109a91906128e7565b611e49565b6110a881612abd565b9050610ff9565b5080156110f6576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156111455760405162461bcd60e51b815260040161066690612df1565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661118e60008051602061310c833981519152546001600160a01b031690565b6001600160a01b0316146111b45760405162461bcd60e51b815260040161066690612e3d565b6111bd82611f36565b610d9c82826001611f5d565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146112695760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610666565b5060008051602061310c83398151915290565b61012d60009054906101000a90046001600160a01b03166001600160a01b0316631abdbe936040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156112cd57600080fd5b505af11580156112e1573d6000803e3d6000fd5b505050506112ed611df9565b61012d546040805163714ac0d560e11b815290516000926001600160a01b03169163e29581aa916004808301926020929190829003018186803b15801561133357600080fd5b505afa158015611347573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061136b9190612a71565b9050600061012d60009054906101000a90046001600160a01b03166001600160a01b031663dcc601286040518163ffffffff1660e01b815260040160206040518083038186803b1580156113be57600080fd5b505afa1580156113d2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113f69190612a71565b60405163da0549ab60e01b8152600060048201529091506001600160a01b0383169063da0549ab9060240160206040518083038186803b15801561143957600080fd5b505afa15801561144d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114719190612a8e565b61012e54146114b85760405162461bcd60e51b815260206004820152601360248201527262696c6c696e6720696e2070726f677265737360681b6044820152606401610666565b60405163da0549ab60e01b8152600060048201526001600160a01b0383169063da0549ab9060240160206040518083038186803b1580156114f857600080fd5b505afa15801561150c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115309190612a8e565b61012f54106115745760405162461bcd60e51b815260206004820152601060248201526f1c995b995dd85b08199a5b9a5cda195960821b6044820152606401610666565b61012d5460408051632368d72960e01b815290516000926001600160a01b031691632368d729916004808301926020929190829003018186803b1580156115ba57600080fd5b505afa1580156115ce573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115f29190612a8e565b61012d60009054906101000a90046001600160a01b03166001600160a01b031663cec4191f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561164157600080fd5b505afa158015611655573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116799190612a8e565b1415905060005b8451811015611c9157836001600160a01b031663fea4a6758683815181106116aa576116aa612d35565b60200260200101516040518263ffffffff1660e01b81526004016116d091815260200190565b600060405180830381600087803b1580156116ea57600080fd5b505af11580156116fe573d6000803e3d6000fd5b505050506000846001600160a01b03166379ca4a39600061012f600081548092919061172990612abd565b909155506040516001600160e01b031960e085901b168152600481019290925260248201526001604482015260640160006040518083038186803b15801561177057600080fd5b505afa158015611784573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526117ac9190810190612c85565b90506000856001600160a01b03166350c946fe8885815181106117d1576117d1612d35565b60200260200101516040518263ffffffff1660e01b81526004016117f791815260200190565b60006040518083038186803b15801561180f57600080fd5b505afa158015611823573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261184b9190810190612d4b565b90508160008151811061186057611860612d35565b6020026020010151600001518160000151146118af5760405162461bcd60e51b815260206004820152600e60248201526d0dee4c8cae440dad2e6dac2e8c6d60931b6044820152606401610666565b60c08101516020015115611c7c5760c081015160209081015160a0830151909101518515611a6a5761012d60009054906101000a90046001600160a01b03166001600160a01b031663cec4191f6040518163ffffffff1660e01b815260040160206040518083038186803b15801561192657600080fd5b505afa15801561193a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061195e9190612a8e565b6119689082612d9e565b905061012d60009054906101000a90046001600160a01b03166001600160a01b0316632368d7296040518163ffffffff1660e01b815260040160206040518083038186803b1580156119b957600080fd5b505afa1580156119cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119f19190612a8e565b6119fb9082612d7f565b8351604051631f9fb2bb60e01b8152600481019190915260016024820152604481018290529091506001600160a01b03891690631f9fb2bb90606401600060405180830381600087803b158015611a5157600080fd5b505af1158015611a65573d6000803e3d6000fd5b505050505b604051636d240eeb60e11b81526004810183905260006024820152604481018290526001600160a01b0388169063da481dd690606401600060405180830381600087803b158015611aba57600080fd5b505af1158015611ace573d6000803e3d6000fd5b50506040516325afba4560e11b815260048101859052600092506001600160a01b038a169150634b5f748a9060240160006040518083038186803b158015611b1557600080fd5b505afa158015611b29573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611b519190810190612eb7565b90508060a0015181608001511015611c7857835160405163f2be8ee760e01b8152600481019190915260016024820152600060448201526001600160a01b038a169063f2be8ee790606401600060405180830381600087803b158015611bb657600080fd5b505af1158015611bca573d6000803e3d6000fd5b5050604051636d240eeb60e11b81526004810186905260248101859052600060448201526001600160a01b038b16925063da481dd69150606401600060405180830381600087803b158015611c1e57600080fd5b505af1158015611c32573d6000803e3d6000fd5b50505050602084810151855160a08701515160405190815286937fbec974307b6bc8e93c0055694376408616d539b953ffb635734c4a1ac39dbf15910160405180910390a45b5050505b50508080611c8990612abd565b915050611680565b5050505050565b611ca3600033611cc7565b611cbf5760405162461bcd60e51b815260040161066690612e89565b610eaf61217f565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b61012d546001600160a01b03163314611d385760405162461bcd60e51b81526020600482015260086024820152671b9bdd081a5b5c1b60c21b6044820152606401610666565b61012f55565b61012d546001600160a01b03163314611d845760405162461bcd60e51b81526020600482015260086024820152671b9bdd081a5b5c1b60c21b6044820152606401610666565b61012e55565b611d95600033611cc7565b611db15760405162461bcd60e51b815260040161066690612e89565b61012d80546001600160a01b0319166001600160a01b0392909216919091179055565b600082815260656020526040902060010154611def81611e3f565b610d1d8383611ecf565b60975460ff1615610eaf5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610666565b610e7d81336121bc565b611e538282611cc7565b610d9c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055611e8b3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b611ed98282611cc7565b15610d9c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b611f41600033611cc7565b610e7d5760405162461bcd60e51b815260040161066690612e89565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615611f9057610d1d83612215565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b815260040160206040518083038186803b158015611fc957600080fd5b505afa925050508015611ff9575060408051601f3d908101601f19168201909252611ff691810190612a8e565b60015b61205c5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610666565b60008051602061310c83398151915281146120cb5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610666565b50610d1d8383836122b1565b6120df6122d6565b6097805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600054610100900460ff16610eaf5760405162461bcd60e51b815260040161066690612fcd565b600054610100900460ff166121775760405162461bcd60e51b815260040161066690612fcd565b610eaf61231f565b612187611df9565b6097805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861210c3390565b6121c68282611cc7565b610d9c576121d381612352565b6121de836020612364565b6040516020016121ef929190613018565b60408051601f198184030181529082905262461bcd60e51b82526106669160040161308d565b6001600160a01b0381163b6122825760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610666565b60008051602061310c83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6122ba83612506565b6000825111806122c75750805b15610d1d576110f68383612546565b60975460ff16610eaf5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610666565b600054610100900460ff166123465760405162461bcd60e51b815260040161066690612fcd565b6097805460ff19169055565b60606104146001600160a01b03831660145b60606000612373836002612d7f565b61237e9060026130c0565b6001600160401b03811115612395576123956126b0565b6040519080825280601f01601f1916602001820160405280156123bf576020820181803683370190505b509050600360fc1b816000815181106123da576123da612d35565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061240957612409612d35565b60200101906001600160f81b031916908160001a905350600061242d846002612d7f565b6124389060016130c0565b90505b60018111156124b0576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061246c5761246c612d35565b1a60f81b82828151811061248257612482612d35565b60200101906001600160f81b031916908160001a90535060049490941c936124a9816130d8565b905061243b565b5083156124ff5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610666565b9392505050565b61250f81612215565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606124ff838360405180606001604052806027815260200161312c602791396060600080856001600160a01b03168560405161258391906130ef565b600060405180830381855af49150503d80600081146125be576040519150601f19603f3d011682016040523d82523d6000602084013e6125c3565b606091505b50915091506125d4868383876125de565b9695505050505050565b6060831561264a578251612643576001600160a01b0385163b6126435760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610666565b5081612654565b612654838361265c565b949350505050565b81511561266c5781518083602001fd5b8060405162461bcd60e51b8152600401610666919061308d565b60006020828403121561269857600080fd5b81356001600160e01b0319811681146124ff57600080fd5b634e487b7160e01b600052604160045260246000fd5b60405160e081016001600160401b03811182821017156126e8576126e86126b0565b60405290565b60405161012081016001600160401b03811182821017156126e8576126e86126b0565b604051601f8201601f191681016001600160401b0381118282101715612739576127396126b0565b604052919050565b60006001600160401b0382111561275a5761275a6126b0565b5060051b60200190565b600082601f83011261277557600080fd5b8135602061278a61278583612741565b612711565b82815260059290921b840181019181810190868411156127a957600080fd5b8286015b848110156127c457803583529183019183016127ad565b509695505050505050565b600080604083850312156127e257600080fd5b82356001600160401b03808211156127f957600080fd5b61280586838701612764565b935060209150818501358181111561281c57600080fd5b85019050601f8101861361282f57600080fd5b803561283d61278582612741565b81815260059190911b8201830190838101908883111561285c57600080fd5b928401925b8284101561287a57833582529284019290840190612861565b80955050505050509250929050565b60006020828403121561289b57600080fd5b5035919050565b6001600160a01b0381168114610e7d57600080fd5b600080604083850312156128ca57600080fd5b8235915060208301356128dc816128a2565b809150509250929050565b6000602082840312156128f957600080fd5b81356124ff816128a2565b60008060006040848603121561291957600080fd5b83356001600160401b038082111561293057600080fd5b818601915086601f83011261294457600080fd5b81358181111561295357600080fd5b8760208260051b850101111561296857600080fd5b6020928301955093505084013561297e816128a2565b809150509250925092565b60006001600160401b038211156129a2576129a26126b0565b50601f01601f191660200190565b600080604083850312156129c357600080fd5b82356129ce816128a2565b915060208301356001600160401b038111156129e957600080fd5b8301601f810185136129fa57600080fd5b8035612a0861278582612989565b818152866020838501011115612a1d57600080fd5b816020840160208301376000602083830101528093505050509250929050565b600060208284031215612a4f57600080fd5b81356001600160401b03811115612a6557600080fd5b61265484828501612764565b600060208284031215612a8357600080fd5b81516124ff816128a2565b600060208284031215612aa057600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b6000600019821415612ad157612ad1612aa7565b5060010190565b60005b83811015612af3578181015183820152602001612adb565b838111156110f65750506000910152565b600082601f830112612b1557600080fd5b8151612b2361278582612989565b818152846020838601011115612b3857600080fd5b612654826020830160208701612ad8565b80518015158114612b5957600080fd5b919050565b600082601f830112612b6f57600080fd5b604051604081018181106001600160401b0382111715612b9157612b916126b0565b8060405250806040840185811115612ba857600080fd5b845b81811015612bc2578051835260209283019201612baa565b509195945050505050565b60006101208284031215612be057600080fd5b612be86126c6565b9050815181526020820151602082015260408201516001600160401b0380821115612c1257600080fd5b612c1e85838601612b04565b60408401526060840151915080821115612c3757600080fd5b50612c4484828501612b04565b606083015250612c5660808301612b49565b6080820152612c688360a08401612b5e565b60a0820152612c7a8360e08401612b5e565b60c082015292915050565b60006020808385031215612c9857600080fd5b82516001600160401b0380821115612caf57600080fd5b818501915085601f830112612cc357600080fd5b8151612cd161278582612741565b81815260059190911b83018401908481019088831115612cf057600080fd5b8585015b83811015612d2857805185811115612d0c5760008081fd5b612d1a8b89838a0101612bcd565b845250918601918601612cf4565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b600060208284031215612d5d57600080fd5b81516001600160401b03811115612d7357600080fd5b61265484828501612bcd565b6000816000190483118215151615612d9957612d99612aa7565b500290565b600082612dbb57634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215612dd257600080fd5b6124ff82612b49565b634e487b7160e01b600052600160045260246000fd5b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252600990820152683737ba1030b236b4b760b91b604082015260600190565b8051612b59816128a2565b600060208284031215612ec957600080fd5b81516001600160401b0380821115612ee057600080fd5b908301906101208286031215612ef557600080fd5b612efd6126ee565b82518152612f0d60208401612eac565b6020820152604083015182811115612f2457600080fd5b612f3087828601612b04565b604083015250606083015182811115612f4857600080fd5b612f5487828601612b04565b6060830152506080830151608082015260a083015160a082015260c083015182811115612f8057600080fd5b612f8c87828601612b04565b60c08301525060e083015160e08201526101008084015183811115612fb057600080fd5b612fbc88828701612b04565b918301919091525095945050505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613050816017850160208801612ad8565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351613081816028840160208801612ad8565b01602801949350505050565b60208152600082518060208401526130ac816040850160208701612ad8565b601f01601f19169190910160400192915050565b600082198211156130d3576130d3612aa7565b500190565b6000816130e7576130e7612aa7565b506000190190565b60008251613101818460208701612ad8565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220c0897268d0ae75c6833fd7e59689c0c790d4be782d513971d6281ea6a8fbec6a64736f6c63430008090033";

type EarthfastBillingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EarthfastBillingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EarthfastBilling__factory extends ContractFactory {
  constructor(...args: EarthfastBillingConstructorParams) {
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
      EarthfastBilling & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EarthfastBilling__factory {
    return super.connect(runner) as EarthfastBilling__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EarthfastBillingInterface {
    return new Interface(_abi) as EarthfastBillingInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EarthfastBilling {
    return new Contract(address, _abi, runner) as unknown as EarthfastBilling;
  }
}
