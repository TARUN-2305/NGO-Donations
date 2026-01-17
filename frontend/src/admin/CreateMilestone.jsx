import { useState, useEffect } from "react";

export default function CreateMilestone({ onMilestoneCreated }) {
    const [causes, setCauses] = useState([]);
    const [selectedCause, setSelectedCause] = useState("");
    const [description, setDescription] = useState("");
    const [allocation, setAllocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Fetch causes to populate dropdown
    async function loadCauses() {
        try {
            const res = await fetch("http://localhost:3000/admin/dashboard");
            const data = await res.json();
            setCauses(data.causes || []);
        } catch (e) {
            console.error("Failed to load causes", e);
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

            setMessage("Milestone added successfully!");
            setDescription("");
            setAllocation("");
            if (onMilestoneCreated) onMilestoneCreated();
        } catch (err) {
            console.error(err);
            setMessage("Error creating milestone.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 8, marginBottom: 20 }}>
            <h4>Add Milestone to Cause</h4>

            <div style={{ marginBottom: 10 }}>
                <select
                    value={selectedCause}
                    onChange={e => setSelectedCause(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                >
                    <option value="">-- Select Cause --</option>
                    {causes.map(c => (
                        <option key={c.id} value={c.id}>{c.title} (Budget: ₹{c.budget})</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Milestone Description (e.g. Foundation Work)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                />

                <input
                    type="number"
                    placeholder="Allocation Amount (INR)"
                    value={allocation}
                    onChange={e => setAllocation(e.target.value)}
                    style={{ width: "100%", padding: 8 }}
                />
            </div>

            <button onClick={handleCreate} disabled={loading}>
                {loading ? "Adding..." : "Add Milestone"}
            </button>

            {message && <p style={{ fontSize: "0.9em", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
        </div>
    );
}
