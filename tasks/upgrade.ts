import { task } from "hardhat/config";
import { upgradeProxy } from "../lib/deploy";
import { signers } from "../lib/util";

task("upgrade")
  .addFlag("ask", "Ask for confirmations (always on for production)")
  .addPositionalParam("name", "Which deployment to upgrade (ex. ArmadaNodes)")
  .addOptionalPositionalParam("contract", "New contract (if name changed, ex. ArmadaNodesV2)")
  .addOptionalParam("libs", "Libraries to link, comma separated (ex. ArmadaNodesImpl)")
  .setAction(async (args, hre, runSuper) => {
    hre.config.ask = args.ask;
    if (!hre.network.tags.local) hre.config.ask = true;
    if (hre.network.tags.local) hre.config.defender = undefined;
    const { guardian } = await signers(hre);
    await upgradeProxy(hre, args.name, {
      from: guardian.address,
      contract: args.contract ?? args.name,
      libraries: args.libs?.split(","),
    });
  });
