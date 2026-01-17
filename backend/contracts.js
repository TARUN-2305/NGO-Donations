import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

export const invoiceVerifier = new ethers.Contract(
  process.env.INVOICE_VERIFIER,
  [
    "function attestInvoice(string,uint8,uint256,bytes32)"
  ],
  wallet
);

export const treasury = new ethers.Contract(
  process.env.TREASURY,
  [
    "function queuePayout(address,uint256)"
  ],
  wallet
);
