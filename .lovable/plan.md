## Phase 1 scope
Data model + auth + candidate profile creation. No connections logging UI, no brand dashboard, no map browse yet (those are later phases).

## Decisions locked from your answers
- Returning login = name + last 4 of phone, no second factor.
- Brand reps = existing `industry_experts` rows where `expert_type='brand_rep'` (joined via `expert_city_assignments`). No new `brand_reps` table.
- "Brands" = `event_map_brands` (already has `offers_remote`, `currently_hiring`, `culture_blurb`).

## Auth model (custom, not Supabase Auth)
Because name + last-4 is too weak for real Supabase Auth sessions, we run a custom session layer for candidates and brand reps:
- A `user_sessions` table holds opaque session tokens (32-byte random) with `expires_at = now() + 30 days`, `subject_type` (`candidate` | `brand_rep`), `subject_id`.
- Token stored in an `httpOnly`-style mechanism is not possible from the SPA; instead we keep it in a Supabase cookie via `supabase.auth` is not used. Per the brief's "no localStorage" rule, store the token in a **cookie** (`Secure; SameSite=Lax; Max-Age=2592000`) set by an edge function response.
- Two edge functions:
  - `candidate-auth`: actions `signup_lookup`, `signup_create`, `login` (name + last4), `me`, `logout`.
  - `brand-rep-auth`: actions `lookup`, `add_phone`, `login`, `me`, `logout`.
- Each function reads the cookie, validates the token against `user_sessions`, and returns the subject. RLS on `candidates`/`connections` is OFF for direct anon access; all reads/writes go through edge functions that authorize using the session token. (We keep RLS enabled with deny-all for anon as a backstop.)
- Admin (`@wearetheoutdoorindustry.com`) keeps existing Supabase Auth and is treated as a third subject type with full access.

## Database migration
New tables:
- `candidates` (full schema from spec). `phone_last_four text generated always as (right(regexp_replace(phone,'[^0-9]','','g'),4)) stored`. Unique index on `lower(email)`. Index on `(lower(first_name), lower(last_name), phone_last_four)`.
- `connections` (schema only, no UI yet).
- `candidate_starred_brands`.
- `brand_starred_attendee` (schema only).
- `filter_logs`.
- `email_templates` + `email_template_versions` (schema only, admin UI in later phase; seed with one row for `candidate_signup_confirmation`).
- `user_sessions (id uuid pk, token text unique, subject_type text, subject_id uuid, created_at, expires_at, last_seen_at)`.

Extend existing tables:
- `event_map_brands`: add `is_featured boolean default false`. (`offers_remote`, `currently_hiring`, `culture_blurb` already exist.)
- `industry_experts`: add `phone text`, `phone_last_four text generated`. Used for brand rep login.

`profile_completeness_score` is a generated column counting non-null optional fields.

RLS: enable on every new table. Default policies: `service_role` only. Edge functions use the service role key. (Per project security memory, no anon CRUD on personal data.)

Storage buckets (private):
- `candidate-photos`
- `candidate-resumes`
RLS: only service role can read/write. Front end calls edge functions that return short-lived signed URLs.

## Edge functions (new)
- `candidate-auth/index.ts` (custom session, no JWT verify required by client; we set our own cookie)
- `brand-rep-auth/index.ts`
- `candidate-profile/index.ts` (`get`, `update`, `upload_photo_signed_url`, `upload_resume_signed_url`)
- `admin-impersonate/index.ts` (admin Supabase JWT verified; mints a `user_sessions` token for the target subject and returns a one-time URL with `?as=<token>`; the candidate/brand pages exchange `?as=` for a cookie)

All functions: CORS headers, zod input validation, no raw SQL, never log PII.

## Frontend routes
- `/outsidedays26/connect` - candidate auth + onboarding wizard
- `/outsidedays26/connect/profile` - profile editor (post-signup, also accessible later)
- `/outsidedays26/dashboard` - brand rep auth + landing (just shows "you're signed in, full dashboard coming next phase")
- Admin: extend `/admin/experts` (or new `/admin/candidates`) with an "Impersonate" input. Show "Exit impersonation" banner on the candidate/rep page when `?as=` was used.

