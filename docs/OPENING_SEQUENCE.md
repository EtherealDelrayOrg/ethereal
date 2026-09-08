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

# 3. Encode the shipping files — ALWAYS from the masters in _reference/video/,
#    never by re-compressing a file that already ships (artefacts stack).
#    CRFs below are the measured settings actually in production.

# AV1 — smallest AND highest fidelity; first source in the list
ffmpeg -i opening-desktop-master.mp4 -c:v libsvtav1 -crf 48 -preset 6 -g 240 \
       -pix_fmt yuv420p -an -movflags +faststart opening-desktop-av1.mp4   # 1.87 MB
ffmpeg -i opening-mobile-master.mp4  -c:v libsvtav1 -crf 48 -preset 6 -g 240 \
       -pix_fmt yuv420p -an -movflags +faststart opening-mobile-av1.mp4    # 1.53 MB

# VP9 — middle fallback for browsers with VP9 but no AV1
ffmpeg -i opening-desktop-master.mp4 -c:v libvpx-vp9 -crf 44 -b:v 0 -row-mt 1 -an opening-desktop.webm  # 2.63 MB
ffmpeg -i opening-mobile-master.mp4  -c:v libvpx-vp9 -crf 44 -b:v 0 -row-mt 1 -an opening-mobile.webm   # 2.36 MB

# h264 — final fallback. ALREADY OPTIMAL: a fresh CRF sweep reproduced the shipping
# desktop file byte-for-byte in size and SSIM at CRF28. Do not "improve" these.
ffmpeg -i opening-desktop-master.mp4 -c:v libx264 -crf 28 -preset slow -an opening-desktop.mp4  # 3.67 MB
ffmpeg -i opening-mobile-master.mp4  -c:v libx264 -crf 28 -preset slow -an opening-mobile.mp4   # 2.71 MB

# 4. Posters — WebP q68, extracted from the master first frame
```

### Measured quality (SSIM vs the 74/69 MB masters)

| | desktop | mobile |
|---|---|---|
| AV1 CRF48 | **1.87 MB · 0.955** | **1.53 MB · 0.963** |
| VP9 webm CRF44 | 2.63 MB · 0.891 | 2.36 MB · 0.919 |
| h264 CRF28 | 3.67 MB · 0.957 | 2.71 MB · 0.959 |

AV1 is smaller *and* closer to the master than either alternative — not a trade. Note the
VP9 webm is markedly the **worst** of the three; before AV1 shipped, Chrome and Firefox
users were getting the poorest encode on the site.

### The source order and why the codec string matters

`opening-sequence.js` appends three `<source>` elements, smallest first:

```
1. *-av1.mp4   type='video/mp4; codecs="av01.0.08M.08"'
2. *.webm      type='video/webm'
3. *.mp4       type='video/mp4'
```

**That `codecs=` parameter is load-bearing.** Declared as plain `video/mp4`, the AV1 file
would *match* in browsers that support MP4 but not AV1 (older Safari) — they would select
it, fail to decode, and never reach the h264 fallback below. The full string makes them
skip it instead.

Derive the level from the encode with `ffprobe`, do not guess: the bare string `av01`
reports `"no"` from `canPlayType`, while `av01.0.08M.08` reports `"probably"`.

**Who actually gets AV1:** Chrome, Edge, Firefox, Android — and Safari only with hardware
decode, meaning iPhone 15 Pro / M3 and newer. GA4 shows iOS at ~80% of this site's users,
so most visitors still receive the h264 file. Keep the webm: without it, a VP9-but-no-AV1
browser drops all the way to the largest file.

Run this per aspect ratio (16:9 desktop, 9:16 mobile) — four source clips in, two deliverable pairs out.

---

## Stitch Into Site: Crossfade

**Stitch method: crossfade.** Video opacity 1→0 while site content opacity 0→1 over the same ~1.4s
window (`CROSSFADE_DURATION` in `opening-sequence.js`). Both layers visible during the overlap, so
the seam is forgiving of a frame early/late — important on mobile where video timing can stutter.

Implemented (dev `de2de55`, `42469dc`, `faaebd6`, reworked in `cf1db3d` + `596e4a7`):
`startCrossfade()` in [`src/js/opening-sequence.js`](../src/js/opening-sequence.js) fires the fog +
bloom bridge (below), fades `#opening-sequence` out, and fades `#site-content` in — which
simultaneously gates the hero's entrance cascade and kicks the `hero-bg` 1→1.04 scale drift, so the
video's push-in momentum carries across the seam into the hero. Nav (`#site-header`) is revealed in
the same tick.

