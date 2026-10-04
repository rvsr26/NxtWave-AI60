# AI60 Growth OS — README

> **"Turn curiosity into your first AI project."**

A production-quality growth experiment platform built for the NxtWave Growth Intern Challenge.
This is not a landing page. It's a full growth operating system.

---

## Problem

Free online workshops struggle with registration conversion because they ask students to commit before giving them a reason to care.

Generic CTA: *"Join our free AI workshop"* → 8.7% conversion  
Personalized CTA: *"Discover the AI project you could build"* → 13.9% conversion (illustrative A/B data)

---

## Target User

Final-year engineering students (2025 batch) who:
- Are aware of AI but haven't built anything with it
- Are anxious about standing out in placements
- Belong to strong college communities (natural distribution vector)
- Have WhatsApp groups for campus updates

---

## Growth Hypothesis

> Students don't care about attending another workshop.  
> They care about what they could build.

Entry point: **Personalized discovery → Project Passport → Registration → Share → Campus League**

---

## Product: AI60 Growth OS

### What it is
A complete growth operating system that runs the "Build Your First AI Project in 60 Minutes" workshop campaign.

### Features
1. **AI Project Passport** — Personalized project generator (OpenAI API + deterministic fallback)
2. **Registration** — With referral/campus attribution and duplicate prevention
3. **Campus League** — College-level leaderboard driving community competition
4. **Campus Captain** — Volunteer leader dashboard with tracked share links
5. **Referral System** — Unique codes, self-referral prevention, attribution
6. **Growth Dashboard** — Funnel, sources, KPIs, real-time stats
7. **Experiment Lab** — A/B test display with hypotheses and decisions
8. **AI Campaign Copilot** — Message variant generator (OpenAI or deterministic)
9. **Decision Log** — Growth decisions with observation → reason → action
10. **Growth Simulator** — Interactive 500-registration planning model
11. **Budget Allocator** — ₹2,000 phased experiment budget view
12. **Admin Panel** — Demo data seeding/reset with clear simulation labels

---

## Architecture

```
src/
├── types.ts           # All TypeScript types
├── storage.ts         # localStorage layer (Supabase-ready interface)
├── analytics.ts       # Event tracking module
├── ai.ts              # OpenAI + deterministic fallback generators
├── demoData.ts        # Simulation seed data (clearly labeled)
├── context/
│   └── AppContext.tsx # Global state + registration logic
├── components/
│   ├── Navigation.tsx  # Responsive sidebar + mobile header
│   ├── PassportCard.tsx
│   └── SimBanner.tsx
├── pages/
│   ├── PassportGenerator.tsx
│   ├── RegistrationForm.tsx
│   ├── SuccessPage.tsx
│   ├── CampusLeague.tsx
│   ├── CampusCaptain.tsx
│   ├── GrowthDashboard.tsx
│   ├── ExperimentLab.tsx
│   ├── DecisionLog.tsx
│   ├── CampaignCopilot.tsx
│   ├── GrowthSimulator.tsx
│   └── AdminPanel.tsx
└── App.tsx             # Root router
```

---

## How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env.local
# Fill in VITE_OPENAI_API_KEY and VITE_SUPABASE_* (both optional)

# 3. Start development server
npm run dev

# App runs at http://localhost:5173
```

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_OPENAI_API_KEY` | Optional | AI Project Passport + Campaign Copilot. Falls back to deterministic generator. |
| `VITE_SUPABASE_URL` | Optional | Cloud database. Falls back to localStorage. |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase authentication. |

---

## How to Deploy (Vercel)

```bash
# 1. Build
npm run build

# 2. Deploy via Vercel CLI
npx vercel --prod

# OR connect GitHub repo to vercel.com and set environment variables in dashboard
```

Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## Demo Credentials

No login required. The app works out of the box.

- Open http://localhost:5173 to see the student-facing landing experience
- Navigate to Admin (🔧) to seed demo data and run the demo sequence
- Open Admin → "Seed Demo Data" to populate all simulation data

---

## Simulation Data Disclaimer

⚠️ **All pre-seeded numbers are simulation/illustrative data.**

- Campus registrations (Amrita: 74, VIT: 61, etc.) are **not real**
- A/B test results are **illustrative simulations**, not real experiments
- Decision log entries are **example scenarios**, not actual campaign decisions
- Growth funnel data includes **estimated** and **illustrative** values

Every piece of simulated data is visibly labeled throughout the app.

---

## Real vs. Simulated

| Feature | Real Functionality |
|---|---|
| Registration form | ✅ Real — stores to localStorage, validates, prevents duplicates |
| Referral attribution | ✅ Real — tracks via URL params, prevents self-referral |
| Campus attribution | ✅ Real — campus code from URL or form |
| Project Passport | ✅ Real — AI API or deterministic generator |
| Analytics events | ✅ Real — stored in localStorage |
| Pre-seeded campus data | ⚠️ Simulation — clearly labeled |
| A/B experiment results | ⚠️ Illustrative — clearly labeled |
| Decision log | ⚠️ Example scenarios — clearly labeled |
| Funnel visitors estimate | ⚠️ Derived estimate — clearly labeled |

---

## What I Would Add in the Next 24 Hours

1. Supabase integration (migrations in `/docs/DATABASE.md`)
2. Email notification on registration (Resend API)
3. Real-time campus leaderboard updates (Supabase Realtime)
4. Export registrations to CSV
5. Actual Vercel deployment with custom domain
6. Mobile PWA manifest for "Add to Home Screen"
