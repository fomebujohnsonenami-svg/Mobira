# Mobira Production Deployment Guide

This guide outlines production hardening, containerized cloud deployment, database scaling, and zero-downtime operations for Mobira.

---

## 1. Environment Topology

```
             [Cloudflare / Route 53 (TLS 1.3 / DDoS)]
                                │
                 [Application Load Balancer / Nginx]
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
[Next.js Frontend SSR Cluster]               [Django DRF API Cluster]
(Vercel / AWS ECS / Cloud Run)              (Gunicorn + Uvicorn Workers)
        │                                               │
        └───────────────────────┬───────────────────────┘
                                ▼
               [Managed PostgreSQL 16 Cluster]
                (AWS RDS / GCP Cloud SQL / Neon)
                                │
               [Redis Cache & Celery Task Queue]
```

---

## 2. Environment Variables & Secrets Management

Store secrets in an external vault (AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault). Never commit secrets to git.

```ini
# Production Environment Sample
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=generate-strong-64-character-entropy-key
ALLOWED_HOSTS=api.mobira.africa
CORS_ALLOWED_ORIGINS=https://app.mobira.africa

# Managed PostgreSQL (with connection pooling)
DATABASE_URL=postgresql://mobira_user:Secr3tP@ssw0rd!@db-cluster.mobira.internal:5432/mobira_prod?sslmode=require

# Provider Rail Keys (when migrating from mock to live)
MTN_MOMO_API_KEY=live_sec_key_...
MTN_MOMO_SUBSCRIPTION_KEY=sub_key_...
ORANGE_MONEY_CLIENT_ID=om_live_...
ORANGE_MONEY_CLIENT_SECRET=om_secret_...
```

---

## 3. Database Migration & Provisioning

Mobira relies strictly on PostgreSQL from Day 1:
```bash
# Apply pending schema migrations
python manage.py migrate --no-input

# Collect static assets for CDN delivery
python manage.py collectstatic --no-input
```

---

## 4. Health Checks & Monitoring

- **API Liveness Probe**: `GET /api/v1/health/` (returns `200 OK` with database ping check)
- **Frontend Health**: `GET /api/health`
- **Error Tracking**: Integrated with Sentry for real-time alerting on payment exception events.
