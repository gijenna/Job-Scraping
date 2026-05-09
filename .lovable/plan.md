# Brand Dashboard + Rep Auth Fixes

## 1. Brand-rep sign-in: prompt for phone when missing

**Your read is correct.** The `brand-rep-auth` lookup only treats a rep as "needs_phone" when the `phone` column is NULL. If the rep has a phone but the `phone_last_four` field is empty/wrong (true for most legacy records imported without it), lookup says `needs_phone: false` and pushes the rep into the "enter last 4" step, where the match fails and they see the doesn't-match error.

Fix in `supabase/functions/brand-rep-auth/index.ts`:
- In `action: "lookup"`, treat a rep as `needs_phone: true` when **either** `phone` is missing **or** `phone_last_four` is missing.
- In `action: "add_phone"`, also write `phone_last_four` (last 4 digits of cleaned phone) so future logins work.
- Same treatment for the multi-rep ambiguous branch.

No UI change needed — `BrandDashboard.tsx` already handles the `add_phone` mode.

## 2. Sort dropdown rework

`src/components/connect/dashboard/DashboardWorkspace.tsx` — replace the 5 options with:

| Value | Label | Behavior |
|---|---|---|
| `newest` (default) | Newest | order by `candidates.updated_at` desc |
| `most_complete` | Most complete profiles | order by `profile_completeness_score` desc |
| `visited` | Visited my table | candidates with a `connections` row for this brand on top, then by most recent connection `created_at` |
| `wrote_note` | Wrote me a note | candidates with any active `connect_notes` row for this brand on top, then by note `created_at` desc |

UI:
- Trigger button width `w-[180px]` (instead of 220) and `truncate` on the value to fit at 375px.
- Default state changes from `most_recent_activity` to `newest`.

Edge function (`supabase/functions/brand-dashboard/index.ts`) — replace the sort branch:
- `newest` and `most_complete`: as-is at the SQL `order` step.
- `visited`: post-sort by `engagement[c.id]?.last` desc, falling back to 0; rows with no engagement go last.
- `wrote_note`: post-sort by `connectNotes[c.id]?.sent_at` desc; rows without a note go last.
- Drop `connected_first`, `note_first`, `pre_event_first` handling.

## 3. Filter chips audit

`src/components/connect/dashboard/DashboardFilters.tsx` already has chips for: Visited my table, Sent me a note, Pre-event note, Note from event, Post-event note, Starred my brand, Flagged a role. Confirmed working — no add needed. Two small label fixes:
- Rename "Flagged a role" → "Flagged a role to apply to" to match your spec.
- Confirm "Visited my table" wording (currently the chip exists; verify text matches).

All chips already stack independently in the edge function's post-filter loop. No backend change needed.

## 4. "Visited my table" should not be possible pre-event

Today the badge/metric is set whenever a `connections` row exists for the brand. A connection row gets created any time a candidate submits a post-meeting log, but nothing stops one from being created (or seeded) before the event start.

Fix: gate the `visited` flag behind the event start time.
- Read the active event's `event_date` from `expert_cities` (default city `denver26`) or from `event_settings` (`event_start_at` key) — whichever your admin already edits. I will use `expert_cities.event_date` for `denver26` and treat `now() < event_date` as "pre-event".
- In `brand-dashboard/index.ts`: when computing `engagement`, only set `cur.visited = true` if `now >= event_date` **OR** the connection's `created_at >= event_date`. Otherwise leave `visited: false` (the row can still drive `sent_note` / notes / `role_flagged`).
- The badges on candidate cards keep their current names; they just won't render the "Visited my table" badge for pre-event rows.

## 5. Phone capture on admin Brand Rep and Expert cards

Need to verify and, if missing, add a `Phone` input to the AdminExperts edit/create form so every new rep/expert is captured with `phone` + `phone_last_four` from day one. Plan:
- Add a `Phone` field to the Add/Edit form in `src/pages/AdminExperts.tsx` (whichever sub-component renders the modal).
- On save, clean the digits and also write `phone_last_four`.
- Show the phone (masked, last 4 only) in the admin card list so admins can confirm at a glance.

## Out of scope
No changes to: candidate card badge labels, the `connections` schema, RLS, `connect_notes` schema, or any non-dashboard functionality.

## Files to change
- `supabase/functions/brand-rep-auth/index.ts`
- `supabase/functions/brand-dashboard/index.ts`
- `src/components/connect/dashboard/DashboardWorkspace.tsx`
- `src/components/connect/dashboard/DashboardFilters.tsx` (label tweak only)
- `src/pages/AdminExperts.tsx` (+ child form component)
