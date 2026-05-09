## Goal

Rebuild the Connect interaction flow so candidates always see the full, existing rep/expert card before any action, then act through a sticky mode-aware footer. Replace the 3-step connection wizard with a single-screen form, fork it for experts vs reps, add a universal "I visited this brand" toggle, support inline note-sending with a CTA chip, and surface all of this on the brand dashboard.

## Scope summary

- Reuse `ExpertCard.tsx` (already used for both experts and brand reps via shared shape) inside Connect. No redesign.
- New wrapper: `ConnectPersonSheet` that mounts the existing card and adds a sticky mode-aware action footer.
- Rewrite `ConnectionForm.tsx` from a 3-step wizard to a single-screen form with two variants (rep, expert) plus a separate brand-level form (`BrandVisitForm`).
- Add universal "I visited this brand" toggle inside `MapBrandPanel`.
- Schema: add `note_cta` to `connect_notes`, allow `during_event` value in `note_timing`.
- Brand dashboard: add `during_event` filter chip, render CTA chip on note display.

## Files to change

### New
- `src/components/connect/ConnectPersonSheet.tsx` — bottom-sheet wrapper that renders the existing `ExpertCard` (used for reps too) inside a scrollable Sheet with a sticky `<ConnectActionFooter>` at the bottom. Mode-aware footer logic lives here.
- `src/components/connect/ConnectActionFooter.tsx` — pure presentation: renders 1 or 2 buttons based on `mode`, `hasNote`, `hasConnection`, `subjectType`. Pre: "Send a note" / "Edit your note ✓". During: "Log a connection" / "View your notes". Post: "Send a note" + optional "View / edit connection".
- `src/components/connect/BrandVisitForm.tsx` — brand-level form. Toggle "I visited" creates an empty brand-only `connections` row immediately. The expandable form has: rep multi-select bubbles (creates an empty per-rep `connections` row on save for each selected), private "what did you talk about", "how should you follow up". No note option.
- `src/components/connect/BrandVisitToggle.tsx` — the prominent toggle button + "Visited ✓" state + remove-confirm dialog. Wraps `BrandVisitForm` expansion.
- `src/components/connect/NoteCTAChips.tsx` — reusable single-select chips for the 4 CTA values, used inside the new `ConnectionForm` and inside `NoteComposer`.

### Rewritten
- `src/components/connect/ConnectionForm.tsx` — single-screen form, two variants:
  - `rep` variant: private notes, follow-up direction, contact info, role flagged, collapsible note composer (with `NoteCTAChips`).
  - `expert` variant: private notes, follow-up direction, contact info, mentor Y/N (required), mentor topics if Yes, collapsible note composer.
  - Save button text is conditional on note section being expanded + filled.
  - Edit-mode prefill from existing connection + existing note.

### Edited
- `src/components/event/MapBrandPanel.tsx` — replace direct rep-tap → `ConnectionForm` flow with rep-tap → `ConnectPersonSheet`. Mount `BrandVisitToggle` at the top of the modal (during/post-event only).
- `src/pages/outsidedays/ConnectHome.tsx` — expert-tap inside Expert Zone now opens `ConnectPersonSheet` (expert variant) instead of jumping straight to the wizard.
- `src/pages/outsidedays/ConnectConnections.tsx` — "edit" entry points open `ConnectPersonSheet` first, which then routes to the new `ConnectionForm` in edit mode.
- `src/components/connect/dashboard/CandidateCard.tsx` — render `during_event` timing label "Note from event"; render CTA chip below the note text using the mapping in spec; keep email/LinkedIn buttons.
- `src/components/connect/dashboard/DashboardFilters.tsx` — add a `during_event_note` filter chip.
- `src/components/connect/NoteComposer.tsx` — keep as the standalone pre/post composer (entry points from sticky footer), but also accept an `initialCTA` and render the new `NoteCTAChips`. The "during_event" disabled branch is preserved (for safety) but the sticky footer in during-event mode routes to `ConnectionForm` instead of opening this composer.
- `src/lib/connect-session.ts` — extend `connectNotesUpsert` and `connectionsCreate/Update` payloads to include `note_cta`. Add `connectVisitBrand` / `connectUnvisitBrand` helpers.

### Backend
- `supabase/functions/connect-notes/index.ts` — accept and persist `note_cta`; permit `note_timing = "during_event"` writes.
- `supabase/functions/connections/index.ts` — accept brand-only "visit" rows (brand_id only, no rep/expert); include logic to bulk-insert empty per-rep rows when `rep_ids: []` is passed from `BrandVisitForm`.
- `supabase/functions/brand-dashboard/index.ts` — extend filter to support `during_event_note`; pass `note_cta` through in the candidate payload.

### Migration
- Add column `note_cta text` to `connect_notes` (nullable; values constrained via CHECK to: `follow_up`, `look_out_for_application`, `grab_coffee`, `memorable_only`).
- If `note_timing` is constrained by CHECK, update the CHECK to include `during_event`. (No enum type — it's a text column today, so this may be a no-op.)

## Mode logic (single source of truth)

Reuse `useEventMode()` from `src/lib/connect-event-mode.ts`. Footer decision matrix:

```text
mode         hasNote  hasConn   primary                   secondary
pre          no       *         Send a note               -
pre          yes      *         Edit your note ✓          -
during       *        no        Log a connection          -
during       *        yes       View your notes           -
post         *        no        Send a note               -
post         *        yes       Send a note               View / edit connection
```

`hasConnection` excludes brand-level visit rows when computed for a rep card; it only counts rows where `brand_rep_id` (or `expert_id`) matches.

## Visited-brand semantics

- Brand-level visit = a `connections` row with `brand_id` set and both `brand_rep_id` and `expert_id` null.
- Per-rep selection in `BrandVisitForm` creates one empty `connections` row per selected rep with `brand_id` + `brand_rep_id`. These are independently editable later from each rep's `ConnectPersonSheet`.
- Brand dashboard "Visited my table" badge already triggers on any connection row for the brand. No change needed to that aggregation; verify in `brand-dashboard/index.ts`.

## Removals

- 3-step wizard markup, `Progress`, step state, "STEP 1 OF 3" copy, "Leave a trail" / "Send now or write later" footer in `ConnectionForm.tsx`. Replaced inline.
- Direct rep-tap → wizard wiring in `MapBrandPanel.tsx`.

## Testing checklist mapping

Each item from the spec's Testing Checklist maps to a manual verification at preview viewport 390x692:
- Rep card pre/during/post footer behavior — `ConnectPersonSheet` + `ConnectActionFooter`.
- Expert card flow — same wrapper, `subjectType=expert`.
- "I visited" toggle — `BrandVisitToggle` inside `MapBrandPanel`.
- Connection form (rep, expert): single screen, collapsible note, save text changes — new `ConnectionForm`.
- Brand-level multi-select creates empty rep rows — `BrandVisitForm` + `connections` edge function.
- Dashboard candidate card shows CTA chip + during-event label — `CandidateCard.tsx` + `DashboardFilters.tsx`.
- No em dashes anywhere in new copy.

## Out of scope

- Rep/expert card visual redesign.
- Brand modal layout (logo/name/reps grid/link/hiring) beyond inserting the visit toggle.
- Existing standalone pre/post NoteComposer flows beyond adding CTA chips.
- Brand dashboard filter system structure beyond adding the new chip.
- Taxonomies.
