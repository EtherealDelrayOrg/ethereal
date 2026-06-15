# Design System — Ethereal

## Aesthetic Direction

**"Antiquarian Botanical"** — the intersection of clockwork precision and organic wonder. Think a Victorian natural history cabinet: aged brass instruments beside pressed flowers, mechanical gears half-hidden by magnolia vines, a white crane standing still as a clock ticks behind it. Time does not rush here. It breathes.

This is *not* dark industrial steampunk (the direction of the early demo files). The reference assets are warmer, richer, more painterly. The mood is: wonder, elegance, age, mystery — the feeling of a beautiful old thing that still works perfectly.

---

## Color Palette

All values extracted directly from the provided brand assets (clock illustrations, brand background, logo).

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| `--ink` | `#0d0b09` | Page background. Near-black with warmth — not cool or blue. |
| `--brass` | `#c4a440` | Primary accent. Aged clock bezel. All gold UI elements. |
| `--brass-dark` | `#8a6e28` | Shadow face of brass. Borders, dividers, subtle details. |
| `--brass-light` | `#d4b858` | Highlight face of brass. Hover states, active elements. |
| `--ivory` | `#ede3ce` | Primary text on dark backgrounds. From the numeral cartouche panels. |
| `--ivory-dark` | `#c8b898` | Secondary / muted text. |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| `--sage` | `#4a6b65` | The aged fresco wall from the brand illustration. Section backgrounds, overlays. Used sparingly — never for text. |
| `--sage-dark` | `#2e4440` | Deeper sage. Layering behind the sage sections. |
| `--teal` | `#2d5f6b` | Peacock body. The deep jewel tone. Accent on special elements, hover. |
| `--blush` | `#c49098` | Magnolia pink. Muted and dusty — never bright. Subtle accents, small decorative details only. |

### Atmosphere Colors (mosaic, depth, atmosphere)

| Name | Hex | Usage |
|------|-----|-------|
| `--mosaic-teal` | `#5b8f98` | From the clock center rosette. Decorative elements, subtle textures. |
| `--mosaic-rust` | `#9e6040` | From the clock center rosette. Warmth, aged patina details. |
| `--shadow` | `#060503` | Deepest shadow. Vignette edges, drop shadows. |

### Do Not Use
- Pure white `#ffffff` — too harsh. Use `--ivory`.
- Pure black `#000000` — too flat. Use `--ink` or `--shadow`.
- Saturated bright colors — anything Tailwind would call "blue-500" or "pink-400" is wrong for this palette.
- The aggressive copper/iron tones from the demo CSS — those were too industrial.

---

## Typography

### Logo
The "eTHeReAL" wordmark is a custom 3D burnished gold letterform — mixed case, with a specific rhythm (lowercase `e`, uppercase `TH`, lowercase `é`, uppercase `R`, lowercase `e`, uppercase `AL`). This is the logo as an asset (SVG or PNG), never recreated with a web font.

### Web Fonts (Google Fonts)

**Display / Headings — Cormorant Garamond**
- Used for: page titles, section headers, pull quotes, the brand tagline
- Weights: 300 (light italic for taglines), 400 (regular), 600 (semibold for emphasis)
- Character: deeply classical, refined, with a slight calligraphic quality that matches the handpainted feel of the brand illustration
- Sizes: 48–80px display, 28–36px section headers, 20–24px subheadings

**Navigation / Labels / UI — Cinzel**
- Used for: nav links, button labels, form labels, small caps details
- Weight: 400 only — Cinzel at heavier weights becomes too aggressive for this palette
- Character: engraved Roman capitals, the typographic equivalent of text chiseled in brass
- Sizes: 12–14px for nav/labels (letter-spacing: 0.15em to give it room to breathe)

**Body text — Cormorant Garamond Regular**
- The same family as the display font, but at reading size (16–18px, weight 400)
- Line-height: 1.8 — generous, unhurried
- Never Cinzel for body text — it becomes unreadable at small sizes

### Hierarchy Example
```
eTHeReAL                    ← Logo SVG asset
Where time breathes.        ← Cormorant Garamond 300 italic, 20px, --ivory-dark
OUR STORY                   ← Cinzel 400, 12px, letter-spacing 0.2em, --brass
A restaurant is not merely  ← Cormorant Garamond 400, 17px, --ivory
```

---

## Spacing & Layout

- Base unit: 8px
- All spacing in multiples of 8: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
- Max content width: 1200px, centered
- Section padding (desktop): 96–128px top/bottom
- Section padding (mobile): 48–64px top/bottom

---

## Borders & Surfaces

- **Borders:** always `--brass-dark`, 1px. Never sharp default gray.
- **Dividers:** a single 1px `--brass-dark` line, often with a small ornamental element centered on it (a dot, a small gear SVG). Never a plain HR.
- **Cards / panels:** background `rgba(255,255,255,0.03)` — barely lifted from the page bg. Border `1px solid var(--brass-dark)`. No white cards.
- **Radius:** very subtle — `border-radius: 2px` at most, or none. Straight edges feel more architectural.

---

## Motion & Animation

The brand moves like something mechanical: deliberate, weighted, never snappy.

- **Duration:** 600–900ms for transitions. Nothing under 400ms feels right here.
- **Easing:** `cubic-bezier(0.25, 0.1, 0.1, 1)` — starts slightly fast, decelerates into place. Feels like gears settling.
- **Hover states:** subtle brightness increase on brass elements (filter: brightness(1.15)), no color change.
- **Reveals on scroll:** elements fade in and rise 20px. Stagger 100ms between siblings.
- **No bounce, no spring** — those feel playful and modern. This brand is still and certain.

---

## Iconography

No emoji. No generic icon packs. Where icons are needed:
- Use simple SVG line icons, drawn thin (1–1.5px stroke), in `--ivory-dark`
- Alternatively: small ornamental flourishes (fleurons, dots, dashes) in `--brass-dark`
- The brand has a visual vocabulary of: gears, feathers, clock hands, botanical stems — if an icon is needed, it should reference one of these forms

---

## Photography & Imagery Direction

All photography should feel **aged, painterly, and atmospheric** — not the crisp high-contrast editorial style of a typical restaurant site.

- Warm temperature. No cool/blue tones.
- Slight desaturation / matte finish — avoid super-punchy contrast.
- Bokeh welcome. Shallow depth of field fits the dreamlike quality.
- Food photography: candlelit or warm-window-light only. Dark backgrounds preferred.
- The clock and bird illustration aesthetic is the north star — if a photo feels out of place next to those assets, it's the wrong photo.

---

## What to Avoid

| Avoid | Why |
|-------|-----|
| Bright white backgrounds | Breaks the atmospheric dark-world feeling |
| Saturated colors | Brand palette is entirely muted and aged |
| Sans-serif fonts for display | Wrong energy — too modern, too clean |
| Drop shadows with spread | Feels web-2.0; use only tight `box-shadow: 0 2px 8px rgba(0,0,0,0.6)` |
| Rounded corners > 4px | Softens the mechanical precision the brand carries |
| Animations under 400ms | Too snappy; nothing here should feel instant |
| Stock photography | Must feel bespoke and of-a-piece with the illustration assets |
