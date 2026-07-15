/* ============================================================
   OPENING SEQUENCE
   Desktop: full-bleed AI video, crossfade timed off video playback.
   Mobile (no 9:16 clip yet) + video-load failure: CSS clock placeholder
   on a fixed timer. Both paths converge on the same startCrossfade().
   ============================================================ */

(function () {
  'use strict';

  const SEQUENCE_DURATION = 3000; // ms — fallback-path time before crossfade starts
  const CROSSFADE_DURATION = 1400; // ms — must match CSS transition
  const VIDEO_CROSSFADE_LEAD = 1.4; // s — start crossfade this long before video ends

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

  // ── Accessibility: skip if user prefers reduced motion ────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSite();
    return;
  }

  let autoTimer = null;
  let crossfadeStarted = false;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;

  if (video && isDesktop) {
    playVideoSequence();
  } else {
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

  // Pre-warm: init immediately (hidden at opacity:0, still fully laid out and
  // rendering) rather than waiting for crossfade — a cold WebGL context/shader
  // compile takes long enough to be visible if triggered at the reveal moment
  // itself, which is the one instant this can't afford to stutter.
  function initFog() {
    if (!fogEl || !window.VANTA || crossfadeStarted) return;
    fogEffect = VANTA.FOG({
      el: fogEl,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      highlightColor: 0xe0a85a,
      midtoneColor: 0xc49140,
      lowlightColor: 0x8a6428,
      baseColor: 0x0a0807,
      blurFactor: 0.6,
      speed: 1.2,
      zoom: 1
    });
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

  // ── Video path: desktop only (no mobile 9:16 clip yet) ─────
  // Tagline and progress bar are dropped here — they read as clutter over
  // the video's own full-bleed art; the fallback CSS-clock path still shows
  // them since that placeholder needs the loading cue.
  function playVideoSequence() {
    if (clockFallback) clockFallback.style.display = 'none';
    if (brand) brand.style.display = 'none';
    if (progressBar) progressBar.style.display = 'none';

    const src = '/src/assets/video/opening-desktop';
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
      if (!crossfadeStarted && video.duration &&
          (video.duration - video.currentTime) <= VIDEO_CROSSFADE_LEAD) {
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
      // Autoplay blocked or clip failed to load — fall back to the static clock
      video.classList.remove('is-active');
      if (clockFallback) clockFallback.style.display = '';
      if (brand) brand.style.display = '';
      if (progressBar) progressBar.style.display = '';
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
    // Fog bridge: same asymmetric swell/dissolve timing as the bloom below, so
    // the two read as one atmosphere rather than two separate effects.
    if (fogEl && fogEffect) {
      fogEl.classList.add('is-active');
      setTimeout(() => fogEl.classList.remove('is-active'), 420);
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
    // Remove seq from DOM entirely to free memory
    if (seq && seq.parentNode) seq.parentNode.removeChild(seq);
    // Bloom's dissolve (420ms swell + 1150ms fade) outlives the 1400ms
    // crossfade by ~170ms — removing it here would clip the tail visibly.
    if (bloom) {
      setTimeout(() => {
        if (bloom.parentNode) bloom.parentNode.removeChild(bloom);
      }, 400);
    }
    // Same tail-outlive delay as the bloom, then tear down the WebGL context —
    // it's rendering every frame and would otherwise leak on repeat visits.
    if (fogEffect) {
      setTimeout(() => {
        fogEffect.destroy();
        fogEffect = null;
        if (fogEl && fogEl.parentNode) fogEl.parentNode.removeChild(fogEl);
      }, 400);
    }
    content.classList.add('is-visible');
    content.removeAttribute('aria-hidden');
    if (header) {
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
  }

})();
