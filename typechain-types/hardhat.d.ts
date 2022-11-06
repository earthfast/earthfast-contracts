/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
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

    getContractAt(
      name: "AccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControlUpgradeable>;
    getContractAt(
      name: "IAccessControlUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControlUpgradeable>;
    getContractAt(
      name: "IERC1822ProxiableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    getContractAt(
      name: "IBeaconUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeaconUpgradeable>;
    getContractAt(
      name: "ERC1967UpgradeUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "PausableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PausableUpgradeable>;
    getContractAt(
      name: "ReentrancyGuardUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuardUpgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165Upgradeable>;
    getContractAt(
      name: "IERC165Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165Upgradeable>;
    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "GovernorCountingSimple",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorCountingSimple>;
    getContractAt(
      name: "GovernorSettings",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorSettings>;
    getContractAt(
      name: "GovernorTimelockControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorTimelockControl>;
    getContractAt(
      name: "GovernorVotes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorVotes>;
    getContractAt(
      name: "GovernorVotesQuorumFraction",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GovernorVotesQuorumFraction>;
    getContractAt(
      name: "IGovernorTimelock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IGovernorTimelock>;
    getContractAt(
      name: "Governor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Governor>;
    getContractAt(
      name: "IGovernor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IGovernor>;
    getContractAt(
      name: "TimelockController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TimelockController>;
    getContractAt(
      name: "IVotes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVotes>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "IERC1155Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Receiver>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Permit>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "ERC20Votes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Votes>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "DoubleEndedQueue",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DoubleEndedQueue>;
    getContractAt(
      name: "ArmadaBilling",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaBilling>;
    getContractAt(
      name: "ArmadaGovernor",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaGovernor>;
    getContractAt(
      name: "ArmadaNodes",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaNodes>;
    getContractAt(
      name: "ArmadaNodesImpl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaNodesImpl>;
    getContractAt(
      name: "ArmadaNodesV2",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaNodesV2>;
    getContractAt(
      name: "ArmadaOperators",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaOperators>;
    getContractAt(
      name: "ArmadaProjects",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaProjects>;
    getContractAt(
      name: "ArmadaRegistry",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaRegistry>;
    getContractAt(
      name: "ArmadaReservations",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaReservations>;
    getContractAt(
      name: "ArmadaTimelock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaTimelock>;
    getContractAt(
      name: "ArmadaToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ArmadaToken>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
