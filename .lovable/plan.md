## Four UX fixes to candidate Connect flow + brand rep sign-in

### Fix 1: Shared bottom nav across all candidate Connect pages

Create `src/components/connect/ConnectBottomNav.tsx` that renders a sticky bottom nav (mobile) and inline top-right nav buttons (desktop) with four destinations:

- Map (route `/outsidedays26/connect/home?view=map`)
- List (same route, `?view=list`)
- Connections (`/outsidedays26/connect/connections`)
- Profile (`/outsidedays26/connect/profile`)
- How (`/outsidedays26/connect/how-it-works`)

Visually highlight the active item using `useLocation()` plus the `view` cookie/query for Map vs List.

Wire `ConnectHome.tsx` to read/write `?view=` (so Map/List toggle is selectable from other pages), keep its existing top header on desktop, and mount `ConnectBottomNav` on mobile.

Mount `ConnectBottomNav` on `ConnectProfile.tsx`, `ConnectConnections.tsx`, and `ConnectHowItWorks.tsx`. Add bottom padding (`pb-24`) so content is not hidden behind it.

### Fix 2: Industry Expert Zone in list view, default open + Edges First sponsor credit

In `ConnectHome.tsx`'s `ListView`:

- Replace the collapsed "Also at the event" card with an always-expanded section: `Industry Expert Zone` heading, sponsor row, then a grid of `ExpertCardMinimal` thumbnails (same component used in the existing modal). Tapping a face opens `ConnectPersonSheet` for that expert (lift `setSheetExpert` up to `ListView` via prop, identical to current modal behavior).
- Sponsor credit row: small bubble logo of the brand named `Edges First` (look up by name in `brands` from `useEventMapBrands`, use the existing `brandLogo` helper). Tapping opens Kelly's expert card via `ConnectPersonSheet` with a new prop `sponsorContext: "expert_zone_header"`.
- Beside the bubble: small text "Industry experts brought to you by Edges First".
- Resolve "Kelly" by first-name match on the `experts` list filtered to current_company `Edges First` (fallback: name `Kelly`), to avoid hardcoded ids.

In `ConnectPersonSheet.tsx`:

- Accept optional `sponsorContext?: "expert_zone_header"` prop. When set, append a styled section at the bottom of the card body (above the action footer) with the sponsor copy and a "Learn more about Edges First" link pulled from the `Edges First` brand `website_url`. Do not render this section in any other entry point.
- Pass the brand record down so the link is dynamic.

### Fix 3: Connection summary view (read-only) with single close X

Today, tapping a connections list row opens `ConnectionForm` directly. Replace with a new component `src/components/connect/ConnectionSummary.tsx` that renders a Sheet-based summary, with exactly one close X in the top-right (header bar matching `ConnectPersonSheet`).

Branching by `mode`:

- `brand`: brand logo + name, "You marked yourself as visiting this brand", date logged, private notes block, list of reps the candidate noted talking to (parse from a multi-select if present in the brand-mode form, otherwise omit), Edit Connection button, plus "Send a note" buttons next to each rep at this brand (look up reps from the brand record via existing brand fetch path used by `MapBrandPanel`).
- `brand_rep`: rep avatar/name/brand/title at top, private notes, follow-up direction, contact info received, role flagged. If a note exists for this rep, show a quote block: `Your note to {rep first name}: {message}` + the CTA chip + sent date. Edit Connection and Edit/Send Note buttons.
- `expert`: same as rep, plus "Mentor flagged" + mentor topics if filled.

Visual divider between "your private notes" and "the note you sent them" so they're not confused.

Edit buttons open `ConnectionForm` (and `NoteComposer` for note edits) as today, replacing the summary.

Update `ConnectConnections.tsx` to open `ConnectionSummary` instead of `ConnectionForm`, fetching note + brand reps as needed via existing helpers (`connectNotesGetMine`, `mapBrand` reps endpoint).

Audit `ConnectionForm.tsx` for the second X. The Sheet ships with its own close affordance and the form likely renders an additional manual X. Remove the manual one so only the Sheet close remains. This keeps editing usable but with one X.

### Fix 4: Brand rep sign-in branding

Rebuild the unauthenticated portion of `BrandDashboard.tsx` (the `mode !== "signed_in"` branch) into a single branded shell that wraps each step's form:

- Header block (always visible regardless of step):
  - Outside Days 26 event logo at top (reuse `connectLogo` from `@/assets/connect-basecamp-outside-days.png` already imported elsewhere, or pull `home_header_subtitle`-equivalent setting).
  - Event photo placeholder: a polaroid-style cream-bordered box with a soft coral/teal gradient and small italic caption "Event photo coming soon" (Jenna will swap via admin later, leave a TODO note pointing at `event_settings` key `dashboard_signin_photo_url` so a follow-up admin can wire the upload).
  - Heading "Brand Dashboard" (font-afterparty)
  - Subtitle "Denver Outside Days 26"
  - Body copy: "Sign in to view candidates, see who visited your table, and read notes from people who reached out. Your dashboard goes live with the full database after the event."
- Step-specific form card below (existing lookup / add_phone / login forms unchanged in logic).
- Below the form: small reassurance text "Your phone number is private. We use the last 4 digits to verify it's you. We never text reps and never share your number."
- Apply existing palette: dark teal background, cream and coral accents, polaroid/bubble treatments consistent with rest of app.

No changes to `brandRepLookup`, `brandRepAddPhoneAndLogin`, `brandRepLogin`, edge functions, or any auth wiring.

### Constraints

- No DB schema changes, no edge function changes, no auth flow changes.
- No em dashes anywhere.
- All new copy strings used in user-facing places should be wrapped with `EditableText` against `event_settings` so Jenna can edit (sponsor credit text, sign-in body, reassurance line, "Industry experts brought to you by Edges First", sponsor card paragraph).
- Use existing semantic tokens (`bg-events-teal`, `text-events-cream`, `bg-events-coral`, etc).

### Verification

- Resize to 375px: bottom nav visible on Profile, Connections, How, and Home (both views), active item highlighted, all destinations reachable.
- Desktop (1136px): existing top nav continues to render on Home; the same nav appears in a desktop-appropriate slot on the other pages.
- List view scrolls to expert grid by default, faces visible, sponsor bubble tappable, Kelly's card shows the sponsor section only when opened from the header sponsor bubble.
- Connections list row opens summary with one X, shows sent note text + recipient + private notes; Edit opens the form.
- `/outsidedays26/dashboard` shows logo, photo placeholder, heading/subtitle/body, then form, then reassurance text at all three steps.
