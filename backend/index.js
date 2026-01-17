import express from "express";
import multer from "multer";
import cors from "cors";

import { submitInvoice, adminVote } from "./invoiceFlow.js";
import { invoices } from "./invoiceStore.js";
import { createCause, createMilestone, causes, milestones } from "./causeStore.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// --- Admin / Setup Routes ---
app.post("/causes", (req, res) => {
  const cause = createCause(req.body);
  res.json(cause);
});

app.post("/milestones", (req, res) => {
  try {
    const ms = createMilestone(req.body);
    res.json(ms);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- Main Flows ---

app.post(
  "/invoice",
  upload.single("file"),
  async (req, res) => {
    try {
      const invoice = await submitInvoice({
        filePath: req.file.path,
        vendor: req.body.vendor,
        amount: Number(req.body.amount),
        milestoneId: req.body.milestoneId ? Number(req.body.milestoneId) : null
      });
      res.json(invoice);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
);

app.post("/invoice/:id/vote", async (req, res) => {
  const result = await adminVote(
    Number(req.params.id),
    req.body.admin
  );
  res.json(result);
});

// --- Unified Views ---

app.get("/invoices", (req, res) => {
  res.json(Object.values(invoices));
});

app.get("/admin/dashboard", (req, res) => {
  // Join: Cause -> Milestone -> Invoices
  const allInvoices = Object.values(invoices);

  const dashboardData = Object.values(causes).map(cause => {
    const causeMilestones = cause.milestoneIds.map(mid => {
      const ms = milestones[mid];
      // Filter invoices for this milestone
      const linkedInvoices = allInvoices.filter(inv => inv.milestoneId === ms.id);
      return { ...ms, invoices: linkedInvoices };
    });

    return { ...cause, milestones: causeMilestones };
  });

  const orphans = allInvoices.filter(inv => !inv.milestoneId);

  res.json({
    causes: dashboardData,
    orphans
  });
});

app.listen(3000, () =>
  console.log("Backend running on localhost:3000")
);
