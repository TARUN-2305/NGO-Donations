import { useEffect, useState } from "react";
import { connectWallet } from "../wallet";

export default function AdminDashboard() {
    const [data, setData] = useState({ causes: [], orphans: [] });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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

    async function vote(id) {
        setMessage(`Voting on invoice #${id}...`);
        const { address } = await connectWallet();

        await fetch(`http://localhost:3000/invoice/${id}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admin: address })
        });

        setMessage("Vote submitted");
        loadDashboard();
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    const InvoiceCard = ({ inv }) => (
        <div style={{
            border: "1px solid #eee",
            padding: 10,
            marginBottom: 10,
            backgroundColor: "#fff",
            borderRadius: 5
        }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Invoice #{inv.id}</strong>
                <span>Status: {inv.status}</span>
            </div>
            <p>Vendor: {inv.vendor}</p>
            <p>Claimed: ₹{inv.amount}</p>

            {/* RAW EVIDENCE LINK */}
            <p>
                Evidence:{" "}
                {inv.fileCid ? (
                    <a
                        href={`https://gateway.pinata.cloud/ipfs/${inv.fileCid}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        View Raw File
                    </a>
                ) : (
                    <span style={{ color: "red" }}>Missing</span>
                )}
            </p>

            <div style={{ background: "#f9f9f9", padding: 5, fontSize: "0.9em" }}>
                <strong>AI Analysis:</strong>
                <div>Score: {inv.mlResult.credibility_score}/100</div>
                <div>Decision: {inv.mlResult.decision}</div>
                <div>Flags: {inv.mlResult.flags.join(", ")}</div>
            </div>

            <div style={{ marginTop: 10 }}>
                {inv.status === "PENDING" && (
                    <button onClick={() => vote(inv.id)}>
                        Vote to Approve
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h3>Admin Dashboard</h3>
            {loading && <p>Loading...</p>}
            {message && <div style={{ marginBottom: 10, color: "green" }}>{message}</div>}

            {/* CAUSES & MILESTONES */}
            {data.causes.length > 0 && (
                <div>
                    <h4>Active Causes</h4>
                    {data.causes.map(cause => (
                        <div key={cause.id} style={{ border: "2px solid #333", padding: 15, marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h4 style={{ margin: 0 }}>{cause.title}</h4>
                                <span>Budget: ₹{cause.budget}</span>
                            </div>
                            <p>Status: {cause.status}</p>

                            <div style={{ marginLeft: 20 }}>
                                {cause.milestones.map(ms => (
                                    <div key={ms.id} style={{ borderLeft: "2px solid #ccc", paddingLeft: 10, marginTop: 15 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <strong>Milestone: {ms.description}</strong>
                                            <span>Allocated: ₹{ms.allocation}</span>
                                        </div>

                                        {/* INVOICES FOR MILESTONE */}
                                        <div style={{ marginTop: 10 }}>
                                            {ms.invoices.length === 0 ? (
                                                <em style={{ color: "#888" }}>No invoices submitted.</em>
                                            ) : (
                                                ms.invoices.map(inv => <InvoiceCard key={inv.id} inv={inv} />)
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ORPHANS */}
            {data.orphans.length > 0 && (
                <div style={{ marginTop: 30 }}>
                    <h4 style={{ color: "orange" }}>Orphan Invoices (No Milestone)</h4>
                    {data.orphans.map(inv => <InvoiceCard key={inv.id} inv={inv} />)}
                </div>
            )}
        </div>
    );
}
