# Content Inventory

Tracks what content exists, what's pending, and what needs to be provided by the client.

## Status Legend
- ✅ Have it
- 🔄 In progress / partially have
- ❓ Need from client
- ⏳ Not yet needed (later phase)

---

## Global / Brand

| Item | Status | Notes |
|------|--------|-------|
| Logo | ✅ | `src/assets/images/logo-wordmark.webp` (gold wordmark, near-lossless WebP) active in nav/footer/opening. `logo.png` is NOT used — it survives only in a CSS comment and is 2.12 MB of dead deploy weight. Official thin wordmark + `ė` monogram in `_reference/` PDFs. |
| Brand colors (final) | ✅ | Sampled from built interior — see `DESIGN_SYSTEM.md`. Confirm with client. |
| Brand fonts (final) | 🔄 | **Jost** (UI/labels, echoes logo) + **Cormorant Garamond** (display/body). Confirm. |
| Favicon | 🔄 | Inline SVG clock mark — should be replaced with the `ė` monogram from `Ä.pdf`. |
| Tagline / brand copy | 🔄 | "Where time breathes" + "Restaurant & Bar" (from brand lockups). Confirm. |

---

## Opening Sequence

| Item | Status | Notes |
|------|--------|-------|
| Clock face illustration (high-res, no BG) | 🔄 | Reference photos provided; need clean render |
| Bird illustrations (peacock, crane) | 🔄 | In reference images; need clean isolated PNGs |
| AI video (generated) | ⏳ | After assets received |
| Background texture / atmosphere image | 🔄 | `ethereal-background-noname.png.png` available |

---

## Homepage

| Item | Status | Notes |
|------|--------|-------|
| Hero text / tagline | ❓ | |
| "About in one line" subheader | ❓ | |
| Featured imagery | ❓ | Food, interior, ambiance |
| CTA buttons copy | ❓ | e.g., "Reserve a Table", "View Menu" |

---

## Menu Page

| Item | Status | Notes |
|------|--------|-------|
| Online ordering | ✅ | **No online ordering** (confirmed). Menu page reframed as dine-in / by reservation; Toast references removed. |
| Full menu (items/PDF/image) | ❓ | Pending. Drop into `.menu-embed-placeholder` in `pages/menu.html` when ready. |

---

## Gallery

| Item | Status | Notes |
|------|--------|-------|
| Photography | ❓ | Food, interior, events — professional photos |
| Video clips (optional) | ❓ | For embedded gallery videos |
| Captions (optional) | ❓ | |

---

## About Us

| Item | Status | Notes |
|------|--------|-------|
| Restaurant story / founding narrative | ❓ | |
| Chef bio(s) | ❓ | |
| Chef photo(s) | ❓ | |
| Interior/team photos | ❓ | |
| Awards / press mentions | ❓ | |

---

## Shop (Coming Soon)

| Item | Status | Notes |
|------|--------|-------|
| Coming soon message / copy | ❓ | |
| Email capture for launch notification? | ❓ | Confirm with client |
| Products / e-commerce scope | ⏳ | Future phase; what are they selling? |

---

## Careers

| Item | Status | Notes |
|------|--------|-------|
| Open positions | ❓ | List from client |
| Application method | 🔄 | Apply links email info@etherealdelray.com for now; confirm preferred method/inbox. |
| General careers copy | ❓ | |

---

## Contact

| Item | Status | Notes |
|------|--------|-------|
| Restaurant address | ✅ | 324 NE 3rd Ave #1, Delray Beach, FL 33444 (footers + contact page) |
| Phone number | ✅ | (561) 270-2738 — `tel:+15612702738` |
| Email address | ✅ | info@etherealdelray.com (general + press + careers apply links) |
| Hours of operation | ✅ | Mon–Sun, 4pm–11pm |
| Social media links | ❓ | Instagram handle/URL still needed (placeholder in place) |
| Map | ✅ | Stylized Leaflet/OpenStreetMap (no API key), warm-toned to match the brand. Click/tap opens the location in the device's native maps app — Apple Maps on Apple devices, Google Maps elsewhere. Coords: 26.4681625, -80.0703055. |

---

## Reservations

| Item | Status | Notes |
|------|--------|-------|
| Resy venue URL / slug | ❓ | |
| Resy notify ID | ❓ | |
| Are they live on Resy yet? | ❓ | Grand opening timing? |
