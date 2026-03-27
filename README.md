# BidNova – Online Auction Platform

A premium real-time online auction platform with live bidding, admin analytics, role-based access, and an AI chatbot assistant.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Routing | TanStack Router (client-side SPA) |
| Auth API | Node.js + Express (optional, mock fallback built-in) |
| Real-time | WebSocket / simulated bidding engine |
| Hosting | Vercel (frontend) + Render (Express backend) |

---

## Local Development

```bash
# 1. Install dependencies
cd src/frontend
npm install

# 2. Copy and configure environment variables
cp ../../.env.example .env
# Edit .env and set VITE_API_URL (or leave empty for mock mode)

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deploying to Vercel (Frontend)

### Step 1 – Push to GitHub

```bash
git init
git add .
git commit -m "Initial BidNova deployment"
git remote add origin https://github.com/<your-username>/bidnova.git
git push -u origin main
```

### Step 2 – Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in.
2. Click **"Add New Project"** → select your **bidnova** repository.
3. Vercel auto-detects settings from `vercel.json`. No framework preset needed.
4. Click **Deploy**.

### Step 3 – Configure Environment Variables

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-express-backend.onrender.com` (or leave blank for mock mode) |

> **Note:** If `VITE_API_URL` is not set, BidNova runs in demo mode with mock authentication — all bidding and auction features still work.

### Step 4 – Redeploy

After saving environment variables, go to **Deployments** and click **Redeploy** to apply them.

---

## Deploying the Express Backend (Optional)

If you want real user authentication with a database:

### Option A – Render (recommended)

1. Create a free account at [render.com](https://render.com).
2. Click **New → Web Service** → connect your GitHub repo.
3. Set **Root Directory** to `backend/` (if your Express app lives there).
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node index.js` (or `npm start`)
6. Add environment variables: `JWT_SECRET`, `DATABASE_URL`, `CORS_ORIGIN`.
7. Copy the Render service URL and set it as `VITE_API_URL` in Vercel.

### Option B – Vercel Serverless Functions

Move your Express routes into `src/frontend/api/` as Vercel serverless functions. Each file becomes an API endpoint automatically. Example:

```
src/frontend/api/
  auth/
    login.js   → /api/auth/login
    register.js → /api/auth/register
```

---

## Routing

All client-side routes are handled by TanStack Router. The `vercel.json` rewrite rule (`/* → /index.html`) ensures no 404 errors on page refresh or direct URL access.

| Route | Page |
|---|---|
| `/` | Home |
| `/login` | Login |
| `/register` | Register |
| `/userhome` | User Dashboard |
| `/postauction` | Post New Auction |
| `/liveauction/:id` | Live Auction |
| `/auctionstatus` | Auction Status |
| `/mybidding` | My Bids |
| `/admin` | Admin Dashboard |
| `/profile` | User Profile |

---

## Environment Variables Reference

See [`.env.example`](.env.example) for the full list with descriptions.

---

## Admin Access

Default admin credentials (demo mode): `admin@bidvault.com`

---

## License

MIT
