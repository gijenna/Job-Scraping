# Events Hub: `/events` Page + `/calendar` + Event Management

## Overview

Build a standalone events hub at `/events` inspired by Bridgeworx, with its own nav/branding pulled from wearetheoutdoorindustry.com. Includes event cards with filters, a `/calendar` page, and a backend admin form for adding events via Supabase.

---

## Prerequisites

**Supabase must be connected first.** You selected External Supabase but none is linked yet. I will prompt the connection before building.

---

## Brand Colors (from wearetheoutdoorindustry.com)

- **Dark teal background**: `#19363B`
- **Coral/salmon**: `#ED7660` / `#EE6853`
- **Yellow accent**: `#E1B624`
- **Cream text**: `#F5E6D3`
- **Dark green card**: `#1E3A3F`

Fonts: Josefin Sans (headings), Glacial Indifference (subheadings -- will load via Google Fonts or similar)

---

## Pages

### 1. `/events` -- Main Events Hub

**Top Nav (black background)**

- Left: Hamburger menu icon
- Center: Basecamp Outdoor logo (fetched from wearetheoutdoorindustry.com, linked to that URL)
- Right: Basecamp Match logo (fetched from basecampjobs.com, linked to basecampjobs.com)

**Menu items** (slide-out or dropdown):

- **About** -> Basecamp Outdoor (link) + Basecamp Match (link)
- **Happenings** -> In-Person Events, Workshops, Digital Events (each applies a filter and scrolls to events)
- **Connect** -> "Never miss an event" + "Free newsletter (60K subs)"
- **Contact** -> mailto:[hello@wearetheoutdoorindustry.com](mailto:hello@wearetheoutdoorindustry.com)
- **Partner** -> scrolls to partner section

**Hero Section**

- Dark background, full-width
- Left side: "What's On" in Glacial Indifference (small), "Happenings at Basecamp" in Josefin Sans (large)
- Right side: Custom whimsical illustration (SVG/generated) -- bees in a hive in a forest, cartoony, modern, community feel, diverse characters, inspired by "Bees for the Curious" aesthetic
- Bottom: ripped paper edge SVG divider

**Events Section**

- "View all upcoming events" heading on left
- "View Event Calendar" link on right (links to `/calendar`)
- Filter pills: In-Person, Digital, Workshop, Free
- Event cards in 3-column grid (1 on mobile):
  - Large photo (or brand color block if no photo)
  - Date badge in yellow (`#E1B624`) top-left
  - Event name
  - Location in grey (city or "Digital")
  - Coral button: "Register Free" or "Register [$price]"
  - Clicking card opens external link in new tab
  - Ordered by upcoming date

**Word Ticker**

- Dark background, scrolling text in coral/yellow/cream
- Jazzy font (e.g., Pacifico or similar)
- Words: "Career Exploration", "Expert Sessions", "Industry Workshops", "Mentor Meetups", "Brand Connections", "Outdoor Leaders", "Skill Building", "Networking", "Career Pivots", "Discovery"

**Partner Section**

- Explains partnership with TNF, Patagonia, Brooks, REI, Cotopaxi for Recruitment Marketing
- CTA: Email [Jenna@wearetheoutdoorindustry.com](mailto:Jenna@wearetheoutdoorindustry.com)

### 2. `/calendar` -- Event Calendar

- Same nav as `/events`
- Full calendar view (month grid)
- Days with events show colored dots
- Hover on dot shows event card popup (photo, name, date, location, button)
- Click opens external event link in new tab
- Multiple events on same day show multiple dots

### 3. Admin Event Form (dialog/modal, accessible via URL param or button for team)

Form fields:

- Event photo (upload to Supabase storage)
- Event title
- Date
- Cost (0 = free)
- Registration link (external URL)
- Type: In-Person / Digital / Workshop
- Location (if not digital)

---

## Database Schema (Supabase)

```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  cost DECIMAL DEFAULT 0,
  registration_link TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in-person', 'digital', 'workshop')),
  location TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can read events
CREATE POLICY "Public can view events" ON public.events FOR SELECT USING (true);

-- Only authenticated users can insert (your team)
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);

-- Only creator can update/delete
CREATE POLICY "Creator can update events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creator can delete events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = created_by);
```

Storage bucket: `event-photos` (public)

---

## Files Created


| File                                       | Purpose                                     |
| ------------------------------------------ | ------------------------------------------- |
| `src/pages/Events.tsx`                     | Main events hub page                        |
| `src/pages/EventCalendar.tsx`              | Calendar view page                          |
| `src/components/events/EventsNav.tsx`      | Top nav with logos and menu                 |
| `src/components/events/EventsHero.tsx`     | Hero with illustration + ripped paper       |
| `src/components/events/EventCard.tsx`      | Individual event card                       |
| `src/components/events/EventFilters.tsx`   | Filter pills component                      |
| `src/components/events/EventsTicker.tsx`   | Scrolling word ticker                       |
| `src/components/events/PartnerSection.tsx` | Partner CTA section                         |
| `src/components/events/AddEventDialog.tsx` | Admin form for adding events                |
| `src/components/events/CalendarGrid.tsx`   | Calendar month view with hover cards        |
| `src/integrations/supabase/`               | Client + types (generated after connection) |


## Files Modified


| File                 | Change                                                              |
| -------------------- | ------------------------------------------------------------------- |
| `src/App.tsx`        | Add `/events` and `/calendar` routes                                |
| `src/index.css`      | Add Glacial Indifference font import, events-specific CSS variables |
| `tailwind.config.ts` | Add ticker animation keyframes                                      |


---

## Logos

- **Basecamp Outdoor logo**: Will download from wearetheoutdoorindustry.com and save to `src/assets/`
- **Basecamp Match logo**: Will download the SVG from basecampjobs.com and save to `src/assets/`

## Hero Illustration

Will create an inline SVG illustration with bees, honeycomb, forest trees, and forest flora/fauna in a modern, whimsical style using the brand color palette. Clean vector art aesthetic.