import Tesseract from "tesseract.js";

export async function runOCR(filePath) {
  const { data } = await Tesseract.recognize(
    filePath,
    "eng",
    { logger: () => {} }
  );
  return data.text;
}
