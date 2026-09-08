/* ============================================================
   MAIN.JS — Shared utilities: nav, scroll, reveals
   ============================================================ */

(function () {
  'use strict';

  // ── Overscroll guard ──────────────────────────────────────
  // Safari/Chrome on iOS (both WebKit) don't reliably honor overscroll-behavior
  // on the root html/body scroller — only on nested scroll containers — so the
  // rubber-band bounce can still scroll past the real top/bottom of the page
  // there even with overscroll-behavior-y: none set in globals.css. This
  // touchmove guard stops the bounce directly. It also fully blocks scrolling
  // while body has .is-scroll-locked (opening-sequence.js, during the intro).
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) return; // don't interfere with pinch-zoom
    if (document.body.classList.contains('is-scroll-locked')) {
      e.preventDefault();
      return;
    }
    const doc = document.documentElement;
    const atTop = window.scrollY <= 0;
    const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 1;
    const deltaY = e.touches[0].clientY - touchStartY;
    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
      e.preventDefault();
    }
  }, { passive: false });

  // ── Nav scroll state ──────────────────────────────────────
  const header = document.getElementById('site-header');

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile nav ────────────────────────────────────────────
  const toggle   = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function openMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    mobileNav.classList.add('is-open');
    document.body.classList.add('is-scroll-locked');
    // Move focus to first link
    const first = mobileNav.querySelector('a');
    if (first) first.focus();
  }

  function closeMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    mobileNav.classList.remove('is-open');
    document.body.classList.remove('is-scroll-locked');
    toggle.focus();
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // Close when a link is clicked — except coming-soon links, which need the menu to
  // stay open long enough to show their greyed-out/tooltip feedback (see below).
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      if (link.classList.contains('is-coming-soon')) return;
      link.addEventListener('click', closeMobileNav);
    });
  }

  // Logo: already on the homepage, so a normal <a href="/"> click would force a full
  // reload for no reason. Just close the mobile menu (if open) instead of navigating.
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
  if (isHome) {
    document.querySelectorAll('.nav-logo').forEach(logo => {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileNav();
      });
    });
  }

  // Trap focus inside mobile nav when open
  if (mobileNav) {
    mobileNav.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(mobileNav.querySelectorAll('a, button'));
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // ── Coming-soon links (Menu + Reservations aren't live yet) ──────
  // Real hrefs stay in the markup (direct URL access still works); this just
  // stops the click from navigating and gives touch devices a way to see the
  // tooltip, since :hover doesn't fire reliably on tap.
  document.querySelectorAll('.is-coming-soon').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      link.classList.add('is-touched');
      clearTimeout(link._comingSoonTimer);
      link._comingSoonTimer = setTimeout(() => link.classList.remove('is-touched'), 2200);
    });
  });

  // ── Dress code notice ─────────────────────────────────────
  // Expand/collapse only. The panel is absolutely positioned and drops over the
  // page, so nothing here touches layout — see the contract note in globals.css.
  const dc    = document.getElementById('dresscode');
  const dcBar = dc && dc.querySelector('.dresscode-bar');

  if (dc && dcBar) {
    const setDressCode = (open) => {
      dc.classList.toggle('is-open', open);
      dcBar.setAttribute('aria-expanded', String(open));
    };

    dcBar.addEventListener('click', () => {
      setDressCode(dcBar.getAttribute('aria-expanded') !== 'true');
    });

    // Escape closes, and focus goes back to the control that opened it.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dc.classList.contains('is-open')) {
        setDressCode(false);
        dcBar.focus();
      }
    });

    // Click anywhere off the notice dismisses it, the way a menu would. Guarded
    // on is-open so this doesn't run on every click on every page.
    document.addEventListener('click', (e) => {
      if (!dc.classList.contains('is-open')) return;
      if (!dc.contains(e.target)) setDressCode(false);
    });

    // Opening the mobile menu would otherwise leave the panel hanging over it.
    if (toggle) toggle.addEventListener('click', () => setDressCode(false));
  }

  // ── Active nav link ───────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('#nav-links a, #mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\//, ''))) {
      link.setAttribute('aria-current', 'page');
      link.style.color = 'var(--ivory)';
    }
  });

  // ── Scroll reveal ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      // Stagger siblings by index
      const delay = parseInt(el.dataset.delay || 0);
      el.style.transitionDelay = delay + 'ms';
      observer.observe(el);
    });
  }

  // ── Hero parallax bg (subtle) ─────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  const heroSection = document.getElementById('hero');
  if (heroBg && heroSection) {
    window.addEventListener('scroll', () => {
      const heroHeight = heroSection.offsetHeight;
      if (window.scrollY > heroHeight) return;
      const y = Math.min(window.scrollY * 0.18, 60);
      heroBg.style.transform = `scale(1.06) translateY(${y}px)`;
    }, { passive: true });
  }

  // ── Resy booking widget ───────────────────────────────────
  // Every "Reserve" CTA on the site opens Resy's booking modal in place —
  // there's no reservations page on this branch yet, so the widget IS the
  // reservation flow. Marked up as [data-resy-book] so the CTAs stay plain
  // anchors and only this one place knows the venue credentials.
  //
  // embed.js is injected here rather than pasted into nine <head>s by hand:
  // main.js already loads on every page (the same problem GA4 had, solved the
  // other way because that one has to run before page render and this doesn't).
  //
  // Progressive enhancement: each CTA's href is a real link to the venue's Resy
  // page, and the click is only intercepted once the widget has actually loaded
  // AND exposes openModal — so a slow, blocked, or changed embed.js degrades to
  // a normal navigation that still books, rather than a dead button.
  const RESY = { venueId: 98608, apiKey: '12m41wFYzrqYB8D1dFhLaAoGU1UXG71e' };
  if (document.querySelector('[data-resy-book]')) {
    const s = document.createElement('script');
    s.src = 'https://widgets.resy.com/embed.js';
    s.async = true;
    document.head.appendChild(s);

    // Delegated: the header/footer CTAs are injected by partials.js, and the
    // mobile-nav one lives in an overlay, so binding per-element at load is
    // fragile. One listener covers every current and future trigger.
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-resy-book]');
      if (!trigger) return;
      if (!window.resyWidget || typeof resyWidget.openModal !== 'function') return;

      // Resy's widget refuses to open its modal on narrow/mobile viewports —
      // openModal() returns normally and simply mounts nothing (verified: modal
      // mounts at 1280px, does nothing at 375px, no error either way). Left
      // unhandled that turns every Reserve button on a phone into a dead
      // control, which is most of a restaurant's traffic.
      //
      // Rather than hard-code Resy's breakpoint (undocumented, and theirs to
      // change), just look at whether a frame actually appeared and navigate to
      // the venue page if it didn't. Resy's own site is mobile-optimised and
      // hands off to their app, so that's the better mobile flow anyway. The
      // modal mounts synchronously, so this check is reliable.
      const framesBefore = document.querySelectorAll('iframe').length;
      resyWidget.openModal(RESY);
      if (document.querySelectorAll('iframe').length > framesBefore) {
        e.preventDefault(); // modal is up — stay on the site
      }
      // else: let the click through to the href as a normal navigation
    });
  }

})();
