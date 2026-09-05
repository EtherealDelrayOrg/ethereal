/* ============================================================
   HERO COCKTAILS — an endless rail of drinks at the foot of the hero,
   three on screen at once. Clicking one takes you to the menu.

   Endless is done by laying the list out three times and silently
   rewinding a whole copy once the scroll settles, so the rail can be
   flung in either direction forever without ever hitting an end.

   Scrolling is the browser's own, not a transform we drive: touch
   flings, trackpad swipes, shift+wheel and keyboard all behave the way
   the platform says they should, and scroll-snap parks each drink in
   the centre for free.

   The haze is CSS (see home.css). Vanta's WebGL fog used to live here
   and was removed — it read as a stain on the mural and never ran on
   mobile, where the effect matters most.
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

  const COPIES  = 3;      // the list, laid out three times over
  const DWELL   = 4200;   // ms a drink is centred before drifting on
  const RESUME  = 5200;   // ms of stillness before auto-advance resumes
  const SETTLE  = 130;    // ms of no scroll events that counts as "stopped"

  const strip = document.getElementById('hero-cocktails');
  const rail  = document.getElementById('cocktail-rail');
  const label = document.getElementById('cocktail-name');
  if (!strip || !rail || !label) return;

  const N       = COCKTAILS.length;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stride = 0;         // centre-to-centre distance between two slides
  let active = -1;        // index into the tripled list
  let timer = null, idle = null, raf = 0;

  // ── Build ────────────────────────────────────────────────
  // Three copies. Only the middle one is ever reachable at rest, so the
  // outer two exist purely to be scrolled into before we rewind.
  const frag = document.createDocumentFragment();
  for (let c = 0; c < COPIES; c++) {
    COCKTAILS.forEach((d) => {
      const a = document.createElement('a');
      a.className = 'cocktail-slide';
      a.href = '/pages/menu.html';
      a.setAttribute('aria-label', d.name + ' — see the full cocktail menu');
      // copies 0 and 2 are duplicates of what a screen reader has already
      // heard, so only the middle copy is exposed
      if (c !== 1) a.setAttribute('aria-hidden', 'true'), a.tabIndex = -1;
      const img = document.createElement('img');
      img.className = 'cocktail-img';
      img.src = `/src/assets/cocktails/${d.slug}.webp`;
      img.alt = '';
      img.width = d.w; img.height = d.h;   // reserve the box so nothing reflows
      img.decoding = 'async';
      // the first screenful must not be lazy or the rail starts empty
      img.loading = c === 1 ? 'eager' : 'lazy';
      a.appendChild(img);
      frag.appendChild(a);
    });
  }
  rail.appendChild(frag);
  const slides = Array.from(rail.children);

  const hex2rgb = (h) =>
    `${parseInt(h.slice(1,3),16)} ${parseInt(h.slice(3,5),16)} ${parseInt(h.slice(5,7),16)}`;

  // ── Centre tracking ──────────────────────────────────────
  function setActive(n) {
    if (n === active || !slides[n]) return;
    const d = COCKTAILS[((n % N) + N) % N];
    if (active >= 0) slides[active].classList.remove('is-active');
    slides[n].classList.add('is-active');
    active = n;

    // the haze and the drink's own bloom both follow the centred drink
    strip.style.setProperty('--haze', hex2rgb(d.fog.midtone));

    if (label.textContent !== d.name) {
      label.classList.add('is-swapping');
      setTimeout(() => {
        label.textContent = d.name;
        label.classList.remove('is-swapping');
      }, reduced ? 0 : 300);
    }
  }

  const indexAt = (x) => Math.round(x / stride);

  function measure() {
    stride = slides[1].offsetLeft - slides[0].offsetLeft;
    if (!stride) return false;
    // park on the first drink of the middle copy
    rail.scrollLeft = N * stride;
    setActive(N);
    return true;
  }

  // ── Endless ──────────────────────────────────────────────
  // Once the scroll has stopped, fold the position back into the middle
  // copy. Same drink, same pixels on screen, so the jump is invisible.
  function rewind() {
    const lo = N * stride, span = N * stride;
    const x  = rail.scrollLeft;
    if (x >= lo && x < lo + span) return;
    const folded = lo + (((x - lo) % span) + span) % span;
    const prev = rail.style.scrollBehavior;
    rail.style.scrollBehavior = 'auto';   // never animate the rewind
    rail.scrollLeft = folded;
    rail.style.scrollBehavior = prev;
    // No re-entrancy guard on purpose. The write fires another scroll event,
    // but folding is idempotent — the second pass is already in range and
    // returns above. An earlier version latched a flag and cleared it in a
    // rAF, which never runs on a backgrounded tab: one rewind with the page
    // hidden and the rail stopped tracking for the rest of the session.
  }

  rail.addEventListener('scroll', () => {
    if (!stride) return;
    // rAF keeps the highlight in step with the scroll without doing work on
    // every event...
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      setActive(indexAt(rail.scrollLeft));
    });
    clearTimeout(idle);
    idle = setTimeout(() => {
      // ...but rAF is suspended on a backgrounded tab, so settling also
      // syncs from this timer. Without it the highlight, the name and the
      // haze colour can all be left pointing at a drink that scrolled off
      // screen. setActive is a no-op when nothing changed.
      setActive(indexAt(rail.scrollLeft));
      rewind();
    }, SETTLE);
  }, { passive: true });

  // ── Auto-advance ─────────────────────────────────────────
  function goTo(n, smooth) {
    rail.scrollTo({ left: n * stride, behavior: smooth && !reduced ? 'smooth' : 'auto' });
  }
  function tick() { goTo(indexAt(rail.scrollLeft) + 1, true); schedule(); }
  function schedule(delay) {
    clearTimeout(timer);
    if (!reduced) timer = setTimeout(tick, delay || DWELL);
  }
  function hold() { clearTimeout(timer); }          // stop while a human is driving
  function release() { schedule(RESUME); }

  ['pointerdown', 'wheel', 'touchstart', 'focusin', 'mouseenter']
    .forEach((e) => rail.addEventListener(e, hold, { passive: true }));
  ['pointerup', 'touchend', 'focusout', 'mouseleave']
    .forEach((e) => rail.addEventListener(e, release, { passive: true }));

  // No point animating a rail nobody is looking at, and without this it
  // races through drinks the moment the tab comes back.
  document.addEventListener('visibilitychange', () =>
    document.hidden ? hold() : schedule());

  // ── Start ────────────────────────────────────────────────
  // Widths come from the images, so wait until layout is real. On a cold
  // load with the font still swapping, offsetLeft can read 0.
  //
  // Timers, not requestAnimationFrame: rAF is suspended on a backgrounded
  // tab, so a page opened in the background would measure once, fail, and
  // never retry — and the reveal class would never land, leaving the rail
  // at opacity 0 even after the tab came forward. setTimeout is throttled
  // there but it does still run. The short delay is enough to get the
  // class into a later frame so the opacity transition actually plays.
  (function start(tries) {
    if (measure()) {
      setTimeout(() => strip.classList.add('is-in'), 60);
      schedule();
      return;
    }
    if (tries < 40) setTimeout(() => start(tries + 1), 50);
  })(0);

  // Slide widths are in px, but --slide-w changes at the mobile breakpoint.
  let rz = null;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const keep = ((active % N) + N) % N;
      stride = slides[1].offsetLeft - slides[0].offsetLeft;
      if (stride) goTo(N + keep, false);
    }, 180);
  });

})();
