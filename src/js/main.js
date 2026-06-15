/* ============================================================
   MAIN.JS — Shared utilities: nav, scroll, reveals
   ============================================================ */

(function () {
  'use strict';

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
    document.body.style.overflow = 'hidden';
    // Move focus to first link
    const first = mobileNav.querySelector('a');
    if (first) first.focus();
  }

  function closeMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
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

  // Close when a link is clicked
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
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

})();
