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

**Status: LIVE on `dev`** (client supplied the embed snippet July 2026). Implemented in
`pages/reservations.html` — replaced the old "Coming Soon" placeholder button.

**What it is:** Resy is a reservation management platform used by fine dining restaurants.

### Client-supplied values

| Value | |
|---|---|
| Venue page | `https://resy.com/cities/delray-beach-fl/venues/ethereal` |
| `venueId` | `98608` |
| `apiKey` | `12m41wFYzrqYB8D1dFhLaAoGU1UXG71e` |

The `apiKey` is a **public embed key** — it ships in the page source by design, exactly like
any Resy booking button, and only grants widget booking. It is not a secret. Resy restricts it
**by referrer domain** instead (see the gotcha below).

### How it's wired

The client's snippet used `resyWidget.addButton(el, {…, replace: true})`. We deliberately do
**not** use `addButton`, because it injects Resy's own red `#FF462D` 200×50 branded button:

- `replace: true` — swaps our anchor out entirely, losing both the site styling and the
  `href` fallback.
- `replace: false` — appends the red button *inside* ours, so you get both.

Neither survives contact with the dark/gold palette. Instead we bind Resy's own public
`resyWidget.openModal({venueId, apiKey})` to our standard `.btn.btn--filled` anchor, which
opens the identical booking modal (fixed overlay, `z-index: 9999999`) while keeping the page
on-brand.

**Progressive enhancement:** the anchor is a real link to the venue's Resy page. The click
handler only calls `preventDefault()` once it has confirmed `resyWidget.openModal` exists —
so if `widgets.resy.com` is slow, blocked, or ever changes its API surface, the button
degrades to a normal navigation that still books, rather than becoming a dead control.

### Gotcha — the widget cannot be tested from localhost

Resy's embed key is referrer-restricted. Loading the modal from `http://localhost` returns a
full-page **"Access denied — Error 15"** inside the widget iframe. This is expected and is not
a bug in our integration — the DOM wiring can be verified locally (the modal mounts with the
correct `venueId`), but the booking UI itself only renders from a real deployed domain.

**The deployed dev domain is fine** — `etherealdelray-dev.netlify.app` loads the widget with no
Error 15, so no domain allowlisting was needed. Test there, not on localhost.

### Blocker — the venue is not live on Resy yet (as of July 2026)

Our side is done and verified. What's outstanding is entirely on the client's Resy account:

- `https://resy.com/cities/delray-beach-fl/venues/ethereal` renders Resy's **"Sorry, but we
  can't find that page"** — the venue is not published. (Note: `curl` reports HTTP 200 because
  the page is a SPA that renders its 404 client-side; check the rendered text, not the status.)
- The booking modal opens but **hangs on a loading spinner** and never renders a calendar —
  including when the widget URL is loaded directly on `widgets.resy.com`, i.e. with our site
  out of the picture entirely. That points at no bookable inventory for `venueId` 98608.

The client has clearly been provisioned (a real `venueId` and embed key were issued), but the
venue still needs to be switched live with inventory loaded. What has to be true before the
button does anything useful:

1. Venue **published / live** on Resy (its public page must resolve).
2. **Inventory configured** in ResyOS — floor plan/tables, service periods (shifts), seating
   times, party-size range.
3. **Booking window open** (how far ahead guests may reserve). With no open window a live venue
   still shows an empty widget.

Resy onboarding is account-manager driven rather than fully self-serve, so the fastest path is
for the client to ask their Resy account manager to confirm venue 98608 is live with shifts and
a booking window configured.

**When it goes live, re-check the venue slug** in the anchor's `href` — the current slug is
unverified precisely because the page 404s, and it may differ from the final published URL.

### Still open
- Reservation note, party size, and dress code on the page remain `[ placeholder ]` copy.

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
