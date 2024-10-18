/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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

export interface IAxelarGatewayInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "callContract"
      | "isCommandExecuted"
      | "isContractCallApproved"
      | "validateContractCall"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "ContractCall"): EventFragment;

  encodeFunctionData(
    functionFragment: "callContract",
    values: [string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isCommandExecuted",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isContractCallApproved",
    values: [BytesLike, string, string, AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateContractCall",
    values: [BytesLike, string, string, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "callContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isCommandExecuted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isContractCallApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateContractCall",
    data: BytesLike
  ): Result;
}

export namespace ContractCallEvent {
  export type InputTuple = [
    sender: AddressLike,
    destinationChain: string,
    destinationContractAddress: string,
    payloadHash: BytesLike,
    payload: BytesLike
  ];
  export type OutputTuple = [
    sender: string,
    destinationChain: string,
    destinationContractAddress: string,
    payloadHash: string,
    payload: string
  ];
  export interface OutputObject {
    sender: string;
    destinationChain: string;
    destinationContractAddress: string;
    payloadHash: string;
    payload: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IAxelarGateway extends BaseContract {
  connect(runner?: ContractRunner | null): IAxelarGateway;
  waitForDeployment(): Promise<this>;

  interface: IAxelarGatewayInterface;

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

  callContract: TypedContractMethod<
    [destinationChain: string, contractAddress: string, payload: BytesLike],
    [void],
    "nonpayable"
  >;

  isCommandExecuted: TypedContractMethod<
    [commandId: BytesLike],
    [boolean],
    "view"
  >;

  isContractCallApproved: TypedContractMethod<
    [
      commandId: BytesLike,
      sourceChain: string,
      sourceAddress: string,
      contractAddress: AddressLike,
      payloadHash: BytesLike
    ],
    [boolean],
    "view"
  >;

  validateContractCall: TypedContractMethod<
    [
      commandId: BytesLike,
      sourceChain: string,
      sourceAddress: string,
      payloadHash: BytesLike
    ],
    [boolean],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "callContract"
  ): TypedContractMethod<
    [destinationChain: string, contractAddress: string, payload: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "isCommandExecuted"
  ): TypedContractMethod<[commandId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isContractCallApproved"
  ): TypedContractMethod<
    [
      commandId: BytesLike,
      sourceChain: string,
      sourceAddress: string,
      contractAddress: AddressLike,
      payloadHash: BytesLike
    ],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "validateContractCall"
  ): TypedContractMethod<
    [
      commandId: BytesLike,
      sourceChain: string,
      sourceAddress: string,
      payloadHash: BytesLike
    ],
    [boolean],
    "nonpayable"
  >;

  getEvent(
    key: "ContractCall"
  ): TypedContractEvent<
    ContractCallEvent.InputTuple,
    ContractCallEvent.OutputTuple,
    ContractCallEvent.OutputObject
  >;

  filters: {
    "ContractCall(address,string,string,bytes32,bytes)": TypedContractEvent<
      ContractCallEvent.InputTuple,
      ContractCallEvent.OutputTuple,
      ContractCallEvent.OutputObject
    >;
    ContractCall: TypedContractEvent<
      ContractCallEvent.InputTuple,
      ContractCallEvent.OutputTuple,
      ContractCallEvent.OutputObject
    >;
  };
}
