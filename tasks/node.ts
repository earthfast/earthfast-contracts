import { task } from "hardhat/config";

task("node")
  .addFlag("ask", "Ask for confirmations (always on for production)")
  .addOptionalParam("data", "Upload contract data from given file (ex. data/foo.json)")
  .addFlag("seed", "Upload dummy programmatic contract data")
  .setAction(async (args, hre, runSuper) => {
    hre.config.ask = args.ask;
    hre.config.data = args.data;
    hre.config.seed = args.seed;
    if (!hre.network.tags.dev) hre.config.ask = true;
    if (hre.network.tags.local) hre.config.defender = undefined;
    await runSuper(args);
  });
