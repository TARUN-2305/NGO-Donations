import { useEffect, useState } from "react";
import { connectWallet } from "../wallet";

export default function PendingInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadInvoices() {
    setLoading(true);
    const res = await fetch("http://localhost:3000/invoices");
    const data = await res.json();
    setInvoices(data.filter(i => i.status === "PENDING"));
    setLoading(false);
  }

  async function vote(id) {
    setMessage("Submitting vote...");
    const { address } = await connectWallet();

    await fetch(`http://localhost:3000/invoice/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin: address })
    });

    setMessage("Vote submitted");
    loadInvoices();
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <div>
      <h3>Pending Invoices</h3>

      {loading && <p>Loading invoices...</p>}
      {message && <p>{message}</p>}

      {invoices.length === 0 && !loading && (
        <p>No pending invoices.</p>
      )}

      {invoices.map(inv => (
        <div
          key={inv.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10
          }}
        >
          <p><b>ID:</b> {inv.id}</p>
          <p><b>Claimed:</b> {inv.amount}</p>
          <p><b>Decision:</b> {inv.mlResult.decision}</p>
          <p><b>Score:</b> {inv.mlResult.credibility_score}</p>
          <p><b>Flags:</b> {inv.mlResult.flags.join(", ")}</p>

          <button onClick={() => vote(inv.id)}>
            Vote Approve
          </button>
        </div>
      ))}
    </div>
  );
}
