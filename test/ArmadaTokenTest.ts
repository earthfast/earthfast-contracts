import { expect } from "chai";
import { SignerWithAddress, ZeroAddress } from "ethers";
import hre from "hardhat";
import { fixtures } from "../lib/test";
import { parseTokens, signers } from "../lib/util";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";

describe("ArmadaToken", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;

  let token: ArmadaToken;
  let tokenAddress: string;

  let snapshotId: string;

  async function fixture() {
    ({ admin, operator } = await signers(hre));
    ({ token } = await fixtures(hre));
    tokenAddress = await token.getAddress();
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should check constructor args", async function () {
    const factory = await hre.ethers.getContractFactory("ArmadaToken");
    await expect(factory.deploy("Armada", "ARMADA", [], [admin.address], [admin.address])).to.be.revertedWith("no admins");
    await expect(factory.deploy("Armada", "ARMADA", [ZeroAddress], [admin.address], [admin.address])).to.be.revertedWith("zero admin");
    await expect(factory.deploy("Armada", "ARMADA", [admin.address], [ZeroAddress], [admin.address])).to.be.revertedWith("zero minter");
    await expect(factory.deploy("Armada", "ARMADA", [admin.address], [admin.address], [ZeroAddress])).to.be.revertedWith("zero pauser");
  });

  it("Should mint/burn ok", async function () {
    // mint
    expect(await token.connect(admin).mint(operator.address, parseTokens("100"))).to.be.ok;
    expect(await token.balanceOf(operator.address)).to.eq(parseTokens("100"));

    expect(await token.connect(operator).burn(parseTokens("100"))).to.be.ok;
    expect(await token.balanceOf(operator.address)).to.eq(parseTokens("0"));

    // burn from
    const originalBal = await token.balanceOf(admin.address);
    expect(await token.connect(admin).approve(operator.address, parseTokens("100")));
    expect(await token.allowance(admin.address, tokenAddress));
    expect(await token.connect(operator).burnFrom(admin.address, parseTokens("100"))).to.be.ok;

    const newBal = await token.connect(admin).balanceOf(admin.address);
    expect(originalBal - newBal).to.eq(parseTokens("100"));
  });

  it("Should pause/unpause ok", async function () {
    // pause
    expect(await token.connect(admin).pause()).to.be.ok;
    expect(await token.paused()).to.be.true;

    // unpause
    expect(await token.connect(admin).unpause()).to.be.ok;
    expect(await token.paused()).to.be.false;
  });
});
