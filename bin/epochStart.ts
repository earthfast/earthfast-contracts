// USAGE: npx ts-node bin/epochStart.ts
// Round epoch start to next Wednesday at 16:00 UTC

import { getEpochStart } from "../lib/date-util";

// Example usage:
const date = getEpochStart();
console.log(date.toUTCString());
console.log(date.getTime() / 1000);
