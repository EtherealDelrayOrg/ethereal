# Opening Sequence — Technical Plan

## Decisions

| Question | Answer |
|----------|--------|
| Plays on subpages? | **No** — only on main page (`/`) load |
| Replay on return visits? | **Yes** — plays every time the main page loads |
| What happens to the clock after? | **Disappears** — clean crossfade to site; no persistent clock in UI |
| Tech approach | AI-generated video (two jobs, reversed + spliced in post) + CSS crossfade into the hero |
| Mobile video | **Required**, first-class — separate 9:16 generation, not a cropped fallback |

---

## Concept

A painterly scene: an ornate antique clock (gold filigree hands, stained-glass mosaic center) floats
between a white crane and a peacock among magnolias. The hands spin **counter-clockwise** (time
rewinding) as the camera dollies in. The clock face unravels — its numeral panels part like flower
petals, no explosion — and the camera threads through the golden gear mechanism, arriving bright and
sharp on a backlit stained-glass rosette. A 1.4s crossfade carries this into the site hero (same
artwork family, so palette continuity is built in — see `opening-sequence.js` → `startCrossfade()`).

End-frame rosette is **intentionally different per device**:
- 16:9 (desktop) → rose-window tracery rosette
- 9:16 (mobile) → square-tesserae mosaic rosette

---

## Tools

- **Higgsfield "supercomputer"**, generating on **Seedance 2.0** — chosen because it anchors both the
  first *and* last frame of a generation, which the reversal pipeline below depends on.
- **Nano Banana Pro** for still/image edits (prepping the anchor frames).

---

## Key Constraint: Video Models Can't Render Counter-Clockwise

Direct prompting for counter-clockwise clock hand rotation fails repeatedly across models — there's a
strong clockwise training bias. Workaround: generate clockwise, reverse in post.

## Pipeline: Two Jobs Per Aspect Ratio

