# Mentor Network page: feedback round

Positions the page clearly as the HBCUs Outside Leadership Academy, with the other orgs as supporting partners.

## 1. Hero

- Make the HBCUs Outside logomark much larger and give it top billing (roughly double current size, centered in the text column). When you send the new Leadership Academy logomark file, I swap the image in with no other changes.
- Partner line beneath the logomark drops HBCUs Outside and reorders: "WITH BASECAMP OUTDOORS x SIERRA CLUB x OUTWARD BOUND".
- Remove the headline "Representation, pathways & access, in motion" entirely. New headline:
  "Seven campuses. 20 future leaders. Mentored by the best the outdoor industry has to offer."
- The old subhead text moves into the headline, so the subhead becomes the existing mentorship framing line (one hour a month, pairing outdoor industry experts with HBCU students). No duplicated copy.

## 2. Be a Part of This

- "Shape or support the program" body ends with: "Start a conversation with Ron Griswell, founder of HBCUs Outside."

## 3. The Pilot in Motion

- "Beyond October" row becomes: "HBCUs Outside leaders run their own outings with Sierra Club certifications, continue virtual modules from the North Carolina Outward Bound School, and grow with the help of outdoor industry mentors and career connections from Basecamp Outdoors."
- Partner cards reorder so HBCUs Outside is first, then Basecamp Outdoors, Sierra Club, Outward Bound.
- Outward Bound is referred to as "Outward Bound" in partner naming across the page, with the North Carolina Outward Bound School named only in the Beyond October sentence above.

Untouched: The Partnership constellation, Why This Matters, all other sections, colors, fonts, layout.

## Technical notes

- File: `src/pages/MentorNetwork.tsx` (hero block, `PILOT_ROWS`, `PILOT_ROLES`, Be a Part of This body).
- The current hero headline and subhead are admin overrides saved in `event_settings` for the mentor-network page, so code defaults alone will not show. The saved `hero_headline` and `hero_subhead` rows get updated to the new copy so the live page matches.
- All new copy stays inside `EditableText`, so it remains admin editable. No em dashes.
