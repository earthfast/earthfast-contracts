// USAGE: npx ts-node bin/epochStart.ts
// Round epoch start to next Wednesday at 16:00 UTC

const EPOCH_START_HOUR = 16; // 16:00 UTC or 11:00 EST
const EPOCH_START_DAY = 3; // Wednesday

function getEpochStart() {
  const now = new Date();
  const result = new Date();

  // Get current day and hour in UTC
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();

  // Calculate days to subtract to reach previous Wednesday
  let daysToSubtract = currentDay - EPOCH_START_DAY;
  if (daysToSubtract <= 0) {
    daysToSubtract += 7;
  }

  // Special case: if it's EPOCH_START_DAY
  if (currentDay === EPOCH_START_DAY) {
    if (currentHour < EPOCH_START_HOUR) {
      // If it's EPOCH_START_DAY before EPOCH_START_HOUR, go back 7 days
      daysToSubtract = 7;
    } else {
      // If it's EPOCH_START_DAY after EPOCH_START_HOUR, stay on current day
      daysToSubtract = 0;
    }
  }

  result.setUTCDate(now.getUTCDate() - daysToSubtract);
  result.setUTCHours(EPOCH_START_HOUR, 0, 0, 0);

  return result;
}

// Example usage:
const date = getEpochStart();
console.log(date.toUTCString());
console.log(date.getTime() / 1000);
