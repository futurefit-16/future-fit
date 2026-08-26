# Future Fit — Setup & Run Guide

Next.js 16 (App Router, Turbopack) storefront with Razorpay checkout, Supabase data,
and OTP login. Deployed to **Cloudflare Workers** via the OpenNext adapter.

---

## 1. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **22 or newer** | Wrangler refuses to run on Node 20 |
| npm | 10+ | ships with Node 22 |
| Git | any | |

The repo pins the version in `.nvmrc`. If you use nvm for Windows:

```powershell
nvm install 22
nvm use 22
node -v   # should print v22.x
```

On macOS/Linux with nvm: `nvm use` (reads `.nvmrc`).

> New terminals may fall back to your old default Node. If a command complains
> about the Node version, run `nvm use 22` again.

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Environment variables

Create a `.env.local` file in the project root (one may already exist locally).
It is gitignored — never commit it.

```bash
# --- Required ---------------------------------------------------------------
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=<razorpay secret>

# --- Server-side features (optional in dev) --------------------------------
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # admin/stock operations
RAZORPAY_WEBHOOK_SECRET=<webhook secret>       # /api/webhooks/razorpay
GROQ_API_KEY=<groq key>                        # /api/fit-finder AI
SMS_API_KEY=<sms provider key>                 # OTP send
EMAIL_API_KEY=<email provider key>             # order notifications
TWILIO_SID=<twilio sid>                        # OTP via Twilio
TWILIO_AUTH=<twilio auth token>
TWILIO_NUMBER=+1xxxxxxxxxx

# --- Analytics (optional) --------------------------------------------------
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxx
```

Validation lives in `lib/env-validation.ts`. In development, missing values only
log a warning; in production the app throws on startup. `RAZORPAY_KEY_ID` must
match `rzp_live_*` or `rzp_test_*`, and production requires an `https://` site URL
plus live Razorpay keys.

There is also a `.dev.vars` file used by the Cloudflare tooling. It only needs:

```
NEXTJS_ENV=development
```

---

## 4. Database (Supabase)

SQL migrations are in `supabase/migrations/`. Run them against your Supabase
project (SQL editor or CLI) before using product/stock features:

- `20260215_create_products.sql`
- `20260215_decrement_stock.sql`

---

## 5. Run on localhost

```bash
npm run dev
```

Open <http://localhost:3000>. Hot reload is enabled; edit `app/page.tsx` to see it.

This is the fastest loop and what you should use for day-to-day development.

---

## 6. Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Plain Next.js production build |
| `npm run start` | Serve the plain Next build |
| `npm run lint` | ESLint |
| `npm run cf:build` | Build + transform into a Cloudflare Worker (`.open-next/`) |
| `npm run preview` | Build, then serve the Worker locally on <http://localhost:8787> |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` from Wrangler bindings |

Use `npm run preview` before deploying — it runs the app in the real `workerd`
runtime, which catches problems `next dev` cannot.

---

## 7. Deploying to Cloudflare

This app has API routes and server-rendered pages, so it **cannot** use a static
export. It runs as a Worker, not a Pages static site.

### Option A — Cloudflare Workers Builds (recommended)

Connect the GitHub repo as a **Worker** and set:

- Build command: `npx @opennextjs/cloudflare build`
- Deploy command: `npx @opennextjs/cloudflare deploy`
- Node version: `22`

Add every variable from section 3 in the Worker's settings (mark secrets as
encrypted). This gives reproducible builds and avoids local `.env` files leaking
into production.

### Option B — from your machine

```bash
nvm use 22
npx wrangler login
npm run deploy
```

Worker configuration (name, compatibility flags, asset directory) lives in
`wrangler.jsonc`; the OpenNext adapter is configured in `open-next.config.ts`.

---

## 8. Project layout

```
app/                 routes, pages, and API route handlers
  api/               Razorpay, OTP, waitlist, fit-finder, webhooks
components/          UI components
lib/                 validation, pricing, Supabase clients, helpers
actions/             server actions (AI, social)
supabase/migrations/ SQL schema
public/              static assets and _headers (cache rules)
next.config.ts       Next config + security headers + OpenNext dev hook
wrangler.jsonc       Cloudflare Worker config
open-next.config.ts  OpenNext adapter config
```

Security headers (CSP, X-Frame-Options, etc.) are set in `next.config.ts` under
`headers()`. There is intentionally no middleware file — Node middleware is not
reliably supported by the Cloudflare adapter.

---

## 9. Troubleshooting

**`Wrangler requires at least Node.js v22.0.0`**
Run `nvm use 22` in the current terminal.

**`Error: Output directory "out" not found` on Cloudflare**
The project is configured as a Pages static site. Switch to Workers Builds with
the commands in section 7, or set the build output directory to `.open-next`.

**`export const dynamic = "force-static" ... not configured on route "/api/..."`**
Something re-added `output: "export"` to `next.config.ts`. Remove it — static
export is incompatible with this app's API routes.

**`Could not resolve "@opentelemetry/api"` during `cf:build`**
`@opentelemetry/api` must be installed (`npm install @opentelemetry/api`) and no
middleware file should exist in the project root.

**`WARN OpenNext is not fully compatible with Windows`**
Expected and safe for building. If you hit odd runtime failures, build inside WSL.

**Blank page or 500 after deploy**
Check that all required environment variables exist in the Worker settings, then
tail logs with `npx wrangler tail`.
