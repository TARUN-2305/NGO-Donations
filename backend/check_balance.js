import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const treasuryAddress = process.env.TREASURY;
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function checkBalance() {
    const balance = await provider.getBalance(treasuryAddress);
    const adminBal = await provider.getBalance(wallet.address);

    console.log(`\n--- ACCOUNT REPORT ---`);
    console.log(`Treasury Address: ${treasuryAddress}`);
    console.log(`Treasury Balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`Admin (Backend) Address: ${wallet.address}`);
    console.log(`Admin Balance: ${ethers.formatEther(adminBal)} ETH`);
    console.log(`\nREQUIRED ACTION: Please send 0.1 Sepolia ETH to the Treasury Address above.`);
}

checkBalance();
