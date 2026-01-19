import { runOCR } from "./ocr.js";
import path from "path";

const invoiceDir = String.raw`C:\Users\tarun\OneDrive\Desktop\web3-ngo-donation - Copy\Project\Logo n Invoices\Invoice`;

// Test filenames
const files = [
    "BrightFuture Supplies Pvt Ltd, Industrial Area, Pune.pdf",
    "Edutech.pdf"
];

async function test() {
    for (const file of files) {
        console.log(`\n--- Testing ${file} ---`);
        const fullPath = path.join(invoiceDir, file);
        try {
            const text = await runOCR(fullPath);
            console.log("EXTRACTED TEXT START:");
            console.log(text.slice(0, 500)); // Show first 500 chars
            console.log("...EXTRACTED TEXT END");
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

test();
