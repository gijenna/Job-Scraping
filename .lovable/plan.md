

# Event Map Manager — Implementation Plan

## Overview
Build an interactive venue map for the Denver Outside Days event (3 basketball courts at Auraria Campus Wellness Center) with admin drag-and-drop placement and a public read-only view. Reuse existing `BrandRepCardsSection`, `IndustryExpertCardsSection`, `ExpertCardMinimal`, and the typeC→typeA expansion pattern already working on `/PNW26`.

## Database Changes (2 new tables via migration)

### `event_map_brands` table
Stores brand/activation entries for the map:
- `id` uuid PK
- `event_slug` text (e.g. "denver26")
- `name` text
- `description` text nullable
- `logo_url` text nullable
- `website_url` text nullable
- `table_count` integer default 1 (number of 8'×3' units)
- `is_activation` boolean default false
- `sponsor_brand_id` uuid nullable (self-ref for "Free thanks to [Sponsor]")
- `created_at` timestamptz

### `event_map_layouts` table
Stores placement positions (draft vs live):
- `id` uuid PK
- `event_slug` text
- `brand_id` uuid FK → event_map_brands
- `layout_type` text default 'draft' (`draft` | `live`)
- `x` integer (grid units, 10px = 1ft)
- `y` integer
- `shape` text default 'line' (`line` | `square` | `tshape` | `xshape`)
- `rotation` integer default 0
- `updated_at` timestamptz

RLS: public SELECT on both, authenticated INSERT/UPDATE/DELETE.

## File Structure

### 1. `src/pages/EventMapAdmin.tsx` — Admin page at `/admin/event-map`
Auth-gated (same pattern as `GenerateCards.tsx`). Contains:

- **Quick Add Bar**: Text inputs for Company Name + URL. On submit:
  - Auto-resolve logo via `https://logo.clearbit.com/{domain}` (existing CORS-safe pattern per memory)
  - Insert into `event_map_brands`
- **Admin Table**: Editable table (name, description, table_count, logo_url override) using existing shadcn `Table` components
- **Canvas Area**: Bird's-eye SVG/div of 3 courts (94'×50' each = 940×500px at 10px/ft scale)
  - Snap-to-grid (10px increments)
  - Drag brands from sidebar → canvas using `@dnd-kit` (already installed)
  - Dragging off canvas returns item to sidebar
- **Shape Toggle**: For multi-table brands, cycle through line/square/T/X layouts using CSS Grid inside a `BrandGroup` wrapper
- **Brand Bubbles**: Circular logo + name label beneath
- **Publish Button**: Copies all `draft` rows to `live` rows in `event_map_layouts`
- **Print Mode Button**: Toggles a class that hides UI chrome, scales canvas to fill viewport

### 2. `src/components/event/EventMapCanvas.tsx` — Shared canvas component
Renders the 3-court layout proportionally. Used by both admin and public views. Props:
- `layouts`: array of placed brands with positions
- `brands`: brand data
- `interactive`: boolean (admin mode vs read-only)
- `onDrop` / `onMove` callbacks (admin only)

### 3. `src/components/event/MapBrandGroup.tsx` — Single brand on canvas
Renders 1+ 8'×3' table units in the selected shape pattern via CSS Grid. Shows circular logo bubble + name. Each table is a child div (80×30px at scale).

### 4. `src/components/event/MapSidebar.tsx` — Draggable brand sidebar (admin)
Lists unplaced brands as draggable bubbles. Brands removed from canvas reappear here.

### 5. `src/components/event/MapBrandPanel.tsx` — Click/hover detail panel (public)
Opens on click, stays until manually closed. Shows brand info, logo, description, link.

### 6. Public view integration on `/outsidedays26`
Add a new section `denver_event_map` to the `sections` array in `EventOutsideDays26.tsx`:
- Fetches `live` layout data from `event_map_layouts`
- Renders `EventMapCanvas` in read-only mode
- Below the map: reuse `BrandRepCardsSection` and `IndustryExpertCardsSection` **exactly as already used on that page** (they're already there)
- For the card interaction: the existing typeC→typeA expansion is already implemented in `ExpertCardMinimal` (click minimal → fixed overlay renders `ExpertCard` with `expanded` prop). No new logic needed — just ensure card style is set to "minimal" for the map context.

### 7. Activation branding
- "Free Thanks to [Sponsor]" label rendered as a draggable child of the activation's `MapBrandGroup`, pulling sponsor logo from the linked `sponsor_brand_id`
- Basecamp logo prominently placed in the Industry Expert zone using the existing `basecampMatchLogo` asset

### 8. Route registration in `App.tsx`
- Add `/admin/event-map` → `EventMapAdmin`

### 9. Hooks
- `src/hooks/useEventMapBrands.ts` — CRUD for `event_map_brands`
- `src/hooks/useEventMapLayouts.ts` — CRUD for `event_map_layouts`, publish logic

## Key Reuse Points
- **ExpertCardMinimal** → typeC (small circle + name)
- **ExpertCard** → typeA (full polaroid, shown in fixed overlay on click)
- **The expansion pattern**: Already in `ExpertCardMinimal.tsx` lines 21-37 — click triggers fixed overlay with `ExpertCard expanded`. This is the typeC→typeA transition. Will be used identically for map brand interactions.
- **BrandRepCardsSection / IndustryExpertCardsSection**: Imported directly, not duplicated
- **@dnd-kit**: Already installed and used in both card sections
- **CompanyLogoWithFallback**: Reused for brand bubbles on the map
- **Clearbit logo resolution**: Existing CORS-safe pattern

## Technical Notes
- Court dimensions: 94' × 50' → 940px × 500px at 10px/ft. Three courts side by side = 2820px × 500px total canvas (scrollable)
- Table unit: 8' × 3' → 80px × 30px
- Grid snap: 10px increments
- Draft/live separation prevents accidental public changes
- Print mode uses `@media print` + a toggle class to hide nav/sidebar/buttons

