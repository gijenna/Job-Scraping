

# Delta: Claude prompt vs. what's currently built

Here's what the Claude prompt asks for that **we don't currently have** (or have differently). Approve the ones you want and I'll build them.

## 1. Cartoon avatar generation — **DIFFERENT PROVIDER**
- **Claude says:** Use **Replicate** (needs your Replicate API key + iterative prompt tuning)
- **We have:** Lovable AI (`google/gemini-2.5-flash-image`) — already working, no extra key needed, free tier available
- **Recommendation:** Keep Lovable AI. It's the same "cabbage patch" output, no key to manage, no extra cost. Only switch to Replicate if you specifically want a model Replicate hosts that Gemini can't match.
- **Action if you want Replicate:** Add `REPLICATE_API_KEY` secret, swap the edge function to call Replicate's image model.

## 2. Matching as an Edge Function — **ARCHITECTURE DIFFERENCE**
- **Claude says:** Matching should live in a Supabase Edge Function so you can test it server-side with fake records
- **We have:** Pure TS in `src/lib/afterparty-matching.ts` — runs client-side on every page load AND inside `send-afterparty-matches` edge function for emails
- **Recommendation:** Add a new `compute-afterparty-matches` edge function that wraps the same logic + a small **admin "Test matches with fake attendees" tool** in the admin tab where you paste/generate fake records and see the scores. The pure-TS lib stays for client-side preview.

## 3. Brand rep diversity cap — **NEW RULE, MISSING**
- **Claude says:** Cap how many of one brand's reps can show up in a single creator's top 5 (so one brand doesn't dominate someone's matches)
- **We have:** No cap — if a brand has 3 reps all matching a creator, all 3 could fill the top 5
- **New rule to add:** Max **1 person per company** in any attendee's top 5. If the same company has multiple reps that would make top 5, pick the highest-scoring one and let other people fill the remaining slots.

## 4. "Just here to vibe" exclusion logic — **ALREADY DONE ✅**
- **Claude says:** Vibers shouldn't appear in others' top 5 unless mutual; their own matches de-emphasized
- **We have:** Exactly this in `computeMatchesFor` (lines 172–184). No change needed.

## 5. Admin CSV seed flow — **NEW FEATURE, MISSING**
This is the one Claude calls "your most important pre-event step."
- **Upload a CSV** of invitees (name, email, role, optional company) into the admin After Party tab
- For each row, create an `afterparty_attendees` record with `status='invited'`, auto-assigned attendee number, and a generated slug
- Show a preview of parsed rows before commit
- After import, a **"Send invite emails"** button blasts each invitee a personal link (`/afterparty/their-name`) with copy like *"You're #47. Fill in your profile so we can match you with your 5 people."*
- New transactional email template: `afterparty-invite`

## 6. Brand-first override scope — **MINOR TWEAK SUGGESTED**
- **Currently:** Brand-first override (line 197) only fires when `me.role === 'brand'` (a brand viewing their own matches sees their wishlist matches first)
- **Claude implies:** This should also affect ranking globally — i.e., when computing a creator's matches, brands actively seeking that creator's type should jump up too
- **Recommendation:** Mirror the override for creators (when a brand specifically seeks them, that brand jumps to the top of the creator's list too). Small change in `scorePair`.

---

## Summary table

| # | Item | Status | Recommended action |
|---|------|--------|--------------------|
| 1 | Cartoon via Replicate | We use Lovable AI instead | **Skip** unless you want Replicate specifically |
| 2 | Matching edge function + test harness | Client-only | **Add** edge fn + admin "Test with fake data" panel |
| 3 | Brand rep diversity cap (max 1/company in top 5) | Missing | **Add** to scoring sort step |
| 4 | "Just here to vibe" exclusion | ✅ Done | Nothing |
| 5 | Admin CSV seed + invite blast | Missing | **Add** — biggest pre-event win |
| 6 | Brand-first override mirrored for creators | One-sided | **Add** small mirror in scoring |

---

## What I'll build if you approve all (default: 2, 3, 5, 6 — skip 1)

**New files:**
- `supabase/functions/compute-afterparty-matches/index.ts` — server-side matching wrapper for testing
- `supabase/functions/_shared/transactional-email-templates/afterparty-invite.tsx` — invite blast template
- `src/components/afterparty/AfterPartyCsvSeed.tsx` — CSV upload + preview + commit panel (added to admin tab)
- `src/components/afterparty/AfterPartyTestMatches.tsx` — paste-fake-attendees panel that calls the edge function and shows scores

**Edited files:**
- `src/lib/afterparty-matching.ts` — add brand-rep diversity cap + mirror brand-first override for creators
- `src/components/afterparty/AfterPartyAdmin.tsx` — wire in CSV panel, test panel, and "Send invite emails" button
- `supabase/functions/_shared/transactional-email-templates/registry.ts` — register `afterparty-invite`
- New edge function `send-afterparty-invites` — loops invited attendees, sends personal links

**Out of scope:**
- Switching cartoon provider to Replicate (skipping per recommendation)
- Live preview of cartoon before save
- Per-attendee cartoon prompt customization

Tell me which numbered items to include (or "all except 1") and I'll build it.

