

# Creator After Party — Brand, Question, & UX Overhaul

Based on your Claude framework, I'll restyle the After Party page as **Basecamp Match × Popfly**, swap the matching question, expand intent options, and add photo upload with a generated cartoon avatar.

## What changes

### 1. Co-branded animated logo header
- New `BasecampMatchPopflyLogo` component at the top of `/afterparty`
- Two logo marks slide in from opposite sides and meet at a glowing neon `×`
- **Basecamp Match** (left): campfire mark in neon amber `#E1B624` with pulsing flame glow
- **Popfly** (right): outdoor pin/play mark in neon teal `#3DDFD5` with pulsing glow
- Animated neon divider line grows between them, then "Creator After Party" fades in below
- Pure CSS/SVG animation (Framer Motion-free, runs on load)
- Uploaded `Basecamp_match_logo-darkmode.png` saved to `src/assets/` and used as the left mark

### 2. Better matching question (replaces "mind-blowing fact")
- Field renamed in UI: **"What's something you've made that you're most proud of — and why did it work?"**
- DB column `mind_blowing_fact` is reused (no migration); only the label/placeholder change
- Placeholder hints: "Link a video, campaign, or product launch. The 'why' is the part that matches you with the right people."
- Shown for both creators AND brands (brands describe a collab/launch)
- Displayed prominently on each match card as the conversation starter

### 3. Expanded "I'm looking for" chips (both roles)
New shared options for everyone:
- Make friends in the industry
- Find a creator to collab with
- Find a travel partner
- Just here to vibe

Existing creator/brand-specific chips stay. The new chips are visually grouped with an **amber tint** to signal "social" vs the **coral** "professional" chips.

### 4. Matching algorithm tweaks (`afterparty-matching.ts`)
- **Same-role pairing now allowed when** both selected `Make friends`, `Find a creator to collab with`, or `Find a travel partner` AND share ≥1 niche → no 0.6× penalty in that case
- **"Just here to vibe"** → attendee is excluded from being _ranked into_ others' top 5 unless mutual, and their own matches are de-emphasized (lower weights, friendly tone)
- **Profile completeness tiebreaker**: when scores tie, attendee with more filled fields ranks higher
- **Brand-first override**: if a brand seeks creator-type X and a creator IS X → that match jumps to top of brand's list before general ranking
- Reasons rewritten with warmer copy ("You both want to find a travel buddy in fishing")

### 5. Photo upload + dual avatar display
- Existing photo upload stays (already wired to Supabase Storage)
- New helper: after upload, store original in `photo_url` and a generated cartoon version in new column `cartoon_url`
- Cartoon generated via **Lovable AI** (`google/gemini-2.5-flash-image`) with prompt: "Convert this portrait into a flat illustrated cabbage-patch style cartoon avatar, friendly outdoor vibe, transparent or simple solid background, head and shoulders only"
- Edge function `generate-cartoon-avatar` handles the call (keeps API usage server-side)
- Card preview + match list show **both side-by-side**: real photo left, cartoon right
- Falls back gracefully if cartoon generation fails (just shows real photo)

### 6. Copy polish
- Email reveal subject/preview reframed: **"Your 5 people are waiting"** (not "Your matches")
- In-page header: "Your 5 people" instead of "Your top 5 matches"
- All headings remain admin-editable via existing `event_settings` system

## Technical details

**DB migration:**
- Add `cartoon_url text` to `afterparty_attendees`
- No new tables; `mind_blowing_fact` reused with new UI label

**New files:**
- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` — animated co-branded header
- `supabase/functions/generate-cartoon-avatar/index.ts` — Lovable AI image edit call
- `src/assets/basecamp-match-logo.png` — copied from upload (already present per file list, will overwrite/use)

**Edited files:**
- `src/components/afterparty/AfterPartyIntakeForm.tsx` — new chips, renamed question, cartoon trigger after upload
- `src/components/afterparty/MatchesPanel.tsx` — dual avatar display, conversation-starter quote, role-color number badges
- `src/lib/afterparty-matching.ts` — new pairing rules, completeness tiebreaker, brand-first override, friendlier reasons
- `src/pages/AfterPartyInvite.tsx` — swap hero for new co-branded logo block, "Your 5 people" copy
- `supabase/functions/_shared/transactional-email-templates/afterparty-matches.tsx` — subject + body recopy

**Color additions** (Tailwind config-safe inline values):
- Neon amber glow: `#E1B624` with `box-shadow: 0 0 24px rgba(225,182,36,0.6)`
- Neon teal (Popfly): `#3DDFD5` with `box-shadow: 0 0 24px rgba(61,223,213,0.55)`

## Out of scope
- Re-running cartoon generation for already-saved attendees (only new uploads get cartoonified; admin can trigger backfill later if needed)
- Live preview of the cartoon before save (it generates on save, shows on next page load)
- Dragging/swapping which avatar is "primary"

