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

export type EarthfastSlotStruct = { last: boolean; next: boolean };

export type EarthfastSlotStructOutput = [last: boolean, next: boolean] & {
  last: boolean;
  next: boolean;
};

export type EarthfastCreateNodeDataStruct = {
  host: string;
  region: string;
  disabled: boolean;
  price: BigNumberish;
};

export type EarthfastCreateNodeDataStructOutput = [
  host: string,
  region: string,
  disabled: boolean,
  price: bigint
] & { host: string; region: string; disabled: boolean; price: bigint };

export type EarthfastNodeStruct = {
  id: BytesLike;
  operatorId: BytesLike;
  host: string;
  region: string;
  disabled: boolean;
  prices: [BigNumberish, BigNumberish];
  projectIds: [BytesLike, BytesLike];
};

export type EarthfastNodeStructOutput = [
  id: string,
  operatorId: string,
  host: string,
  region: string,
  disabled: boolean,
  prices: [bigint, bigint],
  projectIds: [string, string]
] & {
  id: string;
  operatorId: string;
  host: string;
  region: string;
  disabled: boolean;
  prices: [bigint, bigint];
  projectIds: [string, string];
};

export interface EarthfastNodesV2Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "DEFAULT_ADMIN_ROLE"
      | "IMPORTER_ROLE"
      | "advanceNodeEpochImpl"
      | "createNodes"
      | "deleteNodes"
      | "getNode"
      | "getNodeCount"
      | "getNodes"
      | "getRegistry"
      | "getRoleAdmin"
      | "getTest"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "pause"
      | "paused"
      | "proxiableUUID"
      | "renounceRole"
      | "revokeRole"
      | "setNodeDisabled"
      | "setNodeHosts"
      | "setNodePriceImpl"
      | "setNodePrices"
      | "setNodeProjectImpl"
      | "setTest"
      | "supportsInterface"
      | "unpause"
      | "unsafeImportData"
      | "unsafeSetPrices"
      | "unsafeSetRegistry"
      | "upgradeTo"
      | "upgradeToAndCall"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "Initialized"
      | "NodeCreated"
      | "NodeDeleted"
      | "NodeDisabledChanged"
      | "NodeHostChanged"
      | "NodePriceChanged"
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
    functionFragment: "advanceNodeEpochImpl",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createNodes",
    values: [BytesLike, EarthfastCreateNodeDataStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteNodes",
    values: [BytesLike, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "getNode", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getNodeCount",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getNodes",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "getTest", values?: undefined): string;
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
    values: [AddressLike[], AddressLike, boolean]
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
    functionFragment: "setNodeDisabled",
    values: [BytesLike, BytesLike[], boolean[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setNodeHosts",
    values: [BytesLike, BytesLike[], string[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setNodePriceImpl",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setNodePrices",
    values: [BytesLike, BytesLike[], BigNumberish[], EarthfastSlotStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setNodeProjectImpl",
    values: [BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setTest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unsafeImportData",
    values: [EarthfastNodeStruct[], boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "unsafeSetPrices",
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

  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "IMPORTER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "advanceNodeEpochImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createNodes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteNodes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getNode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getNodeCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getNodes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTest", data: BytesLike): Result;
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
    functionFragment: "setNodeDisabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNodeHosts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNodePriceImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNodePrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setNodeProjectImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setTest", data: BytesLike): Result;
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
    functionFragment: "unsafeSetPrices",
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

export namespace NodeCreatedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    operatorId: BytesLike,
    host: string,
    region: string,
    disabled: boolean,
    price: BigNumberish
  ];
  export type OutputTuple = [
    nodeId: string,
    operatorId: string,
    host: string,
    region: string,
    disabled: boolean,
    price: bigint
  ];
  export interface OutputObject {
    nodeId: string;
    operatorId: string;
    host: string;
    region: string;
    disabled: boolean;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NodeDeletedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    operatorId: BytesLike,
    host: string,
    region: string,
    disabled: boolean,
    price: BigNumberish
  ];
  export type OutputTuple = [
    nodeId: string,
    operatorId: string,
    host: string,
    region: string,
    disabled: boolean,
    price: bigint
  ];
  export interface OutputObject {
    nodeId: string;
    operatorId: string;
    host: string;
    region: string;
    disabled: boolean;
    price: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NodeDisabledChangedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    oldDisabled: boolean,
    newDisabled: boolean
  ];
  export type OutputTuple = [
    nodeId: string,
    oldDisabled: boolean,
    newDisabled: boolean
  ];
  export interface OutputObject {
    nodeId: string;
    oldDisabled: boolean;
    newDisabled: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NodeHostChangedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    oldHost: string,
    oldRegion: string,
    newHost: string,
    newRegion: string
  ];
  export type OutputTuple = [
    nodeId: string,
    oldHost: string,
    oldRegion: string,
    newHost: string,
    newRegion: string
  ];
  export interface OutputObject {
    nodeId: string;
    oldHost: string;
    oldRegion: string;
    newHost: string;
    newRegion: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NodePriceChangedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    oldLastPrice: BigNumberish,
    oldNextPrice: BigNumberish,
    newPrice: BigNumberish,
    slot: EarthfastSlotStruct
  ];
  export type OutputTuple = [
    nodeId: string,
    oldLastPrice: bigint,
    oldNextPrice: bigint,
    newPrice: bigint,
    slot: EarthfastSlotStructOutput
  ];
  export interface OutputObject {
    nodeId: string;
    oldLastPrice: bigint;
    oldNextPrice: bigint;
    newPrice: bigint;
    slot: EarthfastSlotStructOutput;
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

export interface EarthfastNodesV2 extends BaseContract {
  connect(runner?: ContractRunner | null): EarthfastNodesV2;
  waitForDeployment(): Promise<this>;

  interface: EarthfastNodesV2Interface;

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

  advanceNodeEpochImpl: TypedContractMethod<
    [nodeId: BytesLike],
    [void],
    "nonpayable"
  >;

  createNodes: TypedContractMethod<
    [operatorId: BytesLike, nodes: EarthfastCreateNodeDataStruct[]],
    [string[]],
    "nonpayable"
  >;

  deleteNodes: TypedContractMethod<
    [operatorId: BytesLike, nodeIds: BytesLike[]],
    [void],
    "nonpayable"
  >;

  getNode: TypedContractMethod<
    [nodeId: BytesLike],
    [EarthfastNodeStructOutput],
    "view"
  >;

  getNodeCount: TypedContractMethod<
    [operatorIdOrZero: BytesLike],
    [bigint],
    "view"
  >;

  getNodes: TypedContractMethod<
    [operatorIdOrZero: BytesLike, skip: BigNumberish, size: BigNumberish],
    [EarthfastNodeStructOutput[]],
    "view"
  >;

  getRegistry: TypedContractMethod<[], [string], "view">;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  getTest: TypedContractMethod<[], [bigint], "view">;

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
    [admins: AddressLike[], registry: AddressLike, grantImporterRole: boolean],
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

  setNodeDisabled: TypedContractMethod<
    [operatorId: BytesLike, nodeIds: BytesLike[], disabled: boolean[]],
    [void],
    "nonpayable"
  >;

  setNodeHosts: TypedContractMethod<
    [
      operatorId: BytesLike,
      nodeIds: BytesLike[],
      hosts: string[],
      regions: string[]
    ],
    [void],
    "nonpayable"
  >;

  setNodePriceImpl: TypedContractMethod<
    [nodeId: BytesLike, epochSlot: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;

  setNodePrices: TypedContractMethod<
    [
      operatorId: BytesLike,
      nodeIds: BytesLike[],
      prices: BigNumberish[],
      slot: EarthfastSlotStruct
    ],
    [void],
    "nonpayable"
  >;

  setNodeProjectImpl: TypedContractMethod<
    [nodeId: BytesLike, epochSlot: BigNumberish, projectId: BytesLike],
    [void],
    "nonpayable"
  >;

  setTest: TypedContractMethod<[newTest: BigNumberish], [void], "nonpayable">;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  unsafeImportData: TypedContractMethod<
    [nodes: EarthfastNodeStruct[], revokeImporterRole: boolean],
    [void],
    "nonpayable"
  >;

  unsafeSetPrices: TypedContractMethod<
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
    nameOrSignature: "advanceNodeEpochImpl"
  ): TypedContractMethod<[nodeId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createNodes"
  ): TypedContractMethod<
    [operatorId: BytesLike, nodes: EarthfastCreateNodeDataStruct[]],
    [string[]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deleteNodes"
  ): TypedContractMethod<
    [operatorId: BytesLike, nodeIds: BytesLike[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getNode"
  ): TypedContractMethod<
    [nodeId: BytesLike],
    [EarthfastNodeStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getNodeCount"
  ): TypedContractMethod<[operatorIdOrZero: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getNodes"
  ): TypedContractMethod<
    [operatorIdOrZero: BytesLike, skip: BigNumberish, size: BigNumberish],
    [EarthfastNodeStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getTest"
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
    [admins: AddressLike[], registry: AddressLike, grantImporterRole: boolean],
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
    nameOrSignature: "setNodeDisabled"
  ): TypedContractMethod<
    [operatorId: BytesLike, nodeIds: BytesLike[], disabled: boolean[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setNodeHosts"
  ): TypedContractMethod<
    [
      operatorId: BytesLike,
      nodeIds: BytesLike[],
      hosts: string[],
      regions: string[]
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setNodePriceImpl"
  ): TypedContractMethod<
    [nodeId: BytesLike, epochSlot: BigNumberish, price: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setNodePrices"
  ): TypedContractMethod<
    [
      operatorId: BytesLike,
      nodeIds: BytesLike[],
      prices: BigNumberish[],
      slot: EarthfastSlotStruct
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setNodeProjectImpl"
  ): TypedContractMethod<
    [nodeId: BytesLike, epochSlot: BigNumberish, projectId: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setTest"
  ): TypedContractMethod<[newTest: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unsafeImportData"
  ): TypedContractMethod<
    [nodes: EarthfastNodeStruct[], revokeImporterRole: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "unsafeSetPrices"
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
    key: "NodeCreated"
  ): TypedContractEvent<
    NodeCreatedEvent.InputTuple,
    NodeCreatedEvent.OutputTuple,
    NodeCreatedEvent.OutputObject
  >;
  getEvent(
    key: "NodeDeleted"
  ): TypedContractEvent<
    NodeDeletedEvent.InputTuple,
    NodeDeletedEvent.OutputTuple,
    NodeDeletedEvent.OutputObject
  >;
  getEvent(
    key: "NodeDisabledChanged"
  ): TypedContractEvent<
    NodeDisabledChangedEvent.InputTuple,
    NodeDisabledChangedEvent.OutputTuple,
    NodeDisabledChangedEvent.OutputObject
  >;
  getEvent(
    key: "NodeHostChanged"
  ): TypedContractEvent<
    NodeHostChangedEvent.InputTuple,
    NodeHostChangedEvent.OutputTuple,
    NodeHostChangedEvent.OutputObject
  >;
  getEvent(
    key: "NodePriceChanged"
  ): TypedContractEvent<
    NodePriceChangedEvent.InputTuple,
    NodePriceChangedEvent.OutputTuple,
    NodePriceChangedEvent.OutputObject
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

    "NodeCreated(bytes32,bytes32,string,string,bool,uint256)": TypedContractEvent<
      NodeCreatedEvent.InputTuple,
      NodeCreatedEvent.OutputTuple,
      NodeCreatedEvent.OutputObject
    >;
    NodeCreated: TypedContractEvent<
      NodeCreatedEvent.InputTuple,
      NodeCreatedEvent.OutputTuple,
      NodeCreatedEvent.OutputObject
    >;

    "NodeDeleted(bytes32,bytes32,string,string,bool,uint256)": TypedContractEvent<
      NodeDeletedEvent.InputTuple,
      NodeDeletedEvent.OutputTuple,
      NodeDeletedEvent.OutputObject
    >;
    NodeDeleted: TypedContractEvent<
      NodeDeletedEvent.InputTuple,
      NodeDeletedEvent.OutputTuple,
      NodeDeletedEvent.OutputObject
    >;

    "NodeDisabledChanged(bytes32,bool,bool)": TypedContractEvent<
      NodeDisabledChangedEvent.InputTuple,
      NodeDisabledChangedEvent.OutputTuple,
      NodeDisabledChangedEvent.OutputObject
    >;
    NodeDisabledChanged: TypedContractEvent<
      NodeDisabledChangedEvent.InputTuple,
      NodeDisabledChangedEvent.OutputTuple,
      NodeDisabledChangedEvent.OutputObject
    >;

    "NodeHostChanged(bytes32,string,string,string,string)": TypedContractEvent<
      NodeHostChangedEvent.InputTuple,
      NodeHostChangedEvent.OutputTuple,
      NodeHostChangedEvent.OutputObject
    >;
    NodeHostChanged: TypedContractEvent<
      NodeHostChangedEvent.InputTuple,
      NodeHostChangedEvent.OutputTuple,
      NodeHostChangedEvent.OutputObject
    >;

    "NodePriceChanged(bytes32,uint256,uint256,uint256,tuple)": TypedContractEvent<
      NodePriceChangedEvent.InputTuple,
      NodePriceChangedEvent.OutputTuple,
      NodePriceChangedEvent.OutputObject
    >;
    NodePriceChanged: TypedContractEvent<
      NodePriceChangedEvent.InputTuple,
      NodePriceChangedEvent.OutputTuple,
      NodePriceChangedEvent.OutputObject
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
