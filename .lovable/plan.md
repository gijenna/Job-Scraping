# Basecamp Industry Expert Mentor Network page

A new standalone sales page for the HBCUs Outside x Sierra Club x NC Outward Bound x Basecamp mentor network. Nothing existing changes: no event pages, no card components, no candidate signup, no writes to industry_experts.

## Route and naming

- New route: `/mentor-network` (plus `/mentornetwork` alias so a typed URL still lands).
- Program name is not hardcoded. It lives as one admin-editable setting used everywhere the name appears (page title, hero, forms, confirmation copy).
- Not linked from any existing page.

## Sections (all hideable and reorderable)

1. Hero: eyebrow, headline, subhead, three ranked CTAs (primary "Sponsor a mentor", secondary "Become a mentor", plain text link "I'm a student"), each scrolling to its section.
2. The Partnership: intro line, three partner cards (Sierra Club, NC Outward Bound School, HBCUs Outside), then the pilot fact line about Oct 1 to 4, 2026 at Cedar Rock.
3. What Basecamp Is Building: headline, body, and the smaller "recruiting more than 20 on purpose" line.
4. How It Works: kicker "What this looks like once it's fully live", four numbered steps, with steps 1 and 2 visibly tagged as coming soon and no live form attached.
5. For Brands: heaviest section after the hero. Headline, body, "Talk to us about sponsoring" button opening a sponsor inquiry form (name, company, email, message).
6. For Mentors: headline, body, "Apply to mentor" button opening an interest form (name, email, company, current role, LinkedIn optional).
7. For Students: lightest weight. Headline, body, single email capture "Get notified when the quiz opens".
8. Supported By: logo row for the four confirmed partners, followed by "Your logo here" placeholder tiles, powered by the existing admin logo tool.
9. Footer: the existing site footer pattern.

Copy is exactly as specified. No em dashes anywhere.

## Design

Uses the established Basecamp palette and type already in the app (dark teal, coral, yellow, cream, Unbounded for display, Josefin Sans for everything else). Editorial layout: strong left-aligned hero with a rule-and-eyebrow treatment, asymmetric partner cards, numbered steps as a horizontal rail on desktop that stacks on mobile, and a clearly distinct visual weight ladder across the brand, mentor, and student sections. No gradient blobs, no generic stock hero. Fully responsive.

## Logos

Fetch official logos for HBCUs Outside, Sierra Club, and North Carolina Outward Bound School from their own sites, store them as project assets, and render each undistorted with no recoloring. Basecamp is added as a fourth in the same treatment. If a clean version of any logo cannot be retrieved, that one is flagged to you rather than faked.

## Admin controls

Reuses the existing system, not a new one:
- `EditableTextProvider` with a page slug of `mentor-network`, so every string on the page is inline editable by an admin.
- `OrderedSections` + `HideableSection` for hide and move up/down on all nine sections.
- `AdminLogoManager` / `useEventLogos` for the Supported By row, including the type-a-name-or-URL auto-populate behavior already built.

## Forms and data

Three new tables, each used only by this page:

- `hbcu_mentor_sponsor_inquiries`: full_name, company, email, message
- `hbcu_mentor_applicants`: full_name, email, company, current_role, linkedin_url
- `hbcu_mentor_student_waitlist`: email

Each gets standard id/created_at, row level security enabled, explicit grants, public insert (that is the point of the form), and reads restricted to Basecamp admins only so submissions are not publicly readable. Client side validation with zod before submit. Confirmation message shown inline on success, no emails sent this phase.

## Technical notes

- New files only: one page component, a small set of section components under a new `src/components/mentor-network/` folder, and the three form components.
- Route added to `src/App.tsx` (the only existing file touched).
- Sponsor and mentor CTAs open a dialog form; student capture is inline.

## Out of scope

Mentor card creation, the student matching quiz, scheduling integrations, and any change to existing pages, tables, or components.
