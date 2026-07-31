# Sponsor a Mentor page

New page at `/sponsor-a-mentor`. Nothing on `/mentor-network`, Minneapolis, Denver, or Portland changes. No em dashes anywhere.

## Sections, in order

All eight are independently hideable and reorderable from the admin bar, and every line of copy is inline editable, using the same pattern as the other event pages.

1. **Hero** — eyebrow FOR BRANDS, the mentor-on-the-roster headline, the subhead about a person willing to answer the phone once a month, and a Get involved button that scrolls to the offer.
2. **Who's already part of this** — real, published experts pulled read only from the existing expert database, shown in the full Industry Expert card. Every expert is loaded, and admin gets a hide toggle per person plus drag ordering, so you curate the row yourself. Patagonia, The North Face, and Yeti people already exist and will appear. Caption underneath about these being examples from the existing network.
3. **Stat banner** — full width, high contrast: "Twenty mentors. One measurably more diverse industry."
4. **The ask, plain** — the HOW THIS WORKS body about October already being covered, then two short equal cards: Provide a mentor, Sponsor the program. Orientation only, no pricing here.
5. **The offer** — headline about using the DEI budget on a program that works, then two priced tiers side by side. Mentor Partner $1,000 with logo placement, one mentor for the year, and a Mentor Partner card. Megaphone Partner $5,000 with everything above plus a newsletter feature, a social post, and a full storytelling piece. Under the tiers, the newsletter proof: the static newsletter mockup blocks from the MN brands page, reworded for this program, with the live newsletter embed below it.
6. **Who you'd be standing with** — small logo row of Sierra Club, North Carolina Outward Bound School, HBCUs Outside, and Basecamp using the existing undistorted logo files, with the "Established partnership, not a first-time ask." line.
7. **The form** — closing line, then Name, Company, Email, tier selection (Mentor Partner $1,000 / Megaphone Partner $5,000 / Not sure yet), and an optional message. Confirmation reads "Got it. We'll be in touch."
8. **Footer** — the standard site footer.

## Data

The sponsor inquiry table from the earlier ship already exists and gets reused, not duplicated. One migration adds a tier field to it so each lead records which option they picked. No writes to the expert tables, section 2 is read only.

## Technical notes

- New `src/pages/SponsorAMentor.tsx` with page slug `sponsor-a-mentor`, wrapped in `EditableTextProvider` and `OrderedSections`, route added in `src/App.tsx`.
- Section 2 uses `ExpertCard` (the full card) fed by a read-only query on `industry_experts` joined through published city assignments. Hidden ids and display order are stored as page settings on this page only, so hiding here never affects the event pages.
- Newsletter block copies the `NewsletterMention` / `NewsletterFeature` mockup markup and the `NewsletterEmbed` iframe out of `MN26Brands.tsx` into a local component for this page. `MN26Brands.tsx` itself is not edited.
- Form posts to `hbcu_mentor_sponsor_inquiries` with the new `tier` column, validated with zod, matching the existing `MentorForms` submission pattern.
- Head metadata set for the new route.

## Follow up, not in this ship

The Mentor Partner card generator. The existing expert card image function could render a company entry with the same treatment and download flow. Worth scoping separately.
