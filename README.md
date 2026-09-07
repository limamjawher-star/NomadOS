# NomadOS 🌍✈️

**Mission Control for Global Remote Workers & Digital Nomads.**

NomadOS is a unified workspace designed to handle the legal, fiscal, logistical, and operational realities of continuous international travel.

---

## Key Features

- 🇪🇺 **Schengen 90/180-Day Calculator**: Exact rolling 180-day window compliance calculation (EU Regulation 2016/399) with future date simulations and stay logs.
- 🏛️ **Tax Physical Presence & 183-Day Rule Monitor**: Real-time counter of days spent per fiscal jurisdiction to protect against accidental statutory tax residence triggers.
- 🗺️ **Global Itinerary & Flight Sequence**: Centralized trip planner with accommodation statuses, flight dates, and base coordinates.
- 🕒 **Synchronous Collaboration Clock**: Multi-timezone matrix highlighting active overlaps between nomad bases and distributed team hubs.
- 💰 **Burn Rate & Runway Engine**: Daily burn tracking against a target monthly budget with multi-currency converter (USD, EUR, GBP, THB, IDR, JPY, MXN, BGN).
- 🔐 **Nomad Vault & Expiry Monitor**: Passport 6-month validity alerts and pre-flight protocol checklists.

---

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript check & build
npm run build
```

---

## Deploying to Vercel

1. Push this repository to your GitHub account or use **Export to GitHub** in Google AI Studio.
2. In [Vercel](https://vercel.com), click **Add New Project** and select this repository.
3. Vercel will automatically detect the **Vite** preset (`npm run build`, output folder `dist`).
4. (Optional) Add your Supabase environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## Offline-First Storage & Cloud Sync

- NomadOS works completely offline by default using local browser storage with export/import backup options.
- It can be connected to Supabase for multi-device cloud synchronization.
