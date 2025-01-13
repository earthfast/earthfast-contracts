import { ethers } from "hardhat";
import { ProjectMultiplex } from "../typechain-types";

// npx hardhat run scripts/deleteSubProject.ts --network <network> -- --<multiplexAddress> <subProjectId>
// MULTIPLEX_ADDRESS=0x0Fe812CCEFC48226feCd8E3fd2b6A8D1068701Dd SUB_PROJECT_ID=0xc8e7224de21b591b5888cb38557aa0248dd202b379eae0455b994aee9a6a6bef npx hardhat run bin/deleteSupProject.ts --network testnet-sepolia

async function main() {
  // Get command line arguments
  const multiplexAddress = process.env.MULTIPLEX_ADDRESS;
  const subProjectId = process.env.SUB_PROJECT_ID;

  if (!multiplexAddress || !subProjectId) {
    throw new Error("Please provide MULTIPLEX_ADDRESS and SUB_PROJECT_ID environment variables");
  }

  // Get the signer
  const [signer] = await ethers.getSigners();

  // Get contract instance
  const multiplex = await ethers.getContractAt(
    "ProjectMultiplex",
    multiplexAddress,
    signer
  ) as ProjectMultiplex;

  // Delete the sub project
  console.log(`Deleting sub project ${subProjectId}...`);
  const tx = await multiplex.deleteSubProject(subProjectId);
  await tx.wait();
  
  console.log("Sub project deleted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
