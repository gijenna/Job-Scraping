

# Comprehensive Enhancement Plan

## Summary
This plan covers 10 distinct features across public event pages (/PNW26, /OutsideDays26), expert cards, and the admin CRM.

---

## 1. Editable Text on All Pages (PNW26 + OutsideDays26)

Both pages already use `EditableTextProvider` and `EditableText` for some strings. Wrap ALL remaining hardcoded text — section headings, subheadings, button labels, and hyperlink URLs — with `EditableText`. For links/buttons, create a new `EditableLink` component that lets admins edit both the display text and the URL.

**Files:** `EventPNW26.tsx`, `EventOutsideDays26.tsx`, `RegistrantHero.tsx`, `RegistrantHowToTapIn.tsx`, `RegistrantVenue.tsx`, `DenverFestivalPartner.tsx`, `JobSeekerTestimonials.tsx`, `BasecampEventsGallery.tsx`. New file: `EditableLink.tsx`.

---

## 2. Logo Hover Tooltips on Expert Cards

Add a tooltip (using existing `Tooltip` UI component) on previous-company logos across all three card types showing the brand name on hover.

**Files:** `ExpertCard.tsx`, `ExpertCardCompact.tsx`, `ExpertCardMinimal.tsx`

---

## 3. Drag-and-Drop Card Reordering

Add admin drag-and-drop to reorder expert cards on public pages. Store `display_order` on `expert_city_assignments`. Use a lightweight drag library (e.g. `@dnd-kit/core`). Only show drag handles when admin is authenticated.

**DB migration:** Add `display_order integer default 0` to `expert_city_assignments`.
**Files:** `DenverAttendeeSections.tsx`, `PnwWhosComing.tsx` — fetch with `.order('display_order')`, wrap cards in a sortable container for admins.

---

## 4. Card Type A: Full Color Photos on Hover

Change the `grayscale` class on ExpertCard photos to `grayscale hover:grayscale-0 transition-all duration-300`.

**File:** `ExpertCard.tsx`

---

## 5. Card Types B & C: Expandable to Full Card A

Add an expand button to `ExpertCardCompact` and `ExpertCardMinimal` that, when clicked, renders the full `ExpertCard` content inline (with a close button to collapse back). Use animation for smooth transition.

**Files:** `ExpertCardCompact.tsx`, `ExpertCardMinimal.tsx`

---

## 6. PNW26: "Brand Representatives" → "Featured Brands" + Cascading Logo Bubbles

- Change the label from "Brand Representatives" to "Featured Brands" in `PnwWhosComing.tsx`
- Add the cascading bubble logo feature (from `PnwByTheNumbers`) as a standalone reusable component (`CascadingLogoBubbles.tsx`) placed between the "Meet the Teams" heading and the cards
- Make this bubble area separately editable by admins (its own `EditableText` keys)

**Files:** `PnwWhosComing.tsx`, new `CascadingLogoBubbles.tsx`

---

## 7. OutsideDays26: Bubble Logos Below "Meet the Teams" + Same Brand Showcase

- Move/add the cascading bubble feature below the "Meet the hiring teams" heading (rename to "Meet the Teams") and above the cards
- Make the area separately admin-editable
- Heading text changed from "Meet the hiring teams" to "Meet the Teams"

**Files:** `DenverAttendeeSections.tsx`, `EventOutsideDays26.tsx`

---

## 8. Brand Umbrella Showcase (Both Pages)

Under "Meet the Teams", group brand reps by `current_company`. Each brand group shows:
- Company logo (large)
- Admin-editable careers page link
- Admin-editable "currently hiring for" text
- Expandable: collapsed shows logo + info, expanded reveals Card Type C cards below, with further expand to Card A per card
- Multiple brands can be expanded simultaneously

Store per-brand metadata (careers URL, hiring blurb) in `event_settings` using keys like `brand_{slug}_careers_url` and `brand_{slug}_hiring_blurb`.

**Files:** `PnwWhosComing.tsx`, `DenverAttendeeSections.tsx`, new `BrandUmbrellaSection.tsx`

---

## 9. Denver By The Numbers: Admin-Hideable

Add an admin toggle (via `event_settings` key `hide_denver_stats`) that lets the admin hide/show the `RegistrantDenverStats` section on `/OutsideDays26`. When hidden, non-admins don't see it; admins see it dimmed with a "Show" button.

**Files:** `EventOutsideDays26.tsx`, `RegistrantDenverStats.tsx`

---

## 10. Admin CRM: "Save for Later" Status

Add a new `saved_for_later` boolean column to `industry_experts` (default false). In the CRM, add a bookmark/archive button per expert and a filter option to show/hide "Saved for Later" experts. These experts are hidden from the default active view but accessible via filter.

**DB migration:** `ALTER TABLE industry_experts ADD COLUMN saved_for_later boolean DEFAULT false;`
**Files:** `ExpertCRM.tsx`, `AdminExperts.tsx`, `expert-types.ts`

---

## Technical Details

### Database Migrations
1. `ALTER TABLE expert_city_assignments ADD COLUMN display_order integer DEFAULT 0;`
2. `ALTER TABLE industry_experts ADD COLUMN saved_for_later boolean DEFAULT false;`

### New Dependencies
- `@dnd-kit/core` and `@dnd-kit/sortable` for drag-and-drop card reordering

### New Components
| Component | Purpose |
|-----------|---------|
| `EditableLink.tsx` | Admin-editable hyperlink (text + URL) |
| `CascadingLogoBubbles.tsx` | Reusable falling/scattered logo bubbles |
| `BrandUmbrellaSection.tsx` | Brand grouping with expandable cards |

### Files Modified
| File | Changes |
|------|---------|
| `ExpertCard.tsx` | Hover → full color photo; tooltip on logos |
| `ExpertCardCompact.tsx` | Expand to Card A; tooltip on logos |
| `ExpertCardMinimal.tsx` | Expand to Card A; tooltip on logos |
| `PnwWhosComing.tsx` | "Featured Brands" label; bubble logos; brand umbrella; drag-and-drop; order by display_order |
| `DenverAttendeeSections.tsx` | "Meet the Teams" label; bubble logos; brand umbrella; drag-and-drop; order by display_order |
| `EventOutsideDays26.tsx` | Editable text everywhere; hideable stats section |
| `EventPNW26.tsx` | Editable text everywhere |
| `RegistrantDenverStats.tsx` | Admin hide/show toggle |
| `RegistrantHero.tsx` | Editable text for all strings |
| `RegistrantHowToTapIn.tsx` | Editable text for all strings |
| `RegistrantVenue.tsx` | Editable text for all strings |
| `ExpertCRM.tsx` | "Save for Later" button + filter |
| `AdminExperts.tsx` | Filter UI for saved-for-later |
| `expert-types.ts` | Add `saved_for_later` field |

