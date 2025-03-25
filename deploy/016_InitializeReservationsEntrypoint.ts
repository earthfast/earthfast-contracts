import { Interface } from "ethers";
import hre from "hardhat";
import { attach, confirm, signers, stringify, wait } from "../lib/util";

// guardian is a Gnosis Safe wallet, if not a Gnosis Safe, we need to execute the transaction directly
export default main;
async function main() {
  const { guardian } = await signers(hre);
  const guardianAddress = await guardian.getAddress();

  const reservations = await attach(hre, "EarthfastReservations");
  const entrypoint = await attach(hre, "EarthfastEntrypoint");
  const entrypointAddress = await entrypoint.getAddress();

  // Check if guardian is a contract by checking if it has code
  const guardianCode = await hre.ethers.provider.getCode(guardianAddress);
  const isContract = guardianCode !== "0x";

  if (confirm(hre, `Execute EarthfastReservations.authorizeEntrypoint ${stringify([entrypointAddress])}`)) {
    if (isContract) {
      // Create an interface for the authorizeEntrypoint function
      const iface = new Interface(["function authorizeEntrypoint(address entrypoint)"]);

      // Encode the function call
      const data = iface.encodeFunctionData("authorizeEntrypoint", [entrypointAddress]);

      console.log("\nSubmit this transaction to your Gnosis Safe:");
      console.log("To:", await reservations.getAddress());
      console.log("Value: 0");
      console.log("Data:", data);
    } else {
      // For non-contract wallets, execute directly
      await wait(reservations.connect(guardian).authorizeEntrypoint(entrypoint));
    }
  }
}

main.tags = ["v1", "InitializeReservationsEntrypoint"];
