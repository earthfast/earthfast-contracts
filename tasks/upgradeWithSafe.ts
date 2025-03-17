import Safe from "@safe-global/protocol-kit";
import { Interface } from "ethers";
import { task } from "hardhat/config";
import { signers } from "../lib/util";

// npx hardhat upgradeWithSafe --network sepolia --proxy 0x0000000000000000000000000000000000000000 --name EarthfastNodes --safe 0x0000000000000000000000000000000000000000 --contract EarthfastNodesV2
// npx hardhat upgradeWithSafe 0x496e5Ba816f4C593c3b31fa78279dfB57DAaad26 0x76824f74de8c1e4985d73a9ea475b7e01432cdf5 EarthfastReservations

// TODO: potentially retrieve safe address from the guardian signer
// Creates a Safe transaction to upgrade a contract that can be submitted to a Gnosis Safe UI for execution
task("upgradeWithSafe")
  .addFlag("ask", "Ask for confirmations (always on for production)")
  .addPositionalParam("proxy", "The proxy contract address")
  .addPositionalParam("safe", "The Safe contract address")
  .addPositionalParam("name", "Which deployment to upgrade (ex. EarthfastNodes)")
  .addOptionalPositionalParam("contract", "New contract (if name changed, ex. EarthfastNodesV2)")
  .addOptionalParam("libs", "Libraries to link, comma separated (ex. EarthfastNodesImpl)")
  .setAction(async (args, hre, runSuper) => {
    hre.config.ask = args.ask;
    if (!hre.network.tags.local) hre.config.ask = true;
    if (hre.network.tags.local) hre.config.defender = undefined;

    // deployer must be a Safe owner
    const { deployer } = await signers(hre);

    // Get the contract factory for the implementation
    const NewContract = await ethers.getContractFactory(args.contract ?? args.name);

    try {
      console.log("Checking if proxy is already registered...");
      // Try to get the proxy deployment - if it fails, we'll need to force import
      await hre.upgrades.erc1967.getImplementationAddress(args.proxy);
      console.log("Proxy is already registered.");
    } catch (error) {
      console.log("Proxy not registered. Importing proxy...");
      // Force import the proxy contract
      await hre.upgrades.forceImport(args.proxy, NewContract, { kind: "uups" });
      console.log("Proxy imported successfully.");
    }

    console.log("Preparing upgrade...");
    const newImplementationAddress = await hre.upgrades.prepareUpgrade(args.proxy, NewContract, { kind: "uups" });
    console.log("New implementation address:", newImplementationAddress);

    // For UUPS proxies, we need to call the upgradeTo function on the proxy itself
    // Create an interface for the upgradeTo function
    const upgradeInterface = new Interface(["function upgradeTo(address newImplementation)"]);

    // Encode the function call
    const upgradeData = upgradeInterface.encodeFunctionData("upgradeTo", [newImplementationAddress]);
    console.log("Upgrade transaction data prepared for proxy:", args.proxy);

    console.log("upgradeData", upgradeData);
    console.log("newImplementationAddress", newImplementationAddress);

    try {
      // instantiate the Safe
      console.log("Initializing Safe SDK...");

      // console.log("provider", hre.ethers.provider);
      const rpcUrl = hre.network.config.url;

      // Initialize the Safe instance using the static init method
      const safeSdk = await Safe.init({
        provider: rpcUrl,
        safeAddress: args.safe,
        signer: deployer,
      });

      // create a Safe transaction
      console.log("Creating Safe transaction...");
      const safeTransaction = await safeSdk.createTransaction({
        transactions: [
          {
            to: args.proxy, // For UUPS, we call the proxy directly
            value: "0", // No ETH sent
            data: upgradeData,
          },
        ],
      });

      console.log("Safe transaction proposed. Submit this to your Gnosis Safe:");
      console.log("To:", safeTransaction.data.to);
      console.log("Data:", safeTransaction.data.data);
      console.log("Value:", safeTransaction.data.value);
      console.log("Nonce:", safeTransaction.data.nonce || "Not specified");
    } catch (error) {
      console.error("Error creating Safe transaction:", error.message);
      // Even if Safe transaction creation fails, output the raw transaction data
      console.log("\nYou can still manually create a transaction in the Safe UI with this data:");
      console.log("To:", args.proxy);
      console.log("Value: 0");
      console.log("Data:", upgradeData);
    }

    // await upgradeProxy(hre, args.name, {
    //   from: guardian.address,
    //   contract: args.contract ?? args.name,
    //   libraries: args.libs?.split(","),
    // });
  });
