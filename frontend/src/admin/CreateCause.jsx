import { useState } from "react";
import { PlusCircle, Layers, AlertCircle, CheckCircle } from "lucide-react";

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
            setMessage(`Success! Cause created with ID: ${data.id}`);
            setTitle("");
            setBudget("");
            if (onCauseCreated) {
                setTimeout(onCauseCreated, 1500); // Delay return so they see success message
            }
        } catch (err) {
            console.error(err);
            setMessage("Error creating cause.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="card" style={{ padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px -5px rgba(0,0,0,0.05)" }}>
                <div style={{ marginBottom: "30px", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                        Launch a new funding bucket on the blockchain.
                    </p>
                </div>

                <div className="grid gap-4">
                    <div>
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Cause Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Clean Water for Rural District"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
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
                        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600, color: "#1e293b" }}>Total Budget (INR)</label>
                        <input
                            type="number"
                            placeholder="e.g. 500000"
                            value={budget}
                            onChange={e => setBudget(e.target.value)}
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
                        {loading ? "Deploying..." : <><PlusCircle size={20} /> Initialize Cause</>}
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
