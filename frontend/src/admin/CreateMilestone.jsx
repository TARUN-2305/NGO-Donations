import { useState, useEffect } from "react";
import { Plus, Target, CheckCircle, AlertCircle } from "lucide-react";

export default function CreateMilestone({ onMilestoneCreated }) {
    const [causes, setCauses] = useState([]);
    const [selectedCause, setSelectedCause] = useState("");
    const [description, setDescription] = useState("");
    const [allocation, setAllocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch causes to populate dropdown
    async function loadCauses() {
        console.log("Fetching causes from http://localhost:3000/admin/dashboard...");
        try {
            const res = await fetch("http://localhost:3000/admin/dashboard");
            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Fetched data:", data);
            setCauses(data.causes || []);
        } catch (e) {
            console.error("Failed to load causes:", e);
        }
    }

    useEffect(() => {
        loadCauses();
    }, []);

    async function handleCreate() {
        if (!selectedCause || !description || !allocation) {
            setMessage("Please select a cause and fill all fields.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:3000/milestones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    causeId: selectedCause,
                    description,
                    allocation
                })
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt);
            }

            setMessage("Success! Milestone added to cause.");
            setDescription("");
            setAllocation("");
            if (onMilestoneCreated) {
                setTimeout(onMilestoneCreated, 1500);
            }
        } catch (err) {
            console.error(err);
            setMessage("Error creating milestone (Check Cause Budget).");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="card" style={{ padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)" }}>
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                        Define verifiable phases. Funds unlock when milestones are met.
                    </p>
                </div>

                <div className="grid gap-4">
                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Select Parent Cause</label>
                        <select
                            value={selectedCause}
                            onChange={e => setSelectedCause(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "15px",
                                borderRadius: "12px",
                                border: "1px solid #cbd5e1",
                                fontSize: "1rem",
                                background: "#f8fafc",
                                outline: "none"
                            }}
                        >
                            <option value="">-- Choose a Cause --</option>
                            {causes.map(c => (
                                <option key={c.id} value={c.id}>{c.title} (Allocated: ₹{c.milestones.reduce((s, m) => s + m.allocation, 0)}/₹{c.budget})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Milestone Description</label>
                        <input
                            type="text"
                            placeholder="e.g. Procurement of Textbooks"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Funds to Unlock (INR)</label>
                        <input
                            type="number"
                            placeholder="e.g. 50000"
                            value={allocation}
                            onChange={e => setAllocation(e.target.value)}
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
                        onClick={handleCreate}
                        disabled={loading}
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            fontSize: "1.1rem",
                            width: "100%",
                            borderRadius: "50px",
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                        }}
                    >
                        {loading ? "Adding..." : <><Target size={20} /> Add Milestone Definition</>}
                    </button>
                </div>

                {message && (
                    <div style={{
                        marginTop: "25px",
                        padding: "15px",
                        background: message.includes("Error") ? "#fef2f2" : "#f0fdf4",
                        color: message.includes("Error") ? "#991b1b" : "#166534",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: 500
                    }}>
                        {message.includes("Error") ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
