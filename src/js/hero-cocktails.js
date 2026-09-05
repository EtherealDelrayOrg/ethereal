/* ============================================================
   HERO COCKTAILS — an endless rail of drinks at the foot of the hero,
   three on screen at once. Clicking one takes you to the menu.

   Endless is done by laying the list out three times and silently
   rewinding a whole copy once the scroll settles, so the rail can be
   flung in either direction forever without ever hitting an end.

   Nothing moves on its own. Clicking either of the drinks flanking the
   centre brings it in; clicking the centre one opens the menu.

   Each drink also carries `cx`, the horizontal centre of its opaque
   pixels as a percentage of its own width. Garnishes are wildly
   off-axis — Sex and the City's feather throws its mass 13% right of
   the box centre — so a name centred on the box reads visibly beside
   the glass rather than over it. The name is nudged by cx instead.

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
      "cx": 7.6,
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
      "cx": 10.7,
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
      "cx": 13.1,
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
      "cx": 1.4,
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
      "cx": 7.7,
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
      "cx": -2.3,
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
      "cx": 1.7,
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
      "cx": 0.1,
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
      "cx": 0.1,
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
      "cx": -3.3,
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
      "cx": -2.0,
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
      "cx": -0.6,
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
      "cx": 5.8,
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
      "cx": 1.6,
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
      "cx": -0.6,
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
      "cx": 12.9,
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
      "cx": -5.7,
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

  const COPIES = 3;      // the list, laid out three times over
  const SETTLE = 130;    // ms of no scroll events that counts as "stopped"

  const strip = document.getElementById('hero-cocktails');
  const rail  = document.getElementById('cocktail-rail');
  const label = document.getElementById('cocktail-name');
  if (!strip || !rail || !label) return;

  // Straight to the PDF, in a new tab, matching the hero's own CTA — the
  // menu page is still placeholder copy.
  const MENU = '/src/assets/menu/ethereal-menu.pdf';

  const N       = COCKTAILS.length;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stride = 0;        // centre-to-centre distance between two slides
  let active = -1;       // index into the tripled list
  let idle = null, raf = 0;

  // ── Build ────────────────────────────────────────────────
  // Three copies. Only the middle one is ever reachable at rest, so the
  // outer two exist purely to be scrolled into before we rewind.
  const frag = document.createDocumentFragment();
  for (let c = 0; c < COPIES; c++) {
    COCKTAILS.forEach((d, k) => {
      const a = document.createElement('a');
      a.className = 'cocktail-slide';
      a.href = MENU;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', d.name + ' — open the menu');
      // copies 0 and 2 repeat what a screen reader has already heard
      if (c !== 1) { a.setAttribute('aria-hidden', 'true'); a.tabIndex = -1; }
      const img = document.createElement('img');
      img.className = 'cocktail-img';
      img.src = `/src/assets/cocktails/${d.slug}.webp`;
      img.alt = '';
      img.width = d.w; img.height = d.h;   // reserve the box so nothing reflows
      img.decoding = 'async';
      // Only the three that start on screen load up front. The rest are
      // lazy: seventeen drinks is ~490 KB, and most visitors never scroll
      // the rail at all — no reason to spend that on every homepage view.
      const global = c * N + k;
      img.loading = (global >= N - 1 && global <= N + 1) ? 'eager' : 'lazy';
      a.appendChild(img);
      frag.appendChild(a);
    });
  }
  rail.appendChild(frag);
  const slides = Array.from(rail.children);

  const hex2rgb = (h) =>
    `${parseInt(h.slice(1,3),16)} ${parseInt(h.slice(3,5),16)} ${parseInt(h.slice(5,7),16)}`;

  // ── Centre tracking ──────────────────────────────────────
  function placeLabel(d, slide) {
    // cx is a share of the image's own width, so it has to be resolved
    // against the rendered width, which changes with the viewport.
    const img = slide.querySelector('img');
    const w = img.getBoundingClientRect().width || (img.width * 0.3);
    label.style.transform = `translateX(${(d.cx / 100) * w}px)`;
  }

  function setActive(n) {
    if (n === active || !slides[n]) return;
    const d = COCKTAILS[((n % N) + N) % N];
    if (active >= 0) slides[active].classList.remove('is-active');
    slides[n].classList.add('is-active');
    active = n;

    // the haze and the drink's own bloom both follow the centred drink
    strip.style.setProperty('--haze', hex2rgb(d.fog.midtone));
    placeLabel(d, slides[n]);

    if (label.textContent !== d.name) {
      label.classList.add('is-swapping');
      setTimeout(() => {
        label.textContent = d.name;
        label.classList.remove('is-swapping');
      }, reduced ? 0 : 260);
    }
  }

  const indexAt = (x) => Math.round(x / stride);

  function measure() {
    stride = slides[1].offsetLeft - slides[0].offsetLeft;
    if (!stride) return false;
    rail.scrollLeft = N * stride;        // park on the middle copy's first drink
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

  // ── Clicking a neighbour brings it in ────────────────────
  // The centre drink keeps its link and opens the menu; the ones either
  // side act as the controls. Delegated, because there are 51 of them.
  rail.addEventListener('click', (e) => {
    const slide = e.target.closest('.cocktail-slide');
    if (!slide || slide.classList.contains('is-active')) return;   // centre → menu
    e.preventDefault();
    const n = slides.indexOf(slide);
    if (n < 0) return;
    rail.scrollTo({ left: n * stride, behavior: reduced ? 'auto' : 'smooth' });
  });

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
      return;
    }
    if (tries < 40) setTimeout(() => start(tries + 1), 50);
  })(0);

  // Slide widths are in px and --slide-w changes at the mobile breakpoint,
  // and the label's nudge is relative to the rendered image width.
  let rz = null;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const keep = ((active % N) + N) % N;
      stride = slides[1].offsetLeft - slides[0].offsetLeft;
      if (!stride) return;
      rail.scrollLeft = (N + keep) * stride;
      placeLabel(COCKTAILS[keep], slides[N + keep]);
    }, 180);
  });

})();
