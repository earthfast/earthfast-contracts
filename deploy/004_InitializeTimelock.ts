import hre from "hardhat";
import { attach, confirm, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaTimelock = import("../typechain-types").ArmadaTimelock;

export default main;
async function main() {
  const { deployer } = await signers(hre);
  const timelock = <ArmadaTimelock>await attach(hre, "ArmadaTimelock");
  const governor = await attach(hre, "ArmadaGovernor");
  const governorAddress = await governor.getAddress();

  const grantArgs = [await timelock.PROPOSER_ROLE(), governorAddress] as const;
  if (await timelock.hasRole(...grantArgs)) {
    console.log(`\n---SKIPPED ArmadaTimelock.grantRole ${stringify(grantArgs)}`);
  } else {
    if (confirm(hre, `Execute ArmadaTimelock.grantRole ${stringify(grantArgs)}`)) {
      await wait(timelock.grantRole(...grantArgs));
    }
  }

  const renounceArgs = [await timelock.TIMELOCK_ADMIN_ROLE(), deployer.address] as const;
  if (!(await timelock.hasRole(...renounceArgs))) {
    console.log(`\n---SKIPPED ArmadaTimelock.renounceRole ${stringify(renounceArgs)}`);
  } else {
    if (confirm(hre, `Execute ArmadaTimelock.renounceRole ${stringify(renounceArgs)}`)) {
      await wait(timelock.renounceRole(...renounceArgs));
    }
  }
}

main.tags = ["v1"];
