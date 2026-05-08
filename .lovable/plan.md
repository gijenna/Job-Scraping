## Phase 3 — Connections Flow

Extend the brand modal and expert card with tap-to-log entry points, build a mobile-first 3-step connection form, add a "My Connections" view, and back it with a `connections` edge function. Reuses existing `MapBrandPanel`, `ExpertCard`, brand bubble, and polaroid styling. No new schema (the `connections` table already exists with all needed columns).

### 1. Backend — `supabase/functions/connections/index.ts` (new)

Service-role function gated by the candidate session cookie (reuses `_shared/connect-session.ts`). Actions:

- `list` — returns the current candidate's connections, newest first, joined with brand (`event_map_brands`) and expert/rep (`industry_experts`) for display.
- `create` — inserts a row in `public.connections` with `candidate_id` from the session. Accepts `brand_id`, `brand_rep_id` (industry_experts.id), `expert_id` (industry_experts.id), `private_notes`, `follow_up_direction`, `contact_info_received`, `role_flagged`, `message_to_brand`, `would_want_as_mentor`, `mentor_topics`, `also_talked_to` (stored in private_notes prefix line, since no column exists). Sets `message_sent_at` if `message_to_brand` provided AND client flag `send_now=true`.
- `update` — partial patch by id, scoped to the candidate. Used to send a deferred note or edit notes later.
- `delete` — by id, scoped to the candidate.

Validation with zod-style manual checks: caps (`private_notes` 500, `message_to_brand` 500, `follow_up_direction`/`contact_info_received`/`role_flagged`/`mentor_topics` 280). `would_want_as_mentor` boolean. At least one of `brand_id`, `brand_rep_id`, `expert_id` required.

Note on schema: the existing `connections` table has no `also_talked_to` column. We'll prepend "Also met: ..." into `private_notes` rather than add a column for now; we can promote it to a real column in a later migration if needed.

### 2. Client helper — extend `src/lib/connect-session.ts`

Add: `connectionsList()`, `connectionsCreate(payload)`, `connectionsUpdate(id, patch)`, `connectionsDelete(id)`.

### 3. Brand modal updates — `src/components/event/MapBrandPanel.tsx`

Reuse the existing modal. Add (only when wrapped by `ImpersonationGate` / inside the candidate flow — gated by a new optional prop `candidateMode?: boolean` so admin/public uses are unchanged):

- Top-of-modal cream instruction line: *"Tap a person below to log a connection, or tap the brand logo to log a brand-level note."*
- Badges row beneath brand name:
  - "Currently hiring" pill when `currently_hiring` is `Yes, actively hiring` or `Always open to great people` (events-coral bg).
  - "Featured" pill when `is_featured` (subtle yellow border).
  - Remote indicator (Wifi icon + label) from `offers_remote` when present.
- `culture_blurb` rendered as a left-bordered quote block in cream/70.
- Brand logo button → opens `<ConnectionForm mode="brand" brand={brand} />`.
- Each rep tile becomes a button → opens `<ConnectionForm mode="brand_rep" brand={brand} rep={expert} />`.

### 4. Expert card updates — `src/components/experts/ExpertCard.tsx`

Add optional `candidateMode?: boolean` + `onLogConnection?: (expert) => void` props. When set:
- Render a top instruction line: *"Tap {first name}'s photo to log a connection."*
- Wrap the polaroid in a `<button>` that calls `onLogConnection(expert)`.

`ConnectHome.tsx` Expert Zone list passes these props and renders `<ConnectionForm mode="expert" expert={expert} />` on click.

### 5. New component — `src/components/connect/ConnectionForm.tsx`

Mobile-first multi-step Sheet (uses existing `@/components/ui/sheet` for bottom-up presentation on mobile, falls back to dialog on md+). Props: `mode: "brand" | "brand_rep" | "expert"`, optional `brand`, `rep`, `expert`, `onClose`, `onSaved`.

Steps (progress bar at top using `Progress` component):

