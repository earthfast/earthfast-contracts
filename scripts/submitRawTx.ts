import { ethers } from "ethers";

// TODO: Add your private key and RPC URL
const PRIVATE_KEY = "";
const RPC_URL = "";

interface TransactionResult {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: number;
}

async function submitSignedTransaction(
  privateKey: string,
  contractAddress: string,
  data: string,
  rpcUrl: string
): Promise<TransactionResult> {
  try {
    // Create provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create transaction object
    const tx = {
      to: contractAddress,
      data: data,
      value: 0, // Amount of ETH to send (in Wei)
    };

    // Gas estimation here but unused
    // const gasEstimate = await provider.estimateGas({
    //   ...tx,
    //   from: wallet.address,
    // });

    // const gasPrice = await provider.getFeeData();

    const transaction = {
      ...tx,
      // gasLimit: gasEstimate,
      // maxFeePerGas: gasPrice.maxFeePerGas,
      // maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
      nonce: await provider.getTransactionCount(wallet.address),
      type: 2, // EIP-1559 transaction type
    };

    // Sign and send transaction
    const signedTx = await wallet.sendTransaction(transaction);

    // Wait for transaction to be mined
    const receipt = await signedTx.wait();

    if (!receipt) {
      throw new Error("Transaction failed");
    }

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status || 0,
    };
  } catch (error) {
    throw new Error(`Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function main() {
  if (!PRIVATE_KEY || !RPC_URL) {
    throw new Error("Missing environment variables");
  }

  // Get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    throw new Error("Usage: ts-node script.ts <contract_address> <data>");
  }

  const [contractAddress, data] = args;

  // Validate contract address
  if (!ethers.isAddress(contractAddress)) {
    throw new Error("Invalid contract address");
  } 

  // Ensure data is properly formatted
  const formattedData = data.startsWith("0x") ? data : `0x${data}`;

  console.log("Submitting transaction...");
  const result = await submitSignedTransaction(PRIVATE_KEY, contractAddress, formattedData, RPC_URL);

  console.log("Transaction successful!");
  console.log(`Transaction hash: ${result.transactionHash}`);
  console.log(`Block number: ${result.blockNumber}`);
  console.log(`Gas used: ${result.gasUsed}`);
  console.log(`Status: ${result.status === 1 ? "Success" : "Failed"}`);
}

// Run the script
main();
