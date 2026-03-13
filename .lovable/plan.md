# Plan: Route Changes, Gallery Fix, Peak Design, Brand Rep Copy, UO Video

## 1. Route restructure — `/events` as homepage, Index → `/Gatheroverview`

In `App.tsx`:

- Change `<Route path="/" element={<Events />} />`
- Add `<Route path="/events" element={<Events />} />` (so both `/` and `/events` show the Events page)
- Move current Index to `<Route path="/Gatheroverview" element={<Index />} />`

This means `www.basecampoutdoorevents.com` and `www.basecampoutdoorevents.com/events` both show the Events page.

**File**: `src/App.tsx`

---

## 2. Smooth gallery transitions

In `BasecampEventsGallery.tsx`, the desktop grid re-mounts images on every arrow click causing jumpiness. Fix:

- Use `AnimatePresence mode="popLayout"` with crossfade transitions instead of re-mounting
- Use a `direction` state to animate slide left/right
- Use `layout` animation or simple opacity crossfade (no scale bounce)
- Mobile: change `mode="wait"` transition to a simple crossfade (opacity only, no x movement) for smoother feel

**File**: `src/components/event/BasecampEventsGallery.tsx`

---

## 3. Peak Design logo — hyperlink + move to top row

In `EventPNW26.tsx` brands array:

- Move Peak Design entry to index 4 (after Cotopaxi, alongside Oregon Outdoor Alliance and Superfeet in the top row of the 5-col grid)
- Add `url: "https://www.peakdesign.com/pages/careers"` to the Peak Design entry

**File**: `src/pages/EventPNW26.tsx`

---

## 4. Brand rep "would love" on one line

In `BrandRepInvite.tsx` lines 234-241, the headline breaks across 3 lines with `<br />` tags. Remove the `<br />` between "would love" and "you to attend!" so it reads naturally on one line:

```
{brandName} is confirmed at Gather PNW & Jen would love you to attend!
```

**File**: `src/pages/BrandRepInvite.tsx`

---

## 5. Remove "Watch Video" from UO section

In `EventPNW26.tsx` lines 260-268, remove the "Watch Video" `<a>` tag entirely.

**File**: `src/pages/EventPNW26.tsx`

---

## 6. Route ordering note

The request to reorder the page list in the editor sidebar (/, /gather-denver, /gather-pnw, /admin/experts) refers to the Lovable editor's internal page picker, which is auto-generated from the route definitions. I'll reorder the routes in `App.tsx` to match the requested order:

1. `/` (Events)
2. `/events` (Events)
3. `/gather-denver`
4. `/gather-pnw`
5. `/admin/experts`
6. /PNW26  
7. /outsidedays26  
Everything else after

---

## Files Modified (4)


| File                        | Changes                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| `App.tsx`                   | Route restructure: Events at `/` and `/events`, Index at `/Gatheroverview`, reorder routes |
| `BasecampEventsGallery.tsx` | Smooth crossfade transitions, remove scale/jump animations                                 |
| `EventPNW26.tsx`            | Move Peak Design to top row with careers URL, remove Watch Video link                      |
| `BrandRepInvite.tsx`        | Put "would love you to attend" on one line                                                 |
