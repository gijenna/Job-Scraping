

# Creator After Party — Invite + Matching System

A new event invite page at **`/afterparty`** (and `/afterparty/:name` for personalized links) that doubles as a matching service connecting creators and brands by intent, niche, and what they're looking for.

## What gets built

### 1. New attendee types
Two new roles alongside `industry_expert` and `brand_rep`:
- **`creator`** — influencers, photographers, videographers, content creators
- **`afterparty_brand`** — party-specific brand role (different intake from existing brand reps)

### 2. New event "city" record
- Slug: `afterparty`
- Name: "Creator After Party"
- Custom hero, color palette (admin-editable), date/venue/time
- Distinct branding from Denver/PNW (no city tag in nav)

### 3. Invite page (`/afterparty` and `/afterparty/:name`)
Completely different look/copy from existing invites. Sections:
- **Hero** — "You're invited to the Creator After Party" with personalized name if `:name` matches
- **Your attendee number** badge (shown after they save card) — assigned in signup order
- **What this is** — short pitch about purposeful matching
- **Intake form** — short, role-aware (creator vs brand questions differ)
- **Card preview** — same edit-by-name flow as expert cards (just type your name to reload your saved card)
- **Your matches** section — appears after they've completed intake, shows top 5 matches with attendee numbers
- **FAQ + footer**

### 4. Intake form fields (new + reused)

Shared:
- Name, email, photo, LinkedIn/Instagram, niches (fishing, hunting, hiking, surfing, climbing, etc. + custom)

**Creator-specific:**
- Creator type (multi): videographer, photographer, influencer, writer, podcaster, athlete
- Audience size range (dropdown)
- Primary platform(s)
- What they're looking for (multi): brand partnerships, paid work, friends, mentors, fellow creators
- Brands they'd love to work with (free text)
- One mind-blowing thing about them

**Brand-specific:**
- Company, role, what they make
- Looking for (multi): videographers, photographers, influencers, writers, athletes, ambassadors, friends/connections, talent pipeline
- Niches that fit their brand
- Budget range for creator work (optional dropdown)
- What makes a creator a great fit for them (free text)

### 5. Matching engine
A scoring function that runs on demand. For each attendee, score every other attendee:
- **+10** mutual fit: brand seeks creator-type X, creator IS X (or vice versa)
- **+5** per shared niche
- **+5** per overlap in "looking for" (e.g., both want friends)
- **+3** if creator named the brand specifically
- **+2** per shared platform
- Cap mutual brand-vs-brand or creator-vs-creator scores lower so cross-pollination wins

Returns top 5 with score, attendee number, name, photo, role, and a one-line "why you should talk" reason ("They're looking for videographers in fishing").

**Triggers:**
- Live: recalculated on every invite-page visit (cached briefly per-session)
- Manual: admin button "Recalculate & Lock Matches" freezes results into a `creator_matches` snapshot table
- After lock, page reads from snapshot instead of live calc

### 6. Match email blast
Admin button on `/admin/experts` (new "After Party" tab): "Email Top-5 Matches to Everyone"
- Uses Lovable Cloud email infrastructure
- One transactional email per attendee with their 5 matches, attendee numbers, and a link back to their invite page

### 7. Admin panel additions
New tab in `/admin/experts` called **"After Party"**:
- List all afterparty attendees with attendee number, role, status
- "Generate Matches" button (live preview of who matches whom)
- "Lock Matches" button (snapshots results)
- "Send Match Emails" button
- Standard add/edit/delete + copy invite link

## Technical details

**New tables:**
- `afterparty_attendees` — id, attendee_number (auto serial), full_name, slug, email, photo_url, social_links jsonb, role ('creator' | 'brand'), creator_types text[], audience_size, platforms text[], niches text[], looking_for text[], brands_wishlist, mind_blowing_fact, company, company_role, brand_seeking text[], budget_range, brand_fit_notes, status, created_at, updated_at
- `afterparty_matches` — id, attendee_id, match_attendee_id, score, reasons text[], generated_at, locked boolean

**RLS:** public SELECT on attendees (for matching display) and matches; anon INSERT/UPDATE on attendees (same permissive pattern as `industry_experts`); auth-only on lock/admin operations.

**Files:**
- `src/pages/AfterPartyInvite.tsx` — main page
- `src/components/afterparty/AfterPartyIntakeForm.tsx` — role-aware form
- `src/components/afterparty/MatchesPanel.tsx` — top-5 display
- `src/components/afterparty/AfterPartyAdmin.tsx` — admin tab
- `src/lib/afterparty-matching.ts` — scoring logic
- `supabase/functions/send-afterparty-matches/index.ts` — email blast (after Lovable Email setup)
- Routes added to `src/App.tsx`: `/afterparty` and `/afterparty/:name`

**Email infrastructure:** Will set up Lovable Cloud emails (domain + transactional templates) as part of the build, since match-email blast is in scope.

**Editable copy:** All headings, CTAs, and section text use the existing `event_settings` editable system with prefix `afterparty:*`.

## Out of scope (for this build)
- Two-way "I like this match" / approval workflow
- In-app chat between matches
- QR codes for in-person scanning (could be next iteration)

