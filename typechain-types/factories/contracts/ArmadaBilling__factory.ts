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
  ArmadaBilling,
  ArmadaBillingInterface,
} from "../../contracts/ArmadaBilling";

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
    name: "RECONCILER_ROLE",
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
        internalType: "contract ArmadaRegistry",
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
        internalType: "contract ArmadaRegistry",
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
        internalType: "bytes32",
        name: "topologyNodeId",
        type: "bytes32",
      },
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
        internalType: "bytes32",
        name: "topologyNodeId",
        type: "bytes32",
      },
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
        internalType: "contract ArmadaRegistry",
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
  "0x60a06040523060805234801561001457600080fd5b506080516133f361004c60003960008181610f1c01528181610f5c01528181611276015281816112b6015261134501526133f36000f3fe6080604052600436106101405760003560e01c80635c975abb116100b6578063a37470001161006f578063a37470001461034e578063a923bf531461036e578063aabc89881461038e578063b9a2adf0146103ae578063d547741f146103ce578063ebec8d2d146103ee57600080fd5b80635c975abb146102c05780638456cb59146102d857806391d14854146102ed57806395f3a5b11461030d5780639795032e14610323578063a217fddf1461033957600080fd5b80633659cfe6116101085780633659cfe61461021a5780633f4ba83a1461023a578063462d0b2e1461024f5780634f1ef2861461026f57806352d1902d146102825780635ab1bd531461029757600080fd5b806301ffc9a714610145578063248a9ca31461017a5780632d16d988146101b85780632f2ff15d146101da57806336568abe146101fa575b600080fd5b34801561015157600080fd5b506101656101603660046128bb565b610410565b60405190151581526020015b60405180910390f35b34801561018657600080fd5b506101aa6101953660046128e5565b60009081526065602052604090206001015490565b604051908152602001610171565b3480156101c457600080fd5b506101d86101d3366004612a1e565b610447565b005b3480156101e657600080fd5b506101d86101f5366004612af5565b610e6a565b34801561020657600080fd5b506101d8610215366004612af5565b610e94565b34801561022657600080fd5b506101d8610235366004612b25565b610f12565b34801561024657600080fd5b506101d8610ff1565b34801561025b57600080fd5b506101d861026a366004612b42565b611022565b6101d861027d366004612bee565b61126c565b34801561028e57600080fd5b506101aa611338565b3480156102a357600080fd5b5061012d546040516001600160a01b039091168152602001610171565b3480156102cc57600080fd5b5060975460ff16610165565b3480156102e457600080fd5b506101d86113eb565b3480156102f957600080fd5b50610165610308366004612af5565b61141a565b34801561031957600080fd5b5061012f546101aa565b34801561032f57600080fd5b5061012e546101aa565b34801561034557600080fd5b506101aa600081565b34801561035a57600080fd5b506101d8610369366004612c7b565b611445565b34801561037a57600080fd5b506101d86103893660046128e5565b611f33565b34801561039a57600080fd5b506101d86103a93660046128e5565b611f7f565b3480156103ba57600080fd5b506101d86103c9366004612b25565b611fcb565b3480156103da57600080fd5b506101d86103e9366004612af5565b612015565b3480156103fa57600080fd5b506101aa60008051602061337783398151915281565b60006001600160e01b03198216637965db0b60e01b148061044157506301ffc9a760e01b6001600160e01b03198316145b92915050565b8260008190036104cf5761046a600080516020613377833981519152600061141a565b8061048857506104886000805160206133778339815191523361141a565b6104ca5760405162461bcd60e51b815260206004820152600e60248201526d3737ba103932b1b7b731b4b632b960911b60448201526064015b60405180910390fd5b6105aa565b61012d60009054906101000a90046001600160a01b03166001600160a01b03166327a099d86040518163ffffffff1660e01b8152600401602060405180830381865afa158015610523573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105479190612cc1565b60405163ef96e2cb60e01b8152600481018390523360248201526001600160a01b03919091169063ef96e2cb90604401600060405180830381600087803b15801561059157600080fd5b505af11580156105a5573d6000803e3d6000fd5b505050505b61012d60009054906101000a90046001600160a01b03166001600160a01b0316631abdbe936040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156105fb57600080fd5b505af115801561060f573d6000803e3d6000fd5b5050505061061b61203a565b61012d546040805163714ac0d560e11b815290516000926001600160a01b03169163e29581aa9160048083019260209291908290030181865afa158015610666573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061068a9190612cc1565b9050600061012d60009054906101000a90046001600160a01b03166001600160a01b031663dcc601286040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106e2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107069190612cc1565b9050600061012d60009054906101000a90046001600160a01b03166001600160a01b03166327a099d86040518163ffffffff1660e01b8152600401602060405180830381865afa15801561075e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107829190612cc1565b905061012f546000146107cd5760405162461bcd60e51b815260206004820152601360248201527272656e6577616c20696e2070726f677265737360681b60448201526064016104c1565b60405163f0a9e52760e01b815260006004820181905260248201526001600160a01b0384169063f0a9e52790604401602060405180830381865afa158015610819573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061083d9190612cde565b61012e54106108815760405162461bcd60e51b815260206004820152601060248201526f189a5b1b1a5b99c8199a5b9a5cda195960821b60448201526064016104c1565b61012d5460408051631e6a3abb60e31b815290516000926001600160a01b03169163f351d5d89160048083019260209291908290030181865afa1580156108cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f09190612cde565b9050600061090d600080516020613377833981519152600061141a565b905060005b8851811015610e5e576000866001600160a01b031663a6c7b2c960008061012e600081548092919061094390612d0d565b909155506040516001600160e01b031960e086901b16815260048101939093529015156024830152604482015260016064820152608401600060405180830381865afa158015610997573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526109bf9190810190612edd565b90506000876001600160a01b03166350c946fe8c85815181106109e4576109e4612f8d565b60200260200101516040518263ffffffff1660e01b8152600401610a0a91815260200190565b600060405180830381865afa158015610a27573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610a4f9190810190612fa3565b905081600081518110610a6457610a64612f8d565b602002602001015160000151816000015114610ab35760405162461bcd60e51b815260206004820152600e60248201526d0dee4c8cae440dad2e6dac2e8c6d60931b60448201526064016104c1565b6127108a8481518110610ac857610ac8612f8d565b60200260200101511115610b0f5760405162461bcd60e51b815260206004820152600e60248201526d696e76616c696420757074696d6560901b60448201526064016104c1565b60e08101515115610e495760e081015151600085610b46578b8581518110610b3957610b39612f8d565b6020026020010151610b4a565b6127105b90506000612710828560c00151600060028110610b6957610b69612f8d565b6020020151610b789190612fd7565b610b829190612fee565b6040516383945d4b60e01b81526004810185905260248101829052600060448201529091506001600160a01b038b16906383945d4b90606401600060405180830381600087803b158015610bd557600080fd5b505af1158015610be9573d6000803e3d6000fd5b50505050896001600160a01b031663da481dd6848660c00151600060028110610c1457610c14612f8d565b60200201516040516001600160e01b031960e085901b1681526004810192909252602482015260006044820152606401600060405180830381600087803b158015610c5e57600080fd5b505af1158015610c72573d6000803e3d6000fd5b5050505060208401516040516337fd039760e11b8152600481019190915260006024820152604481018290526001600160a01b038a1690636ffa072e90606401600060405180830381600087803b158015610ccc57600080fd5b505af1158015610ce0573d6000803e3d6000fd5b50505050602084810151855160c08701515160408051918252938101869052928301849052606083018b905285927f6c6380fc2dcb8fe733fd19f6225aca88380860aef89ad645785f164869f4da829060800160405180910390a460e0840151602001518314610e455761012d60009054906101000a90046001600160a01b03166001600160a01b0316639c200b886040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d9e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc29190612cc1565b8451604051634e5b145f60e11b81526004810186905260248101919091526001600160a01b039190911690639cb628be906044016020604051808303816000875af1158015610e15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e399190613010565b610e4557610e4561302b565b5050505b50508080610e5690612d0d565b915050610912565b50505050505050505050565b600082815260656020526040902060010154610e8581612080565b610e8f838361208a565b505050565b6001600160a01b0381163314610f045760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016104c1565b610f0e8282612110565b5050565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003610f5a5760405162461bcd60e51b81526004016104c190613041565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610fa3600080516020613357833981519152546001600160a01b031690565b6001600160a01b031614610fc95760405162461bcd60e51b81526004016104c19061308d565b610fd281612177565b60408051600080825260208201909252610fee9183919061219e565b50565b610ffc60003361141a565b6110185760405162461bcd60e51b81526004016104c1906130d9565b611020612309565b565b600054610100900460ff16158080156110425750600054600160ff909116105b8061105c5750303b15801561105c575060005460ff166001145b6110bf5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016104c1565b6000805460ff1916600117905580156110e2576000805461ff0019166101001790555b6110ea61235b565b6110f261235b565b6110fa61235b565b61110261235b565b61110a612382565b61111261235b565b61012d80546001600160a01b0319166001600160a01b038416179055826111675760405162461bcd60e51b81526020600482015260096024820152686e6f2061646d696e7360b81b60448201526064016104c1565b60005b8381101561121f57600085858381811061118657611186612f8d565b905060200201602081019061119b9190612b25565b6001600160a01b0316036111de5760405162461bcd60e51b815260206004820152600a6024820152693d32b9379030b236b4b760b11b60448201526064016104c1565b61120f60008686848181106111f5576111f5612f8d565b905060200201602081019061120a9190612b25565b61208a565b61121881612d0d565b905061116a565b508015611266576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036112b45760405162461bcd60e51b81526004016104c190613041565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166112fd600080516020613357833981519152546001600160a01b031690565b6001600160a01b0316146113235760405162461bcd60e51b81526004016104c19061308d565b61132c82612177565b610f0e8282600161219e565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146113d85760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c000000000000000060648201526084016104c1565b5060008051602061335783398151915290565b6113f660003361141a565b6114125760405162461bcd60e51b81526004016104c1906130d9565b6110206123b1565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b8160008190036114c857611468600080516020613377833981519152600061141a565b8061148657506114866000805160206133778339815191523361141a565b6114c35760405162461bcd60e51b815260206004820152600e60248201526d3737ba103932b1b7b731b4b632b960911b60448201526064016104c1565b6115a3565b61012d60009054906101000a90046001600160a01b03166001600160a01b03166327a099d86040518163ffffffff1660e01b8152600401602060405180830381865afa15801561151c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115409190612cc1565b60405163ef96e2cb60e01b8152600481018390523360248201526001600160a01b03919091169063ef96e2cb90604401600060405180830381600087803b15801561158a57600080fd5b505af115801561159e573d6000803e3d6000fd5b505050505b61012d60009054906101000a90046001600160a01b03166001600160a01b0316631abdbe936040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156115f457600080fd5b505af1158015611608573d6000803e3d6000fd5b5050505061161461203a565b61012d546040805163714ac0d560e11b815290516000926001600160a01b03169163e29581aa9160048083019260209291908290030181865afa15801561165f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116839190612cc1565b9050600061012d60009054906101000a90046001600160a01b03166001600160a01b031663dcc601286040518163ffffffff1660e01b8152600401602060405180830381865afa1580156116db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116ff9190612cc1565b60405163f0a9e52760e01b815260006004820181905260248201529091506001600160a01b0383169063f0a9e52790604401602060405180830381865afa15801561174e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117729190612cde565b61012e54146117b95760405162461bcd60e51b815260206004820152601360248201527262696c6c696e6720696e2070726f677265737360681b60448201526064016104c1565b60405163f0a9e52760e01b815260006004820181905260248201526001600160a01b0383169063f0a9e52790604401602060405180830381865afa158015611805573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118299190612cde565b61012f541061186d5760405162461bcd60e51b815260206004820152601060248201526f1c995b995dd85b08199a5b9a5cda195960821b60448201526064016104c1565b61012d5460408051632368d72960e01b815290516000926001600160a01b031691632368d7299160048083019260209291908290030181865afa1580156118b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118dc9190612cde565b61012d60009054906101000a90046001600160a01b03166001600160a01b031663cec4191f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611930573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119549190612cde565b1415905060005b8551811015611f2a57836001600160a01b031663fea4a67587838151811061198557611985612f8d565b60200260200101516040518263ffffffff1660e01b81526004016119ab91815260200190565b600060405180830381600087803b1580156119c557600080fd5b505af11580156119d9573d6000803e3d6000fd5b505050506000846001600160a01b031663a6c7b2c960008061012f6000815480929190611a0590612d0d565b909155506040516001600160e01b031960e086901b16815260048101939093529015156024830152604482015260016064820152608401600060405180830381865afa158015611a59573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611a819190810190612edd565b90506000856001600160a01b03166350c946fe898581518110611aa657611aa6612f8d565b60200260200101516040518263ffffffff1660e01b8152600401611acc91815260200190565b600060405180830381865afa158015611ae9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611b119190810190612fa3565b905081600081518110611b2657611b26612f8d565b602002602001015160000151816000015114611b755760405162461bcd60e51b815260206004820152600e60248201526d0dee4c8cae440dad2e6dac2e8c6d60931b60448201526064016104c1565b60e08101516020015115611f155760e081015160209081015160c0830151909101518515611d125761012d60009054906101000a90046001600160a01b03166001600160a01b031663cec4191f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611bf1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c159190612cde565b611c1f9082612fee565b905061012d60009054906101000a90046001600160a01b03166001600160a01b0316632368d7296040518163ffffffff1660e01b8152600401602060405180830381865afa158015611c75573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c999190612cde565b611ca39082612fd7565b8351604051631f9fb2bb60e01b8152600481019190915260016024820152604481018290529091506001600160a01b03891690631f9fb2bb90606401600060405180830381600087803b158015611cf957600080fd5b505af1158015611d0d573d6000803e3d6000fd5b505050505b604051636d240eeb60e11b81526004810183905260006024820152604481018290526001600160a01b0388169063da481dd690606401600060405180830381600087803b158015611d6257600080fd5b505af1158015611d76573d6000803e3d6000fd5b50506040516325afba4560e11b815260048101859052600092506001600160a01b038a169150634b5f748a90602401600060405180830381865afa158015611dc2573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611dea9190810190613107565b90508060a0015181608001511015611f1157835160405163f2be8ee760e01b8152600481019190915260016024820152600060448201526001600160a01b038a169063f2be8ee790606401600060405180830381600087803b158015611e4f57600080fd5b505af1158015611e63573d6000803e3d6000fd5b5050604051636d240eeb60e11b81526004810186905260248101859052600060448201526001600160a01b038b16925063da481dd69150606401600060405180830381600087803b158015611eb757600080fd5b505af1158015611ecb573d6000803e3d6000fd5b50505050602084810151855160c08701515160405190815286937fbec974307b6bc8e93c0055694376408616d539b953ffb635734c4a1ac39dbf15910160405180910390a45b5050505b50508080611f2290612d0d565b91505061195b565b50505050505050565b61012d546001600160a01b03163314611f795760405162461bcd60e51b81526020600482015260086024820152671b9bdd081a5b5c1b60c21b60448201526064016104c1565b61012f55565b61012d546001600160a01b03163314611fc55760405162461bcd60e51b81526020600482015260086024820152671b9bdd081a5b5c1b60c21b60448201526064016104c1565b61012e55565b611fd660003361141a565b611ff25760405162461bcd60e51b81526004016104c1906130d9565b61012d80546001600160a01b0319166001600160a01b0392909216919091179055565b60008281526065602052604090206001015461203081612080565b610e8f8383612110565b60975460ff16156110205760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016104c1565b610fee81336123ee565b612094828261141a565b610f0e5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556120cc3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b61211a828261141a565b15610f0e5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b61218260003361141a565b610fee5760405162461bcd60e51b81526004016104c1906130d9565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156121d157610e8f83612447565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa92505050801561222b575060408051601f3d908101601f1916820190925261222891810190612cde565b60015b61228e5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b60648201526084016104c1565b60008051602061335783398151915281146122fd5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b60648201526084016104c1565b50610e8f8383836124e3565b612311612508565b6097805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600054610100900460ff166110205760405162461bcd60e51b81526004016104c19061321d565b600054610100900460ff166123a95760405162461bcd60e51b81526004016104c19061321d565b611020612551565b6123b961203a565b6097805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861233e3390565b6123f8828261141a565b610f0e5761240581612584565b612410836020612596565b604051602001612421929190613268565b60408051601f198184030181529082905262461bcd60e51b82526104c1916004016132dd565b6001600160a01b0381163b6124b45760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016104c1565b60008051602061335783398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6124ec83612738565b6000825111806124f95750805b15610e8f576112668383612778565b60975460ff166110205760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016104c1565b600054610100900460ff166125785760405162461bcd60e51b81526004016104c19061321d565b6097805460ff19169055565b60606104416001600160a01b03831660145b606060006125a5836002612fd7565b6125b0906002613310565b6001600160401b038111156125c7576125c76128fe565b6040519080825280601f01601f1916602001820160405280156125f1576020820181803683370190505b509050600360fc1b8160008151811061260c5761260c612f8d565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061263b5761263b612f8d565b60200101906001600160f81b031916908160001a905350600061265f846002612fd7565b61266a906001613310565b90505b60018111156126e2576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061269e5761269e612f8d565b1a60f81b8282815181106126b4576126b4612f8d565b60200101906001600160f81b031916908160001a90535060049490941c936126db81613323565b905061266d565b5083156127315760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016104c1565b9392505050565b61274181612447565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606127318383604051806060016040528060278152602001613397602791396060600080856001600160a01b0316856040516127b5919061333a565b600060405180830381855af49150503d80600081146127f0576040519150601f19603f3d011682016040523d82523d6000602084013e6127f5565b606091505b509150915061280686838387612810565b9695505050505050565b6060831561287f578251600003612878576001600160a01b0385163b6128785760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016104c1565b5081612889565b6128898383612891565b949350505050565b8151156128a15781518083602001fd5b8060405162461bcd60e51b81526004016104c191906132dd565b6000602082840312156128cd57600080fd5b81356001600160e01b03198116811461273157600080fd5b6000602082840312156128f757600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b60405161010081016001600160401b0381118282101715612937576129376128fe565b60405290565b60405161012081016001600160401b0381118282101715612937576129376128fe565b604051601f8201601f191681016001600160401b0381118282101715612988576129886128fe565b604052919050565b60006001600160401b038211156129a9576129a96128fe565b5060051b60200190565b600082601f8301126129c457600080fd5b813560206129d96129d483612990565b612960565b82815260059290921b840181019181810190868411156129f857600080fd5b8286015b84811015612a1357803583529183019183016129fc565b509695505050505050565b600080600060608486031215612a3357600080fd5b833592506020808501356001600160401b0380821115612a5257600080fd5b612a5e888389016129b3565b94506040870135915080821115612a7457600080fd5b508501601f81018713612a8657600080fd5b8035612a946129d482612990565b81815260059190911b82018301908381019089831115612ab357600080fd5b928401925b82841015612ad157833582529284019290840190612ab8565b80955050505050509250925092565b6001600160a01b0381168114610fee57600080fd5b60008060408385031215612b0857600080fd5b823591506020830135612b1a81612ae0565b809150509250929050565b600060208284031215612b3757600080fd5b813561273181612ae0565b600080600060408486031215612b5757600080fd5b83356001600160401b0380821115612b6e57600080fd5b818601915086601f830112612b8257600080fd5b813581811115612b9157600080fd5b8760208260051b8501011115612ba657600080fd5b60209283019550935050840135612bbc81612ae0565b809150509250925092565b60006001600160401b03821115612be057612be06128fe565b50601f01601f191660200190565b60008060408385031215612c0157600080fd5b8235612c0c81612ae0565b915060208301356001600160401b03811115612c2757600080fd5b8301601f81018513612c3857600080fd5b8035612c466129d482612bc7565b818152866020838501011115612c5b57600080fd5b816020840160208301376000602083830101528093505050509250929050565b60008060408385031215612c8e57600080fd5b8235915060208301356001600160401b03811115612cab57600080fd5b612cb7858286016129b3565b9150509250929050565b600060208284031215612cd357600080fd5b815161273181612ae0565b600060208284031215612cf057600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b600060018201612d1f57612d1f612cf7565b5060010190565b60005b83811015612d41578181015183820152602001612d29565b50506000910152565b600082601f830112612d5b57600080fd5b8151612d696129d482612bc7565b818152846020838601011115612d7e57600080fd5b612889826020830160208701612d26565b80518015158114612d9f57600080fd5b919050565b600082601f830112612db557600080fd5b604051604081018181106001600160401b0382111715612dd757612dd76128fe565b8060405250806040840185811115612dee57600080fd5b845b81811015612e08578051835260209283019201612df0565b509195945050505050565b60006101408284031215612e2657600080fd5b612e2e612914565b9050815181526020820151602082015260408201516001600160401b0380821115612e5857600080fd5b612e6485838601612d4a565b60408401526060840151915080821115612e7d57600080fd5b50612e8a84828501612d4a565b606083015250612e9c60808301612d8f565b6080820152612ead60a08301612d8f565b60a0820152612ebf8360c08401612da4565b60c0820152612ed2836101008401612da4565b60e082015292915050565b60006020808385031215612ef057600080fd5b82516001600160401b0380821115612f0757600080fd5b818501915085601f830112612f1b57600080fd5b8151612f296129d482612990565b81815260059190911b83018401908481019088831115612f4857600080fd5b8585015b83811015612f8057805185811115612f645760008081fd5b612f728b89838a0101612e13565b845250918601918601612f4c565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b600060208284031215612fb557600080fd5b81516001600160401b03811115612fcb57600080fd5b61288984828501612e13565b808202811582820484141761044157610441612cf7565b60008261300b57634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561302257600080fd5b61273182612d8f565b634e487b7160e01b600052600160045260246000fd5b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252600990820152683737ba1030b236b4b760b91b604082015260600190565b8051612d9f81612ae0565b60006020828403121561311957600080fd5b81516001600160401b038082111561313057600080fd5b90830190610120828603121561314557600080fd5b61314d61293d565b8251815261315d602084016130fc565b602082015260408301518281111561317457600080fd5b61318087828601612d4a565b60408301525060608301518281111561319857600080fd5b6131a487828601612d4a565b6060830152506080830151608082015260a083015160a082015260c0830151828111156131d057600080fd5b6131dc87828601612d4a565b60c08301525060e083015160e0820152610100808401518381111561320057600080fd5b61320c88828701612d4a565b918301919091525095945050505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516132a0816017850160208801612d26565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516132d1816028840160208801612d26565b01602801949350505050565b60208152600082518060208401526132fc816040850160208701612d26565b601f01601f19169190910160400192915050565b8082018082111561044157610441612cf7565b60008161333257613332612cf7565b506000190190565b6000825161334c818460208701612d26565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc31b036ab0afced478f81b98045ec8782e12079526a3ffa4838f897da8a5093ad416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220bc5c61098476e4540e776a2cd08d1b06c343cbd285f49cdef4affcd9d228f46164736f6c63430008140033";

type ArmadaBillingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ArmadaBillingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ArmadaBilling__factory extends ContractFactory {
  constructor(...args: ArmadaBillingConstructorParams) {
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
      ArmadaBilling & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ArmadaBilling__factory {
    return super.connect(runner) as ArmadaBilling__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ArmadaBillingInterface {
    return new Interface(_abi) as ArmadaBillingInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ArmadaBilling {
    return new Contract(address, _abi, runner) as unknown as ArmadaBilling;
  }
}
