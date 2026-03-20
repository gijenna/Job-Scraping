

# Confluence of States Sponsor Spotlight Page

## What We're Building

A new page at `/outsidedays26-cos` — a copy of `/outsidedays26` with an added "Title Sponsor Spotlight" section featuring Confluence of States. The centerpiece is an interactive SVG map of the US showing all 20 member states, with hover interactions revealing state-level outdoor recreation data.

## Page Structure

The page is a clone of `EventOutsideDays26` with these additions:

1. **"Presented by Confluence of States" badge** in the hero, beneath the existing tagline
2. **Confluence of States Spotlight Section** — the main new content, placed after the logo ticker and before the attendee sections. Contains:
   - A plain-language intro: "What is Confluence of States?" — 2-3 sentences explaining the bipartisan coalition in approachable language
   - The interactive US map
   - A CTA linking to confluenceofstates.com

## Interactive US Map Component

**`src/components/event/ConfluenceMap.tsx`** — new component

- Renders a simplified SVG map of all 50 US states (using standard US state path data)
- **Member states** (20 total): filled with a gradient/vibrant color from the Basecamp palette (coral/yellow), with a subtle outdoor-themed icon or pattern overlay per state
- **Non-member states**: plain gray/muted teal
- **Hover behavior**: when hovering a member state, a tooltip/card appears showing:
  - State name and office name (e.g. "Colorado Outdoor Recreation Industry Office")
  - Year joined the Confluence
  - Director name and photo (where available)
  - Economic impact data and jobs figure (placeholder data initially, with a note that this can be populated from individual state sites)
  - Link to the state office website
- Uses Framer Motion for smooth hover transitions

### Member States Data (from scraped content)

Hardcoded data object with all 20 states organized by join year:

**2018 (founding)**: Colorado, Montana, North Carolina, Oregon, Utah, Vermont, Washington, Wyoming
**2019**: Maine, Michigan, New Mexico, Virginia
**2022**: Arkansas, Maryland, New Hampshire
**2024**: Massachusetts, Pennsylvania, Minnesota, North Dakota
**2025**: Wisconsin

Each entry includes: state abbreviation, office name, website URL, year joined, and placeholder fields for director name/photo and economic data.

## Files

| File | Change |
|------|--------|
| `src/components/event/ConfluenceMap.tsx` | **New** — interactive SVG US map with hover cards |
| `src/components/event/ConfluenceSpotlight.tsx` | **New** — spotlight section wrapper (intro + map + CTA) |
| `src/pages/EventOutsideDaysCOS.tsx` | **New** — clone of EventOutsideDays26 with sponsor spotlight inserted |
| `src/App.tsx` | Add route `/outsidedays26-cos` |

## Technical Details

- SVG state paths will be a standard simplified US map (inline SVG with path data for each state)
- Hover card uses Radix Popover or a custom positioned div with Framer Motion
- State data is a static TypeScript object — no database needed
- Economic data fields will have placeholder values initially (e.g. "$X.XB economic impact") that can be filled in later
- The map is responsive: on mobile, tapping a state opens the info card; on desktop it's hover-triggered
- Color scheme: member states use `events-coral` (#ED7660) with `events-yellow` (#E1B624) accents; non-member states use muted `events-teal` (#19363B) with lower opacity

