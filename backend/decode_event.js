import { ethers } from "ethers";

const target = "0xeb1eaa2a786207b70f34a8848050390200b4e2f1b591ec36e4aa767e34cd0660";

const possibilities = [
    "PayoutQueued(uint256,uint256,address)",
    "PayoutQueued(uint256,address,uint256)",
    "PayoutQueued(address,uint256,uint256)",
    "PayoutQueued(uint256,uint256,uint256)", // maybe amount is mostly inferred?
    // What if parameters are different?
    "PayoutQueued(uint256,address)",
    "PayoutQueued(address,uint256)",
    // Maybe different name?
    "PayoutCreated(uint256,address,uint256)",
    "PayoutScheduled(uint256,address,uint256)"
];

possibilities.forEach(sig => {
    const h = ethers.id(sig);
    if (h === target) console.log(`MATCH: ${sig}`);
    else console.log(`${h} != ${target} (${sig})`);
});
