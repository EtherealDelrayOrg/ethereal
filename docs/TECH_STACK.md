# Tech Stack

## Project Decisions

| Question | Answer |
|----------|--------|
| Launch timeline | **2–3 weeks** — extremely tight. Asset delivery from client is on the critical path. |
| Site structure | **Separate pages** — each page (`/menu`, `/gallery`, `/about`, etc.) is its own HTML file. Nav currently exposes a curated subset (Gallery, About, Reserve); other pages stay reachable by URL |
| Opening sequence scope | Runs on `/` (main page) only; subpages load directly into their content |
| Opening sequence tech | **Hybrid** — AI-generated video stitched seamlessly to CSS/JS reveal. Must work on mobile. |
| Team | **Solo dev** — client team generates assets only, no code access |
| CMS | **Deferred** — client will need to edit content eventually, not at launch. Will be taught later. |
| Additional assets | Client has more assets coming — to be obtained and added incrementally |

---

## Frontend

**Vanilla HTML / CSS / JavaScript** — no framework, no build tool, no bundler.

Rationale: The site is primarily presentational. Avoiding React/Vue/etc. keeps the repo accessible to any contractor who touches it, eliminates dependency rot, and means Netlify can serve it as-is with zero configuration.

### CSS Architecture

- One global stylesheet: `src/css/globals.css` (custom properties, typography, resets)
- One stylesheet per page section: `src/css/[page].css`
- No preprocessor — native CSS variables handle theming

### JavaScript Architecture

- One entry script: `src/js/main.js` — shared utilities (nav scroll state, mobile menu, focus trap, scroll reveals, hero parallax)
- `src/js/partials.js` — defines the shared `<site-header>` / `<site-footer>` web components, the single source of truth for the nav + footer. Loaded as a **blocking script in `<head>`** so the elements upgrade (render) before `main.js` queries the DOM
- One script per feature: `src/js/opening-sequence.js` (homepage intro)
- Plain IIFE scripts loaded via `<script>` tags — no bundler, no ES modules

### Header & Footer (shared partials)

The header (incl. mobile overlay) and footer are authored once in `partials.js`. Pages drop `<site-header>` / `<site-footer>` tags; `globals.css` sets `display: contents` on the wrappers so they don't affect layout. The active nav link is computed from the URL in `main.js`. Desktop renders a centered masthead (large wordmark with the menu stacked beneath); below 900px it collapses to a single-row bar with the wordmark centered and the hamburger pulled out of flow (`position: absolute`) and pinned to the right edge, rather than sharing a `space-between` row with the logo — that had left the logo sitting off to the side instead of centered.

`#site-header` sits above `#mobile-nav` in z-index (160 vs 150) so the header — logo and hamburger — stays visible and in the exact same spot when the mobile menu opens, instead of the overlay covering it. The overlay used to carry its own separate, left-aligned logo for this reason; that's been removed since it's redundant now and was the cause of the wordmark visibly jumping from centered to the side on open. The hamburger's existing morph-to-X animation (`.nav-toggle[aria-expanded="true"]`) is the close control, and is now actually visible above the overlay to serve that job. Clicking the logo while already on `/` doesn't force a reload (handled in `main.js`) — it just closes the mobile menu if it's open.

---

## Hosting & Deployment

| Concern | Solution |
|---------|----------|
| Hosting | **Netlify**, restaurant-owned account, continuous deployment from GitHub. Free tier is NOT sufficient — traffic since opening runs ~150 GB/mo (~3,100 credits) against Free's 300 |
| Repo | **GitHub** |
| Domain | Purchased via **Wix** — DNS managed in Wix dashboard |

### Connecting Wix Domain → Netlify

1. In Netlify: Site Settings → Domain management → Add custom domain
2. Netlify provides a load balancer IP (`75.2.60.5`) and a CNAME target
3. In Wix dashboard: Domains → Manage → DNS Records
   - Delete existing A records for `@`
   - Add A record: `@` → `75.2.60.5`
   - Add CNAME: `www` → `[site-name].netlify.app`
4. Propagation: 24–48 hours
5. HTTPS: Netlify auto-provisions via Let's Encrypt once DNS resolves

### Branches

