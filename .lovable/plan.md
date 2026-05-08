# Connect app: visual continuity + signup flow overhaul

This is a large change. I'll group it into 6 buckets so it's easy to review.

---

## 1. Visual continuity with /outsidedays26

Connect home, signup, profile, dashboard, and the new full-profile page all wrap in a shared layout that matches `EventOutsideDays26`:

- Background: `hero-denver-mountains.jpg` (same image used on the event page) with a dark teal overlay for legibility.
- Logo lockup at the top: `outside-days-logo.png` paired with the `basecamp-outdoor-logo.png` (Basecamp Outdoor @ Outside Days), styled like the screenshot.
- Typography: `font-afterparty` (Unbounded) for the big "Outside Days" wordmark area, `font-body` (Josefin Sans) for everything else. Existing tokens, no new fonts.
- Color tokens: `events-cream`, `events-coral`, `events-teal`, `events-yellow` already in `tailwind.config.ts`.

A new `<ConnectShell>` component holds the hero/photo/logo/footer so every Connect route looks consistent. No new image assets needed — we reuse what's already in `src/assets/`.

---

## 2. Admin-editable copy everywhere in Connect (no AI credits used)

Wrap every visible string in Connect (`Connect.tsx`, `ConnectHome.tsx`, `ConnectProfile.tsx`, `ConnectConnections.tsx`, the new full-profile page, and the dashboard) in `EditableText` / `EditableLink`, using the existing `EditableTextProvider` with a new `pageSlug="outsidedays26-connect"`.

Editable strings include: section headers, field labels, hints, button labels, dropdown options, tooltips, and the Hook/Pitch examples. Admins (signed-in via the existing Supabase admin auth) get inline click-to-edit; non-admins see plain text. This uses the existing `event_settings` table — no AI calls, no credits, no schema change for this.

For dropdown options that ladder (e.g. FIELDS / FOCUSES, JOB_TYPES, CAREER_STAGE, POACHABLE_STATUS, REMOTE_PREFERENCES, WORKPLACE_TYPES, NICHES) we expose a single editable JSON string per list, with a fallback to the existing `taxonomies.ts` defaults. Saved values override the defaults at runtime.

---

## 3. Quiz tempo + UX changes (essentials path, `Connect.tsx`)

Reorder and adjust the existing 7-step minimal wizard. No DB changes here.

- New step order: name/email → phone → **career stage** → **poachable status** → field/focus/years → The Hook → photo (moved to end).
- Field "Other": when the selected field is `Other`, show a free-text "Tell us what you do" input that gets stored in a new column `field_other` (text, nullable).
- The Hook: pre-fill the textarea with the example *"I'm the designer brands hire when they want soft goods that actually perform in the field."* Treat it as visible placeholder text the user writes over (focus selects all). Below the field, render an "Examples — stuck? Make one your own" panel with the full categorized list of inspiration hooks (Marketing & growth, Design & creative, Sales & business development, Product & development, Operations & supply chain, Retail & e-commerce, People HR & culture, Tech & engineering, Guiding/outdoor education/field work, Writing/editing/journalism, Sustainability & conservation, Cheekier, Career-transition framing). Collapsible by category. Clicking an example copies it into the textarea.
- The Pitch (only on the full form, but applies the same UX pattern): same treatment, with its own example seed text and inspiration list.
- Photo step gets a clearer "Skip and finish" affordance since it's now last.

---

## 4. Branching first screen + new comprehensive form

### New first screen at `/outsidedays26/connect`

Renders before the existing 7-step wizard:

- Title: "How much time do you have right now?"
- Subtitle: "Either way, you can edit and add more anytime."
- Two large stacked coral cards:
  1. 📋 "I'll do the full profile" "About 5 to 7 minutes. Brands can fully filter and find you."
  2. ⚡ "Just the essentials for now"  "About 90 seconds. You'll come back and finish later."

Tap behavior:

- Card 1: stash `signup_mode = "full"` in component state, route to `/outsidedays26/connect/full`.
- Card 2: stash `signup_mode = "essentials"`, continue into the existing wizard.

The chosen mode is persisted to the candidate row on first save.

### New page `/outsidedays26/connect/full` (`ConnectFull.tsx`)

