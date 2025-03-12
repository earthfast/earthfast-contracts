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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export type EarthfastCreateProjectDataStruct = {
  owner: AddressLike;
  name: string;
  email: string;
  content: string;
  checksum: BytesLike;
  metadata: string;
};

export type EarthfastCreateProjectDataStructOutput = [
  owner: string,
  name: string,
  email: string,
  content: string,
  checksum: string,
  metadata: string
] & {
  owner: string;
  name: string;
  email: string;
  content: string;
  checksum: string;
  metadata: string;
};

export type EarthfastSlotStruct = { last: boolean; next: boolean };

export type EarthfastSlotStructOutput = [last: boolean, next: boolean] & {
  last: boolean;
  next: boolean;
};

export interface EarthfastEntrypointInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "deploySite"
      | "deploySiteWithNodeIds"
      | "getAvailableNodes"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deploySite",
    values: [
      EarthfastCreateProjectDataStruct,
      BigNumberish,
      BigNumberish,
      EarthfastSlotStruct,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deploySiteWithNodeIds",
    values: [
      EarthfastCreateProjectDataStruct,
      BytesLike[],
      BigNumberish[],
      BigNumberish,
      EarthfastSlotStruct,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableNodes",
    values: [BigNumberish, EarthfastSlotStruct]
  ): string;

  decodeFunctionResult(functionFragment: "deploySite", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deploySiteWithNodeIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableNodes",
    data: BytesLike
  ): Result;
}

export interface EarthfastEntrypoint extends BaseContract {
  connect(runner?: ContractRunner | null): EarthfastEntrypoint;
  waitForDeployment(): Promise<this>;

  interface: EarthfastEntrypointInterface;

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

  deploySite: TypedContractMethod<
    [
      project: EarthfastCreateProjectDataStruct,
      nodesToReserve: BigNumberish,
      escrowAmount: BigNumberish,
      slot: EarthfastSlotStruct,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  deploySiteWithNodeIds: TypedContractMethod<
    [
      project: EarthfastCreateProjectDataStruct,
      nodeIds: BytesLike[],
      nodePrices: BigNumberish[],
      escrowAmount: BigNumberish,
      slot: EarthfastSlotStruct,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  getAvailableNodes: TypedContractMethod<
    [nodesToReserve: BigNumberish, slot: EarthfastSlotStruct],
    [[string[], bigint[]] & { nodeIds: string[]; nodePrices: bigint[] }],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "deploySite"
  ): TypedContractMethod<
    [
      project: EarthfastCreateProjectDataStruct,
      nodesToReserve: BigNumberish,
      escrowAmount: BigNumberish,
      slot: EarthfastSlotStruct,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deploySiteWithNodeIds"
  ): TypedContractMethod<
    [
      project: EarthfastCreateProjectDataStruct,
      nodeIds: BytesLike[],
      nodePrices: BigNumberish[],
      escrowAmount: BigNumberish,
      slot: EarthfastSlotStruct,
      deadline: BigNumberish,
      signature: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getAvailableNodes"
  ): TypedContractMethod<
    [nodesToReserve: BigNumberish, slot: EarthfastSlotStruct],
    [[string[], bigint[]] & { nodeIds: string[]; nodePrices: bigint[] }],
    "view"
  >;

  filters: {};
}
