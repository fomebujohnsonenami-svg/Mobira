# Mobira Backend Service

Django 5 REST Framework backend powering the Mobira Fintech Platform.

## Architecture
- **`apps/`**: Domain micro-modules (Users, Businesses, Verification, Payments, Recipients, Payment Lists, Transactions, Receive, Analytics, Audit).
- **`integrations/`**: Payment provider adapter architecture (`base/` defines the interfaces, `mock/` provides realistic telecom and banking simulation).
- **Database**: PostgreSQL strictly enforced via `DATABASE_URL`.

## Commands
```bash
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver 0.0.0.0:8000
```
