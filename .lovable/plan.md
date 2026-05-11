## Bundle: 7 surgical updates

Note on schema: there is no `brands` table — the event brands live in `event_map_brands`. All "ALTER TABLE brands" statements in your spec map to `event_map_brands`. Confirming that's the intended target before I migrate.

---

### 1. Hide Court 3 by default (admin toggle)

- Use `event_settings` (key/value table already in use). Add row `event_slug='outsidedays26'`, `setting_key='show_court_3'`, `setting_value='false'`.
- `EventMapCanvas.tsx` + `MapBrandGroup.tsx`: read setting via `useEventSettings`, render `COURTS = showCourt3 ? 3 : 2`, recompute `TOTAL_W = COURT_W * visibleCourts`. Brands placed past x > 2*COURT_W still render (so admin can see and reassign) but are flagged in the admin sidebar with a "Court 3 hidden" pill.
- Admin: add a toggle in `AdminConnect.tsx` (or `EventMapAdmin.tsx`, whichever Jenna uses) that writes to `event_settings`. Default off.

### 2. Generalize lead capture

Migration on `event_map_brands`:
- `lead_question_text text`, `lead_question_intro text`, `lead_question_option_1 text`, `lead_question_option_2 text`, `lead_question_option_3 text`
- `lead_question_active boolean default false`
- `lead_capture_visible_to_brand boolean default true`

Migration on `brand_lead_responses`:
- `response_label text` (actual option text)

Update `BrandLeadCapture.tsx`:
- Accept the brand row; render only when `lead_question_active`.
- Render `lead_question_intro` (optional), generic heading "A quick question", `lead_question_text`, then options 1/2/3 (skip nulls). Always append a "Not interested" option that maps to clear (existing behavior).
- On select: store `response_value` = stable slug ("option_1" / "option_2" / "option_3") and `response_label` = the actual text. Kelly's existing rows ("soon"/"eventually") stay untouched; map them in the brand-leads function so her dashboard still shows the same labels.
- Mount points already exist (Kelly expert sheet, Edges First brand modal). Add same mount on every brand card/modal where `lead_question_active`.

Backfill Edges First (data insert) with the exact strings provided, mapping option_1 → "soon", option_2 → "eventually" so legacy reads stay consistent.

### 3. Basecamp lead question

Data insert: update Basecamp row in `event_map_brands` with the four strings, `lead_question_active=true`, `lead_capture_visible_to_brand=true`. No code change beyond #2.

### 4. Oakley brand + admin-only leads

- Insert new `event_map_brands` row "Oakley", `is_featured=true`, `lead_capture_visible_to_brand=false`, `lead_question_active=true`, with the supplied intro/question/options. Logo: pull official Oakley wordmark SVG.
- Insert `event_map_layouts` row placing Oakley at an open spot on Court 1 (Jenna can drag in admin).
- No `brand_reps` row created. The brand modal already hides the reps section when none exist; verify and adjust if needed.
- New admin page `src/pages/AdminLeads.tsx` at `/admin/leads`:
  - New edge function `admin-leads` (service role) returns all `brand_lead_responses` joined with brand + candidate, regardless of `lead_capture_visible_to_brand`.
  - Filter dropdown by brand. Per-brand "Export CSV" button. Add link from `AdminConnect.tsx` header.

### 5. Leads tab CTA logic

`LeadsPanel.tsx`:
- Always render the tab.
- Branch on the brand row:
  - `active && visible_to_brand` → existing list, subtitle becomes `Candidates who answered: {lead_question_text}`.
  - `!active` → render new CTA card: heading, body, and button `Email Jenna →` with mailto including `Lead gen beta — {brand_name}`.
  - `active && !visible_to_brand` → hide the tab entirely (Oakley case).
- `brand-dashboard` edge function: include the lead question fields on the brand payload so the panel can branch.

### 6. "View event map" header link

In `BrandDashboard.tsx` header row, add small `<a href="/outsidedays26" target="_blank" rel="noopener">View event map</a>` — cream, coral on hover, placed left of "Sign out".

### 7. Edit my card affordances

Brand rep dashboard (`BrandDashboard.tsx`):
- Header: small "Edit my card" link next to Sign out / View event map → opens `https://sponsor-attract-hub.lovable.app/denverreps/{brand-slug}` new tab. Slug derived from `brand.name` via existing slugify or stored `brand.slug` if present (otherwise compute lowercase-hyphen).
- Top of dashboard: render existing Card Option B preview component (locate in `src/components/event/BrandRepCardsSection.tsx` or `CardStylePicker.tsx` — confirm during build) bound to the logged-in rep, then a primary button "Edit my card" with helper text exactly as specified.

Industry expert dashboard: same pattern — Card Option B preview at top + "Edit my card" → existing expert edit URL (locate via `ExpertInvite.tsx` route).

Edit flow itself is untouched.

---

### Verification checklist
Court 3 hidden by default, toggle works, courts 1/2 fill canvas; Basecamp + Oakley show new questions; selecting saves both `response_value` slug and `response_label` text; `/admin/leads` shows everything incl Oakley; Edges First leads still work for Kelly; non-Edges brand dashboards see CTA; Oakley dashboard tab hidden (n/a since no reps); header link + Edit my card buttons present in both dashboards. No em dashes.

### Out of scope (per your DO NOT list)
Candidate signup, welcome email, portability checkbox, connections empty state, profile nav, glow, retail field, auth, taxonomies, dashboard filter logic, sort dropdown.

### Question before I migrate
Confirm: lead_question_* columns go on `event_map_brands` (the only brand table in this project), not a separate `brands` table — yes?
