import express from "express";
import multer from "multer";
import cors from "cors";

import { submitInvoice, adminVote } from "./invoiceFlow.js";
import { invoices } from "./invoiceStore.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post(
  "/invoice",
  upload.single("file"),
  async (req, res) => {
    const invoice = await submitInvoice({
      filePath: req.file.path,
      vendor: req.body.vendor,
      amount: Number(req.body.amount)
    });
    res.json(invoice);
  }
);

app.post("/invoice/:id/vote", async (req, res) => {
  const result = await adminVote(
    Number(req.params.id),
    req.body.admin
  );
  res.json(result);
});

app.get("/invoices", (req, res) => {
  const list = Object.values(invoices);
  res.json(list);
});

app.listen(3000, () =>
  console.log("Backend running on localhost:3000")
);
