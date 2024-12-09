export const EPOCH_START_HOUR = 16; // 16:00 UTC or 11:00 EST
export const EPOCH_START_DAY = 3; // Wednesday

export function getEpochStart() {
  const now = new Date();
  const result = new Date();

  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();

  // Special case if today is EPOCH_START_DAY and hour it's past EPOCH_START_HOUR, epoch start is today
  let daysToSubtract;
  if (currentDay === EPOCH_START_DAY && currentHour >= EPOCH_START_HOUR) {
    daysToSubtract = 0;
  } else {
    daysToSubtract = (currentDay - EPOCH_START_DAY + 7) % 7 || 7;
  }

  result.setUTCDate(now.getUTCDate() - daysToSubtract);
  result.setUTCHours(EPOCH_START_HOUR, 0, 0, 0);

  return result;
}
