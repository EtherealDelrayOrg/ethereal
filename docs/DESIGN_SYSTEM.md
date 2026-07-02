# Design System — Ethereal

## Aesthetic Direction

**"Opulent Botanical Nocturne"** — the website should feel like stepping into the restaurant itself at dusk: a dark, warm, candlelit jewel-box where botanical wonder meets old-world luxury and the slow turning of a clock.

This direction is drawn directly from the built interior (see `_reference/images/`), not from a mood board. The space is **maximalist and warm**, not cool or museum-faded:

- A sculptural bare **tree** rises behind a carved-stone **bar**, lit by pools of amber light
- A **peacock** mural glows on textured plaster under warm uplight
- Deep **forest-green velvet** curved banquettes, fluted and channel-tufted, wrap the lounge
- Polished **bronze cone** pedestal tables catch the light
- Cascading cream **shell chandeliers** hang from a vaulted ceiling of dark marbled-agate panels
- A **mosaic stained-glass clock** (emerald, terracotta, cream) sits inside a gilded **birdcage** dripping with crystal
- The floor is warm: **leopard-spotted resin** in the lounge, an ochre **geometric tile** (Greek-key) at the bar

The mood is: **warmth, depth, candlelight, jewel-tones, botanical life, unhurried luxury.** Time does not rush here. It breathes.

> What changed from the previous spec: the old "Antiquarian Botanical" direction read cool, dusty, and museum-like. The real restaurant is warmer, darker, and more opulent — emerald velvet and bronze under candlelight. The palette, materials, and type below are tuned to that reality.

---

## Brand Marks

The brand has a formal, minimal identity (see the four lockup PDFs in `_reference/`):

| Mark | File | Use |
|------|------|-----|
| **Wordmark** | `ÄTHÄRÄAL.pdf` | The primary logotype — thin, geometric, signature dotted **`ė`** repeated (ė-TH-ė-R-ė-AL) |
| **Full lockup** | `ÄTHÄRÄAL Restaurant & Bar.pdf` | Wordmark + hairline rule + "Restaurant & Bar" |
| **Monogram / icon** | `Ä.pdf` | The dotted **`ė`** alone — favicon, loading marks, decorative motif |
| **Tagline lock** | `Restaurant & Bar.pdf` | "Restaurant & Bar" set in the thin geometric companion |

The dotted **`ė`** (a circle with a horizontal bar and a tittle above) is the brand's signature glyph. Use it as a recurring ornament — dividers, list markers, loading dots — in place of generic diamonds or bullets.

**Active site logo:** the burnished-gold `eTHeReAL` wordmark is currently used in the header/nav, mobile menu, footer, and opening sequence. It harmonizes with the bronze-and-candlelight palette. Two variants of the same art: `src/assets/images/logo.png` (footer + opening sequence) and `src/assets/images/logo-wordmark.png` — tightly cropped to the wordmark with no transparent padding, used in the centered masthead and mobile menu so it stacks cleanly above the nav. The thin black wordmark from the PDFs is the formal/print identity and the basis for the favicon and the `ė` motif. Logo art is always placed as an image asset (PNG/SVG) — never recreated in a web font.

---

## Color Palette

Sampled from the built interior and the brand assets. The site is built on **warm darkness** — deep greens and browns under gold light, never cool or blue-black.

### Foundation

| Name | Hex | Usage |
|------|-----|-------|
| `--ink` | `#0a0807` | Page background. Warm near-black, like an unlit room. |
| `--shadow` | `#050403` | Deepest shadow. Vignettes, drop shadows, deep section wells. |
| `--char` | `#161210` | Raised charcoal — cards, panels, slightly lifted surfaces. |

### Emerald — the signature material (velvet)

| Name | Hex | Usage |
|------|-----|-------|
| `--emerald` | `#234a3f` | Forest-green velvet. Feature section backgrounds, the "lounge" surface. |
| `--emerald-deep` | `#15302a` | Deeper velvet in shadow. Layering, gradients. |
| `--emerald-lit` | `#356457` | Velvet catching light. Hover tints, accents on emerald surfaces. |

### Gold & Bronze — the metal

| Name | Hex | Usage |
|------|-----|-------|
| `--brass` | `#c49140` | Primary accent. The gilded birdcage, clock bezel, hairlines, nav/text accents, and the primary filled button. |
| `--brass-light` | `#dcb06a` | Highlight face. Hover states on gold, active elements. |
| `--brass-dark` | `#8a6428` | Shadow face. Hairline borders, dividers, quiet details, and the border on solid brass fills (see below). |
| `--bronze` | `#a87b4a` | Warmer metal — the cone tables, lamp bases. Secondary metallic accent. |

