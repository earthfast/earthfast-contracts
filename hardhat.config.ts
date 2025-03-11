import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/defender-sdk";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "hardhat-contract-sizer";

import "./tasks/deploy";
import "./tasks/node";
import "./tasks/seed";
import "./tasks/upgrade";

import dotenv from "dotenv";
import { SignerWithAddress } from "ethers";
import { extendEnvironment, HardhatUserConfig } from "hardhat/config";
import { attach, getAddress, wait } from "./lib/util";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      tags: ["local"],
      gasPrice: 1000000,
    },
    hardhat: {
      tags: ["local"],

      // For solidity-coverage ganache
      allowUnlimitedContractSize: true,
      blockGasLimit: 0xfffffffffff,
      initialBaseFeePerGas: 0,
      gasPrice: 0,
    },
    ganache: {
      tags: ["local", "ganache"],
      url: "http://127.0.0.1:8545",
    },
    "testnet-sepolia": {
      tags: ["sepolia"],
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    "testnet-sepolia-staging": {
      tags: ["sepolia-staging"],
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    base: {
      tags: ["base"],
      url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  // prettier-ignore
  namedAccounts: {
    deployer: {
      // Testing
      localhost: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat #0
      hardhat:   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat #0
      ganache:   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat #0
      // Production
      "testnet-sepolia": getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
      "testnet-sepolia-staging": getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
      base: getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
    },
    guardian: {
      // Testing
      localhost: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat #1
      hardhat:   "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat #1
      ganache:   "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat #1
      // Production
      "testnet-sepolia":   "0x76824F74dE8C1E4985D73A9ea475B7E01432CdF5", // Gnosis Safe (public key)
      "testnet-sepolia-staging": "0x8459DDE54CB9dA738A9e52c937d086A8FC665A23", // MetaMask wallet
      base: getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // TODO: deploy base Safe and update this value
    },
    operator: {
      // Testing
      localhost: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat #2
      hardhat:   "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat #2
      ganache:   "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat #2
      "testnet-sepolia":   "0x8E0d75dEF5212698F6A2DA4546536acDBfF134b9", // Earthfast operator
      "testnet-sepolia-staging":   "0x3f9BBfadFC2Fd358Bd6EF43abE2E82D21E2D9B5D", // Earthfast operator
      base:   "0x8E0d75dEF5212698F6A2DA4546536acDBfF134b9", // Earthfast operator
    },
    project: {
      // Testing
      localhost: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat #3
      hardhat:   "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat #3
      ganache:   "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat #3
      "testnet-sepolia":   "0x7a0604B7B60A306F0360ff3CccE7e1bE52A5AabE", // Earthfast dashboard owner
      "testnet-sepolia-staging":   "0xe4a2F521293a12D2824b9D144E99BADf49c56cB9", // Earthfast dashboard owner
      base:   "0x7a0604B7B60A306F0360ff3CccE7e1bE52A5AabE", // Earthfast dashboard owner
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  // uncomment this to register newly deployed contracts with OZ Defender
  // defender: {
  //   apiKey: process.env.DEFENDER_API_KEY!,
  //   apiSecret: process.env.DEFENDER_API_SECRET!,
  // },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
  },
};

export default config;

declare module "hardhat/types/config" {
  export interface HardhatConfig {
    ask?: boolean;
    data?: string;
    seed?: boolean;
  }
}

// USAGE
// $ npx hardhat console --network ...
// > contract = await hre.attach("MyContract", [await signers().<foo>])
// > result = await contract.<function>()
// > receipt = await hre.wait(contract.<transaction>())
// > receipt = await hre.wait(contract.connect(await signers().<foo>).<transaction>())
extendEnvironment(async (hre) => {
  const ext: any = hre;
  ext.attach = (name: string, signer?: SignerWithAddress) => attach(hre, name, signer);
  ext.wait = wait;
});
