import { task } from "hardhat/config";

// Updates the ABI in deployment files after a contract has been upgraded
// Usage:
// npx hardhat updateABI --network testnet-sepolia --contracts EarthfastProjects,EarthfastReservations
// npx hardhat updateABI --network testnet-sepolia --contracts EarthfastProjects --implementation EarthfastProjectsV2
// npx hardhat updateABI --network testnet-sepolia --contracts EarthfastProjects --tx 0x123...
task("updateABI", "Updates deployment files with new ABIs after contract upgrades")
  .addParam("contracts", "Comma-separated list of contract names to update")
  .addOptionalParam("implementation", "Single implementation name (if different from contract name)")
  .addOptionalParam("implementations", "Comma-separated list of implementation names (if different from contract names)")
  .addOptionalParam("tx", "Transaction hash of the upgrade transaction")
  .setAction(async (args, hre) => {
    const network = hre.network.name;
    
    // Parse contract names
    const contractNames = args.contracts.split(',');
    
    // Handle implementations
    let implementations = contractNames;
    if (args.implementation) {
      // Single implementation specified
      implementations = [args.implementation];
    } else if (args.implementations) {
      // Multiple implementations specified
      implementations = args.implementations.split(',');
    }
    
    const txHash = args.tx || "";
    
    console.log(`Updating ABIs for contracts: ${contractNames.join(', ')}`);
    if (txHash) {
      console.log(`Using transaction hash: ${txHash}`);
    }
    
    // If implementations is provided but doesn't match contracts length, log a warning
    if (implementations.length !== contractNames.length) {
      console.warn(`Warning: Number of implementations (${implementations.length}) doesn't match number of contracts (${contractNames.length}). Using contract names as implementation names where needed.`);
      // Pad implementations array with contract names if needed
      while (implementations.length < contractNames.length) {
        implementations.push(contractNames[implementations.length]);
      }
    }
    
    for (let i = 0; i < contractNames.length; i++) {
      const deploymentName = contractNames[i];
      const implName = implementations[i];

      console.log(`Updating ABI for ${deploymentName} with implementation ${implName}...`);

      try {
        // Get the current deployment to preserve the address
        const currentDeployment = await hre.deployments.get(deploymentName);
        const deploymentAddress = currentDeployment.address;
        
        // Get the artifact of the new implementation to extract its ABI
        const artifact = await hre.deployments.getExtendedArtifact(implName);
        
        // Create the updated deployment object
        const updatedDeployment = {
          ...artifact,
          address: deploymentAddress,
          // Use provided transaction hash if available, otherwise keep the current one
          transactionHash: txHash || currentDeployment.transactionHash
        };
        
        // Save the updated deployment
        await hre.deployments.save(deploymentName, updatedDeployment);
        
        console.log(`Updated ${deploymentName} ABI in deployments/${network}/`);
      } catch (error) {
        console.error(`Error updating ${deploymentName}: ${error.message}`);
      }
    }
    
    console.log("ABI update process completed!");
  });
