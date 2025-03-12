import hre from "hardhat";
import { attach, confirm, signers, stringify, wait } from "../lib/util";

type EarthfastEntrypoint = import("../typechain-types").EarthfastEntrypoint;

export default main;
async function main() {
  const { deployer, guardian } = await signers(hre);

  const reservations = await attach(hre, "EarthfastReservations");

  const entrypoint = <EarthfastEntrypoint>await registry.getEntrypoint();
  if (confirm(hre, `Execute EarthfastReservations.authorizeEntrypoint ${stringify([entrypoint])}`)) {
    await wait(reservations.authorizeEntrypoint(entrypoint));
  }
}

main.tags = ["v1", "InitializeReservationsEntrypoint"];
