require("dotenv").config();
const { ethers } = require("ethers");

// Environment variables
const sepoliaUrl = "https://rpc.ankr.com/eth_sepolia";
const privateKey = process.env.PRIVATE_KEY;

// Contract ABI and Address
const abi = [
  // Your contract's ABI goes here
  // Example ABI entry for grantRole function:
  "function grantRole(bytes32 role, address account) external",
];
const contractAddress = ""; // ArmadaRegistry address

// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider(sepoliaUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Role and account to grant the role to
const role = ethers.utils.id("RECONCILER_ROLE"); // Replace 'YOUR_ROLE' with the role identifier
const account = "0x0000000000000000000000000000000000000000"; // Replace with the address to grant the role to

async function grantRole() {
  try {
    const tx = await contract.grantRole(role, account);
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt.transactionHash);
  } catch (error) {
    console.error("Error granting role:", error);
  }
}

grantRole();
