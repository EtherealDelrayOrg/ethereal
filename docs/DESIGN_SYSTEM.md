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
| `--brass` | `#c49140` | Primary accent. The gilded birdcage, clock bezel, hairlines, nav/text accents. |
| `--brass-light` | `#dcb06a` | Highlight face. Hover states on gold, active elements. |
| `--brass-dark` | `#8a6428` | Shadow face. Hairline borders, dividers, quiet details, and the border on solid brass fills (see below). |
| `--bronze` | `#a87b4a` | Warmer metal — the cone tables, lamp bases. Secondary metallic accent. |

> **Updated Jul 2026:** the brass hue was shifted a few degrees warmer (was `#c4a440`/`#dcc06a`/`#8a6e28`) — the old values read as flat yellow rather than a metal. Same lightness/saturation, just less yellow, more gold-orange. Applies everywhere `--brass*` is used, including the hardcoded rgba() glows/tints in `globals.css`, `pages.css`, and `opening-sequence.css` that echo these hex values.
>
> `.btn--filled`'s color has moved a few times chasing "more gold, less yellow" then "too dark" then "more brass gold": a `--brass-deep` (darker) variant was tried and reverted for reading too dark, then a plain flat `--brass` fill read a little pale/lifeless at full-block scale. **It's now a two-layer metallic gradient, not a flat fill** — real brass doesn't reflect light evenly, so a solid color swatch reads as "painted," not "metal," no matter how the hue is tuned:
> - A small warm radial highlight (`rgba(255,250,235,.55)`, an ellipse positioned at 28% 20%) standing in for a light source catching the surface — the "блик" a light source leaves on polished metal.
> - Underneath, a `155deg` linear gradient running light → base → darker → lighter → darker (`#e2a95a → #d98e26 → #b67820 → #c78323 → #a96f1e`) for a brushed-metal sheen rather than a single flat tone.
> - Hover shifts the same construction brighter, as if the light source moved closer, rather than just swapping to a lighter flat color.
> - Every stop was individually checked against the button's `--ink` text for WCAG contrast (worst case `#a96f1e` at ~4.7:1) — a gradient this varied can quietly fail contrast at its darkest point even when the "average" color looks fine, so each stop needs to clear the bar on its own, not just the gradient as a whole.
> - Kept the border + faint inset top/bottom bevel from the earlier flat-fill version (`box-shadow: inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.25)`), now with the border matching the gradient's darkest stop.
> - This is scoped entirely to `.btn--filled` — deliberately not the shared `--brass` token, since what reads right for a small hairline/text accent and what reads right as a large solid fill (now a gradient) are different jobs. `--brass-deep` was removed as a token earlier; nothing uses it. `--brass` itself is untouched for nav/hairline/text use.

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
1. **The image keeps getting brighter on request.** `.hero-bg`: `filter: brightness(1.4) saturate(1.18)`, up from `1.3`, `1.15`, `1.05`, and an earlier dip to `0.88` for text contrast. For every increase through `1.3`, the scrim below was strengthened to fully compensate ("the image wins, the scrim adapts, contrast holds steady"). Since that round the client has asked twice for the scrim itself to be less dark, so — unlike the brightness increases — this is a genuine net loosening of the contrast margin, not a compensated increase. See the contrast numbers below.
2. **A dark (never light) graduated scrim**, `.hero-scrim`, layered as its own element above `.hero-bg` — a radial darken centered on the text block plus a bottom-weighted linear gradient, currently `rgba(10,8,7,.05)` at the top down to `rgba(10,8,7,.52)` at the bottom (radial center alpha `.30`), eased down again from `.06`→`.62` (radial `.38`) per a follow-up "less dark" request. Almost nothing across the birds' heads at the top (that's deliberately where the gradient is weakest); heaviest low, where the subtitle and buttons sit. This reads as a photographic grade (like burning in a print), not a haze, because it darkens rather than lightens and has no hard edge.
3. **Denser, heavier type carries the rest.** Thin type was the real fragility in every earlier attempt — a 300-weight italic serif has almost no "ink" per glyph, so it needs a lot of outline/backing to stay visible on a busy photo. Instead:
   - `.hero-title`: Cormorant Garamond moved from weight 300 to **600** (the family's built-in "emphasis" weight, per the Typography section above), still italic. More than double the stroke mass at the same size. Sized `clamp(2.9rem, 7.8vw, 7.2rem)` — the mobile floor is untouched (still hits `2.9rem` below ~600px, matching the earlier "keep it centered/compact on mobile" requests), but the desktop ceiling and slope were both raised (from `7.5vw`/`6.6rem`) per a "make the title slightly larger on desktop" request, so the increase is desktop-only in practice.
   - `.hero-sub`: moved from Cormorant Garamond italic to **Hanken Grotesk** (the site's functional sans) at medium weight — a uniform-stroke sans holds contrast far more predictably on variable imagery than a high-contrast serif with hairline strokes. (This matches the Typography section's own rule that small functional text belongs to the sans, not Cormorant.) `.hero-title`'s `margin-bottom` was increased from `1.5rem` to `1.85rem` so the subtitle sits a little lower/more separated from the title, per client request.
   - Both, plus the label, keep a conventional dark drop-shadow (`text-shadow`, no white/light component) for a small amount of edge separation — the same technique used under virtually every "text over photo" hero on the web. This is categorically different from the rejected white-outline approach: a dark shadow under light text blends with the photo's own shadows instead of standing out as a foreign white shape.
4. **Verified with real pixel math, not assumption, every time the brightness, scrim, or type geometry changes.** Two complementary methods are used together, because a single worst-pixel scan of the *bounding box* is misleading here — the box is wider than the actual glyphs, so its literal corners often land on the mural's brightest spots (e.g. a magnolia petal) that the text never actually sits on:
   - **Box-corner sampling** (canvas `getImageData`, mapped through the live cover/position/filter/scrim math, WCAG contrast against `--ivory`) — a fast, conservative upper bound.
   - **Real ink-mask sampling** — render the actual copy in the actual font/weight/size to an offscreen canvas, keep only pixels with meaningful glyph alpha, and check contrast only where a letter is actually drawn. This is the one that reflects what a reader really sees.
   At the current (post-request) settings, ink-mask sampling gives a median contrast of ~6.3:1 (title) and ~6.9:1 (subtitle), with the 25th-percentile (i.e. "most of the letter, not just anti-aliased edges") still at ~5.9:1 and ~6.6:1 — comfortably above AA-Large's 3:1 and standard AA's 4.5:1 respectively. The extreme low tail (a handful of anti-aliased edge pixels, or a letter landing squarely on the brightest part of a petal) can dip toward ~2.6–2.8:1; this has always been true of this design (text-on-photo, not text-on-plaque) and is why the drop-shadow exists as a second, independent line of defense — it's what keeps those specific low-contrast pixels from actually reading as illegible in practice. If a future request pushes brightness or scrim lightness further, re-run both checks rather than eyeballing it, and watch the ink-mask median/25th-percentile numbers specifically (the box-corner worst-case will always look scarier than reality here). The one persistently weak spot is the eyebrow label ("Coming Soon"), which sits near the top where the scrim is intentionally almost off (to keep the birds bright) — gold-on-gold (`--brass-light` against the mural's warm mid-tones) is the one place the scrim alone doesn't protect, so `.hero-label` carries a stronger dark shadow than the rest of the hero copy to compensate.
