## Goal

Public press-release friendly version of the After Party that does NOT allow direct RSVP. Visitors submit interest, get a thank-you screen, Jenna gets an alert email, and the submission is appended to a Google Sheet tab.

## New route

- Add `/afterparty-interest` route in `src/App.tsx` mapped to a new `AfterPartyInterest` page.
- Existing `/afterparty`, `/afterparty/:name`, `/afterpartyoakley*` routes stay untouched (direct invitees still RSVP).

## Page: `src/pages/AfterPartyInterest.tsx`

Single-screen layout reusing the After Party visual system (Dark Teal / Coral / Yellow / Cream, Josefin Sans, Unbounded for hero):

1. Hero with the existing `BasecampMatchPopflyLogo` lockup (no "official" line, already cleaned).
2. Headline: "An evening for the outdoor industry, May 28 in Denver."
3. Capacity gate copy: **"Due to venue capacity, please submit your interest by May 25."**
4. Primary CTA card containing the form:
   - Full name (required)
   - Email (required)
   - Company (required)
   - Role / title (required)
   - "I'm coming as a..." single-select chips: **Brand**, **Creator**, **Industry member** (required)
   - "Why you want to come" textarea, max 500 chars (required)
   - Submit button labeled **"I wanna come"**
5. Below form: light fine print referencing Oakley host + photography opt-in (mirrors current RSVP fineprint).
6. After submit: replace form with a thank-you state ("You're on the list to be considered. We'll be in touch by May 26.") and a quiet link back to `/events`.

All copy goes through `EditableText` / `EditableTextProvider` (page slug `afterparty-interest`) so Jenna can edit later, per project memory.

## Storage: new `afterparty_interest` table

Migration creates:

```text
id uuid pk
created_at timestamptz default now()
full_name text not null
email text not null
company text not null
role_title text not null
attendee_type text not null check in ('brand','creator','industry')
reason text not null
status text not null default 'new'   -- new | approved | declined | waitlist
reviewed_at timestamptz
notes text
```

RLS:
- Public/anon `INSERT` allowed (so the form works without auth).
- `SELECT` / `UPDATE` / `DELETE` restricted to authenticated admins (mirrors `brand_activation_requests`).

## Submission flow

New edge function `submit-afterparty-interest` (verify_jwt off):

1. Zod-validate the body (trim, length caps, email format, enum on `attendee_type`).
2. Insert into `afterparty_interest` with service-role client.
3. Fire-and-forget two side effects (don't block the user response):
   - **Alert email to Jenna** via existing `send-transactional-email` using a new template `afterparty-interest-alert.tsx` registered in `_shared/transactional-email-templates/registry.ts`. Subject: `New After Party interest: {full_name} ({attendee_type})`. Body lists every field cleanly. To: `jenna@wearetheoutdoorindustry.com`.
   - **Append row to Google Sheet** tab `After Party Interest` in `GOOGLE_SPREADSHEET_ID` using existing `GOOGLE_SERVICE_ACCOUNT_KEY` secret (JWT → access token → `values:append` API). Columns: Timestamp, Name, Email, Company, Role, Type, Reason. If the tab is missing, the function logs the error but still returns success to the client.
4. Returns `{ ok: true }` on success.

The frontend calls the function via `supabase.functions.invoke('submit-afterparty-interest', ...)` and shows the thank-you state.

## Admin (lightweight, optional add to `/experts/afterparty`)

Add a small "Interest Requests" panel to `AfterPartyAdmin.tsx` listing rows from `afterparty_interest` newest-first with status dropdown (`new`/`approved`/`declined`/`waitlist`). Out of scope for v1 if you want to ship the public side first — Google Sheet + email already covers triage.

## Files touched

- `src/App.tsx` — add route
- `src/pages/AfterPartyInterest.tsx` — new
- `supabase/migrations/<ts>_afterparty_interest.sql` — new table + RLS
- `supabase/functions/submit-afterparty-interest/index.ts` — new
- `supabase/functions/_shared/transactional-email-templates/afterparty-interest-alert.tsx` — new
- `supabase/functions/_shared/transactional-email-templates/registry.ts` — register template
- (Optional) `src/components/afterparty/AfterPartyAdmin.tsx` — admin panel

## Notes / constraints honored

- No em dashes anywhere in copy.
- All visible strings wrapped in `EditableText` for admin editing.
- Existing `/afterparty` direct-RSVP flow is untouched.
- Reuses existing secrets (`GOOGLE_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`) — nothing new for you to configure.
