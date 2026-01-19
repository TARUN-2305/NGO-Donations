import { ethers } from "ethers";

const target = "0xeb1eaa2a786207b70f34a8848050390200b4e2f1b591ec36e4aa767e34cd0660";

const sigs = [
    "PayoutQueued(uint256,uint256,address)"
];

const h = ethers.id(sigs[0]);
console.log(`${h} vs ${target}`);
if (h === target) console.log("MATCH FOUND!");
