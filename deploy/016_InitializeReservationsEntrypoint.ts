import hre from "hardhat";
import { attach, confirm, signers, stringify, wait } from "../lib/util";

export default main;
async function main() {
  const { guardian } = await signers(hre);

  const reservations = await attach(hre, "EarthfastReservations");
  const entrypoint = await attach(hre, "EarthfastEntrypoint");

  if (confirm(hre, `Execute EarthfastReservations.authorizeEntrypoint ${stringify([entrypoint.getAddress()])}`)) {
    await wait(reservations.connect(guardian).authorizeEntrypoint(entrypoint));
  }
}

main.tags = ["v1", "InitializeReservationsEntrypoint"];
