import { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

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
              label: `${cause.title} - ${ms.description} (Alloc: ₹${ms.allocation})`
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
      setMessage(`Success! Invoice #${data.id} uploaded for verification.`);
      setFile(null);
      setVendor("");
      setAmount("");
      setSelectedMilestone("");

    } catch (err) {
      console.error(err);
      setMessage(
        err?.message || "Error submitting invoice. Please check parameters."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card" style={{ padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)" }}>
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Submit vendor claims for AI verification.
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px", fontSize: "0.9rem", color: "#d97706", fontWeight: 500 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><CheckCircle size={16} /> IPFS Anchoring</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><CheckCircle size={16} /> OCR Analysis</span>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Link to Milestone</label>
            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                outline: "none",
                background: "#f8fafc"
              }}
            >
              <option value="">-- General / Operational Expense --</option>
              {milestones.map(ms => (
                <option key={ms.id} value={ms.id}>{ms.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Vendor Invoice File (PDF/Image)</label>
            <div style={{ position: "relative" }}>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{
                  width: "100%",
                  padding: "30px",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  cursor: "pointer",
                  textAlign: "center",
                  color: "#64748b"
                }}
              />
              {!file && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", color: "#94a3b8" }}>
                <UploadCloud size={24} />
                <span style={{ fontSize: "0.9rem" }}>Drag or Click to Upload</span>
              </div>}
            </div>
            {file && <div style={{ marginTop: "5px", color: "#166534", fontSize: "0.9rem", textAlign: "center" }}>Selected: {file.name}</div>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Vendor Wallet Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                background: "#f8fafc"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Claimed Amount (INR)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                background: "#f8fafc"
              }}
            />
          </div>

          <button
            onClick={submitInvoice}
            disabled={loading}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "15px",
              borderRadius: "50px",
              background: "#d97706", // Amber 600
              color: "white",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)"
            }}
          >
            {loading ? "Processing..." : (
              <><UploadCloud size={20} /> Submit for Approval</>
            )}
          </button>
        </div>

        {message && (
          <div style={{
            marginTop: "30px",
            padding: "15px",
            background: message.includes("Success") ? "#f0fdf4" : "#fef2f2",
            color: message.includes("Success") ? "#166534" : "#991b1b",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 500
          }}>
            {message.includes("Success") ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

