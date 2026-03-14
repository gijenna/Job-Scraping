

# Main Page Updates: Logo, Content, and Denver Time Change

## Overview
Multiple updates to the main landing page and Denver event pages: swap the logo, fix font usage, update Denver event time, reduce spacing, replace the stats section with new audience data, and add companies of note.

---

## Changes

### 1. Swap Logo on Main Page
- Copy the uploaded `Untitled_design_13.png` to `src/assets/basecamp-outdoor-logo.png`
- Update `HeroSection.tsx` to import and display this new logo instead of `Basecamp_Logo_MAIN_1.png`
- Make it larger (increase from `h-16 md:h-20` to `h-24 md:h-32` or similar)

### 2. Ensure "GATHER" Uses Josefin Sans
- The `font-display` class should map to Josefin Sans. Verify in `tailwind.config.ts` and `index.css` that Josefin Sans is properly loaded and assigned. The `GATHER` text in the hero already uses `font-display`, so this should work -- but will confirm and fix if needed.

### 3. Update Denver Event Time to 1-4 PM
Files to update:
- `src/components/EventOverview.tsx`: Update the Denver event format/description references
- `src/pages/GatherDenver.tsx`: Change `date` prop from "2-5 PM" to "1-4 PM", update schedule times accordingly (VIP 1-1:30, Main Event 1-4 PM, Wrap Up 4-4:30 PM, Load-In adjusted)
- `src/pages/GatherDenverExport.tsx`: Same schedule time updates

### 4. Reduce Spacing Below Hero Buttons
- In `HeroSection.tsx`, reduce the bottom padding/margin of the hero section. The `min-h-screen` plus padding creates too much space before the LogoTicker. Will reduce or remove excess bottom spacing.

### 5. Replace StatsSection with New Audience Content
Replace the current `StatsSection` component (which references festival attendees and PNW-specific data) with two new sections on the main page:

**a) Companies of Note Represented**
A section listing the brands organized by category:
- Outdoor Brands: REI, Patagonia, The North Face, Cotopaxi, Alterra Mountain Company, Black Diamond, Vail Resorts, Smartwool
- Tech and Corporate: Google, Nike, Apple, KPMG, Marriott, Amazon
- Industry Agencies: Backbone Media, Outside Inc., Sustainable Apparel Coalition

**b) Event Audience Executive Summary**
Three highlight cards:
- "The Industry Tastemakers" -- 50% Marketing and Communications
- "A Makers Hub" -- 16% Product Designers, Apparel Developers, Merchandisers
- "The Ultimate Career Pivot Point" -- 17% Transitioners

**c) Attendee Persona Snapshot**
Three stat highlights:
- 30% Creative Leaders
- 22% Emerging Talent
- 18% Strategic Decision Makers

### 6. Remove Old StatsSection from Index
- Remove the `StatsSection` import and usage from `Index.tsx`
- Add the new `AudienceSection` component in its place

---

## Technical Details

### Files Created
| File | Description |
|------|-------------|
| `src/assets/basecamp-outdoor-logo.png` | New Basecamp Outdoor logo (copied from upload) |
| `src/components/AudienceSection.tsx` | New component combining Companies of Note, Audience Executive Summary, and Persona Snapshot |

### Files Modified
| File | Change |
|------|--------|
| `src/components/HeroSection.tsx` | Swap logo import to new file, increase size, reduce bottom spacing |
| `src/pages/Index.tsx` | Replace `StatsSection` with `AudienceSection` |
| `src/pages/GatherDenver.tsx` | Update time from 2-5 PM to 1-4 PM, adjust schedule times |
| `src/pages/GatherDenverExport.tsx` | Same Denver time updates |
| `src/components/EventOverview.tsx` | Update any Denver time references |
| `tailwind.config.ts` / `src/index.css` | Verify Josefin Sans is set as the display font (fix if needed) |

### No Changes To
- PNW pages (no time changes requested)
- Export PNW page
- Individual event components (EventHero, EventTiers, etc.)
