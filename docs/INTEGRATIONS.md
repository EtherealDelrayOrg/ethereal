# Third-party Integrations

## Menu — a PDF, not an embed (Toast was never used)

**Status: live.** The menu is the client's own designed PDF at
`/src/assets/menu/ethereal-menu.pdf`, linked directly from the hero's "View the Menu"
CTA. There is no Toast embed, no online ordering, and no Toast dependency anywhere in the
site. The earlier plan to embed Toast Tab was dropped when the client supplied artwork.

### Compressing a new menu — use the script, not a generic tool

Client PDFs arrive around 16 MB, which is far too heavy to link from the homepage of a
site that gets mobile traffic. Compress with
`_reference/menu-originals/shrink_images_only.py` (gitignored, alongside every previous
build):

```bash
python3 _reference/menu-originals/shrink_images_only.py <client.pdf> <out.pdf>
```

Latest run: **16.68 MB → 1.24 MB (7%)**, text character-identical, every aspect ratio
preserved.

**Why that script and not `pymupdf.rewrite_images()` or Ghostscript:** an earlier attempt
used `ez_save(clean=True)`, which re-serialises every page content stream. iOS PDFKit
renders the re-encoded streams differently and painted the "A" in headings and the "1" in
prices **black instead of gold**. The text and colour values were never lost — the
operators were byte-identical in value — but the re-encoding alone was enough to break
it. The script avoids the whole class of problem by replacing image XObjects in place by
xref and asserting on every run that page content streams come out byte-identical.

Two more rules it encodes, both learned by breaking things:
- Size each image from its **largest** placement. One feather ornament is placed four
  times from a single shared xref; sizing it per-placement compounded the downsample
  (1049px → 263 → 66 → 17 → 5) and turned three of the four into flat colour blocks.
- Use **one uniform scale factor**, flooring only the longer edge. Flooring each
  dimension independently squashed that 1.3:1 feather into a 64×64 square.

**Verify on a real iPhone after any menu change.** MuPDF agreeing with the original
proves nothing about PDFKit — that is exactly how the black-glyph bug slipped through.

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

## Forms — REMOVED (both pages)

**Status: no forms on the site.** `/pages/contact.html` and `/pages/shop.html`
previously submitted through Netlify Forms (`contact` and `shop-notify`). Both
were removed while evaluating a move off Netlify, because Netlify Forms is a
platform-only feature with no equivalent elsewhere — carried across as-is,
each form would have become a POST into nothing, which is worse than no form.

Each is replaced by a plain `mailto:` CTA — same pattern the careers page
already uses for applications (`<a href="mailto:…?subject=…" class="btn">`), so
it needs no new styling and has no backend to migrate:
- Contact → **Send a Message**, `?subject=General Inquiry — Ethereal`
- Shop → **Email Me When It Opens**, `?subject=Notify me when the shop opens — Ethereal`

The contact page also still lists the email, phone, address and hours as real,
tappable links independently of this.

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

## DNS & Hosting

**Registrar + DNS: Wix.** `etherealdelray.com`, `etherealrestaurant.com` and
`glimmercafedelray.com` all sit in the company's Wix account.

**Hosting: Netlify, on the restaurant-owned account** since Aug 30 2026 (previously the
developer's personal account).

Four hostnames are attached to the one Netlify site, all on a single certificate:
`etherealdelray.com`, `www.etherealdelray.com`, `etherealrestaurant.com`,
`www.etherealrestaurant.com`. `etherealrestaurant.com` is **not** a redirect — it serves
the same site at its own URL.

### Things that will bite on any future host move

- **The apex A record never needs to change.** `75.2.60.5` is Netlify's *shared* load
  balancer; routing follows the custom-domain attachment, not DNS. Only the `www` CNAMEs
  are site-specific.
- **Both `www` records CNAME to `ethereal-delray.netlify.app`** — a Netlify *site name*.
  Deleting or renaming that site releases the name and breaks `www` on both domains. When
  the site was replaced, this was handled by renaming the old site to free the name and
  renaming the new one to take it, so no Wix edit was needed.
- **Wix will not let you change nameservers on a domain registered with them.** Their
  docs are explicit; the only route is transferring the registrar. This is what blocked a
  Cloudflare move, since Cloudflare Workers custom domains require the zone to be on
  Cloudflare nameservers — and Cloudflare Registrar cannot be the transfer target either,
  because it requires the zone to be Active first.
- **Google Workspace email runs on this domain.** Any nameserver change must recreate all
  five MX records and both TXT records (SPF + verification) *before* switching, or mail
  stops. There is currently no DKIM or DMARC.

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
