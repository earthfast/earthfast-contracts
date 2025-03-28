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

export interface EarthfastReservationsInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "DEFAULT_ADMIN_ROLE"
      | "IMPORTER_ROLE"
      | "authorizeEntrypoint"
      | "createReservations"
      | "deleteReservationImpl"
      | "deleteReservations"
      | "getRegistry"
      | "getReservationCount"
      | "getReservations"
      | "getRoleAdmin"
      | "grantRole"
      | "hasRole"
      | "initialize"
      | "isAuthorizedEntrypoint"
      | "pause"
      | "paused"
      | "proxiableUUID"
      | "removeProjectNodeIdImpl"
      | "renounceRole"
      | "revokeEntrypoint"
      | "revokeRole"
      | "supportsInterface"
      | "unpause"
      | "unsafeImportData"
      | "unsafeSetRegistry"
      | "upgradeTo"
      | "upgradeToAndCall"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "Initialized"
      | "Paused"
      | "ReservationCreated"
      | "ReservationDeleted"
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
    functionFragment: "authorizeEntrypoint",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createReservations",
    values: [BytesLike, BytesLike[], BigNumberish[], EarthfastSlotStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteReservationImpl",
    values: [
      AddressLike,
      AddressLike,
      BytesLike,
      BytesLike,
      EarthfastSlotStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteReservations",
    values: [BytesLike, BytesLike[], EarthfastSlotStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getReservationCount",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getReservations",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
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
    values: [AddressLike[], AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "isAuthorizedEntrypoint",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeProjectNodeIdImpl",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeEntrypoint",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
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
    functionFragment: "authorizeEntrypoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createReservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteReservationImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteReservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReservationCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReservations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isAuthorizedEntrypoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeProjectNodeIdImpl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeEntrypoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
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

export namespace ReservationCreatedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    operatorId: BytesLike,
    projectId: BytesLike,
    lastPrice: BigNumberish,
    nextPrice: BigNumberish,
    slot: EarthfastSlotStruct
  ];
  export type OutputTuple = [
    nodeId: string,
    operatorId: string,
    projectId: string,
    lastPrice: bigint,
    nextPrice: bigint,
    slot: EarthfastSlotStructOutput
  ];
  export interface OutputObject {
    nodeId: string;
    operatorId: string;
    projectId: string;
    lastPrice: bigint;
    nextPrice: bigint;
    slot: EarthfastSlotStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ReservationDeletedEvent {
  export type InputTuple = [
    nodeId: BytesLike,
    operatorId: BytesLike,
    projectId: BytesLike,
    lastPrice: BigNumberish,
    nextPrice: BigNumberish,
    slot: EarthfastSlotStruct
  ];
  export type OutputTuple = [
    nodeId: string,
    operatorId: string,
    projectId: string,
    lastPrice: bigint,
    nextPrice: bigint,
    slot: EarthfastSlotStructOutput
  ];
  export interface OutputObject {
    nodeId: string;
    operatorId: string;
    projectId: string;
    lastPrice: bigint;
    nextPrice: bigint;
    slot: EarthfastSlotStructOutput;
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

export interface EarthfastReservations extends BaseContract {
  connect(runner?: ContractRunner | null): EarthfastReservations;
  waitForDeployment(): Promise<this>;

  interface: EarthfastReservationsInterface;

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

  authorizeEntrypoint: TypedContractMethod<
    [entrypoint: AddressLike],
    [void],
    "nonpayable"
  >;

  createReservations: TypedContractMethod<
    [
      projectId: BytesLike,
      nodeIds: BytesLike[],
      maxPrices: BigNumberish[],
      slot: EarthfastSlotStruct
    ],
    [void],
    "nonpayable"
  >;

  deleteReservationImpl: TypedContractMethod<
    [
      allNodes: AddressLike,
      projects: AddressLike,
      projectId: BytesLike,
      nodeId: BytesLike,
      slot: EarthfastSlotStruct
    ],
    [void],
    "nonpayable"
  >;

  deleteReservations: TypedContractMethod<
    [projectId: BytesLike, nodeIds: BytesLike[], slot: EarthfastSlotStruct],
    [void],
    "nonpayable"
  >;

  getRegistry: TypedContractMethod<[], [string], "view">;

  getReservationCount: TypedContractMethod<
    [projectId: BytesLike],
    [bigint],
    "view"
  >;

  getReservations: TypedContractMethod<
    [projectId: BytesLike, skip: BigNumberish, size: BigNumberish],
    [EarthfastNodeStructOutput[]],
    "view"
  >;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

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

  isAuthorizedEntrypoint: TypedContractMethod<
    [entrypoint: AddressLike],
    [boolean],
    "view"
  >;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  removeProjectNodeIdImpl: TypedContractMethod<
    [projectId: BytesLike, nodeId: BytesLike],
    [boolean],
    "nonpayable"
  >;

  renounceRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeEntrypoint: TypedContractMethod<
    [entrypoint: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
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
    [nodes: EarthfastNodeStruct[], revokeImporterRole: boolean],
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
    nameOrSignature: "authorizeEntrypoint"
  ): TypedContractMethod<[entrypoint: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createReservations"
  ): TypedContractMethod<
    [
      projectId: BytesLike,
      nodeIds: BytesLike[],
      maxPrices: BigNumberish[],
      slot: EarthfastSlotStruct
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deleteReservationImpl"
  ): TypedContractMethod<
    [
      allNodes: AddressLike,
      projects: AddressLike,
      projectId: BytesLike,
      nodeId: BytesLike,
      slot: EarthfastSlotStruct
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deleteReservations"
  ): TypedContractMethod<
    [projectId: BytesLike, nodeIds: BytesLike[], slot: EarthfastSlotStruct],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getReservationCount"
  ): TypedContractMethod<[projectId: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getReservations"
  ): TypedContractMethod<
    [projectId: BytesLike, skip: BigNumberish, size: BigNumberish],
    [EarthfastNodeStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
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
    nameOrSignature: "isAuthorizedEntrypoint"
  ): TypedContractMethod<[entrypoint: AddressLike], [boolean], "view">;
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
    nameOrSignature: "removeProjectNodeIdImpl"
  ): TypedContractMethod<
    [projectId: BytesLike, nodeId: BytesLike],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeEntrypoint"
  ): TypedContractMethod<[entrypoint: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
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
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "ReservationCreated"
  ): TypedContractEvent<
    ReservationCreatedEvent.InputTuple,
    ReservationCreatedEvent.OutputTuple,
    ReservationCreatedEvent.OutputObject
  >;
  getEvent(
    key: "ReservationDeleted"
  ): TypedContractEvent<
    ReservationDeletedEvent.InputTuple,
    ReservationDeletedEvent.OutputTuple,
    ReservationDeletedEvent.OutputObject
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

    "ReservationCreated(bytes32,bytes32,bytes32,uint256,uint256,tuple)": TypedContractEvent<
      ReservationCreatedEvent.InputTuple,
      ReservationCreatedEvent.OutputTuple,
      ReservationCreatedEvent.OutputObject
    >;
    ReservationCreated: TypedContractEvent<
      ReservationCreatedEvent.InputTuple,
      ReservationCreatedEvent.OutputTuple,
      ReservationCreatedEvent.OutputObject
    >;

    "ReservationDeleted(bytes32,bytes32,bytes32,uint256,uint256,tuple)": TypedContractEvent<
      ReservationDeletedEvent.InputTuple,
      ReservationDeletedEvent.OutputTuple,
      ReservationDeletedEvent.OutputObject
    >;
    ReservationDeleted: TypedContractEvent<
      ReservationDeletedEvent.InputTuple,
      ReservationDeletedEvent.OutputTuple,
      ReservationDeletedEvent.OutputObject
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
