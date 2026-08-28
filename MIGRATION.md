# Migrating etherealdelray.com off the personal Netlify account

**Status: prepared, nothing cut over.** These files live on the local
`cloudflare-migration` branch only. They must NOT reach `main` or `dev` before
cutover — Netlify reads `_headers` and `_redirects` too, and having them
alongside `netlify.toml` gives two competing sources of truth on the live site.

## Target

Cloudflare **Workers with static assets** (not Pages — Cloudflare is folding
Pages into Workers and points new projects at Workers, with static asset
requests free either way).

Chosen on measured usage, not preference: the site serves ~14.8 GB/mo across
~56k requests with ~12 deploys, which costs 495 Netlify credits/mo. A new
Netlify Free account gets 300 and would suspend again within weeks. Cloudflare
serves static bandwidth and requests unmetered at $0. Vercel Hobby forbids
commercial use (their terms count a paid consultant writing the code as
commercial). GitHub Pages supports no custom headers at all, which would silently
drop every cache rule below.

## Ported already

- `_headers` — all 6 `netlify.toml` cache rules, verified at parity.
- `_redirects` — all 7 clean-URL rewrites, verified at parity. The catch-all
  404 rule is dropped deliberately; `not_found_handling` covers it natively and
  a `/*` rewrite would shadow real asset paths.
- `wrangler.jsonc` — no build step; the repo root is uploaded as-is.

## Still open

1. **Netlify Forms.** `pages/contact.html` (`contact`) and `pages/shop.html`
   (`shop-notify`) both post to Netlify Forms, which has no Cloudflare
   equivalent. Needs a decision before cutover — see options in the handoff
   notes. Both currently degrade to a dead POST if moved as-is.
2. **Apex DNS.** `etherealdelray.com` needs to be a Cloudflare zone, so
   nameservers move off Wix. Registration can stay where it is.
3. **Ownership** — hosting account, GA4 property, and the GitHub repo are three
   separate handoffs. None of them block the migration.

## Cutover order (nothing here is irreversible until step 5)

1. Create the Cloudflare account under the Ethereal-owned email.
2. Connect the repo, deploy to the `*.workers.dev` URL, verify fully there.
3. Resolve the forms decision and land it.
4. Move `_headers`, `_redirects`, `wrangler.jsonc` to `main`; delete
   `netlify.toml` in the same commit so there is never a window with both.
5. Point DNS. Keep Netlify live until Cloudflare serves the apex correctly —
   the two can run in parallel, so there is no downtime window.
