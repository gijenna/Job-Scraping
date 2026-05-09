# Basecamp Connect — Messaging, Stars, Mode-Aware UX

A large coordinated build. Will deliver in phased commits so each piece is testable.

## Event mode constants (shared util)
Create `src/lib/connect-event-mode.ts`:
- `EVENT_START` (Denver Outside Days 26 start) and `POST_EVENT_START = 2026-05-28T19:00:00-06:00` (7pm MT).
- `getEventMode()` → `"pre_event" | "during_event" | "post_event"`.
- Used by header strip, composer gating, onboarding modal, note timing.

## Phase 1 — Database

Migration:
- `notes` table: id, created_at, updated_at, candidate_id, recipient_type ('brand_rep'|'expert'), recipient_id, brand_id (nullable), message (text, ≤500 enforced via trigger), note_timing ('pre_event'|'during_event'|'post_event'), is_active (bool default true).
  - Unique partial index on `(candidate_id, recipient_id) where is_active = true`.
  - RLS: service-role full access (mirrors `connections` pattern; Edge Functions handle auth).
- `candidates`: add `has_seen_map_intro boolean default false`.
- Stars: project already has `candidate_starred_brands` join table — use it (skip the array column).
- Add 2 rows to `email_templates`: `candidate_note_received_pre_event`, `candidate_note_received_post_event`.

## Phase 2 — Edge functions

New `supabase/functions/notes/index.ts` (CORS, candidate session auth via existing `_shared/connect-session.ts`):
- `GET ?recipient_id=…` → my active note to that recipient.
- `GET ?mine=1` → all my active notes.
- `GET ?brand_id=…` (brand-rep auth) → notes for any rep at that brand, joined w/ candidate basics.
- `POST { recipient_type, recipient_id, message }` → upsert active note. Reject if `during_event`. Sets `note_timing` server-side. Resolves `brand_id` from rep. Enqueues `candidate_note_received_pre_event` or `_post_event` email via existing `send-transactional-email`.
- `POST { action: 'retract', recipient_id }` → set `is_active=false`.

Extend `candidate-profile` (or new `stars` function): toggle starred brand in `candidate_starred_brands`; return `starred_brand_ids` in `candidateMe()`.

Extend `brand-dashboard` to also return per-candidate `note` (text, timing, sent_at) and a `has_visited` flag derived from `connections`.

Add 2 templates to `_shared/transactional-email-templates/` and register in `registry.ts`.

## Phase 3 — Candidate UI

**Shared**
- `useEventMode()` hook.
- `useMyNotes()` + `useMyStars()` hooks (single fetch, cached on `ConnectShell`).
- Add small "How this works" link to top-right of `ConnectShell` header.

**`/outsidedays26/connect` (branching screen)** — replace welcome block with new headline/one-liner/sub-text + "How does this work?" link.

**`/outsidedays26/connect/full`** — add muted-cream description line under each of the 7 section headers.

**`/outsidedays26/connect/how-it-works`** — new public page, sections 1–5 verbatim, primary CTA back to `/outsidedays26/connect`. Add route in `App.tsx`.

**`ConnectHome` (map view)**
- Remove existing profile-completeness banner.
- Add mode-aware header strip (coral left bar, sticky, dismissible per session) with the 3 copy variants.
- Add "Your shortlist" mini-bubbles section above map listing starred brands (empty-state copy included).
- Pass `myStars`, `myNoteRecipientIds`, `myConnectionBrandIds` into `EventMapCanvas` so bubbles can render ⭐/✉️/✓ corner indicators.
- First-time onboarding modal: gated on `has_seen_map_intro`, content varies by mode, dismiss writes flag via `candidate-profile`.
- Same indicators applied in `ListView` bubble tiles + "Starred only" filter chip.

**Brand modal (`MapBrandPanel`)**
- Star button top-right next to close X (toggles via stars endpoint, optimistic).
- Each rep card gets "Send a note" / "Note sent ✓" link (hidden in `during_event`). Tap opens composer.

**Expert card (`ExpertCardMinimal` candidate context)** — same "Send a note" link below name (pre/post only).

**Note composer** (`src/components/connect/NoteComposer.tsx`, full-screen on mobile, centered card desktop):
- Recipient summary (avatar/name/title/company), mode-aware heading + guidance copy block (full text from spec, no em dashes), 500-char textarea w/ live counter, optional "Ask me about" inspiration card from rep/expert profile, Send/Update + Cancel + Retract (when editing). Confirmation toast w/ 4s auto-dismiss.

**Profile completeness banner** — relocate to top of `ConnectProfile` page (already on `/full`).

## Phase 4 — Brand Dashboard updates

In `CandidateCard` + `CandidateProfileDrawer`:
- Two independent badges: "Visited" (coral star) when connection exists; "Pre-event note" / "Post-event note" / "Note from event" envelope badge.
- Quote-block of note text with 💌 timing label, sent date, inline `Email them` (mailto) and `LinkedIn` (only if `linkedin_url`) action buttons (coral accent).

In `DashboardFilters`: add chips "Sent me a note", "Pre-event interest", "Post-event interest" (stack with existing). Add sort option "Pre-event reached out first".

## Phase 5 — Admin analytics

Extend admin analytics page (or add section to `AdminAfterParty`/Connect admin) reading from `notes` + `candidate_starred_brands` for the metrics listed in Change 14. Read-only queries via `supabase.rpc`/edge function.

## Out of scope
Connection-logging flow, recap view structure, taxonomies, real-time/threading/notifications, brand-side outreach UI, brand_starred_attendee UI.

## Validation
After each phase: smoke-test via preview at 375px, run linter, hit edge functions with `curl_edge_functions`. Final pass against the testing checklist in the spec.
