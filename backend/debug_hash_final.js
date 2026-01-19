import { ethers } from "ethers";

// Brute force ALL combinations including "indexed"
// The hash in logs (topics[0]) is ALWAYS the hash of "EventName(type,type,...)" WITHOUT "indexed".
// Wait, the log we saw in debug_tx.js had only 1 topic.
// That topic was "0xeb1eaa2a...".
// This means the event signature hash is "0xeb1eaa2a...".

const target = "0xeb1eaa2a786207b70f34a8848050390200b4e2f1b591ec36e4aa767e34cd0660";

const attempts = [
    "PayoutQueued(uint256,address,uint256)",
    "PayoutQueued(uint256,uint256,address)",
    "PayoutQueued(address,uint256,uint256)",
    "PayoutQueued(uint256,address,uint256,uint256)",
    "PayoutQueued(uint256,address)"
];

attempts.forEach(a => {
    console.log(`${a}: ${ethers.id(a)}`);
});
