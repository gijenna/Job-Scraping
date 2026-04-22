

## Brand activation prompt — show on first save + add to email

Make the brand activation CTA visible at three moments instead of one: (1) immediately after a brand rep first saves their RSVP, (2) on their saved card view going forward, and (3) inside the After Party invite email itself.

### 1. Intake form — show CTA on first save

**File:** `src/components/afterparty/AfterPartyIntakeForm.tsx`

- Add local state `justSavedId` (string | null), set inside the existing `submit()` success path using the `id` returned from the insert/upsert.
- Change the existing brand CTA gate from `form.role === "brand" && attendeeId` to `form.role === "brand" && (attendeeId || justSavedId)`.
- Pass `attendeeId || justSavedId` as the `attendeeId` prop to `BrandActivateButton` so the activation request gets correctly attributed.
- Auto-scroll to the CTA after first save so the brand rep notices it (smooth scroll into view, no layout jank).

### 2. Saved card view — relax owner gate for the just-RSVPed user

**File:** `src/pages/AfterPartyInvite.tsx`

- Add `justRsvped` boolean state, flipped to `true` inside `handleSaved` (the existing post-save callback).
- Change the brand CTA gate from `isOwner && me.role === "brand"` to `(isOwner || justRsvped) && me.role === "brand"`.
- This keeps the CTA hidden from random visitors browsing someone else's brand card, but shows it to the person who just signed up (no PIN dance needed).

### 3. Email — add brand activation block to the invite email

**File:** `supabase/functions/_shared/transactional-email-templates/afterparty-invite.tsx`

- Add a new optional prop `role?: 'creator' | 'brand' | 'expert'` to the template.
- When `role === 'brand'`, render an additional section below the main CTA with:
  - Heading: "Want to activate your brand at the After Party?"
  - One-line pitch (matches the in-app copy: Jenna will personally reach out within one business day).
  - Secondary button linking to `${inviteUrl}?activate=1` styled in coral on cream — visually distinct from the primary "Fill out your profile" button.
- Update `previewData` to include a brand example.
- No new template, no separate email — this is a conditional block inside the existing invite.

**File:** `src/pages/AfterPartyInvite.tsx` (also)

- On mount, read the `activate=1` query param. If present AND `me.role === 'brand'`, set `justRsvped = true` (or a parallel `forceShowActivate` flag) so the CTA renders immediately when they land from the email — even before they verify with PIN.
- Strip the param from the URL after reading (`history.replaceState`) to keep the link clean on refresh.

### 4. Trigger — pass role to the invite email

**File:** `supabase/functions/send-afterparty-invites/index.ts`

- Include `role: attendee.role` in the `templateData` passed to `send-transactional-email`. (One-line change.)

### Out of scope

- No DB / schema changes
- No changes to creator or industry-expert flows
- No changes to `BrandActivateButton` itself
- No changes to PIN/auth flow

### Files touched

- `src/components/afterparty/AfterPartyIntakeForm.tsx`
- `src/pages/AfterPartyInvite.tsx`
- `supabase/functions/_shared/transactional-email-templates/afterparty-invite.tsx`
- `supabase/functions/send-afterparty-invites/index.ts`

After edits, the invite email function will be redeployed automatically.

