# PRE_DEV_RESOURCES — Ethereal Clock Project

## Project Purpose

**Ethereal** is a luxury brand web experience built around an animated, interactive clock that serves as the entry point to a navigation menu. The core concept: a dark, atmospheric landing page featuring a steampunk-styled mechanical clock face — clicking it triggers a cinematic "door open" animation, releases a flock of illustrated birds, and reveals a circular navigation menu. The aesthetic is dark, gothic-elegant with a gold/copper/brass palette, twinkling stars, floating dust particles, and rotating gear rings. The brand tagline is *"where time breathes."*

This is front-end only — HTML, CSS, and vanilla JavaScript. No framework, no build tool, no back-end.

---

## File Inventory

### HTML — Iteration History

The project went through multiple self-contained single-file iterations before being split into separate concerns.

| File | Lines | Notes |
|------|-------|-------|
| `ethereal-clock.html` | 922 | **Earliest complete prototype.** Everything inline (CSS + JS). Gold palette, CSS-drawn gear rings, SVG-less clock face with DOM-rendered numerals, CSS-only hands. Menu uses emoji birds (🦚 🦢). |
| `ethereal-clock_1.html` | 1023 | **First major upgrade.** Still monolithic. Adds detailed SVG peacock and crane bird illustrations generated via JavaScript at runtime. Birds burst from the clock on open. |
| `ethereal-clock_2.html` | 1212 | **Steampunk rework.** Shifts palette to copper/brass/iron tones. Adds: steam puff animation above clock, pipe connector decorations, SVG-drawn corner gears (with teeth and spokes), inner gear system that fades in on hover. Bezel gains multi-layer `box-shadow` rings instead of a plain border. |
| `ethereal-clock_3.html` | 1226 | **Refinement pass.** Near-identical to `_2` — likely a polished save with minor tweaks. |
| `ethereal-clock_4.html` | 262 | **Separation of concerns — skeleton only.** HTML structure with no inline CSS or JS. References `ethereal-clock.css` via `<link>` tag. Intended to companion a separate `.js` file (not yet present in the folder). |
| `ethereal-clock (1).html` | 1270 | Appears to be a duplicate/export of `_2` or `_3` — same large monolithic file. |
| `ethereal-clock (2).html` | 1270 | Identical line count to `(1)` — likely the same snapshot. |
| `ethereal-clock (3).html` | 1270 | Same. Possibly macOS auto-copies created on drag-duplicate. |

### CSS

| File | Lines | Notes |
|------|-------|-------|
| `ethereal-clock.css` | 597 | **Extracted stylesheet** intended for use with `_4.html` and future refactored versions. Contains the full steampunk design system: CSS custom properties (gold, copper, brass, iron palette), all animation keyframes (stars, dust, gear rings, steam, door open, gear burst, light burst), clock face layers, menu overlay, and extensively commented explanations of every rule. |

### Reference Images

These appear to be design references and asset candidates used to guide the visual direction.

| File | Size | Description |
|------|------|-------------|
| `clock face.JPG` | ~273 KB | Physical antique clock face — the primary design reference. |
| `clock face-1.JPG` | ~273 KB | Same or similar reference clock, alternate shot. |
| `clock face-2.JPG` | ~273 KB | Variant angle/lighting of reference clock. |
| `clock face-3.JPG` | ~273 KB | Variant. |
| `clock face-4.JPG` | ~273 KB | Variant. |
| `clock face-5.JPG` | ~273 KB | Variant. |
| `ethereal-clock-hands.PNG` | 2.3 MB | High-res render of a clock showing the hands — likely an asset extraction or mockup with hands isolated. |
| `ethereal-clock-nohands.PNG` | 2.1 MB | Same clock face render without hands — intended as a background layer for the digital clock face. |
| `ethereal-background-noname.png.png` | 1.9 MB | Brand background graphic, no name/text overlay — likely a textured atmospheric background for the page. |
| `image0.jpeg` | 535 KB | Additional reference image (provenance unclear — possibly brand mood board). |
| `image0 (1).png` | 2.1 MB | Likely the same reference as `image0.jpeg` in PNG form. |

---

## Architecture Evolution Summary

```
Phase 1 — Prototype
  ethereal-clock.html          (all-in-one, gold, CSS gears, emoji birds)

Phase 2 — Enhanced Prototype
  ethereal-clock_1.html        (SVG bird illustrations added)

Phase 3 — Steampunk Redesign
  ethereal-clock_2.html        (copper/brass palette, pipes, steam, SVG gears)
  ethereal-clock_3.html        (minor refinement)
  ethereal-clock (1–3).html    (duplicates of phase 3)

Phase 4 — Refactor / Separation
  ethereal-clock_4.html        (HTML skeleton only, links to CSS)
  ethereal-clock.css           (extracted stylesheet with full steampunk system)
  [ethereal-clock.js]          (NOT YET CREATED — next step)
```

---

## Key Design System (from CSS)

- **Palette:** `--gold` `#c9a84c`, `--copper` `#b87333`, `--bg` `#080706`, `--cream` `#f5ead8`
- **Fonts:** Cinzel (engraved Roman caps) + Cormorant Garamond (elegant italic) — both from Google Fonts
- **Animations:** twinkle (stars), floatDust (embers), rotateCW (gears), steamPuff, doorOpen (3D Y-axis swing), gearBurst (14 flying gears on open), birdFly (SVG peacocks + cranes), burst (full-screen light flash)
- **Interaction flow:** hover → inner gears appear → click → door swings open → light burst → birds fly out → menu fades in

---

## What Still Needs to Be Built

Based on the current state, the logical next steps are:

1. **`ethereal-clock.js`** — extract all JavaScript from the monolithic files into a companion script for `_4.html`
2. **Actual page routes** — the menu has 5 links (Our Story, Collections, Atelier, Rituals, Contact) all pointing to `#`
3. **Background image integration** — the PNG assets (`ethereal-clock-nohands.PNG`, `ethereal-background-noname.png.png`) have not been wired into any HTML yet
4. **Mobile responsiveness** — the clock is fixed at 500×500px with no responsive breakpoints
5. **Accessibility** — no ARIA labels, keyboard navigation, or reduced-motion support
