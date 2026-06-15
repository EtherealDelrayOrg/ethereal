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

## DNS & Domain (Wix → Netlify)

See [TECH_STACK.md](TECH_STACK.md#connecting-wix-domain--netlify) for step-by-step DNS setup.

---

## Analytics (optional, TBD)

If the client wants traffic analytics:
- **Plausible** or **Fathom** — privacy-first, lightweight, GDPR-compliant (recommended)
- **Google Analytics 4** — if client specifically requests it

To be discussed. See [QUESTIONS.md](QUESTIONS.md).