## Components
Reuse existing patterns:
- Bubble logo selector (already used in `AdminLogoManager` / `EventLogoTicker`). Extracted into a shared `BubbleLogoPicker` component for `dream_companies` and any future logo input.
- Polaroid photo frame from `ExpertCard`.
- Form styling matches `ExpertIntakeForm` (dark teal bg, cream text, coral CTAs, Josefin Sans).

New components:
- `CandidateAuthGate` - mobile-first card that handles new vs returning split, then renders the right form.
- `CandidateOnboardingWizard` - multi-step (Identity, Photo, Status, Field/Focus, The Hook). Step indicator at top. Required-only by default; "Add more details" CTA at end opens the optional editor.
- `PhotoCaptureField` - uses `<input type="file" accept="image/*" capture="user">` for selfie, falls back to upload, shows the exact prompt copy from the spec, includes a Skip button.
- `FieldFocusSelect` - cascading select; Field/Focus taxonomy stored in a new `taxonomies` table or hardcoded constant for v1 (will use a TS const map in `src/lib/taxonomies.ts`; later moved to DB if needed).
- `BrandRepPhoneGate` - the exact "One quick step" copy block; only shown when matched rep has no phone.
- `ImpersonationBanner` - sticky top banner with Exit button.

## Taxonomies (v1 in `src/lib/taxonomies.ts`)
- `FIELDS` -> `FOCUSES_BY_FIELD` cascading map. Seed with the outdoor-industry list you've used elsewhere (Marketing, Product, Design, Sales/Account, Ops, Retail, Manufacturing, Sustainability, Sponsorship/PR, Tech, Finance, HR/People, Other) with 4-6 focuses each. We can refine in a follow-up.
- `JOB_TYPES`, `REMOTE_PREFS`, `WORKPLACE_TYPES`, `POACHABLE_STATUS`, `CAREER_STAGE` from spec.
- Skills + Niches taxonomies are referenced but spec says "see Phase 2", so leave the columns (`areas_of_expertise`, `niche_experience`) and skip the UI selectors in Phase 1; admin can edit raw via impersonation later.

## Validation & UX rules
- Zod schemas client-side and server-side. `the_hook <= 100`, `the_pitch <= 500`, `culture_blurb <= 280`, resume <= 5MB and `application/pdf` only.
- No em dashes in any copy (CI not required, just discipline + rg before commit).
- Mobile-first: every screen tested at 375px. Single column, large tap targets, sticky bottom CTA on wizard steps.
- Phone is masked in all non-admin views; only `phone_last_four` is read-side accessible.

## Out of scope for Phase 1 (will be later phases)
- Connections logging UI
- Map browsing for candidates
- Brand dashboard with filters / `filter_logs` writes
- Email template admin UI + actual sending
- Recap view
- DEI fields UI
- Skills/Niches selectors

## Files touched / created
**Migration**: 1 new SQL migration with all tables + 2 column adds + storage buckets + RLS.

**Edge functions** (new):
- `supabase/functions/candidate-auth/index.ts`
- `supabase/functions/brand-rep-auth/index.ts`
- `supabase/functions/candidate-profile/index.ts`
- `supabase/functions/admin-impersonate/index.ts`

**Frontend** (new):
- `src/pages/outsidedays/Connect.tsx`
- `src/pages/outsidedays/ConnectProfile.tsx`
- `src/pages/outsidedays/BrandDashboard.tsx`
- `src/components/connect/CandidateAuthGate.tsx`
- `src/components/connect/CandidateOnboardingWizard.tsx`
- `src/components/connect/PhotoCaptureField.tsx`
- `src/components/connect/FieldFocusSelect.tsx`
- `src/components/connect/BubbleLogoPicker.tsx` (extracted)
- `src/components/connect/BrandRepPhoneGate.tsx`
- `src/components/connect/ImpersonationBanner.tsx`
- `src/lib/taxonomies.ts`
- `src/lib/connect-session.ts` (cookie + edge-function fetch helpers)

**Routes**: register the 3 new routes in `src/App.tsx`.

**Admin**: add "Impersonate" input on `src/pages/AdminExperts.tsx` (or a small new admin tab) calling `admin-impersonate`.

## Open follow-ups (will confirm before Phase 2)
- Field/Focus exact taxonomy contents (placeholder list shipped).
- Whether `email_templates` should be wired to an existing transactional sender or stay schema-only until Phase N.
- Whether to send a candidate signup confirmation email in Phase 1 (currently no, since email infra adds scope).
