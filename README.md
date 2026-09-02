# Ethereal — Restaurant Website

Official website for **Ethereal**, a fine dining restaurant with a grand opening coming soon.

## Project Overview

A luxury, atmospheric web experience built around a cinematic opening sequence — an animated clockwork scene that transitions into the restaurant's full website. Antiquarian Botanical aesthetic: aged museum print meets clockwork, with a brass/gold palette on deep ink.

## Pages

| Page | Status | Notes |
|------|--------|-------|
| `/` | Live | Opening sequence (AI video, AV1/VP9/h264) + hero. Hero CTAs go to Resy and the PDF menu |
| `/gallery` | Built · nav shows "Coming Soon" | Filterable grid + lightbox. Complete on `dev` with 30 client photographs; `main` still has the placeholder |
| `/about` | Built · nav shows "Coming Soon" | Client's verbatim story + team bios |
| `/menu` | Built · not in nav | Placeholder page. The real menu is the client's PDF, linked straight from the hero |
| `/reservations` | Built · not in nav | Resy is live, but every Reserve CTA opens the widget directly, so this page is bypassed |
| `/shop` | Built · not in nav | Coming-soon page with a mailto CTA |
| `/careers` | Built · not in nav | Job listings + mailto application CTA |
| `/contact` | Built · not in nav | Address, hours, map, mailto CTA |

> **Nav scope:** the header, mobile menu and footer show only **Gallery**, **About Us**
> (both behind "Coming Soon" badges on `main`) and **Reserve**, which opens Resy.
> Everything else resolves by direct URL or clean URL (`/menu`, `/shop`, …).

> **Dress code banner:** a fixed bar sits above the header on every page, rendered by
> `partials.js`. Collapsed it reads "Elegant Chic Dress Code" with a down arrow;
> expanding drops the full policy over the page without shifting it.

> **No forms anywhere.** Netlify Forms was removed during the hosting migration — it is a
> Netlify-only feature and would not have survived a move. Contact and Shop use plain
> `mailto:` CTAs with pre-filled subject lines instead.

## Tech Stack

- **Language:** Vanilla HTML, CSS, JavaScript — no framework, no build step
- **Hosting:** Netlify, on the restaurant-owned account (migrated from the developer's
  personal account, Aug 2026)
- **Deploy config:** `_headers` + `_redirects` at the repo root. There is **no
  `netlify.toml`** — it was removed so the same files work on any static host
- **Cache busting:** every `<link>`/`<script>` carries `?v=<date>`. CSS/JS are cached for
  a day while HTML is not, so without the query a returning visitor can pick up new
  markup against a stale stylesheet. **Bump it whenever anything under `/src/css` or
  `/src/js` changes**
- **Version control:** GitHub — `EtherealDelrayOrg/ethereal`
- **Domain:** registered at Wix, DNS at Wix, pointed to Netlify
- **Fonts:** Cormorant Garamond (display) + Hanken Grotesk (UI), via Google Fonts

## Third-party Integrations

- **Resy** — reservations. Live. Every Reserve CTA opens the booking modal in place
- **Google Analytics 4** — `G-NDDQ1KQZ8R`, `main` only
- **Leaflet / CARTO** — the contact-page map. ⚠️ CARTO now requires an API key and serves
  watermarked tiles; see INTEGRATIONS.md
- ~~Toast~~ — never implemented. The client supplied a designed PDF menu instead, so
  there is no ordering embed and no Toast dependency

## Local Development

No build step. Open `index.html` in a browser, or use any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Folder Structure

```
ethereal/
├── index.html              # Entry point / opening sequence
├── pages/                  # One HTML file per page
├── src/
│   ├── css/                # Stylesheets (globals.css holds tokens + nav/footer)
│   ├── js/
│   │   ├── main.js              # Shared utilities (nav, scroll reveals, mobile menu)
│   │   ├── partials.js          # Shared <site-header> / <site-footer> components
│   │   └── opening-sequence.js  # Homepage intro orchestration
│   └── assets/
│       ├── images/         # logo-wordmark.webp (nav mark), bg-brand.webp (hero), clock art…
│       ├── video/          # Opening sequence video
│       └── fonts/
├── docs/                   # Project documentation
│   ├── PRE_DEV_RESOURCES.md
│   ├── TECH_STACK.md
│   ├── OPENING_SEQUENCE.md
│   ├── INTEGRATIONS.md
│   ├── CONTENT.md
│   ├── DESIGN_SYSTEM.md
│   └── QUESTIONS.md
└── _reference/             # Client demo sketches — for inspiration only
    ├── html/
    ├── css/
    └── images/
```

## Shared Header & Footer

The nav and footer are **not** copied into each page. They live once in `src/js/partials.js`
as `<site-header>` / `<site-footer>` custom elements. Each page just drops the tags:

```html
<site-header></site-header>          <!-- subpages -->
<site-header opening></site-header>  <!-- homepage: hidden until the opening sequence reveals it -->
<site-footer></site-footer>          <!-- omit on shop.html, which has no footer -->
```

`partials.js` is loaded as a blocking script in `<head>` so the elements render before
`main.js` runs. The active nav link is derived automatically from the URL — no per-page
markup. **Edit the nav or footer in one place.**

## Branches & Deployment

| Branch | Deploys to | Purpose |
|--------|-----------|---------|
| `main` | **etherealdelray.com** (+ `www`, `etherealrestaurant.com`, `www`) | Live site |
| `dev`  | Netlify branch deploy | Staging — carries the finished gallery, not yet merged |

Push to GitHub → Netlify deploys. Note that `main` and `dev` have **diverged**: `dev` has
the completed gallery but lacks the `?v=` cache busting, the `_headers`/`_redirects`
config and the asset optimisation work. See MIGRATION.md.

**Deploys cost credits** (15 each on Netlify's credit model) — batch pushes rather than
shipping one commit at a time.
