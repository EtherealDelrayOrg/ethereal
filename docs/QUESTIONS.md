# Open Questions

Updated 2 Sep 2026. Most of the original list was answered by events — those are recorded
below under **Answered** so nobody re-asks the client. Only the top section is live.

---

## Still open

### Brand & copy
- [ ] **New tagline.** "Where time breathes." was retired at client request and nothing
      replaced it. Three slots currently render empty and are commented in the markup:
      the `<title>`/meta description in `index.html`, `.seq-tagline` on the opening
      screen, and `.footer-tagline` in `partials.js`.
- [ ] **Is there a brand guideline document** we should be consistent with, or is
      `docs/DESIGN_SYSTEM.md` the source of truth?

### Content gaps still marked `.content-ph` in the markup (counts are `main`)
- [ ] **About page** (`/pages/about.html`) — 12 placeholders on `main`. The client's real
      verbatim copy exists on **`dev`** and has never been merged across. Likely the
      quickest content win available.
- [ ] **Careers listings** (`/pages/careers.html`) — 12 placeholders.
- [ ] **Reservations page** (`/pages/reservations.html`) — 4. Low priority: nothing links
      to it, since every Reserve CTA opens Resy directly.
- [ ] **Menu page intro + dietary note** (`/pages/menu.html`) — 2. The real menu is the
      PDF linked from the hero, so this page is largely vestigial.
- [ ] **Shop teaser copy** (`/pages/shop.html`) — 1.
- [ ] **Gallery** (`/pages/gallery.html`) — 1 on `main`; resolved on `dev`.
- [ ] **Instagram handle in the contact page** still reads `[ @etherealdining ]`; the
      footer links to `@etherealdelray`. One of these is wrong.

### Legal / compliance
- [ ] **Cookie consent banner** — GA4 is live, so this depends on jurisdiction and whether
      they serve EU visitors.
- [ ] **Privacy policy / terms of service** — none exist; nothing links to them.
- [ ] **Accessibility standard** — is WCAG AA a requirement? The site was built toward it
      but has never been formally audited.

### Operational
- [ ] **Who owns the site after handoff?** The repo, Netlify and Cloudflare accounts are
      Ethereal-owned, but GA4 is still under the developer's personal Google account.
- [ ] **Careers page updates** — static (developer edits) or does the client need a CMS?
- [ ] **Contact map** — CARTO now needs an API key and serves watermarked tiles. Free
      CARTO key, Stadia's free tier, or plain OpenStreetMap? A design call, see
      INTEGRATIONS.md.

---

## Answered

**Brand.** Palette and fonts are locked — Cormorant Garamond + Hanken Grotesk (*not*
Cinzel as originally sketched). The client supplied the gold `eTHeReAL` wordmark, in use
as `logo-wordmark.webp`.

**Opening sequence.** Client-provided assets; video generated with Higgsfield / Seedance.
No audio (all encodes are `-an`). The clock does **not** show real time. Mobile gets a
full video too, not a simplified fallback — a separate 9:16 encode.

**Menu.** No Toast, no online ordering, no embed. The client supplied a designed PDF,
linked directly from the hero. Toast was never implemented.

**Reservations.** Live on Resy. No dedicated page in the flow — every Reserve CTA opens
the booking modal in place.

**Shop / Careers / Contact.** No forms anywhere; Netlify Forms was removed during the
hosting migration. All three use `mailto:` CTAs with pre-filled subject lines.

**Gallery.** 30 client interior photographs, filterable by category with a lightbox.
Complete on `dev`, not yet merged to `main`. Photo-only, no video.

**Business details.** 324 NE 3rd Ave #1, Delray Beach, FL 33444 · (561) 270-2738 ·
info@etherealdelray.com · Mon–Sun 5pm–11pm · Instagram @etherealdelray.

**Grand opening.** The restaurant is **open** as of Aug 2026 and carrying real weekend
traffic — roughly 150 GB/month, which is what drove the hosting work.

**DNS.** Managed in the **company's** Wix account, which also holds
`etherealrestaurant.com` and `glimmercafedelray.com`.

**Maps.** Google Maps was dropped in favour of keyless Leaflet + OpenStreetMap tiles, to
avoid needing an API key. CARTO has since started requiring one anyway — see the open item
above.

**Analytics.** GA4 is live, `G-NDDQ1KQZ8R`, `main` only.
