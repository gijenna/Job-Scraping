# After-party email blast plan

Two emails go to every after-party registrant tomorrow (Denver/MT):
- **9am MT** — new "See you tonight @ Oakley RiNo" email
- **5pm MT** — existing matches email (updated to include venue + Maps link, all CTAs → /guests)

Both from **Jenna from Basecamp** (`jenna@wearetheoutdoorindustry.com`).

---

## 1. New template: `afterparty-tonight.tsx`

New React Email at `supabase/functions/_shared/transactional-email-templates/afterparty-tonight.tsx`, registered in `registry.ts`.

- **Subject (dynamic):** `See you tonight @ Oakley RiNo! (Your # is {attendeeNumber} ;))`
- **Props:** `recipientName`, `attendeeNumber`, `matches[]` (top 5, same shape as existing), `guestsUrl`
- **Body** (in dark teal / coral / cream brand styling, Josefin Sans, white page background per email rules):
  1. `Hey {firstName}` greeting
  2. Intro: "The after-party starts at 7:30pm tonight at **Oakley RiNo** — [2660 Walnut St Ste #3, Denver, CO 80205](https://maps.google.com/?q=Oakley+RiNo+2660+Walnut+St+Denver+CO+80205)" (hyperlinked to Google Maps)
  3. "When you get here" checklist — Popfly check-in line shows **"Tell Popfly your Name & #{attendeeNumber} to check in"**
  4. "Your Matches are:" — **compact** row of 5 mini-cards (just `#number` badge + name + role, no reasoning text — visually smaller than the 5pm email's match blocks)
  5. CTA button → `guestsUrl` (`/guests?slug=…`): "See full guest list →"
  6. "Don't feel like networking?" activities paragraph (verbatim from your copy)
  7. Sponsor swag-bag paragraph (first 50 guests)
  8. **P.S. 9pm raffle** with bulleted giveaway list (Temi, Turtlebox, ING, DOD, YETI, Nemo, Kuma, Nite Ize, Outside Days)
  9. Footer: `<3 Oakley, Popfly, Basecamp, & Outside`

No em dashes anywhere. No unsubscribe footer (system appends).

## 2. Update existing template: `afterparty-matches.tsx` (5pm email)

- Add a "Tonight at Oakley RiNo" block above the matches with the **address hyperlinked to Google Maps**
- Verify CTA button + any links point to `guestsUrl` (i.e. `/guests?slug=…`) — already does, will double-check
- Keep everything else (the larger match blocks with reasoning)

## 3. New edge function: `send-afterparty-tonight`

Clone of `send-afterparty-matches/index.ts`:
- Loads all `afterparty_attendees` with email
- Computes top-5 matches (same scoring as existing function — extracted from / mirrored)
- For each attendee, invokes `send-transactional-email` with template `afterparty-tonight`, passing `recipientName`, `attendeeNumber`, `matches`, `guestsUrl`
- Per your answer "compute matches first, then send to all": still sends even if 0 matches (matches section will gracefully render "Look for your name tag matches at the door" fallback). Will send to **all** registrants with an email.

The existing `send-afterparty-matches` already sends to all with email and ≥1 match — I'll relax it to send to all (per your answer for the 5pm scope), with empty-state copy if no matches.

## 4. Cron scheduling (pg_cron)

Two new cron jobs in Supabase (Denver is on **MDT = UTC−6** in late May, so 9am MT = **15:00 UTC**, 5pm MT = **23:00 UTC**):

```
0 15 * * * → POST /functions/v1/send-afterparty-tonight     (9am MT)
0 23 * * * → POST /functions/v1/send-afterparty-matches     (5pm MT)
```

Both will be **one-shot** (after running tomorrow I'll unschedule them, or set them to only fire on tomorrow's date via a date guard in the cron expression). I'll use a date guard: `0 15 29 5 *` and `0 23 29 5 *` (May 29 2026 at 15:00 / 23:00 UTC — i.e. tomorrow Denver morning/evening) so they self-expire after one fire.

> Confirm: today is **Thu May 28, 2026**, event is **tomorrow Fri May 29**. Cron dates above assume that.

## 5. Admin UI

Add two buttons to `AfterPartyAdmin.tsx`:
- "Send TONIGHT email now (all registrants)"
- (existing "Send matches" button stays)

Plus a small "Send test to me" input that fires either template to a single email — used for the test sends.

## 6. Test sends (immediately after build)

Send one test of each template to **jenna@wearetheoutdoorindustry.com** using a sample attendee number (36) and mock match data, via direct `send-transactional-email` invokes.

---

## Open assumption to confirm

- Event date = **Fri May 29 2026** (tomorrow). If wrong, cron dates need updating.
- "Look out for matches at the door / talk to the team" is the no-matches fallback copy — OK?
