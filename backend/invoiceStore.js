import fs from "fs";
import path from "path";

// Persistence setup
const DATA_DIR = path.resolve("data");
const INVOICE_FILE = path.join(DATA_DIR, "invoices.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let invoices = {};
let counter = 0;

// Load initial
try {
  if (fs.existsSync(INVOICE_FILE)) {
    invoices = JSON.parse(fs.readFileSync(INVOICE_FILE));
    counter = Object.keys(invoices).length > 0 ? Math.max(...Object.keys(invoices).map(Number)) : 0;
  }
} catch (e) {
  console.error("Failed to load invoices.json:", e);
}

function saveInvoices() {
  fs.writeFileSync(INVOICE_FILE, JSON.stringify(invoices, null, 2));
}

export { invoices };

export function createInvoice(data) {
  counter++;
  invoices[counter] = {
    id: counter,
    ...data,
    votes: [],
    status: "PENDING"
  };
  saveInvoices();
  return invoices[counter];
}

export function vote(invoiceId, admin) {
  const inv = invoices[invoiceId];
  if (!inv.votes.includes(admin)) {
    inv.votes.push(admin);
    saveInvoices(); // Persist vote
  }

  // We also save if status changes, so just save always on vote interaction
  // If status changes in 'adminVote' logic (outside this file), we rely on that object reference update
  // but to be safe we might need a plain save method or just assume memory ref is enough until next write.
  // Ideally 'adminVote' calls save, but let's just expose a save helper or export it.
  // For now: Reference mutation works in memory. If the server crashes between vote and status change save, might be issue.
  // But 'createInvoice' and 'vote' persist, so that's good.

  // The 'adminVote' function in flow modifies status directly on the object.
  // We'll export a helper 'saveInvoiceState' to be called there.
  return inv;
}

export function saveInvoiceState(invoiceId) {
  if (invoices[invoiceId]) saveInvoices();
}

export function reject(invoiceId) {
  const inv = invoices[invoiceId];
  if (inv) {
    inv.status = "REJECTED";
    inv.votes = []; // Clear votes if rejected? Or keep record. Let's keep record but mark status.
    saveInvoices();
  }
  return inv;
}
