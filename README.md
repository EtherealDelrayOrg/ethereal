# Ethereal — Restaurant Website

Official website for **Ethereal**, a fine dining restaurant with a grand opening coming soon.

## Project Overview

A luxury, atmospheric web experience built around a cinematic opening sequence — an animated clockwork scene that transitions into the restaurant's full website. Antiquarian Botanical aesthetic: aged museum print meets clockwork, with a brass/gold palette on deep ink.

## Pages

| Page | Status | Notes |
|------|--------|-------|
| `/` | Built | Landing + opening sequence (CSS clock placeholder; AI video pending) |
| `/menu` | Built | Toast embed placeholder (URL pending from client) |
| `/gallery` | Built | Filterable photo grid (photography pending from client) |
| `/about` | Built | Story, values, team bios (copy pending from client) |
| `/shop` | Built | Coming soon placeholder with email capture |
| `/careers` | Built | Job listings + general application CTA |
| `/contact` | Built | Contact form, map placeholder (address/hours pending from client) |
| `/reservations` | Built | Resy widget placeholder (venue slug pending from client) |

## Tech Stack

- **Language:** Vanilla HTML, CSS, JavaScript (no framework, no build tool)
- **Hosting:** Netlify (free tier)
- **Version control:** GitHub
- **Domain:** Wix-managed DNS → Netlify
- **Fonts:** Cinzel + Cormorant Garamond (Google Fonts)

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
│   ├── css/                # Stylesheets
│   ├── js/                 # Scripts
│   └── assets/
│       ├── images/
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

## Deployment

Push to `main` on GitHub → Netlify auto-deploys. Domain DNS is managed through Wix — CNAME pointed to Netlify's load balancer.

See [docs/TECH_STACK.md](docs/TECH_STACK.md) for full deployment details.
