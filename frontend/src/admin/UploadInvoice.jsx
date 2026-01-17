import { useState } from "react";

export default function UploadInvoice() {
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitInvoice() {
    if (!file || !amount) {
      setMessage("Please select a file and enter amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("vendor", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      form.append("amount", amount);

      const res = await fetch("http://localhost:3000/invoice", {
  method: "POST",
  body: form
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(text);
}

const data = await res.json();
setMessage(`Invoice submitted. ID: ${data.id}`);

    } catch (err) {
  console.error(err);
  setMessage(
    err?.message || "Error submitting invoice (check backend logs)"
  );
}
 finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Upload Invoice</h3>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Claimed Amount (e.g. 40.70)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={submitInvoice} disabled={loading}>
        {loading ? "Uploading..." : "Submit Invoice"}
      </button>

      <br /><br />

      {message && <p>{message}</p>}
    </div>
  );
}
