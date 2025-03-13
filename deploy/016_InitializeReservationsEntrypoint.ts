import hre from "hardhat";
import { attach, confirm, stringify, wait } from "../lib/util";

export default main;
async function main() {
  const reservations = await attach(hre, "EarthfastReservations");
  const entrypoint = await attach(hre, "EarthfastEntrypoint");

  if (confirm(hre, `Execute EarthfastReservations.authorizeEntrypoint ${stringify([entrypoint])}`)) {
    await wait(reservations.authorizeEntrypoint(entrypoint));
  }
}

main.tags = ["v1", "InitializeReservationsEntrypoint"];
