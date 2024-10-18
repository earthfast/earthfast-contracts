import { expect } from "chai";
import { Result, SignerWithAddress, ZeroHash } from "ethers";
import hre from "hardhat";
import { expectEvent, fixtures, mine } from "../lib/test";
import { approve, parseTokens, parseUSDC, signers } from "../lib/util";

import { ArmadaCreateProjectData } from "../typechain-types/contracts/ArmadaTypes";
import { ArmadaProjects } from "../typechain-types/contracts/ArmadaProjects";

import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";

// https://dev.to/olanetsoft/cross-chain-governance-with-openzeppelin-governor-and-axelar-53b8
describe("CCMPTest", function () {
  let admin: SignerWithAddress;
  let operator: SignerWithAddress;
  let project: SignerWithAddress;

  let projects: ArmadaProjects;

  let axelarGateway: IAxelarGateway;
  let ccmpReceiver: CCMPReceiver;
  let ccmpSender: CCMPSender;

  async function fixture() {
    ({ admin, operator, project } = await signers(hre));
    ({ projects } = await fixtures(hre));

    // Deploy Axelar Mock contracts
    const MockAxelarGatewayFactory = await hre.ethers.getContractFactory("MockAxelarGateway");
    axelarGateway = await MockAxelarGatewayFactory.deploy();
    const MockAxelarGasServiceFactory = await hre.ethers.getContractFactory("MockAxelarGasService");
    const axelarGasService = await MockAxelarGasServiceFactory.deploy();

    // Deploy CCMPSender
    const CCMPSenderFactory = await hre.ethers.getContractFactory("CCMPSender");
    ccmpSender = await CCMPSenderFactory.deploy(axelarGateway.getAddress(), axelarGasService.getAddress());

    // Deploy CCMPReceiver
    const CCMPReceiverFactory = await hre.ethers.getContractFactory("CCMPReceiver");
    ccmpReceiver = await CCMPReceiverFactory.deploy(axelarGateway.getAddress(), projects.getAddress());
  }

  before(async function () {
    await fixture();
  });

  // it("Should create project on destination chain", async function () {
  //   const createProjectData: ArmadaCreateProjectData = {
  //     name: "Test Project",
  //     owner: project.address,
  //     email: "test@test.com",
  //     content: "https://test.com/content",
  //     checksum: ZeroHash,
  //     metadata: "{}"
  //   };

  //   const message = await projects.createMessage(projects.getAddress(), abi.encode(createProjectData), "createProject(ArmadaCreateProjectData)");
  //   const result = await expectReceipt(registry.connect(admin).unsafeSendMessage(message));
  // });

  it("Should encode and decode CreateProjectData", async function () {
    const createProjectData: ArmadaCreateProjectData = {
      name: "Test Project",
      owner: project.address,
      email: "test@test.com",
      content: "https://test.com/content",
      checksum: ZeroHash,
      metadata: "{}"
    };

    const abiCoder = new ethers.AbiCoder();

    // Encode message
    const encodedData = abiCoder.encode(
      ["tuple(string,address,string,string,bytes32,string)"],
      [Object.values(createProjectData)]
    );

    const message = await ccmpSender.createMessage(
      await projects.getAddress(),
      encodedData,
      "createProject(ArmadaCreateProjectData)"
    );

    console.log("Encoded message:", message);

    // Decode message
    const [decodedMessage] = abiCoder.decode(
      ["tuple(address,bytes4,bytes)"],
      message
    );

    console.log("Decoded message:", decodedMessage);

    expect(decodedMessage[0]).to.equal(await projects.getAddress());
    expect(decodedMessage[1]).to.equal(
      ethers.id("createProject(ArmadaCreateProjectData)").slice(0, 10)
    );
    
    const [decodedCreateProjectData] = abiCoder.decode(
      ["tuple(string,address,string,string,bytes32,string)"],
      decodedMessage[2]
    );

    expect(decodedCreateProjectData).to.deep.equal(Object.values(createProjectData));
  });

});
