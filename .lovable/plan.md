## Goal

A shared, live-updating check-in screen at `/checkin` for the Popfly door team to mark afterparty guests as arrived, with walk-in registration and a 30-second undo window.

## Auth

- One shared login: `door@popfly.com` (you create it; password shared with the team).
- Extend the existing admin auth gate so this route accepts emails ending in `@popfly.com` OR `@wearetheoutdoorindustry.com`. All other admin routes stay restricted to `@wearetheoutdoorindustry.com`.

## Database changes (single migration)

On `afterparty_attendees`:
- Add `checked_in_at timestamptz` (nullable)
- Add `checked_in_by text` (nullable) — stores the email of whoever tapped check-in
- Enable Realtime on the table so multiple devices stay in sync
- Widen the existing admin UPDATE policy to also allow `@popfly.com` emails to update only `checked_in_at` / `checked_in_by` (or simply allow the same update scope — simpler and lower risk for one night)

## Page: `/checkin`

Single mobile-first screen, no separate route per action.

**Sticky header**
- Live counter: `47 / 132 checked in`
- Search bar: filter as you type by attendee number, name, or company
- Toggle: "Show all" / "Not checked in only"

**List** (sorted by attendee number ascending)
- Each row: `#36 · Jenna Herbison · Basecamp Outdoor` + role chip
- Right side: big tap target
  - Not checked in → coral "Check In" button
  - Checked in → cream row with ✓ + "Checked in 2 min ago by door@popfly.com"
- Realtime subscription on `afterparty_attendees` so check-ins, walk-ins, and any new registrations appear on every device within ~1 second

**30-second lock with undo**
- When tapped, row shows ✓ plus an "Undo" link for 30 seconds
- After 30 seconds, the inline Undo disappears and the row collapses to the checked-in state
- A small "⋯" on every checked-in row opens a confirm dialog: "Un-check this guest? This should only be used for mistakes." → reverses it
- This keeps casual mis-taps recoverable instantly while preventing accidental un-checks during a busy door

**Walk-in (floating button, bottom right)**
- "+ Walk-in" opens a sheet with a truncated form:
  - Full name (required)
  - Email (required)
  - Company
  - Role (Brand / Creator / Other — radio)
- On submit: inserts into `afterparty_attendees` with auto-assigned `attendee_number`, then immediately marks them checked-in. They appear instantly on every device via realtime.

## Out of scope

- No printing, no per-person logins, no exports, no edge functions.
- No changes to the existing afterparty registration flow, emails, or matches.

## Technical notes

- New file: `src/pages/Checkin.tsx` (~300 lines)
- Route added in `src/App.tsx`
- Auth gate: locate the existing `@wearetheoutdoorindustry.com` check and add an OR for `@popfly.com` scoped to this route only
- Realtime: `supabase.channel('checkin').on('postgres_changes', { event: '*', schema: 'public', table: 'afterparty_attendees' }, ...)` plus `ALTER PUBLICATION supabase_realtime ADD TABLE public.afterparty_attendees`
- Undo timer: local `setTimeout` per row; the underlying DB write happens immediately on tap (instant for other devices) and the inline Undo just reverses it within 30s

## What you'll need to do

After I build it, you give the Popfly lead this URL and the shared `door@popfly.com` login. That's it.
