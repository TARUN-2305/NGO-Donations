import { ethers } from "ethers";
const sig = "PayoutQueued(uint256,address,uint256)";
const hash = ethers.id(sig);
console.log(`Hash of '${sig}': ${hash}`);
const target = "0xeb1eaa2a786207b70f34a8848050390200b4e2f1b591ec36e4aa767e34cd0660";
console.log(`Target: ${target}`);
console.log(`Match? ${hash === target}`);
