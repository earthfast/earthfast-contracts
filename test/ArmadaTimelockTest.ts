import { AddressZero } from "@ethersproject/constants";
import { expect } from "chai";
import hre from "hardhat";
import { signers } from "../lib/util";
import { ArmadaTimelock } from "../typechain-types/contracts/ArmadaTimelock";

describe("ArmadaTimelock", function () {
  it("Should check constructor args", async function () {
    const { deployer } = await signers(hre);
    const factory = await hre.ethers.getContractFactory("ArmadaTimelock");

    await expect(factory.deploy(0, [], [AddressZero], [AddressZero])).to.be.revertedWith("no admins");
    await expect(factory.deploy(0, [AddressZero], [AddressZero], [AddressZero])).to.be.revertedWith("zero admin");

    const timelock = <ArmadaTimelock>await factory.deploy(0, [deployer.address], [AddressZero], [AddressZero]);
    expect(await timelock.getRoleAdmin(timelock.TIMELOCK_ADMIN_ROLE())).to.be.eq(await timelock.TIMELOCK_ADMIN_ROLE());
    expect(await timelock.hasRole(timelock.DEFAULT_ADMIN_ROLE(), deployer.address)).to.be.false;
    expect(await timelock.hasRole(timelock.TIMELOCK_ADMIN_ROLE(), deployer.address)).to.be.true;
  });
});
