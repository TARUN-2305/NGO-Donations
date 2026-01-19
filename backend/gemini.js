import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function verifyInvoiceWithGemini(input) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert financial auditor for an NGO platform. Verify this invoice claim.

CONTEXT:
- OCR text is messy. It contains formatting artifacts, merged lines, and noise.
- The 'claimedAmount' is what the admin wants to pay out.
- Your job is to find EVIDENCE in the 'rawTextSnippet' that supports the 'claimedAmount'.
- Currencies found might be '₹', 'INR', 'Rs', or bare numbers.
- Ignore whitespace differences or minor spelling errors.

STRICT RULES:
1. Search specifically for the 'claimedAmount' in the text. (e.g. if claimed is 50, look for "50.00", "50", "Total: 50", etc.)
2. If you find a matching number near keywords like "Total", "Amount", "Balance Due", give a HIGH score (90-100).
3. If the document clearly shows a different total than claimed, REJECT.
4. If OCR is garbage but contains some relevant keywords (Vendor Name, Date), mark as REVIEW (Score 50-70).
5. If OCR is perfectly legible but matches nothing, REJECT.

OUTPUT FORMAT:
Return ONLY a valid JSON object. Do not use Markdown code blocks.
{
  "credibility_score": number (0-100),
  "decision": "APPROVE" | "REVIEW" | "REJECT",
  "flags": ["list", "of", "issues"],
  "explanation": "concise reason"
}

INPUT DATA:
${JSON.stringify(input, null, 2)}
`;

  const result = await model.generateContent(prompt);

  // Gemini sometimes wraps JSON in text — harden parsing
  const rawText = result.response.text().trim();
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Gemini response did not contain valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
