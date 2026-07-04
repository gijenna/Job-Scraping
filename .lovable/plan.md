# Minneapolis26 Brand Sales Page

A new standalone page for brand decision-makers evaluating the Basecamp Outdoor Lounge partnership at OR Minneapolis 2026. Completely separate from `/minneapolis26`. Nothing existing is modified.

## Route

- **URL**: `/minneapolis26-brands` (added to `src/App.tsx`)
- **Page**: `src/pages/MN26Brands.tsx`
- All internal/CTA links use `basecampoutdoorevents.com`. No `lovable.app` links anywhere.

## What the page looks like by default

Every section renders complete and polished using real Basecamp Outdoor content. A first-time visitor sees a finished sales page — no placeholders, no "your logo here", no empty states. Personalization is a bonus.

## Sections

**1. Hero + What it is**
- Dark teal background, cream + coral type
- Headline: "See your brand in the room."
- Body: OR Gatherings, Thursday 10:30am–12:30pm, inside the 600 sq ft Basecamp Outdoor Lounge, Minneapolis Convention Center, Aug 19–21, 2026. Experts sit for mentorship-style conversations. We line up the experts; brands support theirs and show up for the community.
- Small tasteful personalization card lives at the bottom of the hero (see below).

**2. Two tiers side by side + comparison table**
- Two cards: "Bring Your Expert — $1,500" and "Lounge Partner — $5,000" with the exact copy from the brief (including the honest note that $1,500 does not include a show pass or team badges; expert still gets after-party invite).
- Comparison table with the 11 rows exactly as specified. $5,000 column has a coral-tinted background; $1,500 column is muted (sage/cream). Checkmarks and dashes styled to make the visual gap obvious.
- Below the table, the coral italic line: "At $5,000 the team badges alone can exceed the price..."
- On mobile the two tier cards stack; the comparison table becomes a stacked/scrollable card-per-tier layout.

**3. "See how you'll show up" (mockups)**
Three mockups, all rendered client-side with the current brand (defaults to Basecamp Outdoor):
- **Newsletter mention vs feature** side by side: left = small logo + one-line mention; right = large branded block with logo, headline, paragraph.
- **Event website partner section mockup**: a cream card showing where the logo sits among partner logos.
- **"Event photo" with logo overlay**: real event photo from `src/assets/mn26/` (e.g. `AnthonyMarz_Basecamp-176`); an absolutely positioned div overlays the brand logo onto a sign/banner area of the photo. Caption below: "Your brand, in the room."
- All three swap to the entered brand name + uploaded logo when personalization is filled in. Otherwise they quietly stay Basecamp Outdoor.

**4. Why it's worth it**
- Booth at OR runs $5,000–8,000 in floor space alone, before build-out, freight, staff.
- Lounge gives brand presence, recruiting, and content reach across 300K community (70K newsletter, 180K social) — no setup.
- Proof point: Denver Lounge generated $55K in partnerships; experts return on their own time.

**5. Final CTA**
- "Let's get your brand in the room."
- Coral button → `mailto:jenna@wearetheoutdoorindustry.com` with subject "Basecamp Outdoor Lounge Partnership — OR Minneapolis 2026".
- Small note: payment can route through our nonprofit arm if needed.

## Personalization (bonus layer)

Understated block placed at the end of the hero (and again as a small inline nudge above Section 3):

- Copy: "Want to see YOUR brand in the room? Add your name and logo."
- Text input: brand name
- File input styled as a button: "Upload your logo" (accepts PNG/JPG/SVG)
- Coral button: "See it with my brand" → scrolls to Section 3
- "Reset to Basecamp" ghost link when a brand is active

Stored in React state at the page level (`useState` for `brandName` and `logoDataUrl`). The uploaded file is read via `FileReader.readAsDataURL` into a data URL held in memory. No upload, no backend, no persistence. Refresh clears it. Jenna can pre-fill and screenshot before sending.

The three Section 3 mockups read `brandName || "Basecamp Outdoor"` and `logoDataUrl || basecampLogo`. Never an empty state.

## Style

- Tokens used directly as inline hex where semantic tokens are missing: teal `#19363B`, coral `#ED7660`, gold `#E1B624`, cream `#E6E1CE`, sage `#809482`.
- Font: Josefin Sans (already loaded project-wide) applied via `font-body` / explicit `font-family` on the page root.
- Alternating dark teal and cream section backgrounds. Coral for accents and buttons. Warm, editorial, confident. No corporate stock feel. No em dashes anywhere in copy.
- Mobile-first: tier cards stack, table converts to per-tier stacked cards, mockups stack full width, personalization block full width.

## Technical notes

- Single new file `src/pages/MN26Brands.tsx` containing all sections as local sub-components (kept in one file for isolation and to guarantee zero impact on `/minneapolis26`).
- Reuse existing Basecamp logo asset already in the project for the default logo (verified during implementation from `src/assets/`).
- Reuse one existing lounge/event photo from `src/assets/mn26/*.jpg.asset.json` for the photo mockup.
- Add exactly one line to `src/App.tsx` importing the page and one `<Route path="/minneapolis26-brands" element={<MN26Brands />} />` above the catch-all.
- No new dependencies. No changes to Tailwind config, `index.css`, existing components, or any Minneapolis attendee-page files.
- No backend, no Supabase calls, no auth.
