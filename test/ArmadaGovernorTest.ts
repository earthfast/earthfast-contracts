import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import chai, { expect } from "chai";
import shallowDeepEqual from "chai-shallow-deep-equal";
import { keccak256 } from "ethereumjs-util";
import { parseEther } from "ethers";
import hre from "hardhat";
import { expectEvent, expectReceipt, fixtures, mine } from "../lib/test";
import { getInterfaceID, parseTokens, signers } from "../lib/util";
import { ArmadaGovernor } from "../typechain-types/contracts/ArmadaGovernor";
import { ArmadaTimelock } from "../typechain-types/contracts/ArmadaTimelock";
import { ArmadaToken } from "../typechain-types/contracts/ArmadaToken";
import { IGovernor__factory } from "../typechain-types/factories/@openzeppelin/contracts/governance/IGovernor__factory"; // eslint-disable-line camelcase
import { IERC165__factory } from "../typechain-types/factories/@openzeppelin/contracts/utils/introspection/IERC165__factory"; // eslint-disable-line camelcase

chai.use(shallowDeepEqual);

describe("ArmadaGovernor", function () {
  let admin: SignerWithAddress;
  let deployer: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let token: ArmadaToken;
  let governor: ArmadaGovernor;
  let timelock: ArmadaTimelock;

  let snapshotId: string;

  async function fixture() {
    ({ admin, deployer, operator, project } = await signers(hre));
    ({ token, governor, timelock } = await fixtures(hre));
  }

  before(async function () {
    await fixture();
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  it("Should support interfaces", async function () {
    const IERC165 = IERC165__factory.createInterface();
    const IGovernor = IGovernor__factory.createInterface();
    const IERC165ID = getInterfaceID(IERC165);
    const IGovernorID = getInterfaceID(IGovernor);
    expect(await governor.supportsInterface(IGovernorID.xor(IERC165ID)._hex)).to.be.true;
  });

  it("Should allow zero admin", async function () {
    const factory = await hre.ethers.getContractFactory("ArmadaGovernor");
    const governor = <ArmadaGovernor>await factory.deploy(AddressZero, token.address, timelock.address, 0, 25, 0, 51);
    expect(await governor.hasRole(governor.DEFAULT_ADMIN_ROLE(), deployer.address)).to.be.false;
  });

  it("Should grab proposal threshold ok", async function () {
    expect(await governor.connect(admin).proposalThreshold()).to.eq(parseTokens("0"));
  });

  it("Should add proposal and allow cast vote ok", async function () {
    // proposal configs
    const team = operator;
    const voter = project;
    const grantAmount = parseTokens("1");
    const transferCalldata = token.interface.encodeFunctionData("transfer", [team.address, grantAmount]);
    const proposalDescription = "Proposal #1: Give grant to team";

    // check balance before proposal
    expect((await token.balanceOf(admin.address)).toString()).to.eq(parseTokens("1000000000"));
    expect(await token.balanceOf(team.address)).to.eq(parseTokens("0"));

    // send governance some erc20 tokens and eth to fill up governance treasury
    // timelock in this case holds the governance treasury
    expect(await token.connect(admin).transfer(timelock.address, parseTokens("100"))).to.be.ok;
    expect(await admin.sendTransaction({ to: timelock.address, value: parseEther("1.0") })).to.be.ok;

    // check governance treasury balance
    expect(await token.balanceOf(timelock.address)).to.eq(parseTokens("100"));
    expect(await hre.ethers.provider.getBalance(timelock.address)).to.eq(parseEther("1.0"));

    // send voter some erc20 tokens and eth
    expect(await token.connect(admin).mint(voter.address, parseTokens("100"))).to.be.ok;
    expect(await token.balanceOf(voter.address)).to.be.eq(parseTokens("100"));
    expect(await admin.sendTransaction({ to: voter.address, value: parseEther("1.0") })).to.be.ok;

    // delegate voter
    // must delegate before proposal is added, proposal snapshots voters before proposal
    // https://forum.openzeppelin.com/t/governor-hardhat-testing/15290
    await token.connect(voter).delegate(voter.address);
    await token.connect(admin).delegate(admin.address);
    await mine(hre, 1);

    // verify vote weight after delegation
    const latestBlock = await hre.ethers.provider.getBlock("latest");
    expect(await governor.getVotes(voter.address, latestBlock.number - 1)).to.eq(parseTokens("100"));

    // add proposal
    const addProposal = await expectReceipt(governor.connect(admin).propose([token.address], [0], [transferCalldata], proposalDescription));
    const [proposalId] = await expectEvent(addProposal, governor, "ProposalCreated");
    expect(proposalId).to.not.be.NaN;

    // do the vote
    const castVote = await expectReceipt(governor.connect(voter).castVoteWithReason(proposalId, 1, "some reason"));
    const [voterAddress, , , voteWeight] = await expectEvent(castVote, governor, "VoteCast");

    expect(voterAddress).to.eq(voter.address);
    expect(voteWeight).to.eq(parseTokens("100"));
    await governor.connect(admin).castVoteWithReason(proposalId, 1, "some reason");

    // mine to past the deadline for possible voting
    const eta = await governor.proposalDeadline(proposalId);
    await mine(hre, eta.toNumber());

    // queue proposal
    const queueProposal = await expectReceipt(governor.connect(admin).queue([token.address], [0], [transferCalldata], keccak256(Buffer.from(proposalDescription))));
    const queueProposalRes = await expectEvent(queueProposal, governor, "ProposalQueued");
    expect(queueProposalRes).to.shallowDeepEqual([proposalId]);

    // execute proposal
    expect(await governor.connect(admin).execute([token.address], [0], [transferCalldata], keccak256(Buffer.from(proposalDescription)))).to.be.ok;

    // check balance to ensure proposal went through
    expect(await token.balanceOf(team.address)).to.eq(grantAmount);
  });

  it("Should cancel proposal", async function () {
    const grant = parseTokens("1");
    const recipient = operator;
    const calldata = token.interface.encodeFunctionData("transfer", [recipient.address, grant]);
    const description = "proposal description";
    const descriptionHash = keccak256(Buffer.from(description));

    const propose = await expectReceipt(governor.connect(admin).propose([token.address], [0], [calldata], description));
    const [proposalId] = await expectEvent(propose, governor, "ProposalCreated");
    expect(proposalId).to.not.be.NaN;

    await expect(governor.connect(project).cancel([token.address], [0], [calldata], descriptionHash)).to.be.revertedWith(
      `AccessControl: account ${project.address.toLowerCase()} is missing role ${await governor.DEFAULT_ADMIN_ROLE()}`
    );

    const cancel = await expectReceipt(governor.connect(admin).cancel([token.address], [0], [calldata], descriptionHash));
    const cancelResult = await expectEvent(cancel, governor, "ProposalCanceled");
    expect(cancelResult).to.shallowDeepEqual(proposalId);

    expect(await token.balanceOf(recipient.address)).to.eq(0);
  });
});
