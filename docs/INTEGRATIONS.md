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

## Netlify Forms — Contact & Shop Signup

**What it is:** Both `/pages/contact.html` (the contact form) and `/pages/shop.html` (the "notify me" email signup) submit through [Netlify Forms](https://docs.netlify.com/forms/setup/) — no backend, database, or third-party form service needed. Netlify's build system detects any `<form data-netlify="true">` in the static HTML at deploy time and starts capturing submissions automatically from then on.

Each form:
- Has a unique `name` (`contact`, `shop-notify`) and a matching hidden `<input name="form-name">`, both required for Netlify to register and correctly attribute submissions.
- Has a honeypot field (`data-netlify-honeypot="bot-field"` + a hidden `bot-field` input) for basic spam filtering.
- Submits via `fetch()` to `/` instead of a normal page navigation, so the visitor sees an inline confirmation message (`.form-status`) instead of being sent to Netlify's generic default success page.

### Where submissions go

**Storage is automatic** — as soon as the site is deployed with these forms in place, every submission is captured under **Site → Forms** in the Netlify dashboard (viewable individually, exportable as CSV). No further setup required for this part.

**Emailing the client on every submission is a one-time manual step** (can't be done from code — it's an account/site-level setting):
1. Netlify dashboard → the site → **Site configuration → Forms → Form notifications**
2. **Add notification → Email notification**
3. Choose the form (`contact` or `shop-notify`) and enter the client's email address
4. Repeat for the other form

Once set up, every new submission auto-emails that address with the submitted fields. Submissions remain stored in the dashboard either way, so nothing is lost if this step is skipped or done later.

### Netlify Forms cost

Free and unlimited on Netlify's current (credit-based) pricing plans. (Only older "legacy" Netlify plans meter form submissions — not a concern at this site's expected volume regardless.)

---

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
