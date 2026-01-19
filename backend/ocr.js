import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Real Text Extraction for PDFs
// Logic: If file is PDF, use pdf-parse. If image, use Tesseract (skipped here due to errors, or we can assume PDFs for invoices).
export async function runOCR(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    // Check for PDF signature
    if (filePath.toLowerCase().endsWith(".pdf")) {
      const data = await pdf(dataBuffer);
      console.log("[OCR] PDF Text extracted length:", data.text.length);
      return data.text;
    } else {
      // Fallback for images if Tesseract is broken on Windows Node 22
      // For a hackathon demo, we prefer PDF invoices anyway.
      console.warn("[OCR] Image OCR is currently disabled. Please use PDF.");
      return "INVOICE DATA (Image OCR Unavailable - Please upload PDF) \n Vendor: Demo Vendor \n Amount: 0";
    }

  } catch (e) {
    console.error("[OCR] Parsing failed:", e);
    return "Error reading document text";
  }
}
