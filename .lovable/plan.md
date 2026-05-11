## Five surgical fixes

### FIX 1: Drop blocking CHECK constraint on `brand_lead_responses`
Migration:
```sql
ALTER TABLE public.brand_lead_responses
  DROP CONSTRAINT IF EXISTS brand_lead_responses_response_value_check;
```
No replacement constraint. `response_value` accepts any string.

### FIX 2: Lead capture UI cleanup (`src/components/connect/BrandLeadCapture.tsx`)
- Remove the `opts.push({ value: "not_interested", label: "Not interested" });` line.
- Remove the `if (value === "not_interested") { … brandLeadClear … }` branch from `select`; simplify to always upsert.
- Below the radio group, when `choice` is set, render a small text button: `Clear my answer` (cream/70 text, hover coral, `text-xs`). On click: call `brandLeadClear(brandId)`, then `setChoice(null)` and `setSavedAt(null)`.
- Keep the "Got it. {brand} will see your response." confirmation logic.

### FIX 3: FEATURED badge in list view
- Locate the existing FEATURED badge component used inside the brand modal (likely in `src/components/event/MapBrandPanel.tsx` or a sibling). Reuse the same JSX/classes.
- Find the brand list view component (the list rendering on `/outsidedays26` map page that shows brand rows). Likely `src/components/event/` folder or `MapBrandPanel`. Add the FEATURED pill next to the brand name when `brand.is_featured === true`.
- Pure presentation change.

### FIX 4: Update Oakley row data
Insert tool (UPDATE on existing row matched by `name = 'Oakley'` and `event_slug = 'denver26'`):
```sql
UPDATE public.event_map_brands
SET lead_question_intro   = 'Have you visited the new Oakley store in RiNo? It''s modeled after their store in Milan, Italy.',
    lead_question_text    = 'What would get you there?',
    lead_question_option_1= 'A discount',
    lead_question_option_2= 'A Meta glasses or goggles demo',
    lead_question_option_3= 'An in-store event like yoga',
    lead_question_active  = true,
    lead_capture_visible_to_brand = false,
    is_featured           = true
WHERE event_slug = 'denver26' AND name ILIKE 'Oakley';
```
No other Oakley fields touched.

### FIX 5: Admin Leads page

**New file:** `src/pages/AdminLeads.tsx`
- Auth gate using `isAdminUser` (mirror `AdminConnect.tsx` pattern: getUser → redirect to `/admin` if not admin).
- Calls `supabase.functions.invoke("admin-leads", { body: {} })`.
- State: `selectedBrandId` (default `"all"`).
- Layout (Dark Teal + cream styling matching `AdminConnect.tsx`):
  - Header bar with Back button and title `All Leads` + subtitle.
  - Filter `<select>` "Filter by brand" populated from `brands` array (only brands with ≥1 lead). Default option `All brands`.
  - For each brand (or just selected), render a section:
    - Heading: brand name, lead question text, total count.
    - "Export CSV" button (per brand). CSV columns: Name, Email, Title, Company, LinkedIn, Response, Answered At.
    - Candidate cards: photo (circle, fallback initials), name, `current_title @ current_company`, response chip (`response_label || response_value`), formatted `updated_at`.
    - Actions: Email (`mailto:`), LinkedIn (open new tab), View full profile (link to `/outsidedays26/profile/{candidate_id}` if route exists, else omit; will check route in implementation).
  - Empty state copy as specified.

**Route registration:** add `/admin/leads → AdminLeads` in `src/App.tsx`.

**Nav link:** in `src/pages/AdminConnect.tsx` header, add a `View all leads` button next to the existing `Email templates` link, navigating to `/admin/leads`.

### Out of scope
Map glow, signup flow, auth, taxonomies, dashboard filter logic, any other components. No em dashes.

### Order of execution
1. Migration (FIX 1).
2. Insert/update Oakley row (FIX 4).
3. Code edits: `BrandLeadCapture.tsx` (FIX 2), list view badge (FIX 3), `AdminLeads.tsx` + `App.tsx` + `AdminConnect.tsx` link (FIX 5).
