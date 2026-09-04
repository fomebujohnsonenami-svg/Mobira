# Mobira ⚡

> **A trusted business payment and identity platform built on existing payment infrastructure.**
>
> **PAY • RECEIVE • VERIFY • GROW**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Backend-Django%205%20%2F%20DRF-092E20?style=flat&logo=django)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Competition%20Prototype-success?style=flat)](#)

---

## 🎯 What is Mobira?

Mobira is **NOT a bank**, **NOT a wallet**, and **NOT a replacement for MoMo or banks**.

Instead, Mobira sits on top of existing African payment rails (MTN Mobile Money, Orange Money, Interbank EFT) as an **orchestration, pre-flight identity verification, and business enablement platform**.

### Core Proposition
1. **PAY**: Automated single and bulk payouts (payroll, supplier runs) with pre-flight name matching to prevent fraud and misrouted payments.
2. **RECEIVE**: Branded dynamic payment links and verified QR codes that give customers trust and prompt them on their native MoMo/Bank app.
3. **VERIFY**: Real-time KYB/KYC name-matching and national business registry validation before any disbursement is executed.
4. **GROW**: Automated transaction reconciliation, audit-ready financial statements, and an algorithmic Trust Score that unlocks trade credit and ecosystem reputation.

---

## 🏗️ Architecture & Clean Provider Abstraction

All payment-provider interactions in this prototype are **realistically simulated** using an extensible provider abstraction. The codebase is architected with a strict separation of concerns (`integrations/base/` vs. `integrations/mock/`) so production telecom/bank APIs can be plugged in without refactoring any business logic or application code.

```
mobira/
├── frontend/             # Next.js 15 App Router, TypeScript, Tailwind CSS
├── backend/              # Django 5 REST Framework, PostgreSQL
│   ├── apps/             # Modular domain apps (users, verification, payments...)
│   └── integrations/     # Base provider interfaces & mock implementations
├── docs/                 # Architecture, API specs, Demo pitch script, Deployment
├── docker-compose.yml    # Full-stack container orchestration
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)
Make sure Docker Desktop is running, then run:

```bash
# 1. Clone or navigate to mobira
cd mobira

# 2. Launch PostgreSQL, Django Backend, and Next.js Frontend
docker-compose up --build
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- **API Docs**: [http://localhost:8000/api/v1/docs/](http://localhost:8000/api/v1/docs/)

---

### Option 2: Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Ensure PostgreSQL is running and DATABASE_URL is set in backend/.env:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mobira_db

python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver 0.0.0.0:8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🏆 Live Demonstration Walkthrough for Judges

See [`docs/demo-script.md`](docs/demo-script.md) for the complete 5-minute competition script and talking points:
1. **The Problem**: 30%+ of business payouts in Central & West Africa suffer from misdirected numbers, ghost vendors, and reconciliation chaos.
2. **Pre-flight Identity Check (`/verify`)**: Check vendor phone `+237 670 000 111` against legal business name before spending 1 franc.
3. **Disbursement Wizard (`/payments`)**: 3-step maker-checker payout with fee breakdown and live simulated telecom response.
4. **Bulk Batch Lists (`/payment-lists`)**: Automated payroll validation and batch payout.
5. **Customer Receive (`/customer`)**: Branded payment link with instant USSD simulator.
6. **Audit & Statements (`/statements` & `/analytics`)**: Export clean audit trails and track business Trust Score.

---

## 📄 Documentation

- [System Architecture & Data Flows](docs/architecture.md)
- [REST API Reference](docs/api.md)
- [Judge Presentation & Demo Script](docs/demo-script.md)
- [Production Deployment Guide](docs/deployment.md)
