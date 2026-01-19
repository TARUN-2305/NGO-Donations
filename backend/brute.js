import { ethers } from "ethers";

const target = "0xeb1eaa2a786207b70f34a8848050390200b4e2f1b591ec36e4aa767e34cd0660";

// The target hash 0xeb1... is definitely PayoutQueued(uint256,uint256,address) OR something else.
// Let's brute force parameter orders.

const types = ["uint256", "address"];
function permute(arr) {
    // simple 3 param permutations
    const res = [];
    const p = [
        "PayoutQueued(uint256,uint256,address)",
        "PayoutQueued(uint256,address,uint256)",
        "PayoutQueued(address,uint256,uint256)",
        "PayoutQueued(uint256,uint256,uint256)"
    ];
    return p;
}

const candidates = permute();

candidates.forEach(c => {
    const h = ethers.id(c);
    console.log(`${c} -> ${h}`);
    if (h === target) console.log("!!! FOUND IT !!!");
});