> **Updated Jul 2026:** the brass hue was shifted a few degrees warmer (was `#c4a440`/`#dcc06a`/`#8a6e28`) — the old values read as flat yellow rather than a metal. Same lightness/saturation, just less yellow, more gold-orange. Applies everywhere `--brass*` is used, including the hardcoded rgba() glows/tints in `globals.css`, `pages.css`, and `opening-sequence.css` that echo these hex values.
>
> A `--brass-deep` (darker) variant was tried briefly for `.btn--filled` after the client felt a full-block `--brass` button read yellow, then reverted after the client felt the darker version was *too* dark. Landed on: keep `--brass` as the fill, but give it a `--brass-dark` border plus a faint inset top/bottom bevel (`box-shadow: inset 0 1px 0 rgba(255,255,255,.25), inset 0 -1px 0 rgba(0,0,0,.2)`) — the contrasting edge and bevel read as a struck metal plaque (like the clock bezel) rather than a flat colored rectangle, without darkening the gold itself. `--brass-deep` was removed as a token; nothing uses it.

### Warm accents

| Name | Hex | Usage |
|------|-----|-------|
| `--terracotta` | `#a3603c` | Mosaic + leopard-floor warmth. Small accents, patina, hover on warm elements. |
| `--mosaic-teal` | `#4f8a88` | The clock's stained-glass center. Special decorative accents only. |
| `--blush` | `#cf9ca0` | Magnolia pink. Dusty, never bright. Tiny decorative touches. |
| `--amber` | `#e0a85a` | The candlelight glow. Used in radial light effects, never as a flat fill. |

### Text & light

| Name | Hex | Usage |
|------|-----|-------|
| `--ivory` | `#f1e8d4` | Primary text on dark. From the shell chandeliers + clock numerals. |
| `--ivory-dark` | `#dccaa2` | Secondary / muted text. |

### Do Not Use
- Pure white `#ffffff` (use `--ivory`) or pure black `#000000` (use `--ink`/`--shadow`).
- Cool / blue-black backgrounds — the whole world is warm.
- Saturated, bright, or "digital" colors — everything is aged, deep, and candlelit.
- Cool sage/grey-greens as the green — the velvet is **warm forest emerald**, not dusty sage.

---

## Typography

Two families with clear jobs: a romantic high-contrast serif for display and evocative prose, and a highly legible humanist sans for everything functional. **Legibility is non-negotiable — functional text is never below ~12px, and reading data (addresses, contacts, hours) sits at 16px+.** Cormorant's beauty lives at large sizes; small functional text belongs to the sans.

### Display & Prose — **Cormorant Garamond** (serif)
- Hero, page titles, section headings, large taglines, and *evocative* body/intro prose.
- Weights: 300/400 (light italic for taglines & large display), 600 (emphasis).
- Character: classical, high-contrast, calligraphic — matches the ornate, hand-built interior.
- Sizes: hero/page titles `clamp` up to ~7rem; section headings ~2–3.3rem; evocative body 18–21px, line-height ~1.8. Keep it large — don't set Cormorant small.

### Functional text & UI — **Hanken Grotesk** (humanist sans)
- *Everything functional:* nav, eyebrow labels, buttons, **addresses, contacts, hours**, form fields + labels, footer data/nav, card metadata, dish/value/job descriptions.
- A warm, highly legible humanist grotesque — far clearer at small sizes than a geometric face, and the right home for numerals (phone, address).
- Weights: 400 (text/data), 500–600 (labels, buttons, nav emphasis).
- Sizes: **data/body 15–16.5px** (line-height ~1.7); **labels/eyebrows/buttons/nav 12–13px** uppercase, tracking 0.12–0.18em. Never below 11px (tiny chips/attribution only).
- Replaces the previous **Jost** — Jost's cold geometry read poorly for addresses/contacts and small functional text; Hanken Grotesk is warmer and far more legible while still pairing cleanly with the serif.

> The brand *wordmark* is still thin/geometric (the logo image with its dotted `ė`); the UI type no longer needs to imitate it, since the logo carries that identity as an asset.

### Hierarchy Example
```
[ė logo asset]              ← brand mark image
where time breathes.        ← Cormorant Garamond italic, ~17px, --ivory-dark
GET IN TOUCH                ← Hanken Grotesk 500, 13px, tracking 0.18em, --brass
A restaurant out of time…   ← Cormorant Garamond 400, ~20px, --ivory-dark
324 NE 3rd Ave #1           ← Hanken Grotesk 400, 16.5px, --ivory
RESERVE A TABLE             ← Hanken Grotesk 500, 13px, tracking 0.14em (button)
```

