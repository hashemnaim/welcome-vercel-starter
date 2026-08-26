# Health Audit — Shoplanser (read-only)

Verified against the running app, route files, migrations, edge functions, and the database linter. No files were changed.

## Critical issues

1. **Every page serves the same title/description to crawlers.** Per-page SEO uses `react-helmet-async` (`src/components/Seo.tsx`), which is not wired into TanStack Start's SSR head. Server HTML for `/`, `/marketplace`, and `/legal/terms` all returns the root title "SHOPLANCER — Launch your online store fast", and the canonical/OG tags are injected into the body instead of `<head>`. No route file except `__root.tsx` defines a `head()`.
   Fix: move each route's title/description/canonical/OG into the route's `head()` option and drop Helmet.

2. **`/vendor/dashboard` is client-gated only.** The route renders (HTTP 200 with full markup) before the `localStorage` token check redirects. Any protected data must be enforced server-side/RLS, not by a `useEffect` redirect.

3. **Vendor session token stored in `localStorage`** (`shoplanser_vendor_token`) and used to call the upstream vendor API from the browser. This is XSS-exfiltratable and bypasses the Supabase auth model already present in the project.

## Warnings

- **Support form is an unauthenticated public write** (`support-request` edge function, `verify_jwt = false`) with no rate limit, captcha, or origin check — open to spam/abuse. Table RLS itself is correct (service-role only).
- **`mcp` function is missing from `supabase/config.toml`**, so it inherits JWT verification while the other three are explicitly public — likely an unintended mismatch with how MCP clients call it.
- **CORS `Access-Control-Allow-Origin: *`** on `shoplanser-proxy` and `support-request`; the proxy forwards arbitrary requests to the upstream vendor API from any origin.
- **Sitemap lists hardcoded demo store and blog slugs** (`awlad-rizk`, `cairo-bakery`, `launch-your-store`, …) at `https://shoplanser.com`; if those pages don't exist in production they become crawl errors. `/legal/refund` and `/contact` are missing from the sitemap.
- **`robots.txt` points at `https://shoplanser.com/sitemap.xml`** while the project is unpublished — fine only if that domain is genuinely the target.
- **Stale/legacy config for the old stack**: `vercel.json` and `public/_redirects` rewrite everything to `/index.html`, which no longer exists under TanStack Start SSR; a deploy honoring them would break SSR.
- **Repo clutter**: `step2.png`–`step5.png` (~1.4 MB) at the project root and a stray `github/workflows` folder alongside `.github`.
- **Google Search Console still unlinked** — the only failing SEO finding; blocked until the site is live on its real domain.

## Healthy

- Build and runtime logs are clean; all 9 sampled routes return 200, unknown paths correctly return 404.
- Database linter reports no issues. `vendor_stores` has correct GRANTs, RLS, and per-user policies; `support_requests` is service-role only.
- No secrets in client code — only `VITE_GOOGLE_MAPS_API_KEY` (publishable) and the anon key. Service-role key is read from env inside the edge function only.
- Legal coverage is complete: privacy, terms, refund, contact, plus a support form.
- Route tree, favicon set, OG image, JSON-LD organization block, and RTL shell (`lang="ar" dir="rtl"`) are in place.

## Suggested next fixes (in order)

1. Migrate per-route SEO from Helmet to TanStack `head()` on all 14 leaf routes; remove `react-helmet-async`.
2. Decide the auth model for the vendor area — either move vendor auth onto Supabase sessions with an `_authenticated` route gate, or accept the upstream token but stop treating the dashboard as protected.
3. Add basic abuse protection (rate limit + honeypot/origin check) to `support-request`; add `mcp` to `config.toml` with the intended `verify_jwt` value.
4. Regenerate `sitemap.xml` from real store/blog data; add `/contact` and `/legal/refund`.
5. Remove `vercel.json`, `public/_redirects`, the root `step*.png` files, and the stray `github/` folder.

## Deployable?

Yes — it builds, serves, and has no blocking runtime or database errors. But it should not ship to the real domain before item 1 (SEO is effectively single-page for crawlers) and item 5 (the SPA rewrite configs can break SSR on a non-Lovable host).
