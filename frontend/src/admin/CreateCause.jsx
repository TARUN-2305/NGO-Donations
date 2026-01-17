import { useState } from "react";

export default function CreateCause({ onCauseCreated }) {
    const [title, setTitle] = useState("");
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleCreate() {
        if (!title || !budget) {
            setMessage("Please fill all fields.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:3000/causes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, budget })
            });

            if (!res.ok) throw new Error("Failed to create cause");

            const data = await res.json();
            setMessage(`Cause created! ID: ${data.id}`);
            setTitle("");
            setBudget("");
            if (onCauseCreated) onCauseCreated(); // Refresh parent if needed
        } catch (err) {
            console.error(err);
            setMessage("Error creating cause.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 8, marginBottom: 20 }}>
            <h4>Create New Cause</h4>
            <div style={{ marginBottom: 10 }}>
                <input
                    type="text"
                    placeholder="Cause Title (e.g. Build School)"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                />
                <input
                    type="number"
                    placeholder="Total Budget (INR)"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    style={{ width: "100%", padding: 8 }}
                />
            </div>
            <button onClick={handleCreate} disabled={loading}>
                {loading ? "Creating..." : "Create Cause"}
            </button>
            {message && <p style={{ fontSize: "0.9em", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
        </div>
    );
}
