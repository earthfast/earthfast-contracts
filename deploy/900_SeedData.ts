import hre from "hardhat";

export default main;
async function main() {
  if (hre.config.seed) {
    hre.run("seed");
  }
}
