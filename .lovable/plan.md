## Five surgical fixes

### FIX 1 + 3: Brand-specific edit URL, branched by role

The current "Edit my card" link uses `rep.slug` and points to `sponsor-attract-hub.lovable.app/denverreps/`. We change it to `basecampoutdoorevents.com` and branch by role:
- Brand rep → `/denverreps/{brand-slug}`
- Industry expert (no brand_rep assignment) → `/Denverexperts/{expert-slug}`
- Kelly is treated as brand_rep automatically because she has a brand_rep assignment.

`event_map_brands` has no `slug` column — we compute one from `name` (lowercase, replace non-alphanumerics with `-`, trim hyphens). Examples: Basecamp → `basecamp`, Edges First → `edges-first`, Peak Design → `peak-design`.

**Server-side (`supabase/functions/brand-dashboard/index.ts`, `summary` action):**
- After resolving `brand`, also query `expert_city_assignments` for `expert_id = repId, city_slug = 'denver'`.
- Compute `edit_card_url`:
  - If at least one assignment has `expert_type = 'brand_rep'` → `https://basecampoutdoorevents.com/denverreps/{slugify(brand.name)}` (fallback to bare `/denverreps/` if no brand resolved).
  - Else if at least one has `expert_type = 'industry_expert'` → `https://basecampoutdoorevents.com/Denverexperts/{rep.slug}`.
  - Else → `https://basecampoutdoorevents.com/denverreps/` (safe fallback).
- Add helper `slugify()` inline in the function.
- Include `edit_card_url` in the `{ rep, brand, totals }` summary response, plus `rep.slug` if not already selected.

**Client-side:**
- `DashboardWorkspace.tsx` reads `summary.edit_card_url` and uses it for the Card preview's "Edit my card" button.
- `BrandDashboard.tsx` header link also reads from a shared source. Cleanest: `dashboardSummary()` already runs in `DashboardWorkspace`. Lift the resolved `edit_card_url` up by either:
  1. Calling `dashboardSummary` in `BrandDashboard.tsx` too, OR
  2. Adding an `onSummary` callback prop to `DashboardWorkspace` that reports the URL up to the parent.
  
  Choose option 2 (no extra fetch). Default fallback while loading: `https://basecampoutdoorevents.com/denverreps/`.

### FIX 2: Use ExpertCardCompact (Card Option B) for the dashboard preview

Card Option B = `ExpertCardCompact` (confirmed via `src/components/event/CardStylePicker.tsx` keys `polaroid|compact|minimal` → labels `A|B|C`, used in `BrandRepCardsSection.tsx` line 68).

In `DashboardWorkspace.tsx`, replace the current avatar-row block (lines 76–107) with:
```
<div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
  <div className="flex-1 min-w-0 max-w-sm">
    <ExpertCardCompact expert={rep as any} />
  </div>
  <div className="sm:text-right">
    <a href={editCardUrl} target="_blank" rel="noopener noreferrer" className="...coral pill...">
      Edit my card
    </a>
    <p className="...">Update your photo, Ask Me About, and details. Changes show up on the event map in real time.</p>
  </div>
</div>
```

`ExpertCardCompact` expects an `expert` prop matching the `Expert` shape. The `rep` from the brand-dashboard summary already has `id, full_name, photo_url, current_company, job_title, email`. Pass it through with `as any` since `ExpertCardCompact` only reads a subset. If a needed field is missing and breaks rendering, expand the rep `select(...)` in the edge function to include the necessary columns (no schema change). Validate at run time.

### FIX 4: Remove `is_featured` from Oakley
SQL via insert tool:
```sql
UPDATE public.event_map_brands
SET is_featured = false
WHERE event_slug = 'denver26' AND name ILIKE 'Oakley';
```

### FIX 5: Decouple sponsor callout text from `is_featured`

**Migration:**
```sql
ALTER TABLE public.event_map_brands
  ADD COLUMN IF NOT EXISTS sponsor_callout_text text;
```

**Data update via insert tool:**
```sql
UPDATE public.event_map_brands
SET sponsor_callout_text = 'The industry expert activation is sponsored by Edges First. Kelly makes sure that small outdoor and conservation orgs get the beautiful websites their missions deserve at THEIR budget.'
WHERE event_slug = 'denver26' AND name ILIKE 'Edges First';
```

**Code (`src/components/event/MapBrandPanel.tsx` lines 118–125):**
Replace the existing `{brand.is_featured && (...)}` callout block so it gates on `sponsor_callout_text` and renders that literal string:
```tsx
{(brand as any).sponsor_callout_text && (
  <div className="mx-6 mt-4 rounded-xl border-l-4 border-events-coral bg-events-coral/15 px-4 py-3">
    <p className="font-body text-events-cream text-[13px] leading-snug">
      {(brand as any).sponsor_callout_text}
    </p>
  </div>
)}
```
The Featured pill at line 179–183 (visual-only) stays gated on `is_featured` and is unchanged.

The map glow (driven elsewhere by `is_featured`) and the list-view FEATURED badge (`ConnectHome.tsx` BubbleTile, also `is_featured`) remain untouched.

### Out of scope
Auth flow, lead question fields, taxonomies, dashboard filter/sort logic, the destination edit pages at `/denverreps` and `/Denverexperts`. No em dashes.

### Order of execution
1. Migration: add `sponsor_callout_text` column.
2. Insert tool: clear Oakley `is_featured`; set Edges First `sponsor_callout_text`.
3. Edge function `brand-dashboard`: add `slugify`, query assignments, compute and return `edit_card_url`. Redeploy.
4. Client: `DashboardWorkspace.tsx` swap to `ExpertCardCompact`, use `summary.edit_card_url`, expose URL via callback prop. `BrandDashboard.tsx` header consumes that URL.
5. `MapBrandPanel.tsx` callout swap.
