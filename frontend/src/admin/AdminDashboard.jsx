import { useEffect, useState } from "react";
import { connectWallet } from "../wallet";
import { CheckCircle, AlertTriangle, FileText, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState({ causes: [], orphans: [] });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [processingId, setProcessingId] = useState(null);

    async function loadDashboard() {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/admin/dashboard");
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    async function vote(id) {
        setProcessingId(id);
        setMessage(`Signing vote for Invoice #${id}...`);
        try {
            const { address } = await connectWallet();

            const res = await fetch(`http://localhost:3000/invoice/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin: address })
            });

            if (!res.ok) throw new Error("Vote failed");

            setMessage("Vote verified & recorded.");
            setTimeout(loadDashboard, 1000);
        } catch (e) {
            console.error(e);
            setMessage("Error processing vote.");
        } finally {
            setProcessingId(null);
        }
    }

    async function reject(id) {
        setProcessingId(id);
        setMessage(`Rejecting Invoice #${id}...`);
        try {
            const res = await fetch(`http://localhost:3000/invoice/${id}/reject`, {
                method: "POST"
            });
            if (!res.ok) throw new Error("Reject failed");
            setMessage("Invoice rejected.");
            setTimeout(loadDashboard, 1000);
        } catch (e) {
            console.error(e);
            setMessage("Error rejecting invoice.");
        } finally {
            setProcessingId(null);
        }
    }

    // Flatten data for the view
    const pendingInvoices = [];
    const processedInvoices = [];

    const processInvoice = (inv, context) => {
        const item = { ...inv, ...context };
        if (inv.status === "PENDING") {
            pendingInvoices.push(item);
        } else {
            processedInvoices.push(item);
        }
    };

    data.causes?.forEach(cause => {
        cause.milestones?.forEach(ms => {
            ms.invoices?.forEach(inv => {
                processInvoice(inv, {
                    causeTitle: cause.title,
                    milestoneTitle: ms.description,
                    allocation: ms.allocation
                });
            });
        });
    });

    data.orphans?.forEach(inv => {
        processInvoice(inv, { causeTitle: "Unlinked", milestoneTitle: "Orphan Invoice", allocation: 0 });
    });

    if (loading && !data.causes.length) return <div className="spinner" style={{ margin: "40px auto" }} ></div>;

    const InvoiceCard = ({ inv, isPending }) => (
        <div key={inv.id} className="card" style={{
            marginBottom: "20px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 4px 15px -3px rgba(0,0,0,0.05)",
            padding: "25px",
            border: "1px solid #f1f5f9"
        }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{
                            background: "#eff6ff",
                            color: "#1e40af",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: 600
                        }}>
                            #{inv.id}
                        </span>
                        <span style={{ fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
                            {inv.causeTitle} <ChevronRight size={14} /> <span style={{ color: "#0f172a", fontWeight: 500 }}>{inv.milestoneTitle}</span>
                        </span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a" }}>Payment to: <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{inv.vendor?.slice(0, 8)}...{inv.vendor?.slice(-4)}</span></h4>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>₹{Number(inv.amount).toLocaleString()}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Claimed (INR)</div>
                </div>
            </div>

            {/* AI Analysis */}
            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <strong style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
                        AI Invoice Analysis
                    </strong>
                    <span className={`badge ${inv.mlResult?.credibility_score > 80 ? "badge-green" : "badge-yellow"}`} style={{ borderRadius: "20px", padding: "6px 14px" }}>
                        Credibility Score: {inv.mlResult?.credibility_score}/100
                    </span>
                </div>

                <div style={{ fontSize: "0.95rem", color: inv.mlResult?.flags?.length ? "#b91c1c" : "#15803d", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    {inv.mlResult?.flags?.length > 0
                        ? <><AlertTriangle size={18} /> <span><strong>Flags Detected:</strong> {inv.mlResult.flags.join(", ")}</span></>
                        : <><CheckCircle size={18} /> <span>No anomalies detected. Metadata matches invoice content.</span></>
                    }
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid #f1f5f9" }}>
                <a
                    href={inv.fileCid ? `https://gateway.pinata.cloud/ipfs/${inv.fileCid}` : "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontSize: "0.9rem",
                        color: "#3b82f6",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: 500,
                        textDecoration: "none"
                    }}
                >
                    <FileText size={18} /> View Document
                </a>

                {isPending ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={() => vote(inv.id)}
                            disabled={processingId === inv.id}
                            style={{
                                background: "#22c55e",
                                color: "white",
                                border: "none",
                                padding: "10px 24px",
                                borderRadius: "50px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                boxShadow: "0 4px 10px rgba(34, 197, 94, 0.2)"
                            }}
                        >
                            {processingId === inv.id ? "Signing..." : "Approve"}
                        </button>
                        <button
                            onClick={() => reject(inv.id)}
                            disabled={processingId === inv.id}
                            style={{
                                background: "#ef4444",
                                color: "white",
                                border: "none",
                                padding: "10px 24px",
                                borderRadius: "50px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                fontSize: "0.95rem",
                                boxShadow: "0 4px 10px rgba(239, 68, 68, 0.2)"
                            }}
                        >
                            Reject
                        </button>
                    </div>
                ) : (
                    <span className="badge badge-green" style={{ borderRadius: "20px", padding: "8px 16px" }}>
                        {inv.status}
                    </span>
                )}
            </div>

            {/* Payment Proof Section - Only for Paid Invoices */}
            {
                (inv.status === "PAID" || inv.payoutTxHash) && (
                    <div style={{ marginTop: "20px", padding: "15px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px" }}>
                        <h5 style={{ margin: "0 0 10px 0", color: "#166534", display: "flex", alignItems: "center", gap: "6px", fontSize: "1rem" }}>
                            <CheckCircle size={18} /> Funds Transferred to Vendor
                        </h5>
                        <div style={{ fontSize: "0.9rem", color: "#166534", display: "grid", gap: "8px" }}>
                            {inv.payoutTxHash && (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>Transaction ID:</span>
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${inv.payoutTxHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: "#15803d", textDecoration: "underline", fontWeight: 600, display: "flex", alignItems: "center" }}
                                    >
                                        {inv.payoutTxHash.slice(0, 16)}... <ChevronRight size={14} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );

    return (
        <div>
            {message && <div style={{ padding: "10px", background: "#f0fdf4", color: "#15803d", borderRadius: "6px", marginBottom: "20px" }}>{message}</div>}

            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertTriangle color="var(--accent)" /> Pending Approvals ({pendingInvoices.length})
            </h3>

            {pendingInvoices.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", background: "#f8fafc", borderRadius: "8px", color: "var(--text-muted)", marginBottom: "40px" }}>
                    All clear! No pending invoices requiring attention.
                </div>
            ) : (
                <div style={{ marginBottom: "40px" }}>
                    {pendingInvoices.map(inv => <InvoiceCard key={inv.id} inv={inv} isPending={true} />)}
                </div>
            )}

            <h3 style={{ marginBottom: "20px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>History & Processed</h3>
            {processedInvoices.length === 0 ? (
                <div style={{ padding: "20px", color: "var(--text-muted)" }}>No history available.</div>
            ) : (
                <div style={{ opacity: 0.8 }}>
                    {processedInvoices.map(inv => <InvoiceCard key={inv.id} inv={inv} isPending={false} />)}
                </div>
            )}
        </div>
    );
}
