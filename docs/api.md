# Mobira REST API Specification

**Version**: `v1`  
**Base URL**: `http://localhost:8000/api/v1/`  
**Content-Type**: `application/json`  
**Authentication**: Bearer JWT (`Authorization: Bearer <token>`)

---

## 1. Authentication & Users

### `POST /api/v1/auth/login/`
Authenticates a user and issues access/refresh tokens.

**Request Body**:
```json
{
  "email": "finance@douala-agrotech.cm",
  "password": "Password123!"
}
```

**Response** (`200 OK`):
```json
{
  "access": "eyJhbGciOi...",
  "refresh": "eyJhbGciOi...",
  "user": {
    "id": "c1f7a298-b80d-4b8c-b03a-34547900b912",
    "email": "finance@douala-agrotech.cm",
    "name": "Jeanne Ngono",
    "role": "FINANCE_OFFICER",
    "business": {
      "id": "87b3221e-12cd-4f51-93e1-7e87ab09c450",
      "name": "Douala Agro-Tech SARL",
      "verification_tier": "GOLD_VERIFIED",
      "trust_score": 94
    }
  }
}
```

---

## 2. Business & Trust Verification

### `POST /api/v1/verification/preflight/`
Executes pre-flight anti-fraud validation on a phone number, bank account, or business tax identifier before initiating payment.

**Request Body**:
```json
{
  "channel": "MTN_MOMO",
  "account_identifier": "+237670000111",
  "expected_name": "Douala Organic Supplies"
}
```

**Response** (`200 OK`):
```json
{
  "is_verified": true,
  "match_status": "EXACT_MATCH",
  "confidence_score": 98.5,
  "registered_name": "DOUALA ORGANIC SUPPLIES SARL",
  "telecom_carrier": "MTN Cameroon",
  "kyc_tier": "KYC_LEVEL_2_VERIFIED",
  "risk_flags": [],
  "verification_id": "VRF-2026-0903-8821"
}
```

### `GET /api/v1/businesses/`
Lists registered businesses and public trust directory.

---

## 3. Payments (Disbursements)

### `POST /api/v1/payments/disburse/`
Initiates a single payout to a vendor, contractor, or employee.

**Request Body**:
```json
{
  "recipient_name": "Kribi Fishery Cooperatives",
  "channel": "MTN_MOMO",
  "account_identifier": "+237677112233",
  "amount": 150000,
  "currency": "XAF",
  "description": "Payment for batch #842 smoked fish",
  "idempotency_key": "idemp-disb-9281-9921",
  "require_preflight_check": true
}
```

**Response** (`201 Created`):
```json
{
  "reference": "MOB-DISB-20260903-4921",
  "status": "PROCESSING",
  "amount": 150000,
  "fee": 750,
  "currency": "XAF",
  "channel": "MTN_MOMO",
  "preflight_verified": true,
  "maker": "finance@douala-agrotech.cm",
  "requires_checker": false,
  "created_at": "2026-09-03T20:55:00Z"
}
```

### `GET /api/v1/payments/{reference}/`
Returns real-time status of a disbursement with simulated telecom callback history.

---

## 4. Payment Lists (Bulk Runs)

### `POST /api/v1/payment-lists/batches/`
Uploads and validates a batch payout file (payroll or supplier list).

**Request Body**:
```json
{
  "title": "September 2026 Field Staff Payroll",
  "items": [
    {
      "recipient_name": "Paul Biya Jr.",
      "channel": "MTN_MOMO",
      "account_identifier": "+237670112233",
      "amount": 180000
    },
    {
      "recipient_name": "Esther Mbarga",
      "channel": "ORANGE_MONEY",
      "account_identifier": "+237690445566",
      "amount": 220000
    }
  ]
}
```

### `POST /api/v1/payment-lists/batches/{batch_id}/execute/`
Executes pre-checked batch with real-time progress events.

---

## 5. Receive & Payment Links

### `POST /api/v1/receive/links/`
Creates a branded, verifiable payment link.

**Request Body**:
```json
{
  "title": "B2B Invoice #INV-2026-104",
  "amount": 45000,
  "currency": "XAF",
  "allow_custom_amount": false,
  "description": "Advance payment for 500kg Fertilizer"
}
```

**Response** (`201 Created`):
```json
{
  "id": "plink_89ab32",
  "slug": "pay-douala-agrotech-inv104",
  "payment_url": "http://localhost:3000/customer/pay-douala-agrotech-inv104",
  "qr_code_data": "https://mobira.africa/pay/plink_89ab32",
  "status": "ACTIVE"
}
```

### `POST /api/v1/receive/links/{slug}/pay/`
Customer checkout endpoint triggering a simulated MoMo push notification or bank transfer.

---

## 6. Transactions & Analytics

- `GET /api/v1/transactions/`: Unified ledger entries with filtering by direction (`DISBURSEMENT`, `COLLECTION`), channel, date, status.
- `GET /api/v1/analytics/overview/`: Cashflow KPIs, volume graphs, recipient distribution, and Trust Score metrics.
- `GET /api/v1/statements/export/?format=csv`: Downloadable audit-ready statement.
