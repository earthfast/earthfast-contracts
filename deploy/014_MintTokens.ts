import hre from "hardhat";
import { attach, confirm, loadData, parseTokens, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type EarthfastToken = import("../typechain-types").EarthfastToken;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const data = await loadData(hre);
  const token = <EarthfastToken>await attach(hre, "EarthfastToken");
  const registry = await attach(hre, "EarthfastRegistry");
  const registryAddress = await registry.getAddress();
  const holders = data?.EarthfastToken?.holders ?? [];
  if (!(await token.totalSupply()) === 0) {
    console.log(`\n---SKIPPED EarthfastToken.mint ...`);
  } else if (!holders.length) {
    const initialSupply = parseTokens("1000000000").toString();
    const args = [guardian.address, initialSupply] as const;
    if (confirm(hre, `Execute EarthfastToken.mint ${stringify(args)}`)) {
      await wait(token.mint(...args));
    }
  } else {
    for (let i = 0; i < holders.length; ++i) {
      let address = "";
      if (holders[i].address.startsWith("0x")) {
        address = holders[i].address;
      } else if (holders[i].address === "EarthfastRegistry") {
        address = registryAddress;
      } else {
        throw Error("Invalid address format");
      }
      const args = [address, parseTokens(holders[i].balance).toString()] as const;
      if (confirm(hre, `Execute EarthfastToken.mint ${stringify(args)}`)) {
        await wait(token.mint(...args));
      }
    }
  }
  const renounceArgs = [await token.MINTER_ROLE(), deployer.address] as const;
  if (!(await token.hasRole(...renounceArgs))) {
    console.log(`\n---SKIPPED EarthfastToken.renounceRole ${stringify(renounceArgs)}`);
  } else {
    if (confirm(hre, `Execute EarthfastToken.renounceRole ${stringify(renounceArgs)}`)) {
      await wait(token.renounceRole(...renounceArgs));
    }
  }
}

main.tags = ["v1"];