- **Step 1 — Who and what**
  - Pre-filled, read-only header chip showing the brand/rep/expert.
  - "Who else did you talk to here?" (Input, optional).
  - "What did you talk about? (For your eyes only)" (Textarea, 500). Helper: *"This is your private memory aid. Brand will never see this."*
- **Step 2 — Follow-up**
  - "How should you follow up?" (Textarea, 280). Helper: *"Email next week? Apply to a specific role? DM on LinkedIn?"*
  - "Did they give you contact info?" (Textarea, 280). Helper: *"Phone number, email, LinkedIn, business card details, anything you got."*
  - "Are you applying to a specific role?" (Input, 280). Helper: *"Type the role title here so they can look out for your application."*
- **Step 3 — branches by mode**
  - **Brand / brand_rep**: "Leave a trail for {brand.name}". Body copy verbatim from spec (no em dashes already). Textarea 500, two buttons: *Send now* (saves with `message_sent_at = now`) / *I'll write this later* (saves without).
  - **Expert**: "Mentor potential?". `Yes` / `No` toggle for `would_want_as_mentor`. If Yes, show `mentor_topics` (Textarea, 280). Single *Save* button.

After save → toast "Connection logged" and `onSaved()` closes the sheet.

Copy rule: every helper string and button label hand-checked for em dashes (none used).

### 6. New page — `src/pages/outsidedays/ConnectConnections.tsx` at `/outsidedays26/connect/connections`

Wrapped in `ImpersonationGate`. Header matches `ConnectHome`. Body:

- Empty state: cream illustration text "No connections yet. Tap a brand or expert on the map to log your first one." with a coral CTA back to `/outsidedays26/connect/home`.
- List, newest first. Each row: avatar (brand logo OR expert/rep photo polaroid-mini), title line ("{Brand}" or "{Brand} · {Rep name}" or "{Expert name}"), relative time ("2h ago"), 2-line truncated `private_notes`, status chip:
  - Brand connections: "Note sent" (coral) or "Note not yet sent" (cream/40).
  - Expert connections: "Mentor flagged" yellow chip when `would_want_as_mentor`.
- Tap → expands inline editor (reuses `ConnectionForm` in "edit" mode, prefilled with current values; supports send-deferred-note for brand connections, save for all).

### 7. Wiring

- `App.tsx`: register `/outsidedays26/connect/connections`.
- `ConnectHome.tsx` header: add a "My Connections" pill button (coral) next to Profile.
- `ConnectHome.tsx` map view: pass `candidateMode` to `MapBrandPanel`. Expert zone modal: pass `candidateMode` + `onLogConnection` to `ExpertCardMinimal` (extend that small component too — same prop shape).
- Use `consumeImpersonationToken()` semantics already handled by `ImpersonationGate`.

### 8. Files to create / modify

**New**
- `supabase/functions/connections/index.ts`
- `src/components/connect/ConnectionForm.tsx`
- `src/pages/outsidedays/ConnectConnections.tsx`

**Modified**
- `src/lib/connect-session.ts` — add connections client.
- `src/components/event/MapBrandPanel.tsx` — badges, culture quote, instruction line, tappable logo + reps gated by `candidateMode`.
- `src/components/experts/ExpertCard.tsx` — `candidateMode` + `onLogConnection`.
- `src/components/experts/ExpertCardMinimal.tsx` — same opt-in props.
- `src/pages/outsidedays/ConnectHome.tsx` — pass `candidateMode`, "My Connections" link.
- `src/App.tsx` — new route.

### 9. Out of scope for this phase

- Brand-side viewing of connections / sent notes (phase 4).
- Sending the deferred-note prompt email to candidates (queued in phase 4).
- Post-event analytics dashboard.

### Open question

The spec says step 1 has an "also talked to" free-text field but the `connections` table has no matching column. Two choices for this phase:

- **A (proposed):** Prepend `"Also met: …\n\n"` into `private_notes`. Zero schema change.
- **B:** Add an `also_talked_to text` column on `public.connections` via migration and store it cleanly.

Defaulting to **A** to keep this phase schema-free, easy to promote later if Jenna wants it surfaced separately on the brand-side view.
