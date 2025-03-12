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
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  EarthfastTimelock,
  EarthfastTimelockInterface,
} from "../../contracts/EarthfastTimelock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minDelay",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "admins",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "proposers",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "executors",
        type: "address[]",
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
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "CallExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "CallSalt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "CallScheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "Cancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newDuration",
        type: "uint256",
      },
    ],
    name: "MinDelayChange",
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
    inputs: [],
    name: "CANCELLER_ROLE",
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
    name: "EXECUTOR_ROLE",
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
    name: "PROPOSER_ROLE",
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
    name: "TIMELOCK_ADMIN_ROLE",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinDelay",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getTimestamp",
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
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperation",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperationBatch",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperation",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationDone",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationPending",
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
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationReady",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
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
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "schedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "scheduleBatch",
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
        internalType: "uint256",
        name: "newDelay",
        type: "uint256",
      },
    ],
    name: "updateDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002576380380620025768339810160408190526200003491620005c1565b838282600062000054600080516020620024f68339815191528062000366565b6200007e60008051602062002516833981519152600080516020620024f683398151915262000366565b620000a860008051602062002536833981519152600080516020620024f683398151915262000366565b620000d260008051602062002556833981519152600080516020620024f683398151915262000366565b620000ed600080516020620024f683398151915230620003b1565b6001600160a01b03811615620001185762000118600080516020620024f683398151915282620003b1565b60005b83518110156200019e5762000162600080516020620025168339815191528583815181106200014e576200014e6200065d565b6020026020010151620003b160201b60201c565b6200018b600080516020620025568339815191528583815181106200014e576200014e6200065d565b620001968162000673565b90506200011b565b5060005b8251811015620001e857620001d5600080516020620025368339815191528483815181106200014e576200014e6200065d565b620001e08162000673565b9050620001a2565b5060028490556040805160008152602081018690527f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5910160405180910390a1505050506200024d600080516020620024f683398151915233620003c160201b60201c565b6000835111620002905760405162461bcd60e51b81526020600482015260096024820152686e6f2061646d696e7360b81b60448201526064015b60405180910390fd5b60005b83518110156200035b5760006001600160a01b0316848281518110620002bd57620002bd6200065d565b60200260200101516001600160a01b031614156200030b5760405162461bcd60e51b815260206004820152600a6024820152693d32b9379030b236b4b760b11b604482015260640162000287565b62000348600080516020620024f68339815191528583815181106200033457620003346200065d565b60200260200101516200044160201b60201c565b620003538162000673565b905062000293565b50505050506200069d565b600082815260208190526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b620003bd828262000441565b5050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1615620003bd576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620003bd576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556200049d3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146200050f57600080fd5b919050565b600082601f8301126200052657600080fd5b815160206001600160401b0380831115620005455762000545620004e1565b8260051b604051601f19603f830116810181811084821117156200056d576200056d620004e1565b6040529384528581018301938381019250878511156200058c57600080fd5b83870191505b84821015620005b657620005a682620004f7565b8352918301919083019062000592565b979650505050505050565b60008060008060808587031215620005d857600080fd5b845160208601519094506001600160401b0380821115620005f857600080fd5b620006068883890162000514565b945060408701519150808211156200061d57600080fd5b6200062b8883890162000514565b935060608701519150808211156200064257600080fd5b50620006518782880162000514565b91505092959194509250565b634e487b7160e01b600052603260045260246000fd5b60006000198214156200069657634e487b7160e01b600052601160045260246000fd5b5060010190565b611e4980620006ad6000396000f3fe6080604052600436106101bb5760003560e01c80638065657f116100ec578063bc197c811161008a578063d547741f11610064578063d547741f14610582578063e38335e5146105a2578063f23a6e61146105b5578063f27a0c92146105e157600080fd5b8063bc197c8114610509578063c4d252f514610535578063d45c44351461055557600080fd5b806391d14854116100c657806391d1485414610480578063a217fddf146104a0578063b08e51c0146104b5578063b1c5f427146104e957600080fd5b80638065657f1461040c5780638f2a0bb01461042c5780638f61f4f51461044c57600080fd5b8063248a9ca31161015957806331d507501161013357806331d507501461038c57806336568abe146103ac578063584b153e146103cc57806364d62353146103ec57600080fd5b8063248a9ca31461030b5780632ab0f5291461033b5780632f2ff15d1461036c57600080fd5b80630d3cf6fc116101955780630d3cf6fc14610260578063134008d31461029457806313bc9f20146102a7578063150b7a02146102c757600080fd5b806301d5062a146101c757806301ffc9a7146101e957806307bd02651461021e57600080fd5b366101c257005b600080fd5b3480156101d357600080fd5b506101e76101e2366004611442565b6105f6565b005b3480156101f557600080fd5b506102096102043660046114b6565b6106cc565b60405190151581526020015b60405180910390f35b34801561022a57600080fd5b506102527fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e6381565b604051908152602001610215565b34801561026c57600080fd5b506102527f5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca581565b6101e76102a23660046114e0565b6106f7565b3480156102b357600080fd5b506102096102c236600461154b565b6107ac565b3480156102d357600080fd5b506102f26102e2366004611619565b630a85bd0160e11b949350505050565b6040516001600160e01b03199091168152602001610215565b34801561031757600080fd5b5061025261032636600461154b565b60009081526020819052604090206001015490565b34801561034757600080fd5b5061020961035636600461154b565b6000908152600160208190526040909120541490565b34801561037857600080fd5b506101e7610387366004611680565b6107d2565b34801561039857600080fd5b506102096103a736600461154b565b6107fc565b3480156103b857600080fd5b506101e76103c7366004611680565b610815565b3480156103d857600080fd5b506102096103e736600461154b565b610898565b3480156103f857600080fd5b506101e761040736600461154b565b6108ae565b34801561041857600080fd5b506102526104273660046114e0565b610952565b34801561043857600080fd5b506101e76104473660046116f0565b610991565b34801561045857600080fd5b506102527fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc181565b34801561048c57600080fd5b5061020961049b366004611680565b610b24565b3480156104ac57600080fd5b50610252600081565b3480156104c157600080fd5b506102527ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f78381565b3480156104f557600080fd5b506102526105043660046117a1565b610b4d565b34801561051557600080fd5b506102f26105243660046118c8565b63bc197c8160e01b95945050505050565b34801561054157600080fd5b506101e761055036600461154b565b610b92565b34801561056157600080fd5b5061025261057036600461154b565b60009081526001602052604090205490565b34801561058e57600080fd5b506101e761059d366004611680565b610c67565b6101e76105b03660046117a1565b610c8c565b3480156105c157600080fd5b506102f26105d0366004611971565b63f23a6e6160e01b95945050505050565b3480156105ed57600080fd5b50600254610252565b7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc161062081610e16565b6000610630898989898989610952565b905061063c8184610e23565b6000817f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8b8b8b8b8b8a604051610678969594939291906119fe565b60405180910390a383156106c157807f20fda5fd27a1ea7bf5b9567f143ac5470bb059374a27e8f67cb44f946f6d0387856040516106b891815260200190565b60405180910390a25b505050505050505050565b60006001600160e01b03198216630271189760e51b14806106f157506106f182610f12565b92915050565b7fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63610723816000610b24565b610731576107318133610f47565b6000610741888888888888610952565b905061074d8185610fa0565b6107598888888861103c565b6000817fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b588a8a8a8a6040516107919493929190611a3b565b60405180910390a36107a28161110f565b5050505050505050565b6000818152600160205260408120546001811180156107cb5750428111155b9392505050565b6000828152602081905260409020600101546107ed81610e16565b6107f78383611148565b505050565b60008181526001602052604081205481905b1192915050565b6001600160a01b038116331461088a5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61089482826111cc565b5050565b600081815260016020819052604082205461080e565b3330146109115760405162461bcd60e51b815260206004820152602b60248201527f54696d656c6f636b436f6e74726f6c6c65723a2063616c6c6572206d7573742060448201526a62652074696d656c6f636b60a81b6064820152608401610881565b60025460408051918252602082018390527f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5910160405180910390a1600255565b600086868686868660405160200161096f969594939291906119fe565b6040516020818303038152906040528051906020012090509695505050505050565b7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc16109bb81610e16565b8887146109da5760405162461bcd60e51b815260040161088190611a6d565b8885146109f95760405162461bcd60e51b815260040161088190611a6d565b6000610a0b8b8b8b8b8b8b8b8b610b4d565b9050610a178184610e23565b60005b8a811015610ad55780827f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8e8e85818110610a5757610a57611ab0565b9050602002016020810190610a6c9190611ac6565b8d8d86818110610a7e57610a7e611ab0565b905060200201358c8c87818110610a9757610a97611ab0565b9050602002810190610aa99190611ae1565b8c8b604051610abd969594939291906119fe565b60405180910390a3610ace81611b3d565b9050610a1a565b508315610b1757807f20fda5fd27a1ea7bf5b9567f143ac5470bb059374a27e8f67cb44f946f6d038785604051610b0e91815260200190565b60405180910390a25b5050505050505050505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60008888888888888888604051602001610b6e989796959493929190611be8565b60405160208183030381529060405280519060200120905098975050505050505050565b7ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783610bbc81610e16565b610bc582610898565b610c2b5760405162461bcd60e51b815260206004820152603160248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e2063616044820152701b9b9bdd0818994818d85b98d95b1b1959607a1b6064820152608401610881565b6000828152600160205260408082208290555183917fbaa1eb22f2a492ba1a5fea61b8df4d27c6c8b5f3971e63bb58fa14ff72eedb7091a25050565b600082815260208190526040902060010154610c8281610e16565b6107f783836111cc565b7fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63610cb8816000610b24565b610cc657610cc68133610f47565b878614610ce55760405162461bcd60e51b815260040161088190611a6d565b878414610d045760405162461bcd60e51b815260040161088190611a6d565b6000610d168a8a8a8a8a8a8a8a610b4d565b9050610d228185610fa0565b60005b89811015610e005760008b8b83818110610d4157610d41611ab0565b9050602002016020810190610d569190611ac6565b905060008a8a84818110610d6c57610d6c611ab0565b9050602002013590503660008a8a86818110610d8a57610d8a611ab0565b9050602002810190610d9c9190611ae1565b91509150610dac8484848461103c565b84867fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b5886868686604051610de39493929190611a3b565b60405180910390a35050505080610df990611b3d565b9050610d25565b50610e0a8161110f565b50505050505050505050565b610e208133610f47565b50565b610e2c826107fc565b15610e915760405162461bcd60e51b815260206004820152602f60248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e20616c60448201526e1c9958591e481cd8da19591d5b1959608a1b6064820152608401610881565b600254811015610ef25760405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a20696e73756666696369656e746044820152652064656c617960d01b6064820152608401610881565b610efc8142611c93565b6000928352600160205260409092209190915550565b60006001600160e01b03198216637965db0b60e01b14806106f157506301ffc9a760e01b6001600160e01b03198316146106f1565b610f518282610b24565b61089457610f5e81611231565b610f69836020611243565b604051602001610f7a929190611cdb565b60408051601f198184030181529082905262461bcd60e51b825261088191600401611d50565b610fa9826107ac565b610fc55760405162461bcd60e51b815260040161088190611d83565b801580610fe15750600081815260016020819052604090912054145b6108945760405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a206d697373696e6720646570656044820152656e64656e637960d01b6064820152608401610881565b6000846001600160a01b0316848484604051611059929190611dcd565b60006040518083038185875af1925050503d8060008114611096576040519150601f19603f3d011682016040523d82523d6000602084013e61109b565b606091505b50509050806111085760405162461bcd60e51b815260206004820152603360248201527f54696d656c6f636b436f6e74726f6c6c65723a20756e6465726c79696e6720746044820152721c985b9cd858dd1a5bdb881c995d995c9d1959606a1b6064820152608401610881565b5050505050565b611118816107ac565b6111345760405162461bcd60e51b815260040161088190611d83565b600090815260016020819052604090912055565b6111528282610b24565b610894576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556111883390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6111d68282610b24565b15610894576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60606106f16001600160a01b03831660145b60606000611252836002611ddd565b61125d906002611c93565b6001600160401b0381111561127457611274611564565b6040519080825280601f01601f19166020018201604052801561129e576020820181803683370190505b509050600360fc1b816000815181106112b9576112b9611ab0565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106112e8576112e8611ab0565b60200101906001600160f81b031916908160001a905350600061130c846002611ddd565b611317906001611c93565b90505b600181111561138f576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061134b5761134b611ab0565b1a60f81b82828151811061136157611361611ab0565b60200101906001600160f81b031916908160001a90535060049490941c9361138881611dfc565b905061131a565b5083156107cb5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610881565b80356001600160a01b03811681146113f557600080fd5b919050565b60008083601f84011261140c57600080fd5b5081356001600160401b0381111561142357600080fd5b60208301915083602082850101111561143b57600080fd5b9250929050565b600080600080600080600060c0888a03121561145d57600080fd5b611466886113de565b96506020880135955060408801356001600160401b0381111561148857600080fd5b6114948a828b016113fa565b989b979a50986060810135976080820135975060a09091013595509350505050565b6000602082840312156114c857600080fd5b81356001600160e01b0319811681146107cb57600080fd5b60008060008060008060a087890312156114f957600080fd5b611502876113de565b95506020870135945060408701356001600160401b0381111561152457600080fd5b61153089828a016113fa565b979a9699509760608101359660809091013595509350505050565b60006020828403121561155d57600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156115a2576115a2611564565b604052919050565b600082601f8301126115bb57600080fd5b81356001600160401b038111156115d4576115d4611564565b6115e7601f8201601f191660200161157a565b8181528460208386010111156115fc57600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561162f57600080fd5b611638856113de565b9350611646602086016113de565b92506040850135915060608501356001600160401b0381111561166857600080fd5b611674878288016115aa565b91505092959194509250565b6000806040838503121561169357600080fd5b823591506116a3602084016113de565b90509250929050565b60008083601f8401126116be57600080fd5b5081356001600160401b038111156116d557600080fd5b6020830191508360208260051b850101111561143b57600080fd5b600080600080600080600080600060c08a8c03121561170e57600080fd5b89356001600160401b038082111561172557600080fd5b6117318d838e016116ac565b909b50995060208c013591508082111561174a57600080fd5b6117568d838e016116ac565b909950975060408c013591508082111561176f57600080fd5b5061177c8c828d016116ac565b9a9d999c50979a969997986060880135976080810135975060a0013595509350505050565b60008060008060008060008060a0898b0312156117bd57600080fd5b88356001600160401b03808211156117d457600080fd5b6117e08c838d016116ac565b909a50985060208b01359150808211156117f957600080fd5b6118058c838d016116ac565b909850965060408b013591508082111561181e57600080fd5b5061182b8b828c016116ac565b999c989b509699959896976060870135966080013595509350505050565b600082601f83011261185a57600080fd5b813560206001600160401b0382111561187557611875611564565b8160051b61188482820161157a565b928352848101820192828101908785111561189e57600080fd5b83870192505b848310156118bd578235825291830191908301906118a4565b979650505050505050565b600080600080600060a086880312156118e057600080fd5b6118e9866113de565b94506118f7602087016113de565b935060408601356001600160401b038082111561191357600080fd5b61191f89838a01611849565b9450606088013591508082111561193557600080fd5b61194189838a01611849565b9350608088013591508082111561195757600080fd5b50611964888289016115aa565b9150509295509295909350565b600080600080600060a0868803121561198957600080fd5b611992866113de565b94506119a0602087016113de565b9350604086013592506060860135915060808601356001600160401b038111156119c957600080fd5b611964888289016115aa565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60018060a01b038716815285602082015260a060408201526000611a2660a0830186886119d5565b60608301949094525060800152949350505050565b60018060a01b0385168152836020820152606060408201526000611a636060830184866119d5565b9695505050505050565b60208082526023908201527f54696d656c6f636b436f6e74726f6c6c65723a206c656e677468206d69736d616040820152620e8c6d60eb1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b600060208284031215611ad857600080fd5b6107cb826113de565b6000808335601e19843603018112611af857600080fd5b8301803591506001600160401b03821115611b1257600080fd5b60200191503681900382131561143b57600080fd5b634e487b7160e01b600052601160045260246000fd5b6000600019821415611b5157611b51611b27565b5060010190565b81835260006020808501808196508560051b810191508460005b87811015611bdb5782840389528135601e19883603018112611b9357600080fd5b870180356001600160401b03811115611bab57600080fd5b803603891315611bba57600080fd5b611bc786828985016119d5565b9a87019a9550505090840190600101611b72565b5091979650505050505050565b60a0808252810188905260008960c08301825b8b811015611c29576001600160a01b03611c14846113de565b16825260209283019290910190600101611bfb565b5083810360208501528881526001600160fb1b03891115611c4957600080fd5b8860051b9150818a602083013781810191505060208101600081526020848303016040850152611c7a81888a611b58565b6060850196909652505050608001529695505050505050565b60008219821115611ca657611ca6611b27565b500190565b60005b83811015611cc6578181015183820152602001611cae565b83811115611cd5576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611d13816017850160208801611cab565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611d44816028840160208801611cab565b01602801949350505050565b6020815260008251806020840152611d6f816040850160208701611cab565b601f01601f19169190910160400192915050565b6020808252602a908201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e206973604082015269206e6f7420726561647960b01b606082015260800190565b8183823760009101908152919050565b6000816000190483118215151615611df757611df7611b27565b500290565b600081611e0b57611e0b611b27565b50600019019056fea2646970667358221220d85472dec2dece809b6a3f314824d3d65f945091a2031d4d8e103af656d0ef8064736f6c634300080900335f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5b09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1d8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63fd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783";

type EarthfastTimelockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EarthfastTimelockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EarthfastTimelock__factory extends ContractFactory {
  constructor(...args: EarthfastTimelockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    minDelay: BigNumberish,
    admins: AddressLike[],
    proposers: AddressLike[],
    executors: AddressLike[],
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      minDelay,
      admins,
      proposers,
      executors,
      overrides || {}
    );
  }
  override deploy(
    minDelay: BigNumberish,
    admins: AddressLike[],
    proposers: AddressLike[],
    executors: AddressLike[],
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      minDelay,
      admins,
      proposers,
      executors,
      overrides || {}
    ) as Promise<
      EarthfastTimelock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EarthfastTimelock__factory {
    return super.connect(runner) as EarthfastTimelock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EarthfastTimelockInterface {
    return new Interface(_abi) as EarthfastTimelockInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EarthfastTimelock {
    return new Contract(address, _abi, runner) as unknown as EarthfastTimelock;
  }
}
