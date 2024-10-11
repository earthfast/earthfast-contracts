require("dotenv").config();
const { ethers } = require("ethers");

const sepoliaUrl = "https://rpc.ankr.com/eth_sepolia"; // Replace this with robust endpoint
const privateKey = process.env.PRIVATE_KEY; // Private key of the guardian address

const abi = [
  // ABI entry for grantRole function:
  "function grantRole(bytes32 role, address account) external",
];
const contractAddress = ""; // ArmadaBilling / ArmadaRegistry address

const provider = new ethers.providers.JsonRpcProvider(sepoliaUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

const role = ethers.id("RECONCILER_ROLE"); // role identifier
const account = "0x0000000000000000000000000000000000000000"; // address to grant the role to

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
