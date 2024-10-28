import hre from "hardhat";
import { attach, confirm, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastTimelock = import("../typechain-types").EarthfastTimelock;

export default main;
async function main() {
  const { deployer } = await signers(hre);
  const timelock = <EarthfastTimelock>await attach(hre, "EarthfastTimelock");
  const governor = await attach(hre, "EarthfastGovernor");
  const governorAddress = await governor.getAddress();

  const grantArgs = [await timelock.PROPOSER_ROLE(), governorAddress] as const;
  if (await timelock.hasRole(...grantArgs)) {
    console.log(`\n---SKIPPED EarthfastTimelock.grantRole ${stringify(grantArgs)}`);
  } else {
    if (confirm(hre, `Execute EarthfastTimelock.grantRole ${stringify(grantArgs)}`)) {
      await wait(timelock.grantRole(...grantArgs));
    }
  }

  const renounceArgs = [await timelock.TIMELOCK_ADMIN_ROLE(), deployer.address] as const;
  if (!(await timelock.hasRole(...renounceArgs))) {
    console.log(`\n---SKIPPED EarthfastTimelock.renounceRole ${stringify(renounceArgs)}`);
  } else {
    if (confirm(hre, `Execute EarthfastTimelock.renounceRole ${stringify(renounceArgs)}`)) {
      await wait(timelock.renounceRole(...renounceArgs));
    }
  }
}

main.tags = ["v1"];
