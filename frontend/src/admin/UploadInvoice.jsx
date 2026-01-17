import { useState, useEffect } from "react";

export default function UploadInvoice() {
  const [file, setFile] = useState(null);
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        const options = [];
        data.causes.forEach(cause => {
          cause.milestones.forEach(ms => {
            options.push({
              id: ms.id,
              label: `${cause.title} - ${ms.description} (₹${ms.allocation})`
            });
          });
        });
        setMilestones(options);
      })
      .catch(console.error);
  }, []);

  async function submitInvoice() {
    if (!file || !amount || !vendor) {
      setMessage("Please fill all fields (File, Vendor, Amount).");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("vendor", vendor);
      form.append("amount", amount);
      if (selectedMilestone) {
        form.append("milestoneId", selectedMilestone);
      }

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
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Upload Invoice</h3>

      <div style={{ marginBottom: 10 }}>
        <label>Select Milestone (Optional):</label><br />
        <select
          value={selectedMilestone}
          onChange={(e) => setSelectedMilestone(e.target.value)}
          style={{ width: "100%", padding: 5 }}
        >
          <option value="">-- No Milestone (Orphan) --</option>
          {milestones.map(ms => (
            <option key={ms.id} value={ms.id}>{ms.label}</option>
          ))}
        </select>
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Vendor Wallet Address (0x...)"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Claimed Amount (e.g. 40.70)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 8 }}
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
