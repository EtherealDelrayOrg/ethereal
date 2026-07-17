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

**What it is:** Resy is a reservation management platform used by fine dining restaurants.

### Integration Methods

**Option A — Resy booking button (simplest)**
```html
<!-- Drop this script in <head> -->
<script type="text/javascript"
  src="https://widgets.resy.com/embed.js"
  async=""
  defer="">
</script>

<!-- Drop this where the button should appear -->
<a href="https://resy.com/cities/[city]/[venue-slug]"
   class="resy-button"
   data-url="https://resy.com/cities/[city]/[venue-slug]"
   data-notify-id="[notify-id]"
   data-color-primary="#c9a84c"
   data-color-secondary="#080706">
  Make a Reservation
</a>
```

The `data-color-primary` and `data-color-secondary` attributes let us match our palette.

**Option B — Inline widget**
Resy also provides a modal or inline datepicker widget. Requires venue to be live on Resy.

### What we need from client
- Resy venue URL and venue slug
- Resy notify ID (from their dashboard)
- Confirmation: are they live on Resy, or is this a future integration?

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
