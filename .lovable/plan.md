

## Plan: Fix Deep-Links, OG Image Generation & Download

### Problems identified
1. **Industry expert deep-links scroll to wrong section** — both `BrandRepCardsSection` and `IndustryExpertCardsSection` receive the same `highlightExpert` param, so the brand rep section scrolls first (it's higher on the page)
2. **Brand rep deep-links go to BrandRepCardsSection** instead of FeaturedTeamsSection's BrandUmbrellaSection (the accordion cards)
3. **Download fails** because no OG images exist — the AI image generation hits 429 rate limits consistently
4. **Social previews don't work** — same root cause: AI generation fails, so og:image falls back to default

### Root cause for issues 3 & 4
The edge function uses AI image generation (`gemini-3.1-flash-image-preview`) which is unreliable (429 errors in logs). We need to replace this with deterministic SVG-to-PNG rendering.

---

### Implementation

**1. Replace AI image gen with SVG-based OG cards (edge function)**

Rewrite `supabase/functions/expert-og/index.ts`:
- Remove AI gateway call entirely
- Build a 1200x630 SVG string directly using expert data (name, title, company, ask_me_about, years_in_industry, previous brands)
- Use cream background, coral name, teal text — matching the Card B style
- Include "Network with me @ Gather PNW" / "@ Outside Days" CTA
- Include "Register: www.basecampoutdoorevents.com" footer bar
- Embed the expert's photo as a base64 circle-clipped image (fetch and encode)
- Return the SVG as a PNG by converting via `resvg-wasm`, OR serve the SVG directly with `content-type: image/svg+xml` (SVG works for og:image on LinkedIn/Facebook)
- Cache the result in storage as before
- Keep crawler detection, OG HTML response, and redirect logic

**2. Fix deep-link targeting for industry experts vs brand reps**

In `EventPNW26.tsx` and `EventOutsideDays26.tsx`:
- Add a second query param: use `?expert=slug` for industry experts and `?brand=slug` for brand reps
- Pass `highlightExpert` only to `IndustryExpertCardsSection`
- Pass a new `highlightBrandRep` only to `FeaturedTeamsSection`

Update `supabase/functions/expert-og/index.ts`:
- Use `?brand=slug` in the redirect URL for brand_rep type, `?expert=slug` for industry_expert

**3. Brand rep deep-link goes to FeaturedTeamsSection with auto-expand**

Update `FeaturedTeamsSection`:
- Accept `highlightBrandRep` prop (slug)
- Pass it to `BrandUmbrellaSection`

Update `BrandUmbrellaSection`:
- Accept `highlightBrandRep` prop
- On mount, find which company group contains the matching expert, auto-expand that group
- Scroll to the section
- Pass `autoExpand` to the matching `ExpertCardMinimal`

Remove highlight logic from `BrandRepCardsSection` (brand reps should deep-link to FeaturedTeams instead).

**4. Fix download in CRM**

The download currently looks for cached files that never got created. After switching to deterministic SVG rendering:
- The CRM download button should call the edge function directly to trigger generation if no cached file exists
- Update `downloadOgCard` in `ExpertCRM.tsx` to first check storage, and if not found, call the edge function URL (which will generate and cache), then retry the download

**5. Keep "Register to Network!" button** — already implemented, no changes needed.

---

### Files to edit
- `supabase/functions/expert-og/index.ts` — replace AI gen with SVG rendering, fix redirect params
- `src/pages/EventPNW26.tsx` — split `?expert` and `?brand` params, route to correct sections
- `src/pages/EventOutsideDays26.tsx` — same
- `src/components/event/FeaturedTeamsSection.tsx` — accept `highlightBrandRep`, pass down
- `src/components/event/BrandUmbrellaSection.tsx` — auto-expand matching company, scroll into view
- `src/components/experts/ExpertCRM.tsx` — fix download to trigger generation if needed

### No database changes needed

