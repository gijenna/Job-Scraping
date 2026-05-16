## Bundle of 7 surgical fixes

### Fix 1: Remove brand-logo overlay from circular avatars

The corner-pinned company logo on circular photo avatars gets clipped and looks broken. Brand context is already shown in the text under each circle, so the overlay is redundant.

Remove the `<div className="absolute -bottom-1 -right-1 ... CompanyLogoWithFallback ...">` block from:

- `src/components/experts/ExpertCardMinimal.tsx` (lines 55-66) — used in the candidate-facing "Industry pros you'll meet in person" section and the brand-modal reps grid in `MapBrandPanel`.
- Audit and remove the same `-bottom-* -right-* CompanyLogoWithFallback` pattern (if present) on the brand dashboard rep card preview, expert dashboard rep card preview, and the "Your team at this event" section.

Keep the LinkedIn corner pin and the text label below the circle. Do not touch `ExpertCard.tsx` (full polaroid card) where the inline company logo sits next to text, not overlaid on the photo.

### Fix 2: "Register for the event" reminder banner on Connect entry

Add a small persistent banner above the form on:

- `/outsidedays26/connect` (`src/pages/outsidedays/Connect.tsx`)
- `/outsidedays26/connect/full` (`src/pages/outsidedays/ConnectFull.tsx`)

Copy: "Haven't registered for Outside Days yet? Register here →"

- Cream/muted background, "Register here" rendered as a coral link.
- Opens `https://basecampoutdoor.typeform.com/outsidedays` in a new tab.
- Implement once as a small `<RegisterReminderBanner />` component in `src/components/connect/`.
- Wire the copy through `EditableText` keyed under the existing `outsidedays26-connect` page slug so Jenna can edit it.
- Do NOT show on `ConnectHome`, `ConnectProfile`, `ConnectConnections`, or any post-login route. Already gated naturally because Connect.tsx redirects logged-in users to `/connect/home` on mount.

### Fix 3: Conditional reorder of comprehensive form for high-intent candidates

In `ConnectFull.tsx`, when `c.poachable_status` is `"Always open to the right opportunity"` or `"Ready to jump"`, render a new `SectionBlock` titled "What you're looking for" immediately after the "About you" Save Basics section, containing (in order):

- Salary expectations (`min_pay_rate`)
- Dream role title (`dream_role_title`)
- Dream companies (`dream_companies`)
- Open to relocation (`open_to_relocation` plus its dependent `relocation_*` fields)
- Remote preference (`remote_preference`)

When poachable_status is anything else (including "I'm off market" or empty), keep the current section order. The same fields stay rendered in their original locations only when not promoted, so we conditionally hide them in their default slot when promoted — no double-render.

Reorder is reactive to current `poachable_status`, so changing the value mid-form moves the section live. No backend or schema changes.

### Fix 4: Industry-expert "Edit my card" branch

The backend in `supabase/functions/brand-dashboard/index.ts` already returns `edit_card_url` based on `expert_city_assignments.expert_type` (brand_rep wins over industry_expert; falls back to `/Denverexperts/{slug}` for pure experts). The frontend already calls `onEditCardUrl(s.edit_card_url)` from `DashboardWorkspace`.

Audit and fix any spot still hardcoding `/denverreps/`:

- `BrandDashboard.tsx` initial state defaults `editCardUrl` to `https://basecampoutdoorevents.com/denverreps/` — fine as default, gets overwritten once summary loads. Keep.
- The Card Option B preview "Edit my card" pill (in `BrandCardPreview.tsx` and/or rep-card preview block in `DashboardWorkspace.tsx`): point its click to whatever `editCardUrl` resolves to instead of opening the brand modal directly. If it currently opens an in-app modal (`setRepEditOpen(true)`), keep that for brand reps but for experts route to the expert URL in a new tab. Confirm by reading `DashboardWorkspace.tsx` lines 145-220 during implementation.

No backend change needed.

### Fix 5: Candidate-facing map navigation

Investigation: both candidate (`EventOutsideDays26`) and admin (`EventMapAdmin`) render the same `EventMapCanvas` component, which uses native `overflow-auto` (browser handles wheel-scroll = pan, ctrl+wheel = zoom is not implemented). No custom wheel handler exists in `EventMapCanvas.tsx`.

The reported "scroll zooms" behavior must therefore come from one of:
- The candidate page wrapping `EventMapCanvas` in something with CSS `transform: scale` or a wheel listener.
- A library like `react-zoom-pan-pinch` only used on the candidate route.

Plan: search `EventOutsideDays26.tsx` and the components it renders for any `onWheel`, `transform: scale`, `panzoom`, or `TransformWrapper` usage. If found, change settings so:
- Default wheel = pan (vertical+horizontal scroll).
- ctrl/meta + wheel OR pinch = zoom.

