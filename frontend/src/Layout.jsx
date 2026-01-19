import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <main style={{ flex: 1, paddingBottom: "40px" }}>
                <Outlet />
            </main>
            <footer style={{
                background: "white",
                borderTop: "1px solid var(--border)",
                padding: "40px 0",
                marginTop: "auto",
                textAlign: "center",
                color: "var(--text-muted)"
            }}>
                <div className="container">
                    <p>© 2026 TrustNGO Platform. A Transparent Civic Tech Initiative.</p>
                </div>
            </footer>
        </div>
    );
}
