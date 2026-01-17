import UploadInvoice from "./UploadInvoice";
import AdminDashboard from "./AdminDashboard";
import CreateCause from "./CreateCause";
import CreateMilestone from "./CreateMilestone";
import { useState } from "react";

export default function AdminPanel() {
  // Simple trigger to refresh valid options when data changes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "auto" }}>
      <h2>Admin Governance Panel</h2>
      <p>Manage Causes, Milestones, and Invoices.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        <CreateCause onCauseCreated={refresh} />
        <CreateMilestone key={refreshTrigger} onMilestoneCreated={refresh} />
      </div>

      <hr />

      <h3>Operational Actions</h3>
      <UploadInvoice key={`upload-${refreshTrigger}`} />

      <hr />

      <AdminDashboard key={`dash-${refreshTrigger}`} />
    </div>
  );
}
