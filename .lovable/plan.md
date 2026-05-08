## Goal
Make `/afterparty-interest` mirror the OG invite visually and content-wise (minus the date/time and the old RSVP CTA), while keeping the existing waitlist flow.

## Changes to `src/pages/AfterPartyInterest.tsx`

### 1. Background + chrome
- Apply the same `/bg-sunset.jpg` cover background + dark overlay used in `AfterPartyInvite` (cream text on dark teal/black).
- Wrap content in the same max-width 480 column on mobile, scaled up on desktop.
- Keep the `BasecampMatchPopflyLogo` Oakley lockup at the top.

### 2. Restore lost party details (no date/time)
Below the lockup, mirror the OG invite's hero:
- Sparkle row + DJ · Drinks · Swag · Food · Friends pill row (`StarSparkle` already used on the invite).
- About section: "A lil' party for outdoor industry creators & brands" and the line about "200 creators × brands coming together for food, fun, DJ & drinks" (admin-editable via `EditableText`, page slug `afterparty-interest`).
- Remove the existing "May 28 · Denver" eyebrow and any date/time bullets.

### 3. Capacity gate + CTA (unchanged behavior)
- Keep the "Due to venue capacity, please submit your interest by May 25." line.
- Keep the coral "I wanna come" button. Clicking still opens the interest form inline.

### 4. Brand activation pop-up after submission
- After form submit succeeds, if `attendee_type` is `brand` or `industry`, show the existing `BrandActivateButton` (variant `full`) inline above the thank-you card, pre-filled with the user's `fullName`, `company`, `email`. It will hit the `brand_activation_requests` table + alert + confirmation emails through the same path as the invite page.
- For `creator`, skip the activation card.

### 5. Final text change
- Change thank-you headline from "You're on the list to be considered." to "You're on the waitlist." (still admin-editable).

### 6. Sponsors + Oakley gallery at the bottom
- Render `<OakleyRinoVenueShowcase />` (the Oakley RiNo gallery used on `/guests`).
- Render `<AfterPartySpotlights />` so sponsors keep visibility.
- Both sit below everything else, regardless of whether the form is open or submitted.

## Out of scope
- No DB/schema changes.
- No edge-function changes (reuses `send-transactional-email`, `append-afterparty-interest-sheet`, `brand_activation_requests` insert).
- No changes to the OG `/afterparty/...` flow.

## Files touched
- `src/pages/AfterPartyInterest.tsx` (only)

## Note on memory rule
All new copy strings (party details, waitlist headline, etc.) wrapped in `EditableText` with the `afterparty-interest` page slug, no em dashes.
