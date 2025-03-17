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
import type { NonPayableOverrides } from "../../../common";
import type {
  EarthfastEntrypointV2,
  EarthfastEntrypointV2Interface,
} from "../../../contracts/test/EarthfastEntrypointV2";

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
    name: "ADMIN_ROLE",
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
    name: "VERSION",
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
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "email",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "checksum",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct EarthfastCreateProjectData",
        name: "project",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "fundingWallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nodesToReserve",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "escrowAmount",
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
        internalType: "struct EarthfastSlot",
        name: "slot",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "deploySite",
    outputs: [
      {
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "email",
            type: "string",
          },
          {
            internalType: "string",
            name: "content",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "checksum",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct EarthfastCreateProjectData",
        name: "project",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "fundingWallet",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "nodePrices",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "escrowAmount",
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
        internalType: "struct EarthfastSlot",
        name: "slot",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "deploySiteWithNodeIds",
    outputs: [
      {
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nodesToReserve",
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
        internalType: "struct EarthfastSlot",
        name: "slot",
        type: "tuple",
      },
    ],
    name: "getAvailableNodes",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "nodePrices",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContracts",
    outputs: [
      {
        internalType: "address",
        name: "nodes",
        type: "address",
      },
      {
        internalType: "address",
        name: "projects",
        type: "address",
      },
      {
        internalType: "address",
        name: "reservations",
        type: "address",
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
    inputs: [],
    name: "getVersion",
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
        internalType: "address",
        name: "nodes",
        type: "address",
      },
      {
        internalType: "address",
        name: "projects",
        type: "address",
      },
      {
        internalType: "address",
        name: "reservations",
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
    inputs: [
      {
        internalType: "address",
        name: "nodes",
        type: "address",
      },
      {
        internalType: "address",
        name: "projects",
        type: "address",
      },
      {
        internalType: "address",
        name: "reservations",
        type: "address",
      },
    ],
    name: "updateContracts",
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
  "0x60a0604052306080523480156200001557600080fd5b506200002062000026565b620000e7565b600054610100900460ff1615620000935760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff90811614620000e5576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b6080516126266200011f6000396000818161069f015281816106df0152818161077f015281816107bf015261084e01526126266000f3fe6080604052600436106101145760003560e01c80636dca4d44116100a0578063c3a2a93a11610064578063c3a2a93a14610312578063d46005b114610355578063d547741f14610375578063de76762814610395578063ffa1ad74146103b557600080fd5b80636dca4d441461026d57806375b238fc1461028d57806391d14854146102af578063a217fddf146102cf578063c3566b64146102e457600080fd5b80632f2ff15d116100e75780632f2ff15d146101e357806336568abe146102055780633659cfe6146102255780634f1ef2861461024557806352d1902d1461025857600080fd5b806301ffc9a7146101195780630d8e6e2c1461014e5780631455537a14610185578063248a9ca3146101b3575b600080fd5b34801561012557600080fd5b506101396101343660046118d3565b6103e6565b60405190151581526020015b60405180910390f35b34801561015a57600080fd5b506040805180820190915260058152640322e302e360dc1b60208201525b6040516101459190611955565b34801561019157600080fd5b506101a56101a0366004611b9e565b61041d565b604051908152602001610145565b3480156101bf57600080fd5b506101a56101ce366004611c41565b60009081526065602052604090206001015490565b3480156101ef57600080fd5b506102036101fe366004611c5a565b6105ec565b005b34801561021157600080fd5b50610203610220366004611c5a565b610616565b34801561023157600080fd5b50610203610240366004611c86565b610694565b610203610253366004611ca1565b610774565b34801561026457600080fd5b506101a5610841565b34801561027957600080fd5b50610203610288366004611cee565b6108f4565b34801561029957600080fd5b506101a56000805160206125d183398151915281565b3480156102bb57600080fd5b506101396102ca366004611c5a565b610996565b3480156102db57600080fd5b506101a5600081565b3480156102f057600080fd5b506103046102ff366004611d31565b6109c1565b604051610145929190611d90565b34801561031e57600080fd5b5061012d5461012e5461012f54604080516001600160a01b0394851681529284166020840152921691810191909152606001610145565b34801561036157600080fd5b50610203610370366004611dbe565b610cf8565b34801561038157600080fd5b50610203610390366004611c5a565b610ed1565b3480156103a157600080fd5b506101a56103b0366004611eec565b610ef6565b3480156103c157600080fd5b50610178604051806040016040528060058152602001640322e302e360dc1b81525081565b60006001600160e01b03198216637965db0b60e01b148061041757506301ffc9a760e01b6001600160e01b03198316145b92915050565b60006104276110aa565b61012e546040516326dc39b160e11b81526001600160a01b0390911690634db8736290610458908b90600401611fcf565b602060405180830381600087803b15801561047257600080fd5b505af1158015610486573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104aa9190612060565b905060008060006104ba85611104565b925092509250600088116104e95760405162461bcd60e51b81526004016104e090612079565b60405180910390fd5b61012e546040516371a9d89f60e11b81526001600160a01b039091169063e353b13e90610526908d9088908d908c908a908a908a906004016120bd565b600060405180830381600087803b15801561054057600080fd5b505af1158015610554573d6000803e3d6000fd5b505050506000806105658b8a6109c1565b61012f54604051631516ad9760e11b81529294509092506001600160a01b031690632a2d5b2e906105a0908990869086908f90600401612109565b600060405180830381600087803b1580156105ba57600080fd5b505af11580156105ce573d6000803e3d6000fd5b5050505050505050506105e16001609755565b979650505050505050565b6000828152606560205260409020600101546106078161117d565b6106118383611187565b505050565b6001600160a01b03811633146106865760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016104e0565b610690828261120d565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106dd5760405162461bcd60e51b81526004016104e090612169565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661072660008051602061258a833981519152546001600160a01b031690565b6001600160a01b03161461074c5760405162461bcd60e51b81526004016104e0906121b5565b61075581611274565b604080516000808252602082019092526107719183919061128c565b50565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156107bd5760405162461bcd60e51b81526004016104e090612169565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661080660008051602061258a833981519152546001600160a01b031690565b6001600160a01b03161461082c5760405162461bcd60e51b81526004016104e0906121b5565b61083582611274565b6106908282600161128c565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146108e15760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c000000000000000060648201526084016104e0565b5060008051602061258a83398151915290565b6000805160206125d183398151915261090c8161117d565b6001600160a01b038416156109385761012d80546001600160a01b0319166001600160a01b0386161790555b6001600160a01b038316156109645761012e80546001600160a01b0319166001600160a01b0385161790555b6001600160a01b038216156109905761012f80546001600160a01b0319166001600160a01b0384161790555b50505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b61012d5460405163da0549ab60e01b815260006004820181905260609283926001600160a01b039091169063da0549ab9060240160206040518083038186803b158015610a0d57600080fd5b505afa158015610a21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a459190612060565b61012d546040516379ca4a3960e01b815260006004820181905260248201819052604482018490529293506001600160a01b03909116906379ca4a399060640160006040518083038186803b158015610a9d57600080fd5b505afa158015610ab1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610ad991908101906122a1565b9050856001600160401b03811115610af357610af3611968565b604051908082528060200260200182016040528015610b1c578160200160208202803683370190505b509350856001600160401b03811115610b3757610b37611968565b604051908082528060200260200182016040528015610b60578160200160208202803683370190505b5092506000805b83811015610c9e57828181518110610b8157610b816123fb565b602002602001015160c00151876000016020810190610ba09190612411565b610bab576001610bae565b60005b60028110610bbe57610bbe6123fb565b6020020151610c8e57828181518110610bd957610bd96123fb565b602002602001015160000151868381518110610bf757610bf76123fb565b602002602001018181525050828181518110610c1557610c156123fb565b602002602001015160a00151876000016020810190610c349190612411565b610c3f576001610c42565b60005b60028110610c5257610c526123fb565b6020020151858381518110610c6957610c696123fb565b602090810291909101015281610c7e81612444565b92505087821415610c8e57610c9e565b610c9781612444565b9050610b67565b50868114610cee5760405162461bcd60e51b815260206004820152601a60248201527f4e6f7420656e6f75676820617661696c61626c65206e6f64657300000000000060448201526064016104e0565b5050509250929050565b600054610100900460ff1615808015610d185750600054600160ff909116105b80610d325750303b158015610d32575060005460ff166001145b610d955760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016104e0565b6000805460ff191660011790558015610db8576000805461ff0019166101001790555b610dc0611406565b610dc861142f565b610dd0611406565b61012d80546001600160a01b038087166001600160a01b03199283161790925561012e805486841690831617905561012f80549285169290911691909117905560005b85811015610e8257610e596000805160206125d1833981519152888884818110610e3f57610e3f6123fb565b9050602002016020810190610e549190611c86565b611187565b610e706000888884818110610e3f57610e3f6123fb565b80610e7a81612444565b915050610e13565b508015610ec9576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050505050565b600082815260656020526040902060010154610eec8161117d565b610611838361120d565b6000610f006110aa565b61012e546040516326dc39b160e11b81526001600160a01b0390911690634db8736290610f31908c90600401611fcf565b602060405180830381600087803b158015610f4b57600080fd5b505af1158015610f5f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f839190612060565b90506000806000610f9385611104565b92509250925060008811610fb95760405162461bcd60e51b81526004016104e090612079565b61012e546040516371a9d89f60e11b81526001600160a01b039091169063e353b13e90610ff6908e9088908d908c908a908a908a906004016120bd565b600060405180830381600087803b15801561101057600080fd5b505af1158015611024573d6000803e3d6000fd5b505061012f54604051631516ad9760e11b81526001600160a01b039091169250632a2d5b2e915061105f9087908e908e908d90600401612109565b600060405180830381600087803b15801561107957600080fd5b505af115801561108d573d6000803e3d6000fd5b5050505050505061109e6001609755565b98975050505050505050565b600260975414156110fd5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016104e0565b6002609755565b6000806000835160411461115a5760405162461bcd60e51b815260206004820152601860248201527f496e76616c6964207369676e6174757265206c656e677468000000000000000060448201526064016104e0565b5050506020810151604082015160609092015160001a92909190565b6001609755565b610771813361145e565b6111918282610996565b6106905760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556111c93390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6112178282610996565b156106905760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000805160206125d18339815191526106908161117d565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156112bf57610611836114b7565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b815260040160206040518083038186803b1580156112f857600080fd5b505afa925050508015611328575060408051601f3d908101601f1916820190925261132591810190612060565b60015b61138b5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b60648201526084016104e0565b60008051602061258a83398151915281146113fa5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b60648201526084016104e0565b50610611838383611553565b600054610100900460ff1661142d5760405162461bcd60e51b81526004016104e09061245f565b565b600054610100900460ff166114565760405162461bcd60e51b81526004016104e09061245f565b61142d611578565b6114688282610996565b610690576114758161159f565b6114808360206115b1565b6040516020016114919291906124aa565b60408051601f198184030181529082905262461bcd60e51b82526104e091600401611955565b6001600160a01b0381163b6115245760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016104e0565b60008051602061258a83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b61155c83611753565b6000825111806115695750805b15610611576109908383611793565b600054610100900460ff166111765760405162461bcd60e51b81526004016104e09061245f565b60606104176001600160a01b03831660145b606060006115c083600261251f565b6115cb90600261253e565b6001600160401b038111156115e2576115e2611968565b6040519080825280601f01601f19166020018201604052801561160c576020820181803683370190505b509050600360fc1b81600081518110611627576116276123fb565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611656576116566123fb565b60200101906001600160f81b031916908160001a905350600061167a84600261251f565b61168590600161253e565b90505b60018111156116fd576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106116b9576116b96123fb565b1a60f81b8282815181106116cf576116cf6123fb565b60200101906001600160f81b031916908160001a90535060049490941c936116f681612556565b9050611688565b50831561174c5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016104e0565b9392505050565b61175c816114b7565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b606061174c83836040518060600160405280602781526020016125aa602791396060600080856001600160a01b0316856040516117d0919061256d565b600060405180830381855af49150503d806000811461180b576040519150601f19603f3d011682016040523d82523d6000602084013e611810565b606091505b50915091506118218683838761182b565b9695505050505050565b60608315611897578251611890576001600160a01b0385163b6118905760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016104e0565b50816118a1565b6118a183836118a9565b949350505050565b8151156118b95781518083602001fd5b8060405162461bcd60e51b81526004016104e09190611955565b6000602082840312156118e557600080fd5b81356001600160e01b03198116811461174c57600080fd5b60005b83811015611918578181015183820152602001611900565b838111156109905750506000910152565b600081518084526119418160208601602086016118fd565b601f01601f19169290920160200192915050565b60208152600061174c6020830184611929565b634e487b7160e01b600052604160045260246000fd5b60405160c081016001600160401b03811182821017156119a0576119a0611968565b60405290565b60405160e081016001600160401b03811182821017156119a0576119a0611968565b604080519081016001600160401b03811182821017156119a0576119a0611968565b604051601f8201601f191681016001600160401b0381118282101715611a1257611a12611968565b604052919050565b80356001600160a01b0381168114611a3157600080fd5b919050565b60006001600160401b03821115611a4f57611a4f611968565b50601f01601f191660200190565b600082601f830112611a6e57600080fd5b8135611a81611a7c82611a36565b6119ea565b818152846020838601011115611a9657600080fd5b816020850160208301376000918101602001919091529392505050565b600060c08284031215611ac557600080fd5b611acd61197e565b9050611ad882611a1a565b815260208201356001600160401b0380821115611af457600080fd5b611b0085838601611a5d565b60208401526040840135915080821115611b1957600080fd5b611b2585838601611a5d565b60408401526060840135915080821115611b3e57600080fd5b611b4a85838601611a5d565b60608401526080840135608084015260a0840135915080821115611b6d57600080fd5b50611b7a84828501611a5d565b60a08301525092915050565b600060408284031215611b9857600080fd5b50919050565b6000806000806000806000610100888a031215611bba57600080fd5b87356001600160401b0380821115611bd157600080fd5b611bdd8b838c01611ab3565b9850611beb60208b01611a1a565b975060408a0135965060608a01359550611c088b60808c01611b86565b945060c08a0135935060e08a0135915080821115611c2557600080fd5b50611c328a828b01611a5d565b91505092959891949750929550565b600060208284031215611c5357600080fd5b5035919050565b60008060408385031215611c6d57600080fd5b82359150611c7d60208401611a1a565b90509250929050565b600060208284031215611c9857600080fd5b61174c82611a1a565b60008060408385031215611cb457600080fd5b611cbd83611a1a565b915060208301356001600160401b03811115611cd857600080fd5b611ce485828601611a5d565b9150509250929050565b600080600060608486031215611d0357600080fd5b611d0c84611a1a565b9250611d1a60208501611a1a565b9150611d2860408501611a1a565b90509250925092565b60008060608385031215611d4457600080fd5b82359150611c7d8460208501611b86565b600081518084526020808501945080840160005b83811015611d8557815187529582019590820190600101611d69565b509495945050505050565b604081526000611da36040830185611d55565b8281036020840152611db58185611d55565b95945050505050565b600080600080600060808688031215611dd657600080fd5b85356001600160401b0380821115611ded57600080fd5b818801915088601f830112611e0157600080fd5b813581811115611e1057600080fd5b8960208260051b8501011115611e2557600080fd5b602092830197509550611e3b9188019050611a1a565b9250611e4960408701611a1a565b9150611e5760608701611a1a565b90509295509295909350565b60006001600160401b03821115611e7c57611e7c611968565b5060051b60200190565b600082601f830112611e9757600080fd5b81356020611ea7611a7c83611e63565b82815260059290921b84018101918181019086841115611ec657600080fd5b8286015b84811015611ee15780358352918301918301611eca565b509695505050505050565b600080600080600080600080610120898b031215611f0957600080fd5b88356001600160401b0380821115611f2057600080fd5b611f2c8c838d01611ab3565b9950611f3a60208c01611a1a565b985060408b0135915080821115611f5057600080fd5b611f5c8c838d01611e86565b975060608b0135915080821115611f7257600080fd5b611f7e8c838d01611e86565b965060808b01359550611f948c60a08d01611b86565b945060e08b013593506101008b0135915080821115611fb257600080fd5b50611fbf8b828c01611a5d565b9150509295985092959890939650565b602080825282516001600160a01b03168282015282015160c06040830152600090611ffd60e0840182611929565b90506040840151601f198085840301606086015261201b8383611929565b925060608601519150808584030160808601526120388383611929565b9250608086015160a086015260a08601519150808584030160c086015250611db58282611929565b60006020828403121561207257600080fd5b5051919050565b60208082526024908201527f457363726f7720616d6f756e74206d75737420626520677265617465722074686040820152630616e20360e41b606082015260800190565b6001600160a01b0397909716875260208701959095526040860193909352606085019190915260ff16608084015260a083015260c082015260e00190565b801515811461077157600080fd5b84815260a06020820152600061212260a0830186611d55565b82810360408401526121348186611d55565b9150508235612142816120fb565b151560608301526020830135612157816120fb565b80151560808401525095945050505050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b600082601f83011261221257600080fd5b8151612220611a7c82611a36565b81815284602083860101111561223557600080fd5b6118a18260208301602087016118fd565b8051611a31816120fb565b600082601f83011261226257600080fd5b61226a6119c8565b80604084018581111561227c57600080fd5b845b8181101561229657805184526020938401930161227e565b509095945050505050565b600060208083850312156122b457600080fd5b82516001600160401b03808211156122cb57600080fd5b818501915085601f8301126122df57600080fd5b81516122ed611a7c82611e63565b81815260059190911b8301840190848101908883111561230c57600080fd5b8585015b838110156123ee578051858111156123285760008081fd5b8601610120818c03601f190112156123405760008081fd5b6123486119a6565b8882015181526040808301518a8301526060808401518981111561236c5760008081fd5b61237a8f8d83880101612201565b83850152506080915081840151898111156123955760008081fd5b6123a38f8d83880101612201565b82850152505060a06123b6818501612246565b8284015260c091506123ca8e838601612251565b908301526123dc8d6101008501612251565b90820152845250918601918601612310565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561242357600080fd5b813561174c816120fb565b634e487b7160e01b600052601160045260246000fd5b60006000198214156124585761245861242e565b5060010190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516124e28160178501602088016118fd565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516125138160288401602088016118fd565b01602801949350505050565b60008160001904831182151516156125395761253961242e565b500290565b600082198211156125515761255161242e565b500190565b6000816125655761256561242e565b506000190190565b6000825161257f8184602087016118fd565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a264697066735822122001e35fd711c80ce82339595135137c8be4a4d776f8868b2091fbe25950e7150764736f6c63430008090033";

type EarthfastEntrypointV2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EarthfastEntrypointV2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EarthfastEntrypointV2__factory extends ContractFactory {
  constructor(...args: EarthfastEntrypointV2ConstructorParams) {
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
      EarthfastEntrypointV2 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): EarthfastEntrypointV2__factory {
    return super.connect(runner) as EarthfastEntrypointV2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EarthfastEntrypointV2Interface {
    return new Interface(_abi) as EarthfastEntrypointV2Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EarthfastEntrypointV2 {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as EarthfastEntrypointV2;
  }
}
