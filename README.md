# Web3 NGO Donation & AI Verification Platform

A transparency-first donation platform that uses **Blockchain for settlement**, **IPFS for evidence**, and **AI for verification**.

## 🚀 The Core Problem Solved
Traditional NGOs are black boxes. You donate, but you never see the actual invoices or receipts.
**We solve this by:**
1.  **Automated Verification**: AI (Gemini + OCR) reads every invoice uploaded by the NGO.
2.  **Public Evidence**: The **RAW** invoice file is uploaded to IPFS. It is immutable and visible to donors/admins.
3.  **Governance**: Admins must vote to approve invoices based on AI credibility scores.
4.  **Trustless Payout**: Funds are tied to specific **Causes** and **Milestones** and released from an on-chain Treasury only after approval.

---

## 🏗️ Architecture

### 1. The "Trust" Layer (Smart Contracts)
*   `DonationRegistry.sol`: Records every donation on-chain with a privacy-preserving commitment.
*   `Treasury.sol`: Holds the funds. Enforces a 2/3 admin vote (via backend oracle) and a Timelock before releasing funds.
*   `InvoiceVerifier.sol`: Stores the "Attestation" (Decision + AI Score + Evidence Hash) on-chain.

### 2. The "Intelligence" Layer (Backend)
*   **Gemini AI**: Analyzes the invoice ("Does the date match?", "Is the vendor legit?", "Does the math add up?").
*   **Tesseract OCR**: Extracts raw text from images/PDFs.
*   **IPFS (Pinata)**: Anchors the **Raw Invoice File** and the **Encrypted Metadata Bundle**.

### 3. The "Interaction" Layer (Frontend)
*   **Donor Dashboard**: View active causes, milestone progress, and donate ETH.
*   **Admin Dashboard**: Create causes, define milestones, review AI-flagged invoices, and vote.

---

## 🛠️ Tech Stack
*   **Blockchain**: Hardhat, Solidity, Ethereum (Sepolia).
*   **Backend**: Node.js, Express, Multer, Google Gemini API.
*   **Storage**: IPFS (via Pinata).
*   **Frontend**: React, Vite, Ethers.js.

---

## 🏃‍♂️ How to Run

### Prerequisities
*   Node.js (v18+)
*   Metamask Wallet (Sepolia ETH)
*   Pinata API Keys (for IPFS)
*   Gemini API Key (for AI)

### 1. Start the Backend
```bash
cd backend
npm install
# Create a .env file with PINATA_JWT, GEMINI_API_KEY, PRIVATE_KEY (Admin), RPC_URL
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage Flow
1.  **Admin**: Log in -> Create a "Cause" (e.g., "Build School").
2.  **Admin**: Add a "Milestone" (e.g., "Buy Bricks - ₹50,000").
3.  **Donor**: Go to dashboard -> Donate ETH to the Cause.
4.  **Admin**: Uploads a Vendor Invoice for "Bricks".
5.  **System**:
    *   OCR reads text.
    *   Gemini validates amounts/dates.
    *   Raw file uploaded to IPFS.
6.  **Admin**: Reviews the AI Score + Raw Evidence -> Votes to Approve.
7.  **Treasury**: Releases ETH to the Vendor.

---

## 📝 Smart Contract Addresses (Sepolia)
*   **DonationRegistry**: `0x53e6cC3931521D18A1220355B965a4e164e79957`
*   **Treasury**: `[Check Deploy Log]`
*   **InvoiceVerifier**: `[Check Deploy Log]`