If no such wrapper exists and `overflow-auto` is already in place, confirm by repro instead of changing code (avoid breaking working behavior). Do NOT touch the admin map, do NOT change mobile pinch/swipe.

### Fix 6: Connections list cleanup

**6A — duplicate X**: Audit `ConnectConnections.tsx` (header has only ChevronLeft on mobile, no X) and `ConnectionSummary.tsx` (sheet uses `hideClose` plus one manual X). Likely duplicate is in `ConnectionForm` or `NoteComposer` rendered on top with their own close buttons. Read those two files, remove whichever close button is broken/duplicate so each modal has exactly one working X.

**6B — list enrichment**: Data audit (already done):
- `connections` table fields available: `private_notes`, `message_to_brand`, `message_sent_at`, `follow_up_direction`, `contact_info_received`, `role_flagged`, `would_want_as_mentor`, `mentor_topics`, `created_at`, `brand_id`, `brand_rep_id`, `expert_id`.
- The "note sent to a rep" body lives in `connect_notes` (`message`, `note_cta`, `created_at`), keyed by `recipient_id` + candidate. The connections edge function does NOT currently join this. The `ConnectionSummary` already fetches it per-row via `connectNotesGetMine(recipientId)`.

To enrich the list view without N+1 fetches, extend `supabase/functions/connections/index.ts` `action: "list"` to also fetch the candidate's active `connect_notes` for all `recipient_id`s in the result set and attach `r.note = { message, note_cta, created_at } | null` to each row.

In `ConnectConnections.tsx`, render per row:

- Existing photo + subject + brand affiliation.
- Type chips (multiple allowed):
  - "Visited table" when `mode === "brand"` (always true for brand-only rows).
  - "Note sent" when `r.note` exists OR `r.message_sent_at` is set.
  - "Connected at event" when `r.created_at` falls inside the event window.
  - "Private note" when `r.private_notes` is non-empty.
  - "Mentor flagged" stays as-is for experts.
- Truncated note preview: if `r.note?.message` exists, show first ~120 chars with ellipsis. Otherwise fall back to `r.private_notes` preview (already there).
- Timing chip computed from `r.created_at` vs the event window: pre-event (< 2026-05-28T21:00:00Z), at event (between 21:00Z and 2026-05-29T01:00:00Z), post-event (after).

Keep existing card layout, just add chips row + preview line. No schema changes.

### Fix 7: "Come to the afterparty" link on dashboard

Add a small line under the rep card preview in `DashboardWorkspace.tsx` (single component shared by brand reps and industry experts):

"Headed to Outside Days? Come to the afterparty →"

- Cream text, "Come to the afterparty" rendered in coral.
- Opens `https://basecampoutdoorevents.com/afterparty/interest` in new tab.
- Wrap copy in `EditableText` under a new key like `dashboard_afterparty_invite` so Jenna can edit.

### Verification checklist

1. Industry experts list circles show no logo overlay; brand modal reps grid same; brand dashboard + expert dashboard + "Your team" same.
2. Banner appears on `/outsidedays26/connect` and `/outsidedays26/connect/full`, hidden on `/connect/home`, `/connect/profile`, `/connect/connections`. Link opens Typeform new tab.
3. Selecting "Always open" or "Ready to jump" in the comprehensive form moves salary/dream role/dream companies/relocation/remote into a "What you're looking for" section right under "About you". Selecting "I'm off market" restores default order.
4. Brand reps see `/denverreps/{slug}` for "Edit my card". Pure experts see `/Denverexperts/{slug}`. Kelly (both) sees `/denverreps/edges-first`.
5. Candidate map: trackpad scroll pans; ctrl+scroll or pinch zooms; mobile unchanged.
6. Connections list: one working X per modal; each row shows chips + note preview + timing.
7. "Come to the afterparty" link visible on both brand-rep and industry-expert dashboards under the rep card preview.

No em dashes anywhere.

### Files to touch

- `src/components/experts/ExpertCardMinimal.tsx`
- `src/components/connect/RegisterReminderBanner.tsx` (new)
- `src/pages/outsidedays/Connect.tsx`
- `src/pages/outsidedays/ConnectFull.tsx`
- `src/components/connect/dashboard/DashboardWorkspace.tsx`
- `src/components/connect/dashboard/BrandCardPreview.tsx` (only if "Edit my card" pill on Card B is hardcoded)
- `src/pages/outsidedays/ConnectConnections.tsx`
- `src/components/connect/ConnectionForm.tsx` and/or `NoteComposer.tsx` (remove duplicate X)
- `supabase/functions/connections/index.ts` (extend list response with note)
- Possibly `src/pages/EventOutsideDays26.tsx` or wrapper if a wheel/zoom handler is found

No DB schema migrations.