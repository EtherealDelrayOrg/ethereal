# Tech Stack

## Project Decisions

| Question | Answer |
|----------|--------|
| Launch timeline | **2–3 weeks** — extremely tight. Asset delivery from client is on the critical path. |
| Site structure | **Separate pages** — each nav item (`/menu`, `/gallery`, `/about`, etc.) is its own HTML file |
| Opening sequence scope | Runs on `/` (main page) only; subpages load directly into their content |
| Opening sequence tech | **Hybrid** — AI-generated video stitched seamlessly to CSS/JS reveal. Must work on mobile. |
| Team | **Solo dev** — client team generates assets only, no code access |
| CMS | **Deferred** — client will need to edit content eventually, not at launch. Will be taught later. |
| Additional assets | Client has more assets coming — to be obtained and added incrementally |

---

## Frontend

**Vanilla HTML / CSS / JavaScript** — no framework, no build tool, no bundler.

Rationale: The site is primarily presentational. Avoiding React/Vue/etc. keeps the repo accessible to any contractor who touches it, eliminates dependency rot, and means Netlify can serve it as-is with zero configuration.

### CSS Architecture

- One global stylesheet: `src/css/globals.css` (custom properties, typography, resets)
- One stylesheet per page section: `src/css/[page].css`
- No preprocessor — native CSS variables handle theming

### JavaScript Architecture

- One entry script: `src/js/main.js` (shared utilities)
- One script per feature: `src/js/opening-sequence.js`, `src/js/menu.js`, etc.
- ES modules (`type="module"`) — no bundler needed for modern browsers

---

## Hosting & Deployment

| Concern | Solution |
|---------|----------|
| Hosting | **Netlify** (free tier, continuous deployment from GitHub) |
| Repo | **GitHub** |
| Domain | Purchased via **Wix** — DNS managed in Wix dashboard |

### Connecting Wix Domain → Netlify

1. In Netlify: Site Settings → Domain management → Add custom domain
2. Netlify provides a load balancer IP (`75.2.60.5`) and a CNAME target
3. In Wix dashboard: Domains → Manage → DNS Records
   - Delete existing A records for `@`
   - Add A record: `@` → `75.2.60.5`
   - Add CNAME: `www` → `[site-name].netlify.app`
4. Propagation: 24–48 hours
5. HTTPS: Netlify auto-provisions via Let's Encrypt once DNS resolves

### Netlify Configuration

`netlify.toml` (to be created at project root) will handle:
- Redirect `/` → opening sequence
- 404 fallback page
- Cache headers for assets
- No build command (static site)

---

## Fonts

Google Fonts — loaded via `<link>` in `<head>`:
- **Cinzel** — headings, logo, navigation (engraved Roman caps feel)
- **Cormorant Garamond** — body text, descriptions (elegant serif)

---

## Third-party Integrations

See [INTEGRATIONS.md](INTEGRATIONS.md) for full embed details.

- **Toast** — menu display + online ordering
- **Resy** — reservation widget

---

## Design Tokens (from reference sketches)

```css
--gold:    #c9a84c;
--copper:  #b87333;
--brass:   #a07320;
--iron:    #3a3530;
--bg:      #080706;
--cream:   #f5ead8;
```

These are starting points from the demo. Final palette to be confirmed with client.

---

## Browser Support

Target: last 2 versions of Chrome, Firefox, Safari, Edge. No IE11.

The opening sequence video uses `<video>` with WebM + MP4 fallback — supported everywhere in scope.
