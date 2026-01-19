export default function Transparency() {
    return (
        <div className="container" style={{ padding: "40px 20px", maxWidth: "800px" }}>
            <h1>Transparency Model</h1>
            <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "40px" }}>
                Understanding how we use Blockchain and AI to ensure every rupee counts.
            </p>

            <Section title="1. Donation Collection">
                Donations are sent to a smart contract, not a personal wallet. They are earmarked for specific causes.
            </Section>

            <Section title="2. Milestone Definition">
                NGOs must break down their project into specific milestones (e.g., "Buy Cement", "Pay Labor"). Funds are allocated per milestone.
            </Section>

            <Section title="3. Invoice Verification (The Magic)">
                When an NGO spends money, they upload the <strong>Original Invoice</strong> to our system.
                Our AI (Google Gemini) reads the invoice to verify:
                <ul>
                    <li>Is the date recent?</li>
                    <li>Does the vendor match?</li>
                    <li>Does the amount match the request?</li>
                </ul>
            </Section>

            <Section title="4. Governance & Payout">
                Admins review the AI score and the raw evidence. Only upon a 2/3rds consensus vote does the Treasury Smart Contract release the funds directly to the Vendor.
            </Section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "10px" }}>{title}</h3>
            <div style={{ color: "var(--text-dark)", lineHeight: "1.7" }}>{children}</div>
        </div>
    );
}
