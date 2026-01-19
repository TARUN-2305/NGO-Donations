import { adminVote } from "./invoiceFlow.js";
import { invoices } from "./invoiceStore.js";

async function main() {
    console.log("Loading invoices...");

    // Allow time for invoices to load (synchronously imported but just in case)
    const invoiceId = 5;
    const inv = invoices[invoiceId];

    if (!inv) {
        console.log("Invoice 5 not found in memory!");
        return;
    }

    console.log(`Invoice #${invoiceId} Status: ${inv.status}, Votes: ${inv.votes.length}`);

    // Simulate a new vote to re-trigger the Payout Logic
    const newAdmin = "0x" + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
    console.log(`Voting with new admin: ${newAdmin}`);

    await adminVote(invoiceId, newAdmin);

    console.log("Done. Check logs explicitly.");
}

main();
