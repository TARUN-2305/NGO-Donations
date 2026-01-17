import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { connectWallet } from "../wallet";

const DONATION_REGISTRY_ADDRESS = "0x53e6cC3931521D18A1220355B965a4e164e79957";
const DONATION_REGISTRY_ABI = [
  "function recordDonation(bytes32,uint256,string) payable"
];

export default function DonorDashboard() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [donatingTo, setDonatingTo] = useState(null);
  const [amount, setAmount] = useState("0.01");

  useEffect(() => {
    fetch("http://localhost:3000/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        // Filter only PROPOSED/ACTIVE causes if you want, but for now show all
        setCauses(data.causes || []);
      })
      .catch(console.error);
  }, []);

  async function handleDonate(causeId) {
    try {
      setDonatingTo(causeId);
      const { signer } = await connectWallet();
      const contract = new ethers.Contract(
        DONATION_REGISTRY_ADDRESS,
        DONATION_REGISTRY_ABI,
        signer
      );

      // Simple privacy commitment (identity + random salt)
      const commitment = ethers.keccak256(
        ethers.toUtf8Bytes(Date.now().toString())
      );

      const tx = await contract.recordDonation(
        commitment,
        causeId,
        "QmThankYouCardPlaceholder", // Future: Dynamic receipt
        { value: ethers.parseEther(amount) }
      );

      await tx.wait();
      alert("Donation successful! Thank you for supporting this cause.");
    } catch (err) {
      console.error(err);
      alert("Donation failed: " + err.message);
    } finally {
      setDonatingTo(null);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h2>Donor Dashboard</h2>
      <p>Choose a verified cause to support. All donations are tracked on-chain.</p>

      {loading && <p>Loading causes...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {causes.map(cause => (
          <div key={cause.id} style={{
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3>{cause.title}</h3>
            <p><strong>Goal:</strong> ₹{cause.budget}</p>
            <p><strong>Status:</strong> {cause.status}</p>

            <div style={{ margin: "15px 0", padding: 10, background: "#f5f5f5", borderRadius: 4 }}>
              <h4>Milestones</h4>
              {cause.milestones.length === 0 ? <small>No milestones yet.</small> : (
                <ul style={{ paddingLeft: 20 }}>
                  {cause.milestones.map(ms => (
                    <li key={ms.id}>
                      {ms.description} (Allocated: ₹{ms.allocation})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: 15 }}>
              <label style={{ display: "block", marginBottom: 5 }}>Amount (ETH):</label>
              <input
                type="number"
                step="0.001"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ padding: 5, width: "100px", marginRight: 10 }}
              />
              <button
                onClick={() => handleDonate(cause.id)}
                disabled={donatingTo === cause.id}
                style={{
                  background: donatingTo === cause.id ? "#ccc" : "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 4,
                  cursor: donatingTo === cause.id ? "not-allowed" : "pointer"
                }}
              >
                {donatingTo === cause.id ? "Processing..." : "Donate Now"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {causes.length === 0 && !loading && (
        <p>No active causes found. Check back later!</p>
      )}
    </div>
  );
}
