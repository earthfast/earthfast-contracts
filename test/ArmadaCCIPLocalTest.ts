import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, SignerWithAddress, ZeroHash } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { expectEvent, expectReceipt, fixtures } from "../lib/test";
import { signers } from "../lib/util";

import { ArmadaNodes } from "../typechain-types";
import { ArmadaProjects } from "../typechain-types";
import { ArmadaRegistry } from "../typechain-types";
import { ArmadaReservations } from "../typechain-types";
import { CCIPLocalSimulator } from "../typechain-types";
import { USDC } from "../typechain-types/contracts/test/USDC";

// https://github.com/smartcontractkit/ccip-basic-operations-hardhat
// https://github.com/smartcontractkit/chainlink-local
// https://docs.chain.link/chainlink-local/build/ccip/hardhat/local-simulator
// https://github.com/smartcontractkit/ccip-starter-kit-hardhat/blob/main/test/no-fork/Example5.spec.ts

describe("CCIP Local Simulator Test", function () {

  enum PayFeesIn {
    Native,
    LINK,
  }

  let ccipLocalSimulator: Contract;
  let sourceChain: Contract;
  let destinationChain: Contract;
  let sourceChainId: number;
  let destinationChainId: number;

  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let nodes: ArmadaNodes;
  let projects: ArmadaProjects;
  let registry: ArmadaRegistry;
  let reservations: ArmadaReservations;

  let usdc: USDC;
  let nodesAddress: string;
  let projectsAddress: string;
  let registryAddress: string;
  let reservationsAddress: string;

  let snapshotId: string;

  let fixture;

  // TEST
  // Projects.createProject
  // Projects.depositProjectEscrow
  // Projects.withdrawProjectEscrow
  // Projects.setProjectContent
  // Reservations.createReservations
  // Reservations.deleteReservations

  async function deployFixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ usdc, nodes, projects, registry, reservations } = await fixtures(hre));

    // set contract addresses as string
    nodesAddress = await nodes.getAddress();
    projectsAddress = await projects.getAddress();
    registryAddress = await registry.getAddress();
    reservationsAddress = await reservations.getAddress();

    // Deploy CCIPLocalSimulator
    const CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
    ccipLocalSimulator = await CCIPLocalSimulator.deploy();

    const config: {
      chainSelector_: bigint;
      sourceRouter_: string;
      destinationRouter_: string;
      wrappedNative_: string;
      linkToken_: string;
      ccipBnM_: string;
      ccipLnM_: string;
    } = await ccipLocalSimulator.configuration();

    // deploy CCIPSenderAdaptor
    const CCIPSenderAdaptor = await ethers.getContractFactory("CCIPSenderAdaptor");
    const ccipSenderAdaptor = await CCIPSenderAdaptor.deploy(config.sourceRouter_, config.linkToken_);

    // deploy CCIPReceiverAdaptor
    const CCIPReceiverAdaptor = await ethers.getContractFactory("CCIPReceiverAdaptor");
    const ccipReceiverAdaptor = await CCIPReceiverAdaptor.deploy(config.destinationRouter_, nodesAddress, projectsAddress, registryAddress, reservationsAddress);

    return { config, ccipSenderAdaptor, ccipReceiverAdaptor, admin };
  }

  before(async function () {
    fixture = await loadFixture(deployFixture);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.ethers.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.ethers.provider.send("evm_snapshot", []);
  });

  // FIXME: simplify adding gas funds
  // FIXME: figure out how to have non adaptor project creator
  it("should send and receive messages between chains", async function () {
    // check that no projects exist yet
    let projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(0);

    const admin = fixture.admin;
    const chainSelector = fixture.config.toObject(true).chainSelector_;
    const sender = fixture.ccipSenderAdaptor;
    const receiver = fixture.ccipReceiverAdaptor;
    const senderAddress = await sender.getAddress();
    const receiverAddress = await receiver.getAddress();
    const content = "https://test.com/content";

    const createProjectData: ArmadaCreateProjectData = {
      name: "Test Project",
      owner: receiverAddress,
      email: "test@test.com",
      content: content,
      checksum: ZeroHash,
      metadata: "{}"
    };

    const abiCoder = new ethers.AbiCoder();

    // encode createProject call data
    const createProjectCallData = projects.interface.encodeFunctionData("createProject", [createProjectData]);
    console.log("createProjectCallData:", createProjectCallData);

    // create the message
    const message = await sender.createMessage(
      await projects.getAddress(),
      createProjectCallData,
      "createProject(ArmadaCreateProjectData)",
      receiverAddress,
      PayFeesIn.LINK
    );

    const messageCopy = JSON.parse(JSON.stringify(message, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log("messageCopy:", messageCopy);

    // send native tokens for gas
    await admin.sendTransaction({
      to: senderAddress,
      value: 1_000_000_000_000_000_000n,
    });
    await ccipLocalSimulator.requestLinkFromFaucet(
      await senderAddress,
      5_000_000_000_000_000_000n
    );
    await ccipLocalSimulator.requestLinkFromFaucet(
      await receiverAddress,
      5_000_000_000_000_000_000n
    );

    // // FIXME: grant project creator role to sender
    expect(
      await projects
        .connect(admin)
        .grantRole(projects.PROJECT_CREATOR_ROLE(), receiverAddress)
    ).to.be.ok;

    const sendMessageReceipt = await expectReceipt(sender
      .connect(admin)
      .sendMessage(
        chainSelector,
        messageCopy,
        PayFeesIn.LINK
      )
    );
    console.log("message sent");

    // check that the project count was incremented
    projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(1);

    // check the ProjectCreated event
    const [projectId] = await expectEvent(sendMessageReceipt, projects, "ProjectCreated");
    expect(projectId).to.not.equal(ZeroHash);
    const projectDetails = await projects.connect(admin).getProject(projectId);
    expect(projectDetails.content).to.equal(content);


    // get the latest message details from the receiver
    // const [
    //   latestMessageId,
    //   latestMessageSourceChainSelector,
    //   latestMessageSender,
    //   latestMessage,
    // ] = await receiver.getLatestMessageDetails();

    // expect(latestMessageSourceChainSelector).to.equal(chainSelector);
    // expect(latestMessageSender).to.equal(senderAddress);
    // expect(latestMessage).to.deep.equal(message);
  });

  // TODO: update project owner
  it("should create update and delete projects via CCIP", async function () {
    // check that no projects exist yet
    let projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(0);

    const admin = fixture.admin;
    const chainSelector = fixture.config.toObject(true).chainSelector_;
    const sender = fixture.ccipSenderAdaptor;
    const receiver = fixture.ccipReceiverAdaptor;
    const senderAddress = await sender.getAddress();
    const receiverAddress = await receiver.getAddress();
    const content = "https://test.com/content";

    const createProjectData: ArmadaCreateProjectData = {
      name: "Test Project",
      owner: receiverAddress,
      email: "test@test.com",
      content: content,
      checksum: ZeroHash,
      metadata: "{}"
    };

    const abiCoder = new ethers.AbiCoder();

    // encode createProject call data
    const createProjectCallData = projects.interface.encodeFunctionData("createProject", [createProjectData]);
    console.log("createProjectCallData:", createProjectCallData);

    // create the message
    const createProjectMessage = await sender.createMessage(
      await projects.getAddress(),
      createProjectCallData,
      "createProject(ArmadaCreateProjectData)",
      receiverAddress,
      PayFeesIn.LINK
    );

    const createProjectMessageCopy = JSON.parse(JSON.stringify(createProjectMessage, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log("createProjectMessageCopy:", createProjectMessageCopy);

    // send native tokens for gas
    await admin.sendTransaction({
      to: senderAddress,
      value: 1_000_000_000_000_000_000n,
    });
    await ccipLocalSimulator.requestLinkFromFaucet(
      await senderAddress,
      5_000_000_000_000_000_000n
    );
    await ccipLocalSimulator.requestLinkFromFaucet(
      await receiverAddress,
      5_000_000_000_000_000_000n
    );

    // FIXME: grant project creator role to sender
    expect(
      await projects
        .connect(admin)
        .grantRole(projects.PROJECT_CREATOR_ROLE(), receiverAddress)
    ).to.be.ok;

    const createProjectMessageReceipt = await expectReceipt(sender
      .connect(admin)
      .sendMessage(
        chainSelector,
        createProjectMessageCopy,
        PayFeesIn.LINK
      )
    );
    console.log("createProject message sent");

    // check that the project count was incremented
    projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(1);

    // check the ProjectCreated event
    const [projectId] = await expectEvent(createProjectMessageReceipt, projects, "ProjectCreated");
    expect(projectId).to.not.equal(ZeroHash);
    const projectDetails = await projects.connect(admin).getProject(projectId);
    expect(projectDetails.content).to.equal(content);

    // encode setProjectContent call data
    const newContent = "new content";
    const updateProjectCallData = projects.interface.encodeFunctionData("setProjectContent", [projectId, newContent, ZeroHash]);
    console.log("updateProjectCallData:", updateProjectCallData);

    const updateProjectMessage = await sender.createMessage(
      await projects.getAddress(),
      updateProjectCallData,
      "setProjectContent(bytes32,string,bytes32)",
      receiverAddress,
      PayFeesIn.LINK
    );

    const updateProjectMessageCopy = JSON.parse(JSON.stringify(updateProjectMessage, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log("updateProjectMessageCopy:", updateProjectMessageCopy);

    const updateProjectMessageReceipt = await expectReceipt(sender
      .connect(admin)
      .sendMessage(
        chainSelector,
        updateProjectMessageCopy,
        PayFeesIn.LINK
      )
    );
    console.log("updateProject message sent");
    const projectDetailsNew = await projects.connect(admin).getProject(projectId);
    expect(projectDetailsNew.content).to.equal(newContent);

    // check that the project count didn't change
    projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(1);

    // Update and check email name
    const newEmail = "new email";
    const newName = "new name";
    const updateEmailNameCallData = projects.interface.encodeFunctionData("setProjectProps", [projectId, newName, newEmail]);
    console.log("updateEmailNameCallData:", updateEmailNameCallData);

    const updateEmailNameMessage = await sender.createMessage(
      await projects.getAddress(),
      updateEmailNameCallData,
      "setProjectProps(bytes32,string,string)",
      receiverAddress,
      PayFeesIn.LINK
    );

    const updateEmailNameMessageCopy = JSON.parse(JSON.stringify(updateEmailNameMessage, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log("updateEmailNameMessageCopy:", updateEmailNameMessageCopy);

    const updateEmailNameMessageReceipt = await expectReceipt(sender
      .connect(admin)
      .sendMessage(
        chainSelector,
        updateEmailNameMessageCopy,
        PayFeesIn.LINK
      )
    );
    console.log("updateEmailName message sent");
    const projectDetailsEmailName = await projects.connect(admin).getProject(projectId);
    expect(projectDetailsEmailName.email).to.equal(newEmail);
    expect(projectDetailsEmailName.name).to.equal(newName);

    // check that the project count didn't change
    projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(1);

    // delete project
    const deleteProjectCallData = projects.interface.encodeFunctionData("deleteProject", [projectId]);
    console.log("deleteProjectCallData:", deleteProjectCallData);

    const deleteProjectMessage = await sender.createMessage(
      await projects.getAddress(),
      deleteProjectCallData,
      "deleteProject(bytes32)",
      receiverAddress,
      PayFeesIn.LINK
    );

    const deleteProjectMessageCopy = JSON.parse(JSON.stringify(deleteProjectMessage, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log("deleteProjectMessageCopy:", deleteProjectMessageCopy);

    const deleteProjectMessageReceipt = await expectReceipt(sender
      .connect(admin)
      .sendMessage(
        chainSelector,
        deleteProjectMessageCopy,
        PayFeesIn.LINK
      )
    );
    console.log("deleteProject message sent");

    // check that the project count was decremented
    projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(0);
  });

});