---

## Spacing & Layout

- Base unit 8px; spacing in multiples (8 / 16 / 24 / 32 / 48 / 64 / 96 / 128).
- Max content width ~1320px, centered (wider on ≥1500px).
- Section padding: 96–128px desktop, 48–64px mobile.
- Generous negative space — the opulence reads better with room around it.

---

## Materials & Surfaces

Surfaces should evoke real materials in the room, layered with warm light.

- **Velvet (emerald):** feature sections use `--emerald` / `--emerald-deep`, ideally with a soft vertical gradient and a faint vignette so it reads like light falling across fabric.
- **Candlelight:** warm radial glows (`radial-gradient` in `--amber` / `--brass` at very low alpha) behind heroes, CTAs, and focal points. Light pools, never flat fills.
- **Metal:** borders and rules in `--brass-dark` (1px hairline). Gold elements may carry a faint warm glow on hover (brightness/›glow), never a color change.
- **Cards / panels:** background `--char` or `rgba(255,255,255,0.03)`, 1px `--brass-dark` border, radius ≤ 2px.
- **Mosaic accents:** the clock rosette's tessellated emerald/terracotta/cream can inspire small decorative details and dividers.
- **Vignettes:** most full-bleed imagery gets a warm dark vignette so text stays legible and the mood stays nocturnal. **The homepage hero is the one deliberate exception — see below.**

---

## Homepage Hero — Bright Mural, Text on the Photo

**Added Jul 2026, client-requested; through several revisions since.** The hero's crane-and-peacock mural (`src/assets/images/bg-brand.png`) is shown bright and colorful, not the dark nocturnal treatment used elsewhere on the site — the client wants this image to be the showcase, not a moody backdrop.

**What was tried and rejected, in order** (kept here so the reasoning isn't lost and nobody re-walks the same dead ends):
1. A light ivory "spotlight" scrim behind the text — read as haze sitting over the artwork.
2. Dark ink text with a white outline/glow — needed to be thick to survive the peacock's dark feathers, and at that thickness read as an ugly white background.
3. Solid per-line dark "plaques" behind each line of text — fixed contrast cleanly but was rejected outright as "black boxes."
4. Moving the copy off the photo entirely into a solid-ink band below the image (the "museum wall label" pattern many hospitality sites use) — technically the most robust option, but the client felt it looked disjointed on mobile/Android/desktop; a full-bleed hero image immediately followed by a hard-edged black band read as broken rather than intentional. **Reverted.**

**Current approach: text back on the photo, but the legibility work is spread across three independent levers instead of one overlay trying to do everything:**
1. **The image stays close to true brightness.** `.hero-bg`: `filter: brightness(1.05) saturate(1.12)`. This dipped briefly to `0.88` to give text more to sit on, but the client asked for the brighter image back — the scrim below was strengthened to compensate instead, so the image could stay vivid.
2. **A dark (never light) graduated scrim**, `.hero-scrim`, layered as its own element above `.hero-bg` — a radial darken centered on the text block plus a bottom-weighted linear gradient (`rgba(10,8,7,.06)` at the top down to `rgba(10,8,7,.68)` at the bottom). Almost nothing across the birds' heads at the top (that's deliberately where the gradient is weakest); heaviest low, where the subtitle and buttons sit. This reads as a photographic grade (like burning in a print), not a haze, because it darkens rather than lightens and has no hard edge.
3. **Denser, heavier type carries the rest.** Thin type was the real fragility in every earlier attempt — a 300-weight italic serif has almost no "ink" per glyph, so it needs a lot of outline/backing to stay visible on a busy photo. Instead:
   - `.hero-title`: Cormorant Garamond moved from weight 300 to **600** (the family's built-in "emphasis" weight, per the Typography section above), still italic. More than double the stroke mass at the same size.
   - `.hero-sub`: moved from Cormorant Garamond italic to **Hanken Grotesk** (the site's functional sans) at medium weight — a uniform-stroke sans holds contrast far more predictably on variable imagery than a high-contrast serif with hairline strokes. (This matches the Typography section's own rule that small functional text belongs to the sans, not Cormorant.)
   - Both, plus the label, keep a conventional dark drop-shadow (`text-shadow`, no white/light component) for a small amount of edge separation — the same technique used under virtually every "text over photo" hero on the web. This is categorically different from the rejected white-outline approach: a dark shadow under light text blends with the photo's own shadows instead of standing out as a foreign white shape.
4. **Verified with real pixel math, not assumption:** sampled the mural's actual rendered colors under the text (canvas `getImageData`, mapped through the live cover/position/filter/scrim math) and ran WCAG contrast against `--ivory` at each sample point — worst case ~4.5:1, most points 7–12:1 (re-checked after the brightness/scrim rebalance above; the brighter image loses a little headroom but the strengthened scrim holds it at the same practical level as before). The one weak spot found this way was the eyebrow label ("Coming Soon"), which sits near the top where the scrim is intentionally almost off (to keep the birds bright) — gold-on-gold (`--brass-light` against the mural's warm mid-tones) is the one place the scrim alone doesn't fully protect, so `.hero-label` carries a stronger dark shadow than the rest of the hero copy to compensate.
5. **Centering:** the title is a plain `<h1>Where time<br>breathes.</h1>` inheriting `text-align: center` from `#hero` — no per-line wrapper spans this time (those were only needed for the rejected per-line-plaque approach). Verified via `Range.getBoundingClientRect()` per line that both lines sit exactly on the viewport's horizontal center at mobile widths (375px and 360px tested) as well as tablet and desktop.

