# QuantumShield — Complete Platform Documentation

> **Securing the Internet for the Quantum Era.**
> Full-stack SaaS cybersecurity platform for quantum cryptography risk assessment.

---

## 🗂️ Project Structure

```
quantumshield/
├── frontend/                        # Next.js 14 + TypeScript + Tailwind
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, metadata)
│   │   ├── page.tsx                 # Landing page (public)
│   │   ├── dashboard/page.tsx       # Main dashboard
│   │   ├── scanner/page.tsx         # Domain scanner tool
│   │   ├── reports/page.tsx         # Scan history & reports
│   │   ├── alerts/page.tsx          # Security alerts
│   │   ├── pricing/page.tsx         # Plans + Stripe checkout
│   │   ├── contact/page.tsx         # Contact form
│   │   ├── fix/page.tsx             # "Fix My Security" service
│   │   ├── settings/page.tsx        # User settings
│   │   └── auth/
│   │       ├── login/page.tsx       # Login
│   │       └── signup/page.tsx      # Sign up
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.tsx          # Left nav sidebar
│   │       ├── TopBar.tsx           # Top header bar
│   │       └── AppLayout.tsx        # Dashboard layout wrapper
│   ├── lib/
│   │   └── api.ts                   # Axios API client
│   ├── styles/globals.css           # Global styles + fonts
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── Dockerfile
│
├── backend/                         # Python FastAPI
│   ├── main.py                      # App entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── api/
│   │   ├── auth.py                  # JWT auth endpoints
│   │   ├── scanner.py               # Scan API
│   │   ├── reports.py               # Reports + CSV export
│   │   ├── alerts.py                # Alerts CRUD
│   │   ├── subscriptions.py         # Stripe billing
│   │   ├── contact.py               # Contact form
│   │   └── fix.py                   # Fix requests
│   ├── core/
│   │   └── database.py              # SQLAlchemy setup
│   ├── models/
│   │   └── models.py                # DB models
│   └── services/
│       └── scanner_service.py       # TLS scan engine + risk logic
│
├── docker-compose.yml               # Full stack (Postgres + backend + frontend)
└── .env.example                     # All env vars documented
```

---

## 🚀 Quick Start

### 1. Clone and set up environment
```bash
git clone <repo>
cd quantumshield
cp .env.example .env
# Edit .env with your real values (see below)
```

### 2. Run with Docker (recommended)
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### 3. Run locally (development)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start Postgres first (or use Docker for just the DB)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=changeme -e POSTGRES_DB=quantumshield -e POSTGRES_USER=quantumshield postgres:16

# Run API
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

---

## 📝 FILES TO EDIT (Customization Guide)

### 🔐 REQUIRED — Must change before production

| File | What to change |
|------|---------------|
| `.env.example` → `.env` | ALL values: DB password, JWT secret, Stripe keys, SMTP |
| `backend/core/database.py` | `DATABASE_URL` default (line 6) |
| `backend/api/auth.py` | `SECRET_KEY` line 13 — use env var only |

---

### 🎨 BRANDING — Change company name/colors

| File | What to change |
|------|---------------|
| `frontend/app/layout.tsx` | Page title, meta description, keywords |
| `frontend/app/page.tsx` | Hero headline, subheadline, stats numbers |
| `frontend/components/layout/Sidebar.tsx` | Logo name ("QuantumShield"), user info |
| `frontend/styles/globals.css` | Font imports if changing fonts |
| `frontend/tailwind.config.ts` | Color palette (primary, quantum, danger, safe) |

**Color variables** (change in `tailwind.config.ts` AND inline in page files):
```
Background: #0B0F1A
Primary Blue: #3B82F6
Quantum Purple: #7C3AED
Danger Red: #EF4444
Safe Green: #10B981
```

---

### 💳 STRIPE SETUP — Payments

1. Create products in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Create 3 prices: Starter ($49/mo), Professional ($199/mo), Enterprise ($999/mo)
3. Copy price IDs to `.env`

