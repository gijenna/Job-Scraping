
# Build all deltas except #4, #5, #13

Skipping niche list swap, format chip swap, and route change. Building everything else.

## What gets built

### Visual restyle (#1)
- `AfterPartyInvite.tsx` background → `#080808`, cards → `#111111`, borders → `rgba(255,255,255,0.09)`
- Inter font, weights 400/500 only, sentence case
- Max content width 480px, mobile-first
- Remove gradient hero, blurred blobs, glassmorphism
- Role color tokens applied to chips, badges, pills:
  - Creator coral `#D85A30` / `#4A1B0C` / `#F5C4B3`
  - Brand rep purple `#7F77DD` / `#1a1830` / `#CECBF6`
  - Industry expert teal `#1D9E75` / `#04342C` / `#9FE1CB`
  - Social amber `#BA7517` / `#412402` / `#FAC775`

### Industry expert role (#2)
- Add `industry_expert` to role chip selector
- Teal styling on selection
- Matching weights treat creator↔expert as 8 pts role complementarity

### Number badge component (#3)
- New `NumberBadge.tsx` — 46×46px, `border-radius: 11px`, role-colored fill/border
- Used in: my-card header, every match row, email template

### Intent chips unified (#6)
- Single shared group for all roles
- Pro chips (coral/purple): Find brand deals · Find creators to work with · Collab with another creator · Hire talent
- Visual divider
- Social chips (amber): Make friends · Find a travel partner · Just here to vibe

### 280-char question counter (#7)
- `maxLength={280}` on textarea
- Live `{n}/280` counter bottom-right
- Single shared field (drop creator/brand split)

### Dual avatar preview + spinner + SVG fallback (#8)
- Side-by-side preview boxes in form labeled "Your photo" / "Your avatar"
- Spinner in avatar slot while cartoon generates
- DiceBear-style deterministic SVG fallback when no photo (hash of name → hair/skin)
- Stays on Lovable AI Gemini

### Edit-by-name gate (#9)
- New `EditNameGate.tsx` — view mode by default; "Edit my card" prompts for name (case-insensitive match) before unlocking form

### Locked match preview (#10)
- New `SkeletonMatches.tsx` — 5 blurred placeholder rows with overlay "Complete your profile to reveal your matches"
- Shown pre-submission instead of hidden section

### Tap-to-show answer popover (#11)
- Move `mind_blowing_fact` from inline display into a popover triggered by row tap in `MatchesPanel.tsx`
- Keeps list scannable

### Email copy (#12)
- Subject → `Your 5 people for tonight, {firstName}`
- Footer → `Presented by Popfly × Basecamp Match`
- CTA → `View your card`

### Weighted scoring refactor (#15)
- Refactor `scorePair` in `afterparty-matching.ts` to 5-bucket 100-pt system:
  - Intent 35 · Niche 27 · Format 19 · Role complementarity 14 · Completeness 5
- Hardcoded niche adjacency map (uses existing niche values):
  - `{fishing:[fly_fishing,waterfowl], hunting:[archery,waterfowl], hiking:[camping,overlanding], overlanding:[camping,hiking], camping:[hiking,overlanding], waterfowl:[hunting,fishing], archery:[hunting], fly_fishing:[fishing]}`
- Keep existing brand-priority override, brand-rep diversity cap, and viber exclusion

## Files

**New**
- `src/components/afterparty/NumberBadge.tsx`
- `src/components/afterparty/EditNameGate.tsx`
- `src/components/afterparty/SkeletonMatches.tsx`

**Edited**
- `src/pages/AfterPartyInvite.tsx` — flat dark theme, 480px, name-gate, skeleton, sentence case
- `src/components/afterparty/AfterPartyIntakeForm.tsx` — industry_expert role, unified intent chips, 280-char counter, dual avatar preview, SVG fallback
- `src/components/afterparty/MatchesPanel.tsx` — number-badge-first row, tap-to-show answer popover, role colors
- `src/lib/afterparty-matching.ts` — 5-bucket weighted scoring + niche adjacency + industry_expert handling
- `supabase/functions/_shared/transactional-email-templates/afterparty-matches.tsx` — exact subject/footer/CTA

## Skipped (per your call)
- #4 Outdoor niche list swap — keeping current 14-niche list
- #5 7-format "What I create/offer" chip swap — keeping current creator_types options
- #13 Route change to `/invite/:slug` — keeping `/afterparty/:name`
