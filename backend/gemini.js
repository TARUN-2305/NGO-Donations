import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function verifyInvoiceWithGemini(input) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an invoice credibility verifier.

IMPORTANT CONTEXT:
- OCR-extracted fields may be incomplete, noisy, or incorrect.
- Admin-provided (claimed) fields may also be incorrect.
- Your task is to assess credibility under uncertainty, not absolute truth.

RULES:
1. If extractedAmount exists, compare it with claimedAmount.
2. Large mismatches should reduce score and add a flag.
3. Missing OCR fields should lower confidence, NOT cause automatic rejection.
4. If most information is consistent, approve with a higher score.
5. If information is insufficient or conflicting, mark for REVIEW.
6. Only REJECT if there are strong contradictions or clear fraud signals.

OUTPUT FORMAT (STRICT):
Return ONLY a valid JSON object with these fields:
- credibility_score: number (0–100)
- decision: "APPROVE" | "REVIEW" | "REJECT"
- flags: array of short string codes
- explanation: one short sentence

DO NOT include markdown, comments, or extra text.

INPUT:
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
