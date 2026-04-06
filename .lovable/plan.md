
Goal: make /admin/event-map reuse the Denver registration-page brand list, keep hyperlinks editable, stop rotation from turning into accidental drag/removal, and make the Industry Expert Zone table count stay consistent across draft/live/public views.

1. Auto-populate map brands from Denver bubble logos
- Use the same source as the Denver registration page: `event_logos` with `event_slug = "denver26-bubbles"`.
- Add a sync/import action in `EventMapAdmin.tsx` that reads those logos and creates missing `event_map_brands` entries automatically.
- Map fields as:
  - `name` ← logo name
  - `website_url` ← logo url
  - `logo_url` ← logo logo_url, or favicon fallback from domain/url
  - `event_slug` ← `denver26`
  - sensible defaults for `table_count` and `is_activation = false`
- Deduplicate by brand name so existing map brands are not recreated.
- Keep manual add available for activations or one-off brands not in the bubble list.

2. Make hyperlink editable in the admin table
- Extend the existing edit row in `EventMapAdmin.tsx` to include `website_url`.
- Save that field through `updateBrand`, so map panel links and logo fallbacks always reflect the edited URL.
- Also include the URL in the quick-add/edit flow for clarity.

3. Fix rotation so it does not drag or jump off the map
Current issue: rotation button clicks still interact with the draggable wrapper, and rotated bounds are not respected.
- In `MapBrandGroup.tsx` and `MapExpertZoneGroup.tsx`, prevent drag logic from starting when the click originates from the rotate/shape controls.
- Separate “drag handle area” from “action buttons” so rotate clicks do not trigger movement.
- Re-anchor rotation around the visual center and compute a safe wrapper box for rotated content, so repeated rotations do not shift the placement unexpectedly.
- Keep logo/title upright outside the rotated table layer.

4. Keep the Industry Expert Zone size consistent everywhere
Current issue: the zone is partly driven by selected experts in admin state, while views fall back to a different default.
- Make all views derive the zone size from the persisted `event_map_brands.table_count` plus persisted layout shape/rotation.
- Pass the same expert-zone brand record and selected experts consistently into admin, print, and public map canvases.
- Update `MapExpertZoneGroup.tsx` so rendered table geometry always comes from the brand’s saved `table_count`, not a local/default fallback.
- Verify draft publish copies the current expert-zone layout/rotation/shape exactly into live.

5. Align public/live map with the admin expert-zone behavior
- The public Denver page currently uses live layouts and map brands, but does not appear to load expert-zone attendee selections from shared persisted state.
- Refactor so the zone’s displayed experts and footprint are based on one consistent source used by both admin and public map rendering.
- Preserve sponsor display for the expert zone in all views.

Files to update
- `src/pages/EventMapAdmin.tsx`
  - add bubble-logo sync/import action
  - add editable URL column/field
  - ensure expert-zone table count edits persist and reflect immediately
- `src/components/event/MapBrandGroup.tsx`
  - fix rotate vs drag interaction
  - stabilize rotated positioning
- `src/components/event/MapExpertZoneGroup.tsx`
  - same rotate/drag fixes
  - enforce saved table-count rendering
- `src/components/event/EventMapCanvas.tsx`
  - keep placement stable with rotated items
  - ensure expert-zone rendering uses the same persisted brand/layout data
- possibly `src/hooks/useEventLogos.ts`
  - reuse for the import/sync action rather than duplicating fetch logic

Technical notes
- The Denver “bubble logos” already come from `useEventLogos("denver26-bubbles")` on the registration page, so that is the cleanest source to sync from.
- `website_url` already exists on `event_map_brands`; it just is not editable in the current admin table.
- Rotation bug likely comes from the absolute wrapper still receiving `onMouseDown` during button clicks plus lack of a rotated bounding box.
- Expert zone inconsistency likely comes from admin-only `selectedExpertIds` state and/or public view not sharing the same expert-zone inputs as admin/live.