5. **Centering:** the title is a plain `<h1>Where time<br>breathes.</h1>` inheriting `text-align: center` from `#hero` — no per-line wrapper spans this time (those were only needed for the rejected per-line-plaque approach). Verified via `Range.getBoundingClientRect()` per line that both lines sit exactly on the viewport's horizontal center at mobile widths (375px and 360px tested) as well as tablet and desktop.

**The header is transparent over the hero, solid everywhere else** (reinstated Jul 2026 after a stretch of being permanently opaque — the client wanted the mural running edge-to-edge behind the nav, which is also the classic luxury-hospitality pattern). How the pieces fit:

- `#site-header`'s base rule is transparent. The solid bar comes from `.nav-solid` (subpages render with it permanently via `partials.js` — their ink-on-ink content would scroll illegibly under a transparent header, which is why "always opaque" existed in the first place) or `.is-scrolled` (added by `main.js` past 80px on every page, fading the bar in over the hero on scroll).
- The hero scrim gained a **top-weighted gradient band** (`rgba(10,8,7,.66)` at the top edge, gone by 260px — sized in px against the fixed header, and ending above the crane's crown so the birds keep their full brightness). Strength was chosen from sampled mural pixels: the olive wallpaper behind the nav links needs ~0.53 combined darkness for the 13px links to clear 4.5:1.
- **The near-white magnolia petal at the right edge of the links row is unsolvable by gradient alone** — gold pill text over it needs ~0.83 combined darkness, which would read as a smudged dark bar. So the Reserve pill carries its own solid ink backing (`rgba(10,8,7,.7)`) pre-scroll, scoped in `home.css` under `#site-header:not(.is-scrolled)`; a filled pill is already part of the design language, so it reads as intentional. The nav links and hamburger get a subtle dark text-shadow/drop-shadow as edge insurance in the same scope. All of it hands off to the solid bar on scroll (the pill fill even animates out via the existing background transition).
- The logo keeps `mix-blend-mode: screen` in both states — over the gradient-darkened top band the backdrop is dark enough that screen-blend reads as rich gold rather than washing out (verified visually; the wash-out problem earlier in the project was over the *undarkened* bright mural).

This is a scoped exception, not a new site-wide direction — every other section, page, and component keeps the dark "Opulent Botanical Nocturne" treatment described above.

---

## Coming-Soon Links (temporary, pre-launch)

While a page isn't ready for visitors, every link/button pointing to it gets `class="is-coming-soon"` plus a `<span class="coming-soon-badge">Coming Soon</span>` child (see `globals.css`; `main.js` blocks the click and adds a 2.2s `.is-touched` state so tap devices get the same feedback as `:hover`). **Currently applied to: Menu, Reservations, Gallery, and About Us** — the nav, mobile overlay, and footer versions all live in `partials.js`, so the header/footer only ever need editing there. Real `href`s stay in the markup (direct URL access still works); un-gating a page when it launches is just deleting the class + badge span from its links.

Design decisions worth keeping:
- **Rest state is untouched** — links look normal and inviting until interacted with; a permanently greyed nav reads as broken, not curated.
- **On hover/tap the whole link greys** (`filter: grayscale(1) brightness(0.8)`) and the badge tooltip appears. Because a CSS filter paints the element's entire subtree, the badge inside the link is *inevitably* grayscaled with it — so the badge's authored colors (ivory text, mid-brass border on a near-black pill) are chosen for how they look **after** the filter: light-grey text with a visible grey outline, legible both over the bright hero mural and against the near-black mobile-nav overlay (where a dark pill alone vanishes). Don't "restore" it to brass-on-dark without re-checking the post-filter result.
- **The badge flips below the link inside `#nav-links`** (scoped override in `globals.css`) — in the desktop masthead the menu row sits directly beneath the wordmark, so an above-the-link tooltip lands on the logo. Everywhere else (footer, mobile overlay, in-page CTAs) it stays above. Note the specificity trap: the `#nav-links`-scoped rules out-rank the class-based visible-state rule, so the settled `transform` is restated at ID specificity there.
- **The mobile menu deliberately stays open** when a coming-soon link is tapped (`main.js` skips its close handler for them) — otherwise the overlay would dismiss before the feedback is seen.

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
