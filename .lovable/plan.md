

# Split Sections, Fix Bubbles, Responsive Brand Grid

## Changes

### 1. Split "Meet the Teams" into 3 independently hideable sections

Currently `PnwWhosComing` and `DenverAttendeeSections` each render one big section containing bubbles + brand umbrellas + brand rep cards + industry expert cards. Split into 3 separate returned sections so each can be wrapped in its own `HideableSection` on the page:

**PnwWhosComing** becomes 3 exported components (or returns fragments that the page wraps):
- **Featured Teams header + bubble logos + BrandUmbrellaSection** → wrapped in `HideableSection sectionKey="pnw_featured_teams"`
- **Brand rep cards** → wrapped in `HideableSection sectionKey="pnw_brand_reps"`
- **Industry expert cards** → wrapped in `HideableSection sectionKey="pnw_industry_experts"`

Same for **DenverAttendeeSections** → `denver_featured_teams`, `denver_brand_reps`, `denver_industry_experts`

Approach: Refactor each component to return 3 separate `<section>` elements (no wrapping fragment needed since HideableSection wraps from the page level). The page files will import and render the data via a shared hook, then render 3 HideableSection wrappers.

Actually, simpler: keep the components but have them accept a `section` prop (`"featured_teams" | "brand_reps" | "industry_experts"`) and render only that part. Then the page calls the component 3 times, each in its own HideableSection. They share data via the same fetch (lift data fetching to the page or use a shared hook).

**Cleanest approach**: Extract a shared hook `useEventAttendees(citySlug)` that fetches brandReps, industryExperts, assignmentMap. Then create 3 small section components:
- `FeaturedTeamsSection` — header + bubbles + BrandUmbrellaSection
- `BrandRepCardsSection` — card style picker + draggable brand rep cards
- `IndustryExpertCardsSection` — card style picker + draggable expert cards

Each page renders all 3 in separate HideableSections.

### 2. CascadingLogoBubbles: less gap, center when few logos

- Reduce `py-8 md:py-12` to `py-4 md:py-6` (less room between heading and bubbles)
- When logo count <= 6, center them more tightly instead of spreading across 85% width. Calculate `leftPercent` based on count: for 4 logos, spread across ~40% centered (30% to 70% range). Formula: `spreadPercent = Math.min(85, logos.length * 15)`, center offset = `(100 - spreadPercent) / 2`.

### 3. BrandUmbrellaSection: responsive grid (3 across for 3, 4 across for 4)

Currently brand groups are stacked vertically in `space-y-4`. Change to a responsive grid:
- 3 brands → `grid-cols-3`
- 4 brands → `grid-cols-4`
- 5+ → `grid-cols-3` or `grid-cols-4` wrapping
- Each brand card shows logo, name, careers link, hiring blurb, expand chevron
- On expand, cards below shift down to show the people grid spanning full width

### Files Changed

| File | Change |
|------|--------|
| `src/hooks/useEventAttendees.ts` | **New** — shared hook extracting fetch logic from both attendee components |
| `src/components/event/FeaturedTeamsSection.tsx` | **New** — header + bubbles + brand umbrella grid |
| `src/components/event/BrandRepCardsSection.tsx` | **New** — draggable brand rep cards with style picker |
| `src/components/event/IndustryExpertCardsSection.tsx` | **New** — draggable expert cards with style picker |
| `src/components/event/CascadingLogoBubbles.tsx` | Reduce vertical padding; center logos when count is small |
| `src/components/event/BrandUmbrellaSection.tsx` | Change from vertical stack to responsive grid; expand shows cards below spanning full width |
| `src/pages/EventPNW26.tsx` | Replace single `pnw_whos_coming` HideableSection with 3 separate ones |
| `src/pages/EventOutsideDays26.tsx` | Replace single `denver_attendees` HideableSection with 3 separate ones |
| `src/components/event/PnwWhosComing.tsx` | Remove (replaced by new components) |
| `src/components/event/DenverAttendeeSections.tsx` | Remove (replaced by new components) |

