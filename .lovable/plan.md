

## Plan: Expert Share Cards, Deep-Links, UTM Tracking & CRM Integration

### What you'll get
- Each published expert/brand rep gets a unique shareable URL with a branded preview image (Card B style)
- Clicking the link opens the event page scrolled to and auto-expanded on that person's card
- UTM parameters track visits from shared links
- CRM gets a "Download Card" button to save the preview image as PNG
- "Register to Network!" button added below the industry expert card sections on PNW26 and OutsideDays26

---

### Implementation

**1. Redesign the OG preview image (edge function)**

Update `supabase/functions/expert-og/index.ts`:
- Change the AI prompt to generate a Card B-style layout: cream background, expert photo, name, title, previous brand logos, years in industry, "Ask me about" answer
- Include event-specific text: "Network with me @ Gather PNW" or "@ Outside Days"
- Add Basecamp logo reference, event details, and "Register: www.basecampoutdoorevents.com"
- Clear cached OG cards when regenerating (or use a version suffix to bust cache)
- For brand reps, use the same template but adjust the CTA text

**2. Deep-link to expanded card on event pages**

- Add query param support (`?expert=slug`) to `EventPNW26.tsx` and `EventOutsideDays26.tsx`
- Pass the `highlightExpert` slug down to `IndustryExpertCardsSection`, `BrandRepCardsSection`
- In those sections, if an expert slug matches, auto-scroll to that card and trigger the expanded modal on mount
- Update `ExpertCardCompact`, `ExpertCardMinimal`, and `ExpertCard` to accept an `autoExpand` prop
- Update the edge function redirect URL to include `?expert=slug`

**3. UTM tracking on shared links**

- In the edge function, when redirecting non-crawlers, append UTM params:
  `?expert=slug&utm_source=expert_share&utm_medium=social&utm_campaign={city_slug}`
- These are automatically picked up by any analytics tool the user connects

**4. CRM: share URLs + download button**

Update `src/components/experts/ExpertCRM.tsx`:
- Replace current share link column with the new URL format (same edge function URL, just with updated redirect behavior)
- Add a "Download Card" button next to each share link that fetches the cached OG image from storage and triggers a PNG download
- The download button constructs the storage URL: `event-photos/og-cards/{slug}-og-card.png`

**5. "Register to Network!" button**

Update `src/components/event/IndustryExpertCardsSection.tsx`:
- Accept optional `registrationUrl` prop
- Render a centered CTA button below the card grid: "Register to Network!" linking to the registration URL
- Pass the registration URL from both `EventPNW26.tsx` and `EventOutsideDays26.tsx`

---

### Files to edit
- `supabase/functions/expert-og/index.ts` — redesign OG image prompt + UTM redirect + deep-link
- `src/pages/EventPNW26.tsx` — read `?expert` param, pass to sections, add registrationUrl prop
- `src/pages/EventOutsideDays26.tsx` — same as above
- `src/components/event/IndustryExpertCardsSection.tsx` — auto-expand logic + "Register to Network!" button
- `src/components/event/BrandRepCardsSection.tsx` — auto-expand logic
- `src/components/experts/ExpertCardCompact.tsx` — accept `autoExpand` prop
- `src/components/experts/ExpertCardMinimal.tsx` — accept `autoExpand` prop
- `src/components/experts/ExpertCRM.tsx` — add download card button to share column

### No database changes needed

