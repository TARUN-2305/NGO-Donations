import crypto from "crypto";
import { invoiceVerifier, treasury } from "./contracts.js";
import { createInvoice, vote } from "./invoiceStore.js";
import { runOCR } from "./ocr.js";
import { extractFromText } from "./extract.js";
import { verifyInvoiceWithGemini } from "./gemini.js";
import { uploadEncryptedBundle } from "./ipfs.js";

const QUORUM = 2;

export async function submitInvoice({ filePath, vendor, amount }) {
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

const bundle = {
  vendor,
  claimedAmount: amount,
  ocrText: text,
  extracted,
  mlResult
};

const ipfsResult = await uploadEncryptedBundle(bundle);


  const invoice = createInvoice({
  vendor,
  amount,
  text,
  extracted,
  mlResult,
  ipfs: ipfsResult
});

  return invoice;
}

export async function adminVote(invoiceId, admin) {
  const inv = vote(invoiceId, admin);

  if (inv.votes.length >= QUORUM && inv.status === "PENDING") {
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(inv.mlResult))
      .digest();

    await invoiceVerifier.attestInvoice(
  inv.ipfs.cid,
  2,
  inv.mlResult.credibility_score,
  hash
);


    await treasury.queuePayout(inv.vendor, inv.amount);
    inv.status = "APPROVED";
  }

  return inv;
}

