

## Create `/bestdayexample` — Best Day Version of Outside Days Registration Page

Keep the existing `/bestday` pitch page untouched. Create a new page at `/bestdayexample` that mirrors `/outsidedays26-cos` exactly, swapping the Confluence of States spotlight for a compact, agency-quality Best Day Brewing section.

### New Component: `BestDayRegistrantSpotlight.tsx`

A single, tight section placed where `ConfluenceSpotlight` sits. Contains:

1. **Best Day Brewing logo** (sun wordmark from their site)
2. **"Proudly Sober" vibe line** — reuse the opening line from the current `/bestday` SoberEventSection: *"Last year we shifted to fully sober events — and the response from both job seekers and brands was incredible."*
3. **North Face recruiter quote** — styled as a compact pull quote (not a full section)
4. **4-photo strip** — the `bestday-event-*.jpg` assets in a horizontal grid
5. Brief CTA link to bestdaybrewing.com

No value prop cards, no beer descriptions, no filler. One polished section.

### New Page: `src/pages/BestDayExample.tsx`

Clone of `EventOutsideDaysCOS.tsx` with these changes:
- "Presented by" badge shows Best Day Brewing logo instead of "Confluence of States" text
- `ConfluenceSpotlight` replaced with `BestDayRegistrantSpotlight`
- `EditableTextProvider` pageSlug set to `"bestday-example"`
- Page meta title updated

Everything else stays identical: hero, ticker, featured teams, brand reps, experts, stats, how to tap in, venue, festival partner, CTA, footer.

### Modified: `src/App.tsx`

Add route: `/bestdayexample` → `BestDayExample`

### Files

| Action | File |
|--------|------|
| Create | `src/components/event/BestDayRegistrantSpotlight.tsx` |
| Create | `src/pages/BestDayExample.tsx` |
| Edit | `src/App.tsx` — add route |

