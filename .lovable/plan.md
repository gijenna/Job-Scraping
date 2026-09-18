# /partners, the public proof page

A new page showing who is already behind the mentor program. Nothing on the mentor network page, the sponsor page, or the Minneapolis, Denver, and Portland pages changes. No em dashes anywhere.

## First, the two things you asked about

**"Sponsor inquiries"** just means the list of people who filled out the sponsorship form at the bottom of the Sponsor a Mentor page. Those submissions are saved, but there is no screen where you can look at them yet. This ship adds one: a simple private list at `/admin/sponsors` showing every submission (name, company, email, which tier they picked, their message, and the date), with an on/off switch next to each one marked Confirmed.

**Confirmed is the safety switch.** A logo only appears on the public page after you flip that switch on. Nobody shows up just because they filled out a form.

**Logos:** the form only asks for a company name, so the page will look the logo up automatically from the company name, the same way the expert cards do. If it grabs the wrong image or none at all, you can paste a logo link or upload one on that same admin row, and your version wins. Until then it shows a clean initials tile, never a broken image.

## The page, in order

All five sections are hideable, reorderable, and fully text editable from the admin bar, same as everywhere else.

1. **Hero.** Eyebrow "THE MENTOR NETWORK", headline "Who's already in.", subhead "The brands and mentors making this program real, updated as new partners join."
2. **Our Partners.** Eyebrow "OUR PARTNERS", then a logo grid of confirmed partners only, each with a small tier badge underneath (Mentor Partner, Megaphone Partner, or Founding Partner) taken from what they selected. If there are none yet, the grid does not render at all. Instead: "Be the first partner behind this program." with a button to the sponsor page.
3. **Our Mentors.** Eyebrow "OUR MENTORS", a row of real Industry Expert cards for people at Patagonia, The North Face, and Yeti, read only, using the existing card. Caption: "These are examples from our existing Industry Expert network. HBCU-matched mentor cards will appear here as the program launches."
4. **Get Involved.** Eyebrow "GET INVOLVED", two equally weighted buttons: "Become a mentor" to the mentor network page at its For Mentors section, and "Sponsor a mentor" to the sponsor page.
5. **Footer.** The standard site footer.

Visual style matches the Sponsor a Mentor page (forest, clay, gold, cream) so the three pages read as one program.

## Technical notes

- New `src/pages/PartnersProof.tsx`, page slug `partners`, wrapped in `EditableTextProvider` and `OrderedSections`, route `/partners` added in `src/App.tsx`, head metadata set.
- One migration on `hbcu_mentor_sponsor_inquiries`: add `confirmed_sponsor boolean not null default false` and `logo_url text`. No other table is touched.
- RLS: public read is limited to a narrow, safe shape. A `SELECT` policy for `anon` and `authenticated` returning only confirmed rows, with the page querying just `company, tier, logo_url` so emails, names, and messages never leave the admin screen. Admin-only `SELECT` and `UPDATE` policies for the full row, plus the required grants.
- Tier badge maps the stored tier string to Mentor Partner / Megaphone Partner / Founding Partner, falling back to no badge for unmapped values such as "I need a 3rd option".
- Logo rendering reuses the existing company logo lookup with initials fallback, overridden by `logo_url` when present.
- Mentors section reuses the `SponsorExpertRow` read-only query pattern, filtered to Patagonia, The North Face, and Yeti, rendered with the existing `ExpertCard`. No writes to `industry_experts` or `expert_city_assignments`.
- New `src/pages/AdminSponsorInquiries.tsx` at `/admin/sponsors`, gated by the existing admin check, with the confirm toggle and logo field.

## Obvious next step, not in this ship

Once HBCU program mentors exist as real records with their own assignment flag, the Our Mentors section should pull those instead of the Patagonia / North Face / Yeti preview. That flag does not exist in the data yet, so it is Phase 2.
