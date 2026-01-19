import { ethers } from "ethers";

const logData = "0x000000000000000000000000d0bdb0e48440063f09ea680010ec8917f5fc1e9c000000000000000000000000000000000000000000000000000000e35fa931a0000000000000000000000000000000000000000000000000000000000000000696e361c";
// Removing prefix 0x and breaking into 32 byte chunks (64 chars)
const raw = logData.slice(2);
const chunk1 = raw.slice(0, 64);
const chunk2 = raw.slice(64, 128);
const chunk3 = raw.slice(128, 192);

console.log("Chunk 1 (Address?):", chunk1);
console.log("Chunk 2 (Amount?):", chunk2);
console.log("Chunk 3 (ID?):", chunk3);

// If first chunk is address, then Recipient is FIRST.
// Event signature likely: PayoutQueued(address,uint256,uint256)
console.log("Testing PayoutQueued(address,uint256,uint256):", ethers.id("PayoutQueued(address,uint256,uint256)"));
// 0xeb1eaa2a... Matches?
