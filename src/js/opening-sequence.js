/* ============================================================
   OPENING SEQUENCE
   Full-bleed AI video on both desktop and mobile (separate 16:9/9:16
   sources), crossfade timed off video playback. Video-load/autoplay
   failure: CSS clock placeholder on a fixed timer, either viewport
   size. Both paths converge on the same startCrossfade().
   ============================================================ */

(function () {
  'use strict';

  const SEQUENCE_DURATION = 3000; // ms — fallback-path time before crossfade starts
  const CROSSFADE_DURATION = 1400; // ms — must match CSS transition
  const VIDEO_CROSSFADE_LEAD = 1.4; // s — start crossfade this long before video ends
  const FOG_RISE_LEAD = 2.6;        // s — mist starts creeping up inside the video this
                                    //     long before it ends (must be > CROSSFADE_LEAD)
  const FOG_PEAK_HOLD = 500;        // ms — full-cover dwell at the seam before dissolve
  const FOG_DISSOLVE = 1700;        // ms — must match #seq-fog's default CSS transition

  // Fog color arc — the video ends on the backlit stained-glass rosette (teal
  // mosaic in gold), the hero rests in warm candlelight. The mist carries one
  // into the other: rosette colors while rising/at the seam, warming to brass
  // as it dissolves. Teal is --mosaic-teal, brass tones are the site tokens.
  const FOG_SEAM_COLORS   = { highlight: 0xf2d08a, midtone: 0x4f8a88, lowlight: 0x2d5a54 };
  const FOG_SETTLE_COLORS = { highlight: 0xe0a85a, midtone: 0xc49140, lowlight: 0x8a6428 };

  const seq          = document.getElementById('opening-sequence');
  const content       = document.getElementById('site-content');
  const header        = document.getElementById('site-header');
  const skipBtn       = document.querySelector('.seq-skip');
  const progressBar   = document.querySelector('.seq-progress');
  const progress      = document.querySelector('.seq-progress-fill');
  const brand         = document.querySelector('.seq-brand');
  const bloom         = document.getElementById('seq-bloom');
  const fogEl         = document.getElementById('seq-fog');
  const video         = document.getElementById('opening-video');
  const clockFallback = document.getElementById('seq-clock-fallback');
  let fogEffect = null;

  if (!seq || !content) return;

  // Locked for the sequence's full duration (video or fallback-clock path
  // alike), not just while the video itself is playing — site-content stays
  // aria-hidden underneath until reveal, so nothing back there should be
  // scrollable in the meantime either. revealSite() below is the single
  // unlock point every path converges on. See main.js for the touchmove
  // guard that makes this actually hold on iOS.
  document.body.classList.add('is-scroll-locked');

  // ── Accessibility: skip if user prefers reduced motion ────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSite();
    return;
  }

  let autoTimer = null;
  let crossfadeStarted = false;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;

  // The fallback clock's <img> ships with data-src instead of src so the common
  // video path never downloads it (see index.html). Every path that actually
  // puts the clock on screen goes through here first. Idempotent: promoting an
  // already-promoted src is a no-op, so callers don't need to coordinate.
  function showClockFallback() {
    if (clockFallback) {
      const img = clockFallback.querySelector('img[data-src]');
      if (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      clockFallback.style.display = '';
    }
    if (brand) brand.style.display = '';
    if (progressBar) progressBar.style.display = '';
  }

  if (video) {
    playVideoSequence();
  } else {
    showClockFallback();
    startFallbackTimer();
  }

  // ── Fog bridge: desktop only, loaded off the CDN in parallel with everything
  // else above so Three.js/Vanta never costs mobile a byte. Purely a progressive
  // enhancement on top of the bloom — if the CDN is slow, blocked, or errors,
  // fogEffect just stays null and startCrossfade()'s bloom-only path is already
  // a complete, intentional-looking transition on its own. ─────────────────────
  if (fogEl && isDesktop) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      .then(() => loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.fog.min.js'))
      .then(initFog)
      .catch(() => {});
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Pre-warm, but dormant: the expensive parts of WebGL init (context creation,
  // shader compile) are paid up front at page load — in a 2px container, so no
  // full-viewport framebuffer is allocated (~20ms vs a visible hitch) — and the
  // render loop is halted immediately after. A hidden fog rendering the whole
  // viewport every frame for the video's full 10s is pure GPU/decode competition
  // (it was showing up as video lag); wakeFog() below resizes to full-bleed and
  // restarts the loop only when the mist is actually about to be seen.
  let fogAwake = false;
  function initFog() {
    if (!fogEl || !window.VANTA || crossfadeStarted) return;
    fogEl.style.width = '2px';
    fogEl.style.height = '2px';
    fogEffect = VANTA.FOG({
      el: fogEl,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      // Starts in seam colors — the fog is first seen rising inside the
      // video's rosette approach; the warm-up happens during the dissolve.
      highlightColor: FOG_SEAM_COLORS.highlight,
      midtoneColor: FOG_SEAM_COLORS.midtone,
      lowlightColor: FOG_SEAM_COLORS.lowlight,
      baseColor: 0x0a0807,
      blurFactor: 0.7,
      speed: 1.4,
      zoom: 1
    });
    if (typeof fogEffect.req === 'number') cancelAnimationFrame(fogEffect.req);
  }

  // Bring the dormant fog to full-bleed and restart its render loop. Called at
  // the rise trigger (2.6s before video end) — the resize (~3ms) and first
  // full-res frame land behind the 1100ms opacity ease-in from 0, so any
  // dropped frame here is invisible, unlike at page load where it fought the
  // video's own startup.
  function wakeFog() {
    if (!fogEffect || fogAwake) return;
    fogAwake = true;
    fogEl.style.width = '';
    fogEl.style.height = '';
    if (typeof fogEffect.resize === 'function') fogEffect.resize();
    if (typeof fogEffect.animationLoop === 'function') fogEffect.animationLoop();
  }

  // Drives the seam→settle color drift by mutating the fog shader's color
  // uniforms (Vector3, normalized RGB) per frame — Vanta has no built-in color
  // animation. Runs over the dissolve window so the mist visibly warms from
  // stained-glass teal/gold to candlelight brass as it thins out.
  let fogLerpFrame = null;
  function warmFogColors(duration) {
    if (!fogEffect || !fogEffect.uniforms) return;
    const chan = (hex) => [(hex >> 16 & 255) / 255, (hex >> 8 & 255) / 255, (hex & 255) / 255];
    const pairs = [
      { u: fogEffect.uniforms.highlightColor, from: chan(FOG_SEAM_COLORS.highlight), to: chan(FOG_SETTLE_COLORS.highlight) },
      { u: fogEffect.uniforms.midtoneColor,   from: chan(FOG_SEAM_COLORS.midtone),   to: chan(FOG_SETTLE_COLORS.midtone) },
      { u: fogEffect.uniforms.lowlightColor,  from: chan(FOG_SEAM_COLORS.lowlight),  to: chan(FOG_SETTLE_COLORS.lowlight) }
    ];
    const t0 = performance.now();
    function step(now) {
      if (!fogEffect) return; // destroyed mid-drift — stop quietly
      const raw = Math.min((now - t0) / duration, 1);
      const t = raw * raw * (3 - 2 * raw); // smoothstep
      pairs.forEach(p => p.u.value.set(
        p.from[0] + (p.to[0] - p.from[0]) * t,
        p.from[1] + (p.to[1] - p.from[1]) * t,
        p.from[2] + (p.to[2] - p.from[2]) * t
      ));
      if (raw < 1) fogLerpFrame = requestAnimationFrame(step);
    }
    fogLerpFrame = requestAnimationFrame(step);
  }

  // ── Skip button ───────────────────────────────────────────
  if (skipBtn) {
    skipBtn.addEventListener('click', skip);
    skipBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        skip();
      }
    });
  }

  function skip() {
    if (autoTimer) clearTimeout(autoTimer);
    startCrossfade();
  }

  // ── Fallback path: CSS clock on a fixed timer ──────────────
  function startFallbackTimer() {
    if (progress) {
      progress.style.transitionDuration = SEQUENCE_DURATION + 'ms';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.width = '100%';
        });
      });
    }
    autoTimer = setTimeout(startCrossfade, SEQUENCE_DURATION);
  }

  // ── Video path: desktop and mobile each get their own clip ──
  // Tagline and progress bar are dropped here — they read as clutter over
  // the video's own full-bleed art; the fallback CSS-clock path still shows
  // them since that placeholder needs the loading cue.
  function playVideoSequence() {
    if (clockFallback) clockFallback.style.display = 'none';
    if (brand) brand.style.display = 'none';
    if (progressBar) progressBar.style.display = 'none';

    const src = isDesktop ? '/src/assets/video/opening-desktop' : '/src/assets/video/opening-mobile';
    video.poster = src + '-poster.webp';
    const webm = document.createElement('source');
    webm.src = src + '.webm'; webm.type = 'video/webm';
    const mp4 = document.createElement('source');
    mp4.src = src + '.mp4'; mp4.type = 'video/mp4';
    video.appendChild(webm);
    video.appendChild(mp4);
    video.muted = true;
    video.defaultMuted = true;

    // Gates the pause safety-net below so it only fires for a genuine mid-stream
    // interruption after playback truly began. Without this, a blocked-autoplay
    // rejection — which Chrome/WebKit dispatch as a real 'pause' event, not just
    // a rejected promise — races the .catch() below and fires the safety net
    // first, skipping the intended fallback-timer duration almost instantly.
    let videoStarted = false;

    video.addEventListener('timeupdate', () => {
      if (crossfadeStarted || !video.duration) return;
      const remaining = video.duration - video.currentTime;
      // Mist creeps up inside the video's final approach, so the handoff is
      // anticipated instead of the fog popping in from nothing at the cut.
      if (remaining <= FOG_RISE_LEAD && fogEffect && fogEl &&
          !fogEl.classList.contains('is-rising')) {
        wakeFog();
        fogEl.classList.add('is-rising');
      }
      if (remaining <= VIDEO_CROSSFADE_LEAD) {
        startCrossfade();
      }
    });
    video.addEventListener('ended', () => {
      if (!crossfadeStarted) startCrossfade();
    });
    // Safety net: if playback starts but the browser later pauses it mid-stream
    // (e.g. tab backgrounded), don't strand the user on a frozen frame
    video.addEventListener('pause', () => {
      if (videoStarted && !crossfadeStarted && !video.ended) startCrossfade();
    });

    video.play().then(() => {
      videoStarted = true;
      video.classList.add('is-active');
    }).catch(() => {
      // Autoplay blocked or clip failed to load — fall back to the static clock.
      // This is where its image is actually fetched; until now it cost nothing.
      video.classList.remove('is-active');
      showClockFallback();
      startFallbackTimer();
    });
  }

  function startCrossfade() {
    if (crossfadeStarted) return;
    crossfadeStarted = true;
    seq.classList.add('is-fading');
    // .is-visible does triple duty (all keyed to this same moment so the blend
    // reads as one motion): fades the site in, starts the hero entrance cascade
    // (home.css gates the heroFadeUp animations on it), and kicks the hero
    // background's slow 1 → 1.04 drift that carries the video's push-in
    // direction across the seam.
    content.classList.add('is-visible');
    // Fog bridge: swell from the rise level to near-full cover for the seam
    // itself, hold a beat so the video→hero handoff happens behind the mist,
    // then release into the long dissolve — which is when the colors warm from
    // rosette teal/gold to hero candlelight (warmFogColors runs over the same
    // window, so the drift is felt as the mist thins).
    if (fogEl && fogEffect) {
      wakeFog(); // no-op if the rise already woke it; covers fallback/skip paths
      fogEl.classList.remove('is-rising');
      fogEl.classList.add('is-active');
      setTimeout(() => {
        fogEl.classList.remove('is-active');
        warmFogColors(FOG_DISSOLVE);
      }, FOG_PEAK_HOLD);
    }
    // Light-bloom bridge: fast swell, then the slow dissolve runs over the
    // crossfade window (asymmetric transition speeds live in the CSS).
    if (bloom) {
      bloom.classList.add('is-active');
      setTimeout(() => bloom.classList.remove('is-active'), 420);
    }
    // Reveal nav
    if (header) {
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
    setTimeout(() => {
      revealSite();
    }, CROSSFADE_DURATION);
  }

  function revealSite() {
    document.body.classList.remove('is-scroll-locked');
    // Remove seq from DOM entirely to free memory
    if (seq && seq.parentNode) seq.parentNode.removeChild(seq);
    // Bloom's dissolve (420ms swell + 1150ms fade) outlives the 1400ms
    // crossfade by ~170ms — removing it here would clip the tail visibly.
    if (bloom) {
      setTimeout(() => {
        if (bloom.parentNode) bloom.parentNode.removeChild(bloom);
      }, 400);
    }
    // Fog outlives the crossfade by design: peak hold (500ms) + dissolve
    // (1700ms) ends ~800ms after this function runs at the 1400ms mark. Tear
    // down the WebGL context only once the dissolve tail is fully done —
    // destroying at the bloom's 400ms mark would visibly clip the mist.
    if (fogEffect) {
      setTimeout(() => {
        if (fogLerpFrame) cancelAnimationFrame(fogLerpFrame);
        fogEffect.destroy();
        fogEffect = null;
        if (fogEl && fogEl.parentNode) fogEl.parentNode.removeChild(fogEl);
      }, FOG_PEAK_HOLD + FOG_DISSOLVE - CROSSFADE_DURATION + 300);
    }
    content.classList.add('is-visible');
    content.removeAttribute('aria-hidden');
    if (header) {
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
  }

})();
