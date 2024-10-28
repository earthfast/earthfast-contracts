import hre from "hardhat";
import { upgradeProxy } from "../lib/deploy";
import { signers } from "../lib/util";

export default main;
async function main() {
  if (!hre.network.tags.local) {
    console.log("Skipping DeployNodesV2 for production");
    return;
  }

  const { guardian } = await signers(hre);
  await upgradeProxy(hre, "EarthfastNodes", {
    from: guardian.address,
    contract: "EarthfastNodesV2",
    libraries: ["EarthfastNodesImpl"],
  });
}

main.tags = ["v2"];
