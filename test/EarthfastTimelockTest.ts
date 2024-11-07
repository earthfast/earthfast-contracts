import { expect } from "chai";
import { ZeroAddress } from "ethers";
import hre from "hardhat";
import { signers } from "../lib/util";
import { EarthfastTimelock } from "../typechain-types/contracts/EarthfastTimelock";

describe("EarthfastTimelock", function () {
  it("Should check constructor args", async function () {
    const { deployer } = await signers(hre);
    const factory = await hre.ethers.getContractFactory("EarthfastTimelock");

    await expect(factory.deploy(0, [], [ZeroAddress], [ZeroAddress])).to.be.revertedWith("no admins");
    await expect(factory.deploy(0, [ZeroAddress], [ZeroAddress], [ZeroAddress])).to.be.revertedWith("zero admin");

    const timelock = <EarthfastTimelock>await factory.deploy(0, [deployer.address], [ZeroAddress], [ZeroAddress]);
    expect(await timelock.getRoleAdmin(timelock.TIMELOCK_ADMIN_ROLE())).to.be.eq(await timelock.TIMELOCK_ADMIN_ROLE());
    expect(await timelock.hasRole(timelock.DEFAULT_ADMIN_ROLE(), deployer.address)).to.be.false;
    expect(await timelock.hasRole(timelock.TIMELOCK_ADMIN_ROLE(), deployer.address)).to.be.true;
  });
});
