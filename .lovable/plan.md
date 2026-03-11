

# Multi-Page Updates Plan

## /events Page

### 1. Fix white space between hero and black nav
The hero has `pt-16` (for nav clearance) and the ripped-paper SVG fill uses `hsl(192 38% 16%)` which is a dark teal, not matching the cream background below. The white gap is the `bg-events-cream` showing between the SVG bottom and the events section. Fix by removing the gap: change the SVG's `-mt-1` to `-mt-px` or remove the `pt-16` offset so the video butts right up against the nav, and ensure the SVG fill matches the hero overlay color or add `bg-events-teal` behind the SVG container.

### 2. Allow any user to edit events (not just admin)
Currently `AddEventDialog` and delete buttons are gated behind `isAdmin` (requires auth session). Show the "Add Event" button and delete buttons to all users by removing the `isAdmin` condition. Keep admin login for other features if needed.

### 3. Add "Office Hours" to Happenings menu with brand submenu
In `EventsNav.tsx`, add an "Office Hours" item under the Happenings section. On hover/click, show a nested list of brands linking to their specific Office Hours pages. The brands and links (based on the site pattern):
- Cotopaxi → `https://www.wearetheoutdoorindustry.com/officehours/cotopaxi`
- Backbone → `https://www.wearetheoutdoorindustry.com/officehours/backbone`
- Arc'teryx → `https://www.wearetheoutdoorindustry.com/officehours/arcteryx`
- Outward Bound → `https://www.wearetheoutdoorindustry.com/officehours/outwardbound`
- Outside PR → `https://www.wearetheoutdoorindustry.com/officehours/outsidepr`
- CU Boulder → `https://www.wearetheoutdoorindustry.com/officehours/cuboulder`
- Vail Resorts → `https://www.wearetheoutdoorindustry.com/officehours/vailresorts`
- Autocamp → `https://www.wearetheoutdoorindustry.com/officehours/autocamp`
- Title Nine → `https://www.wearetheoutdoorindustry.com/officehours/titlenine`

Implementation: Add "Office Hours" as a collapsible/expandable item in the slide-out menu with brand links indented beneath it.

---

## /outsidedays26

### 4. Add sentence about Outside Days below the map + "get festival tickets" hyperlink
In `RegistrantVenue` usage for Denver, add a `description` prop with a sentence about Outside Days, and append a plain text hyperlink "get festival tickets" linking to `https://bit.ly/outside-days`. Not a button — just a styled link. Remove the existing `ticketUrl` button prop.

### 5. Remove "Get in on this" button, consolidate to one "Involve your brand" button
Currently there are two sections: `DenverFestivalPartner` and then a separate "Involve your brand" CTA. Remove the separate "Involve your brand" section (lines 100-111) and instead add the "Involve your brand" button inside `DenverFestivalPartner`, replacing the existing "Get in on this" button.

---

## /pnw26

### 6. Change 500 to 300 in "Show up as a brand"
`RegistrantHowToTapIn` currently hardcodes "500+" in the description. Make this configurable via a prop (e.g., `attendeeCount`), defaulting to "500+". Pass "300+" from PNW26 and keep "500+" from OutsideDays26.

### 7. Move industry expert section below the ticker
In `EventPNW26.tsx`, move `PnwWhosComing` (currently after the "Who's in the room" brand showcase) to right after `EventLogoTicker`.

### 8. Add rotating job seeker testimonials from /gather-denver
Add the same testimonial carousel from `RegistrantDenverStats` as a standalone component. Place it after the "Who's in the room" brand showcase section.

### 9. Add rotating gallery "Check out other Basecamp Events"
Create a new carousel section between "Who's in the room" and "What to Expect" showing the uploaded event photos. Save uploaded images as assets. Auto-rotating horizontal carousel with the title "Check out other Basecamp Events".

---

## /gather-pnw

### 10. Make the men chatting photo taller on desktop
In `PnwUOPartner.tsx`, the `eventPnwCrowd` image on the right side — add `md:aspect-[3/4]` or similar to make it taller on desktop while keeping natural aspect on mobile.

---

## Across Sites

### 11. Underrepresented communities testimonial — use a real photo of a black woman
Replace `avatarId: 45` with a different pravatar ID that shows a black woman. After checking pravatar options, use `avatarId: 20` which depicts a black woman. Update in: `RegistrantDenverStats.tsx`, `DenverByTheNumbers.tsx`, `PnwByTheNumbers.tsx`, `MobileTestimonialCarousel.tsx`.

### 12. Hyperlink all Basecamp logos to wearetheoutdoorindustry.com
In `ExpertInvite.tsx`, `BrandRepInvite.tsx`, `CityExperts.tsx`, `ExpertDetail.tsx` — wrap the `basecampLogo` img tags in an `<a href="https://www.wearetheoutdoorindustry.com">` link (target _blank). Currently they're plain `<img>` tags with no link.

---

## Assets to Add (10 images for PNW26 gallery)
- `IMG_4425_1.jpg` → `src/assets/event-booth-tent.jpg`
- `IMG_4560_1.jpg` → `src/assets/event-attendee-smile.jpg`
- `ACS_0417-2.jpg` → `src/assets/event-networking-uo.jpg`
- `ACS_0418-2.jpg` → `src/assets/event-panel-uo.jpg`
- `IMG_5045_2.jpg` → `src/assets/event-friends-duo.jpg`
- `IMG_4677_1.jpg` → `src/assets/event-group-guys.jpg`
- `Untitled_design_17-2.png` → `src/assets/event-cotopaxi-convo.png`
- `Untitled_design_16.png` → `src/assets/event-crowd-convo.png`
- `Untitled_design_18.png` → `src/assets/event-vf-banner.png`
- `Untitled_design_15-2.png` → `src/assets/event-yeti-denver.png`

---

## Files Modified (~15)
- **Assets**: 10 new image files
- **Pages**: `Events.tsx`, `EventOutsideDays26.tsx`, `EventPNW26.tsx`, `ExpertInvite.tsx`, `BrandRepInvite.tsx`, `CityExperts.tsx`, `ExpertDetail.tsx`
- **Components**: `EventsHero.tsx`, `EventsNav.tsx`, `RegistrantVenue.tsx`, `RegistrantHowToTapIn.tsx`, `DenverFestivalPartner.tsx`, `PnwUOPartner.tsx`, `RegistrantDenverStats.tsx`, `DenverByTheNumbers.tsx`, `PnwByTheNumbers.tsx`, `MobileTestimonialCarousel.tsx`

