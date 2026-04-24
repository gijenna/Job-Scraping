

## Oakley Title Sponsor pitch page

A new sleek, marketer-grade pitch page modeled on `/bestday`, repositioned to sell Oakley on title sponsoring Outside Days Denver 2026. Reuses the existing pitch shell so it inherits hero, ticker, sober narrative, gallery, tiers, and footer — but swaps in an Oakley-specific spotlight, a Meta glasses demo callout, and a RiNo storefront feature.

### Route

- New page: `src/pages/OakleyPitch.tsx`
- Mounted at `/oakley` in `src/App.tsx` (next to `/bestday`)

### Page structure (top → bottom)

1. **Hero** — reuses `RegistrantHero` with Denver mountains background, dates, location, tagline tweaked to "The outdoor industry's biggest career discovery event — meet the athletes, creators, and recruiters shaping what's next." Primary CTA → `mailto:jenna@…?subject=Oakley × Outside Days Title Sponsorship`.

2. **"A title sponsorship proposal for" pill** — same pattern as Best Day, Oakley logo (Clearbit `logo.clearbit.com/oakley.com` with favicon fallback) inside the cream-bordered chip.

3. **Logo ticker** — reuses `EventLogoTicker` with `denver26` brands, headline "The brands & athletes Oakley already lives alongside."

4. **Marquee value statement** — short, bold, full-bleed: *"Oakley makes eyewear for everyone who moves — from the morning walker to the Olympic medalist to the rider dropping into Loveland at 6 a.m."* Sets the universality angle.

5. **`OakleySpotlight` (new component)** — the centerpiece, mirrors `BestDaySpotlight` structure:
   - Eyebrow: "Title Sponsor Spotlight"
   - Oakley wordmark + one-paragraph positioning (50-year legacy, Prizm lens tech, athletes of every level).
   - **3 value cards** (icon + title + copy):
     - *Built for Every Athlete* — from daily walkers to elite snowboarders & Olympians.
     - *Prizm Lens Technology* — see the trail, the snow, the road clearer than ever.
     - *Future Genesis* — where performance meets culture and creators.
   - **3 product/lifestyle image tiles** — Oakley CDN imagery (Latitude / Reserve / Field Gear lines, sourced from oakley.com public product imagery; if a fetch fails the existing image fallback pattern applies).
   - CTA button → `https://www.oakley.com`.

6. **`OakleyMetaDemo` (new section)** — distinct dark card with a glowing accent, headline *"On-site: Live Meta × Oakley smart glasses demo."* Subcopy positions it as a magnet for the creator/influencer/recruiter crowd attending Outside Days. Bullet list:
   - Hands-on demo station inside the Oakley activation footprint.
   - First look for outdoor creators, athletes, and brand marketers.
   - Natural lead-gen for influencer, creator-economy, and brand partnerships.
   Small "Powered by Meta" line and an inline icon row (camera, mic, sparkle).

7. **`OakleyRinoStorefront` (new section)** — two-column on desktop, stacked on mobile:
   - Left: hero photo of the RiNo store from the press release (`https://cdn.assets.prezly.com/8c6136a6-712c-4d77-a51d-a9da86618e21/-/format/auto/Rino.jpg`), with a small thumbnail strip of the three interior shots beneath it.
   - Right: headline *"Make sure to visit Oakley RiNo while you're in Denver."* Excerpted copy from the press release ("blurring the lines between performance and culture… built for the athletes, artists, and creators of RiNo"). Feature pills: Customization Zone · Prizm Wall · Museum Wall · Catalyst Wall · Rooftop Lounge.
   - Address block: **2660 Walnut Street, Unit 3 · Denver, CO** · Mon–Sun 10 AM – 6 PM.
   - Two buttons: "Get directions" (Google Maps link) and "Read the announcement" (press release URL).
   - Foot traffic angle in italic line at bottom: *"Outside Days puts 1,500+ outdoor industry pros within a 10-minute drive of your front door."*

8. **The North Face quote block** — reuse the existing styled testimonial card from `BestDayPitch` (recruiter quote about the sober vibe), reframed with eyebrow "From our community" — no Best Day branding.

9. **Sober + Photo Gallery** — reuse `SoberEventSection` and `EventPhotoGallery` with the existing `bestday-event-*` photos (these are generic event photos despite the filename).

10. **Title sponsor tiers** — reuse `EventTiers` styled the same way as Best Day, but with Oakley-specific tiers:
    - **Activation Partner — $7,500** — branded sampling/demo footprint, signage, ticker logo, social mention.
    - **Official Eyewear Sponsor — $15,000 (1 spot)** — exclusive eyewear category, Meta demo station co-branding, dedicated social posts, "Proudly seen through Oakley" callout, branded swag in welcome bags.
    - **Title Presenter — $30,000 (exclusive)** — *"Outside Days Denver, presented by Oakley"* naming rights, keynote intro, custom Oakley × RiNo lounge activation, co-branded content series, post-event recap video integration, foot-traffic referral campaign to Oakley RiNo, post-event attendee insights report.

11. **Final CTA** — *"Let's put Oakley at the center of Denver's biggest outdoor industry moment."* Email Jenna button.

12. **Footer** — `SiteFooter`.

### New files

- `src/pages/OakleyPitch.tsx` — page composition.
- `src/components/event/OakleySpotlight.tsx` — title-sponsor spotlight (mirrors `BestDaySpotlight`).
- `src/components/event/OakleyMetaDemo.tsx` — Meta glasses demo callout.
- `src/components/event/OakleyRinoStorefront.tsx` — RiNo store feature with image, copy, pills, address, CTAs.

### Edited files

- `src/App.tsx` — add `<Route path="/oakley" element={<OakleyPitch />} />` near `/bestday`.

### Design / brand notes

- Keep the existing dark teal / cream / yellow palette — no jarring Oakley-red shift, just clean `events-yellow` accents and a single Oakley-orange (`#F47B00`) reserved for the Meta demo glow and tier-popular highlight to give it punch without clashing.
- Headlines in `font-headline`, body in `font-body`, all consistent with Best Day pitch.
- Buttons match existing rounded-xl, scale-on-hover treatment.
- All Oakley-supplied images load from public CDN URLs (Prezly + oakley.com); no asset uploads needed.
- No DB schema changes, no editable-text wiring (this is a pitch page, not a registrant page — copy is hardcoded so it ships sleek and on-message immediately).
- `mailto:` subject lines clearly identify the deal: "Oakley × Outside Days Title Sponsorship".

### Out of scope

- No changes to `/bestday`, `/bestdayexample`, or any registrant pages.
- No new admin tooling or DB tables.
- No Meta-branded logos shipped (text-only callout) to avoid trademark issues until Oakley signs.

