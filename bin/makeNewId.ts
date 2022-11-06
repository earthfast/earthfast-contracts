// USAGE: npx ts-node bin/makeNewId.ts <nonce>
import * as ethers from "ethers";
const text = process.argv[2];
const nonce = parseInt(text);
console.log(`keccak256(${nonce})`);
const id = ethers.utils.solidityKeccak256(["uint256"], [nonce]);
console.log(id);
