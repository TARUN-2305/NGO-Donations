import { ArrowRight, CheckCircle, Activity, Heart, Check, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectWallet } from "../wallet";

export default function Home() {
    const [stats, setStats] = useState({ raised: 0, invoices: 0 });
    const [address, setAddress] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/admin/dashboard")
            .then(res => res.json())
            .then(data => {
                let totalRaised = 0;
                let verifiedInvoices = 0;
                if (data.causes) {
                    data.causes.forEach(c => {
                        totalRaised += (c.raised || 0);
                        c.milestones?.forEach(m => verifiedInvoices += (m.invoices?.length || 0));
                    });
                }
                verifiedInvoices += (data.orphans?.length || 0);
                setStats({ raised: totalRaised, invoices: verifiedInvoices });
            })
            .catch(console.error);
    }, []);

    async function handleConnect() {
        try {
            const { address } = await connectWallet();
            setAddress(address);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: "var(--hero-gradient)",
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginTop: "-70px", // Pull up behind transparent navbar
                paddingTop: "70px"
            }}>
                <div className="container" style={{ maxWidth: "800px" }}>
                    <h1 style={{
                        marginBottom: "20px",
                        color: "#1e3a8a",
                        fontSize: "5rem",
                        fontWeight: "800",
                        letterSpacing: "-2px"
                    }}>
                        CivicFund
                    </h1>

                    <p style={{
                        fontSize: "1.5rem",
                        color: "var(--text-muted)",
                        marginBottom: "60px",
                        fontWeight: "500"
                    }}>
                        Transparent Donations. Measured Impact. Empowering Global Change.
                    </p>

                    <button
                        onClick={handleConnect}
                        style={{
                            background: "#0f172a", // Dark background
                            color: "white",
                            border: "2px solid transparent",
                            borderRadius: "50px", // Pill shape
                            padding: "18px 50px",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            backgroundClip: "padding-box, border-box",
                            backgroundImage: "linear-gradient(#0f172a, #0f172a), var(--primary-gradient)", // Gradient border trick
                            backgroundOrigin: "border-box",
                            boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)",
                            transition: "transform 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        {address ? `Connected: ${address.slice(0, 6)}...` : "Connect Wallet"}
                    </button>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="container" style={{ marginTop: "-80px", position: "relative", zIndex: 10, paddingBottom: "100px" }}>
                <div className="grid grid-3" style={{ gap: "30px" }}>
                    <MetricCard
                        title="Donations Processed"
                        value={`₹${stats.raised.toLocaleString()}`}
                        icon={<Heart color="#1e3a8a" size={24} />}
                    />
                    <MetricCard
                        title="Verified Invoices"
                        value={stats.invoices.toString()}
                        icon={<CheckCircle color="#10b981" size={24} />}
                    />
                    <MetricCard
                        title="Funds Traceable"
                        value="100%"
                        icon={<Activity color="#f59e0b" size={24} />}
                    />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon }) {
    return (
        <div style={{
            background: "#f8fafc",
            padding: "30px",
            borderRadius: "24px",
            boxShadow: "0 20px 40px -5px rgba(0,0,0,0.1)",
            border: "1px solid white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "200px"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ background: "white", padding: "12px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                    {icon}
                </div>
                <div style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                }}>
                    <div style={{ background: "#22c55e", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={10} color="white" strokeWidth={4} />
                    </div>
                    Approved & Paid
                </div>
            </div>

            <div style={{ marginTop: "20px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-1px" }}>
                    {value}
                </div>
                <div style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500", marginTop: "5px" }}>
                    {title}
                </div>
            </div>
        </div>
    );
}
