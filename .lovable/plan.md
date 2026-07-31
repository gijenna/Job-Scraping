# Partnership Constellation

Rebuild the "The Partnership" section of `/mentor-network` as a dark night-sky constellation where each partner is a star. Everything else on the page stays as is.

## What changes

**New dark constellation band**
- The partnership section gets a deep forest-to-near-black sky background with a fine star field, replacing the cream background for this section only.
- Four partner logos sit as "stars" in a hand-placed constellation: HBCUs Outside, Sierra Club, North Carolina Outward Bound School, Basecamp. Thin gold connector lines link them into a shape.
- Each star has a small glowing point behind its logo. Stars twinkle gently at staggered intervals and the whole field drifts slowly. Motion is restrained, and it respects reduced-motion settings.
- The layout is built from a positions array, so adding a fifth partner later is one entry, not a redesign.

**Subheading**
Added under the section headline, admin-editable:
"Seven HBCU campuses are building certified student leaders through this partnership, now extending into a full year of mentorship."

**Logos**
- North Carolina Outward Bound School: use the logo from the Bonfire URL you provided, downloaded into the project, background removed so it sits transparent on the dark sky.
- Basecamp logo made transparent as well.
- Every logo checked for legibility on the dark background. Any logo that reads too dark gets a cream treatment (brightness/invert filter or a cream-tinted version) so all four sit at consistent visual weight. No stretching or recoloring beyond legibility.

**Partner cards**
The four description cards stay below the constellation, restyled to sit on the dark background (cream text, subtle bordered panels) so the section reads as one piece. Card copy is unchanged and stays admin-editable.

The pilot facts line at the bottom of the section stays, adjusted for contrast on the new background.

## Technical notes

- All work is in `src/pages/MentorNetwork.tsx` plus one new `src/components/mentor-network/PartnershipConstellation.tsx`. The section stays inside `OrderedSections` so it remains hideable and reorderable.
- New text nodes use `EditableText` with new setting keys (`partnership_subhead`), so you can edit them inline.
- NCOBS logo saved to `src/assets/mentor-network/ncobs.png` after background removal; the Bonfire URL is not hot-linked.
- Star field and twinkle done with CSS keyframes and an inline SVG for the connector lines. No new dependencies.
- No em dashes.
