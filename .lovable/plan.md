# Mentor Network: Constellation, Outcome, and Program Sections

Work stays on `/mentor-network`. Everything new is admin-editable and lives inside the existing hideable/reorderable section system.

## 1. Hero photo

Swap the hero image for a recent event photo featuring a Black attendee, positioned on the right side of the frame so the person is not buried under the text gradient. If the best photo has them on the left, it gets mirrored horizontally. Photos come from the most recent Minneapolis/Basecamp shoot set already in the project.

## 2. The constellation, rebuilt

**Bigger, brighter, and two rings.**

- Inner ring: the four program partners as large stars. Sierra Club, NC Outward Bound School, HBCUs Outside, Basecamp. Logos scale up roughly 40 percent from current size.
- Outer ring: the campus stars, sized at about the current partner-logo size, sitting on the fringe of the shape. Tennessee State, North Carolina A&T, Spelman, Morehouse, Clark Atlanta, Morehouse School of Medicine. Each campus logo is fetched, cleaned, and tinted cream so all marks read at equal weight on the dark sky.
- Connector lines get brighter: higher opacity, slightly thicker, with a soft gold glow so the shape reads clearly. Campus stars connect into their nearest partner star.
- One-line role labels sit under each partner logo, in small cream caps:
  - Sierra Club: Certification
  - NC Outward Bound School: Experiential Training
  - HBCUs Outside: Belonging
  - Basecamp: Mentorship
- Basecamp uses the correct Basecamp Outdoor brand mark, recolored cream to match the other partner logos.

**North star.** A single large star sits above the constellation, connected by a bright line down into the partner cluster. That star is labeled The Outcome, and the outcome copy replaces the current four description cards below the graphic:

"Certified leaders equipped to return to campus, lead belonging-centered experiences, train the next generation of leaders, and stay connected through a full academic year, positioning them to succeed as students and advance in their careers."

The four partner description cards below the constellation are removed since each partner now carries its role label in the graphic and the fuller descriptions move into the pilot section.

## 3. New section: Why This Matters

Sits directly under the constellation section. Four tenets as an editorial grid on the deep forest background, each with a large gold numeral or icon-scale marker, the tenet name in the display face, and one line of copy:

- Representation: a pathway of leaders drawn directly from the communities you're trying to reach.
- Pathways: turning participants into certified instructors, and over time, into employees.
- Access: activating underprogrammed locations with communities that fuel long-term partnership.
- Wellbeing: a measurable sense of belonging as a student success metric in its own right.

## 4. New section: The Pilot in Motion

A facts panel replacing the current single paragraph of pilot facts. Presented as labeled data rows on a cream or moss field so it reads like a program brief:

- Dates and location: October 1 to 4, 2026 · Cedar Rock, North Carolina
- Target campuses: 7, including Tennessee State, North Carolina A&T, and the four Atlanta University Consortium universities
- Student leaders: 3 to 5 per campus, already leading on their campuses, returning home certified
- Beyond October: certified leaders run their own Sierra Club outings, continue NCOBS virtual modules, build mental health literacy with a wellbeing partner, and stay connected year-round through HBCUs Outside

Plus the three partner role descriptions from the brief, in short form. No funding numbers anywhere on the page.

## 5. Supported by, restructured

Split into two labeled tiers:

- **Program partners** — the four core organizations at full size, one consistent tile height.
- **Supporters** — brands bringing in mentors, one size down, in a tighter grid. The admin-managed logo list feeds this row.

Basecamp's tile uses the legible green-wordmark logo on the light background of this section.

## Technical notes

- `src/components/mentor-network/PartnershipConstellation.tsx` gains a second star tier (partner vs campus), role labels, a north-star node, and brighter edge styling. Positions stay in the data array so future partners are one entry.
- University logos are downloaded once, background-removed, recolored cream, and saved under `src/assets/mentor-network/campuses/`. No runtime logo API and no hot-linking.
- Basecamp cream mark is regenerated from the correct Basecamp Outdoor logo file.
- New sections are separate components in `src/pages/MentorNetwork.tsx`, registered in `OrderedSections` as `why-this-matters` and `pilot-in-motion` so they can be hidden or reordered.
- All new copy uses `EditableText` with new setting keys. No em dashes.
