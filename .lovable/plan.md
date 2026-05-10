## Edges First featured brand + Kelly lead capture (MVP)

This establishes a reusable "featured brand" + "brand lead capture" pattern using Edges First and Kelly as the first instance. Auth, taxonomies, dashboard filters, sort dropdown, candidate signup, and connection logging are not touched.

Heads-up: the `industry_experts` table has two "Kelly Bleck" rows (slugs `kelly-bleck` and `edges-first`); the prompt calls her "Kelly Lichti." PLEASE IGNORE KELLY LICHTI. The correct name is Kelly Bleck. I will treat the `edges-first`-slug expert as Kelly for this work and only modify that record. If the name is wrong, I will fix the spelling on that one row only. Confirm in the next pass if you want a name correction.

### Change 1: Logo upload + propagation

- Copy the uploaded `edges-first-logo_1.png` into `src/assets/edges-first-logo.png`.
- Also upload it to the `event-photos` storage bucket so it has a stable public URL usable from server-rendered places (map, sheets, dashboard, expert card).
- Update `event_map_brands.logo_url` for Edges First to that storage URL.
- Update the matching `industry_experts` row (Kelly / edges-first) so any "company logo" rendering on her expert card uses the same URL via `company_domains`/logo override path.
- No new logo lookup logic needed; existing `MapBrandGroup`, `MapBrandPanel`, list view, and `ConnectPersonSheet` all read `logo_url`. The sponsor credit bubble in `ConnectHome` ListView already reads from the brand record, so it picks up the change automatically.

### Change 2: Featured brand glow + sponsor callout

`event_map_brands.is_featured` already exists (boolean, default false). No schema change needed; just set Edges First's row to true.

- `MapBrandGroup.tsx`: when `brand.is_featured`, render an absolutely-positioned glow ring behind the logo bubble. Implement as a Tailwind class `featured-bubble-glow` defined in `index.css` using a coral (`hsl(var(--events-coral))`) box-shadow with a slow `@keyframes pulse-glow` (2.5s ease-in-out infinite, opacity + shadow-spread oscillation). Continuous, subtle. Other bubbles untouched.
- `MapBrandPanel.tsx` (the brand modal opened from the map): at the very top, above the existing logo/name header, render a `FeaturedSponsorCallout` block only when `brand.is_featured`. Coral-tinted background (`bg-events-coral/15`), coral left border, small body copy: "The industry expert activation is sponsored by Edges First. Kelly makes sure that small outdoor and conservation orgs get the beautiful websites their missions deserve at THEIR budget." Copy is editable via `EditableText` keyed `brand_modal_featured_callout_<brand_id>` so the future generalized version reuses the same surface per-brand.

### Change 3: List-view sponsor credit copy

In `ConnectHome.tsx` ListView the existing sponsor row uses `EditableText` with `settingKey="connect_expert_zone_sponsor_credit"`. Update the secondary CTA line below the logo to a new `EditableText` (`connect_expert_zone_sponsor_cta`) defaulting to "SAY THANK YOU!" rendered uppercase, bold, coral. Keep the logo bubble + click-through to Kelly's expert card untouched.

### Change 4 & 5: Lead capture UI + data model

New table `brand_lead_responses`:

