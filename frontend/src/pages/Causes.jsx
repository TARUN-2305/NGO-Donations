import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { connectWallet } from "../wallet";
import { Heart, TrendingUp, Info, CheckCircle } from "lucide-react";

export default function Causes() {
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(null);

    const refreshData = () => {
        Promise.all([
            fetch("http://localhost:3000/admin/dashboard").then(res => res.json()),
            fetch("http://localhost:3000/config").then(res => res.json())
        ])
            .then(([dashboardData, configData]) => {
                setCauses(dashboardData.causes || []);
                setConfig(configData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        refreshData();
    }, []);

    if (loading) return (
        <div className="container mt-4" style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="spinner"></div>
            <p>Loading Verified Causes...</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: "60px 20px" }}>
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 60px" }}>
                <h1 style={{ marginBottom: "15px", fontSize: "3rem", color: "#1e3a8a", fontWeight: "800" }}>CivicFund Causes</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1.3rem" }}>
                    Directly fund verified milestones. Track every rupee on-chain.
                </p>
            </div>

            <div className="grid grid-3" style={{ gap: "30px" }}>
                {causes.map(cause => (
                    <CauseCard
                        key={cause.id}
                        cause={cause}
                        treasuryAddress={config?.treasuryAddress}
                        onSuccess={refreshData}
                    />
                ))}
            </div>

            {causes.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", background: "#f8fafc", borderRadius: "20px" }}>
                    <h3 style={{ color: "var(--text-muted)" }}>No active causes found at the moment.</h3>
                </div>
            )}
        </div>
    );
}

function CauseCard({ cause, treasuryAddress, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [donating, setDonating] = useState(false);

    const RATE = 200000;
    const raisedINR = cause.raised || 0;
    const budgetINR = cause.budget || 0;
    const progress = Math.min(100, budgetINR > 0 ? (raisedINR / budgetINR) * 100 : 0);
    const isFullyFunded = raisedINR >= budgetINR;

    // Milestone logic
    const totalMilestones = cause.milestones?.length || 0;
    const completedMilestones = cause.milestones?.filter(m =>
        m.status === 'PAID' || (m.invoices?.some(i => i.status === 'PAID'))
    ).length || 0;

    const DONATION_REGISTRY_ADDRESS = "0x53e6cC3931521D18A1220355B965a4e164e79957";
    const DONATION_REGISTRY_ABI = ["function recordDonation(bytes32,uint256,string) payable"];

    const handleDonate = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        const amountInINR = parseFloat(amount) * RATE;
        const remainingINR = budgetINR - raisedINR;
        if (amountInINR > remainingINR) {
            alert(`Donation exceeds remaining goal. Limit: ${(remainingINR / RATE).toFixed(4)} ETH.`);
            return;
        }

        try {
            setDonating(true);
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(DONATION_REGISTRY_ADDRESS, DONATION_REGISTRY_ABI, signer);
            const commitment = ethers.keccak256(ethers.toUtf8Bytes(Date.now().toString()));
            const tx = await contract.recordDonation(
                commitment, cause.id, "QmDirectDonation",
                { value: ethers.parseEther(amount) }
            );
            await tx.wait();

            await fetch("http://localhost:3000/donate-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ causeId: cause.id, amount: amountInINR })
            });

            setAmount("");
            onSuccess();
            alert("Donation verified and recorded!");
        } catch (e) {
            console.error(e);
            alert("Failed: " + (e.reason || e.message));
        } finally {
            setDonating(false);
        }
    };

    const inrValue = amount ? (parseFloat(amount) * RATE).toLocaleString() : "0";

    return (
        <div className="card" style={{
            display: "flex",
            flexDirection: "column",
            border: "none",
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
            borderRadius: "20px",
            background: "white",
            overflow: "hidden"
        }}>
            <div style={{ padding: "25px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                    <span className={`badge ${isFullyFunded ? "badge-green" : "badge-blue"}`} style={{ borderRadius: "8px", padding: "6px 12px" }}>
                        {isFullyFunded ? "Fully Funded" : "Active"}
                    </span>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
                        <CheckCircle size={14} /> {completedMilestones}/{totalMilestones} Milestones
                    </div>
                </div>

                <h3 style={{ fontSize: "1.3rem", marginBottom: "10px", lineHeight: "1.3", color: "#0f172a" }}>{cause.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "20px", lineHeight: 1.5 }}>
                    {cause.description || "Help achieve certified milestones. Funds released only upon proof of work."}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: "25px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "8px", fontWeight: 600 }}>
                        <span style={{ color: "#166534" }}>₹{raisedINR.toLocaleString()} raised</span>
                        <span style={{ color: "#64748b" }}>of ₹{budgetINR.toLocaleString()}</span>
                    </div>
                    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${progress}%`, background: "#22c55e", height: "100%", borderRadius: "4px" }}></div>
                    </div>
                </div>

                {/* Donation */}
                {!isFullyFunded ? (
                    <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <div style={{ flex: 1, position: "relative" }}>
                                <input
                                    type="number"
                                    placeholder="Amount (ETH)"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "1rem",
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>≈ ₹{inrValue} INR</span>
                        </div>
                        <button
                            onClick={handleDonate}
                            disabled={donating || !amount}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#22c55e",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                opacity: donating ? 0.7 : 1,
                                transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "#16a34a"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#22c55e"}
                        >
                            {donating ? "Processing..." : "Donate and Track Impact"}
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "15px", background: "#f0fdf4", borderRadius: "12px", color: "#166534", fontWeight: 600 }}>
                        <Heart size={20} style={{ verticalAlign: "middle", marginRight: "5px" }} />
                        Campaign Successfully Funded!
                    </div>
                )}
            </div>

            <div style={{ padding: "15px", borderTop: "1px solid #f8fafc", textAlign: "center" }}>
                <Link to={`/cause/${cause.id}`} style={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                    <Info size={16} /> View Transparent Breakdown
                </Link>
            </div>
        </div>
    );
}