| Branch | Netlify deploy | Purpose |
|--------|----------------|---------|
| `main` | Production → **etherealdelray.com** | Cleaned, client-facing |
| `dev`  | Netlify branch deploy | Staging — carries the finished gallery, not yet merged |

`main` and `dev` have **diverged**: `dev` has the completed gallery but lacks the `?v=`
cache busting, the `_headers`/`_redirects` config, and the asset optimisation. Merging
needs care — see MIGRATION.md.

### Deploy configuration

**There is no `netlify.toml`.** It was deleted during the Aug 2026 hosting review and
replaced by `_headers` and `_redirects` at the repo root — both are read natively by
Netlify *and* by Cloudflare, so the site is not tied to one host.

`_headers` — cache policy:
- `/src/assets/images|video/*` — 1 year, `immutable` (replaced under new filenames)
- `/src/assets/menu/*` — 1 hour, `must-revalidate` (re-issued at the *same* path, so it
  must never be `immutable`)
- `/src/css/*`, `/src/js/*` — 1 day
- `/`, `/*.html`, `/pages/*` — `no-cache, must-revalidate`

`_redirects`:
- **Clean URLs** — `/menu`, `/gallery`, `/about`, `/shop`, `/careers`, `/contact`,
  `/reservations` are 200-rewrites onto the matching `/pages/*.html`. A rewrite (200),
  not a redirect, so the clean path stays in the address bar.
- `404!` rules hiding `docs/`, `README.md`, `MIGRATION.md`, `test.html`, `wrangler.jsonc`.
  **The trailing `!` is load-bearing** — Netlify only consults `_redirects` for paths that
  do *not* match a real file, so without the force flag these never fire and the files
  keep serving with a 200.

### URL scheme

**Every internal link uses the clean URL.** The files still live in `/pages/`, but
nothing links to them by that path — `partials.js` and the page CTAs all point at
`/gallery`, `/contact`, and so on. Keep it that way when adding links; a
`/pages/*.html` href works but puts the ugly path in the visitor's address bar.

The `.html` paths do still resolve (they are real files, and Netlify serves a matching
file before consulting `_redirects`). Rather than redirect them, every page carries a
`<link rel="canonical">` pointing at its clean URL, so search engines treat the clean one
as authoritative and the two do not compete as duplicate content.

Redirecting `/pages/*.html` → clean instead would need Netlify's `!` force flag, since a
real file otherwise wins over the rule — and it would sit in tension with the 200-rewrite
pointing the other way. The canonical achieves the same consolidation with nothing to
loop.

### Cache busting

Every `<link>`/`<script>` carries `?v=<date>` (currently `20260901a`). CSS/JS are cached
for a day while HTML is not, so the two can otherwise fall out of step and render a
half-styled page. **Bump it whenever anything under `/src/css` or `/src/js` changes.**

`wrangler.jsonc` and `.assetsignore` are leftovers from an evaluated Cloudflare move.
They are inert on Netlify and can be deleted.

---

## Fonts

Google Fonts — loaded via `<link>` in `<head>`:
- **Cormorant Garamond** — display headings, body text, descriptions (romantic high-contrast serif)
- **Hanken Grotesk** — UI: nav, labels, buttons, addresses/contacts/hours, form fields (legible humanist sans)

The logo is always an **image asset** (`logo-wordmark.webp`, near-lossless WebP), never a web font. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the full type system.

---

## Third-party Integrations

See [INTEGRATIONS.md](INTEGRATIONS.md) for full embed details.

- **Resy** — reservations, live; every Reserve CTA opens the booking modal in place
- **Google Analytics 4** — `G-NDDQ1KQZ8R`, `main` only
- **Leaflet / CARTO** — contact-page map (⚠️ needs an API key, currently watermarked)
- ~~Toast~~ — never implemented; the client supplied a designed PDF menu instead

---

## Design Tokens (from reference sketches)

```css
--gold:    #c9a84c;
--copper:  #b87333;
--brass:   #a07320;
--iron:    #3a3530;
--bg:      #080706;
--cream:   #f5ead8;
```

These are starting points from the demo. Final palette to be confirmed with client.

---

## Browser Support

Target: last 2 versions of Chrome, Firefox, Safari, Edge. No IE11.

The opening sequence video uses `<video>` with WebM + MP4 fallback — supported everywhere in scope.
