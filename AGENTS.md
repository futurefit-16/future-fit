# Future Fit — Codebase Guide

Premium heavyweight streetwear storefront for the Indian market (Bengaluru).
Next.js 16 App Router + Turbopack, deployed to **Cloudflare Workers**.
Currently pre-launch: the homepage is a countdown + waitlist capture, but the
shop, product pages and Razorpay checkout are all built.

## Deployment — read this first

Deployed as a **Cloudflare Worker** via `@opennextjs/cloudflare`, not Pages,
not a static export.

- Do **not** add `output: "export"` to `next.config.ts`. The app has 8 API
  routes; static export breaks the build with
  `export const dynamic = "force-static" ... not configured on route "/api/..."`.
- Do **not** configure Cloudflare Pages with output directory `out`. That
  produces `Error: Output directory "out" not found`.
- Workers Builds settings: build `npx @opennextjs/cloudflare build`,
  deploy `npx @opennextjs/cloudflare deploy`, Node `22`.
- **Node 22+ is required** — Wrangler refuses to run on Node 20. Pinned in
  `.nvmrc`; run `nvm use 22` if a command complains.
- There is intentionally **no middleware file**. A root `proxy.ts` existed and
  broke the OpenNext bundle with `Could not resolve "@opentelemetry/api"`.
  Security headers now live in `next.config.ts` under `headers()`.
- `netlify.toml` is stale leftover from a previous host. Ignore it.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server, localhost:3000 (works on Node 20) |
| `npm run build` | Plain Next build |
| `npm run cf:build` | Build + transform to Worker in `.open-next/` |
| `npm run preview` | Serve the Worker locally on localhost:8787 |
| `npm run deploy` | Build + deploy to Cloudflare |

Full setup instructions live in `SETUP.md`.

## Layout

```
app/                    routes; policy pages, shop, product/[slug], studio, faq
  api/                  razorpay (+verify, +webhook), otp/{send,verify},
                        waitlist, notify/order, fit-finder
  layout.tsx            root metadata, Organization JSON-LD, ConsentGate
  not-found.tsx         custom 404
  robots.ts sitemap.ts  both use `export const dynamic = "force-static"`
components/
  consent/ConsentGate   cookie banner; gates GA, Clarity, GoAffPro
  cart/CartContext      client-side cart state
  studio/               fabric.js design canvas
  3d/ fitting/ sizing/  three.js / webcam features
lib/
  products.ts           PRODUCTS map keyed by slug; typed sizes + images
  pricing.ts            PRICING_CONFIG per slug; GST 12%, margin math
  validation.ts         zod schemas (Indian phone/pincode rules)
  env-validation.ts     imported by root layout; throws in production
  supabase/{client,server}.ts
supabase/migrations/    products table + decrement_stock RPC
```

## Conventions

**Metadata and canonicals.** Every indexable page sets its own
`alternates: { canonical: "/path" }`. Never set `alternates` in
`app/layout.tsx` — metadata is inherited, so a root canonical makes every page
declare itself a duplicate of the homepage. Client-component pages
(`"use client"`) cannot export metadata; add a sibling `layout.tsx` instead —
that is why `app/{checkout,login,register,logout}/layout.tsx` exist, and they
set `robots: { index: false, follow: false }`.

**Styling.** Tailwind v4, dark theme, semantic tokens (`bg-background`,
`text-muted-foreground`, `border-foreground/10`). House style is heavy tracking
(`font-black tracking-tighter`), pill buttons
(`rounded-full ... hover:scale-105`), and the `F\F` ring motif on empty/error
states — see `app/careers/page.tsx` and `app/not-found.tsx`.

**Logo assets.** The brand mark is a navy script lockup on an off-white field,
which cannot sit directly on the dark UI. Variants in `public/`:

| File | Use |
| --- | --- |
| `logo.png` | Full lockup, original colours. Light backgrounds, JSON-LD `logo` |
| `logo-white.png` | Full lockup incl. tagline, white on transparent. Footer, OG image |
| `logo-wordmark-white.png` | Script only, white on transparent. Navbar |
| `app/icon.png`, `app/apple-icon.png` | 512px / 180px square `F\F` monogram, white on `#0a0a0a` |

All three are **derived** from the brand's `FullLockup_White` PNG. That file
arrived flattened on black with no alpha, which for white ink on pure black is
losslessly recoverable — luminance *is* the coverage — so alpha was rebuilt from
it and the result trimmed to a tight box. `logo.png` is the same mask tinted
with the brand navy `rgb(5,37,58)`, sampled from the original artwork; do not
sample the supplied navy PNG for colour, as it is flattened on black and
downscaling has pulled its ink toward zero.

