import { ethers } from "ethers";

const target = "0xeb1eaa2a786207b70f34a8848050390200b4e2f1b591ec36e4aa767e34cd0660";

const guesses = [
    "PayoutQueued(uint256,address,uint256)",
    "PayoutQueued(address,uint256,uint256)",
    "PayoutQueued(uint256,uint256,address)",
    "PayoutQueued(uint256,uint256,uint256)",
    "PayoutQueued(uint256,address)",
    "PayoutQueued(address,uint256)",
    "PayoutQueued(uint256,uint256)",
    "PayoutQueued(uint256,uint256,uint256,uint256)",
    "PayoutQueued(uint256,uint256,uint256,address)",
    "PayoutQueued(uint256,uint256,address,uint256)",
    "PayoutQueued(uint256,address,uint256,uint256,uint256)",
    "PayoutQueued(uint256,address,uint256,uint256)"
];

console.log(`Target: ${target}`);
guesses.forEach(g => {
    const h = ethers.id(g);
    if (h === target) console.log(`MATCH: ${g}`);
});
