import UploadInvoice from "./UploadInvoice";
import PendingInvoices from "./PendingInvoices";

export default function AdminPanel() {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>Admin Panel</h2>
      <p>You are logged in as an admin.</p>

      <hr />

      <UploadInvoice />

      <hr />

      <PendingInvoices />
    </div>
  );
}
