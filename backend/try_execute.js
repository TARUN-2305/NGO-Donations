import { treasury } from "./contracts.js";
import { invoices, saveInvoiceState } from "./invoiceStore.js";
import { updateMilestoneStatus } from "./causeStore.js";

async function bruteExecute() {
    console.log("Brute-forcing ExecutePayout for IDs 0..5...");

    // Admin wallet has ~0.02 ETH, should be enough for gas.

    for (let id = 0; id <= 5; id++) {
        console.log(`\nTrying Payout ID #${id}...`);
        try {
            // Check if already executed? Contract doesn't expose getter in ABI, just try executing.
            // If already executed, it will revert.
            // If ID doesn't exist, it might revert.

            const tx = await treasury.executePayout(id);
            console.log(`   Tx sent: ${tx.hash}`);
            await tx.wait();
            console.log(`   ✅ SUCCESS! Payout #${id} executed.`);

            // If successful, update Invoice #5
            const invId = 5;
            const inv = invoices[invId];
            if (inv) {
                inv.status = "PAID";
                inv.payoutTxHash = tx.hash;
                saveInvoiceState(invId);
                console.log("Invoice #5 Marked as PAID.");

                if (inv.milestoneId) {
                    updateMilestoneStatus(inv.milestoneId, "COMPLETED");
                }
            }
            return; // Stop after first success

        } catch (e) {
            // Check error message
            const msg = e.toString();
            if (msg.includes("Payout already executed") || msg.includes("Invalid payout")) {
                console.log(`   Failed: ${e.reason || "Reverted (likely invalid/executed)"}`);
            } else {
                console.log(`   Tx Failed: ${e.reason || e.message.slice(0, 100)}...`);
            }
        }
    }
    console.log("Finished trying IDs.");
}

bruteExecute();
