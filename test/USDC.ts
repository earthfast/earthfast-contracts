import { expect } from "chai";
import hre from "hardhat";
import { fixtures } from "../lib/test";
import { USDC } from "../typechain-types/contracts/test/USDC";

describe("USDC", function () {
  let usdc: USDC;

  let snapshotId: string;

  async function fixture() {
    ({ usdc } = await fixtures(hre));
  }

  before(async function () {
    console.log("working here?");
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should have version", async function () {
    expect(await usdc.version()).to.be.eq("1");
  });
});