**Job 1 — "rewind plate"** (final timeline position: 0–6s)
- Static camera
- Hands spin clockwise fast, decelerating to a full stop
- Both first *and* last frame anchored to the master start still (same still — camera doesn't move)
- This clip gets **time-reversed** in post → hands read as counter-clockwise, any petal/dust drift
  reads as drifting upward (on-theme, not a visible tell)

**Job 2 — "push-in"** (final timeline position: 6–10s)
- First frame = master start still (same anchor as Job 1)
- Last frame = the rosette still (16:9 tracery / 9:16 mosaic, per device)
- Hands are an unreadable blur during the push (masks any residual rotation-direction artifact)
- Numeral panels unravel like petals; camera threads through the gear mechanism
- Ends mid-drift, bright — **no fade to black**

**Splice point:** Job 1 reversed ends on the exact master frame Job 2 starts on → invisible cut when
concatenated. Reverse → trim → concat → encode is done via `ffmpeg`.

```bash
# 1. Reverse Job 1 (rewind plate)
ffmpeg -i job1-rewind.mp4 -vf reverse -af areverse job1-reversed.mp4

# 2. Concat (requires matching codec/resolution/fps — re-encode first if they differ)
ffmpeg -f concat -safe 0 -i concat-list.txt -c copy opening-master.mp4
# concat-list.txt:
#   file 'job1-reversed.mp4'
#   file 'job2-pushin.mp4'

# 3. Encode final deliverables
ffmpeg -i opening-master.mp4 -vcodec libx264 -crf 20 -preset slow -an opening-desktop.mp4   # target ~4–5MB
ffmpeg -i opening-master.mp4 -c:v libvpx-vp9  -crf 32 -b:v 0    -an opening-desktop.webm
ffmpeg -i opening-master-mobile.mp4 -vcodec libx264 -crf 22 -preset slow -an opening-mobile.mp4  # target ~2–3MB
ffmpeg -i opening-master-mobile.mp4 -c:v libvpx-vp9  -crf 34 -b:v 0    -an opening-mobile.webm

# 4. Poster images (from the master start stills, not extracted frames — cleaner)
# desktop-start-still.png → opening-desktop-poster.jpg
# mobile-start-still.png  → opening-mobile-poster.jpg
```

Run this per aspect ratio (16:9 desktop, 9:16 mobile) — four source clips in, two deliverable pairs out.

---

## Stitch Into Site: Crossfade

**Stitch method: crossfade.** Video opacity 1→0 while site content opacity 0→1 over the same ~1.4s
window (`CROSSFADE_DURATION` in `opening-sequence.js`). Both layers visible during the overlap, so
the seam is forgiving of a frame early/late — important on mobile where video timing can stutter.

Implemented (dev `de2de55`, `42469dc`, `faaebd6`): `startCrossfade()` in
[`src/js/opening-sequence.js`](../src/js/opening-sequence.js) fires the fog + bloom bridge (below),
fades `#opening-sequence` out, and fades `#site-content` in — which simultaneously gates the hero's
entrance cascade and kicks the `hero-bg` 1→1.04 scale drift, so the video's push-in momentum carries
across the seam into the hero. Nav (`#site-header`) is revealed in the same tick.

**Fog + bloom bridge (desktop only)** — two layered atmosphere effects at the crossfade moment
instead of a flat color fade:
- `#seq-fog` — [Vanta.js FOG](https://www.vantajs.com/?effect=fog) (Three.js r134 + `vanta.fog.min.js`
  0.5.24, loaded off CDN, desktop-only so mobile never downloads it). Warm amber/brass drifting mist,
  composited via `mix-blend-mode: screen` over a near-black `baseColor` so only the light mist glows
  through rather than a visible canvas box. **Pre-warmed on page load** (created immediately, hidden
  at `opacity: 0`, already rendering) rather than at crossfade time — a cold WebGL context/shader
  compile is slow enough to stutter if triggered at the one moment this has to look instant. Purely a
  progressive enhancement: if the CDN is slow/blocked, `fogEffect` stays `null` and the bloom-only
  crossfade below is already a complete transition on its own — nothing waits on it, nothing breaks
  without it. Destroyed (`fogEffect.destroy()`) and removed from the DOM after the crossfade tail, same
  timing as the bloom's cleanup, so the WebGL context doesn't linger.
- `.seq-bloom` — the original warm radial-gradient light swell, sits above the fog in z-index so it
  still reads as "passing through light."

**Gotcha found building this:** the `pause` event safety-net on the `<video>` element (added so a
tab-backgrounded mid-play pause doesn't strand the user on a frozen frame) was firing on the *initial*
blocked-autoplay attempt too — Chrome/WebKit dispatch a real `pause` event as part of rejecting
`video.play()`, not just a rejected promise. That raced ahead of the `.catch()` → fallback-timer path
and skipped straight to `startCrossfade()` in ~30ms instead of waiting the intended ~3s, in any
environment where autoplay gets blocked (this preview pane always blocks it — see gotcha below — but
it's not pane-specific). Fixed with a `videoStarted` flag set only inside `video.play().then()`, so the
pause listener only acts on a genuine mid-stream interruption.

**Gotcha (pane-specific):** the in-app preview browser reports `document.hidden: true` /
`document.visibilityState: 'hidden'` even when actively navigated to and screenshotted, which triggers
Chrome's "video-only background media paused to save power" intervention — `<video>` autoplay is
always rejected here, and CSS animation clocks freeze (rAF never fires) for the same reason. Not a real
bug; verify end-of-sequence state programmatically (`video.currentTime`, `video.ended`, computed
opacity, `canvas` element presence for the fog) rather than trusting a screenshot, and don't be alarmed
when the fallback-timer path is what actually runs in this pane.

---

## Video Technical Specs

| Spec | Value |
|------|-------|
| Desktop resolution | 1920×1080 (16:9) |
| Mobile resolution | 1080×1920 (9:16) |
| Duration | ~10s per aspect ratio (6s rewind + 4s push-in, post-splice) |
| Format | MP4 (H.264) primary + WebM (VP9) fallback |
| Target file size | Desktop ~4–5MB, Mobile ~2–3MB |
| Audio | None |
| Output location | `src/assets/video/opening-desktop.{mp4,webm}`, `src/assets/video/opening-mobile.{mp4,webm}`, plus poster JPGs |

---

## Assets

**Desktop (16:9) — DONE.** Delivered as a single pre-reversed, pre-spliced 10.04s master
(clockwise-generated rewind plate reversed + push-in spliced, already assembled before handoff —
the two-job/ffmpeg-splice step below wasn't needed for this one, only re-encode). Archived at
`_reference/video/opening-desktop-master.mp4` (26.5MB source). Encoded deliverables in
`src/assets/video/`: `opening-desktop.mp4` (4.2MB, H.264 CRF 25), `opening-desktop.webm` (3.9MB,
VP9 CRF 34), `opening-desktop-poster.jpg` (extracted first frame). Hand-rotation direction verified
correct (counter-clockwise) by frame sampling.

**Mobile (9:16) — NOT YET PRODUCED.** Site currently falls back to the CSS clock placeholder on
mobile viewports (`<768px`) until this clip exists. See `_reference/images/` for the older approved-stills
list (transparent gold-hands clock PNG, 16:9/9:16 start frames, 16:9/9:16 rosette end frames) — the
9:16 pair from that list is still what's needed to produce the mobile clip via the two-job pipeline.

---

## Implementation Phases

1. [x] Site-side crossfade/hero-handoff wiring (dev `de2de55`)
2. [x] Desktop video: receive, verify direction, archive master, encode deliverables, wire into
   `index.html` / `opening-sequence.css` / `opening-sequence.js` (full-bleed `<video>`, matchMedia-gated
   to desktop, crossfade driven off `timeupdate`, graceful fallback to CSS clock if autoplay is blocked
   or the tab is backgrounded mid-play)
3. [ ] Generate mobile (9:16) Job 1 (rewind plate) + Job 2 (push-in) via Higgsfield/Seedance 2.0
4. [ ] Reverse Job 1, splice with Job 2, encode mobile deliverables (`ffmpeg`, see pipeline above)
5. [ ] Generate mobile poster image
6. [ ] Extend `opening-sequence.js` matchMedia gate to also play video on mobile once the clip exists
7. [ ] Test on Chrome, Safari (iOS/macOS), Firefox, Edge — verify programmatically, not just by eye
   (in-app preview browsers can report `document.hidden: true` and block autoplay — not a real bug,
   confirm on an actual foreground browser tab before treating it as one)
8. [ ] Performance audit (Lighthouse)
