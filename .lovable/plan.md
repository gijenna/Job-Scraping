

# Plan: Denver Registration Link Update + Admin-Only Event Management with Edit

## 1. Update Denver Registration Link

Change `TYPEFORM_DENVER` in `EventOutsideDays26.tsx` from `denver2026` to `outsidedays`:
```
const TYPEFORM_DENVER = "https://basecampoutdoor.typeform.com/outsidedays";
```

This single change propagates to all 3 usages on that page (hero, how-to-tap-in, bottom CTA). No other files reference this URL for Denver registration.

**Files**: `src/pages/EventOutsideDays26.tsx`

---

## 2. Admin-Only Event Add/Delete + Edit Functionality

Currently `Events.tsx` passes `isAdmin={true}` to every EventCard unconditionally. We need to:

### a) Add auth check in Events.tsx
- Import `useEffect` + `supabase` auth session check
- Track `isAdmin` state (boolean) based on whether there's an authenticated session
- Only show `<AddEventDialog>` when `isAdmin` is true
- Pass `isAdmin` to `<EventCard>`

### b) Add Edit functionality
Create an `EditEventDialog` component (similar to `AddEventDialog`) that:
- Receives the existing event data as props
- Pre-fills all form fields (title, date, end_date, cost, registration_link, type, location)
- On submit, calls `supabase.from("events").update(...)` instead of insert
- Shows a pencil/edit icon button on the EventCard (next to delete) when `isAdmin`

### c) Update EventCard
- Add an edit button (Pencil icon) next to the delete button, both gated by `isAdmin`
- Add `onEdit` callback prop that opens the edit dialog
- The edit dialog can either be embedded in EventCard or lifted to Events.tsx

**Implementation approach**: Add the `EditEventDialog` as a sibling dialog in `EventCard` itself (self-contained), triggered by the pencil button. This keeps it simple — each card manages its own edit state.

**Files**: 
- `src/pages/Events.tsx` — add auth check, conditionally show AddEventDialog
- `src/components/events/EventCard.tsx` — add edit button + inline EditEventDialog
- `src/pages/EventCalendar.tsx` — add same auth check for its AddEventDialog

---

## Summary of Changes

| File | Change |
|------|--------|
| `EventOutsideDays26.tsx` | Update TYPEFORM_DENVER URL |
| `Events.tsx` | Add auth session check, gate AddEventDialog behind isAdmin |
| `EventCalendar.tsx` | Same auth gating |
| `EventCard.tsx` | Add edit button + inline edit dialog, keep delete/edit admin-only |

