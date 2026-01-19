# Web3-Based NGO Donation Platform with AI-Enhanced Verification

This repository contains the source code for a transparent charitable donation platform built on Ethereum. It solves the "Oracle Problem" in philanthropy by using a hybrid architecture where on-chain fund release is controlled by an AI-assisted audit of off-chain vendor invoices.

## 🚀 Features

-   **Transparent Donations**: Donors send funds to a `DonationRegistry` smart contract, linked to specific causes.
-   **Milestone-Based Escrow**: Funds are locked in a `Treasury` contract and released *only* when specific milestones are met.
-   **AI-Powered Auditing**: Google Gemini 1.5 Flash acts as a financial auditor, verifying OCR-extracted invoice data against claimed amounts to prevent fraud.
-   **Multi-Signature Governance**: A 2/3rds consensus mechanism among administrators is required to approve payouts, ensuring human oversight.
-   **Automated Payouts**: Once approved, the smart contract automatically transfers funds directly to the vendor, eliminating intermediaries.

---

## 🛠️ Technology Stack

-   **Frontend**: React.js, Vite, Ethers.js
-   **Backend**: Node.js, Express.js
-   **Blockchain**: Ethereum (Sepolia Testnet), Hardhat
-   **AI/ML**: Google Gemini API (Generative AI)
-   **Storage**: IPFS (Pinata)
-   **OCR**: Tesseract.js (Images), pdf-parse (PDFs)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js** (v18 or higher)
2.  **MetaMask** Browser Extension
3.  **Git**
4.  An **Alchemy** or **Infura** account (for Sepolia RPC URL)
5.  A **Google Cloud** account (for Gemini API Key)
6.  A **Pinata** account (for IPFS storage)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TARUN-2305/NGO-Donations.git
cd NGO-Donations
```

### 2. Backend Setup

The backend handles OCR processing, communicating with the AI, and pinning files to IPFS.

```bash
cd backend
npm install
```

**Create a `.env` file in the `backend` directory:**

```env
# Blockchain Configuration
RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
PRIVATE_KEY="YOUR_ADMIN_WALLET_PRIVATE_KEY" # Must have Sepolia ETH

# Contract Addresses (Deployed on Sepolia)
DONATION_REGISTRY="0x..."
INVOICE_VERIFIER="0x..."
TREASURY="0x..."

# AI Configuration
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

# IPFS Configuration
PINATA_API_KEY="YOUR_PINATA_API_KEY"
PINATA_SECRET_API_KEY="YOUR_PINATA_SECRET"
```

### 3. Frontend Setup

The frontend is the user interface for donors and admins.

```bash
cd ../frontend
npm install
```

*(Note: Ensure `src/pages/CauseDetails.jsx` and other files reference the correct backend URL `http://localhost:3000` and contract addresses if they are hardcoded).*

---

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
cd backend
node index.js
```
*The server will start on `http://localhost:3000`.*

### 2. Start the Frontend Development Server

Open a new terminal:
```bash
cd frontend
npm run dev
```
*The application will unlock at `http://localhost:5173`.*

---

## 📜 Usage Guide

### 1. For Donors
1.  Connect your Wallet (MetaMask).
2.  Browse "Causes" on the home page.
3.  Click "View Details" on a cause.
4.  Enter an ETH amount and click **Donate**.
5.  Your donation is recorded on-chain, and the progress bar updates.

### 2. For NGO Admins (Milestone & Invoice)
1.  Go to the **Admin Dashboard** (`/admin`).
2.  Select "Create Milestone" to define a spending goal (e.g., "Buy 500 Notebooks").
3.  **Upload Invoice**:
    *   Select the Vendor.
    *   Enter the Claim Amount (in INR/Fiat abstraction).
    *   Upload the PDF or Image of the invoice.
    *   Submit.

### 3. For Platform Admins (Voting)
1.  On the Admin Dashboard, view "Pending Approvals".
2.  Review the **AI Analysis**:
    *   **Green**: Credibility Score > 80 (Safe).
    *   **Red**: Low score (Potential Fraud).
3.  Click **Approve**.
4.  Once 2/3rds of admins approve, the system automatically:
    *   Attests the invoice on-chain.
    *   Triggers the Treasury.
    *   **Pays the Vendor** directly in ETH.

---

## 📄 Research Paper

A detailed IEEE-format research paper explaining the architecture and algorithms is available in the `Research_Paper/` directory.

---

## 👥 Contributors

-   **Vijay Narayan Raikar** (RVCE)
-   **Tarun R** (RVCE)
-   **Suhas Shetti** (RVCE)
-   **Nandini C** (RVCE)
-   **K Y Hemalatha** (RVCE)

**Mentor**: Prof. Jayanthi P N

---

## 📄 License
MIT License
