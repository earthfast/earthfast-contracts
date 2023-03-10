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
  await upgradeProxy(hre, "ArmadaNodes", {
    from: guardian.address,
    contract: "ArmadaNodesV2",
    libraries: ["ArmadaNodesImpl"],
  });
}

main.tags = ["v2"];
