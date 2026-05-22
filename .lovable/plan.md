## Goal

A reusable "parent company" relationship between brands. VF Corp is the first use case; the same fields will work for Helly Hansen → Musto, etc.

## Behavior

**Map view (Connect + Event Map):**
- Parent (VF Corp) renders as a single, oversized table — bigger than normal brands, smaller than Outside.
- Child brands with a parent_brand_id are hidden from the map (no separate bubble).
- Child logos are rendered as a logo strip/cluster on the parent's table (visual activation).
- Clicking anywhere on the parent table opens the **VF Corp** brand card.

**List view (Connect):**
- All brands (parent + every child) still appear as their own list entries — unchanged.
- Clicking any child opens that child's brand card.

**Brand card aggregation (who shows up):**
- **Parent (VF Corp) card:** every rep + expert from VF Corp and all children.
- **Primary child (The North Face):** same full list as parent (Devin included).
- **Non-primary child (Vans, Smartwool, etc.):** full parent rollup **minus** anyone flagged as restricted.
- A rep/expert can be flagged "restricted to specific brands" — they then only appear for the brands listed (e.g., Devin → TNF + VF Corp). No admin UI for now; I'll set these via DB when you tell me.

**TNF cleanup:**
- Remove all `industry_expert` assignments currently on The North Face (Daniel Mattie, etc.). Brand reps stay. Experts continue to appear in the Industry Expert activation.

## Schema

```sql
ALTER TABLE event_map_brands
  ADD COLUMN parent_brand_id uuid REFERENCES event_map_brands(id) ON DELETE SET NULL,
  ADD COLUMN primary_child boolean NOT NULL DEFAULT false,
  ADD COLUMN map_size text NOT NULL DEFAULT 'normal'; -- 'normal' | 'large' | 'xl'

ALTER TABLE event_map_brands
  ADD COLUMN child_logo_ids uuid[] NOT NULL DEFAULT '{}',  -- ordered list of child brand ids to render on parent table
  ADD COLUMN extra_logo_urls jsonb NOT NULL DEFAULT '[]'::jsonb; -- [{name,url,logo_url}] for ad-hoc uploads not tied to a brand row

ALTER TABLE industry_experts
  ADD COLUMN restricted_to_brand_names text[] DEFAULT NULL; -- if set, only show under these brand names (matched same way as current_company)
```

Using `restricted_to_brand_names` (text) so it works with the existing name/alias matching pattern rather than introducing FK coupling.

## Code changes

1. **`useEventMapBrands` + types** — surface new columns.
2. **`EventMapCanvas` / `MapBrandGroup`** — skip brands with `parent_brand_id`; render `map_size='xl'` larger; render child-logo strip on parent.
3. **Connect map layer** (the customer-facing map on `/connect`) — same skip + size logic; click on parent → open parent's brand card.
4. **Brand card data fetch** (CandidateProfileDrawer / brand card view) — when opening a brand:
   - If parent → union of own + all children's reps/experts.
   - If primary_child → same union.
   - If child (non-primary) → union, filtered by `restricted_to_brand_names`.
5. **Admin Event Map editor** — on a brand: pick parent, mark primary_child, choose map_size, multi-select child logos from existing brand rows, upload extra logos.
6. **Data:** set VF Corp `map_size='xl'`, mark TNF + other VF brands with `parent_brand_id = VF`, TNF `primary_child=true`, add child_logo_ids. Set Devin's `restricted_to_brand_names = ['The North Face','VF Corp']`. Delete TNF industry_expert assignments.

## Notes

- No UI for the per-rep exclusion list yet — you tell me, I set it via DB.
- Existing alias-based rep matching is unchanged; rollup happens on top of it.
- Parent-company model is fully generic — works for any future parent/child group.