

# Event Map Updates — Plan

## 1. Flip Court Orientation to Horizontal

**File: `EventMapCanvas.tsx`**
- Change `TOTAL_W = COURT_W * COURTS` (2820px) and `TOTAL_H = COURT_H` (500px)
- Update court outline rendering: `left: PADDING + i * COURT_W`, `top: PADDING` (side by side horizontally instead of stacked vertically)
- Fit-all scaling already works against `fullW`/`fullH` — no change needed there

## 2. 360° Table Rotation

**File: `MapBrandGroup.tsx`**
- Apply `transform: rotate(${layout.rotation}deg)` to the tables container div only (not the logo/name below it)
- The logo bubble + brand name stays unrotated (rendered outside the rotated container)
- Add a rotation handle button (visible on hover in admin mode) that increments rotation by 15° per click (or hold-shift for 45°)

**File: `EventMapCanvas.tsx`**
- Pass `onRotate` callback prop through to `MapBrandGroup`

**File: `EventMapAdmin.tsx`**
- Add `handleRotate` function that calls `upsertLayout(brandId, { rotation: newRotation })`

**File: `useEventMapLayouts.ts`**
- Already stores `rotation` field — no schema change needed

## 3. Replace MapBrandPanel with BrandUmbrellaSection-style Panel

When a brand is clicked (public or admin), instead of the current simple side panel, render a modal/overlay that reuses the **exact `BrandUmbrellaSection` pattern**:
- Company logo header with expand/collapse
- Inside: grid of `ExpertCardMinimal` cards (typeC) for that brand's reps
- Clicking a card triggers the existing typeC→typeA expansion (fixed overlay with full `ExpertCard`)

**File: `MapBrandPanel.tsx`** — rewrite to:
- Query `expert_city_assignments` + `industry_experts` for the brand's company name (matching `current_company`)
- Render brand info header (logo, name, description, website link) 
- Below: render matching brand reps using `ExpertCardMinimal` in a grid, same as `BrandUmbrellaSection` does
- Full-screen overlay with close button, styled like the existing event pages

## 4. Auto-add Brand Reps When Adding a Brand

**File: `EventMapAdmin.tsx`** (or `MapBrandPanel.tsx`)
- When a brand is added or when the panel opens, query `expert_city_assignments` joined with `industry_experts` where `city_slug = 'denver'` and `current_company` matches the brand name
- Display these reps automatically — no manual linking needed
- This is read-only (pulls from existing expert data, same as Denver/Portland pages)

## Summary of File Changes

| File | Change |
|------|--------|
| `EventMapCanvas.tsx` | Flip to horizontal layout (`W * 3`, `H * 1`) |
| `MapBrandGroup.tsx` | Add rotation transform on table container; keep logo/name upright; add rotation button |
| `MapBrandPanel.tsx` | Rewrite to match `BrandUmbrellaSection` style with `ExpertCardMinimal` cards |
| `EventMapAdmin.tsx` | Add `handleRotate` callback, pass `onRotate` to canvas |
| `useEventMapLayouts.ts` | No changes (rotation already supported) |

No database changes required.