**The header stays permanently opaque** (a change made during the "separated" attempt and kept): `#site-header`'s dark background/blur/border live in the base rule, not gated behind `.is-scrolled`. This is a no-op visual change on every other page (their content is already `--ink`) and means the logo's normal `mix-blend-mode: screen` (which assumes a dark backdrop) works without a homepage-specific override, since the header is never transparent over bright imagery.

This is a scoped exception, not a new site-wide direction — every other section, page, and component keeps the dark "Opulent Botanical Nocturne" treatment described above.

---

## Ornament & Iconography

- The dotted **`ė`** is the house ornament. Use it (or a single mosaic-style dot) as the centerpiece of dividers and as list markers, replacing generic diamonds/bullets.
- No emoji, no generic icon packs. Icons are thin SVG line drawings (1–1.5px stroke) in `--ivory-dark` or `--brass-dark`.
- The brand's visual vocabulary: the **clock**, **peacock**, **crane**, **magnolia**, **bare tree**, **shell chandelier**, **bird-cage scrollwork**. Decorative flourishes should reference these forms.
- Botanical cutout assets (peacock, crane, magnolia — in `_reference/images/`) may be placed sparingly as corner flourishes or section accents at low opacity, always serving the composition, never busy.

---

## Motion & Animation

The brand moves like something mechanical and weighted — deliberate, never snappy.

- Duration: 600–900ms for transitions; nothing under 400ms.
- Easing: `cubic-bezier(0.25, 0.1, 0.1, 1)` — gears settling into place.
- Hover: subtle warmth/brightness on gold; gentle lift on cards. No color flips.
- Scroll reveals: fade + 20px rise, 100ms stagger between siblings.
- No bounce, no spring. Still and certain.
- Respect `prefers-reduced-motion` — disable the opening sequence and large motions.

---

## Photography & Imagery Direction

Imagery should look like the room: **warm, dark, candlelit, jewel-toned.**

- Warm temperature only — no cool/blue grades.
- Rich shadow, deep blacks, pools of amber light. Embrace darkness.
- Shallow depth of field / bokeh fits the dreamlike, intimate quality.
- Food: candlelit or warm-window light on dark surfaces.
- The built interior (emerald velvet, bronze, the tree, the mosaic clock) is the north star — if a photo doesn't feel of-a-piece with those rooms, it's the wrong photo.

---

## What to Avoid

| Avoid | Why |
|-------|-----|
| Cool / blue-black backgrounds | The world is warm darkness, candlelit |
| Bright white or hard contrast | Breaks the nocturnal jewel-box mood |
| Dusty/grey sage as "the green" | The signature green is warm forest emerald (velvet) |
| Saturated or digital colors | Everything is aged, deep, and warm |
| Functional text below ~12px | Hard to read; labels 12–13px, data 16px+ |
| Light display serif for data | Addresses/contacts/numbers belong in the legible sans (Hanken), not Cormorant |
| Rounded corners > 2–4px | Softens the architectural, hand-built precision |
| Flat fills where light should pool | Use warm radial glows; light has a source here |
| Animations under 400ms, bounce/spring | Too snappy/playful; the brand is still and certain |
| Stock photography | Must feel bespoke and of-a-piece with the real rooms |
</content>
