/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export interface BurnMintERC677HelperInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "acceptOwnership"
      | "allowance"
      | "approve"
      | "balanceOf"
      | "burn(uint256)"
      | "burn(address,uint256)"
      | "burnFrom"
      | "decimals"
      | "decreaseAllowance"
      | "decreaseApproval"
      | "drip"
      | "getBurners"
      | "getMinters"
      | "grantBurnRole"
      | "grantMintAndBurnRoles"
      | "grantMintRole"
      | "increaseAllowance"
      | "increaseApproval"
      | "isBurner"
      | "isMinter"
      | "maxSupply"
      | "mint"
      | "name"
      | "owner"
      | "revokeBurnRole"
      | "revokeMintRole"
      | "supportsInterface"
      | "symbol"
      | "totalSupply"
      | "transfer"
      | "transferAndCall"
      | "transferFrom"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "BurnAccessGranted"
      | "BurnAccessRevoked"
      | "MintAccessGranted"
      | "MintAccessRevoked"
      | "OwnershipTransferRequested"
      | "OwnershipTransferred"
      | "Transfer(address,address,uint256,bytes)"
      | "Transfer(address,address,uint256)"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "acceptOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "burn(uint256)",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "burn(address,uint256)",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "burnFrom",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseApproval",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "drip", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "getBurners",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMinters",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "grantBurnRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantMintAndBurnRoles",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantMintRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseApproval",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isBurner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isMinter",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "maxSupply", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "revokeBurnRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeMintRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferAndCall",
    values: [AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "burn(uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burn(address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "burnFrom", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decreaseApproval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "drip", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBurners", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getMinters", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "grantBurnRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "grantMintAndBurnRoles",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "grantMintRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseApproval",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isBurner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isMinter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxSupply", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeBurnRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeMintRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    spender: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [owner: string, spender: string, value: bigint];
  export interface OutputObject {
    owner: string;
    spender: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BurnAccessGrantedEvent {
  export type InputTuple = [burner: AddressLike];
  export type OutputTuple = [burner: string];
  export interface OutputObject {
    burner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BurnAccessRevokedEvent {
  export type InputTuple = [burner: AddressLike];
  export type OutputTuple = [burner: string];
  export interface OutputObject {
    burner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintAccessGrantedEvent {
  export type InputTuple = [minter: AddressLike];
  export type OutputTuple = [minter: string];
  export interface OutputObject {
    minter: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintAccessRevokedEvent {
  export type InputTuple = [minter: AddressLike];
  export type OutputTuple = [minter: string];
  export interface OutputObject {
    minter: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferRequestedEvent {
  export type InputTuple = [from: AddressLike, to: AddressLike];
  export type OutputTuple = [from: string, to: string];
  export interface OutputObject {
    from: string;
    to: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [from: AddressLike, to: AddressLike];
  export type OutputTuple = [from: string, to: string];
  export interface OutputObject {
    from: string;
    to: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace Transfer_address_address_uint256_bytes_Event {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish,
    data: BytesLike
  ];
  export type OutputTuple = [
    from: string,
    to: string,
    value: bigint,
    data: string
  ];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
    data: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace Transfer_address_address_uint256_Event {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    value: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, value: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface BurnMintERC677Helper extends BaseContract {
  connect(runner?: ContractRunner | null): BurnMintERC677Helper;
  waitForDeployment(): Promise<this>;

  interface: BurnMintERC677HelperInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  acceptOwnership: TypedContractMethod<[], [void], "nonpayable">;

  allowance: TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;

  approve: TypedContractMethod<
    [spender: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[account: AddressLike], [bigint], "view">;

  "burn(uint256)": TypedContractMethod<
    [amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  "burn(address,uint256)": TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  burnFrom: TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  decimals: TypedContractMethod<[], [bigint], "view">;

  decreaseAllowance: TypedContractMethod<
    [spender: AddressLike, subtractedValue: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  decreaseApproval: TypedContractMethod<
    [spender: AddressLike, subtractedValue: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  drip: TypedContractMethod<[to: AddressLike], [void], "nonpayable">;

  getBurners: TypedContractMethod<[], [string[]], "view">;

  getMinters: TypedContractMethod<[], [string[]], "view">;

  grantBurnRole: TypedContractMethod<
    [burner: AddressLike],
    [void],
    "nonpayable"
  >;

  grantMintAndBurnRoles: TypedContractMethod<
    [burnAndMinter: AddressLike],
    [void],
    "nonpayable"
  >;

  grantMintRole: TypedContractMethod<
    [minter: AddressLike],
    [void],
    "nonpayable"
  >;

  increaseAllowance: TypedContractMethod<
    [spender: AddressLike, addedValue: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  increaseApproval: TypedContractMethod<
    [spender: AddressLike, addedValue: BigNumberish],
    [void],
    "nonpayable"
  >;

  isBurner: TypedContractMethod<[burner: AddressLike], [boolean], "view">;

  isMinter: TypedContractMethod<[minter: AddressLike], [boolean], "view">;

  maxSupply: TypedContractMethod<[], [bigint], "view">;

  mint: TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  revokeBurnRole: TypedContractMethod<
    [burner: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeMintRole: TypedContractMethod<
    [minter: AddressLike],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transfer: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferAndCall: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish, data: BytesLike],
    [boolean],
    "nonpayable"
  >;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [to: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "acceptOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "allowance"
  ): TypedContractMethod<
    [owner: AddressLike, spender: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [spender: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "burn(uint256)"
  ): TypedContractMethod<[amount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "burn(address,uint256)"
  ): TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "burnFrom"
  ): TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "decimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "decreaseAllowance"
  ): TypedContractMethod<
    [spender: AddressLike, subtractedValue: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "decreaseApproval"
  ): TypedContractMethod<
    [spender: AddressLike, subtractedValue: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "drip"
  ): TypedContractMethod<[to: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getBurners"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getMinters"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "grantBurnRole"
  ): TypedContractMethod<[burner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "grantMintAndBurnRoles"
  ): TypedContractMethod<[burnAndMinter: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "grantMintRole"
  ): TypedContractMethod<[minter: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "increaseAllowance"
  ): TypedContractMethod<
    [spender: AddressLike, addedValue: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "increaseApproval"
  ): TypedContractMethod<
    [spender: AddressLike, addedValue: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "isBurner"
  ): TypedContractMethod<[burner: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isMinter"
  ): TypedContractMethod<[minter: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "maxSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [account: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "revokeBurnRole"
  ): TypedContractMethod<[burner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "revokeMintRole"
  ): TypedContractMethod<[minter: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transfer"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferAndCall"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish, data: BytesLike],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[to: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "BurnAccessGranted"
  ): TypedContractEvent<
    BurnAccessGrantedEvent.InputTuple,
    BurnAccessGrantedEvent.OutputTuple,
    BurnAccessGrantedEvent.OutputObject
  >;
  getEvent(
    key: "BurnAccessRevoked"
  ): TypedContractEvent<
    BurnAccessRevokedEvent.InputTuple,
    BurnAccessRevokedEvent.OutputTuple,
    BurnAccessRevokedEvent.OutputObject
  >;
  getEvent(
    key: "MintAccessGranted"
  ): TypedContractEvent<
    MintAccessGrantedEvent.InputTuple,
    MintAccessGrantedEvent.OutputTuple,
    MintAccessGrantedEvent.OutputObject
  >;
  getEvent(
    key: "MintAccessRevoked"
  ): TypedContractEvent<
    MintAccessRevokedEvent.InputTuple,
    MintAccessRevokedEvent.OutputTuple,
    MintAccessRevokedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferRequested"
  ): TypedContractEvent<
    OwnershipTransferRequestedEvent.InputTuple,
    OwnershipTransferRequestedEvent.OutputTuple,
    OwnershipTransferRequestedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Transfer(address,address,uint256,bytes)"
  ): TypedContractEvent<
    Transfer_address_address_uint256_bytes_Event.InputTuple,
    Transfer_address_address_uint256_bytes_Event.OutputTuple,
    Transfer_address_address_uint256_bytes_Event.OutputObject
  >;
  getEvent(
    key: "Transfer(address,address,uint256)"
  ): TypedContractEvent<
    Transfer_address_address_uint256_Event.InputTuple,
    Transfer_address_address_uint256_Event.OutputTuple,
    Transfer_address_address_uint256_Event.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "BurnAccessGranted(address)": TypedContractEvent<
      BurnAccessGrantedEvent.InputTuple,
      BurnAccessGrantedEvent.OutputTuple,
      BurnAccessGrantedEvent.OutputObject
    >;
    BurnAccessGranted: TypedContractEvent<
      BurnAccessGrantedEvent.InputTuple,
      BurnAccessGrantedEvent.OutputTuple,
      BurnAccessGrantedEvent.OutputObject
    >;

    "BurnAccessRevoked(address)": TypedContractEvent<
      BurnAccessRevokedEvent.InputTuple,
      BurnAccessRevokedEvent.OutputTuple,
      BurnAccessRevokedEvent.OutputObject
    >;
    BurnAccessRevoked: TypedContractEvent<
      BurnAccessRevokedEvent.InputTuple,
      BurnAccessRevokedEvent.OutputTuple,
      BurnAccessRevokedEvent.OutputObject
    >;

    "MintAccessGranted(address)": TypedContractEvent<
      MintAccessGrantedEvent.InputTuple,
      MintAccessGrantedEvent.OutputTuple,
      MintAccessGrantedEvent.OutputObject
    >;
    MintAccessGranted: TypedContractEvent<
      MintAccessGrantedEvent.InputTuple,
      MintAccessGrantedEvent.OutputTuple,
      MintAccessGrantedEvent.OutputObject
    >;

    "MintAccessRevoked(address)": TypedContractEvent<
      MintAccessRevokedEvent.InputTuple,
      MintAccessRevokedEvent.OutputTuple,
      MintAccessRevokedEvent.OutputObject
    >;
    MintAccessRevoked: TypedContractEvent<
      MintAccessRevokedEvent.InputTuple,
      MintAccessRevokedEvent.OutputTuple,
      MintAccessRevokedEvent.OutputObject
    >;

    "OwnershipTransferRequested(address,address)": TypedContractEvent<
      OwnershipTransferRequestedEvent.InputTuple,
      OwnershipTransferRequestedEvent.OutputTuple,
      OwnershipTransferRequestedEvent.OutputObject
    >;
    OwnershipTransferRequested: TypedContractEvent<
      OwnershipTransferRequestedEvent.InputTuple,
      OwnershipTransferRequestedEvent.OutputTuple,
      OwnershipTransferRequestedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Transfer(address,address,uint256,bytes)": TypedContractEvent<
      Transfer_address_address_uint256_bytes_Event.InputTuple,
      Transfer_address_address_uint256_bytes_Event.OutputTuple,
      Transfer_address_address_uint256_bytes_Event.OutputObject
    >;
    "Transfer(address,address,uint256)": TypedContractEvent<
      Transfer_address_address_uint256_Event.InputTuple,
      Transfer_address_address_uint256_Event.OutputTuple,
      Transfer_address_address_uint256_Event.OutputObject
    >;
  };
}
