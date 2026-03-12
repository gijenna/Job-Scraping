# Multi-Page Updates: Peak Design, UO Links, Gallery, Calendar Invites, Copy Changes

## 1. Add Peak Design LOGO to brand lists (4 pages)

Add LOGO and`{ name: "Peak Design", domain: "peakdesign.com" }` to brand arrays in:

- `src/pages/EventPNW26.tsx` (pnwBrands — logo grid + ticker)
- `src/pages/EventOutsideDays26.tsx` (denverBrands — ticker + logo bubbles)
- `src/pages/GatherPNW.tsx` (pnwBrands — ticker)
- `src/pages/GatherDenver.tsx` (denverBrands — ticker)

Also add to the companies list in `CITY_EVENT_DATA` for both portland and denver in `ExpertInvite.tsx` and `BrandRepInvite.tsx`.

---

## 2. Update UO SPM links to trackable URL

In `src/pages/EventPNW26.tsx` (lines 241, 251): Replace `https://business.uoregon.edu/programs/spm` and `/apply` with `https://bit.ly/47veqAL`.

In `src/pages/GatherPNW.tsx`: The `PnwUOPartner` component doesn't link to SPM directly — but need to check `PnwHowItWorks`, `PnwPowerfulPremium`, and `PnwUOPartner` for any UO program links. From the search, only `EventPNW26.tsx` has the direct `business.uoregon.edu` links. The `/gather-pnw` page uses `PnwUOPartner` which has no SPM link — so we need to add the tracked link there too if appropriate, or update any that exist. Since user said "do this for /gather-pnw as well", add the tracked link to the "Get in on this" button or add a "Learn about the SPM program" link in `PnwUOPartner`.

Actually, looking at `PnwUOPartner`, it mentions UO's SPM program in text but has no link to it. The user likely wants the program link added there too with the tracking URL, or at minimum ensure all UO SPM links use `https://bit.ly/47veqAL`. I'll update the two `business.uoregon.edu` links in `EventPNW26.tsx` to use the bit.ly link, and check if `/gather-pnw` has any (it doesn't directly, but `PnwHowItWorks` and other sub-components might). From the search, no other file links to `business.uoregon.edu`. So only `EventPNW26.tsx` needs updating.

**Files**: `src/pages/EventPNW26.tsx`

---

## 3. Gallery: manual arrows instead of autoplay

In `src/components/event/BasecampEventsGallery.tsx`:

- Remove the `useEffect` auto-scroll timer
- Add left/right arrow buttons (ChevronLeft/ChevronRight from lucide) for both mobile and desktop
- Keep dot indicators on mobile, add arrow controls on desktop grid

**File**: `src/components/event/BasecampEventsGallery.tsx`

---

## 4. Google Calendar invite links on confirmation

When a user confirms (clicks "I'm In" and submits the form), show a "Add to Google Calendar" link in the success state. The calendar link depends on the city:

- Portland: `https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=M2RydTZsMHY0cmhqOTBoczNoN3ZnZmM2YWsgamVubmFAd2VhcmV0aGVvdXRkb29yaW5kdXN0cnkuY29t&tmsrc=jenna%40wearetheoutdoorindustry.com`
- Denver: `https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NXU2MThhdWc1a2E4OWZlbG4xajZzNWpwYzIgamVubmFAd2VhcmV0aGVvdXRkb29yaW5kdXN0cnkuY29t&tmsrc=jenna%40wearetheoutdoorindustry.com`

Add this in `src/components/experts/ExpertIntakeForm.tsx` — in the `showSuccess` block (around line 383), add a calendar icon button below the "Email me this link" button. Pass `citySlug` to determine which link to show.

**File**: `src/components/experts/ExpertIntakeForm.tsx`

---

## 5. BrandRepInvite copy changes

In `src/pages/BrandRepInvite.tsx`:

**a) Hero headline** (line 226-237): Change from `"{brandName} is confirmed at our {cityName} event"` to city-specific:

