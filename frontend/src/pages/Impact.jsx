import { useEffect, useState } from "react";
import { CheckCircle, Globe, TrendingUp, Check } from "lucide-react";

export default function Impact() {
    const [stats, setStats] = useState({ totalRaised: 0, totalImpacted: 0, milestones: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/admin/dashboard")
            .then(res => res.json())
            .then(data => {
                const causes = data.causes || [];

                let totalRaised = 0;
                const impactfulMilestones = [];

                causes.forEach(cause => {
                    totalRaised += (cause.raised || 0);

                    if (cause.milestones) {
                        cause.milestones.forEach(ms => {
                            // Check if milestone has approved invoices
                            // In a real system, we'd check ms.status === 'PAID'
                            // Here we derive it from invoices presence/status for the demo
                            const hasApprovedInvoices = ms.invoices && ms.invoices.some(inv => inv.status === 'APPROVED_QUEUED' || inv.status === 'PAID');

                            if (hasApprovedInvoices || ms.status === 'PAID') {
                                // Find any paid invoice to use as proof
                                const proofInv = ms.invoices?.find(inv => inv.payoutTxHash);
                                impactfulMilestones.push({
                                    ...ms,
                                    causeTitle: cause.title,
                                    spent: ms.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
                                    txProof: proofInv ? proofInv.payoutTxHash : null
                                });
                            }
                        });
                    }
                });

                setStats({
                    totalRaised,
                    totalImpacted: impactfulMilestones.length, // Proxy for impact
                    milestones: impactfulMilestones
                });
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) return (
        <div className="container mt-4" style={{ textAlign: "center", padding: "100px 0" }}>
            <div className="spinner"></div>
            <p>Loading Impact Data...</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: "60px 20px" }}>
            <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 60px" }}>
                <span className="badge badge-green" style={{ marginBottom: "15px", background: "#d1fae5", color: "#065f46" }}>Transparency Report</span>
                <h1 style={{ marginBottom: "15px", fontSize: "3rem", color: "#1e3a8a" }}>Real-World Impact</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>
                    Track how every contributed ETH is being utilized in the real world.
                </p>
            </div>

            <div className="grid grid-2" style={{ marginBottom: "60px", gap: "30px" }}>
                <div className="card" style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "24px",
                    padding: "40px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                        <div style={{ background: "rgba(255,255,255,0.2)", padding: "12px", borderRadius: "50%" }}>
                            <TrendingUp size={28} color="white" />
                        </div>
                        <h3 style={{ fontSize: "1.4rem", margin: 0, fontWeight: "600" }}>Total Value Locked</h3>
                    </div>
                    <p style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "10px 0" }}>
                        {stats.totalRaised.toLocaleString(undefined, { maximumFractionDigits: 2 })} ETH
                    </p>
                    <div style={{ fontSize: "1rem", opacity: 0.8 }}>
                        Donated across all causes
                    </div>
                </div>

                <div className="card" style={{
                    background: "white",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 20px 40px -5px rgba(0,0,0,0.05)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                        <div style={{ background: "#dafbf0", padding: "12px", borderRadius: "50%" }}>
                            <Globe size={28} color="var(--secondary)" />
                        </div>
                        <h3 style={{ fontSize: "1.4rem", margin: 0, fontWeight: "600", color: "#0f172a" }}>Milestones Achieved</h3>
                    </div>
                    <p style={{ fontSize: "3.5rem", fontWeight: "bold", margin: "10px 0", color: "#0f172a" }}>
                        {stats.totalImpacted}
                    </p>
                    <div style={{ fontSize: "1rem", color: "var(--text-muted)" }}>
                        Verified project phases completed
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: "30px", fontSize: "2rem", color: "#0f172a" }}>Completed Milestones</h2>
            {stats.milestones.length === 0 ? (
                <div style={{ padding: "60px", textAlign: "center", background: "#f8fafc", borderRadius: "20px", color: "var(--text-muted)", fontSize: "1.1rem" }}>
                    No milestones have been marked as fully paid yet.
                </div>
            ) : (
                <div className="grid grid-3" style={{ gap: "30px" }}>
                    {stats.milestones.map(ms => (
                        <div key={ms.id} className="card" style={{
                            background: "#f8fafc",
                            border: "1px solid white",
                            borderRadius: "24px",
                            padding: "30px",
                            boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "250px"
                        }}>

                            <div>
                                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{
                                        background: "#dcfce7",
                                        color: "#166534",
                                        padding: "6px 14px",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        fontWeight: "bold",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        <div style={{ background: "#22c55e", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Check size={10} color="white" strokeWidth={4} />
                                        </div>
                                        Approved & Paid
                                    </div>
                                    {ms.txProof && (
                                        <a href={`https://sepolia.etherscan.io/tx/${ms.txProof}`} target="_blank" rel="noreferrer"
                                            title="View Proof"
                                            style={{ color: "#cbd5e1", transition: "color 0.2s" }}
                                            onMouseOver={(e) => e.currentTarget.style.color = "#1e3a8a"}
                                            onMouseOut={(e) => e.currentTarget.style.color = "#cbd5e1"}
                                        >
                                            <Globe size={20} />
                                        </a>
                                    )}
                                </div>
                                <h4 style={{ fontSize: "1.25rem", marginBottom: "10px", color: "#0f172a", lineHeight: "1.4" }}>{ms.description}</h4>
                                <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "20px" }}>
                                    Part of: <b>{ms.causeTitle}</b>
                                </p>
                            </div>

                            <div style={{ paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", marginBottom: "8px" }}>
                                    <span style={{ color: "#64748b" }}>Allocation</span>
                                    <b style={{ color: "#0f172a" }}>{ms.allocation} ETH</b>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#166534" }}>
                                    <span>Disbursed</span>
                                    <b>{ms.spent} ETH</b>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
