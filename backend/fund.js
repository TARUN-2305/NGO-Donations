import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const treasuryAddress = process.env.TREASURY;

async function fundTreasury() {
    console.log(`Funding Treasury: ${treasuryAddress}`);
    const tx = await wallet.sendTransaction({
        to: treasuryAddress,
        value: ethers.parseEther("0.03")
    });
    console.log(`Tx Sent: ${tx.hash}`);
    await tx.wait();
    console.log("Treasury Fund Complete!");
}

fundTreasury();
