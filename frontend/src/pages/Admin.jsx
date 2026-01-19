import { useState } from "react";
import AdminDashboard from "../admin/AdminDashboard";
import UploadInvoice from "../admin/UploadInvoice";
import CreateCause from "../admin/CreateCause";
import CreateMilestone from "../admin/CreateMilestone";
import { FileText, CheckSquare, Heart, Flag, ArrowLeft } from "lucide-react";

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="grid grid-2" style={{ maxWidth: "800px", margin: "0 auto", gap: "30px" }}>
                        <DashboardCard
                            icon={<FileText size={48} color="#1e3a8a" />}
                            title="Upload Invoice"
                            desc="Submit vendor claims for AI verification"
                            onClick={() => setActiveTab("upload")}
                        />
                        <DashboardCard
                            icon={<CheckSquare size={48} color="#1e3a8a" />}
                            title="Approve Invoices"
                            desc="Vote on pending claims"
                            onClick={() => setActiveTab("voting")}
                        />
                        <DashboardCard
                            icon={<Heart size={48} color="#1e3a8a" />}
                            title="Create Cause"
                            desc="Launch a new funding campaign"
                            onClick={() => setActiveTab("causes")}
                        />
                        <DashboardCard
                            icon={<Flag size={48} color="#1e3a8a" />}
                            title="Create Milestone"
                            desc="Add goals to existing projects"
                            onClick={() => setActiveTab("milestones")}
                        />
                    </div>
                );
            case "upload":
                return <UploadInvoice />;
            case "voting":
                return <AdminDashboard />;
            case "causes":
                return <CreateCause onCauseCreated={() => setActiveTab("dashboard")} />;
            case "milestones":
                return <CreateMilestone onMilestoneCreated={() => setActiveTab("dashboard")} />;
            default:
                return null;
        }
    };

    return (
        <div className="container" style={{ padding: "40px 20px", minHeight: "80vh" }}>
            {/* Header / Nav */}
            <div style={{ marginBottom: "40px", textAlign: "center", position: "relative" }}>
                {activeTab !== "dashboard" && (
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "1rem",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                )}
                <h1 style={{ color: "#1e3a8a", fontSize: "2rem", fontWeight: "800" }}>
                    {activeTab === "dashboard" ? "Admin Governance" :
                        activeTab === "upload" ? "Upload Invoice" :
                            activeTab === "voting" ? "Pending Approvals" :
                                activeTab === "causes" ? "Launch Cause" : "Add Milestone"}
                </h1>
            </div>

            {/* Content Body */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
}

function DashboardCard({ icon, title, desc, onClick }) {
    return (
        <div
            onClick={onClick}
            className="card"
            style={{
                background: "white",
                padding: "40px",
                borderRadius: "24px",
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid transparent",
                transition: "all 0.2s ease",
                boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "#bfdbfe";
                e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(30, 58, 138, 0.1)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(0,0,0,0.05)";
            }}
        >
            <div style={{
                background: "#eff6ff",
                padding: "20px",
                borderRadius: "50%",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: "1.5rem", color: "#1e3a8a", fontWeight: "700", margin: 0 }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>{desc}</p>
        </div>
    );
}
