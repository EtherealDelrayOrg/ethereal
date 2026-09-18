/* ============================================================
   COCKTAIL RAIL — the signature drinks as their own block,
   sitting under the hero mural on the homepage.

   Seventeen cocktails on an endless rail: five on screen at a
   time on desktop, three on smaller viewports, the centre one
   standing on a lit bar with its own reflection under it and a
   pool of haze behind it in its own colour. Nothing moves on
   its own — the visitor drags, swipes, arrows or clicks a
   neighbour to bring it in. Clicking the centre drink opens the
   menu at that drink's own entry.

   Endless is done by laying the list out five times and
   silently rewinding a whole copy once the scroll settles, so
   the rail can be flung either way forever without hitting an
   end.

   Scrolling is the browser's own, not a transform we drive:
   touch flings, trackpad swipes, shift+wheel and keyboard all
   behave the way the platform says they should, and scroll-snap
   parks each drink in the centre for free. Mouse users get
   click-and-drag on top, since a mouse has no fling gesture.

   Each drink carries five measured values:

   `cx` — the horizontal centre of its opaque pixels, as a
   percentage of its own width. Garnishes are wildly off-axis
   (Sex and the City's feather throws its mass 13% right of the
   box centre), so the pool of light under the centred drink is
   leaned by this much — otherwise it lights the middle of an
   empty box instead of the glass standing in it.

   `k` — an optical size multiplier. Every cutout is the same
   pixel height, but the glass inside it is not: Pearfection's
   glass fills 75% of its frame against Palomas' 97%, so drawn
   at equal heights one looks a third smaller. k scales each
   image so the GLASSES match and the garnishes are free to
   differ. Found by measuring the topmost row whose longest
   contiguous opaque run is at least half the widest —
   contiguous, so a garnish beside the rim cannot masquerade as
   part of it.

   `hi` / `mid` / `lo` — the drink's own colour, sampled light,
   middle and dark. The bloom around the glass, the haze pool
   behind it and the tint of its reflection respectively, so the
   whole block takes its light from whichever drink is centred.

   With JavaScript off the section stays [hidden] and no empty
   heading is left behind — the block is entirely built here.
   ============================================================ */