The brand files as received are **1024×483, not the 3000px their names claim**,
having been downscaled in transit. That is still comfortably above every use on
the site (the largest is 620px wide in the OG image), but if the true originals
turn up, regenerate from them. There is no SVG version.

`Image` components hardcode these intrinsic sizes — `919×438` for the lockup,
`919×280` for the wordmark — so update `components/layout/{Navbar,Footer}.tsx`
and the `<img>` in `app/opengraph-image.tsx` if the assets are ever replaced.
Do not add `app/favicon.ico` back — the `icon.png` convention supersedes it.

**The icons deliberately do not use the script logo.** A connected script
wordmark is an unreadable smudge at the 16px a browser tab actually renders, so
the icons reuse the older `F\F` monogram, which survives the downsample. Only
replace them with a compact mark, never with the lockup.

**The navbar tagline is live text, not part of the bitmap.** The navbar shows
`logo-wordmark-white.png` plus a `<span>` reading "Wear the future"; the
lockup's own tagline would render ~3px tall there. Keep the two in sync if
either changes, and leave the `<span>` `aria-hidden` since the image `alt` and
the link's `aria-label` already name the brand.

**Analytics.** Nothing tracking-related may render directly in the layout.
Add it inside `ConsentGate` so it stays behind consent.

## Environment

Required: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RAZORPAY_KEY_ID` (must match
`rzp_(live|test)_*`), `RAZORPAY_KEY_SECRET`.

Optional: `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_WEBHOOK_SECRET`,
`GROQ_API_KEY`, `SMS_API_KEY`, `EMAIL_API_KEY`, `TWILIO_*`,
`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`.

`lib/env-validation.ts` warns in dev and throws in production. `.dev.vars`
holds `NEXTJS_ENV=development` and is read during local OpenNext builds, so
prefer Workers Builds for production deploys.

## Known issues

Recorded so they are not rediscovered. None are fixed yet.

1. **OTP storage is broken on Workers.** `lib/otp.ts` keeps codes in a
   module-level `Map`. `api/otp/send` and `api/otp/verify` may run in different
   isolates, and isolates are evicted freely, so verification will fail
   unpredictably in production. Needs KV/Durable Objects. It also uses
   `Math.random()`, which is not cryptographically secure for OTPs.
2. **In-memory rate limiting doesn't work either.** `app/api/razorpay/route.ts`
   has a module-level `Map` limiter (comment still says "for Netlify") with the
   same isolate problem.
3. **`lib/upstash-ratelimit.ts` is dead code** and imports the deprecated
   `@vercel/kv`, which cannot work on Cloudflare. Delete or rewrite it.
4. **Domain mismatch.** `SITE_URL` in `app/layout.tsx` is
   `https://wearfuturefit.com` (apex) while `NEXT_PUBLIC_SITE_URL` is
   `https://www.wearfuturefit.com` (www). Canonicals resolve against the apex.
   Pick one and align both.
5. **Supabase writes use the anon key.** `lib/supabase/server.ts` builds the
   client from the anon key, including for the `decrement_stock` RPC in
   `lib/actions/inventory.ts`. Only the Razorpay webhook uses the service role
   key. Verify against RLS.
6. **No shipping timeline exists anywhere.** The `/faq` shipping answer
   deliberately defers to email rather than invent one. Do not fabricate
   delivery estimates.
7. **`typescript.ignoreBuildErrors: true`** in `next.config.ts` — builds pass
   with type errors present, so run `npx tsc --noEmit` when it matters.
8. **Checkout has never been tested end to end** against live or test Razorpay
   credentials. Treat it as unverified.

## Launch checklist status

Verified against a 20-item pre-launch checklist. Done: privacy/terms/refund
pages, robots, sitemap, alt text everywhere, favicon, OG + Twitter cards with
generated OG image, viewport/responsive, per-page canonicals, custom 404,
cookie consent, FAQ with `FAQPage` JSON-LD, Cloudflare image optimization
(`IMAGES` binding + `unoptimized` removed).

Outstanding: end-to-end form/payment testing, GA and Clarity IDs not set in
any environment, accessibility pass (roughly 15 aria attributes site-wide, no
skip link), broken-link sweep beyond the footer.
