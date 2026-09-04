/* ============================================================
   HERO COCKTAILS — one drink at a time, rising out of fog at the
   foot of the hero. Clicking takes you to the menu.

   Progressive enhancement throughout: with no JS the strip never
   renders, and without Vanta (mobile, blocked CDN, reduced motion)
   the drinks still cycle — just over a CSS glow instead of WebGL fog.
   ============================================================ */

(function () {
  'use strict';

  const COCKTAILS = [
    {
      "slug": "arabelle-loves-violets",
      "name": "Arabelle Loves Violets",
      "w": 322,
      "h": 360,
      "fog": {
        "highlight": "#f580a4",
        "midtone": "#c75679",
        "lowlight": "#492430"
      }
    },
    {
      "slug": "eden",
      "name": "Eden",
      "w": 326,
      "h": 360,
      "fog": {
        "highlight": "#f5ef8d",
        "midtone": "#c2bd60",
        "lowlight": "#454326"
      }
    },
    {
      "slug": "sex-and-the-city",
      "name": "Sex and the City",
      "w": 353,
      "h": 360,
      "fog": {
        "highlight": "#cc4540",
        "midtone": "#8d1f1a",
        "lowlight": "#320f0e"
      }
    },
    {
      "slug": "cloud-9",
      "name": "Cloud 9",
      "w": 272,
      "h": 360,
      "fog": {
        "highlight": "#f5e3a8",
        "midtone": "#c6b57c",
        "lowlight": "#46412f"
      }
    },
    {
      "slug": "peacock-oclock",
      "name": "Peacock O’Clock",
      "w": 323,
      "h": 360,
      "fog": {
        "highlight": "#69c6f5",
        "midtone": "#3b8fb9",
        "lowlight": "#1a3542"
      }
    },
    {
      "slug": "smokin-hot",
      "name": "Smokin’ Hot",
      "w": 285,
      "h": 360,
      "fog": {
        "highlight": "#f5ad5a",
        "midtone": "#c47f31",
        "lowlight": "#463017"
      }
    },
    {
      "slug": "make-me-blush",
      "name": "Make Me Blush",
      "w": 236,
      "h": 360,
      "fog": {
        "highlight": "#f59f9e",
        "midtone": "#c67473",
        "lowlight": "#462c2c"
      }
    },
    {
      "slug": "banana-bread-old-fashioned",
      "name": "Banana Bread Old Fashioned",
      "w": 283,
      "h": 360,
      "fog": {
        "highlight": "#dd9653",
        "midtone": "#995e27",
        "lowlight": "#362412"
      }
    },
    {
      "slug": "spice-girl-fall-edit",
      "name": "Spice Girl",
      "w": 235,
      "h": 360,
      "fog": {
        "highlight": "#f5935f",
        "midtone": "#bb6233",
        "lowlight": "#422617"
      }
    },
    {
      "slug": "filthy-rich",
      "name": "Filthy Rich",
      "w": 270,
      "h": 360,
      "fog": {
        "highlight": "#f1c98b",
        "midtone": "#a78653",
        "lowlight": "#3b3121"
      }
    },
    {
      "slug": "passion-ash",
      "name": "Passion & Ash",
      "w": 198,
      "h": 360,
      "fog": {
        "highlight": "#f06e64",
        "midtone": "#a63c33",
        "lowlight": "#3b1916"
      }
    },
    {
      "slug": "vanilla-chanel",
      "name": "Vanilla & Chanel",
      "w": 214,
      "h": 360,
      "fog": {
        "highlight": "#f5b681",
        "midtone": "#b98051",
        "lowlight": "#423021"
      }
    },
    {
      "slug": "palomas-give-you-wings",
      "name": "Palomas Give You Wings",
      "w": 304,
      "h": 360,
      "fog": {
        "highlight": "#f5b19a",
        "midtone": "#c7866f",
        "lowlight": "#49332c"
      }
    },
    {
      "slug": "pearfection",
      "name": "Pearfection",
      "w": 213,
      "h": 360,
      "fog": {
        "highlight": "#f5b066",
        "midtone": "#c7853d",
        "lowlight": "#47321b"
      }
    },
    {
      "slug": "tipsy-peach",
      "name": "Tipsy Peach",
      "w": 316,
      "h": 360,
      "fog": {
        "highlight": "#f58a56",
        "midtone": "#b55729",
        "lowlight": "#402214"
      }
    },
    {
      "slug": "spritz-me-im-fancy",
      "name": "Spritz Me, I’m Fancy",
      "w": 270,
      "h": 360,
      "fog": {
        "highlight": "#f58861",
        "midtone": "#c55d38",
        "lowlight": "#462519"
      }
    },
    {
      "slug": "what-happens-in-pineapple-grove",
      "name": "What Happens in Pineapple Grove…",
      "w": 238,
      "h": 360,
      "fog": {
        "highlight": "#f5bf70",
        "midtone": "#c79347",
        "lowlight": "#48371e"
      }
    }
  ];

  const DWELL     = 5200;   // ms a drink is held before the next one
  const FADE      = 1100;   // ms crossfade, matches --cocktail-fade in home.css
  const COLOUR_MS = 1400;   // ms for the fog to travel to the next drink's colour

  const strip = document.getElementById('hero-cocktails');
  const card  = document.getElementById('cocktail-card');
  const img   = document.getElementById('cocktail-img');
  const name  = document.getElementById('cocktail-name');
  const fogEl = document.getElementById('cocktail-fog');          // Vanta's own element
  const fogWrap = fogEl && fogEl.parentElement;                    // owns position + mask
  if (!strip || !card || !img || !name) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;

  let i = 0, timer = null, fx = null, lerpFrame = null;

  const hex2rgb = (h) => [parseInt(h.slice(1,3),16)/255, parseInt(h.slice(3,5),16)/255, parseInt(h.slice(5,7),16)/255];

  function paint(d) {
    img.src = `/src/assets/cocktails/${d.slug}.webp`;
    img.alt = d.name;
    img.width = d.w; img.height = d.h;   // reserve the box so nothing reflows
    name.textContent = d.name;
    // the glow behind the drink tints too, which is what carries the colour
    // change on mobile where there is no WebGL fog at all
    strip.style.setProperty('--drink-glow', d.fog.midtone);
  }

  // Vanta exposes no colour API — its uniforms are THREE.Vector3 holding
  // normalised RGB, so they are mutated in place and re-render on the next
  // frame. Same technique the opening sequence uses for its seam→candlelight
  // drift; see opening-sequence.js.
  function driftFog(to, ms) {
    if (!fx || !fx.uniforms) return;
    const pairs = ['highlightColor','midtoneColor','lowlightColor'].map((u, n) => {
      const key = ['highlight','midtone','lowlight'][n];
      const v = fx.uniforms[u];
      return v ? { v, from: [v.value.x, v.value.y, v.value.z], to: hex2rgb(to[key]) } : null;
    }).filter(Boolean);
    const t0 = performance.now();
    cancelAnimationFrame(lerpFrame);
    (function step(now) {
      if (!fx) return;
      const raw = Math.min((now - t0) / ms, 1);
      const t = raw * raw * (3 - 2 * raw);              // smoothstep
      pairs.forEach(p => p.v.value.set(
        p.from[0] + (p.to[0] - p.from[0]) * t,
        p.from[1] + (p.to[1] - p.from[1]) * t,
        p.from[2] + (p.to[2] - p.from[2]) * t));
      if (raw < 1) lerpFrame = requestAnimationFrame(step);
    })(t0);
  }

  function preload(n) {
    const d = COCKTAILS[n % COCKTAILS.length];
    new Image().src = `/src/assets/cocktails/${d.slug}.webp`;
  }

  function advance() {
    const next = (i + 1) % COCKTAILS.length;
    strip.classList.remove('is-in');                    // fade the drink out
    driftFog(COCKTAILS[next].fog, COLOUR_MS);           // fog moves during the gap
    setTimeout(() => {
      i = next;
      paint(COCKTAILS[i]);
      strip.classList.add('is-in');
      preload(i + 1);
      timer = setTimeout(advance, DWELL);
    }, FADE);
  }

  paint(COCKTAILS[0]);
  requestAnimationFrame(() => strip.classList.add('is-in'));

  if (reduced) return;                                  // one drink, no cycling, no fog
  preload(1);
  timer = setTimeout(advance, DWELL);

  // Pause while the tab is hidden — no point burning a WebGL loop in the
  // background, and it stops the carousel racing through drinks on return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(timer); }
    else { clearTimeout(timer); timer = setTimeout(advance, DWELL); }
  });

  // ── Fog: desktop only ────────────────────────────────────────
  // three.js + vanta are already fetched by the opening sequence on desktop,
  // so this costs no extra bytes. On mobile they are deliberately never loaded
  // (see opening-sequence.js) and the CSS glow carries the effect instead.
  if (!isDesktop || !fogEl) return;

  let waited = 0;
  (function waitForVanta() {
    if (window.VANTA && window.VANTA.FOG) {
      fx = window.VANTA.FOG({
        el: fogEl, mouseControls: false, touchControls: false, gyroControls: false,
        minHeight: 120, minWidth: 120,
        highlightColor: parseInt(COCKTAILS[0].fog.highlight.slice(1), 16),
        midtoneColor:   parseInt(COCKTAILS[0].fog.midtone.slice(1), 16),
        lowlightColor:  parseInt(COCKTAILS[0].fog.lowlight.slice(1), 16),
        baseColor: 0x0a0807, blurFactor: 0.80, speed: 0.9, zoom: 2.4
      });
      // Vanta measures its container at construction. If styles land late the
      // canvas is sized wrong, so re-measure once layout has settled.
      setTimeout(() => { if (fx && fx.resize) fx.resize(); }, 250);
      fogWrap.classList.add('is-lit');
      return;
    }
    // the opening sequence loads them; give it a while, then give up quietly
    if ((waited += 250) < 15000) setTimeout(waitForVanta, 250);
  })();

})();