(function () {
  'use strict';

  const COCKTAILS = [
    { slug: 'arabelle-loves-violets', name: 'Arabelle Loves Violets', w: 322, h: 360, k: 0.957, cx: 7.6, page: 3, top: 241,
      hi: '#f580a4', mid: '#c75679', lo: '#492430' },
    { slug: 'eden', name: 'Eden', w: 326, h: 360, k: 1.0, cx: 10.7, page: 3, top: 859,
      hi: '#f5ef8d', mid: '#c2bd60', lo: '#454326' },
    { slug: 'sex-and-the-city', name: 'Sex and the City', w: 353, h: 360, k: 0.954, cx: 13.1, page: 3, top: 1605,
      hi: '#cc4540', mid: '#8d1f1a', lo: '#320f0e' },
    { slug: 'cloud-9', name: 'Cloud 9', w: 272, h: 360, k: 0.974, cx: 1.4, page: 3, top: 1796,
      hi: '#f5e3a8', mid: '#c6b57c', lo: '#46412f' },
    { slug: 'peacock-oclock', name: 'Peacock O’Clock', w: 323, h: 360, k: 1.224, cx: 7.7, page: 3, top: 398,
      hi: '#69c6f5', mid: '#3b8fb9', lo: '#1a3542' },
    { slug: 'smokin-hot', name: 'Smokin’ Hot', w: 285, h: 360, k: 1.271, cx: -2.3, page: 3, top: 1299,
      hi: '#f5ad5a', mid: '#c47f31', lo: '#463017' },
    { slug: 'make-me-blush', name: 'Make Me Blush', w: 236, h: 360, k: 0.971, cx: 1.7, page: 3, top: 575,
      hi: '#f59f9e', mid: '#c67473', lo: '#462c2c' },
    { slug: 'banana-bread-old-fashioned', name: 'Banana Bread Old Fashioned', w: 283, h: 360, k: 0.997, cx: 0.1, page: 3, top: 2228,
      hi: '#dd9653', mid: '#995e27', lo: '#362412' },
    { slug: 'spice-girl-fall-edit', name: 'Spice Girl', w: 235, h: 360, k: 1.018, cx: 0.1, page: 3, top: 2081,
      hi: '#f5935f', mid: '#bb6233', lo: '#422617' },
    { slug: 'filthy-rich', name: 'Filthy Rich', w: 270, h: 360, k: 0.943, cx: -3.3, page: 3, top: 2524,
      hi: '#f1c98b', mid: '#a78653', lo: '#3b3121' },
    { slug: 'passion-ash', name: 'Passion & Ash', w: 198, h: 360, k: 1.103, cx: -2.0, page: 3, top: 1010,
      hi: '#f06e64', mid: '#a63c33', lo: '#3b1916' },
    { slug: 'vanilla-chanel', name: 'Vanilla & Chanel', w: 214, h: 360, k: 1.025, cx: -0.6, page: 3, top: 1948,
      hi: '#f5b681', mid: '#b98051', lo: '#423021' },
    { slug: 'palomas-give-you-wings', name: 'Palomas Give You Wings', w: 304, h: 360, k: 0.951, cx: 5.8, page: 3, top: 2671,
      hi: '#f5b19a', mid: '#c7866f', lo: '#49332c' },
    { slug: 'pearfection', name: 'Pearfection', w: 213, h: 360, k: 1.233, cx: 1.6, page: 3, top: 728,
      hi: '#f5b066', mid: '#c7853d', lo: '#47321b' },
    { slug: 'tipsy-peach', name: 'Tipsy Peach', w: 316, h: 360, k: 1.003, cx: -0.6, page: 3, top: 1417,
      hi: '#f58a56', mid: '#b55729', lo: '#402214' },
    { slug: 'spritz-me-im-fancy', name: 'Spritz Me, I’m Fancy', w: 270, h: 360, k: 1.148, cx: 12.9, page: 3, top: 2354,
      hi: '#f58861', mid: '#c55d38', lo: '#462519' },
    { slug: 'what-happens-in-pineapple-grove', name: 'What Happens in Pineapple Grove…', w: 238, h: 360, k: 0.974, cx: -5.7, page: 3, top: 1163,
      hi: '#f5bf70', mid: '#c79347', lo: '#48371e' },  ];

  // Five copies, parked on the middle one. Three was not enough runway on a
  // phone: a hard fling across 116px slides can travel further than one copy
  // (~2000px) before it stops, and the endless fold only happens once the
  // rail has come to rest — so a strong swipe could run into the physical end
  // of the rail and stop dead there, off-centre. Two copies either side gives
  // ~3900px of travel, more than a thumb produces.
  const COPIES = 5;
  const MID    = Math.floor(COPIES / 2);   // the copy we always fold back into
  const SETTLE = 130;    // ms of no scroll events that counts as "stopped"
  const DRAG   = 4;      // px of mouse travel before a click becomes a drag

  const block = document.getElementById('cocktails');
  const rail  = document.getElementById('cocktail-rail');
  const label = document.getElementById('cocktail-name');
  if (!block || !rail || !label) return;

  // Straight to the client's designed PDF, in a new tab, matching the hero's
  // own CTA — the menu page is still placeholder copy.
  const MENU = '/src/assets/menu/ethereal-menu.pdf';

  const N       = COCKTAILS.length;
  const HOME    = MID * N;                 // index of the first drink in the middle copy
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stride = 0;        // centre-to-centre distance between two slides
  let active = -1;       // index into the repeated list
  let aim = -1;          // where an in-flight smooth scroll is headed, or -1
  let marked = [];       // the slides currently carrying a depth class
  let idle = null, raf = 0, fade = null;
  let touching = false;  // a finger is on the rail — never move it under one
  let railW = 0;         // the rail's width when it was last parked — see the resize handler
  let held = -1;         // the drink to put back after a resize, or -1 when none is pending
  // The name changes on its own small state machine — see nameTo() below.
  let shown = '', pending = null, faded = false, settled = true;

  // ── Build ────────────────────────────────────────────────
  // Three copies. Only the middle one is ever reachable at rest, so the
  // outer two exist purely to be scrolled into before we rewind.
  const frag = document.createDocumentFragment();
  for (let c = 0; c < COPIES; c++) {
    COCKTAILS.forEach((d, k) => {
      const a = document.createElement('a');
      a.className = 'cocktail-slide';
      // PDF Open Parameters, to land on the drink's own entry rather than the
      // top of a 2748pt page.
      //
      // `top` is measured DOWNWARD from the top of the page, which is not what
      // the Adobe spec says (it defines the coordinate in PDF user space, up
      // from the bottom) but is what Chrome's viewer actually implements —
      // checked against a real viewer, where the spec-shaped value landed at
      // the opposite end of the page. Accuracy tails off further down the
      // page, and iOS Safari ignores the position outright; both cases still
      // land on page 3, which is the cocktails page. A menu rendered as HTML
      // with real anchors is the only way to make this exact everywhere.
      a.href = `${MENU}#page=${d.page}&view=FitH,${d.top}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', d.name + ' — see it on the menu');
      // Without this the browser's own link/image drag starts the moment the
      // pointer moves, which swallows the pointermove stream and leaves the
      // rail's own drag dead in the water. CSS covers the same ground for the
      // images (-webkit-user-drag), belt and braces.
      a.draggable = false;
      // the outer copies repeat what a screen reader has already heard
      if (c !== MID) { a.setAttribute('aria-hidden', 'true'); a.tabIndex = -1; }

      // --k rides on the wrapper rather than the image so the reflection can
      // read it too; see the k note at the top.
      const glass = document.createElement('span');
      glass.className = 'cocktail-glass';
      glass.style.setProperty('--k', d.k);

      const src = `/src/assets/cocktails/${d.slug}.webp`;
      // Only the ones that start on screen load up front. The rest are lazy:
      // seventeen drinks is ~520 KB, and plenty of visitors never reach this
      // block at all — no reason to spend that on every homepage view.
      const global = c * N + k;
      const eager  = global >= HOME - 2 && global <= HOME + 2;

      const img = document.createElement('img');
      img.className = 'cocktail-img';
      img.src = src;
      img.alt = '';
      img.width = d.w; img.height = d.h;   // reserve the box so nothing reflows
      img.decoding = 'async';
      img.loading = eager ? 'eager' : 'lazy';
      img.draggable = false;

      // The reflection is the same file again — same URL, so it costs one
      // decode and no second request — flipped, squashed and faded by CSS.
      const mirror = document.createElement('span');
      mirror.className = 'cocktail-mirror';
      mirror.setAttribute('aria-hidden', 'true');
      const rimg = document.createElement('img');
      rimg.src = src;
      rimg.alt = '';
      rimg.decoding = 'async';
      rimg.loading = eager ? 'eager' : 'lazy';
      rimg.draggable = false;
      mirror.appendChild(rimg);

      glass.appendChild(img);
      glass.appendChild(mirror);
      a.appendChild(glass);
      frag.appendChild(a);
    });
  }
  rail.appendChild(frag);
  block.hidden = false;   // nothing to show until the rail exists
  const slides = Array.from(rail.children);

  // ── Geometry ─────────────────────────────────────────────
  // Positions are worked out from the rail's own metrics rather than from
  // the padding, so they stay right if the rail is ever narrower than the
  // slots it is asked to hold (a very small phone in landscape, say).
  const centreGap = () => (rail.clientWidth - slides[0].offsetWidth) / 2;
  const posOf   = (n) => slides[0].offsetLeft + n * stride - centreGap();
  const indexAt = (x) => Math.round((x - slides[0].offsetLeft + centreGap()) / stride);

  function scrollToIndex(n, smooth) {
    aim = n;
    rail.scrollTo({ left: posOf(n), behavior: (smooth && !reduced) ? 'smooth' : 'auto' });
  }

  // ── Centre tracking ──────────────────────────────────────
  // Lean the pool of light toward the drink's own mass. cx is a share of the
  // image's own width, so it has to be resolved against the rendered width,
  // which changes with the viewport.
  function placeLight(d, slide) {
    const img = slide.querySelector('.cocktail-img');
    const w = img.getBoundingClientRect().width;
    if (w) block.style.setProperty('--nudge', ((d.cx / 100) * w).toFixed(1) + 'px');
  }

  // The two drinks either side of the centre sit back, and the two beyond
  // those sit back further — a little depth, so the rail reads as a shelf
  // rather than a filmstrip. Everything outside that window is left plain.
  function depth(n) {
    marked.forEach((s) => s.classList.remove('is-active', 'is-near', 'is-far'));
    marked = [];
    for (let d = -2; d <= 2; d++) {
      const s = slides[n + d];
      if (!s) continue;
      s.classList.add(d === 0 ? 'is-active' : Math.abs(d) === 1 ? 'is-near' : 'is-far');
      marked.push(s);
    }
  }

  function setActive(n) {
    if (n === active || !slides[n]) return;
    const d = COCKTAILS[((n % N) + N) % N];
    depth(n);
    active = n;

    // The pool, the bloom and the reflection's tint all follow the centred
    // drink. These are registered as <color> in home.css, so assigning a new
    // one animates rather than cuts — hence plain hex, not an rgb triple.
    block.style.setProperty('--haze', d.mid);
    block.style.setProperty('--haze-hi', d.hi);
    block.style.setProperty('--haze-lo', d.lo);
    placeLight(d, slides[n]);

    nameTo(d.name);
  }

  // ── The name ─────────────────────────────────────────────
  // Two conditions have to be true before the glyphs are allowed to change: the
  // line must have finished fading out, and the rail must have stopped moving.
  //
  // The second one is what makes a fling read as one deliberate change rather
  // than a stutter — fifteen drinks go past, the name stays out of the way the
  // whole time, and the one you land on rises into place. The first is what
  // stops the swap ever being *seen*: an earlier version replaced the text on a
  // fixed timer that could land mid-fade, so on a fast scroll one name visibly
  // turned into the next on screen.
  function nameTo(next) {
    // Back to the drink already named (flicked away and straight back, or a
    // resize that briefly showed a neighbour): cancel the change rather than
    // replaying the same name through a fade-out and rise-in.
    if (next === shown) {
      pending = null;
      clearTimeout(fade);
      label.classList.remove('is-swapping');
      return;
    }
    pending = next;
    if (!shown) { commit(true); return; }         // first drink of the session
    if (!label.classList.contains('is-swapping')) {
      faded = false;
      label.classList.add('is-swapping');
      // Comfortably past the 200ms fade-out in home.css. A timer rather than
      // transitionend: transitions do not run on a backgrounded tab, and a
      // name that can never change again is a worse failure than one that
      // changes a frame early somewhere nobody is looking.
      clearTimeout(fade);
      fade = setTimeout(() => { faded = true; flushName(); }, reduced ? 0 : 240);
    }
    flushName();
  }

  function flushName() {
    if (pending !== null && faded && settled) commit(false);
  }

  function commit(instant) {
    label.textContent = shown = pending;
    pending = null;
    faded = false;
    clearTimeout(fade);
    if (instant || reduced) { label.classList.remove('is-swapping'); return; }
    // Put the new name in its starting pose, make the browser take that as
    // real, and only then let it go: without the forced layout the two class
    // changes collapse into one style pass and it fades in from nowhere
    // instead of rising.
    label.classList.add('is-entering');
    void label.offsetWidth;
    label.classList.remove('is-swapping', 'is-entering');
  }

  function measure() {
    stride = slides[1].offsetLeft - slides[0].offsetLeft;
    if (!stride) return false;
    railW = rail.clientWidth;
    rail.scrollLeft = posOf(HOME);     // park on the middle copy's first drink
    setActive(HOME);
    return true;
  }

  // ── Endless ──────────────────────────────────────────────
  // Once the scroll has stopped, fold the position back into the middle
  // copy. Same drink, same pixels on screen, so the jump is invisible.
  //
  // Only ever at rest, and only ever exactly on a drink. On a phone the "no
  // scroll events for a moment" test can pass while the rail is still easing
  // into its snap point, or while a finger is resting on it between swipes;
  // folding then writes a scrollLeft that is not a snap position, and iOS
  // honours the write and drops the snap — the rail stops a third of a drink
  // off-centre. Leaving it for the next settle costs nothing: the outer
  // copies are there precisely so there is room to wait.
  function rewind() {
    if (touching) return;
    const x  = rail.scrollLeft;
    if (Math.abs(x - posOf(indexAt(x))) > 1.5) return;   // not parked on a drink yet
    const lo = posOf(HOME), span = N * stride;
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
    if (!stride || held >= 0) return;   // mid-resize: the pixels no longer mean the same drink
    // rAF keeps the highlight in step with the scroll without doing work on
    // every event...
    settled = false;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      setActive(indexAt(rail.scrollLeft));
    });
    clearTimeout(idle);
    idle = setTimeout(settle, SETTLE);
  }, { passive: true });

  function settle() {
    if (held >= 0) return;           // the resize re-park owns the rail until it has run
    // rAF is suspended on a backgrounded tab, so settling also syncs from this
    // timer. Without it the centre drink, its name and the colour of the whole
    // block can be left pointing at something that scrolled off screen.
    // setActive is a no-op when nothing changed.
    setActive(indexAt(rail.scrollLeft));
    if (touching) return;            // still under a finger: not settled at all
    aim = -1;                        // the scroll has arrived; step from here again
    settled = true;
    flushName();                     // the name lands with the rail, not before
    if (!dragging) rewind();
  }

  // ── Clicking a neighbour brings it in ────────────────────
  // The centre drink keeps its link and opens the menu; the ones around it
  // act as the controls. Delegated, because there are eighty-five of them.
  rail.addEventListener('click', (e) => {
    const slide = e.target.closest('.cocktail-slide');
    if (!slide) return;
    // A mouse drag ends in a click on whatever was under the cursor; without
    // this, letting go over the centre drink would open the menu. e.detail is 0
    // for a click raised by the keyboard, which is never the tail of a drag and
    // must still follow the link.
    if (dragged && e.detail !== 0) { e.preventDefault(); return; }
    if (slide.classList.contains('is-active')) return; // centre → the menu
    e.preventDefault();
    const n = slides.indexOf(slide);
    if (n >= 0) scrollToIndex(n, true);
  });

  // ── Arrows ───────────────────────────────────────────────
  // A mouse has no fling gesture and the scrollbar is hidden, so without
  // these the rail looks static to anyone who doesn't try dragging it.
  block.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Step from where the rail is HEADED, not from where it currently is:
      // a smooth scroll takes a few hundred ms, and two quick taps inside that
      // window would otherwise both aim at the same drink and the second would
      // do nothing. aim is cleared as soon as the rail settles.
      if (stride) scrollToIndex((aim < 0 ? active : aim) + Number(btn.dataset.step), true);
    });
  });

  // ── Drag ─────────────────────────────────────────────────
  // Mouse only: touch already has a fling, and hijacking it there would
  // fight the platform's own (better) scrolling.
  let dragging = null, dragged = false;

  // Belt and braces with a.draggable = false above: some browsers start their
  // own drag from the anchor rather than the image inside it.
  rail.addEventListener('dragstart', (e) => e.preventDefault());

  rail.addEventListener('pointerdown', (e) => {
    // Cleared here rather than on a timer after the drag ends: the click that
    // closes a drag and the timer that would clear the flag are two separate
    // tasks with no defined order, and losing that race means the drag ends by
    // opening the menu. Every click is preceded by its own pointerdown, so
    // clearing it here is exact.
    dragged = false;
    if (e.pointerType !== 'mouse' || e.button !== 0 || !stride) return;
    dragging = { x: e.clientX, left: rail.scrollLeft };
    // Snap has to come off for the duration or the rail fights the cursor,
    // jumping back to the nearest slot on every frame.
    rail.style.scrollSnapType = 'none';
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragging.x;
    if (!dragged && Math.abs(dx) < DRAG) return;
    dragged = true;
    rail.classList.add('is-dragging');
    rail.scrollLeft = dragging.left - dx;
    e.preventDefault();                  // don't select the page while dragging
  });

  function endDrag() {
    if (!dragging) return;
    dragging = null;
    rail.classList.remove('is-dragging');
    rail.style.scrollSnapType = '';
    // Restoring snap doesn't re-snap on its own, so put the nearest drink in
    // the centre by hand; the rewind rides along on the scroll that follows.
    if (dragged) scrollToIndex(indexAt(rail.scrollLeft), true);
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // ── Start ────────────────────────────────────────────────
  // Widths come from the images, so wait until layout is real. On a cold
  // load with the font still swapping, offsetLeft can read 0.
  //
  // Timers, not requestAnimationFrame: rAF is suspended on a backgrounded
  // tab, so a page opened in the background would measure once, fail, and
  // never retry. setTimeout is throttled there but it does still run.
  (function start(tries) {
    if (measure()) return;
    if (tries < 40) setTimeout(() => start(tries + 1), 50);
  })(0);

  // Slide widths are in px and change at the breakpoints, and the light's
  // nudge is relative to the rendered image width — so a change of WIDTH has
  // to re-park the rail.
  //
  // A change of height must not. Phones fire resize every time the address bar
  // slides in or out, which is to say on nearly every vertical scroll of the
  // page, and this used to answer each one by hard-setting the rail's position
  // 180ms later. Measured on an emulated phone: a rail held between two drinks
  // mid-swipe was moved 58px by an address-bar resize alone. That was the
  // "cocktails jump and end up off" on phones.
  //
  // The test is the rail's own geometry, not the window's. A first version
  // compared window.innerWidth against the value at script start and still
  // fired on an address-bar resize — the width read at load was not the width
  // the page settled at. If the slot width and the rail width are both what
  // they were, the current position is still exactly right: leave it alone.
  //
  // Which drink to put back is read at the FIRST resize event of a burst, not
  // when the re-park runs. Between the two the slots have already changed
  // width while the rail kept its pixel position, so it is showing a different
  // drink, and the scroll handler would dutifully make that one the active
  // one. Reading `active` at re-park time restored the wrong drink on every
  // switch between the five-up and three-up layouts (measured: one or two
  // drinks over). The scroll handler stands down while a re-park is pending.
  let rz = null;
  window.addEventListener('resize', () => {
    if (held < 0 && active >= 0) held = ((active % N) + N) % N;
    clearTimeout(rz);
    rz = setTimeout(function repark() {
      if (touching) { rz = setTimeout(repark, 180); return; }
      const keep = held;
      held = -1;
      const nextStride = slides[1].offsetLeft - slides[0].offsetLeft;
      if (!nextStride || keep < 0) return;
      if (nextStride === stride && rail.clientWidth === railW) return;
      stride = nextStride;
      railW = rail.clientWidth;
      rail.scrollLeft = posOf(HOME + keep);
      setActive(HOME + keep);
      placeLight(COCKTAILS[keep], slides[HOME + keep]);
    }, 180);
  });

  // Tracked so nothing ever repositions the rail under a finger. touchend is
  // not the end of the gesture — momentum carries on — so the settle timer is
  // still what decides when the rail has stopped; this only vetoes.
  rail.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  const lift = () => {
    touching = false;
    // A finger lifted with the rail already at rest produces no further scroll
    // events, so nothing else would give the fold its turn.
    clearTimeout(idle);
    idle = setTimeout(settle, SETTLE);
  };
  rail.addEventListener('touchend', lift, { passive: true });
  rail.addEventListener('touchcancel', lift, { passive: true });

})();
