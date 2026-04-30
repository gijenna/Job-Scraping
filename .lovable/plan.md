# Separate After Party admin from Expert CRM

## Goal
Make the After Party admin reachable directly via its own URL slug (`/experts/afterparty`) instead of being buried as a tab inside `/admin/experts`. Easy to type / bookmark.

## Changes

### 1. New page: `src/pages/AdminAfterParty.tsx`
- Mirror auth gate from `AdminExperts.tsx` (reject missing/anonymous sessions, redirect to `/admin`).
- Reuse existing `<AfterPartyAdmin />` component as the body.
- Same dark teal page chrome and header (Back button → `/events`, title "After Party Admin").
- Add a small secondary link back to `/admin/experts` ("Expert CRM") so it's easy to bounce between the two.

### 2. Route registration in `src/App.tsx`
- Import `AdminAfterParty`.
- Add `<Route path="/experts/afterparty" element={<AdminAfterParty />} />` near the top of the `<Routes>` block (in the "Pinned to top for quick access" group, right under the `/afterparty*` routes) so the slug is easy to find in the file.

### 3. Cross-link in `src/pages/AdminExperts.tsx`
- Keep the existing After Party tab in place (no behavior change there) but update its label/tooltip to note the standalone URL, OR add a small "Open standalone ↗" link next to the tab that navigates to `/experts/afterparty`. Lean toward the small link — non-destructive.

## Out of scope
- No changes to `AfterPartyAdmin.tsx` itself.
- No changes to public `/afterparty` routes.
- No data / RLS changes.

## Result
- `/experts/afterparty` → standalone After Party admin (auth-gated).
- `/admin/experts` → unchanged, still has the After Party tab as a fallback.
