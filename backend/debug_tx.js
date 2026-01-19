import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

async function check() {
    console.log("START_DEBUG");
    const tx = "0xf22f4137b6acbe8b3c0ab1b1c0fb58d4f81187e1b2310a2fd4ecda38142de466";
    const receipt = await provider.getTransactionReceipt(tx);
    if (!receipt) {
        console.log("Receipt not found");
        return;
    }
    receipt.logs.forEach((log, i) => {
        console.log(`LOG_${i}_TOPICS: ${JSON.stringify(log.topics)}`);
        console.log(`LOG_${i}_DATA: ${log.data}`);
    });
    console.log("END_DEBUG");
}

check();
