# Open Questions

Questions to resolve with the client and team before or during development. Go through these to align on all technical and creative decisions.

---

## Brand & Identity

- [ ] **Is the tagline "Where time breathes" confirmed**, or is it from the sketch concepts and still TBD?
- [ ] **Do they have a finalized logo?** SVG format is ideal. If not, is logo design in scope for this project?
- [ ] **Final brand color palette** — the reference sketches use gold/copper/brass on dark. Is this locked or still evolving?
- [ ] **Final fonts** — are Cinzel + Cormorant Garamond confirmed, or does the client have a brand guideline document we should follow?
- [ ] **Is there an existing brand guideline / style guide** we should be consistent with?

---

## Opening Sequence

- [x] **Does the clock persist after the intro?** — **No.** Clock disappears after the sequence. A clock-derived icon/logo may appear in nav, depending on client assets.
- [x] **Does the intro play on every visit?** — **Yes**, on every main page (`/`) load. Subpages skip it entirely.
- [ ] **What assets will the client provide?** Specifically: clean isolated clock illustration, clean bird illustrations (peacock and crane), any additional reference imagery or video moodboards. — *More assets are coming from client, to be obtained incrementally.*
- [ ] **When can we expect the first batch of assets?** Timeline is 2–3 weeks — opening sequence is blocked on this.
- [ ] **Does the client have a specific AI video tool preference**, or are we free to choose the generation model?
- [ ] **Is there a specific bird species / illustration style they're attached to** from the reference sketches, or is it directional?
- [ ] **Should the clock show real time?** The reference sketches had a working clock. Is that still the intent for the live site, or is it purely decorative?
- [ ] **Should there be audio in the opening sequence?** Ambient tones, a clock mechanism sound, music? If yes, who provides it?
- [ ] **Mobile opening sequence** — full video on mobile is heavy and iOS has autoplay restrictions. Do they want a simplified fallback on mobile, or skip the video sequence entirely on mobile?
- [ ] **Should there be a "skip intro" button** for repeat visitors?

---

## Menu

- [ ] **What is the Toast Tab URL** (format: `toasttab.com/[restaurant-name]/v3`)?
- [ ] **Is online ordering enabled in their Toast account**, or is the menu embed display-only?
- [ ] **Should the menu page show only the Toast embed**, or should there be additional editorial content (descriptions, photos, chef notes)?

---

## Reservations

- [ ] **Is the restaurant live on Resy yet**, or is this a future integration (launching closer to grand opening)?
- [ ] **Resy venue URL and notify ID** — need these to configure the widget.
- [ ] **Should reservations live as a dedicated page**, or as a modal/overlay triggered from a CTA button throughout the site?

---

## Shop

- [ ] **What are they selling?** (Merchandise, pantry products, gift cards, experiences?)
- [ ] **Is e-commerce in scope for launch**, or is the Shop page purely a "coming soon" placeholder for now?
- [ ] **If e-commerce is future scope**, should the coming soon page capture email signups for launch notification?

---

## Careers

- [ ] **Do they have open positions to list at launch**, or is this also a placeholder?
- [ ] **How should applications be submitted?** Direct email, a form, or integration with an ATS (Workable, Greenhouse, etc.)?
- [ ] **Who manages the careers page content** after launch — is it static (we update it) or should there be a CMS?

---

## Gallery

- [ ] **When will professional photography be available?** Gallery page cannot be built meaningfully without final photos.
- [ ] **What should the gallery showcase?** Food, interior, team, events? Any hierarchy?
- [ ] **Should the gallery be filterable** by category, or a single grid/masonry layout?
- [ ] **Any video content** for the gallery, or photo-only?

---

## Contact

- [ ] **Restaurant address**
- [ ] **Phone number**
- [ ] **Reservation email vs. general inquiry email** — same address or separate?
- [ ] **Hours of operation** (including holiday schedule approach)
- [ ] **Social media accounts** — Instagram? TikTok? Which to link?
- [ ] **Should the contact form send to an email**, or integrate with something like Notion/Airtable/Formspree?

---

## Technical

- [ ] **Grand opening date** — this affects how aggressively we need to timeline features like Resy, Toast, and Shop.
- [ ] **Who manages DNS in Wix** — the client directly, or do we need credentials/access?
- [ ] **Google Maps embed** for the contact page — will they provide a Google Maps API key, or should we use a free iframe embed (no key required)?
- [ ] **Analytics** — do they want website traffic tracking? If yes, preference: Google Analytics 4, Plausible, or Fathom?
- [ ] **Cookie consent banner** required? (Depends on jurisdiction and analytics choice.)
- [ ] **Accessibility requirements** — any specific standard (WCAG AA)?
- [x] **Is there a CMS requirement?** — Client will need to edit content eventually but not at launch. No CMS at launch. Will be taught to manage content manually or a lightweight CMS will be added in a later phase.
- [ ] **Privacy policy / terms of service** — do they have these? Are they needed for launch?

---

## Timeline

- [x] **What is the target launch date?** — **2–3 weeks.** Asset delivery from client is the critical bottleneck.
- [ ] **Are there any hard deadlines** (soft opening, press preview, etc.)?
- [ ] **Who on the client side approves design / copy** and how fast is the feedback loop?
