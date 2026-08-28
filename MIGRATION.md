# Ethereal — outstanding work

Last updated: 28 Aug 2026. This file is **not served** on the live site
(`_redirects` 404s it), so it can hold internal detail.

## Decision made: staying on Netlify

Cloudflare was fully built and verified, then abandoned — **not** on technical
grounds. Wix does not permit changing nameservers on domains registered with
them ("Currently, it's not possible to change name servers (edit NS records)
for a Wix domain"), and Cloudflare Workers custom domains require the zone to
be on Cloudflare nameservers. The only route was transferring the registrar,
which would have split `etherealdelray.com` away from the two other domains in
the company's Wix account (`etherealrestaurant.com`, `glimmercafedelray.com`) —
two registrars to maintain instead of one, to save ~$97/yr.

Netlify Personal ($9/mo) it is. After the payload work, usage is ~231 credits
against a 1,000 allowance, so there is roughly a 4x margin.

**Revisit if** traffic passes ~10,000 visits/mo, where Netlify pushes to Pro at
$20/mo. At that point moving all three domains to one real registrar plus free
Cloudflare hosting becomes worth doing as a single deliberate project.

---

## NEXT: move the site to a restaurant-owned Netlify account

The site currently lives on the developer's **personal** Netlify account. The
repo (`EtherealDelrayOrg/ethereal`) and the Cloudflare account are already
Ethereal-owned; Netlify is the last piece that is not.

Likely mechanism is Netlify's *Site configuration → General → Transfer site to
another team*, which needs you to be a member of both teams. Verify before
relying on it. Things to watch:

- **The $9 Personal plan is attached to the current team.** The new team starts
  on Free (300 credits), which is *not* enough headroom — see the credit notes
  below. Budget for the plan to be re-purchased on the new team.
- **Re-install the Netlify GitHub App** on `EtherealDelrayOrg` for the new team.
  This exact step was missed after the repo transfer and left Netlify silently
  stuck three commits behind while still reporting healthy.
- **DNS may not need to change.** The apex A record points to Netlify's load
  balancer (`75.2.60.5`) and `www` CNAMEs to `ethereal-delray.netlify.app`. If
  the site keeps its subdomain through the transfer, DNS is untouched. Confirm
  the subdomain survives; if it changes, the `www` CNAME at Wix must follow.
- `etherealrestaurant.com` points at the same Netlify site and its redirect is
  configured **inside Netlify**, so it moves with the site — re-check it after.

**Verify after the move:** every page 200, the menu PDF still 1,177,374 bytes,
internal docs still 404, and `etherealrestaurant.com` still redirects.

---

## Cloudflare teardown

Safe to do now that Netlify deploys again. In order:

1. Delete the **DNS zone** for `etherealdelray.com`. It is stuck in "pending
   nameserver update" forever, generates nagging email, and is the one artifact
   that could tempt someone into changing nameservers later.
2. Delete the **Worker** (`ethereal`).
3. **Uninstall the Cloudflare GitHub App** from `EtherealDelrayOrg`, or every
   push keeps triggering a build that now fails — Cloudflare's `_redirects`
   parser accepts only 200/301/302/303/307/308, and the doc-hiding rules use
   `404!`, which is Netlify-only syntax.

**Keep the Cloudflare account itself.** Free, Ethereal-owned, and an empty
account confuses nobody — a half-configured zone does.

Then remove the now-dead scaffolding from the repo: `wrangler.jsonc`,
`.assetsignore`, this file, and their matching `404!` lines in `_redirects`.
**`_headers` and `_redirects` must stay** — `netlify.toml` was deleted and those
two files are what configure Netlify now.

---

## Also outstanding

- **GA4 handoff.** Property `G-NDDQ1KQZ8R` sits under the developer's personal
  Google account. Grant the Ethereal Google account **Account-level
  Administrator**, then remove the personal one. GA4 has no true property
  transfer. No technical dependency on anything else — purely a don't-forget.
- **`dev` is well behind `main`**: no `?v=` asset versioning, still carries
  `netlify.toml` (with its deliberate `noindex` block — keep that dev-only), and
  its 13 MB of gallery images have never had the optimisation pass that took
  `main` from ~8 MB to ~3 MB per visit.
- **Contact map is broken on both branches.** CARTO now requires an API key and
  returns watermarked "API KEY REQUIRED" tiles with an HTTP **200**, so nothing
  errors — it silently degrades. Live now at `/contact`. Fix is a design call: a
  free CARTO key preserves the exact muted `voyager_nolabels` look, Stadia's
  free tier is close, plain OpenStreetMap is keyless but bright and label-heavy
  against the dark palette.
- **Deploys cost 15 credits each** — 38% of the August burn, more than the
  bandwidth of ~7 GB. Batch pushes rather than shipping one commit at a time.
- **No DKIM or DMARC** on `etherealdelray.com` (SPF is present). Pre-existing and
  unrelated to hosting, but it means mail from `info@etherealdelray.com` is more
  likely to land in spam — which matters now that both site CTAs point there.
  One for whoever administers the Google Workspace account.

---

## Two traps that already bit, worth remembering

- **A green deploy proves nothing.** The first attempt at hiding the docs
  deployed successfully and changed nothing: Netlify only consults `_redirects`
  for paths that do *not* match a real file, so rules aimed at real files are
  skipped silently. The trailing `!` forces it. Only re-testing the URLs caught
  it.
- **One renderer agreeing does not mean another will.** A compressed menu was
  pixel-identical under MuPDF and visibly broken under iOS PDFKit. See the
  session notes on `_reference/menu-originals/shrink_images_only.py`, which
  compresses images without letting any tool re-serialise page content streams.
