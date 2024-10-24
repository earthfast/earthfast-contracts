import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, SignerWithAddress, ZeroHash } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { expectEvent, fixtures } from "../lib/test";
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

  // beforeEach(async function () {
  //   const fixture = await loadFixture(deployFixture);

  // });

  // TODO: add gas funds
  // FIXME: figure out how to have non adaptor project creator
  it("should send and receive messages between chains", async function () {
    const fixture = await loadFixture(deployFixture);

    // check that no projects exist yet
    let projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(0);

    const admin = fixture.admin;
    const chainSelector = fixture.config.toObject(true).chainSelector_;
    const sender = fixture.ccipSenderAdaptor;
    const receiver = fixture.ccipReceiverAdaptor;
    const senderAddress = await sender.getAddress();
    const receiverAddress = await receiver.getAddress();

    const createProjectData: ArmadaCreateProjectData = {
      name: "Test Project",
      owner: receiverAddress,
      email: "test@test.com",
      content: "https://test.com/content",
      checksum: ZeroHash,
      metadata: "{}"
    };

    const abiCoder = new ethers.AbiCoder();

    // Encode message
    const encodedData = abiCoder.encode(
      ["string", "address", "string", "string", "bytes32", "string"],
      [createProjectData.name, createProjectData.owner, createProjectData.email, createProjectData.content, createProjectData.checksum, createProjectData.metadata]
    );    
    const message = await sender.createMessage(
      await projects.getAddress(),
      encodedData,
      "createProject(ArmadaCreateProjectData)",
      receiverAddress,
      PayFeesIn.LINK
    );

    // log the message details
    console.log("destinationChainSelector:", chainSelector);
    console.log("message:", JSON.stringify(message, (_, v) => typeof v === 'bigint' ? v.toString() : v));
    console.log("payFeesIn:", PayFeesIn.LINK);
    console.log("project address:", project.address);
    console.log("projectsAddress:", await projects.getAddress());
    console.log("senderAddress:  ", senderAddress);
    console.log("receiverAddress:", receiverAddress);

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

    let blockNumber = await ethers.provider.getBlockNumber();
    console.log("Current block number:", blockNumber);

    // // FIXME: grant project creator role to sender
    expect(
      await projects
        .connect(admin)
        .grantRole(projects.PROJECT_CREATOR_ROLE(), receiverAddress)
    ).to.be.ok;

    expect(await fixture.ccipReceiverAdaptor.checkProjectCreatorRole()).to.be.true;

    await sender
      .connect(admin)
      .sendMessage(
        chainSelector,
        messageCopy,
        PayFeesIn.LINK
      );

    console.log("message sent");

    // check that the message was received by looking at the event and mapping
    // await expectEvent(receiver, receiver, "MessageReceived");

    // check that the project count was incremented
    projectCount = await projects.getProjectCount();
    expect(projectCount).to.equal(1);

    // TODO: check the ProjectCreated event
    // const [projectId] = await expectEvent(receiverAddress, projects, "ProjectCreated");
    // expect(projectId).to.not.equal(ZeroHash);

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

});
