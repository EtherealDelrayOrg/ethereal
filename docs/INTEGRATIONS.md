# Third-party Integrations

## Toast — Menu & Online Ordering

**What it is:** Toast is a restaurant POS and online ordering platform. The restaurant already uses Toast for operations.

**What we embed:** Toast Tab — their hosted ordering/menu page embedded in our site.

### Integration Method

Toast provides two embed approaches:

**Option A — Iframe embed (recommended for menu page)**
```html
<iframe
  src="https://www.toasttab.com/[restaurant-slug]/v3"
  width="100%"
  height="900"
  style="border: none;"
  title="Ethereal Menu & Ordering"
></iframe>
```

**Option B — Redirect button**
A "Order Online" CTA button that links directly to the Toast Tab URL. Simpler, no iframe styling issues.

### What we need from client
- Their Toast Tab URL / restaurant slug (format: `toasttab.com/[name]/v3`)
- Confirmation: do they want full online ordering embedded, or just menu display?
- Their Toast account must have the Online Ordering module enabled

### Styling note
The iframe will show Toast's own UI — we cannot override their internal styles. We CAN style the container/frame around it to match our aesthetic.

---

## Resy — Reservations

**Status: LIVE.** The venue went active on Resy in Aug 2026, and every "Reserve" CTA on the
site now opens Resy's booking modal in place. **There is no reservations page on `main`** — the
widget *is* the reservation flow here, so all CTAs point straight at Resy.

### Venue values

| Value | |
|---|---|
| `venueId` | `98608` |
| `apiKey` | `12m41wFYzrqYB8D1dFhLaAoGU1UXG71e` |
| Venue page | `https://resy.com/cities/delray-beach-fl/venues/ethereal` |

The `apiKey` is a **public embed key** — it ships in page source by design, like any Resy
booking button, and only grants widget booking. Resy restricts it by referrer domain instead.

Resy's API reports the canonical slug as `.../cities/dlr/venues/ethereal` (city code `dlr`), but
**both forms resolve** — we use the longer one because that's what the client's ResyOS dashboard
generates. To re-check the venue's status or slug at any time:

```bash
curl -s "https://api.resy.com/3/venue?id=98608" -H 'Authorization: ResyAPI api_key="12m41wFYzrqYB8D1dFhLaAoGU1UXG71e"'
```

A `404` with `"Venue is inactive or not found."` means the venue isn't live — that is the single
most useful check when the widget "won't load", and it distinguishes a venue problem from a code
problem instantly. A `401` instead would mean the key itself is bad.

### How it's wired

All nine CTAs (nav, mobile nav, footer, hero, and the buttons/inline links on about, menu ×2,
gallery, contact) are plain anchors marked `data-resy-book`. One delegated handler in
`src/js/main.js` owns the behaviour, so the venue credentials live in exactly one place and the
markup stays clean. `embed.js` is injected by that same code rather than pasted into nine
`<head>`s by hand — `main.js` already loads everywhere. (GA4 couldn't be done this way because
it must run before render; this doesn't.)

We deliberately avoid `resyWidget.addButton()`, which injects Resy's own red `#FF462D` branded
button — `replace: true` swaps out our anchor entirely (losing the styling *and* the href
fallback), `replace: false` nests the red button inside ours. Binding `resyWidget.openModal()`
to our own buttons keeps the site on-palette.

### Gotcha — the modal does not open on mobile viewports

**Verified:** `openModal()` mounts the modal at 1280px wide and does **nothing** at 375px — it
returns normally, throws no error, and mounts no frame. Unhandled, that makes every Reserve
button a dead control on phones, i.e. most of a restaurant's traffic.

The handler therefore counts iframes before and after the call and only calls `preventDefault()`
if a frame actually appeared. When it didn't, the click falls through to the anchor's `href` and
the guest lands on Resy's own venue page — which is mobile-optimised and hands off to their app,
so it's the better mobile flow regardless. This deliberately avoids hard-coding Resy's
breakpoint, which is undocumented and theirs to change.

The same fall-through covers a slow, blocked, or changed `embed.js`: the CTA degrades to a normal
navigation that still books, rather than a dead button.

### Gotcha — cannot be tested from localhost

Resy's embed key is referrer-restricted; from `http://localhost` the modal renders a full-page
**"Access denied — Error 15"**. The wiring can still be verified locally (the modal mounts with
the correct `venueId`), but the booking UI itself only renders from a real deployed domain. The
deployed domains work with no allowlisting needed.

---

## Forms — REMOVED (both pages), pending the Cloudflare migration

**Status: no forms on the site.** `/pages/contact.html` and `/pages/shop.html`
previously submitted through Netlify Forms (`contact` and `shop-notify`). Both
were removed on the `cloudflare-migration` branch, because Netlify Forms is a
Netlify platform feature with no Cloudflare equivalent — carried across as-is,
each form would have become a POST into nothing, which is worse than no form.

Removed rather than replaced by a `mailto:` at the client's call: neither was
needed at this stage, and the contact page already lists the email address,
phone number, address and hours as real, tappable links.

What that changed:
- **Contact page** — the form was the right-hand column of `.contact-grid`. The
  map moved into that column rather than leaving the contact blocks stranded at
  half width, so the two-column layout still reads as intentional. `.contact-map`
  lost its `margin-top: 2rem`, which only made sense while it was stacked
  underneath the contact blocks; the grid gap handles spacing now.
- **Shop page** — the "notify me when the shop opens" block came out whole,
  leaving the coming-soon message.

**The CSS is deliberately still there** (`.contact-form`, `.form-group`,
`.email-form`, `.form-honeypot`, `.form-status` in `pages.css`). It costs a few
hundred bytes and means re-adding a form later is markup only.

### Putting forms back

Whatever the site is hosted on, a static page needs a third-party endpoint or a
serverless function. The options priced up during the migration:
- **Web3Forms / Formspree free tier** — swap the `action` to their endpoint,
  ~50 submissions/month free. Least work.
- **A Cloudflare Worker** that accepts the POST and sends mail — no third party,
  but it is real code to write and maintain.

## DNS & Domain (Wix → Netlify)

See [TECH_STACK.md](TECH_STACK.md#connecting-wix-domain--netlify) for step-by-step DNS setup.

---

## Analytics — Google Analytics 4 (LIVE, main branch only)

**GA4 is live as of Jul 2026** (main commit `ecbe7f3`). Measurement ID: `G-NDDQ1KQZ8R`.

- The `gtag.js` snippet sits right after `<meta charset="UTF-8">` in the `<head>` of **all 9 public
  pages individually** (index, 404, and the 7 `pages/*.html`) — this is a static multi-page site with
  no shared `<head>` partial (`partials.js` only covers header/footer), so there is no single place
  to add it. **Any new page must get the snippet added by hand.** `test.html` (dev scratch page) is
  intentionally excluded.
- **Main branch only, by design** — the client wants real-visit tracking on the live site; `dev` is a
  preview branch and would pollute the data. **When merging main→dev, make sure the GA tags don't
  ride along** (or accept them consciously).
- The GA4 property was created under the developer's own Google account (client wasn't ready to).
  GA4 has no true "transfer property" feature — the handoff plan is to grant the client
  **Account-level Administrator** access once they're ready, which is full practical control.
