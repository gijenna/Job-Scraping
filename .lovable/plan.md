## Goal

Restore the original smooth ending of the splash (snowflakes + Oakley + sunset cross-fade), and instead fix the *real* bug: the invite text under "An official Outside Days kick-off party" fades in noticeably later than the kick-off line itself. We want the kick-off line and everything below it (sparkles row, "DJ ✦ Drinks ✦ Swag ✦ Food ✦ Friends", date/venue, RSVP button, "About the event", etc.) to pop in together.

## What's actually happening

- The kick-off line "An official Outside Days kick-off party" lives **inside** `BasecampMatchPopflyLogo` and lands at `OD_POP_DELAY_S = 7.6s` (visible ~8s).
- Everything below it lives in `AfterPartyInvite.tsx` inside one wrapper (lines 408–476+) gated by `splashDone`, which only flips when `BasecampMatchPopflyLogo` calls `onRevealed`.
- `onRevealed` fires after the `delay` constant in `BasecampMatchPopflyLogo.tsx` line 109. It used to be `10800`, I changed it to `9300` last turn — that made the snowflake/Oakley exit feel abrupt without actually fixing the gap, because the kick-off line still shows ~1.5s before the rest.

## Fix

**Two independent reveals**, so the splash keeps its original smooth tail and the invite content appears with the kick-off line:

1. **Revert** `BasecampMatchPopflyLogo.tsx` line 109: `const delay = reduced ? 0 : 10800;` — restores the original smooth Oakley/snowflake/sunset cross-fade timing the user liked.
2. **Add a second, earlier callback** `onInvitePop?: () => void` in `BasecampMatchPopflyLogo.tsx` that fires at ~8000ms (right as the kick-off line settles).
3. **`AfterPartyInvite.tsx`**: add a new state `invitePop` (separate from `splashDone`). Pass `onInvitePop={() => setInvitePop(true)}` to the splash. Switch the wrapper at line 408–414 from `opacity: splashDone ? 1 : 0` to `opacity: invitePop ? 1 : 0` (transition 0.5s ease-out) so the kick-off line and invite body fade up together. Keep `splashDone` for whatever else still depends on it (background darkening, pointer events on outer area, etc.) so the snowflake/Oakley animation stays untouched.

## Files

- `src/components/afterparty/BasecampMatchPopflyLogo.tsx` — restore `delay = 10800`; add `onInvitePop` prop + a `setTimeout(onInvitePop, 8000)` effect (gated on `sunsetReady`, same pattern as existing one).
- `src/pages/AfterPartyInvite.tsx` — add `invitePop` state, wire `onInvitePop`, swap the wrapper opacity gate.

No changes to keyframes, no changes to snowflake/Oakley/sunset timing.
