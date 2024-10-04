// USAGE: npx ts-node bin/keccak256.ts <text>
import * as ethers from "ethers";
const text = process.argv[2];
console.log(`keccak256(${text})`);
const id = ethers.solidityKeccak256(["string"], [text]);
console.log(id);
