

## Best Day Brewing Sponsor Pitch Page — `/bestday`

A custom sponsor pitch page targeting Best Day Brewing as the beverage sponsor for Outside Days Denver 2026. Modeled after the `/outsidedays26-cos` (Confluence of States) page structure but reframed for a non-alcoholic beverage brand.

### Page Structure

1. **Hero** — Reuse `RegistrantHero` with Denver event details. Add a "Presented by Best Day Brewing" badge below (same pattern as COS page).

2. **Logo Ticker** — Reuse `EventLogoTicker` with the existing Denver 26 ticker logos to show the caliber of brands attending.

3. **"Proudly Sober" Section** — New custom section explaining:
   - "We're a proudly sober event" messaging
   - Why it matters: shifted to sober events last year to incredible reception from both job seekers and brands
   - Benefits for attendees and brands (clear-headed networking, inclusive environment, professional atmosphere)

4. **The North Face Quote** — Reuse `EventQuote` component (restyled for events-teal theme) with the full recruiter quote about sobriety and the attribution "Recruiter, The North Face".

5. **Best Day Brewing Spotlight** — New component modeled on `ConfluenceSpotlight`, replacing the map with a Best Day Brewing product feature:
   - Header: "Title Sponsor Spotlight — Best Day Brewing"
   - Description of Best Day: craft non-alcoholic beer, premium ingredients, unique brewing process
   - 3 value prop cards (e.g., "Award-Winning NA Beer", "Premium Craft Process", "Full Lineup of Styles")
   - Product imagery from their site (West Coast IPA, Hazy IPA, Kolsch, Electro-Lime)
   - CTA: "Explore Best Day Brewing" linking to bestdaybrewing.com

6. **Event Photo Gallery** — New simple gallery section using the 4 Google Drive photos from last year's event (downloaded and saved as local assets).

7. **Beverage Sponsor Tiers** — Reuse `EventTiers` component with custom beverage-focused tiers:
   - **Sampling Partner** ($5,000): Branded sampling table, logo on event materials, product in attendee welcome bags, social media mention
   - **Official Beverage Sponsor** ($10,000, marked popular): Everything in Sampling + exclusive bar branding, branded cups/koozies, dedicated social post, logo on all event signage, "Proudly Sober — Powered by Best Day" callout
   - **Title Beverage Presenter** ($20,000): Everything in Official + "Outside Days, refreshed by Best Day Brewing" naming, keynote introduction, custom activation space, post-event engagement report, co-branded content series

8. **Final CTA** — "Let's make it the Best Day yet" with mailto link to jenna@wearetheoutdoorindustry.com.

9. **Footer** — Reuse `SiteFooter`.

### New Files

- `src/pages/BestDayPitch.tsx` — Main page component
- `src/components/event/BestDaySpotlight.tsx` — Product spotlight (adapted from ConfluenceSpotlight, no map)
- `src/components/event/SoberEventSection.tsx` — "Proudly Sober" messaging section
- `src/components/event/EventPhotoGallery.tsx` — Simple photo gallery for the 4 event photos

### Modified Files

- `src/App.tsx` — Add route `/bestday` pointing to `BestDayPitch`

### Google Drive Photos

The 4 photos will be downloaded and saved as assets in `src/assets/` (e.g., `bestday-event-1.jpg` through `bestday-event-4.jpg`). If Google Drive direct download fails, placeholder images will be used with a note to replace them.

### Design

- Uses the `bg-events-teal` dark theme consistent with other registrant/sponsor pages
- Best Day Brewing's brand colors (dusty blue `#6B8E9B`, cream `#F5F0E8`) incorporated as accents alongside the existing events-yellow
- Best Day logo pulled from their site: `https://bestdaybrewing.com/cdn/shop/files/916_IG_Feed_Ads_1200_x_1200_px_3.png`

