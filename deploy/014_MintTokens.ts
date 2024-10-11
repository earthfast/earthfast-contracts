import hre from "hardhat";
import { attach, confirm, loadData, parseTokens, signers, stringify, wait } from "../lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaToken = import("../typechain-types").ArmadaToken;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);
  const data = await loadData(hre);
  const token = <ArmadaToken>await attach(hre, "ArmadaToken");
  const registry = await attach(hre, "ArmadaRegistry");
  const registryAddress = await registry.getAddress();
  const holders = data?.ArmadaToken?.holders ?? [];
  if (!(await token.totalSupply()) === 0) {
    console.log(`\n---SKIPPED ArmadaToken.mint ...`);
  } else if (!holders.length) {
    const initialSupply = parseTokens("1000000000").toString();
    const args = [guardian.address, initialSupply] as const;
    if (confirm(hre, `Execute ArmadaToken.mint ${stringify(args)}`)) {
      await wait(token.mint(...args));
    }
  } else {
    for (let i = 0; i < holders.length; ++i) {
      let address = "";
      if (holders[i].address.startsWith("0x")) {
        address = holders[i].address;
      } else if (holders[i].address === "ArmadaRegistry") {
        address = registryAddress;
      } else {
        throw Error("Invalid address format");
      }
      const args = [address, parseTokens(holders[i].balance).toString()] as const;
      if (confirm(hre, `Execute ArmadaToken.mint ${stringify(args)}`)) {
        await wait(token.mint(...args));
      }
    }
  }
  const renounceArgs = [await token.MINTER_ROLE(), deployer.address] as const;
  if (!(await token.hasRole(...renounceArgs))) {
    console.log(`\n---SKIPPED ArmadaToken.renounceRole ${stringify(renounceArgs)}`);
  } else {
    if (confirm(hre, `Execute ArmadaToken.renounceRole ${stringify(renounceArgs)}`)) {
      await wait(token.renounceRole(...renounceArgs));
    }
  }
}

main.tags = ["v1"];
