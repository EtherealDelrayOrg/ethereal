# Ethereal — Restaurant Website

Official website for **Ethereal**, a fine dining restaurant with a grand opening coming soon.

## Project Overview

A luxury, atmospheric web experience built around a cinematic opening sequence — an animated clockwork scene that transitions into the restaurant's full website. Dark, gothic-elegant aesthetic with a gold/copper palette.

## Pages

| Page | Status | Notes |
|------|--------|-------|
| `/` | In progress | Landing + opening sequence |
| `/menu` | Planned | Embedded Toast online ordering |
| `/gallery` | Planned | Photo grid |
| `/about` | Planned | Brand story |
| `/shop` | Planned | Coming soon placeholder |
| `/careers` | Planned | Static listings + contact form |
| `/contact` | Planned | Map + contact details |
| `/reservations` | Planned | Embedded Resy widget |

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
│   └── QUESTIONS.md
└── _reference/             # Client demo sketches — for inspiration only
    ├── html/
    ├── css/
    └── images/
```

## Deployment

Push to `main` on GitHub → Netlify auto-deploys. Domain DNS is managed through Wix — CNAME pointed to Netlify's load balancer.

See [docs/TECH_STACK.md](docs/TECH_STACK.md) for full deployment details.
