/* ============================================================
   OPENING SEQUENCE
   Orchestrates CSS animation placeholder → crossfade → site reveal
   When AI video is ready: replace SVG clock with <video> element
   ============================================================ */

(function () {
  'use strict';

  const SEQUENCE_DURATION = 3000; // ms — total time before crossfade starts
  const CROSSFADE_DURATION = 1400; // ms — must match CSS transition

  const seq     = document.getElementById('opening-sequence');
  const content = document.getElementById('site-content');
  const header  = document.getElementById('site-header');
  const skipBtn = document.querySelector('.seq-skip');
  const progress = document.querySelector('.seq-progress-fill');
  const bloom   = document.getElementById('seq-bloom');

  if (!seq || !content) return;

  // ── Accessibility: skip if user prefers reduced motion ────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealSite();
    return;
  }

  // ── Progress bar ──────────────────────────────────────────
  if (progress) {
    progress.style.transitionDuration = SEQUENCE_DURATION + 'ms';
    // Trigger on next frame so transition fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.width = '100%';
      });
    });
  }

  // ── Auto-start crossfade after duration ───────────────────
  let autoTimer = setTimeout(startCrossfade, SEQUENCE_DURATION);

  // ── Skip button ───────────────────────────────────────────
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearTimeout(autoTimer);
      startCrossfade();
    });
    // Keyboard: space or enter
    skipBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(autoTimer);
        startCrossfade();
      }
    });
  }

  // ── When video is wired up, use this instead of auto-timer ─
  // const video = document.getElementById('opening-video');
  // if (video) {
  //   const isMobile = window.matchMedia('(max-width: 767px)').matches;
  //   const src = isMobile ? '/src/assets/video/opening-mobile' : '/src/assets/video/opening-desktop';
  //   const webm = document.createElement('source');
  //   webm.src = src + '.webm'; webm.type = 'video/webm';
  //   const mp4 = document.createElement('source');
  //   mp4.src = src + '.mp4'; mp4.type = 'video/mp4';
  //   video.prepend(webm); video.prepend(mp4);
  //   video.addEventListener('timeupdate', () => {
  //     if (video.duration && (video.duration - video.currentTime) <= 1.5) {
  //       clearTimeout(autoTimer);
  //       startCrossfade();
  //     }
  //   });
  //   video.addEventListener('ended', revealSite);
  //   video.play().catch(() => startCrossfade()); // autoplay blocked → skip
  // }

  function startCrossfade() {
    seq.classList.add('is-fading');
    // .is-visible does triple duty (all keyed to this same moment so the blend
    // reads as one motion): fades the site in, starts the hero entrance cascade
    // (home.css gates the heroFadeUp animations on it), and kicks the hero
    // background's slow 1 → 1.04 drift that carries the video's push-in
    // direction across the seam.
    content.classList.add('is-visible');
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
    content.classList.add('is-visible');
    content.removeAttribute('aria-hidden');
    if (header) {
      header.classList.remove('nav-hidden');
      header.classList.add('nav-visible');
    }
  }

})();