- Portland: `"{brandName} is confirmed at Gather PNW"` with "Gather PNW" hyperlinked to `/PNW26`
- Denver: `"{brandName} is confirmed at Outside Days Career Fair"` with "Outside Days Career Fair" hyperlinked to `/OutsideDays26`

The `{hasKnownRep}` conditional for "& Jen would love you to attend!" stays.

**b) Second paragraph** (line 251-254): Change from `"at our upcoming {cityName} event"` to:

- Portland: `"at Gather: PNW"` and hyperlink to /PNW26
- Denver: `"at Outside Days Career Fair" and hyperlink to /outsidedays26`

Also change the copy to match: `"{brandName} would love for you to represent the brand at [event name]. You'll chat with our community, tell your story, and help attendees get intel beyond the careers page."`

**c) Header event title** (line 215): Make the top-right text clickable — wrap in a `<Link>`:

- Portland → `/PNW26`
- Denver → `/OutsideDays26`

---

## 6. ExpertInvite copy changes

In `src/pages/ExpertInvite.tsx`:

**a) Paragraph text** (line 268-270): Change `"at our upcoming {cityName} event"` to:

- Portland: `"at Gather: PNW"` with hyperlink to `/PNW26`
- Denver: `"at Outside Days Career Fair"` with hyperlink to `/OutsideDays26`

**b) Header event title** (line 235): Make clickable like BrandRepInvite.

---

## 7. CityExperts copy changes

In `src/pages/CityExperts.tsx` (line 74): Make the event title in the header clickable:

- Portland → `/PNW26`
- Denver → `/OutsideDays26`

---

## 8. Add "The Event" section background from /pnw26

In both `ExpertInvite.tsx` and `BrandRepInvite.tsx`, "The Event" section (line 377/361) currently has `bg-events-cream`. Add a background image behind it. Use `heroPortland` for Portland and `heroDenver` video still or `heroMountains` for Denver. Since the section is already cream-colored, add a subtle overlay. Looking at the request more carefully — they want the background from `/pnw26` which is the PNW video. But for a section background, use the hero image. Add a relative positioning with the image behind and a cream overlay.  
  
Make sure the background is behind the cream background we currently see. I want the cream to stay, and the background behind it to change. 

**Files**: `src/pages/ExpertInvite.tsx`, `src/pages/BrandRepInvite.tsx`

---

## 9. Add "Just want to register?" text link below "I'm In" buttons

On all expert/brandrep pages, below the "I'm In! Let's Do This" button in the CTA section, add:
`"Just want to register and attend for free? We'd love to see you"` — as a plain text link (not a button).

- Portland pages → link to `/PNW26`
- Denver pages → link to `/OutsideDays26`

Add this in both CTA sections (the scroll-to CTA in the hero area and the bottom CTA section) in both `ExpertInvite.tsx` and `BrandRepInvite.tsx`.

**Files**: `src/pages/ExpertInvite.tsx`, `src/pages/BrandRepInvite.tsx`

---

## Summary of Files Modified (~7)


| File                        | Changes                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `EventPNW26.tsx`            | Add Peak Design to brands, update UO SPM links to bit.ly                                                                   |
| `EventOutsideDays26.tsx`    | Add Peak Design to brands                                                                                                  |
| `GatherPNW.tsx`             | Add Peak Design to brands                                                                                                  |
| `GatherDenver.tsx`          | Add Peak Design to brands                                                                                                  |
| `BasecampEventsGallery.tsx` | Replace autoplay with manual arrow navigation                                                                              |
| `ExpertIntakeForm.tsx`      | Add Google Calendar link on confirmation success                                                                           |
| `ExpertInvite.tsx`          | Add Peak Design to companies, copy changes, event title link, background on "The Event", register link, event name changes |
| `BrandRepInvite.tsx`        | Same as ExpertInvite — copy, links, background, register link                                                              |
| `CityExperts.tsx`           | Make header event title clickable                                                                                          |
