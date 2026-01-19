import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { connectWallet } from "../wallet";
import { isAdmin } from "../roles";

export default function Navbar() {
    const [address, setAddress] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Check wallet status on mount & listen for changes
    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setAddress(accounts[0]);
                        setIsUserAdmin(isAdmin(accounts[0]));
                    }
                } catch (e) {
                    console.error("Error checking accounts", e);
                }
            }
        };

        checkConnection();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                    setIsUserAdmin(isAdmin(accounts[0]));
                } else {
                    setAddress(null);
                    setIsUserAdmin(false);
                }
            });
        }
    }, []);

    async function handleConnect() {
        try {
            const { address } = await connectWallet();
            setAddress(address);
            setIsUserAdmin(isAdmin(address));
        } catch (e) {
            console.error(e);
        }
    }

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Impact", path: "/impact" },
        { name: "Donate", path: "/causes" },
        { name: "Admin Panel", path: "/admin", adminOnly: true },
    ];

    return (
        <nav style={{
            background: "transparent",
            height: "var(--header-height)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            padding: "0 20px",
            display: "flex",
            alignItems: "center"
        }}>
            {/* Hamburger Toggle - Top Left */}
            <button
                onClick={() => setIsMenuOpen(true)}
                style={{
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    color: "var(--primary)"
                }}
            >
                <Menu size={24} />
            </button>

            {/* Sidebar / Drawer */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "300px",
                height: "100vh",
                background: "white",
                boxShadow: "5px 0 25px rgba(0,0,0,0.1)",
                transform: isMenuOpen ? "translateX(0)" : "translateX(-120%)",
                transition: "transform 0.3s ease-in-out",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                zIndex: 1001,
                visibility: isMenuOpen ? "visible" : "hidden" // Ensure it's not clickable when hidden
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1.5rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Shield size={28} /> CivicFund
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {navLinks.map(link => {
                        if (link.adminOnly && !isUserAdmin) return null;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    color: location.pathname === link.path ? "var(--primary)" : "var(--text-dark)",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    background: location.pathname === link.path ? "aliceblue" : "transparent"
                                }}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div style={{ marginTop: "auto" }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleConnect}
                        style={{ width: "100%", gap: "10px", borderRadius: "30px" }}
                    >
                        <Wallet size={18} />
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
                    </button>
                    {address && (
                        <div style={{ textAlign: "center", marginTop: "10px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Connected: {address.slice(0, 10)}...
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 1000
                    }}
                />
            )}
        </nav>
    );
}
