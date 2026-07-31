/* ============================================================
   PARTIALS — Shared <site-header> & <site-footer>
   Single source of truth for the nav and footer markup.
   Loaded as a blocking script in <head> so the elements are
   defined before the body is parsed; each <site-header> /
   <site-footer> then upgrades (renders) synchronously in place.
   main.js runs afterwards and wires up nav behaviour + active link.

   Usage:
     <site-header></site-header>          subpage nav (visible)
     <site-header opening></site-header>  homepage nav (hidden until
                                           the opening sequence reveals it)
     <site-footer></site-footer>          shared footer
   ============================================================ */

(function () {
  'use strict';

  const HEADER = (opening) => `
    <header id="site-header" class="${opening ? 'nav-hidden' : 'nav-solid'}" role="banner">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="Ethereal — homepage"><img src="/src/assets/images/logo-wordmark.png" alt="Ethereal" class="logo-img"></a>

        <button class="nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-links">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <nav id="nav-links" aria-label="Main navigation">
          <ul role="list">
            <li><a href="/pages/menu.html">Menu</a></li>
            <li><a href="/pages/gallery.html">Gallery</a></li>
            <li><a href="/pages/about.html">About Us</a></li>
            <li><a href="/pages/shop.html">Shop</a></li>
            <li><a href="/pages/careers.html">Careers</a></li>
            <li><a href="/pages/contact.html">Contact</a></li>
            <li><a href="/pages/reservations.html" class="nav-reserve">Reserve</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <div id="mobile-nav" role="dialog" aria-label="Navigation menu" aria-modal="true">
      <a href="/pages/menu.html">Menu</a>
      <a href="/pages/gallery.html">Gallery</a>
      <a href="/pages/about.html">About Us</a>
      <a href="/pages/shop.html">Shop</a>
      <a href="/pages/careers.html">Careers</a>
      <a href="/pages/contact.html">Contact</a>
      <a href="/pages/reservations.html" class="mobile-reserve">Reserve a Table</a>
    </div>
  `;

  const FOOTER = `
    <footer id="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="footer-logo"><img src="/src/assets/images/logo-wordmark.png" alt="Ethereal" class="logo-img"></a>
            <!-- PLACEHOLDER: "Where time breathes." retired at client request, new
                 tagline TBD. Deliberately renders as empty space — no visible
                 placeholder text here, since visitors see this footer on every
                 page. Drop the new tagline between the tags when it lands. -->
            <p class="footer-tagline"></p>
            <div class="footer-social"><a href="https://www.instagram.com/etherealdelray" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a></div>
          </div>
          <nav class="footer-nav" aria-label="Footer navigation">
            <h3>Navigate</h3>
            <ul role="list">
              <li><a href="/pages/menu.html">Menu</a></li>
              <li><a href="/pages/gallery.html">Gallery</a></li>
              <li><a href="/pages/about.html">About Us</a></li>
              <li><a href="/pages/shop.html">Shop</a></li>
              <li><a href="/pages/careers.html">Careers</a></li>
              <li><a href="/pages/contact.html">Contact</a></li>
            </ul>
          </nav>
          <div class="footer-visit">
            <h3>Visit</h3>
            <address>
              <p>324 NE 3rd Ave #1</p>
              <p>Delray Beach, FL 33444</p>
            </address>
            <p style="margin-top:1rem;">Mon–Sun &middot; 4pm – 11pm</p>
          </div>
          <div class="footer-contact">
            <h3>Contact</h3>
            <p><a href="mailto:info@etherealdelray.com">info@etherealdelray.com</a></p>
            <p><a href="tel:+15612702738">(561) 270-2738</a></p>
            <a href="/pages/reservations.html" class="footer-reserve-link">Reserve a Table</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Ethereal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = HEADER(this.hasAttribute('opening'));
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = FOOTER;
    }
  }

  customElements.define('site-header', SiteHeader);
  customElements.define('site-footer', SiteFooter);

})();
