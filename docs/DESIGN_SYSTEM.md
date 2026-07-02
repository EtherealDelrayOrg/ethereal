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

## Homepage Hero — Bright Mural, Image and Copy Separated

**Added Jul 2026, client-requested; restructured Jul 2026.** The hero's crane-and-peacock mural (`src/assets/images/bg-brand.png`) is shown at true brightness, not the dark nocturnal treatment used elsewhere on the site — the client wants this image to be the showcase, not a moody backdrop.

**Four rounds of "put text on top of the photo" all failed** — a light spotlight scrim read as haze; dark ink text needed a white outline to survive the peacock's feathers, and that outline read as an ugly white background; solid per-line dark plaques fixed contrast but were rejected outright as "black boxes." The pattern common to all four: fighting one surface (a busy, bright photograph) to hold two jobs — showcase image and legible typography — at once. Nearly every high-end hospitality/restaurant site (the brief was explicitly "analyze great restaurant designs") avoids this fight entirely: **the photograph and the caption are two separate surfaces**, like a museum print and its wall label, not text printed over the art.

**Current structure** (`#hero` in `index.html` / `home.css`):
- `.hero-image` — the mural alone, full-bleed, nothing overlaid on it at all. `background-position: center 12%` (not `center`) because the square (1024×1024) source puts both birds' heads in the top third; a plain center crop clips the crane's crown on any viewport wider than the image is tall. `filter: brightness(1.05) saturate(1.12)` keeps it bright per the brief. Height is viewport-relative (`78vh` desktop, down to `48vh` on mobile) so the caption below is reachable without excessive scrolling.
- `.hero-caption` — a plain `var(--ink)` band directly below the image (hairline `--brass-dark` top border, echoing the `.page-header` border used on every subpage). Contains the label, title, subtitle, and CTAs using the site's completely standard type system — `.label` for the eyebrow, `--ivory` for the title, `--ivory-dark` for the subtitle, unmodified `.btn--filled`/`.btn--ghost`. Zero bespoke color, shadow, or background rules; contrast is guaranteed because it's ink-on-solid-ink, exactly like every other page's `.page-header`.
- **The header is now always opaque** (`#site-header`'s dark background/blur/border moved out of `.is-scrolled` into the base rule, in `globals.css`) instead of transparent-until-scroll. This was the last place text sat on top of the photo; making the header a permanent solid bar removes that case entirely, and is a no-op visual change on every other page (their content is already `--ink`, so an "always opaque" header looks identical to the old scroll-triggered one). This also meant `.logo-img`'s `mix-blend-mode: screen` (which assumes a dark backdrop) works again without a homepage-specific override, since the header is never transparent over bright imagery anymore.
- Net effect: no vignette, no scrim, no outline, no plaque, no `backdrop-filter`, no per-page nav override — all of that machinery from the earlier attempts is gone. `home.css` is ~90 lines, almost all of it just sizing the two blocks and the entrance animation.

This is a **scoped structural pattern for the homepage hero specifically** — subpages keep their existing `.page-header` (text directly on `--ink`, no photo involved) unchanged.

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