Single long page, all fields visible, organized into 7 sections matching the spec:

1. **About you*** — first/last name, email, phone, photo, career stage, poachable status
2. **What you do*** — field (+ field_other if Other), focus, years in current field, areas of expertise (`SKILL_CATEGORIES` searchable multi-select), niche experience (`NICHES` with optional years)
3. **Where you're going** — dream role, job types, min pay rate, current location, open to relocation, remote preference, workplace type
4. **Your story** — total years professional, prior careers (repeater max 3), outdoor industry exp + years, management exp + years
5. **The Hook*** — pre-loaded example + inspiration list (same as quiz)
6. **The Pitch** — pre-loaded example + inspiration list
7. **Round it out** — current title/company, LinkedIn, portfolio URL, dream companies (`BubbleLogoPicker`), resume upload (PDF, 5MB max)

Behaviors:

- Sticky top progress bar driven by existing `profile_completeness_score` recomputed client-side as fields fill in.
- Auto-save indicator ("Saved 12s ago"), 30-second debounced PATCH via `candidateUpdateProfile`.
- Submit button "Submit and see the map" → validates required fields (asterisked above), scrolls to first missing field with inline error, then routes to map.
- All copy editable via `EditableText`.

### Completion screen for the essentials path

After the existing final step, before routing to the map, show:

- Title: "You're in! "
- Body: "You can head to the brand map now to research who's coming. Brands are way more likely to follow up if your profile is complete though. Want to add the rest now?"
- Primary coral: "Add the rest now" → `/outsidedays26/connect/full` (existing data pre-fills automatically since we'd already have the candidate row)
- Secondary ghost: "Take me to the event map"

### Persistent reminder banner on the map

In `ConnectHome.tsx` (the map home), for any logged-in candidate with `profile_completeness_score < 80`, show a dismissible coral banner:

> "Brands filter on full profiles. Yours is [X]% complete." [Complete it →]

Dismissal stored in an in-memory session flag (per project rule: no localStorage/sessionStorage). It re-shows on next session/login.

---

## 5. Database migration

One migration adding two columns to `candidates`:

- `signup_mode text` — `'full' | 'essentials'`, nullable
- `field_other text` — nullable, used when `field = 'Other'`

No RLS policy changes needed — existing edge functions (`candidate-auth`, `candidate-profile`) already enforce session ownership and are updated to accept the two new fields in their allow-lists.

---

## 6. Files

**New**

- `src/components/connect/ConnectShell.tsx` — shared hero/logo/background wrapper
- `src/components/connect/HookExamples.tsx` — reusable Hook/Pitch inspiration panel
- `src/pages/outsidedays/ConnectFull.tsx` — comprehensive single-page form
- `supabase/migrations/<ts>_signup_mode.sql`

**Edited**

- `src/App.tsx` — add `/outsidedays26/connect/full` route
- `src/pages/outsidedays/Connect.tsx` — branching first screen, reorder wizard, photo last, Other field, Hook example + inspiration, completion screen, all copy via EditableText
- `src/pages/outsidedays/ConnectHome.tsx` — persistent profile-completeness banner, EditableText wrapping
- `src/pages/outsidedays/ConnectProfile.tsx` — EditableText wrapping, Hook/Pitch examples
- `src/pages/outsidedays/ConnectConnections.tsx` — EditableText wrapping
- `src/pages/outsidedays/BrandDashboard.tsx` — EditableText wrapping (visible labels only; data unchanged)
- `supabase/functions/candidate-auth/index.ts` and `supabase/functions/candidate-profile/index.ts` — allow `signup_mode` and `field_other` in insert/update allow-lists

**Out of scope (explicitly not touched in this prompt)**: brand dashboard data logic, connections flow logic, recap view, admin sections, email templates.

No em dashes anywhere in new copy.

---

## Open question before I build

The completion-screen banner ("Brands filter on full profiles…") is described as dismissible with X but project rules forbid localStorage/sessionStorage. I'll use an in-memory React state so it dismisses for the current session and reappears on next sign-in. If you want it to stay dismissed across sessions, say the word and I'll add a `profile_banner_dismissed_at` column on `candidates` instead.