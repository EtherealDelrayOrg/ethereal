# Ethereal — outstanding work

Updated 2 Sep 2026. **Not served** on the live site (`_redirects` 404s it), so it can hold
internal detail.

---

## Where hosting stands

**Netlify, on the restaurant-owned account.** The site was moved off the developer's
personal account on 30 Aug 2026; the old projects are deleted. Four hostnames on one
site and one certificate: `etherealdelray.com`, `www`, `etherealrestaurant.com`, `www`.

**Cloudflare was evaluated and abandoned — for a non-technical reason.** The Worker was
built and verified 25/25, but Wix does not permit changing nameservers on domains
registered with them, and Cloudflare Workers custom domains require the zone to be on
Cloudflare nameservers. Cloudflare Registrar cannot be the transfer target either, since
it requires the zone Active first. The only route is transferring the registrar, which
would split `etherealdelray.com` from the two other domains in the company's Wix account.

**This is still worth revisiting**, because the economics changed after the restaurant
opened. See below.

---

## URGENT: the plan

Traffic since opening is running **~150 GB/month** — roughly 40× the pre-launch estimate.
That is ~3,100 credits/month.

- **Free = 300 credits.** Already exceeded. Free *suspends* rather than bills; the site
  has been through that outage once.
- **Personal ($9) = 1,000 credits** — about 9 days at this rate.
- **Pro ($20) = 3,000 credits** — roughly covers the month, with little headroom.

**Buy Pro.** Then decide about Cloudflare, where static bandwidth is unmetered and free.

At this traffic the comparison is **$240/yr on Netlify vs $0 on Cloudflare**, and the
registrar transfer (~$11, ~a week, mostly waiting) pays for itself almost immediately.
Moving all three domains together avoids the split-registrar problem that made this a
close call before.

Optimisation cannot substitute for that decision: even rebuilding the menu as HTML and
shipping AV1 to every visitor still lands on Pro.

---

## Also outstanding

- **Merge `dev` into `main`.** `dev` has the finished gallery (30 client photographs,
  filter + lightbox) **and the client's real About copy** — `main` still shows 12
  placeholders there. But `dev` lacks the `?v=` cache busting, the `_headers`/`_redirects`
  config and the asset optimisation, and still carries `netlify.toml` with a deliberate
  dev-only `noindex`. The merge needs care in both directions.
- **GA4 handoff.** Property `G-NDDQ1KQZ8R` is under the developer's personal Google
  account. Grant the Ethereal account **Account-level Administrator**, then remove the
  personal one — GA4 has no true property transfer. No dependency on anything else.
- **Contact map is broken** on both branches. CARTO now requires an API key and returns
  watermarked tiles with an HTTP **200**, so nothing errors — it silently degrades. A
  design call: free CARTO key keeps the exact muted look, Stadia is close, plain OSM is
  keyless but bright against the dark palette.
- **Delete the Cloudflare leftovers** if the move is ruled out for good: `wrangler.jsonc`,
  `.assetsignore`, and their `404!` lines in `_redirects`. **`_headers` and `_redirects`
  must stay** — `netlify.toml` was deleted and those two files are what configure Netlify
  now. Also uninstall the Cloudflare GitHub App from `EtherealDelrayOrg`, or every push
  keeps triggering a build that fails on the `404!` syntax Cloudflare does not support.
- **Instagram handle mismatch** — `/pages/contact.html` shows `[ @etherealdining ]` while
  the footer links to `@etherealdelray`. One is wrong.
- **No DKIM or DMARC** on the domain (SPF is present). Pre-existing and unrelated to
  hosting, but mail from `info@etherealdelray.com` is likelier to land in spam — and both
  site CTAs now point there.
- **6.36 MB of unreferenced images still ship**: `logo.png` (2.12 MB — survives only in a
  CSS comment), `clock-face.png` (2.13), `clock-face-bg.png` (1.59), `brand-mood.jpg`
  (0.52). Deploy weight only, not bandwidth, since nothing fetches them — but they are
  free to delete.
- **Deploys cost 15 credits each.** Batch pushes rather than shipping one commit at a time.

---

## Traps that already bit — worth not repeating

- **A green deploy proves nothing.** The first attempt at hiding the internal docs
  deployed successfully and changed nothing: Netlify only consults `_redirects` for paths
  that do *not* match a real file, so rules aimed at real files are skipped silently. The
  trailing `!` forces it. Only re-testing the URLs caught it.
- **One renderer agreeing does not mean another will.** A compressed menu was
  pixel-identical under MuPDF and visibly broken under iOS PDFKit — heading "A"s and price
  "1"s rendered black. Cause was `ez_save(clean=True)` re-serialising page content
  streams. Use `_reference/menu-originals/shrink_images_only.py`, which asserts the
  streams come out byte-identical, and verify on a real iPhone.
- **GitHub App installations do not follow a repo transfer.** After moving to
  `EtherealDelrayOrg`, Netlify silently stopped deploying while the site still looked
  current. Three commits sat unshipped.
- **`www` CNAMEs point at a Netlify *site name*.** Deleting or renaming that site releases
  the name and breaks `www` on both domains. Check before deleting anything.
