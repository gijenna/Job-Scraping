## Goal
Add three new fields (`offers_remote`, `currently_hiring`, `culture_blurb`) to brands so they can be edited from BOTH the admin map (`/admin/event-map`) and the "Meet the Teams" section on `/outsidedays26`. Edits in one place reflect in the other. Candidate-facing display is admin-only for now (visible to public only once an admin fills them in - actually, per spec, "remain only viewable to admin unless/until I edit them" - i.e. once filled, they show publicly).

## Storage (single source of truth)
Use the existing `event_map_brands` table (denver26 rows already match the brands shown on Meet the Teams). Add three nullable columns via migration:

- `offers_remote text` (allowed values: 'Fully remote', 'Hybrid', 'In-office only', 'Varies by role')
- `currently_hiring text` (allowed values: 'Yes, actively hiring', 'Not actively hiring', 'Always open to great people')
- `culture_blurb text` (max 280 chars enforced in UI)

No CHECK constraints (per project rules - validate in UI). No new RLS needed (table already has auth update policy).

## Admin Map edit form (`src/pages/EventMapAdmin.tsx`)
In the existing brand edit row, after the Sponsor cell and before Actions, the row already wraps. Instead of adding columns, expand the edit UI by appending a "Hiring info" sub-row that appears below the brand row when `isEditing === brand.id`, spanning all columns via a `<TableRow>` with a `colSpan` cell containing:
- Label "Hiring info"
- Select for `offers_remote` with the 4 options + "(none)"
- Helper: "What is your remote work policy?"
- Select for `currently_hiring` with the 3 options + "(none)"
- Helper: "What's your current hiring status?"
- Textarea (maxLength 280) for `culture_blurb` with live char counter (`{n}/280`)
- Helper: "One or two sentences about your culture or what you offer. Candidates will see this on your brand card."

`editFields` initializer (line 203) and `saveEdit` already pass through arbitrary fields, so just add the three keys.

## Meet the Teams editing (`src/components/event/BrandUmbrellaSection.tsx`)
Pass `mapBrands` from `EventOutsideDays26.tsx` (already fetched as `mapBrands`) down through `FeaturedTeamsSection` to `BrandUmbrellaSection`. For each group, match by case-insensitive company name to a `MapBrand` row.

Replace the current ad-hoc per-brand `event_settings` careers/blurb editor with the canonical fields:
- If the matched map brand has any of the three values, show them on the card header (small text under company name): a "Hiring" badge, remote-policy chip, and the blurb.
- For admin: show inline editors (a small dropdown + dropdown + textarea) right under the header, persisting via `supabase.from('event_map_brands').update(...).eq('id', mapBrand.id)`. If no matching row exists, show a "Add hiring info" button that inserts a new row (`event_slug: 'denver26'`, `name: group.company`, the field) so subsequent edits update it.
- Use `useEventMapBrands('denver26')` inside the component (or pass setter from parent) so updates refresh both views. Simplest: pass `mapBrands` + an `onUpdateBrand(id, patch)` callback through from the page, which already has access to the hook.

Public visibility rule: render each of the three values only if non-empty. Admin always sees the editor.

## Files touched
- New migration: add 3 columns to `event_map_brands`.
- `src/hooks/useEventMapBrands.ts` - no change (already exposes `updateBrand`, `addBrand`).
- `src/pages/EventMapAdmin.tsx` - add Hiring info sub-row in edit mode + extend `editFields` init.
- `src/pages/EventOutsideDays26.tsx` - pass `mapBrands` and `updateBrand`/`addBrand` into `FeaturedTeamsSection`.
- `src/components/event/FeaturedTeamsSection.tsx` - forward props to `BrandUmbrellaSection`.
- `src/components/event/BrandUmbrellaSection.tsx` - lookup map brand by company name; render values; admin inline editor wired to `updateBrand`/`addBrand`.

## Notes
- No em dashes in any new copy.
- Existing brand card visual structure (logo, name, table count, website, reps grid) is untouched.
- The legacy `event_settings`-based `brand_*_careers_url` / `brand_*_hiring_blurb` editors are kept as-is to avoid disturbing the existing "website link" workflow you mentioned.
