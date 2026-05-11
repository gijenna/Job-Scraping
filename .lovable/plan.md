
## Status of Updates 1-4

Already shipped in the previous loop (verified in code):
- Update 1 — "Stand out before you walk in." section in `Connect.tsx` ✓
- Update 2 — Three `build_intro_p1/p2/p3` paragraphs in `ConnectFull.tsx` ✓
- Update 3 — `email_templates.preview_text`, `candidate_welcome` row, `send-db-template-email` edge function (functionally equivalent to spec name `send-template-email` — keeping existing name to avoid breaking the deployed trigger), candidate-auth fire-and-forget, `AdminEmailTemplates.tsx` at `/admin/email-templates` ✓
- Update 4 — `data_portability_consent` column, checkbox on essentials final step (Connect.tsx) and ConnectFull sticky submit, plumbed through candidate-auth ✓

Remaining: admin CSV export column for `data_portability_consent` is not yet added — will include in this bundle.

## Update 5: Edges First glow intensity

`src/index.css` — boost `featured-bubble-pulse` keyframes:
- Inner glow radius ~2× current (e.g. base shadow `0 0 36px 8px`, peak `0 0 56px 20px`)
- Higher alpha (0.7 base / 0.85 peak) and add an outer expanding ring (`0 0 0 12px → 0 0 0 22px` fading)
- Pulse duration 1.6s (down from 2.6s)
- Saturate coral hue slightly toward `13 90% 62%`

No JSX changes; gated by existing `is_featured` check in `MapBrandGroup.tsx`.

## Update 6: Connections empty state (pre/post event)

File: `src/pages/outsidedays/ConnectConnections.tsx`

- Add constant `EVENT_END = new Date('2026-05-29T01:00:00Z')` (May 28 7pm Mountain).
- When `connections.length === 0`:
  - If `now < EVENT_END` → render new pre-event educational empty state component with the exact headings, two bulleted sections, and emphasized closing line from spec.
  - If `now >= EVENT_END` → render simpler post-event copy with an "Add a connection" CTA that opens the existing add flow (or routes to `/outsidedays26/connect/home` if no add flow exists; will reuse whatever current "add" entry point is).
- All copy wrapped in `EditableText` with new keys `conn_empty_pre_*` and `conn_empty_post_*`.
- Styling: cream on dark teal, `space-y-4`, `px-4 py-8`, headings in `font-afterparty`, bullets with coral checkmarks for parity with the landing value-prop.

## Update 7: Profile page navigation

`src/pages/outsidedays/ConnectFull.tsx` is the profile/edit page and currently does not render `ConnectBottomNav`.

- Import and render `<ConnectBottomNav active="profile" />` (or whichever prop key the component uses) inside the page wrapper, matching how `ConnectProfile.tsx` and `ConnectHome.tsx` mount it.
- Verify the same nav is present on `ConnectConnections.tsx` and `ConnectHowItWorks.tsx` (spot-check; both already import it per grep).
- No changes to nav items or behavior.

## Update 8: "Open to retail work?" field + filter

Schema (migration): `ALTER TABLE candidates ADD COLUMN open_to_retail boolean;`

Form additions (label, Yes/No tri-toggle, helper text exactly as specified):
- `ConnectFull.tsx` — add a `FieldRow` directly after the existing "Open to relocation?" row inside the same section.
- `Connect.tsx` essentials multi-step — add a compact Yes/No row on the same step that already houses career/field choices (least-disruptive insertion: step 4 footer, above Continue button), with helper text below.

Plumbing:
- Add `open_to_retail` to `candidate-auth/index.ts` insert maps for `signup_create_basics` and `signup_create`.
- Add to `candidate-profile/index.ts` allow-list so ConnectFull can save it.
- Include in `sanitizeForSave` passthrough (already generic).

Brand dashboard filter chip:
- `DashboardFilters.tsx` — add `open_to_retail?: boolean` to `Filters` type; render a `TriToggle` (or simple boolean chip) labeled "Open to retail work" near "Open to relocation".
- `DashboardWorkspace.tsx` — extend the Supabase query / in-memory filter to apply `candidates.open_to_retail = true` when the chip is on.

## Update 4 leftover: CSV export column

`AdminConnect.tsx` candidate CSV export — add `data_portability_consent` column (boolean → "Yes"/"No"). The on-screen admin candidate list already shows the column or can omit; spec only requires the CSV change.

## Out of scope
Auth, taxonomies, dashboard sort dropdown, profile completeness meter, brand_rep_welcome (follow-up), `welcome_email_sent_at`, page structure, navigation items, existing form fields. No em dashes anywhere.

## Verification
1. Map: Edges First bubble visibly larger and brighter pulse, faster cadence
2. `/outsidedays26/connect/connections` with zero connections shows new pre-event empty state today; rolls over to post-event copy after May 28 7pm MT
3. `/outsidedays26/connect/full` shows the bottom nav with Profile highlighted
4. Both signup forms collect `open_to_retail` and persist to DB
5. Brand dashboard chip "Open to retail work" filters list to `open_to_retail = true`
6. CSV export from admin includes `data_portability_consent`
