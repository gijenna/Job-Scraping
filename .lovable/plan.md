# Three surgical Connect fixes

No database schema, taxonomy, or unrelated UI changes. All work confined to: `supabase/functions/candidate-auth`, `supabase/functions/brand-rep-auth`, `supabase/functions/_shared/connect-session.ts`, `src/lib/connect-session.ts`, `src/pages/outsidedays/BrandDashboard.tsx`, `src/pages/outsidedays/ConnectHome.tsx`.

## Important context the user should know

The candidate / brand-rep auth in `/outsidedays26/*` does NOT use Supabase Auth. It uses a custom HttpOnly cookie (`od_sid`) that points at rows in `user_sessions`. All edge functions (`candidate-profile`, `connect-notes`, `connections`, `brand-dashboard`) read this cookie via `readSession()`. Switching to real Supabase Auth would require touching every one of those edge functions and the entire RLS layer — explicitly out of scope. So "establish/persist the session" here means "make the `od_sid` cookie reliably round-trip on every call."

The "Not signed in" errors after a successful login are almost certainly a **cookie-not-being-sent** problem, not a "session wasn't created" problem. The session row is created — the browser just isn't returning the cookie on the next request. Two known causes in the current code:

1. The cookie is set with `SameSite=None; Secure` from the function origin (`*.supabase.co`) but the SPA runs on a different origin (`*.lovable.app` or the custom domain). Some browsers (Safari, embedded webviews, ITP) silently drop these third-party cookies even with `credentials: "include"`. This is the most likely cause of the "logged in then immediately not signed in" symptom.
2. `Access-Control-Allow-Origin` is currently echoed as the request `Origin`, which is correct, but the cookie still requires the browser to accept third-party storage.

The robust fix is to **also** return the session token in the JSON response and have the SPA send it as an `Authorization: Bearer <od_sid>` header on every subsequent call. The cookie stays as a fallback. The edge functions already have one place that reads the session (`readSession`) — we just teach it to also accept the bearer header. Token storage in the browser uses `sessionStorage` keyed per-tab plus an in-memory mirror, refreshed from the response on every successful auth call. (Project rule says no localStorage; sessionStorage is acceptable for a 30-day server-side session whose token is only a pointer.)

If the user prefers to keep tokens out of any web storage at all, the alternative is to require a custom subdomain so the cookie becomes first-party — that is a DNS change, not a code change, and would not be solved by this plan.

## Bug 1 — Candidate session persists across all writes

### Edge: _shared/connect-session.ts

- `readSession(req)`: in addition to reading the `od_sid` cookie, also accept `Authorization: Bearer <token>` and look up `user_sessions` by that token. Cookie wins if both present.
- Add the token to the JSON body of every auth response (already returned via Set-Cookie; just also include `{ token }` in the JSON).
- Ensure CORS allows the `Authorization` header (it already does).

### Edge: candidate-auth/index.ts

- `signup_create_basics`, `signup_create`, `login`: include `token` in the JSON response (in addition to the cookie).
- `login`: if a candidate matches by name+last4 but does not yet have an `od_sid` row, still create one (this already happens, confirm and leave alone). No new auth user creation needed because we are not on Supabase Auth.

### Edge: brand-rep-auth/index.ts

- Same: return `token` in JSON for `add_phone` and `login`.

### Frontend: src/lib/connect-session.ts

- Add a tiny token store: in-memory variable + `sessionStorage["od_sid"]` mirror. `setToken(t)` on every successful auth response; `clearToken()` on logout.
- `call()` always sends `credentials: "include"` (cookie path) AND, if a token is known, `Authorization: Bearer <token>` (header path). Either path alone is sufficient server-side.
- Helper `bootstrapToken()` reads sessionStorage on app load so refreshes survive.
- After every `candidateSignupCreateBasics`, `candidateSignupCreate`, `candidateLogin`, `brandRepAddPhoneAndLogin`, `brandRepLogin`, capture `data.token` and store it. After `candidateLogout` / `brandRepLogout`, clear it.

### Stale token handling (added requirement)

On the first authenticated API call after `bootstrapToken()` loads a token from sessionStorage, if the server returns a 401 or "not signed in" response, clear the local token (in-memory + sessionStorage) and route the user to the appropriate sign-in screen (candidate or brand rep depending on URL). Do not silently retry. Do not show a generic error. Show the sign-in flow.

### sessionStorage fallback (added requirement)

Confirm the token store gracefully handles environments where sessionStorage is unavailable (some embedded webviews block it, e.g. Outlook preview pane, Instagram in-app browser). If sessionStorage write throws, fall back to in-memory only and log a console warning. The user should still be able to use the app within that tab; they just won't survive a refresh in that environment.

This single change fixes both 1A (basics save then subsequent profile save) and 1B (existing login then star/note/edit) because every authed call now carries proof of session via header even if the cookie was dropped.

---

## Bug 2 — Brand rep without phone is sent to "add phone"

### Edge: brand-rep-auth/index.ts

Tighten `isMissing`: `!r.phone || !r.phone_last_four || String(r.phone_last_four).trim() === ""`. (Empty-string case is the regression the user is seeing.)

### Frontend: src/pages/outsidedays/BrandDashboard.tsx

- The lookup branch already routes `needs_phone` → `add_phone` mode. Verify and leave the routing alone. The bug is on the server returning `needs_phone: false` for empty-string `phone_last_four`, which the tightened check above resolves.
- After successful `brandRepAddPhoneAndLogin`, transition to `signed_in` (already done), confirm token is captured per Bug 1.

---

## Bug 3 — Tapping an industry expert opens their card, not the connection form

### Frontend: src/pages/outsidedays/ConnectHome.tsx

- Replace the `ExpertCardMinimal onClick={() => setLogExpert(e)}` flow that opens `ConnectionForm` directly.
- Use the existing `ConnectPersonSheet` with `subjectType="expert"` and pass the full Expert object. This is the same component brand reps already use; it shows the full card with the sticky action footer and lets the candidate choose Send Note vs Log Connection (mode-aware, matching event timing).
- Remove the now-dead `<ConnectionForm mode="expert" .../>` block at the bottom of ConnectHome.tsx. State `logExpert` becomes `sheetExpert` of type `Expert | null`.

No changes to `ConnectPersonSheet`, `ConnectionForm`, or any expert-card component, they already support the "expert" subject type.

---

## Verification checklist

All scenarios below must be verified specifically in Safari (or another browser with strict third-party cookie blocking) to confirm the bearer header path is working. If any test passes in Chrome but fails in Safari, the bearer mechanism is not actually being used and the bug is not fixed.

- New candidate: `signup_create_basics` → save more fields → star a brand → refresh → still signed in. All without "Not signed in".
- Existing candidate: log in by name + last4 → star → send pre-event note → edit field → refresh → still signed in.
- Brand rep with no phone on file: enter name → sees "Add your phone" UI (not the last-4 prompt) → submits phone → lands on dashboard signed in.
- Brand rep with phone on file: enter name → goes straight to last-4 prompt → enters last4 → signed in.
- Candidate taps an industry expert in the Expert Zone or grid → expert card opens in the bottom sheet with the action footer. Tapping a brand rep still works the same as today.
- Stale token handling: manually delete the user_sessions row for a logged-in user, then attempt any action. App should clear local token and route to sign-in, not loop on errors.

---

## Out of scope (will not touch)

- Database schema, RLS policies, taxonomies.
- Migrating to real Supabase Auth.
- Card layouts, badge labels, dashboard sort/filter logic, or any unrelated UI.