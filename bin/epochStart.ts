// USAGE: npx ts-node bin/makeNewId.ts
// Round epoch start to Wednesday at 16:00 UTC
const date = new Date();
date.setUTCHours(16, 0, 0, 0);
// Get current day (0 = Sunday, 3 = Wednesday)
const currentDay = date.getUTCDay();
// Calculate days to subtract to reach previous Wednesday
const daysToSubtract = (currentDay - 3 + 7) % 7 || 7; // If result is 0, subtract 7 days
date.setUTCDate(date.getUTCDate() - daysToSubtract);
const epochStart = Math.round(date.getTime() / 1000);
console.log(epochStart);
