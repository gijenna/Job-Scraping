

# Multi-Page Update Plan

This is a large batch of changes across ~15 files. Here's the organized breakdown:

---

## Assets to Add
- Copy uploaded `Basecamp_match_logo-darkmode_1_1_1.png` to `src/assets/basecamp-match-logo-dark.png` (for top-left logo on /outsidedays26 and /PNW26)
- Copy uploaded `fa3aed437d11-OutwardBoundUSA_Logo_Blue_stacked_transparent.png` to `src/assets/outward-bound-logo.png`
- Copy uploaded `Expert_Sessions_4.png` to `src/assets/wilderness-society-logo.png`
- Copy uploaded `ACS_0414.jpg` to `src/assets/event-pnw-crowd.jpg` (last year's photo for PNW)
- Copy uploaded `ACS_0417.jpg` to `src/assets/event-pnw-networking.jpg` (for PNW How It Works step photos)
- Copy uploaded `ACS_0418.jpg` to `src/assets/event-pnw-panel.jpg` (for PNW How It Works step photos)
- Copy uploaded `Your_paragraph_text_3.png` to `src/assets/gather-pnw-logo-white-uo.png` (new PNW logo with white UO)

---

## /gather-denver (GatherDenver.tsx + DenverFestivalPartner.tsx + DenverByTheNumbers.tsx)

1. **DenverFestivalPartner.tsx**: Remove the Outside Days link at bottom. Add a "Get in on this" button after the "partners get free 3-day tix" line, linking to `mailto:jenna@wearetheoutdoorindustry.com`
2. **GatherDenver.tsx**: Reduce padding on "Be Part of This" CTA section (py-24 -> py-12)
3. **DenverByTheNumbers.tsx**: Add Outward Bound (`outwardbound.org`) and Wilderness Society (`wilderness.org`) to `brandLogos` array
4. **GatherDenver.tsx**: Add Outward Bound and Wilderness Society to `denverBrands` ticker array

---

## /outsidedays26 (EventOutsideDays26.tsx + RegistrantVenue.tsx + RegistrantHero props + RegistrantDenverStats.tsx + RegistrantHowToTapIn.tsx + DenverFestivalPartner.tsx)

5. **RegistrantVenue.tsx**: Make `arrivalTime` optional. When not provided, hide the "Doors:" line. Add optional `ticketUrl` and `ticketLabel` props. When `ticketUrl` is set, show a "Get Tickets" button instead of the description text. Make `address` display and `googleMapsUrl` link optional.
6. **EventOutsideDays26.tsx**: 
   - Remove `· Doors at 12:00 PM` from `time` prop
   - Remove em dash from tagline
   - Pass `ticketUrl="https://bit.ly/outside-days"` and no `arrivalTime` to RegistrantVenue
   - Remove `description` from RegistrantVenue (the festival access text)
   - Move `<DenverFestivalPartner />` to bottom of page (just above bottom CTA), add "Involve your brand" button linking to `/gather-denver`
   - Add Basecamp Match logo (top-left, fixed/absolute) linking to `www.basecampjobs.com`
7. **RegistrantDenverStats.tsx**: 
   - Add spacing (`mt-16`) between raining logos section and "What attendees are saying"
   - Convert testimonials grid to a horizontal carousel (auto-rotating with nav dots)
   - Add Outward Bound and Wilderness Society to `brandLogos`
8. **RegistrantHowToTapIn.tsx**: Change `300+` to `500+` in the "SHOW UP AS A BRAND" description
9. **EventOutsideDays26.tsx ticker**: Add Outward Bound and Wilderness Society to `denverBrands`

---

## /PNW26 (EventPNW26.tsx + RegistrantVenue)

10. **EventPNW26.tsx**: 
    - Change `logoSrc` to the new white-UO logo asset
    - Remove doors time from `time` prop -> `"5:30 – 8:30 PM PT"`
    - Remove `arrivalTime` from RegistrantVenue call
    - Add Basecamp Match logo top-left linking to basecampjobs.com

---

## /gather-pnw (GatherPNW.tsx + PnwHero.tsx + PnwUOPartner.tsx + PnwHowItWorks.tsx + PnwPowerfulPremium.tsx + PnwByTheNumbers.tsx)

11. **GatherPNW.tsx**: Remove `<PnwGallery />` import and usage. Update email to Jenna.
12. **PnwHero.tsx**: Change `gatherPnwLogo` import to the new white-UO logo
13. **PnwUOPartner.tsx**: 
    - Change verbiage to "Gather is an outdoor industry discovery zone merging a career fair & field marketing"
    - Remove address text and UO link
    - Add "Get in on this" button emailing jenna@wearetheoutdoorindustry.com
    - Add a photo from last year (ACS_0414.jpg)
14. **PnwHowItWorks.tsx**: 
    - Step 1: "Choose your discovery zone" (not "sponsorship tier")
    - Deluxe tier: "Deluxe Branding Space" (remove "Hiring")
    - Add photos to steps 2 & 3 (like Denver's DenverHowItWorks has photos)
15. **PnwPowerfulPremium.tsx**: Replace testimonials with exact Denver testimonials (7 from DenverPowerfulPremium). Add mobile raining logos (like DenverByTheNumbers).
16. **PnwByTheNumbers.tsx**: Already has raining logos on mobile - good.

---

## Across All Sites

17. **Email/name updates**: Replace all remaining `Austin@basecampjobs.com` with `jenna@wearetheoutdoorindustry.com` and "Austin will take care of you" with "Jenna will take care of you" in:
    - `GatherPNW.tsx`
    - `GatherPNWExport.tsx`
    - `GatherDenverExport.tsx`
    - `OldStuffByJenna.tsx`
    - `CTASection.tsx`
    - `PartnershipTiers.tsx`

18. **Underrepresented communities testimonial avatar**: Change `avatarId: 23` to `avatarId: 45` (brown woman) in:
    - `DenverByTheNumbers.tsx`
    - `RegistrantDenverStats.tsx`
    - `MobileTestimonialCarousel.tsx`
    - `PnwByTheNumbers.tsx`

---

## Files Modified (~20)
- **New assets**: 7 image files copied
- **Components**: `DenverFestivalPartner`, `DenverByTheNumbers`, `RegistrantVenue`, `RegistrantDenverStats`, `RegistrantHowToTapIn`, `PnwHero`, `PnwUOPartner`, `PnwHowItWorks`, `PnwPowerfulPremium`, `PnwByTheNumbers`, `MobileTestimonialCarousel`, `EventCTA`, `CTASection`, `PartnershipTiers`
- **Pages**: `EventOutsideDays26`, `EventPNW26`, `GatherPNW`, `GatherDenver`, `GatherPNWExport`, `GatherDenverExport`, `OldStuffByJenna`

