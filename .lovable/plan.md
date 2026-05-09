# Lock all admin/edit gates to @wearetheoutdoorindustry.com only

## The bug

Most edit and admin UI on the site decides "is admin?" by simply checking that any Supabase session exists (`!!session`). Since the after‑party PIN flow signs every RSVP'd guest into Supabase (often as an anonymous user), any after‑party guest currently sees inline edit controls (EditableText pencils, EditableLink editors, hide/show section toggles, logo manager, card style picker, events nav admin button, etc.) on every page that uses `EditableTextProvider` or those components.

The only place that already does it correctly is `AfterPartyAdminInline.tsx`, which checks:
- session user is not anonymous
- email ends with `@wearetheoutdoorindustry.com`

We will apply that same check everywhere.

## Approach

Create one shared helper and route every existing gate through it. No UI changes, no copy changes, no new routes.

### 1. New file: `src/lib/admin-auth.ts`

Exports:
- `isAdminUser(user)` — `user` is non‑null, `user.is_anonymous !== true`, and `user.email` (lowercased, trimmed) ends with `@wearetheoutdoorindustry.com`.
- `useIsAdmin()` — React hook that wires `supabase.auth.getUser()` + `onAuthStateChange`, returns a boolean. Replaces the duplicated pattern.

### 2. Replace weak gates

Swap each `setIsAdmin(!!session)` / `setAuthed(true)` site below to use `isAdminUser(session?.user)` (or `useIsAdmin()` where it cleans up the component):

Editing surfaces (drives EditableText, EditableLink, HideableSection, PageMetaEditor, AnchorCopyButton across every public page):
- `src/components/EditableTextProvider.tsx` (lines 49–53)

Inline admin controls on event/landing pages:
- `src/components/event/AdminLogoManager.tsx` (263–264)
- `src/components/event/CardStylePicker.tsx` (25–26)
- `src/components/events/EventsNav.tsx` (33–37) — gates the "Add event" / admin link in the nav
- `src/pages/Events.tsx` (40–44)
- `src/pages/EventCalendar.tsx` (24–28)
- `src/pages/GenerateCards.tsx` (391–395)

Admin route pages — currently only check that *some* session exists, so any anonymous after‑party session passes. Add email check; if not admin, sign out and `navigate("/admin")`:
- `src/pages/AdminAfterParty.tsx` (around 21)
- `src/pages/AdminConnect.tsx` (around 37)
- `src/pages/AdminExperts.tsx` (around 45)
- `src/pages/EventMapAdmin.tsx` (around 51–53)

### 3. Sweep for any other component that calls `getSession`/`onAuthStateChange` and decides admin status

Run a final `rg "!!session|!!data.session|setIsAdmin|setAuthed"` pass and convert any remaining hits to `isAdminUser`. Known clean spots to leave alone:
- `LinkTracker.tsx` — already checks domain.
- `AfterPartyAdminInline.tsx` — already checks domain (will be refactored to call shared helper for consistency).
- `AdminLogin.tsx` — login page itself, already enforces `ALLOWED_DOMAINS`.
- Connect/brand‑rep/candidate session flows in `connect-session.ts` and the after‑party PIN flow — these intentionally create non‑admin sessions and stay untouched.

## Out of scope

- No changes to RLS, edge functions, or DB. (Edge functions that need admin checks already validate the email server‑side; this PR is purely a UI gating fix so non‑admins stop seeing edit affordances. Server still rejects writes.)
- No new login flow, no UI redesign, no copy changes.

## Acceptance

- Sign in via after‑party PIN as a guest → no pencils, no Edit buttons, no hide/show section chips, no admin nav link, no logo manager, no card style picker on any page. `/admin/*` routes bounce back to `/admin`.
- Sign in at `/admin` with an `@wearetheoutdoorindustry.com` email → all of the above appear and work exactly as before.
- Signed out → unchanged (already hidden).
