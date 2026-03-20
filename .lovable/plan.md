

# Enhanced Confluence Map: Illustrated States, Pinnable Cards, Admin Editing

## Overview

Rebuild the Confluence of States map with geographically accurate SVG paths, illustrated member state fills, click-to-pin info cards with director photos and social links, and full admin editability.

## 1. Accurate US Map SVG Paths

Replace the simplified `usStatePaths.ts` with proper geographic SVG path data. Source a well-known US state outline dataset (simplified GeoJSON projected to SVG) that renders an accurate map shape. This is a full replacement of the path data file — roughly 50 state paths with realistic outlines.

## 2. Illustrated Member States (TripSavvy-style)

For the 20 member states, instead of flat coral fills, use **colorful illustrated fills** inspired by the uploaded reference image:

- Each member state gets a unique **pastel/vibrant color** from a curated palette (teal, coral, pink, mint, gold, sky blue — matching the TripSavvy palette)
- Inside each member state, position **small SVG icons** representing that state's signature outdoor activities:
  - CO: mountains + ski figure
  - OR: trees + fishing
  - WA: kayak + mountains
  - MT: hiking + wildlife
  - NC: surfing + trails
  - ME: lighthouse + canoe
  - etc.
- Non-member states remain muted (light gray/cream at low opacity)
- Icons are simple SVG drawings positioned at each state's centroid, clipped to stay within the state boundary
- This creates the "illustrated map" feel without needing 20 AI-generated images

**Implementation**: A new data object maps each state abbreviation to its color and an array of small inline SVG icon components + positions.

## 3. Click-to-Pin Cards (not hover-only)

Replace the current hover-follow tooltip with a **click-to-open, click-away-to-close** card:

- Clicking a member state opens a positioned card (anchored near the state, not following the cursor)
- Card stays open until user clicks outside it or clicks another state
- Uses a backdrop click handler or `useEffect` with document click listener
- On mobile: same tap behavior
- Card is `pointer-events-auto` so links inside are clickable

## 4. Enhanced Card Content

Each card will display:

- **Director photo** (circular, with initials fallback if no photo)
- **Director name** with LinkedIn icon link
- **Office name** and website link
- **Year joined**
- **Economic impact** and **jobs** stats
- **Social media icons**: LinkedIn and Instagram for the office (linkable)
- All content pulled from the data object + admin overrides from `event_settings`

## 5. Admin-Editable Cards

Leverage the existing `EditableTextProvider` (page slug `outsidedays26-cos`) to make every card field editable:

- Each field uses a setting key like `cos_CO_director`, `cos_CO_directorPhoto`, `cos_CO_directorLinkedin`, `cos_CO_economicImpact`, `cos_CO_jobs`, `cos_CO_website`, `cos_CO_instagram`, `cos_CO_linkedin`
- When an admin is logged in, each field shows the pencil icon on hover
- Admins can populate director photos by pasting a URL, add LinkedIn/Instagram links, correct economic data, etc.
- Falls back to the hardcoded defaults in `confluenceData.ts` if no override exists

## 6. Data Model Updates

Extend `StateOffice` interface in `confluenceData.ts`:

```typescript
interface StateOffice {
  // existing fields...
  instagram?: string;     // office Instagram URL
  linkedin?: string;      // office LinkedIn URL  
  directorPhoto?: string; // URL to director headshot
  directorLinkedin?: string; // director's LinkedIn URL
}
```

## Files Changed

| File | Change |
|------|--------|
| `src/components/event/usStatePaths.ts` | **Replace** with accurate geographic SVG paths |
| `src/components/event/confluenceData.ts` | Add `instagram`, `linkedin` fields; add state illustration config (colors + icon types) |
| `src/components/event/ConfluenceMap.tsx` | **Rebuild**: illustrated fills, SVG icons per state, click-to-pin cards, director photos, social links, admin-editable fields |
| `src/components/event/ConfluenceSpotlight.tsx` | Update legend and instruction text |

No database changes needed — uses existing `event_settings` table.

## Technical Notes

- SVG state paths sourced from standard US map datasets, simplified to ~500 points per state for performance
- State illustrations use inline SVG `<g>` elements with small icon drawings (mountains, trees, waves, etc.) clipped to state boundaries via `<clipPath>`
- Each state gets a color from a 6-color pastel palette, assigned to create visual variety across the map
- Click-outside detection uses a ref + document event listener pattern
- Card positioning calculated from state centroid coordinates (pre-computed per state)