**Fog + bloom bridge (desktop only)** — layered atmosphere at the crossfade instead of a flat color
fade:
- `#seq-fog` — [Vanta.js FOG](https://www.vantajs.com/?effect=fog) (Three.js r134 + `vanta.fog.min.js`
  0.5.24, loaded off CDN, desktop-only so mobile never downloads it). Composited via
  `mix-blend-mode: screen` over a near-black `baseColor` so only the lit mist glows through rather
  than a visible canvas box. Purely a progressive enhancement: if the CDN is slow/blocked,
  `fogEffect` stays `null` and the bloom-only crossfade is already a complete transition on its own.

  **Three-phase choreography** (`cf1db3d` — the original single 420ms half-opacity swell was gone by
  the crossfade's midpoint, exactly when the seam is hardest to hide):
  1. *Rise* (`is-rising`, from `FOG_RISE_LEAD` = 2.6s before video end): mist creeps up **inside** the
     video's final approach to opacity 0.35 over 1100ms, so the handoff is anticipated rather than
     the fog popping in at the cut.
  2. *Peak* (`is-active`, at crossfade): swells to 0.85 in 400ms and holds `FOG_PEAK_HOLD` = 500ms —
     the actual video→hero handoff happens behind near-full mist cover.
  3. *Dissolve* (class removed): 1700ms (`FOG_DISSOLVE`), deliberately outliving the 1.4s crossfade so
     the hero is revealed through thinning fog rather than a hard edge.

  **Dynamic color arc:** the video ends on the teal/gold stained-glass rosette; the hero rests in
  candlelight brass. The fog starts in rosette colors (`FOG_SEAM_COLORS`, incl. `--mosaic-teal`) and
  during the dissolve `warmFogColors()` lerps the shader's color uniforms per-frame (smoothstep,
  rAF) to `FOG_SETTLE_COLORS` — Vanta has no color-animation API, so its `Vector3` uniforms
  (`highlightColor` etc., normalized RGB in x/y/z) are mutated directly. The mist itself carries the
  palette across the seam and warms as it thins.

  **Dormant pre-warm** (`596e4a7` — the fix for fog-induced video lag): the original pre-warm
  (full-size init at page load, rendering every frame while invisible) competed with video decode for
  the whole 10s and its full-viewport WebGL init landed as a visible stutter ~1s into playback. Now
  `initFog()` runs in a **2px container** (context + shader compile still paid up front, ~20ms,
  canvas clamped to the 200px minimum instead of full viewport) and the render loop is **cancelled
  immediately** (`cancelAnimationFrame(fogEffect.req)`). `wakeFog()` restores full-bleed size
  (`resize()`, ~1–3ms) and restarts the loop (`animationLoop()`) at the rise trigger, where the first
  full-res frame hides behind the 1100ms fade-in from opacity 0. `startCrossfade()` also calls
  `wakeFog()` defensively for the fallback/skip paths. Teardown (destroy + DOM removal) happens after
  the full dissolve tail (`FOG_PEAK_HOLD + FOG_DISSOLVE − CROSSFADE_DURATION + 300` after reveal),
  and cancels any in-flight color lerp.
- `.seq-bloom` — the original warm radial-gradient light swell, sits above the fog in z-index so it
  still reads as "passing through light." Unchanged timing (fast 320ms swell, 1150ms dissolve).

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

**Desktop (16:9) — DONE (revised Jul 2026, `iterate2.mp4`).** Delivered as a single pre-reversed,
pre-spliced 10.04s master, already assembled before handoff — the two-job/ffmpeg-splice step wasn't
needed client-side, only re-encode. Archived at `_reference/video/opening-desktop-master.mp4` (78MB
source — this replaced the original 26.5MB master from the first iteration). Encoded deliverables in
`src/assets/video/`: `opening-desktop.mp4` (4.4MB, H.264 CRF 27), `opening-desktop.webm` (4.0MB,
VP9 CRF 40), `opening-desktop-poster.jpg`. Hand-rotation direction re-verified correct
(counter-clockwise) by frame sampling — checked at three well-separated timestamps at full crop
resolution after an initial pixel-centroid-angle approach proved too noisy (camera zoom + imprecise
crop centering threw it off; direct visual reads at full resolution were the reliable method).

**Mobile (9:16) — DONE (Jul 2026, `vertical_v1.mp4`).** Same treatment: archived at
`_reference/video/opening-mobile-master.mp4` (72.6MB source, 10.04s). Encoded to
`opening-mobile.mp4` (2.85MB, H.264 CRF 29), `opening-mobile.webm` (2.4MB, VP9 CRF 42),
`opening-mobile-poster.jpg`. Direction verified correct the same way. `opening-sequence.js` now
plays a video on *every* viewport size — matchMedia picks the source/poster pair
(`opening-desktop*` vs `opening-mobile*`) — with the CSS clock reserved purely as the
autoplay-blocked/load-failure fallback on either size, not a mobile-specific placeholder anymore.

---

## Implementation Phases

1. [x] Site-side crossfade/hero-handoff wiring (dev `de2de55`)
2. [x] Desktop video: receive, verify direction, archive master, encode deliverables, wire into
   `index.html` / `opening-sequence.css` / `opening-sequence.js` (full-bleed `<video>`, matchMedia-gated
   to desktop, crossfade driven off `timeupdate`, graceful fallback to CSS clock if autoplay is blocked
   or the tab is backgrounded mid-play)
3. [x] Mobile video: receive (`vertical_v1.mp4`, already reversed/spliced), verify direction, archive
   master, encode deliverables, generate poster
4. [x] Extend `opening-sequence.js` matchMedia gate to play a video on every viewport size — desktop
   and mobile each get their own source/poster pair, CSS clock is now purely the failure fallback
5. [ ] Test on Chrome, Safari (iOS/macOS), Firefox, Edge — verify programmatically, not just by eye
   (in-app preview browsers can report `document.hidden: true` and block autoplay — not a real bug,
   confirm on an actual foreground browser tab before treating it as one)
6. [ ] Performance audit (Lighthouse)
