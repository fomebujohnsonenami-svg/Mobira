# Mobira — Live Competition Pitch & Demo Script 🏆

**Time Budget**: 5 Minutes  
**Target Audience**: Fintech Competition Judges & Venture Panel  
**Demo Persona**: Jeanne Ngono, Finance Officer at *Douala Agro-Tech SARL* (Verified Tier 1 Merchant)

---

## 🎯 Pitch Hook (Minute 0:00 – 1:00)

> "Judges, across Africa today, businesses move billions of dollars every month over mobile money and bank transfers. But here is the silent killer for SMEs:
>
> **30% of business payments suffer from misdirected numbers, ghost vendor invoices, and manual reconciliation nightmares.**
>
> If a finance manager sends 500,000 francs to the wrong phone number on MoMo, that money is virtually gone.
>
> That’s why we built **Mobira**.
>
> Mobira is **NOT a bank, NOT a wallet, and NOT a replacement for MoMo or banks**. We are the **trust and orchestration layer** built directly on top of existing rails:
>
> **PAY • RECEIVE • VERIFY • GROW**"

---

## 💻 Live Walkthrough Flow (Minute 1:00 – 4:00)

### Scene 1: Command Center & Real-Time Trust Score (`/dashboard`)
1. **Show Dashboard**: Point out the live metrics: Total Volume processed, 94/100 Gold Verified Trust Badge.
2. **Talking Point**: *"Notice our business has a verified badge and trust score. In Africa, identity is credit. Mobira continuously calculates your trust score based on verified tax status and successful clean transactions."*

### Scene 2: Pre-Flight Anti-Fraud Verification (`/verify`)
1. **Navigate to Verify Tab**:
2. Enter Phone Number: `+237 670 000 111`.
3. Enter Expected Legal Name: `Douala Organic Supplies`.
4. Click **Run Pre-Flight Verification**.
5. **Observe**: The system performs an instant simulated subscriber name enquiry against telecom subscriber records and displays:
   - **Status**: 98% Match Confirmed.
   - **Registered Holder**: `DOUALA ORGANIC SUPPLIES SARL`.
6. **Talking Point**: *"Before spending a single franc, Mobira proves who owns this wallet. No more wrong numbers. No more invoice interception fraud."*

### Scene 3: High-Confidence Payout with Maker-Checker (`/payments`)
1. Click **Send Payment**.
2. Select recipient: `Kribi Fishery Cooperatives`.
3. Enter Amount: `250,000 FCFA` (Fee: 750 FCFA clearly calculated).
4. Click **Confirm & Send**.
5. **Observe**: The simulated MTN MoMo rail triggers with realistic network latency, updates to `PROCESSING`, and then `COMPLETED` with an immutable reference ID.
6. **Talking Point**: *"Notice for amounts above 500,000 FCFA, Mobira automatically enforces Maker-Checker dual governance. One clerk initiates, the CFO approves."*

### Scene 4: Instant Customer Payment Link & USSD Simulation (`/receive` & `/customer`)
1. Click **Receive** -> **Create Payment Link**.
2. Title: `Advance for 500kg Cocoa Beans` -> `45,000 FCFA`.
3. Open the public payment link: `/customer`.
4. Point out the **Mobira Verified Merchant Badge** prominently displayed to the payer.
5. Click **Pay with MTN MoMo** and enter phone `+237 677 889 900`.
6. **Watch the live USSD simulation dialog** pop up mimicking the customer's phone:
   - *"Approve payment of 45,000 FCFA to Douala Agro-Tech SARL? Enter PIN: ****"*.
7. Approve -> Instant green checkmark, instant receipt, and immediate ledger entry in the merchant dashboard!

### Scene 5: Bulk Payroll & Unified Ledger (`/payment-lists` & `/transactions`)
1. Click **Payment Lists**: Show automated CSV batch payroll execution with 10+ employees processed concurrently with zero manual errors.
2. Click **Transactions**: Show one unified ledger capturing MoMo, Orange Money, and Bank EFT with instant CSV export for accountants.

---

## 🚀 Closing & Competitive Moat (Minute 4:00 – 5:00)

> "Judges, telecom operators love Mobira because we increase their business transaction velocity.
> Banks love Mobira because we bring unbanked SMEs into formalized, auditable digital accounting.
> And SMEs love Mobira because we give them the trust, speed, and governance of an enterprise treasury without building one.
>
> We don't replace African financial infrastructure. **We make it work for business.**
>
> Thank you."
