// USAGE: npx ts-node bin/makeNewId.ts
const date = new Date();
date.setUTCHours(0, 0, 0, 0);
date.setUTCDate(date.getUTCDate() - date.getUTCDay());
console.log(`Setting epochStart to ${date}`);
const epochStart = Math.round(date.getTime() / 1000);
console.log(epochStart);
