/* ============================================================
   GALLERY — category filtering + lightbox
   Progressive enhancement: without JS the page is still a complete,
   scrollable grid of captioned photographs. The filter buttons and the
   lightbox are additions on top of that, not requirements for it.
   ============================================================ */

(function () {
  'use strict';

  const grid    = document.getElementById('gallery-grid');
  const box     = document.getElementById('lightbox');
  if (!grid || !box) return;

  const items   = Array.from(grid.querySelectorAll('.gallery-item'));
  const empty   = document.getElementById('gallery-empty');
  const img     = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const btnClose = box.querySelector('.lightbox-close');
  const btnPrev  = box.querySelector('.lightbox-prev');
  const btnNext  = box.querySelector('.lightbox-next');

  // ── Filtering ───────────────────────────────────────────
  // `visible` is the list the lightbox arrows walk, so paging through photos
  // stays inside the category the visitor actually chose rather than wandering
  // into hidden ones.
  let visible = items.slice();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;

      document.querySelectorAll('.filter-btn').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });

      items.forEach(el => {
        el.hidden = !(cat === 'all' || el.dataset.cat === cat);
      });
      visible = items.filter(el => !el.hidden);
      if (empty) empty.hidden = visible.length > 0;
    });
  });

  // ── Lightbox ────────────────────────────────────────────
  let index = -1;
  let lastFocused = null;

  function show(i) {
    if (!visible.length) return;
    // Wrap around at both ends so the arrows never dead-end.
    index = (i + visible.length) % visible.length;
    const el = visible[index];
    const thumb = el.querySelector('img');
    img.src = el.dataset.full;
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = thumb ? thumb.alt : '';
    // Only one photo at a time, so hide the arrows entirely when there's
    // nothing to page to rather than leaving controls that do nothing.
    const many = visible.length > 1;
    btnPrev.hidden = btnNext.hidden = !many;
  }

  function open(i) {
    lastFocused = document.activeElement;
    box.hidden = false;
    // Same lock the mobile nav and opening sequence use — keeps iOS from
    // scrolling the page behind the overlay.
    document.body.classList.add('is-scroll-locked');
    show(i);
    requestAnimationFrame(() => box.classList.add('is-open'));
    btnClose.focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('is-scroll-locked');
    // Wait out the fade before hiding, or the overlay disappears instantly.
    setTimeout(() => {
      box.hidden = true;
      // removeAttribute, not src='' — an empty src re-requests the page itself.
      img.removeAttribute('src');
      if (lastFocused) lastFocused.focus();
    }, 320);
  }

  items.forEach(el => {
    el.addEventListener('click', () => {
      const i = visible.indexOf(el);
      if (i > -1) open(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(index - 1));
  btnNext.addEventListener('click', () => show(index + 1));

  // Click the backdrop (but not the photo or the controls) to dismiss.
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape')     { close(); }
    if (e.key === 'ArrowLeft')  { show(index - 1); }
    if (e.key === 'ArrowRight') { show(index + 1); }
    // Keep Tab inside the dialog: only three controls, so cycling focus back to
    // the close button is enough of a trap without a full focus-management lib.
    if (e.key === 'Tab') {
      const focusable = [btnClose, btnPrev, btnNext].filter(b => !b.hidden);
      if (!focusable.includes(document.activeElement)) {
        e.preventDefault();
        btnClose.focus();
      }
    }
  });

  // Swipe between photos on touch devices.
  let touchX = null;
  box.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

})();
