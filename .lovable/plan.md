

# Plan: Fix Issues + Admin Logo Management

## 1. Move Peak Design to top row in /PNW26

In `EventPNW26.tsx`, reorder `pnwBrands` array so Peak Design is at index 4 (5th item), putting it in the first row of the 5-column grid alongside OOA and Superfeet:

```
0: Rumpl, 1: On Running, 2: Arc'teryx, 3: Cotopaxi, 
4: Peak Design, 5: Oregon Outdoor Alliance, 6: Superfeet, ...
```

**File**: `src/pages/EventPNW26.tsx`

---

## 2. Fix gallery transitions (no disappearing)

The current `AnimatePresence mode="wait"` removes the old image before showing the new one, causing a flash. Fix: remove AnimatePresence entirely. Instead, render all images stacked absolutely and toggle opacity via CSS transitions. Each slot always has an `<img>` rendered — only the `src` changes, and the transition is pure CSS `opacity` with `transition-opacity duration-500`. No framer-motion exit animations at all.

**File**: `src/components/event/BasecampEventsGallery.tsx`

---

## 3. Fix "would love" line break in ExpertInvite

In `ExpertInvite.tsx` lines 249-254, the hero has explicit `<br />` tags forcing "we'd love for you" and "to be an Industry" onto separate lines. Remove the `<br />` between "we'd love for you" and "to be an Industry" so "we'd love for you to be an" flows naturally. Keep the final `<br />` before "Expert." to emphasize it.

**File**: `src/pages/ExpertInvite.tsx`

---

## 4. Add photo upload to event edit dialog

In `EventCard.tsx`, add a file input for photo upload in the edit form (matching the AddEventDialog pattern). On submit, upload to `event-photos` storage bucket and update `photo_url`.

**File**: `src/components/events/EventCard.tsx`

---

## 5. Admin logo management on public pages (no credits)

This is the big feature. Create a database-driven logo system with an admin overlay on the public event pages.

### Database

New table `event_logos`:
- `id` (uuid, PK)
- `event_slug` (text, e.g. "pnw26" or "denver26")
- `name` (text)
- `domain` (text, nullable — for favicon fallback)
- `logo_url` (text, nullable — for uploaded logos)
- `url` (text, nullable — link when clicked)
- `display_order` (integer)
- `created_at` (timestamptz)

RLS: public SELECT, authenticated INSERT/UPDATE/DELETE.

### Storage

Use existing `event-photos` bucket (already public) for logo uploads.

### Components

**a) `useEventLogos` hook** — fetches logos from `event_logos` table filtered by `event_slug`.

**b) `AdminLogoManager` component** — a floating admin panel (only visible when authenticated) that appears on the relevant sections. Includes:
- "Add Logo" button that opens a dialog with: name, domain (optional), logo file upload (optional), URL (optional)
- Each logo gets a delete (X) button visible in admin mode
- Drag-to-reorder or simple up/down arrows for ordering

**c) Integration into pages:**

- **`EventPNW26.tsx`**: In the "Chat with hiring managers" brand grid section, merge hardcoded `pnwBrands` with DB logos. Show AdminLogoManager when admin. Also merge into ticker.
- **`EventOutsideDays26.tsx`**: In `DenverByTheNumbers` component, merge DB logos into `brandLogos` array for the circle bubbles. Also merge into ticker.

The admin sees small edit controls (add/delete) directly on the page sections — no credits used, just direct database operations.

### How it works for the admin:
1. Navigate to `/PNW26` or `/OutsideDays26` while logged in
2. See a small floating "Manage Logos" button on relevant sections
3. Click to add logos (upload image or enter domain for favicon), set name, optional link
4. Delete logos with an X button
5. Changes appear immediately on the public page

---

## Files Modified/Created

| File | Changes |
|------|---------|
| `EventPNW26.tsx` | Reorder brands, integrate DB logos into grid + ticker |
| `BasecampEventsGallery.tsx` | Replace AnimatePresence with CSS opacity transitions |
| `ExpertInvite.tsx` | Fix "would love" line break |
| `EventCard.tsx` | Add photo upload to edit dialog |
| `src/hooks/useEventLogos.ts` | New hook to fetch/manage logos from DB |
| `src/components/event/AdminLogoManager.tsx` | New admin overlay for logo CRUD |
| `EventOutsideDays26.tsx` | Integrate DB logos into ticker |
| `DenverByTheNumbers.tsx` | Integrate DB logos into bubble circles |
| **Migration** | Create `event_logos` table with RLS |

