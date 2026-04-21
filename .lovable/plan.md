

# Stage 1: PIN auth + RLS lockdown

Replace name-as-password identity verification with a 4-digit PIN sent to the attendee's email on file. Lock down all writes through edge functions backed by a Supabase session. Decisions confirmed:

- **PIN delivery**: Email (via existing Lovable Email infrastructure). One swap point later for Twilio.
- **Session**: Real Supabase auth session (anonymous user linked to attendee), not custom JWT. RLS keys off `auth.uid()`.
- **Admin**: Magic link to a single `ADMIN_EMAIL` env var, scoped to the afterparty admin route only. `/admin/login` and other admin routes untouched.
- **Rate limiting**: Skipping for now — Lovable backend doesn't have rate-limit primitives yet. Will revisit in a later stage.
- **Out of scope for Stage 1**: Photo upload hardening, phone number update flow, slug rotation/honeypot, security headers, sanitize-html, change-log table. Those land in Stage 2+.

## What gets built

### 1. Auth abstraction layer
New file `src/services/auth.ts`. Exports exactly four functions: `requestPin(slug)`, `verifyPin(slug, pin)`, `getSession()`, `clearSession()`. All Supabase, JWT, and storage details live inside. Components only call these four.

### 2. Database changes (one migration)
- Add columns to `afterparty_attendees`: `pin_hash text`, `pin_expires_at timestamptz`, `pin_attempts int default 0`, `pin_locked_until timestamptz`, `auth_user_id uuid` (links attendee to a Supabase auth user), `slug_opened_at timestamptz`, `email_verified bool default false`.
- Tighten RLS on `afterparty_attendees`:
  - `SELECT` for `anon` becomes a safe view that drops `pin_hash`, `email`, `pin_*`. Public can still read names, photos, niches, etc. for the matches grid.
  - Drop `Public can insert/update attendees` policies.
  - Add `Authenticated can update own attendee` (`auth.uid() = auth_user_id`) — this is the only client-side write path.
- Tighten RLS on `afterparty_matches`: `SELECT` only (already correct), no public writes.
- Tighten RLS on `afterparty_suggestions`: keep public insert (form submission), no public read.
- New table `admin_action_log` (id, actor_email, action, payload jsonb, created_at) with service-role-only policies.

### 3. New edge functions
- **`request-pin`** (`verify_jwt = false`): input `{ slug }`. Looks up attendee by slug, generates 4-digit PIN with `crypto.getRandomValues`, bcrypt-hashes (cost 10), stores hash + 10-min expiry, resets `pin_attempts`. Sends PIN via existing transactional email path (`send-transactional-email` with a new `afterparty-pin` template). Returns `{ ok: true, masked_email }` (e.g. `j••••@gmail.com`). If attendee has no email on file: returns `{ ok: false, reason: "no_email" }`.
- **`verify-pin`** (`verify_jwt = false`): input `{ slug, pin }`. Checks lock, expiry, bcrypt compare, attempt count. On failure: increments `pin_attempts`; after 5, sets `pin_locked_until = now() + 30 min`. Generic error message for wrong/expired/locked. On success: ensures an anonymous Supabase auth user exists for this attendee (creates one + stores `auth_user_id` if first time), issues a real Supabase session via the admin API, returns `{ access_token, refresh_token }`. Client calls `supabase.auth.setSession()`. RLS now lets that session update its own attendee row.
- **`afterparty-admin`** (`verify_jwt = true`): single dispatcher for admin-only actions (`lock_matches`, `unlock_matches`, `delete_attendee`, `send_match_emails`, `review_suggestion`). Verifies caller email equals `ADMIN_EMAIL` env var; otherwise 403. Logs every call to `admin_action_log`.

### 4. New transactional email template
`afterparty-pin.tsx` in `_shared/transactional-email-templates/`. Subject: "Your Creator After Party code". Body: large 4-digit code, "Valid for 10 minutes." Registered in `registry.ts`.

### 5. Frontend changes
- **`AfterPartyInvite.tsx`**:
  - Remove the inline name-lookup form and `EditNameGate`.
  - On mount, if URL has a slug: call `auth.getSession()`. If valid + tied to that slug, load card + edit mode is unlocked. Otherwise show new `<PinSheet>` modal.
  - Stamp `slug_opened_at` once via a fire-and-forget edge function call (or inside `request-pin`).
  - "Edit my card" → if no session, opens `<PinSheet>` instead of `EditNameGate`.
- **New `PinSheet.tsx`**: bottom-sheet modal (mobile) / centered dialog (desktop). Two screens:
  1. "Verify it's you. We'll send a 4-digit code to the email on file." → masked email shown after request → "Send code" button.
  2. 4-box PIN entry, auto-advance/backspace, "Resend" disabled with 60s countdown. Generic error on failure.
- **`AfterPartyIntakeForm.tsx`**: submit path no longer does direct `insert/update` from the client. Once a session exists, RLS allows the authenticated update. For brand-new attendees not yet in the table, signup is admin-seeded only (matches current "invite-only" model). New attendees self-creating still works only if the admin has pre-created the row with their email.
- **`AfterPartyAdmin.tsx`**: every mutating action goes through `afterparty-admin` edge function via `supabase.functions.invoke()`. UI unchanged.
- **Delete `EditNameGate.tsx`**.

### 6. Environment variables
- `ADMIN_EMAIL` — added via secret prompt at start of build.
- Existing `SUPABASE_SERVICE_ROLE_KEY` already present.
- No `VITE_` secrets added.

## File map

```text
NEW   src/services/auth.ts
NEW   src/components/afterparty/PinSheet.tsx
NEW   supabase/functions/request-pin/index.ts
NEW   supabase/functions/verify-pin/index.ts
NEW   supabase/functions/afterparty-admin/index.ts
NEW   supabase/functions/_shared/transactional-email-templates/afterparty-pin.tsx
EDIT  supabase/functions/_shared/transactional-email-templates/registry.ts
EDIT  src/pages/AfterPartyInvite.tsx
EDIT  src/components/afterparty/AfterPartyIntakeForm.tsx
EDIT  src/components/afterparty/AfterPartyAdmin.tsx
EDIT  supabase/config.toml      (register 3 new functions)
DEL   src/components/afterparty/EditNameGate.tsx
MIG   one migration: columns + RLS tightening + admin_action_log
```

## What's NOT in this stage (explicit)
- Twilio SMS (PIN goes via email; swap inside `request-pin` later)
- Phone number update flow + `attendee_changes` table
- Photo upload hardening (magic-byte check, signed URLs, private bucket)
- Honeypot field, sanitize-html, security headers, CSP
- Rate limiting (platform doesn't support it yet)
- Slug regeneration with nanoid (existing slugs stay)

## Trade-offs you should know
- **Email PIN means anyone with inbox access to the attendee's email can edit the card.** Same trust model as a magic link. When Twilio gets wired in Stage 2, swap one function and add a phone column.
- **Anonymous Supabase users** will accumulate one row in `auth.users` per attendee who verifies. Cheap, but visible in your auth dashboard.
- **No rate limiting** means PIN-request abuse is possible. Acceptable for a 200-person invite-only event; revisit before broader use.

