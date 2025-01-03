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

export interface ProjectMultiplexInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createProject"
      | "deleteSubProject"
      | "getSubProjectId"
      | "getSubProjectIds"
      | "owner"
      | "projectId"
      | "projects"
      | "subProjectIds"
      | "subProjects"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "SubProjectCreated"): EventFragment;

  encodeFunctionData(
    functionFragment: "createProject",
    values: [BigNumberish, string, AddressLike, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "deleteSubProject",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getSubProjectId",
    values: [BigNumberish, AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getSubProjectIds",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "projectId", values?: undefined): string;
  encodeFunctionData(functionFragment: "projects", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "subProjectIds",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "subProjects",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "createProject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deleteSubProject",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubProjectId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSubProjectIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "projectId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "projects", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "subProjectIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subProjects",
    data: BytesLike
  ): Result;
}

export namespace SubProjectCreatedEvent {
  export type InputTuple = [
    chainId: BigNumberish,
    subProjectId: BytesLike,
    token: AddressLike,
    castHash: BytesLike
  ];
  export type OutputTuple = [
    chainId: bigint,
    subProjectId: string,
    token: string,
    castHash: string
  ];
  export interface OutputObject {
    chainId: bigint;
    subProjectId: string;
    token: string;
    castHash: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ProjectMultiplex extends BaseContract {
  connect(runner?: ContractRunner | null): ProjectMultiplex;
  waitForDeployment(): Promise<this>;

  interface: ProjectMultiplexInterface;

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

  createProject: TypedContractMethod<
    [
      chainId: BigNumberish,
      tokenName: string,
      tokenAddress: AddressLike,
      caster: string,
      castHash: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  deleteSubProject: TypedContractMethod<
    [subProjectId: BytesLike],
    [void],
    "nonpayable"
  >;

  getSubProjectId: TypedContractMethod<
    [chainId: BigNumberish, tokenAddress: AddressLike, caster: string],
    [string],
    "view"
  >;

  getSubProjectIds: TypedContractMethod<[], [string[]], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  projectId: TypedContractMethod<[], [string], "view">;

  projects: TypedContractMethod<[], [string], "view">;

  subProjectIds: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  subProjects: TypedContractMethod<
    [arg0: BytesLike],
    [
      [bigint, string, string, string, string] & {
        chainId: bigint;
        tokenName: string;
        token: string;
        caster: string;
        castHash: string;
      }
    ],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createProject"
  ): TypedContractMethod<
    [
      chainId: BigNumberish,
      tokenName: string,
      tokenAddress: AddressLike,
      caster: string,
      castHash: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deleteSubProject"
  ): TypedContractMethod<[subProjectId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getSubProjectId"
  ): TypedContractMethod<
    [chainId: BigNumberish, tokenAddress: AddressLike, caster: string],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSubProjectIds"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "projectId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "projects"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "subProjectIds"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "subProjects"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [bigint, string, string, string, string] & {
        chainId: bigint;
        tokenName: string;
        token: string;
        caster: string;
        castHash: string;
      }
    ],
    "view"
  >;

  getEvent(
    key: "SubProjectCreated"
  ): TypedContractEvent<
    SubProjectCreatedEvent.InputTuple,
    SubProjectCreatedEvent.OutputTuple,
    SubProjectCreatedEvent.OutputObject
  >;

  filters: {
    "SubProjectCreated(uint32,bytes32,address,bytes)": TypedContractEvent<
      SubProjectCreatedEvent.InputTuple,
      SubProjectCreatedEvent.OutputTuple,
      SubProjectCreatedEvent.OutputObject
    >;
    SubProjectCreated: TypedContractEvent<
      SubProjectCreatedEvent.InputTuple,
      SubProjectCreatedEvent.OutputTuple,
      SubProjectCreatedEvent.OutputObject
    >;
  };
}
