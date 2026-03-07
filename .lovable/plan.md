# Multi-Feature Update Plan

This covers all 8 requests in one batch.

---

## 1. Restrict sign-up to approved email domains

**File:** `src/pages/AdminLogin.tsx`

- Before calling `supabase.auth.signUp`, validate that the email ends with `@wearetheoutdoorindustry.com` or `@basecampjobs.com`
- Show an error toast if the domain doesn't match
- Sign-in remains unrestricted (only existing accounts can sign in)

---

## 2. Delete events (admin)

**File:** `src/components/events/EventCard.tsx`, `src/pages/Events.tsx`

- Add an `isAdmin` prop + `onDelete` callback to `EventCard`
- When admin, show a small trash icon button on the card
- On click, confirm with a dialog, then call `supabase.from("events").delete().eq("id", event.id)`
- RLS already allows creator to delete; also update RLS to allow any authenticated user to delete (since all admins should manage all events)

**Database migration:** Update the delete RLS policy from `auth.uid() = created_by` to `true` for authenticated users, matching the insert policy pattern.

---

## 3. Calendar: back-to-events navigation

**File:** `src/pages/EventCalendar.tsx`

- Add a "← Back to Events" link next to the "Event Calendar" heading, linking to `/events`

---

## 4. Calendar: better hover card (clickable, mobile-friendly)

**File:** `src/components/events/CalendarGrid.tsx`

- Replace the tiny dot with a slightly larger clickable pill/chip showing a truncated event title
- On hover (desktop): show the preview card positioned within viewport bounds
- On mobile: instead of hover, tap the event to show a bottom sheet or inline expanded card below the calendar
- Ensure the hover card is clamped to viewport boundaries (check `window.innerWidth/Height` vs position)

---

## 5. Ticker: different font + black background

**File:** `src/components/events/EventsTicker.tsx`

- Change background from `bg-events-teal` to `bg-black`
- Change font from `font-ticker` (Pacifico) to `font-display` (Josefin Sans) or `font-body` (Space Grotesk) for better variety — use `font-display` with uppercase tracking for a bold editorial feel

---

## 6. Time zones: input in PT, display PT/MT/ET

**Database migration:** Add two new columns to the `events` table:

- `end_date` (timestamp with time zone, nullable) — for event end time
- Keep existing `date` column as start time

**File:** `src/components/events/AddEventDialog.tsx`

- Add a second datetime-local input for "End Time"
- Label the start time as "Start Time (Pacific)"
- Store both times as UTC (the datetime-local input will be treated as Pacific and converted)

**File:** `src/components/events/EventCard.tsx`, `src/components/events/CalendarGrid.tsx`

- Display time in three zones: PT, MT, ET
- Use manual UTC offset conversion: PT = UTC-7 (PDT) / UTC-8 (PST), MT = PT+1, ET = PT+3
- Format like: `2:00 PM PT / 3:00 PM MT / 5:00 PM ET`
- If end time exists, show range: `2:00–4:00 PM PT / 3:00–5:00 PM MT / 5:00–7:00 PM ET`

---

## 7. Connect dropdown: link to event signup + newsletter

**File:** `src/components/events/EventsNav.tsx`

- Under the "Connect" section in the nav menu:
  - "Sign up for events" → link to [https://basecampoutdoor.typeform.com/Basecamp](https://basecampoutdoor.typeform.com/Basecamp)
  - "Newsletter signup" → link to basecampjobs.com 
- Replace the current static text with actual clickable links

---

## 8. Nav closes on outside click

**File:** `src/components/events/EventsNav.tsx`

- Add a click-outside listener: when `menuOpen` is true, clicking anywhere outside the nav menu closes it
- Use a `useEffect` with a `mousedown` event listener on `document`, checking if the click target is outside the nav ref

---

## Files modified summary

- `src/pages/AdminLogin.tsx` — email domain validation
- `src/components/events/EventCard.tsx` — delete button for admins
- `src/pages/Events.tsx` — pass isAdmin/onDelete to EventCard
- `src/pages/EventCalendar.tsx` — back link
- `src/components/events/CalendarGrid.tsx` — better hover/tap UX, mobile-friendly
- `src/components/events/EventsTicker.tsx` — black bg, different font
- `src/components/events/AddEventDialog.tsx` — end time field, PT label
- `src/components/events/EventsNav.tsx` — connect links, click-outside-to-close
- Database migration: add `end_date` column, update delete RLS policy