| File | What to change |
|------|---------------|
| `backend/api/subscriptions.py` | `STRIPE_PRICES` dict (line 14-18) if plan names change |
| `frontend/app/pricing/page.tsx` | Price amounts, plan names, features list |

---

### 📡 SCANNER ENGINE — Risk logic

| File | What to change |
|------|---------------|
| `backend/services/scanner_service.py` | `ALGORITHM_RISK` dict — add/modify algorithm risk scores |
| `backend/services/scanner_service.py` | `RECOMMENDATIONS_MAP` — customize advice per risk level |
| `backend/services/scanner_service.py` | `CIPHER_RISK` dict — cipher suite scoring |
| `backend/api/scanner.py` | `PLAN_LIMITS` dict (line 14-18) — scans per plan |

---

### 📧 EMAIL / NOTIFICATIONS

| File | What to change |
|------|---------------|
| `backend/api/contact.py` | `send_notification_email()` — email template, SMTP settings |
| `.env` | `ADMIN_EMAIL`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` |

---

### 🧭 NAVIGATION — Add/remove pages

| File | What to change |
|------|---------------|
| `frontend/components/layout/Sidebar.tsx` | `navItems` array (lines 10-21) — add/remove/rename nav items |
| `frontend/app/` | Add new `page.tsx` files for new routes |

---

### 🗄️ DATABASE — Schema changes

| File | What to change |
|------|---------------|
| `backend/models/models.py` | Add columns, new tables, relationships |
| `backend/core/database.py` | Connection string, pool settings |

After changing models, run:
```bash
# The app auto-creates tables on startup via init_db()
# For production, use Alembic for migrations:
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "your change"
alembic upgrade head
```

---

### 📊 DASHBOARD — Metrics and charts

| File | What to change |
|------|---------------|
| `frontend/app/dashboard/page.tsx` | Metric cards, `recentScans` mock data, alert banner |
| `frontend/app/reports/page.tsx` | `reports` mock data, table columns |
| `frontend/app/alerts/page.tsx` | `alerts` mock data |

> **Note**: Currently uses mock/static data. Connect to API using `lib/api.ts` functions.

---

### 🌐 DEPLOYMENT

#### Frontend → Vercel
```bash
cd frontend
vercel deploy
# Set env vars in Vercel Dashboard:
# NEXT_PUBLIC_API_URL=https://api.yourapp.com
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### Backend → Railway
```bash
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
# Railway auto-detects Dockerfile
```

#### Backend → AWS ECS / Render / Fly.io
```bash
# Use the Dockerfile in /backend
# Any container hosting works
```

---

### 🔑 ALL ENVIRONMENT VARIABLES

```bash
# ─── Backend ────────────────────────────────
DATABASE_URL=postgresql://user:pass@host:5432/quantumshield
JWT_SECRET_KEY=your-64-char-random-secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
ADMIN_EMAIL=admin@yourcompany.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=app-password

# ─── Frontend ────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Current user |
| POST | `/api/scanner/scan` | Run domain scan |
| GET | `/api/scanner/history` | Past scans |
| GET | `/api/reports/` | List reports |
| GET | `/api/reports/stats` | Aggregate stats |
| GET | `/api/reports/{id}/export/csv` | Download CSV |
| GET | `/api/alerts/` | Get alerts |
| PATCH | `/api/alerts/{id}/read` | Mark read |
| POST | `/api/subscriptions/create` | Create Stripe subscription |
| POST | `/api/subscriptions/cancel` | Cancel subscription |
| POST | `/api/subscriptions/webhook` | Stripe webhook |
| POST | `/api/contact/submit` | Contact form |
| POST | `/api/fix/request` | Fix request submission |

Full interactive docs: `http://localhost:8000/docs`

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Python 3.12, FastAPI, SQLAlchemy |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose + passlib bcrypt) |
| Payments | Stripe Subscriptions |
| Deployment | Docker, Vercel (frontend), Railway/AWS (backend) |
| Fonts | Space Grotesk, JetBrains Mono |

---

*Built with ❤️ for the post-quantum era.*
