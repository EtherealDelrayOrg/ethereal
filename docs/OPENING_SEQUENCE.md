# Opening Sequence — Technical Plan

## Decisions

| Question | Answer |
|----------|--------|
| Plays on subpages? | **No** — only on main page (`/`) load |
| Replay on return visits? | **Yes** — plays every time the main page loads |
| What happens to the clock after? | **Disappears** — clean transition to site; no persistent clock in UI. A clock icon/logo may be used in nav depending on assets received from client. |
| Tech approach | **Hybrid** — AI-generated video + CSS/JS stitch. Priority: seamless join, must look great on mobile. |
| Mobile video | **Required** — video must be produced and served at portrait/square crop for mobile. Not a fallback — a first-class experience. |

---

## Concept (from client brief)

> A scene opens with a clock at center, birds surrounding it. The clock begins rotating counter-clockwise. The camera pushes forward and flies into the clock face. Inside the clock, the website content appears.

---

## The Core Technical Challenge

**Video and live web content cannot be composited in a browser.** A pre-rendered video clip cannot show the actual website "inside" the clock — the moment the camera enters the clock, it must transition to real HTML. This seam needs to be engineered deliberately.

---

## Architecture: Hybrid Video + Crossfade Transition

**Stitch method: crossfade.** The video and the site content fade simultaneously — video opacity goes 1→0 while site opacity goes 0→1 over the same ~1s window. The seam is invisible because both layers are visible at once during the overlap. This is more forgiving than a hard cut, especially on mobile where video frame timing can stutter.

### Playback phases

```
Phase 1 — AI Video  [0s → ~6s]
  Clock and birds rendered via AI video model
  Camera slowly pushes toward the clock face
  Video ends with the ornate clock center filling the full viewport
  Last frame: clock center detail filling screen (warm, not black)

Phase 2 — Crossfade  [~5.5s → ~7s]
  video opacity: 1 → 0  \
                          } simultaneously over ~1–1.5s CSS transition
  site opacity:  0 → 1  /
  Site is already fully rendered underneath — no load delay at this moment

Phase 3 — Website  [~7s onward]
  Full site visible, nav fades in
  Video element removed from DOM (no memory leak)
  User can scroll / interact normally
```

### JS implementation sketch

```js
video.addEventListener('timeupdate', () => {
  const remaining = video.duration - video.currentTime;
  if (remaining <= 1.5 && !crossfadeStarted) {
    crossfadeStarted = true;
    video.style.transition = 'opacity 1.4s ease';
    video.style.opacity = '0';
    siteContent.style.transition = 'opacity 1.4s ease';
    siteContent.style.opacity = '1';
  }
});

video.addEventListener('ended', () => {
  openingSequence.remove();
  siteContent.setAttribute('aria-hidden', 'false');
});
```

### Why crossfade
- Video and site are simultaneously visible — no hard cut to notice
- Works even if the video ends a frame early or late on mobile
- No requirement for the video's last frame to be pixel-perfect against the site bg

---

## AI Video Generation Plan

### Recommended Models (as of mid-2026)

| Model | Strength | Notes |
|-------|----------|-------|
| **Kling 1.6 / 2.0** | Slow camera motion, cinematic quality | Best for controlled push-in shots |
| **Runway Gen-4** | Good prompt adherence, fast | Strong on atmosphere/mood |
| **Hailuo (MiniMax)** | Detailed textures | Good for ornate close-up shots |
| **Sora** | High fidelity | Expensive; API access limited |

Recommend starting with **Kling** for the slow camera push, then upscale with **Topaz Video AI** if needed.

### What to generate

**Clip 1 — Wide establishing shot** (2–3s)
- Dark atmospheric space
- Clock centered, slightly below eye level
- Birds perched and in slow flight around clock
- Depth: slight fog/dust particles
- Camera: completely static or micro-drift

**Clip 2 — Push-in** (3–4s)
- Camera begins slow, accelerating push toward clock face
- Clock begins counter-clockwise rotation (slow at first, building)
- Birds react — flutter off as camera approaches
- Camera enters the clock face; final frame is the ornate center detail filling screen

> These two clips can be a single continuous generation or edited together in Premiere/Resolve.

### Prompt scaffold (Kling/Runway)

```
Cinematic establishing shot of an ornate antique clock suspended in deep atmospheric darkness,
surrounded by elegant cranes and peacocks with luminous gold and copper feathers.
The clock face is intricate brass and iron with gothic numerals.
Soft bokeh dust particles float through shafts of amber light.
Slow dolly push-in toward the clock face.
The clock begins a slow counter-clockwise rotation.
Birds take flight as the camera approaches.
Film grain, anamorphic lens, color grade: dark gold and shadow.
No text. No people. Photorealistic.
```

Adjust based on which model you use — Kling responds better to short, concrete sentences.

---

## Assets Required from Client

The following must be provided to generate the video and build the sequence:

| Asset | Format | Purpose |
|-------|--------|---------|
| Clock face illustration | PNG, 3000px+, transparent BG | Primary video subject + CSS overlay |
| Bird illustrations (peacock, crane) | PNG, transparent BG | Video subject + CSS birds on page |
| Brand logo | SVG or PNG | Nav, favicon |
| Brand color confirmation | Hex values | Final CSS tokens |
| Any existing brand video/motion references | Links or files | Style direction for AI video prompt |

---

## Video Technical Specs

| Spec | Value |
|------|-------|
| Resolution | 1920×1080 (16:9) |
| Duration | 6–8 seconds |
| Format | MP4 (H.264) primary + WebM (VP9) fallback |
| Target file size | Under 15MB after compression |
| Audio | None (the sequence is silent; ambient audio can be added later) |

Compression tool: **HandBrake** (free) or `ffmpeg`:
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 23 -preset slow -an output.mp4
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -an output.webm
```

---

## Mobile Behavior

Mobile is a first-class experience, not a fallback. iOS blocks autoplay with audio — the video must always be `muted` and `playsinline`, which is already the plan. File size is the main risk on mobile networks.

**Two video versions — required:**
- `opening-desktop.mp4/.webm` — 16:9, 1920×1080, served on screens ≥ 768px
- `opening-mobile.mp4/.webm` — 9:16 or 1:1 crop, 1080×1920 or 1080×1080, served on screens < 768px

The JS opening sequence logic will `matchMedia('(max-width: 767px)')` and swap the video `src` before playback starts. Both versions get the same CSS reveal transition at the end.

---

## Implementation Phases

1. [ ] Receive required assets from client
2. [ ] Generate AI video clips, edit into one sequence
3. [ ] Compress and optimize video files
4. [ ] Build HTML/CSS skeleton for the opening overlay
5. [ ] Implement video playback + transition JS logic
6. [ ] Implement mobile fallback
7. [ ] Test on Chrome, Safari (iOS/macOS), Firefox, Edge
8. [ ] Performance audit (Lighthouse)
