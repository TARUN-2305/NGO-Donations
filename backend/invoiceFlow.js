import { ethers } from "ethers";
import crypto from "crypto";
import { invoiceVerifier, treasury } from "./contracts.js";
import { createInvoice, vote } from "./invoiceStore.js";
import { runOCR } from "./ocr.js";
import { extractFromText } from "./extract.js";
import { verifyInvoiceWithGemini } from "./gemini.js";
import { uploadEncryptedBundle, uploadFile } from "./ipfs.js";

import { milestones, updateMilestoneStatus } from "./causeStore.js";

const QUORUM = 2;

export async function submitInvoice({ filePath, vendor, amount, milestoneId }) {
  if (milestoneId) {
    const ms = milestones[milestoneId];
    if (ms && amount > ms.allocation) {
      throw new Error(`Claim info exceeds milestone allocation (Limit: ${ms.allocation})`);
    }
  }

  const text = await runOCR(filePath);
  const extracted = extractFromText(text);

  const mlResult = await verifyInvoiceWithGemini({
    vendorAddress: vendor,
    claimedAmount: amount,          // admin-entered
    extractedAmount: extracted.amount,
    invoiceNumber: extracted.invoiceNumber,
    invoiceDate: extracted.date,
    rawTextSnippet: text.slice(0, 1000) // optional, capped
  });

  const fileCid = await uploadFile(filePath);

  const bundle = {
    vendor,
    claimedAmount: amount,
    ocrText: text,
    extracted,
    mlResult,
    fileCid,
    milestoneId
  };

  const ipfsResult = await uploadEncryptedBundle(bundle);


  const invoice = createInvoice({
    vendor,
    amount,
    text,
    extracted,
    mlResult,
    fileCid,
    milestoneId,
    ipfs: ipfsResult
  });

  return invoice;
}

export async function adminVote(invoiceId, admin) {
  const inv = vote(invoiceId, admin);

  if (inv.votes.length >= QUORUM && inv.status === "PENDING") {
    console.log(`[Invoice #${inv.id}] Quorum reached. Initiating Payout Protocol...`);

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(inv.mlResult))
      .digest();

    // 1. Attest on InvoiceVerifier
    try {
      console.log(`1. Attesting to InvoiceVerifier...`);
      const attestTx = await invoiceVerifier.attestInvoice(
        inv.ipfs.cid,
        2,
        inv.mlResult.credibility_score,
        hash
      );
      await attestTx.wait();
      console.log(`   Attested! Tx: ${attestTx.hash}`);
    } catch (err) {
      console.warn("   Attestation warning (might be already attested):", err.message);
    }

    // 2. Queue Payout on Treasury
    try {
      // Conversion: 1 ETH = 2 Lakh INR
      const RATE = 200000;
      const ethAmount = (Number(inv.amount) / RATE).toFixed(6);
      console.log(`2. Queueing payout for ₹${inv.amount} (~${ethAmount} ETH) to ${inv.vendor}`);

      const amountWei = ethers.parseEther(ethAmount.toString());
      const tx = await treasury.queuePayout(inv.vendor, amountWei);
      console.log(`   Queue Tx sent: ${tx.hash}`);
      const receipt = await tx.wait();

      // 3. Find PayoutID from logs
      let payoutId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = treasury.interface.parseLog(log);
          if (parsed && parsed.name === "PayoutQueued") {
            payoutId = parsed.args[0]; // id is first arg
            console.log(`   Event Found: PayoutQueued #${payoutId}`);
            break;
          }
        } catch (e) { /* ignore */ }
      }

      if (payoutId !== null) {
        console.log(`3. Executing Payout #${payoutId}...`);
        const execTx = await treasury.executePayout(payoutId);
        console.log(`   Execution Tx sent: ${execTx.hash}`);
        await execTx.wait();
        console.log(`   ✅ Payout Complete!`);

        inv.status = "PAID";
        inv.payoutTxHash = execTx.hash;

        // 4. Update Milestone Status
        if (inv.milestoneId) {
          console.log(`   Updating Milestone #${inv.milestoneId} to 'COMPLETED'`);
          updateMilestoneStatus(inv.milestoneId, "COMPLETED");
        }
      } else {
        console.warn("   ⚠️ Could not find PayoutQueued event in receipt. Marked as APPROVED_QUEUED.");
        inv.status = "APPROVED_QUEUED";
      }

    } catch (err) {
      console.error("   ❌ CRITICAL PAYOUT ERROR:", err);
      // Do not fail the vote itself, but log the error. 
      // Admin might need to retry via manual execution endpoint.
    }
  }

  // Persist the status change
  const { saveInvoiceState } = await import("./invoiceStore.js");
  saveInvoiceState(inv.id);

  return inv;
}

export async function executePayout(invoiceId) {
  // Placeholder for future implementation
  return { status: "Manual execution required via contract" };
}

