import { useState } from "react";
import { connectWallet } from "./wallet";
import { isAdmin } from "./roles";
import Donate from "./donor/Donate";
import AdminPanel from "./admin/AdminPanel";

export default function App() {
  const [address, setAddress] = useState(null);
  const [role, setRole] = useState(null);

  async function login() {
    const { address } = await connectWallet();
    setAddress(address);
    setRole(isAdmin(address) ? "admin" : "donor");
  }

  if (!address) {
    return (
      <div>
        <h2>NGO Donation Platform</h2>
        <button onClick={login}>Connect Wallet</button>
      </div>
    );
  }

  return role === "admin" ? <AdminPanel /> : <Donate />;
}
