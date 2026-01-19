import fs from "fs";
import { createRequire } from "module";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Real Text Extraction for PDFs & Images
export async function runOCR(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    // Check for PDF signature (Magic Bytes: %PDF so 0x25 0x50 0x44 0x46)
    const isPdf = dataBuffer.lastIndexOf("%PDF-", 0) === 0;

    if (isPdf || filePath.toLowerCase().endsWith(".pdf")) {
      const data = await pdf(dataBuffer);
      console.log("[OCR] PDF Text extracted length:", data.text.length);
      return data.text;
    } else {
      // Image OCR using Tesseract.js
      console.log("[OCR] Processing image with Tesseract...");
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => { if (m.status === 'recognizing text') console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`); }
      });
      console.log("[OCR] Image Text extracted length:", text.length);
      return text;
    }
  } catch (e) {
    console.error(`[OCR] Parsing failed for ${filePath}:`, e.toString());
    return "Error reading document text";
  }
}
