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

**Active site logo:** the burnished-gold `eTHeReAL` wordmark (`src/assets/images/logo.png`) is currently used in the nav, footer, and opening sequence. It harmonizes with the bronze-and-candlelight palette. The thin black wordmark from the PDFs is the formal/print identity and the basis for the favicon and the `ė` motif. Logo art is always placed as an image asset (PNG/SVG) — never recreated in a web font.

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
| `--brass` | `#c4a440` | Primary accent. The gilded birdcage, clock bezel, all gold UI. |
| `--brass-light` | `#dcc06a` | Highlight face. Hover states on gold, active elements. |
| `--brass-dark` | `#8a6e28` | Shadow face. Hairline borders, dividers, quiet details. |
| `--bronze` | `#a87b4a` | Warmer metal — the cone tables, lamp bases. Secondary metallic accent. |

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
| `--ivory` | `#efe6d2` | Primary text on dark. From the shell chandeliers + clock numerals. |
| `--ivory-dark` | `#cbb893` | Secondary / muted text. |

### Do Not Use
- Pure white `#ffffff` (use `--ivory`) or pure black `#000000` (use `--ink`/`--shadow`).
- Cool / blue-black backgrounds — the whole world is warm.
- Saturated, bright, or "digital" colors — everything is aged, deep, and candlelit.
- Cool sage/grey-greens as the green — the velvet is **warm forest emerald**, not dusty sage.

---

## Typography

The brand wordmark is **thin and geometric** (Art-Deco / Futura-adjacent, with the dotted `ė`). The UI layer echoes that geometry; the editorial layer stays in a romantic high-contrast serif that matches the carved-stone, classical opulence of the room.

### Display / Headings — **Cormorant Garamond**
- Page titles, section headers, pull quotes, the tagline.
- Weights: 300 (light italic for taglines & large display), 400, 600 (emphasis).
- Character: classical, high-contrast, calligraphic — matches the ornate, hand-built interior.
- Sizes: 48–80px display, 28–36px section headers, 20–24px subheads.

### UI / Labels / Nav — **Jost**
- Nav links, button labels, form labels, eyebrow labels, footer headings.
- A geometric sans (Futura lineage) that mirrors the logo's letterforms.
- Weights: 300 / 400. Never bold — keep it thin and quiet.
- Always wide-tracked: `letter-spacing: 0.16em–0.25em`, uppercase for labels.
- Sizes: 10–13px for nav/labels/buttons.
- Replaces the previous Cinzel (engraved Roman caps) — Jost is closer to the actual brand voice and feels more contemporary-luxe.

### Body — **Cormorant Garamond Regular**
- 16–19px, weight 400, line-height ~1.9. Generous and unhurried.
- Never set body in Jost — it's a display/UI face only.

### Hierarchy Example
```
[ė logo asset]              ← brand mark image
where time breathes.        ← Cormorant Garamond 300 italic, --ivory-dark
OUR STORY                   ← Jost 400, 11px, tracking 0.22em, --brass
A restaurant out of time…   ← Cormorant Garamond 400, 18px, --ivory
RESERVE A TABLE             ← Jost 400, 11px, tracking 0.18em (button)
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
- **Vignettes:** most full-bleed imagery gets a warm dark vignette so text stays legible and the mood stays nocturnal.

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
| Bold/heavy UI type | UI is thin geometric (Jost), quiet and wide-tracked |
| Rounded corners > 2–4px | Softens the architectural, hand-built precision |
| Flat fills where light should pool | Use warm radial glows; light has a source here |
| Animations under 400ms, bounce/spring | Too snappy/playful; the brand is still and certain |
| Stock photography | Must feel bespoke and of-a-piece with the real rooms |
</content>
