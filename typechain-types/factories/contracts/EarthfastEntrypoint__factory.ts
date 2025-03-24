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
  EarthfastEntrypoint,
  EarthfastEntrypointInterface,
} from "../../contracts/EarthfastEntrypoint";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        internalType: "bytes32",
        name: "projectId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "escrowAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "nodeIds",
        type: "bytes32[]",
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
    name: "SiteDeployed",
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
  "0x60a0604052306080523480156200001557600080fd5b506200002062000026565b620000e7565b600054610100900460ff1615620000935760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840160405180910390fd5b60005460ff90811614620000e5576000805460ff191660ff9081179091556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b565b6080516127726200011f6000396000818161066b015281816106ab0152818161074b0152818161078b015261081a01526127726000f3fe6080604052600436106100fe5760003560e01c80636dca4d4411610095578063c3566b6411610064578063c3566b6414610297578063c3a2a93a146102c5578063d46005b114610308578063d547741f14610328578063de7676281461034857600080fd5b80636dca4d441461022057806375b238fc1461024057806391d1485414610262578063a217fddf1461028257600080fd5b806336568abe116100d157806336568abe146101b85780633659cfe6146101d85780634f1ef286146101f857806352d1902d1461020b57600080fd5b806301ffc9a7146101035780631455537a14610138578063248a9ca3146101665780632f2ff15d14610196575b600080fd5b34801561010f57600080fd5b5061012361011e3660046119f2565b610368565b60405190151581526020015b60405180910390f35b34801561014457600080fd5b50610158610153366004611c52565b61039f565b60405190815260200161012f565b34801561017257600080fd5b50610158610181366004611cf5565b60009081526065602052604090206001015490565b3480156101a257600080fd5b506101b66101b1366004611d0e565b6105b8565b005b3480156101c457600080fd5b506101b66101d3366004611d0e565b6105e2565b3480156101e457600080fd5b506101b66101f3366004611d3a565b610660565b6101b6610206366004611d55565b610740565b34801561021757600080fd5b5061015861080d565b34801561022c57600080fd5b506101b661023b366004611da2565b6108c0565b34801561024c57600080fd5b5061015860008051602061271d83398151915281565b34801561026e57600080fd5b5061012361027d366004611d0e565b610962565b34801561028e57600080fd5b50610158600081565b3480156102a357600080fd5b506102b76102b2366004611de5565b61098d565b60405161012f929190611e44565b3480156102d157600080fd5b5061012d5461012e5461012f54604080516001600160a01b039485168152928416602084015292169181019190915260600161012f565b34801561031457600080fd5b506101b6610323366004611e72565b610dcd565b34801561033457600080fd5b506101b6610343366004611d0e565b610fa6565b34801561035457600080fd5b50610158610363366004611fa0565b610fcb565b60006001600160e01b03198216637965db0b60e01b148061039957506301ffc9a760e01b6001600160e01b03198316145b92915050565b60006103a96111c9565b61012e546040516326dc39b160e11b81526001600160a01b0390911690634db87362906103da908b906004016120db565b602060405180830381600087803b1580156103f457600080fd5b505af1158015610408573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042c919061216c565b9050600080600061043c85611223565b9250925092506000881161046b5760405162461bcd60e51b815260040161046290612185565b60405180910390fd5b61012e546040516371a9d89f60e11b81526001600160a01b039091169063e353b13e906104a8908d9088908d908c908a908a908a906004016121c9565b600060405180830381600087803b1580156104c257600080fd5b505af11580156104d6573d6000803e3d6000fd5b505050506000806104e78b8a61098d565b61012f54604051631516ad9760e11b81529294509092506001600160a01b031690632a2d5b2e90610522908990869086908f9060040161223f565b600060405180830381600087803b15801561053c57600080fd5b505af1158015610550573d6000803e3d6000fd5b505050508c600001516001600160a01b0316867f5b871a53c4112ab8a11910e6b84c1b53473605e17498745b7339062926f8c43e8c858d6040516105969392919061227a565b60405180910390a350505050506105ad6001609755565b979650505050505050565b6000828152606560205260409020600101546105d38161129c565b6105dd83836112a6565b505050565b6001600160a01b03811633146106525760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b6064820152608401610462565b61065c828261132c565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106a95760405162461bcd60e51b8152600401610462906122a2565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166106f26000805160206126d6833981519152546001600160a01b031690565b6001600160a01b0316146107185760405162461bcd60e51b8152600401610462906122ee565b61072181611393565b6040805160008082526020820190925261073d918391906113ab565b50565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156107895760405162461bcd60e51b8152600401610462906122a2565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166107d26000805160206126d6833981519152546001600160a01b031690565b6001600160a01b0316146107f85760405162461bcd60e51b8152600401610462906122ee565b61080182611393565b61065c828260016113ab565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146108ad5760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610462565b506000805160206126d683398151915290565b60008051602061271d8339815191526108d88161129c565b6001600160a01b038416156109045761012d80546001600160a01b0319166001600160a01b0386161790555b6001600160a01b038316156109305761012e80546001600160a01b0319166001600160a01b0385161790555b6001600160a01b0382161561095c5761012f80546001600160a01b0319166001600160a01b0384161790555b50505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60608061099d602084018461233a565b806109b357506109b3604084016020850161233a565b6109ff5760405162461bcd60e51b815260206004820152601a60248201527f496e76616c696420736c6f7420636f6e66696775726174696f6e0000000000006044820152606401610462565b61012d5460405163da0549ab60e01b8152600060048201819052916001600160a01b03169063da0549ab9060240160206040518083038186803b158015610a4557600080fd5b505afa158015610a59573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a7d919061216c565b61012d546040516379ca4a3960e01b815260006004820181905260248201819052604482018490529293506001600160a01b03909116906379ca4a399060640160006040518083038186803b158015610ad557600080fd5b505afa158015610ae9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610b1191908101906123f7565b9050856001600160401b03811115610b2b57610b2b611a1c565b604051908082528060200260200182016040528015610b54578160200160208202803683370190505b509350856001600160401b03811115610b6f57610b6f611a1c565b604051908082528060200260200182016040528015610b98578160200160208202803683370190505b5092506000805b83811015610d7357828181518110610bb957610bb9612551565b60200260200101516080015115610bcf57610d63565b6000610bde602089018961233a565b610c1d57838281518110610bf457610bf4612551565b602002602001015160c00151600160028110610c1257610c12612551565b602002015115610c91565b838281518110610c2f57610c2f612551565b602002602001015160c00151600060028110610c4d57610c4d612551565b6020020151158015610c915750838281518110610c6c57610c6c612551565b602002602001015160c00151600160028110610c8a57610c8a612551565b6020020151155b90508015610d6157838281518110610cab57610cab612551565b602002602001015160000151878481518110610cc957610cc9612551565b602002602001018181525050838281518110610ce757610ce7612551565b602002602001015160a00151886000016020810190610d06919061233a565b610d11576001610d14565b60005b60028110610d2457610d24612551565b6020020151868481518110610d3b57610d3b612551565b602090810291909101015282610d508161257d565b93505088831415610d615750610d73565b505b610d6c8161257d565b9050610b9f565b50868114610dc35760405162461bcd60e51b815260206004820152601a60248201527f4e6f7420656e6f75676820617661696c61626c65206e6f6465730000000000006044820152606401610462565b5050509250929050565b600054610100900460ff1615808015610ded5750600054600160ff909116105b80610e075750303b158015610e07575060005460ff166001145b610e6a5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610462565b6000805460ff191660011790558015610e8d576000805461ff0019166101001790555b610e95611525565b610e9d61154e565b610ea5611525565b61012d80546001600160a01b038087166001600160a01b03199283161790925561012e805486841690831617905561012f80549285169290911691909117905560005b85811015610f5757610f2e60008051602061271d833981519152888884818110610f1457610f14612551565b9050602002016020810190610f299190611d3a565b6112a6565b610f456000888884818110610f1457610f14612551565b80610f4f8161257d565b915050610ee8565b508015610f9e576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050505050565b600082815260656020526040902060010154610fc18161129c565b6105dd838361132c565b6000610fd56111c9565b61012e546040516326dc39b160e11b81526001600160a01b0390911690634db8736290611006908c906004016120db565b602060405180830381600087803b15801561102057600080fd5b505af1158015611034573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611058919061216c565b9050600080600061106885611223565b9250925092506000881161108e5760405162461bcd60e51b815260040161046290612185565b61012e546040516371a9d89f60e11b81526001600160a01b039091169063e353b13e906110cb908e9088908d908c908a908a908a906004016121c9565b600060405180830381600087803b1580156110e557600080fd5b505af11580156110f9573d6000803e3d6000fd5b505061012f54604051631516ad9760e11b81526001600160a01b039091169250632a2d5b2e91506111349087908e908e908d9060040161223f565b600060405180830381600087803b15801561114e57600080fd5b505af1158015611162573d6000803e3d6000fd5b505050508b600001516001600160a01b0316847f5b871a53c4112ab8a11910e6b84c1b53473605e17498745b7339062926f8c43e8a8d8b6040516111a89392919061227a565b60405180910390a35050506111bd6001609755565b98975050505050505050565b6002609754141561121c5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610462565b6002609755565b600080600083516041146112795760405162461bcd60e51b815260206004820152601860248201527f496e76616c6964207369676e6174757265206c656e67746800000000000000006044820152606401610462565b5050506020810151604082015160609092015160001a92909190565b6001609755565b61073d813361157d565b6112b08282610962565b61065c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556112e83390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6113368282610962565b1561065c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008051602061271d83398151915261065c8161129c565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156113de576105dd836115d6565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b815260040160206040518083038186803b15801561141757600080fd5b505afa925050508015611447575060408051601f3d908101601f191682019092526114449181019061216c565b60015b6114aa5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610462565b6000805160206126d683398151915281146115195760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610462565b506105dd838383611672565b600054610100900460ff1661154c5760405162461bcd60e51b815260040161046290612598565b565b600054610100900460ff166115755760405162461bcd60e51b815260040161046290612598565b61154c611697565b6115878282610962565b61065c57611594816116be565b61159f8360206116d0565b6040516020016115b09291906125e3565b60408051601f198184030181529082905262461bcd60e51b825261046291600401612658565b6001600160a01b0381163b6116435760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610462565b6000805160206126d683398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b61167b83611872565b6000825111806116885750805b156105dd5761095c83836118b2565b600054610100900460ff166112955760405162461bcd60e51b815260040161046290612598565b60606103996001600160a01b03831660145b606060006116df83600261266b565b6116ea90600261268a565b6001600160401b0381111561170157611701611a1c565b6040519080825280601f01601f19166020018201604052801561172b576020820181803683370190505b509050600360fc1b8160008151811061174657611746612551565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061177557611775612551565b60200101906001600160f81b031916908160001a905350600061179984600261266b565b6117a490600161268a565b90505b600181111561181c576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106117d8576117d8612551565b1a60f81b8282815181106117ee576117ee612551565b60200101906001600160f81b031916908160001a90535060049490941c93611815816126a2565b90506117a7565b50831561186b5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610462565b9392505050565b61187b816115d6565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b606061186b83836040518060600160405280602781526020016126f6602791396060600080856001600160a01b0316856040516118ef91906126b9565b600060405180830381855af49150503d806000811461192a576040519150601f19603f3d011682016040523d82523d6000602084013e61192f565b606091505b50915091506119408683838761194a565b9695505050505050565b606083156119b65782516119af576001600160a01b0385163b6119af5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610462565b50816119c0565b6119c083836119c8565b949350505050565b8151156119d85781518083602001fd5b8060405162461bcd60e51b81526004016104629190612658565b600060208284031215611a0457600080fd5b81356001600160e01b03198116811461186b57600080fd5b634e487b7160e01b600052604160045260246000fd5b60405160c081016001600160401b0381118282101715611a5457611a54611a1c565b60405290565b60405160e081016001600160401b0381118282101715611a5457611a54611a1c565b604080519081016001600160401b0381118282101715611a5457611a54611a1c565b604051601f8201601f191681016001600160401b0381118282101715611ac657611ac6611a1c565b604052919050565b80356001600160a01b0381168114611ae557600080fd5b919050565b60006001600160401b03821115611b0357611b03611a1c565b50601f01601f191660200190565b600082601f830112611b2257600080fd5b8135611b35611b3082611aea565b611a9e565b818152846020838601011115611b4a57600080fd5b816020850160208301376000918101602001919091529392505050565b600060c08284031215611b7957600080fd5b611b81611a32565b9050611b8c82611ace565b815260208201356001600160401b0380821115611ba857600080fd5b611bb485838601611b11565b60208401526040840135915080821115611bcd57600080fd5b611bd985838601611b11565b60408401526060840135915080821115611bf257600080fd5b611bfe85838601611b11565b60608401526080840135608084015260a0840135915080821115611c2157600080fd5b50611c2e84828501611b11565b60a08301525092915050565b600060408284031215611c4c57600080fd5b50919050565b6000806000806000806000610100888a031215611c6e57600080fd5b87356001600160401b0380821115611c8557600080fd5b611c918b838c01611b67565b9850611c9f60208b01611ace565b975060408a0135965060608a01359550611cbc8b60808c01611c3a565b945060c08a0135935060e08a0135915080821115611cd957600080fd5b50611ce68a828b01611b11565b91505092959891949750929550565b600060208284031215611d0757600080fd5b5035919050565b60008060408385031215611d2157600080fd5b82359150611d3160208401611ace565b90509250929050565b600060208284031215611d4c57600080fd5b61186b82611ace565b60008060408385031215611d6857600080fd5b611d7183611ace565b915060208301356001600160401b03811115611d8c57600080fd5b611d9885828601611b11565b9150509250929050565b600080600060608486031215611db757600080fd5b611dc084611ace565b9250611dce60208501611ace565b9150611ddc60408501611ace565b90509250925092565b60008060608385031215611df857600080fd5b82359150611d318460208501611c3a565b600081518084526020808501945080840160005b83811015611e3957815187529582019590820190600101611e1d565b509495945050505050565b604081526000611e576040830185611e09565b8281036020840152611e698185611e09565b95945050505050565b600080600080600060808688031215611e8a57600080fd5b85356001600160401b0380821115611ea157600080fd5b818801915088601f830112611eb557600080fd5b813581811115611ec457600080fd5b8960208260051b8501011115611ed957600080fd5b602092830197509550611eef9188019050611ace565b9250611efd60408701611ace565b9150611f0b60608701611ace565b90509295509295909350565b60006001600160401b03821115611f3057611f30611a1c565b5060051b60200190565b600082601f830112611f4b57600080fd5b81356020611f5b611b3083611f17565b82815260059290921b84018101918181019086841115611f7a57600080fd5b8286015b84811015611f955780358352918301918301611f7e565b509695505050505050565b600080600080600080600080610120898b031215611fbd57600080fd5b88356001600160401b0380821115611fd457600080fd5b611fe08c838d01611b67565b9950611fee60208c01611ace565b985060408b013591508082111561200457600080fd5b6120108c838d01611f3a565b975060608b013591508082111561202657600080fd5b6120328c838d01611f3a565b965060808b013595506120488c60a08d01611c3a565b945060e08b013593506101008b013591508082111561206657600080fd5b506120738b828c01611b11565b9150509295985092959890939650565b60005b8381101561209e578181015183820152602001612086565b8381111561095c5750506000910152565b600081518084526120c7816020860160208601612083565b601f01601f19169290920160200192915050565b602080825282516001600160a01b03168282015282015160c0604083015260009061210960e08401826120af565b90506040840151601f198085840301606086015261212783836120af565b9250606086015191508085840301608086015261214483836120af565b9250608086015160a086015260a08601519150808584030160c086015250611e6982826120af565b60006020828403121561217e57600080fd5b5051919050565b60208082526024908201527f457363726f7720616d6f756e74206d75737420626520677265617465722074686040820152630616e20360e41b606082015260800190565b6001600160a01b0397909716875260208701959095526040860193909352606085019190915260ff16608084015260a083015260c082015260e00190565b801515811461073d57600080fd5b803561222081612207565b15158252602081013561223281612207565b8015156020840152505050565b84815260a06020820152600061225860a0830186611e09565b828103604084015261226a8186611e09565b915050611e696060830184612215565b8381526080602082015260006122936080830185611e09565b90506119c06040830184612215565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b60006020828403121561234c57600080fd5b813561186b81612207565b600082601f83011261236857600080fd5b8151612376611b3082611aea565b81815284602083860101111561238b57600080fd5b6119c0826020830160208701612083565b8051611ae581612207565b600082601f8301126123b857600080fd5b6123c0611a7c565b8060408401858111156123d257600080fd5b845b818110156123ec5780518452602093840193016123d4565b509095945050505050565b6000602080838503121561240a57600080fd5b82516001600160401b038082111561242157600080fd5b818501915085601f83011261243557600080fd5b8151612443611b3082611f17565b81815260059190911b8301840190848101908883111561246257600080fd5b8585015b838110156125445780518581111561247e5760008081fd5b8601610120818c03601f190112156124965760008081fd5b61249e611a5a565b8882015181526040808301518a830152606080840151898111156124c25760008081fd5b6124d08f8d83880101612357565b83850152506080915081840151898111156124eb5760008081fd5b6124f98f8d83880101612357565b82850152505060a061250c81850161239c565b8284015260c091506125208e8386016123a7565b908301526125328d61010085016123a7565b90820152845250918601918601612466565b5098975050505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060001982141561259157612591612567565b5060010190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161261b816017850160208801612083565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161264c816028840160208801612083565b01602801949350505050565b60208152600061186b60208301846120af565b600081600019048311821515161561268557612685612567565b500290565b6000821982111561269d5761269d612567565b500190565b6000816126b1576126b1612567565b506000190190565b600082516126cb818460208701612083565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a26469706673582212202e27d92eda757e3d502f92ba1a71424ab8a857758fd9b2e984782e1e4ad2fa3b64736f6c63430008090033";

type EarthfastEntrypointConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EarthfastEntrypointConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EarthfastEntrypoint__factory extends ContractFactory {
  constructor(...args: EarthfastEntrypointConstructorParams) {
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
      EarthfastEntrypoint & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): EarthfastEntrypoint__factory {
    return super.connect(runner) as EarthfastEntrypoint__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EarthfastEntrypointInterface {
    return new Interface(_abi) as EarthfastEntrypointInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EarthfastEntrypoint {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as EarthfastEntrypoint;
  }
}
