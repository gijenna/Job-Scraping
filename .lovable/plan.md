

# Admin Section Reordering + Photo Swapping (No Credits)

## What You Get

1. **Drag-to-reorder sections** — Admin sees up/down arrow buttons on each section to move it higher or lower on the page. Order is saved to `event_settings` and persists across sessions.

2. **Swap photos inline** — Admin sees a small camera/swap icon on any section that contains photos (hero backgrounds, gallery images, venue photos). Clicking opens a file picker, uploads to the `event-photos` bucket, and saves the new URL to `event_settings`. No credits needed.

Both features build on the existing `HideableSection` + `event_settings` + `EditableTextProvider` pattern already used across all pages.

## How It Works

### Section Reordering

- Each `HideableSection` already has a `sectionKey`. We'll store a `section_order_{pageSlug}` setting as a JSON array of sectionKeys in the desired order (e.g. `["pnw_hero","pnw_ticker","pnw_featured_teams",...]`).
- A new `usePageSectionOrder` hook reads this setting and returns the ordered list. Each page component will define its sections as a data array (key + component) and render them in the stored order.
- `HideableSection` gets two new admin-only buttons (up/down arrows) next to the existing hide/show toggle. Clicking swaps positions and saves the new order array.
- Default order = the hardcoded array order in each page file (current behavior preserved when no setting exists).

### Photo Swapping

- A new `SwappablePhoto` wrapper component. Admin sees a small overlay icon on hover. Clicking opens a file input, uploads the selected image to `event-photos/{pageSlug}/`, and saves the resulting URL to `event_settings` under a key like `photo_{sectionKey}_{index}`.
- Components that currently use hardcoded image imports (hero backgrounds, gallery photos, venue images) will check `event_settings` for an override URL first, falling back to the hardcoded default.
- Works for both single images (hero background, venue) and multi-image sections (gallery, "How to Tap In" photos).

## Files Changed

| File | Change |
|------|--------|
| `src/hooks/usePageSectionOrder.ts` | **New** — reads/writes section order from `event_settings` |
| `src/components/event/HideableSection.tsx` | Add up/down reorder buttons for admin |
| `src/components/event/SwappablePhoto.tsx` | **New** — admin photo swap overlay with upload |
| `src/pages/EventPNW26.tsx` | Refactor sections into ordered data array |
| `src/pages/EventOutsideDays26.tsx` | Same refactor |
| `src/pages/GatherPNW.tsx` | Same refactor |
| `src/pages/GatherDenver.tsx` | Same refactor |
| Key photo components (RegistrantHero, BasecampEventsGallery, RegistrantHowToTapIn, RegistrantVenue, DenverGallery, etc.) | Wrap images in `SwappablePhoto` |

## No Database Changes Needed

Everything stores in the existing `event_settings` table using the existing upsert pattern. No migrations required.