- `id uuid pk`, `created_at`, `updated_at`
- `candidate_id uuid not null`
- `brand_id uuid not null` (references `event_map_brands.id` conceptually; no FK to keep parity with other tables here)
- `response_value text check in ('soon','eventually')`
- `question_text text not null`
- Unique `(candidate_id, brand_id)`
- RLS: service-role full access only (matches the rest of the connect/* tables). All reads/writes go through new edge function endpoints.

New edge function routes (added to existing `connect-notes` style pattern; simplest is a new function `brand-leads`):

- `GET /brand-leads/me?brand_id=` -> returns the current candidate session's response or null.
- `POST /brand-leads/upsert` body `{ brand_id, response_value, question_text }` -> upserts on (candidate_id, brand_id).
- `POST /brand-leads/clear` body `{ brand_id }` -> deletes the row (used when user picks "Not interested").
- `GET /brand-leads/list?brand_id=` -> brand-rep authenticated; returns leads joined with candidate fields (first_name, last_name, email, linkedin_url, current_title, current_company, photo_url, response_value, updated_at). Authorization: caller's brand-rep session subject must belong to that brand.

Frontend lead-capture component `BrandLeadCapture.tsx` rendered:

1. At the bottom of `ConnectPersonSheet` body when the opened expert is Kelly (match by expert id or by `assignment.expert_type === 'industry_expert'` + sponsor brand id; safest is a prop `brandLeadCaptureBrandId?: string` passed from `ConnectHome` when opening Kelly's card).
2. At the bottom of `MapBrandPanel` when the opened brand is Edges First (rendered when `brand.is_featured && brand.has_lead_capture` -- for MVP gated on `brand.id === EDGES_FIRST_ID` constant pulled from settings, see below).

UI: heading "Web work for outdoor or conservation orgs?", muted body copy, question prompt, three radio buttons. "Soon" or "Eventually" => upsert; "Not interested" => clear. After save, render confirmation "Got it. Kelly will see you on her leads list." Selection persists across re-opens (initial fetch on mount).

To avoid hard-coding ids, store `lead_capture_brand_id` and the question_text in `event_settings` for `outsidedays26`. The component receives the brand id by prop; the sheet/panel decides whether to render based on a small `useLeadCaptureConfig()` hook.

### Change 6: Brand dashboard "Leads" section

`DashboardWorkspace.tsx` gets a new top-level tab/segmented control: "Candidates" (existing) | "Leads" (new). Filters/sort dropdown on the Candidates view are untouched.

New `LeadsPanel.tsx` rendered when "Leads" is active:

- Header "Leads from candidates", subtitle copy from prompt, both via `EditableText`.
- Summary line "X leads total. Y said 'soon,' Z said 'eventually.'" computed from fetched data.
- Filter chips: All / Soon / Eventually. Sort selector: Newest first (default) / Group by Soon then Eventually.
- Lead cards reuse styling tokens from `CandidateCard.tsx` (no logic shared with candidate filters): photo, name, title @ company, response chip (Soon = coral, Eventually = yellow), date answered, Email + LinkedIn buttons, "View full profile" opens existing `CandidateProfileDrawer`.
- Top-right "Export to CSV" button. Client-side CSV from currently loaded rows (respects active filter? -> always exports the unfiltered full list to keep behavior predictable; filename `edges-first-leads-YYYY-MM-DD.csv`). Columns per spec.

Data: fetch via the new `GET /brand-leads/list?brand_id=` using the brand-rep session token. Only reps whose brand matches the brand_id receive data.

### Verification

After implementation I will check, in the preview:

1. Map: Edges First bubble shows new logo + animated glow; tapping opens the modal with the sponsor callout banner above the header.
2. List view: Edges First listing renders the new logo; sponsor credit row shows "SAY THANK YOU!" uppercase coral CTA under the bubble.
3. Kelly expert card (opened from list, map sponsor row, and her own card): bottom shows lead capture, three radios; selecting Soon/Eventually saves and shows confirmation; reload re-opens with selection intact; switching to Not interested clears the row in DB.
4. Edges First brand modal: same lead capture component, same persistence behavior, separate from but writing to the same `(candidate_id, brand_id)` row.
5. Brand dashboard while signed in as a rep on Edges First: Leads tab visible, counts/filter/sort work, CSV export downloads the correct file with the listed columns. Signed in as a rep from another brand: Leads tab shows empty state for that brand (no Edges First data leaks).
6. No em dashes anywhere in new copy.

### Files I expect to touch (technical detail)

- New: `supabase/migrations/<ts>_brand_lead_responses.sql`, `supabase/functions/brand-leads/index.ts`, `src/components/connect/BrandLeadCapture.tsx`, `src/components/connect/dashboard/LeadsPanel.tsx`, `src/assets/edges-first-logo.png`.
- Edit: `src/components/event/MapBrandGroup.tsx` (glow), `src/components/event/MapBrandPanel.tsx` (callout + lead capture mount), `src/pages/outsidedays/ConnectHome.tsx` (sponsor CTA copy + pass brand id to Kelly sheet), `src/components/connect/ConnectPersonSheet.tsx` (mount lead capture), `src/components/connect/dashboard/DashboardWorkspace.tsx` (Leads tab), `src/lib/connect-session.ts` (helpers for the new endpoints), `src/index.css` (glow keyframes), and a one-time data update to set `event_map_brands.is_featured=true` and `logo_url` for Edges First.

### Open question

The DB has the expert as "Kelly Bleck," but the prompt names her "Kelly Lichti." I will keep the existing name unless you confirm a rename. Reply with the correct full name if it should change; otherwise I will leave it as-is.