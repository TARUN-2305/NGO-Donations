export default function NGOs() {
    return (
        <div className="container" style={{ padding: "40px 20px" }}>
            <h1>Verified NGOs</h1>
            <p style={{ marginBottom: "40px" }}>Organizations vetted for transparency and impact.</p>

            <div className="card">
                <h3>Sample NGO Foundation</h3>
                <p>Focus: Education & Healthcare</p>
                <div style={{ marginTop: "10px" }}>
                    <span className="badge badge-green">Verified</span>
                </div>
            </div>
        </div>
    );
}
