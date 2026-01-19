import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { connectWallet } from "../wallet";
import { CheckCircle, Clock } from "lucide-react";

const DONATION_REGISTRY_ADDRESS = "0x53e6cC3931521D18A1220355B965a4e164e79957";
const DONATION_REGISTRY_ABI = ["function recordDonation(bytes32,uint256,string) payable"];

export default function CauseDetails() {
    const { id } = useParams();
    const [cause, setCause] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donateAmount, setDonateAmount] = useState("");
    const [donating, setDonating] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/admin/dashboard")
            .then(res => res.json())
            .then(data => {
                const found = data.causes.find(c => String(c.id) === id);
                setCause(found);
                setLoading(false);
            })
            .catch(console.error);
    }, [id]);

    async function handleDonate() {
        if (!donateAmount) return;

        const amountInINR = parseFloat(donateAmount) * 200000;
        const remaining = cause.budget - (cause.raised || 0);

        if (amountInINR > remaining) {
            alert(`Donation exceeds needed amount! Only ₹${remaining.toLocaleString()} (~${(remaining / 200000).toFixed(4)} ETH) needed.`);
            return;
        }

        setDonating(true);
        try {
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(DONATION_REGISTRY_ADDRESS, DONATION_REGISTRY_ABI, signer);

            const commitment = ethers.keccak256(ethers.toUtf8Bytes(Date.now().toString()));
            const tx = await contract.recordDonation(commitment, id, "QmDemoReceipt", { value: ethers.parseEther(donateAmount) });
            await tx.wait();

            await fetch("http://localhost:3000/donate-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ causeId: id, amount: amountInINR })
            });

            alert("Donation successful! Thank you.");
            setDonateAmount("");
            // Refresh logic could go here
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Donation failed: " + e.message);
        } finally {
            setDonating(false);
        }
    }

    if (loading) return <div className="container mt-4" style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;
    if (!cause) return <div className="container mt-4">Cause not found.</div>;

    const raisedINR = cause.raised || 0;
    const percent = Math.min(100, Math.round((raisedINR / cause.budget) * 100));

    return (
        <div className="container" style={{ padding: "60px 20px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
                        <span className="badge badge-blue">Verified NGO</span>
                        <span className="badge badge-green">Active Campaign</span>
                    </div>
                    <h1 style={{ marginBottom: "15px", color: "#1e3a8a", fontSize: "2.5rem", fontWeight: "800" }}>{cause.title}</h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                        {cause.description || "Support this verified cause. Funds are held in escrow and released only upon proof of milestone completion."}
                    </p>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-3" style={{ marginBottom: "40px", gap: "20px" }}>
                    <StatBox label="Total Goal" value={`₹${cause.budget.toLocaleString()}`} />
                    <StatBox label="Raised So Far" value={`₹${raisedINR.toLocaleString()}`} />
                    <StatBox label="Milestones" value={cause.milestones.length} />
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: "50px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontWeight: 600 }}>
                        <span style={{ color: "#166534" }}>{percent}% Funded</span>
                        <span style={{ color: "var(--text-muted)" }}>Goal Reached</span>
                    </div>
                    <div style={{ height: "12px", background: "#f1f5f9", borderRadius: "6px", overflow: "hidden" }}>
                        <div style={{ width: `${percent}%`, background: "#22c55e", height: "100%", transition: "width 0.5s ease" }}></div>
                    </div>
                </div>

                {/* Donation Section */}
                <div className="card" style={{
                    background: "#f8fafc",
                    border: "1px solid white",
                    borderRadius: "20px",
                    padding: "30px",
                    marginBottom: "50px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                }}>
                    <h3 style={{ marginBottom: "10px", color: "#0f172a" }}>Make a Contribution</h3>
                    <p style={{ marginBottom: "25px", color: "var(--text-muted)" }}>
                        Your donation is recorded on the blockchain.
                    </p>
                    <div style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "0.9rem" }}>Amount (ETH)</label>
                            <input
                                type="number"
                                step="0.001"
                                placeholder="0.01"
                                value={donateAmount}
                                onChange={e => setDonateAmount(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "1.1rem",
                                    outline: "none"
                                }}
                            />
                        </div>
                        <button
                            onClick={handleDonate}
                            disabled={donating}
                            style={{
                                minWidth: "180px",
                                padding: "12px 24px",
                                background: "#22c55e",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                cursor: "pointer",
                                opacity: donating ? 0.7 : 1
                            }}
                        >
                            {donating ? "Processing..." : "Donate Now"}
                        </button>
                    </div>
                    {donateAmount && (
                        <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#64748b" }}>
                            ≈ ₹{(parseFloat(donateAmount) * 200000).toLocaleString()} INR
                        </p>
                    )}
                </div>

                {/* Milestones */}
                <h3 style={{ marginBottom: "25px", color: "#1e3a8a", fontSize: "1.8rem" }}>Project Milestones</h3>
                <div className="grid gap-4" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {cause.milestones.map(ms => (
                        <MilestoneCard key={ms.id} ms={ms} />
                    ))}
                    {cause.milestones.length === 0 && <p className="text-muted">No milestones defined yet.</p>}
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value }) {
    return (
        <div className="card" style={{
            padding: "20px",
            textAlign: "center",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
        }}>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1e3a8a", marginBottom: "5px" }}>{value}</div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>{label}</div>
        </div>
    );
}

function MilestoneCard({ ms }) {
    const isCompleted = ms.status === "COMPLETED" || (ms.invoices && ms.invoices.some(inv => inv.status === "PAID"));

    return (
        <div className="card" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            border: "1px solid #f1f5f9"
        }}>
            <div>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "5px", color: "#0f172a" }}>{ms.description}</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Budget Allocation: <b style={{ color: "#334155" }}>₹{ms.allocation}</b></p>
            </div>
            <div>
                {isCompleted ? (
                    <span className="badge badge-green" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <CheckCircle size={14} /> Completed
                    </span>
                ) : (
                    <span className="badge badge-yellow" style={{ display: "flex", alignItems: "center", gap: "5px", background: "#fef9c3", color: "#854d0e" }}>
                        <Clock size={14} /> Pending
                    </span>
                )}
            </div>
        </div>
    );
}
