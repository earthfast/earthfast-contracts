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
} from "../common";

export type EarthfastOperatorStruct = {
  id: BytesLike;
  owner: AddressLike;
  name: string;
  email: string;
  stake: BigNumberish;
  balance: BigNumberish;
};

export type EarthfastOperatorStructOutput = [
  id: string,
  owner: string,
  name: string,
  email: string,
  stake: bigint,
  balance: bigint
] & {
  id: string;
  owner: string;
  name: string;
  email: string;
  stake: bigint;
  balance: bigint;
};

export interface EarthfastOperatorsInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DEFAULT_ADMIN_ROLE"
      | "IMPORTER_ROLE"
      | "createOperator"
      | "deleteOperator"
      | "depositOperatorBalance"
      | "depositOperatorStake"
      | "getOperator"
      | "getOperatorCount"
      | "getOperators"
      | "getRegistry"
      | "getRoleAdmin"
      | "getStakePerNode"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "pause"
      | "paused"
      | "proxiableUUID"
      | "renounceRole"
      | "revokeRole"
      | "setOperatorBalanceImpl"
      | "setOperatorOwner"
      | "setOperatorProps"
      | "setStakePerNode"
      | "supportsInterface"
      | "unpause"
      | "unsafeImportData"
      | "unsafeSetBalances"
      | "unsafeSetRegistry"
      | "upgradeTo"
      | "upgradeToAndCall"
      | "withdrawOperatorBalance"
      | "withdrawOperatorStake"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "Initialized"
      | "OperatorBalanceChanged"
      | "OperatorCreated"
      | "OperatorDeleted"
      | "OperatorOwnerChanged"
      | "OperatorPropsChanged"
      | "OperatorStakeChanged"
      | "Paused"
      | "RoleAdminChanged"
      | "RoleGranted"
      | "RoleRevoked"
      | "Unpaused"
      | "Upgraded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "IMPORTER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "createOperator",
    values: [AddressLike, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteOperator",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "depositOperatorBalance",
    values: [
      BytesLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "depositOperatorStake",
    values: [
      BytesLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getOperator",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOperatorCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOperators",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getStakePerNode",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike[], AddressLike, BigNumberish, boolean]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOperatorBalanceImpl",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setOperatorOwner",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOperatorProps",
    values: [BytesLike, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setStakePerNode",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unsafeImportData",
    values: [EarthfastOperatorStruct[], boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "unsafeSetBalances",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "unsafeSetRegistry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawOperatorBalance",
    values: [BytesLike, BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawOperatorStake",
    values: [BytesLike, BigNumberish, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "IMPORTER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositOperatorBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositOperatorStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperatorCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperators",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStakePerNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setOperatorBalanceImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOperatorOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOperatorProps",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStakePerNode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "unsafeImportData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsafeSetBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsafeSetRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawOperatorBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawOperatorStake",
    data: BytesLike
  ): Result;
}

export namespace AdminChangedEvent {
  export type InputTuple = [previousAdmin: AddressLike, newAdmin: AddressLike];
  export type OutputTuple = [previousAdmin: string, newAdmin: string];
  export interface OutputObject {
    previousAdmin: string;
    newAdmin: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BeaconUpgradedEvent {
  export type InputTuple = [beacon: AddressLike];
  export type OutputTuple = [beacon: string];
  export interface OutputObject {
    beacon: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorBalanceChangedEvent {
  export type InputTuple = [
    operatorId: BytesLike,
    oldBalance: BigNumberish,
    newBalance: BigNumberish
  ];
  export type OutputTuple = [
    operatorId: string,
    oldBalance: bigint,
    newBalance: bigint
  ];
  export interface OutputObject {
    operatorId: string;
    oldBalance: bigint;
    newBalance: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorCreatedEvent {
  export type InputTuple = [
    operatorId: BytesLike,
    owner: AddressLike,
    name: string,
    email: string
  ];
  export type OutputTuple = [
    operatorId: string,
    owner: string,
    name: string,
    email: string
  ];
  export interface OutputObject {
    operatorId: string;
    owner: string;
    name: string;
    email: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorDeletedEvent {
  export type InputTuple = [
    operatorId: BytesLike,
    owner: AddressLike,
    name: string,
    email: string
  ];
  export type OutputTuple = [
    operatorId: string,
    owner: string,
    name: string,
    email: string
  ];
  export interface OutputObject {
    operatorId: string;
    owner: string;
    name: string;
    email: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorOwnerChangedEvent {
  export type InputTuple = [
    operatorId: BytesLike,
    oldOwner: AddressLike,
    newOwner: AddressLike
  ];
  export type OutputTuple = [
    operatorId: string,
    oldOwner: string,
    newOwner: string
  ];
  export interface OutputObject {
    operatorId: string;
    oldOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorPropsChangedEvent {
  export type InputTuple = [
    operatorId: BytesLike,
    oldName: string,
    oldEmail: string,
    newName: string,
    newEmail: string
  ];
  export type OutputTuple = [
    operatorId: string,
    oldName: string,
    oldEmail: string,
    newName: string,
    newEmail: string
  ];
  export interface OutputObject {
    operatorId: string;
    oldName: string;
    oldEmail: string;
    newName: string;
    newEmail: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OperatorStakeChangedEvent {
  export type InputTuple = [
    operatorId: BytesLike,
    oldStake: BigNumberish,
    newStake: BigNumberish
  ];
  export type OutputTuple = [
    operatorId: string,
    oldStake: bigint,
    newStake: bigint
  ];
  export interface OutputObject {
    operatorId: string;
    oldStake: bigint;
    newStake: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface EarthfastOperators extends BaseContract {
  connect(runner?: ContractRunner | null): EarthfastOperators;
  waitForDeployment(): Promise<this>;

  interface: EarthfastOperatorsInterface;

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

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  IMPORTER_ROLE: TypedContractMethod<[], [string], "view">;

  createOperator: TypedContractMethod<
    [owner: AddressLike, name: string, email: string],
    [string],
    "nonpayable"
  >;

  deleteOperator: TypedContractMethod<
    [operatorId: BytesLike],
    [void],
    "nonpayable"
  >;

  depositOperatorBalance: TypedContractMethod<
    [
      operatorId: BytesLike,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  depositOperatorStake: TypedContractMethod<
    [
      operatorId: BytesLike,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  getOperator: TypedContractMethod<
    [operatorId: BytesLike],
    [EarthfastOperatorStructOutput],
    "view"
  >;

  getOperatorCount: TypedContractMethod<[], [bigint], "view">;

  getOperators: TypedContractMethod<
    [skip: BigNumberish, size: BigNumberish],
    [EarthfastOperatorStructOutput[]],
    "view"
  >;

  getRegistry: TypedContractMethod<[], [string], "view">;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  getStakePerNode: TypedContractMethod<[], [bigint], "view">;

  grantRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;

  initialize: TypedContractMethod<
    [
      admins: AddressLike[],
      registry: AddressLike,
      stakePerNode: BigNumberish,
      grantImporterRole: boolean
    ],
    [void],
    "nonpayable"
  >;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  renounceRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  setOperatorBalanceImpl: TypedContractMethod<
    [operatorId: BytesLike, decrease: BigNumberish, increase: BigNumberish],
    [void],
    "nonpayable"
  >;

  setOperatorOwner: TypedContractMethod<
    [operatorId: BytesLike, owner: AddressLike],
    [void],
    "nonpayable"
  >;

  setOperatorProps: TypedContractMethod<
    [operatorId: BytesLike, name: string, email: string],
    [void],
    "nonpayable"
  >;

  setStakePerNode: TypedContractMethod<
    [stake: BigNumberish],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  unsafeImportData: TypedContractMethod<
    [operators: EarthfastOperatorStruct[], revokeImporterRole: boolean],
    [void],
    "nonpayable"
  >;

  unsafeSetBalances: TypedContractMethod<
    [
      skip: BigNumberish,
      size: BigNumberish,
      mul: BigNumberish,
      div: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  unsafeSetRegistry: TypedContractMethod<
    [registry: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeTo: TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  withdrawOperatorBalance: TypedContractMethod<
    [operatorId: BytesLike, amount: BigNumberish, to: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawOperatorStake: TypedContractMethod<
    [operatorId: BytesLike, amount: BigNumberish, to: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "IMPORTER_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "createOperator"
  ): TypedContractMethod<
    [owner: AddressLike, name: string, email: string],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deleteOperator"
  ): TypedContractMethod<[operatorId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "depositOperatorBalance"
  ): TypedContractMethod<
    [
      operatorId: BytesLike,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositOperatorStake"
  ): TypedContractMethod<
    [
      operatorId: BytesLike,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getOperator"
  ): TypedContractMethod<
    [operatorId: BytesLike],
    [EarthfastOperatorStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getOperatorCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getOperators"
  ): TypedContractMethod<
    [skip: BigNumberish, size: BigNumberish],
    [EarthfastOperatorStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getStakePerNode"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "grantRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      admins: AddressLike[],
      registry: AddressLike,
      stakePerNode: BigNumberish,
      grantImporterRole: boolean
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setOperatorBalanceImpl"
  ): TypedContractMethod<
    [operatorId: BytesLike, decrease: BigNumberish, increase: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setOperatorOwner"
  ): TypedContractMethod<
    [operatorId: BytesLike, owner: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setOperatorProps"
  ): TypedContractMethod<
    [operatorId: BytesLike, name: string, email: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setStakePerNode"
  ): TypedContractMethod<[stake: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unsafeImportData"
  ): TypedContractMethod<
    [operators: EarthfastOperatorStruct[], revokeImporterRole: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unsafeSetBalances"
  ): TypedContractMethod<
    [
      skip: BigNumberish,
      size: BigNumberish,
      mul: BigNumberish,
      div: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unsafeSetRegistry"
  ): TypedContractMethod<[registry: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeTo"
  ): TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdrawOperatorBalance"
  ): TypedContractMethod<
    [operatorId: BytesLike, amount: BigNumberish, to: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawOperatorStake"
  ): TypedContractMethod<
    [operatorId: BytesLike, amount: BigNumberish, to: AddressLike],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "AdminChanged"
  ): TypedContractEvent<
    AdminChangedEvent.InputTuple,
    AdminChangedEvent.OutputTuple,
    AdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "BeaconUpgraded"
  ): TypedContractEvent<
    BeaconUpgradedEvent.InputTuple,
    BeaconUpgradedEvent.OutputTuple,
    BeaconUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorBalanceChanged"
  ): TypedContractEvent<
    OperatorBalanceChangedEvent.InputTuple,
    OperatorBalanceChangedEvent.OutputTuple,
    OperatorBalanceChangedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorCreated"
  ): TypedContractEvent<
    OperatorCreatedEvent.InputTuple,
    OperatorCreatedEvent.OutputTuple,
    OperatorCreatedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorDeleted"
  ): TypedContractEvent<
    OperatorDeletedEvent.InputTuple,
    OperatorDeletedEvent.OutputTuple,
    OperatorDeletedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorOwnerChanged"
  ): TypedContractEvent<
    OperatorOwnerChangedEvent.InputTuple,
    OperatorOwnerChangedEvent.OutputTuple,
    OperatorOwnerChangedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorPropsChanged"
  ): TypedContractEvent<
    OperatorPropsChangedEvent.InputTuple,
    OperatorPropsChangedEvent.OutputTuple,
    OperatorPropsChangedEvent.OutputObject
  >;
  getEvent(
    key: "OperatorStakeChanged"
  ): TypedContractEvent<
    OperatorStakeChangedEvent.InputTuple,
    OperatorStakeChangedEvent.OutputTuple,
    OperatorStakeChangedEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "RoleAdminChanged"
  ): TypedContractEvent<
    RoleAdminChangedEvent.InputTuple,
    RoleAdminChangedEvent.OutputTuple,
    RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;

  filters: {
    "AdminChanged(address,address)": TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;
    AdminChanged: TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;

    "BeaconUpgraded(address)": TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;
    BeaconUpgraded: TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OperatorBalanceChanged(bytes32,uint256,uint256)": TypedContractEvent<
      OperatorBalanceChangedEvent.InputTuple,
      OperatorBalanceChangedEvent.OutputTuple,
      OperatorBalanceChangedEvent.OutputObject
    >;
    OperatorBalanceChanged: TypedContractEvent<
      OperatorBalanceChangedEvent.InputTuple,
      OperatorBalanceChangedEvent.OutputTuple,
      OperatorBalanceChangedEvent.OutputObject
    >;

    "OperatorCreated(bytes32,address,string,string)": TypedContractEvent<
      OperatorCreatedEvent.InputTuple,
      OperatorCreatedEvent.OutputTuple,
      OperatorCreatedEvent.OutputObject
    >;
    OperatorCreated: TypedContractEvent<
      OperatorCreatedEvent.InputTuple,
      OperatorCreatedEvent.OutputTuple,
      OperatorCreatedEvent.OutputObject
    >;

    "OperatorDeleted(bytes32,address,string,string)": TypedContractEvent<
      OperatorDeletedEvent.InputTuple,
      OperatorDeletedEvent.OutputTuple,
      OperatorDeletedEvent.OutputObject
    >;
    OperatorDeleted: TypedContractEvent<
      OperatorDeletedEvent.InputTuple,
      OperatorDeletedEvent.OutputTuple,
      OperatorDeletedEvent.OutputObject
    >;

    "OperatorOwnerChanged(bytes32,address,address)": TypedContractEvent<
      OperatorOwnerChangedEvent.InputTuple,
      OperatorOwnerChangedEvent.OutputTuple,
      OperatorOwnerChangedEvent.OutputObject
    >;
    OperatorOwnerChanged: TypedContractEvent<
      OperatorOwnerChangedEvent.InputTuple,
      OperatorOwnerChangedEvent.OutputTuple,
      OperatorOwnerChangedEvent.OutputObject
    >;

    "OperatorPropsChanged(bytes32,string,string,string,string)": TypedContractEvent<
      OperatorPropsChangedEvent.InputTuple,
      OperatorPropsChangedEvent.OutputTuple,
      OperatorPropsChangedEvent.OutputObject
    >;
    OperatorPropsChanged: TypedContractEvent<
      OperatorPropsChangedEvent.InputTuple,
      OperatorPropsChangedEvent.OutputTuple,
      OperatorPropsChangedEvent.OutputObject
    >;

    "OperatorStakeChanged(bytes32,uint256,uint256)": TypedContractEvent<
      OperatorStakeChangedEvent.InputTuple,
      OperatorStakeChangedEvent.OutputTuple,
      OperatorStakeChangedEvent.OutputObject
    >;
    OperatorStakeChanged: TypedContractEvent<
      OperatorStakeChangedEvent.InputTuple,
      OperatorStakeChangedEvent.OutputTuple,
      OperatorStakeChangedEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
  };
}
