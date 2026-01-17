export function extractFromText(text) {
  const amountMatch = text.match(/(₹|\$|£)\s?([\d,]+(\.\d{2})?)/);
  const dateMatch = text.match(/\d{2}[-/]\d{2}[-/]\d{4}/);
  const invoiceMatch = text.match(/INV[-\w]+/i);

  return {
    invoiceNumber: invoiceMatch?.[0] || null,
    amount: amountMatch
    ? Number(amountMatch[2].replace(/,/g, ""))
    : null,
    date: dateMatch?.[0] || null
  };
}
