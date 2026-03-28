# BidNova - Online Auction Platform

Full-stack auction platform with React (Vite) frontend on Vercel and Node.js/Express backend on Render.

---

## Project Structure

```
├── server.js              # Express backend (deploy on Render)
├── vercel.json            # Vercel deployment config
├── .env.example           # Environment variable reference
└── src/
    └── frontend/          # React (Vite) app (deploy on Vercel)
        ├── src/
        │   └── lib/
        │       └── authApi.ts   # API fetch layer (uses VITE_API_URL)
        └── dist/          # Build output
```

---

## Deployment Guide

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "BidNova deployment setup"
git push origin main
```

---

### Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New > Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `/` (or wherever `server.js` lives)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
4. Add environment variables in Render dashboard:

   | Variable | Value |
   |---|---|
   | `JWT_SECRET` | a long random string |
   | `CORS_ORIGIN` | `https://YOUR-VERCEL-APP.vercel.app` |
   | `DATABASE_URL` | your MySQL URL (optional) |

5. Click **Deploy**. Copy the Render URL shown (e.g. `https://bidnova-xyz.onrender.com`)

---

### Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → Import your GitHub repo
2. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `src/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com` |

4. Click **Deploy**

---

### Step 4 — Fix CORS (final step)

After both are deployed, update the `CORS_ORIGIN` in your Render environment variables to match your actual Vercel URL, then redeploy the Render service.

```
CORS_ORIGIN=https://your-actual-app.vercel.app
```

> **Important:** The backend reads `CORS_ORIGIN` at startup. Whenever you change it in Render, you must redeploy (or it will restart automatically).

---

## Local Development

```bash
# 1. Copy environment file
cp .env.example .env
# Edit .env with your values

# 2. Start backend
node server.js

# 3. Start frontend (new terminal)
cd src/frontend
npm install
npm run dev
```

Local frontend will run on `http://localhost:5173` and connect to backend on `http://localhost:5000`.

---

## Common Issues

| Error | Cause | Fix |
|---|---|---|
| `Failed to fetch` | Wrong or missing `VITE_API_URL` | Set it in Vercel dashboard, redeploy |
| `CORS blocked` | `CORS_ORIGIN` on Render doesn't match Vercel URL | Update `CORS_ORIGIN` in Render, redeploy backend |
| `Network Error` | Render backend is sleeping (free tier) | Wait ~30s for cold start, or upgrade plan |
| 404 on page refresh | Missing `vercel.json` rewrites | Already included in this repo |

---

## Authentication API

| Endpoint | Method | Body | Response |
|---|---|---|---|
| `/api/auth/register` | POST | `{ username, email, password }` | `{ token, user }` |
| `/api/auth/login` | POST | `{ email, password }` | `{ token, user }` |
| `/health` | GET | — | `{ status: "ok" }` |

---

## Admin Access

Default admin credentials: `admin@bidvault.com`

---

## Pages / Routes

| Route | Page |
|---|---|
| `/home` | Home |
| `/login` | Login |
| `/register` | Register |
| `/userhome` | User Dashboard |
| `/postauction` | Post Auction |
| `/liveauction` | Live Auction |
| `/auctionstatus` | Auction Status |
| `/mybidding` | My Bidding |
| `/admin` | Admin Dashboard |
| `/profile` | User Profile |
