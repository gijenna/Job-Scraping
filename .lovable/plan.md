

# Plan: Court Orientation, Expert Zone as Map Element, Delete Fix

## 1. Flip Court Orientation (rotate each court 90° right)

**File: `MapBrandGroup.tsx`** — Swap the exported constants:
- `COURT_W = 500` (was 940) — each court is now 50' wide
- `COURT_H = 940` (was 500) — each court is now 94' tall
- Three courts side by side = 1500px wide × 940px tall (connected on the 94'/940px long side)

**File: `EventMapCanvas.tsx`** — Update court markings:
- Half-court line becomes vertical (left-right divider at `COURT_W / 2`) instead of horizontal
- Center circle repositioned for new aspect ratio
- Court labels updated to reflect rotated view

Canvas total: 1500 + padding vs 940 + padding — much more landscape-friendly, fits viewport better.

## 2. Industry Expert Zone as Draggable Map Activation

The Expert Zone becomes a real `event_map_brands` entry (special activation) that lives on the canvas:

**File: `MapExpertZone.tsx`** — Rewrite into two parts:
- **Admin panel version**: Shows all Denver-assigned experts with check/X toggle buttons. Checked = "attending this event map" (tracked via a local state list or a new field). Unchecked experts show a checkmark button; checked ones show an X button.
- **Canvas element**: Rendered on the map like any other brand group but with expert photo bubbles inside. Size is dynamic based on admin-set table count.

**File: `EventMapCanvas.tsx`** — Add special rendering for the Expert Zone brand:
- When a brand is the Expert Zone (identified by a convention like name = "Industry Expert Zone" or `is_activation = true` with a flag), render it with the Basecamp logo and expert photo bubbles instead of a single brand logo
- Include "Free thanks to [sponsor]" label using the same sponsor assignment system

**File: `EventMapAdmin.tsx`** — Add Expert Zone management:
- Auto-create an "Industry Expert Zone" brand entry if it doesn't exist
- Below the canvas, show the expert toggle panel (check/X for each Denver expert)
- Admin can set table count for the zone (controls physical size on map)
- Sponsor assignment works via existing `MapSponsorAssigner` since it's an activation

**File: `MapBrandGroup.tsx`** — Add expert zone variant:
- Accept optional `experts` prop
- When present, render expert photo bubbles in a grid inside the tables area instead of a single logo bubble

## 3. Fix Activation Deletion

**File: `EventMapAdmin.tsx`** — The delete button exists but needs to also remove associated layouts:
- When `deleteBrand(id)` is called, also call `removeLayout(id)` first to clean up any canvas placement
- Ensure the delete button is visible and functional for all brands including activations

## Summary

| File | Change |
|------|--------|
| `MapBrandGroup.tsx` | Swap COURT_W/COURT_H (500/940), add expert zone variant rendering |
| `EventMapCanvas.tsx` | Fix court markings for rotated orientation, render expert zone brand specially |
| `MapExpertZone.tsx` | Rewrite as admin toggle panel (check/X per expert) + track selected experts |
| `EventMapAdmin.tsx` | Auto-create expert zone brand, wire expert toggles, fix delete to also remove layouts |
| `MapSponsorAssigner.tsx` | No changes (expert zone is just another activation) |

No database changes needed — the Expert Zone is stored as a regular `event_map_brands` row with `is_activation = true`.

