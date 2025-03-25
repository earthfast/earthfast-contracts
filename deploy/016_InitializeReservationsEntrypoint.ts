import hre from "hardhat";
import { attach, confirm, signers, stringify } from "../lib/util";
import { Interface } from "ethers";

// guardian is a Gnosis Safe wallet, if not a Gnosis Safe, we need to execute the transaction directly
export default main;
async function main() {
  const { guardian } = await signers(hre);

  const reservations = await attach(hre, "EarthfastReservations");
  const entrypoint = await attach(hre, "EarthfastEntrypoint");
  const entrypointAddress = await entrypoint.getAddress();

  if (confirm(hre, `Prepare EarthfastReservations.authorizeEntrypoint transaction for Safe UI ${stringify([entrypointAddress])}`)) {
    // Create an interface for the authorizeEntrypoint function
    const iface = new Interface(["function authorizeEntrypoint(address entrypoint)"]);
    
    // Encode the function call
    const data = iface.encodeFunctionData("authorizeEntrypoint", [entrypointAddress]);
    
    console.log("\nSubmit this transaction to your Gnosis Safe:");
    console.log("To:", await reservations.getAddress());
    console.log("Value: 0");
    console.log("Data:", data);
  }
}

main.tags = ["v1", "InitializeReservationsEntrypoint"];
