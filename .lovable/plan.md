

## Public Guest List at `/guests`

A new public, read-only browsing page for After Party attendees. Nothing existing is modified except: (a) one new DB column, (b) one new link on `/afterparty`, and (c) one new toggle on the verified user's own card.

### 1. Database

Single additive migration on `afterparty_attendees`:

- Add column `public_listing boolean NOT NULL DEFAULT true`.
- Backfill is automatic via default — all existing attendees default to visible.
- No RLS change needed for SELECT: we'll expose a tightly-scoped public view (see below).

To avoid leaking email/phone/slug/full-name through the existing table (which currently has no public SELECT policy), create a **SQL view** `public.afterparty_guest_list` that exposes ONLY:

`id, attendee_number, role, first_name_initial (computed: split_part(full_name,' ',1) || ' ' || left(split_part(full_name,' ',-1),1) || '.'), company, cartoon_url, niches, creator_types, looking_for, mind_blowing_fact, created_at`

Grant `SELECT` on the view to `anon` and `authenticated`, filtered to rows where `public_listing = true AND status = 'submitted'` (i.e. completed profile). Realtime is enabled by adding the underlying table to `supabase_realtime` publication and subscribing to row updates — the client re-filters via the view query.

### 2. New page `/guests`

New file `src/pages/GuestList.tsx`, registered in `src/App.tsx` above the catch-all.

Layout, top to bottom:

- Header band with live count: **"{n} people coming"**, driven by a `count` query on the view + a realtime subscription on `afterparty_attendees` that re-runs the count + list on any change.
- Filter bar (sticky on scroll):
  - Role multi-select chips: Creator / Brand rep / Industry expert
  - Niche multi-select dropdown (options derived from distinct values in the result set)
  - Sort dropdown: "Newest first" (default, `created_at desc`) | "By niche" (group/sort by first niche alpha)
  - Search input: client-side filter across `first_name_initial`, `niches`, `creator_types`, `mind_blowing_fact`
- Card grid: `grid-cols-2 md:grid-cols-3 gap-4`.

Each card (new component `src/components/afterparty/GuestCard.tsx`):

- Top-right: `<NumberBadge>` (existing, role-colored)
- Centered cartoon avatar (`cartoon_url` only — fallback to monogram initials if missing; never `photo_url`)
- "Jordan M." display name
- Role pill (reuses role color tokens from `NumberBadge`)
- Niche tag chips + content-type chips
- 2-line clamped `mind_blowing_fact` with "Read more" toggle (local state, expands inline)
- "Here to" intent pills from `looking_for`, **filtering out** any value matching `/just here to vibe/i`

Empty state: "No one matches those filters yet."

### 3. Link from `/afterparty`

In `src/pages/AfterPartyInvite.tsx`, add a single inline link **"See who's coming →"** directly under the hero copy block, rendered unconditionally (before and after form submission). Wraps `react-router-dom` `<Link to="/guests">`. Uses existing typography classes — no new section, no layout changes elsewhere.

### 4. Opt-out toggle on own card

In the existing verified-user view (where the attendee sees their own card after PIN verification — `MatchesPanel` / the "me" card area in `AfterPartyInvite.tsx`), add a small `<Switch>` row labeled **"Show me in the guest list"**, default reflects `me.public_listing`. Visible ONLY when `me` is loaded and PIN-verified (i.e. inside the existing authenticated branch). Toggling writes `public_listing` on that attendee row via the existing authenticated update policy (`auth.uid() = auth_user_id`). Realtime on `/guests` reflects the change instantly.

### Files

- `supabase/migrations/<ts>_guest_list.sql` (new — column + view + grants + publication)
- `src/pages/GuestList.tsx` (new)
- `src/components/afterparty/GuestCard.tsx` (new)
- `src/App.tsx` (add `<Route path="/guests" element={<GuestList />} />`)
- `src/pages/AfterPartyInvite.tsx` (add "See who's coming →" link + opt-out Switch on own card — surgical edits, no other changes)

### What stays untouched

No edits to matching logic, intake form, splash animation, hero, email flows, or any other page. No fields beyond the listed view columns are ever queried by `/guests`.

