/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AxelarExecutable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AxelarExecutable__factory>;
    getContractFactory(
      name: "IAxelarExecutable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAxelarExecutable__factory>;
    getContractFactory(
      name: "IAxelarGasService",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAxelarGasService__factory>;
    getContractFactory(
      name: "IAxelarGateway",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAxelarGateway__factory>;
    getContractFactory(
      name: "IContractIdentifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IContractIdentifier__factory>;
    getContractFactory(
      name: "IImplementation",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IImplementation__factory>;
    getContractFactory(
      name: "IInterchainGasEstimation",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IInterchainGasEstimation__factory>;
    getContractFactory(
      name: "IOwnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOwnable__factory>;
    getContractFactory(
      name: "IUpgradable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUpgradable__factory>;
    getContractFactory(
      name: "AccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControlUpgradeable__factory>;
    getContractFactory(
      name: "IERC1822ProxiableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable__factory>;
    getContractFactory(
      name: "IBeaconUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeaconUpgradeable__factory>;
    getContractFactory(
      name: "ERC1967UpgradeUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UUPSUpgradeable__factory>;
    getContractFactory(
      name: "PausableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PausableUpgradeable__factory>;
    getContractFactory(
      name: "ReentrancyGuardUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuardUpgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "ERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165Upgradeable__factory>;
    getContractFactory(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165Upgradeable__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "GovernorCountingSimple",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GovernorCountingSimple__factory>;
    getContractFactory(
      name: "GovernorSettings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GovernorSettings__factory>;
    getContractFactory(
      name: "GovernorTimelockControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GovernorTimelockControl__factory>;
    getContractFactory(
      name: "GovernorVotes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GovernorVotes__factory>;
    getContractFactory(
      name: "GovernorVotesQuorumFraction",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GovernorVotesQuorumFraction__factory>;
    getContractFactory(
      name: "IGovernorTimelock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGovernorTimelock__factory>;
    getContractFactory(
      name: "Governor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Governor__factory>;
    getContractFactory(
      name: "IGovernor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGovernor__factory>;
    getContractFactory(
      name: "TimelockController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TimelockController__factory>;
    getContractFactory(
      name: "IVotes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVotes__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Receiver__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "ERC20Votes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Votes__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "DoubleEndedQueue",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DoubleEndedQueue__factory>;
    getContractFactory(
      name: "ArmadaBilling",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaBilling__factory>;
    getContractFactory(
      name: "ArmadaGovernor",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaGovernor__factory>;
    getContractFactory(
      name: "ArmadaNodes",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaNodes__factory>;
    getContractFactory(
      name: "ArmadaNodesImpl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaNodesImpl__factory>;
    getContractFactory(
      name: "ArmadaNodesV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaNodesV2__factory>;
    getContractFactory(
      name: "ArmadaOperators",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaOperators__factory>;
    getContractFactory(
      name: "ArmadaProjects",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaProjects__factory>;
    getContractFactory(
      name: "ArmadaRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaRegistry__factory>;
    getContractFactory(
      name: "ArmadaReservations",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaReservations__factory>;
    getContractFactory(
      name: "ArmadaTimelock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaTimelock__factory>;
    getContractFactory(
      name: "ArmadaToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ArmadaToken__factory>;
    getContractFactory(
      name: "CCMPReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CCMPReceiver__factory>;
    getContractFactory(
      name: "CCMPSender",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CCMPSender__factory>;
    getContractFactory(
      name: "USDC",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.USDC__factory>;

    getContractAt(
      name: "AxelarExecutable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AxelarExecutable>;
    getContractAt(
      name: "IAxelarExecutable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAxelarExecutable>;
    getContractAt(
      name: "IAxelarGasService",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAxelarGasService>;
    getContractAt(
      name: "IAxelarGateway",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAxelarGateway>;
    getContractAt(
      name: "IContractIdentifier",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IContractIdentifier>;
    getContractAt(
      name: "IImplementation",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IImplementation>;
    getContractAt(
      name: "IInterchainGasEstimation",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IInterchainGasEstimation>;
    getContractAt(
      name: "IOwnable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IOwnable>;
    getContractAt(
      name: "IUpgradable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IUpgradable>;
    getContractAt(
      name: "AccessControlUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlUpgradeable>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
    getContractAt(
      name: "IERC1822ProxiableUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    getContractAt(
      name: "IBeaconUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeaconUpgradeable>;
    getContractAt(
      name: "ERC1967UpgradeUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "PausableUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PausableUpgradeable>;
    getContractAt(
      name: "ReentrancyGuardUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuardUpgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC165Upgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
    getContractAt(
      name: "AccessControl",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "GovernorCountingSimple",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorCountingSimple>;
    getContractAt(
      name: "GovernorSettings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorSettings>;
    getContractAt(
      name: "GovernorTimelockControl",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorTimelockControl>;
    getContractAt(
      name: "GovernorVotes",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorVotes>;
    getContractAt(
      name: "GovernorVotesQuorumFraction",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorVotesQuorumFraction>;
    getContractAt(
      name: "IGovernorTimelock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IGovernorTimelock>;
    getContractAt(
      name: "Governor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Governor>;
    getContractAt(
      name: "IGovernor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IGovernor>;
    getContractAt(
      name: "TimelockController",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TimelockController>;
    getContractAt(
      name: "IVotes",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IVotes>;
    getContractAt(
      name: "Pausable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "IERC1155Receiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Receiver>;
    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Permit",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Permit>;
    getContractAt(
      name: "IERC20Permit",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "ERC20Votes",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Votes>;
    getContractAt(
      name: "IERC20Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC721Receiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "DoubleEndedQueue",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DoubleEndedQueue>;
    getContractAt(
      name: "ArmadaBilling",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaBilling>;
    getContractAt(
      name: "ArmadaGovernor",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaGovernor>;
    getContractAt(
      name: "ArmadaNodes",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaNodes>;
    getContractAt(
      name: "ArmadaNodesImpl",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaNodesImpl>;
    getContractAt(
      name: "ArmadaNodesV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaNodesV2>;
    getContractAt(
      name: "ArmadaOperators",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaOperators>;
    getContractAt(
      name: "ArmadaProjects",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaProjects>;
    getContractAt(
      name: "ArmadaRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaRegistry>;
    getContractAt(
      name: "ArmadaReservations",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaReservations>;
    getContractAt(
      name: "ArmadaTimelock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaTimelock>;
    getContractAt(
      name: "ArmadaToken",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaToken>;
    getContractAt(
      name: "CCMPReceiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.CCMPReceiver>;
    getContractAt(
      name: "CCMPSender",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.CCMPSender>;
    getContractAt(
      name: "USDC",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.USDC>;

    deployContract(
      name: "AxelarExecutable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AxelarExecutable>;
    deployContract(
      name: "IAxelarExecutable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAxelarExecutable>;
    deployContract(
      name: "IAxelarGasService",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAxelarGasService>;
    deployContract(
      name: "IAxelarGateway",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAxelarGateway>;
    deployContract(
      name: "IContractIdentifier",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IContractIdentifier>;
    deployContract(
      name: "IImplementation",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IImplementation>;
    deployContract(
      name: "IInterchainGasEstimation",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IInterchainGasEstimation>;
    deployContract(
      name: "IOwnable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOwnable>;
    deployContract(
      name: "IUpgradable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUpgradable>;
    deployContract(
      name: "AccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AccessControlUpgradeable>;
    deployContract(
      name: "IAccessControlUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccessControlUpgradeable>;
    deployContract(
      name: "IERC1822ProxiableUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    deployContract(
      name: "IBeaconUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeaconUpgradeable>;
    deployContract(
      name: "ERC1967UpgradeUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    deployContract(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "PausableUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PausableUpgradeable>;
    deployContract(
      name: "ReentrancyGuardUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuardUpgradeable>;
    deployContract(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ContextUpgradeable>;
    deployContract(
      name: "ERC165Upgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165Upgradeable>;
    deployContract(
      name: "IERC165Upgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165Upgradeable>;
    deployContract(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AccessControl>;
    deployContract(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccessControl>;
    deployContract(
      name: "GovernorCountingSimple",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorCountingSimple>;
    deployContract(
      name: "GovernorSettings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorSettings>;
    deployContract(
      name: "GovernorTimelockControl",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorTimelockControl>;
    deployContract(
      name: "GovernorVotes",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorVotes>;
    deployContract(
      name: "GovernorVotesQuorumFraction",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorVotesQuorumFraction>;
    deployContract(
      name: "IGovernorTimelock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IGovernorTimelock>;
    deployContract(
      name: "Governor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Governor>;
    deployContract(
      name: "IGovernor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IGovernor>;
    deployContract(
      name: "TimelockController",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TimelockController>;
    deployContract(
      name: "IVotes",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IVotes>;
    deployContract(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Receiver>;
    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "ERC20Permit",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Permit>;
    deployContract(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "ERC20Votes",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Votes>;
    deployContract(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "DoubleEndedQueue",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DoubleEndedQueue>;
    deployContract(
      name: "ArmadaBilling",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaBilling>;
    deployContract(
      name: "ArmadaGovernor",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaGovernor>;
    deployContract(
      name: "ArmadaNodes",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaNodes>;
    deployContract(
      name: "ArmadaNodesImpl",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaNodesImpl>;
    deployContract(
      name: "ArmadaNodesV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaNodesV2>;
    deployContract(
      name: "ArmadaOperators",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaOperators>;
    deployContract(
      name: "ArmadaProjects",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaProjects>;
    deployContract(
      name: "ArmadaRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaRegistry>;
    deployContract(
      name: "ArmadaReservations",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaReservations>;
    deployContract(
      name: "ArmadaTimelock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaTimelock>;
    deployContract(
      name: "ArmadaToken",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaToken>;
    deployContract(
      name: "CCMPReceiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CCMPReceiver>;
    deployContract(
      name: "CCMPSender",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CCMPSender>;
    deployContract(
      name: "USDC",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.USDC>;

    deployContract(
      name: "AxelarExecutable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AxelarExecutable>;
    deployContract(
      name: "IAxelarExecutable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAxelarExecutable>;
    deployContract(
      name: "IAxelarGasService",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAxelarGasService>;
    deployContract(
      name: "IAxelarGateway",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAxelarGateway>;
    deployContract(
      name: "IContractIdentifier",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IContractIdentifier>;
    deployContract(
      name: "IImplementation",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IImplementation>;
    deployContract(
      name: "IInterchainGasEstimation",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IInterchainGasEstimation>;
    deployContract(
      name: "IOwnable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOwnable>;
    deployContract(
      name: "IUpgradable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IUpgradable>;
    deployContract(
      name: "AccessControlUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AccessControlUpgradeable>;
    deployContract(
      name: "IAccessControlUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccessControlUpgradeable>;
    deployContract(
      name: "IERC1822ProxiableUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    deployContract(
      name: "IBeaconUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeaconUpgradeable>;
    deployContract(
      name: "ERC1967UpgradeUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    deployContract(
      name: "Initializable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "PausableUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PausableUpgradeable>;
    deployContract(
      name: "ReentrancyGuardUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuardUpgradeable>;
    deployContract(
      name: "ContextUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ContextUpgradeable>;
    deployContract(
      name: "ERC165Upgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165Upgradeable>;
    deployContract(
      name: "IERC165Upgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165Upgradeable>;
    deployContract(
      name: "AccessControl",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.AccessControl>;
    deployContract(
      name: "IAccessControl",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccessControl>;
    deployContract(
      name: "GovernorCountingSimple",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorCountingSimple>;
    deployContract(
      name: "GovernorSettings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorSettings>;
    deployContract(
      name: "GovernorTimelockControl",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorTimelockControl>;
    deployContract(
      name: "GovernorVotes",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorVotes>;
    deployContract(
      name: "GovernorVotesQuorumFraction",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GovernorVotesQuorumFraction>;
    deployContract(
      name: "IGovernorTimelock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IGovernorTimelock>;
    deployContract(
      name: "Governor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Governor>;
    deployContract(
      name: "IGovernor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IGovernor>;
    deployContract(
      name: "TimelockController",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TimelockController>;
    deployContract(
      name: "IVotes",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IVotes>;
    deployContract(
      name: "Pausable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Pausable>;
    deployContract(
      name: "IERC1155Receiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Receiver>;
    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "ERC20Permit",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Permit>;
    deployContract(
      name: "IERC20Permit",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "ERC20Votes",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20Votes>;
    deployContract(
      name: "IERC20Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "IERC721Receiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "DoubleEndedQueue",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DoubleEndedQueue>;
    deployContract(
      name: "ArmadaBilling",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaBilling>;
    deployContract(
      name: "ArmadaGovernor",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaGovernor>;
    deployContract(
      name: "ArmadaNodes",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaNodes>;
    deployContract(
      name: "ArmadaNodesImpl",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaNodesImpl>;
    deployContract(
      name: "ArmadaNodesV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaNodesV2>;
    deployContract(
      name: "ArmadaOperators",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaOperators>;
    deployContract(
      name: "ArmadaProjects",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaProjects>;
    deployContract(
      name: "ArmadaRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaRegistry>;
    deployContract(
      name: "ArmadaReservations",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaReservations>;
    deployContract(
      name: "ArmadaTimelock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaTimelock>;
    deployContract(
      name: "ArmadaToken",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ArmadaToken>;
    deployContract(
      name: "CCMPReceiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CCMPReceiver>;
    deployContract(
      name: "CCMPSender",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CCMPSender>;
    deployContract(
      name: "USDC",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.USDC>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
