# Ethereal — Restaurant Website

Official website for **Ethereal**, a fine dining restaurant with a grand opening coming soon.

## Project Overview

A luxury, atmospheric web experience built around a cinematic opening sequence — an animated clockwork scene that transitions into the restaurant's full website. Antiquarian Botanical aesthetic: aged museum print meets clockwork, with a brass/gold palette on deep ink.

## Pages

| Page | Status | Notes |
|------|--------|-------|
| `/` | Built · minimal | Opening sequence + hero + footer only. Teaser sections removed until content is ready (CSS clock placeholder; AI video pending) |
| `/gallery` | Built · in nav | Filterable photo grid (photography pending from client) |
| `/about` | Built · in nav | Story, values, team bios (copy pending from client) |
| `/reservations` | Built · in nav | Resy widget placeholder (venue slug pending from client) |
| `/menu` | Built · hidden from nav | Toast embed placeholder (URL pending). Page kept, reachable by URL |
| `/shop` | Built · hidden from nav | Coming soon placeholder with email capture. Page kept, reachable by URL |
| `/careers` | Built · hidden from nav | Job listings + general application CTA. Page kept, reachable by URL |
| `/contact` | Built · hidden from nav | Contact form + map. Page kept, reachable by URL |

> **Nav scope:** Only Gallery, About, and Reserve appear in the header/mobile/footer navigation. Menu, Shop, Careers, and Contact are built but intentionally hidden from nav until ready — their pages still exist and resolve by direct URL.

## Tech Stack

- **Language:** Vanilla HTML, CSS, JavaScript (no framework, no build tool)
- **Hosting:** Netlify (free tier)
- **Version control:** GitHub
- **Domain:** Wix-managed DNS → Netlify
- **Fonts:** Cormorant Garamond (display) + Hanken Grotesk (UI) — Google Fonts

## Third-party Integrations

- **Toast** — online menu & ordering (`toasttab.com`)
- **Resy** — reservations widget

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
│       ├── images/         # logo.png, logo-wordmark.png (cropped nav mark), clock art…
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
| `main` | **etherealdelray.com** (Netlify production) | Cleaned, client-facing |
| `dev`  | Netlify branch deploy (`dev--<site>.netlify.app`) | Active development / staging |

Push to a branch on GitHub → Netlify auto-deploys it. Domain DNS is managed through Wix —
records point to Netlify's load balancer.

See [docs/TECH_STACK.md](docs/TECH_STACK.md) for full deployment details.
