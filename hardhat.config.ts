import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-defender";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

import "./tasks/deploy";
import "./tasks/node";
import "./tasks/seed";
import "./tasks/upgrade";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import dotenv from "dotenv";
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
    staging: {
      tags: ["goerli"],
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    testnet: {
      tags: ["goerli"],
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
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
  },
  // prettier-ignore
  namedAccounts: {
    deployer: {
      // Testing
      localhost: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat #0
      hardhat:   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat #0
      ganache:   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Hardhat #0
      // Production
      staging:   getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
      testnet:   getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
      "testnet-sepolia": getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
      "testnet-sepolia-staging": getAddress(process.env.DEPLOYER_PRIVATE_KEY)!, // Developer (private key)
    },
    guardian: {
      // Testing
      localhost: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat #1
      hardhat:   "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat #1
      ganache:   "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat #1
      // Production
      staging:   "0x90bC78b839fCC1c652CCF8d6A527687AE432A3Bc", // Gnosis Safe (public key)
      testnet:   "0xF62e46336335f2344D451bAA23696CF77e5C52fC", // Gnosis Safe (public key)
      "testnet-sepolia":   "0x76824F74dE8C1E4985D73A9ea475B7E01432CdF5", // Gnosis Safe (public key)
      "testnet-sepolia-staging": "0x8459DDE54CB9dA738A9e52c937d086A8FC665A23", // Gnosis Safe (public key)
    },
    operator: {
      // Testing
      localhost: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat #2
      hardhat:   "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat #2
      ganache:   "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat #2
    },
    project: {
      // Testing
      localhost: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat #3
      hardhat:   "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat #3
      ganache:   "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat #3
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY!,
    apiSecret: process.env.DEFENDER_API_SECRET!,
  },
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
