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
    <!-- Dress code notice — sits above the header in the fixed masthead stack.
         Rendered here rather than per-page so it appears everywhere the nav does.
         On the homepage this whole element is inside #site-content, which starts
         at opacity 0, so it fades in with the site after the opening sequence
         rather than floating over the video. -->
    <div class="dresscode" id="dresscode">
      <button class="dresscode-bar" type="button" aria-expanded="false" aria-controls="dresscode-panel">
        <span class="dresscode-label">Elegant Casual Dress Code</span>
        <svg class="dresscode-arrow" width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3.5 6 L8 10.5 L12.5 6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <!-- Drops over the page rather than pushing it down: the bar's height is a
           fixed token (--dc-bar-h) that the header and every page's top padding
           are offset by, so opening this must not change it or the whole site
           shifts underneath the reader. -->
      <div class="dresscode-panel" id="dresscode-panel" role="region" aria-label="Dress code policy">
        <div class="dresscode-panel-inner">
          <p class="dresscode-text">&#279;TH&#279;R&#279;AL embraces an elegant chic dress code to preserve a refined atmosphere. Athletic apparel (gym clothes, joggers, athletic shorts, yoga pants, sports bras, etc.), beachwear (swim trunks, swimsuits, etc.), flip-flops, baseball hats, sports jerseys, graphic shirts (oversized slogans and logos) and similarly casual attire are <span class="dresscode-em">not permitted</span>. Dress shorts, dress sandals, and sneakers <span class="dresscode-em dresscode-em--yes">are permitted</span>. Management reserves the right to deny entry when attire does not meet these guidelines.</p>
        </div>
      </div>
    </div>

    <header id="site-header" class="${opening ? 'nav-hidden' : 'nav-solid'}" role="banner">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="Ethereal — homepage"><img src="/src/assets/images/logo-wordmark.webp" alt="Ethereal" class="logo-img"></a>

        <button class="nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-links">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <nav id="nav-links" aria-label="Main navigation">
          <ul role="list">
            <li><a href="/pages/gallery.html" class="is-coming-soon" aria-disabled="true" title="Coming soon">Gallery<span class="coming-soon-badge">Coming Soon</span></a></li>
            <li><a href="/pages/about.html" class="is-coming-soon" aria-disabled="true" title="Coming soon">About Us<span class="coming-soon-badge">Coming Soon</span></a></li>
            <li><a href="https://resy.com/cities/delray-beach-fl/venues/ethereal" class="nav-reserve" data-resy-book>Reserve</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <div id="mobile-nav" role="dialog" aria-label="Navigation menu" aria-modal="true">
      <a href="/pages/gallery.html" class="is-coming-soon" aria-disabled="true" title="Coming soon">Gallery<span class="coming-soon-badge">Coming Soon</span></a>
      <a href="/pages/about.html" class="is-coming-soon" aria-disabled="true" title="Coming soon">About Us<span class="coming-soon-badge">Coming Soon</span></a>
      <a href="https://resy.com/cities/delray-beach-fl/venues/ethereal" class="mobile-reserve" data-resy-book>Reserve a Table</a>
    </div>
  `;

  const FOOTER = `
    <footer id="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="footer-logo"><img src="/src/assets/images/logo-wordmark.webp" alt="Ethereal" class="logo-img"></a>
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
              <li><a href="/pages/gallery.html" class="is-coming-soon" aria-disabled="true" title="Coming soon">Gallery<span class="coming-soon-badge">Coming Soon</span></a></li>
              <li><a href="/pages/about.html" class="is-coming-soon" aria-disabled="true" title="Coming soon">About Us<span class="coming-soon-badge">Coming Soon</span></a></li>
            </ul>
          </nav>
          <div class="footer-visit">
            <h3>Visit</h3>
            <address>
              <p>324 NE 3rd Ave #1</p>
              <p>Delray Beach, FL 33444</p>
            </address>
            <p style="margin-top:1rem;">Mon–Sun &middot; 5pm – 11pm</p>
          </div>
          <div class="footer-contact">
            <h3>Contact</h3>
            <p><a href="mailto:info@etherealdelray.com">info@etherealdelray.com</a></p>
            <p><a href="tel:+15612702738">(561) 270-2738</a></p>
            <a href="https://resy.com/cities/delray-beach-fl/venues/ethereal" class="footer-reserve-link" data-resy-book>Reserve a Table</a>
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
