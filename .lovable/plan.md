# Phase 2 — Taxonomies, Bubble Logo Selector, Map/List View

## Scope

Three deliverables, all reusing existing infrastructure:

1. Expand `src/lib/taxonomies.ts` with the full Phase 2 lists.
2. Extract the existing inline "company + logo" pattern (currently embedded in `ExpertIntakeForm.tsx`) into one reusable `BubbleLogoPicker` component. Use it in the candidate profile (`dream_companies`) and swap the existing inline usage in the expert form to it (no visual change).
3. Build the candidate-facing home screen at `/outsidedays26/connect/home` with Map/List toggle, reusing `EventMapCanvas`, `MapBrandPanel`, and the existing expert card components.

No new tables, no schema changes, no rebuilding of brand cards, brand modal, expert cards, or map canvas.

## 1. Taxonomies (src/lib/taxonomies.ts)

Replace the placeholder `FOCUSES_BY_FIELD` with the full 23-field ladder from the brief. Add:

- `NICHES` — 28 entries (alphabetical, as listed).
- `SKILL_CATEGORIES` — 22 category keys with their entries (full 370-skill list pulled from the linked Google Doc; if the doc is inaccessible at build time, ship the 22 category keys with empty arrays and a `TODO` for Jenna to paste in via admin later. **Decision needed — see open question below.**).
- Keep existing `POACHABLE_STATUS`, `CAREER_STAGE`, `JOB_TYPES`, `REMOTE_PREFERENCES`, `WORKPLACE_TYPES`.

All exported as `as const` arrays / `Record<string, readonly string[]>` so they can drive typed multi-selects.

No taxonomies table — kept as constants for now (faster, matches brief's "constants OR table" language). If Jenna later needs admin editing, we lift to a table in a future phase.

## 2. Reusable BubbleLogoPicker

**New file:** `src/components/connect/BubbleLogoPicker.tsx`

Behavior (mirrors the existing inline pattern in `ExpertIntakeForm.tsx` lines 615–635):

- Controlled component: `value: string[]` (company names) + `domains: Record<string,string>` + `onChange`.
- Text input with autocomplete suggestions. Suggestions are pre-populated from `event_map_brands` for the current event slug (queried once on mount), shown at the top of the dropdown.
- On commit (Enter or pick), append to `value`; logo loads via existing `getCompanyLogoUrl(name, domains)` from `src/lib/url-logo.ts`.
- Each selected company renders as a circular bubble (matches existing visual). Hovering shows an "x" remove and a small URL override input (same UX as the expert form's per-company domain override).
- If logo fails to load, show text-only chip (already how `getCompanyLogoUrl` falls back).

**Refactor:** Replace the inline JSX in `ExpertIntakeForm.tsx` (the "Previously worked at" block, lines ~613–640) with `<BubbleLogoPicker />`. Wire `previous_companies` (comma-string) ↔ `string[]` with a small adapter so the DB shape stays the same. No visual change for admins/experts.

**Used in:** the candidate profile editor (`ConnectProfile.tsx`) for the `dream_companies` field, replacing whatever placeholder is there now.

## 3. Candidate Home: Map / List view

**New route:** `/outsidedays26/connect/home` → new page `src/pages/outsidedays/ConnectHome.tsx`. Registered in `App.tsx`. Wrapped in `ImpersonationGate` like the other connect pages. After login, candidates land here (update redirect in `Connect.tsx`).

**Top of page:**

- A two-button toggle: `[Map] [List]`. Persisted per session in the existing `connect-session` cookie via a new `view_pref` field (NOT localStorage — brief forbids it). Implementation: extend `src/lib/connect-session.ts` with a `setViewPref` / `getViewPref` helper that writes to a non-httpOnly companion cookie `od_view`. Default = `Map`.

**Map view:**

- Render `<EventMapCanvas brands={brands} layouts={layouts} interactive={false} expertZoneExperts={...} onClick={handleBrandClick} />` for `event_slug = "denver26"` (matches admin).
- `interactive={false}` already disables drag/edit handles in the existing canvas.
- Wrap in a pinch-to-zoom container. Use `react-zoom-pan-pinch` (small, well-maintained). One new dep.
- `handleBrandClick(brand)`:
  - If `brand.name === "Industry Expert Zone"` → open a full-screen sheet listing all experts for the zone using the existing `ExpertCard` grid pattern (reuse `ExpertGrid` if signature matches, otherwise map over `ExpertCard`).
  - Else → open the existing `MapBrandPanel` (already a side panel/modal pattern used in admin) in read-only mode. Confirms with `MapBrandPanel`'s existing props; if it has admin-only edit affordances, pass a `readOnly` prop (add the prop if missing — small, additive change).

**List view:**

- Alphabetical grid of brand bubble logos (`event_map_brands` for `denver26`, sorted by name). Tap → same `handleBrandClick`. Expert Zone bubble pinned at the bottom.
- Mobile-first: 3-column grid at 375px, scaling up.

**Data hooks reused as-is:** `useEventMapBrands("denver26")`, `useEventMapLayouts("denver26", "published")` (use `published` layout, not `draft`, for candidate view), and the same expert-fetch query used in `EventMapAdmin.tsx` (extracted into a small `useDenverExperts()` hook in `src/hooks/` to avoid duplication).

## File changes

```text
NEW   src/components/connect/BubbleLogoPicker.tsx
NEW   src/pages/outsidedays/ConnectHome.tsx
NEW   src/hooks/useDenverExperts.ts
EDIT  src/lib/taxonomies.ts                 (full ladders, NICHES, SKILL_CATEGORIES)
EDIT  src/lib/connect-session.ts            (view pref cookie helpers)
EDIT  src/components/experts/ExpertIntakeForm.tsx  (swap inline picker for BubbleLogoPicker)
EDIT  src/pages/outsidedays/ConnectProfile.tsx     (use BubbleLogoPicker for dream_companies)
EDIT  src/pages/outsidedays/Connect.tsx            (post-login redirect → /connect/home)
EDIT  src/App.tsx                                  (register /connect/home route)
EDIT  src/components/event/MapBrandPanel.tsx       (add optional readOnly prop if needed)
```

New dep: `react-zoom-pan-pinch`.

## Out of scope (later phases)

- Connections / journal entries
- Brand rep filtering, candidate database, follow-up dashboard
- Email notifications
- Skills picker UI on the candidate profile (taxonomy ships now; UI lands when we expand the profile editor)

## Open question for Jenna

The 370-skill list lives in a Google Doc. I can't fetch private Google Docs at build time. Two options — please pick one before I start:

**Option A:** You paste the full list into the chat (or share it as plain text), I bake all 370 into `taxonomies.ts`.

**Option B:** I ship the 22 category keys with empty skill arrays now, and we build a tiny admin screen later to paste/edit skills in a `taxonomies` DB table.

Recommendation: **Option A** for speed — taxonomies rarely change, constants are simpler, and we can always migrate to a table later.  
  
OPTION A: Here are all 370 skills:   
  
MARKETING & COMMUNICATIONS

Brand marketing Brand strategy Brand partnerships Branding Communications Content creation Content strategy Copywriting Crisis management Digital marketing Direct mail Email marketing Experiential marketing Field marketing Go-to-market strategy Growth marketing Influencer marketing Integrated marketing Lifecycle marketing Marketing automation Marketing operations Marketing strategy Media buying Paid media Performance marketing PR Product marketing Recruitment marketing Retail marketing SEM SEO Social media management Social media marketing Sports marketing Storytelling Trade shows

## CREATIVE & DESIGN

3D design Activewear design Animation Apparel design Art/Artist Brand voice CAD design Color design Color grading Creative direction Creative production Drawing Editorial (publication) Film photography Footwear design Graphic design Illustration Industrial design Infographics Interior design Lettering Logo design Motion design Mural Outerwear design Package design Packaging design Painting Pattern design Photography Print Print design Product design Sketching Soft goods design Surface pattern design Technical apparel design Technical outerwear design Textile design Typography UX design Video production Visual communication Web design

## SALES & BUSINESS DEVELOPMENT

Account management B2B sales Brand ambassador Business development Channel sales Cold calling Consumer marketing Customer success Direct response Inside sales Key account management Outside sales Prospecting Retail sales Sales Sales enablement Sales management Software sales Territory sales Third party sales Upselling

## CUSTOMER EXPERIENCE

Client experience Customer engagement Customer service Customer service management Guest relations Guest services Help desk Loyalty Reservations Technical support

## PEOPLE, HR & CULTURE

Benefits administration Coaching Compensation DEI Employer branding Facilitation HR HRIS Internal communications Internal investigations Labor relations Leadership coaching Leadership development Mentoring Organizational development Payroll People & culture People management Performance management Recruiting Size inclusion work Talent management Team building Team leadership Training & development

## OPERATIONS & PROJECT MANAGEMENT

Agile Change management Cross functional collaboration Implementation Operational risk Operations management Process improvement Process management Process optimization Program management Project management Property management Resource management Scheduling Scrum Site management SOP development Standard operating procedures Stakeholder management Strategic planning Systems and processes Workflow optimization

## FINANCE & LEGAL

Accounting Audit Bookkeeping Budget management Compliance Contract management Copyright & trademarks Corporate development Demand planning Finance Financial reporting Forecasting Government affairs Insurance and claims Intellectual property (IP) Legal Pricing Risk management Tax Treasury

## TECH & ENGINEERING

AWS Backend development Business intelligence Coding CRM CRM management CSS Cybersecurity Data analysis Data engineering Data modeling Data science Data warehousing Database management DevOps ERP software ETL building Figma Frontend development GraphQL HTML Information architecture IT Java JavaScript Linux Machine learning Mobile app design MySQL NetSuite Oracle PHP PLM Power BI Product management Python Quality assurance React Ruby on Rails SaaS Salesforce SAP Shopify Software development SolidWorks SQL development System administration Tableau Technology architecture Typescript Web development Wireframing

## TOOLS & SOFTWARE

Adobe Illustrator Adobe Suite Airtable Asana Canva Excel Google Ads Google Analytics Google Suite Hubspot InDesign Jira Klaviyo Lightroom Mailchimp Microsoft Office Miro Notion Photoshop PowerPoint Premiere Pro Procreate Quickbooks Salesforce Marketing Cloud SharePoint Sketchup Squarespace Trello Wordpress Zendesk Zoom

## PRODUCT & MANUFACTURING

Apparel development Bill of materials Color development Costing Inventory management Manufacturing Material sourcing Materials testing Patternmaking Procurement Product development Product launch Production Prototyping Quality control Raw material development Regenerative supply development Research and development (R&D) Sewing Sourcing Supply chain Sustainable design practices Technical pack development Vendor management Wholesale

## RETAIL & E-COMMERCE

Assortment planning Buying E-commerce Merchandising Outdoor retail Retail design Retail management Visual merchandising

## WRITING, EDITING & JOURNALISM

Blogging Climate writing Copyediting Copywriting Editing Editorial Fact-checking Freelance writing Ghostwriting Journalism Longform content Proofreading Publishing Script writing SEO copywriting Technical writing Travel writing Writing

## EDUCATION & TRAINING

Adult learning Career coaching Classroom management Coaching Conservation education Curriculum development Environmental education Experiential education Instructional design Learning design LMS Outdoor education Place-based education Public speaking Recreational program development Teaching Trauma-informed work Working with adults Working with children Youth development Youth programming

## OUTDOOR SKILLS & ACTIVITIES

Adaptive recreation Adventure guiding Aiare 1 (avalanche cert) Avalanche forecasting Backcountry guiding Backcountry skills Backpacking Backpacking instructor Camping Canoeing Climbing Cross country guiding Expedition leading Fishing Fishing guiding Gear testing GPS navigation Guiding Hiking Hunting Interpretive guiding Kayak guiding Kayaking Leave No Trace Mountain bike guiding Mountain biking Mountaineering NAI certified Orienteering Outdoor adventure Outdoor leadership Overlanding Paddling Rafting Rock climbing Sea kayaking Search and rescue Skiing Ski instructor Snowboarding Snowboard instructor Trail work Trip leading Whitewater paddling Wilderness first aid (WFA) Wilderness First Responder (WFR) Wilderness guiding Wilderness medicine Wilderness navigation Wilderness skills Wilderness travel

## CONSERVATION, SCIENCE & SUSTAINABILITY

Air and water quality research Archaeology Biology Cartography Citizen science Climate adaptation Conservation Earth science Ecology Environmental engineering Environmental policy Environmental science ESG Field research Forestry Geology GIS Habitat restoration Invasive species removal Land stewardship Marine biology Meteorology Native plants Natural resource management Naturalist Nutrition Public health Sustainability Wildlife

## ADVOCACY, POLICY & NONPROFIT

Advocacy Coalition building Community engagement Corporate philanthropy Corporate social responsibility Fundraising Grant writing Lobbying Nonprofit management Policy Social impact Volunteer management

## HOSPITALITY, TOURISM & EVENTS

Adventure programming Event management Event marketing Event production Heritage tourism Hospitality Hospitality management Hotel management Nature tourism Restaurant management Tour operations Tourism Travel coordination Travel planning

## HEALTH, WELLNESS & RECREATION

Childcare Energy work Fitness Health and wellness Massage therapy Meditation Mental health Mindfulness Nursing Personal trainer Wellness Yoga Yoga instructor

## FIELD & MANUAL WORK

Animal care Animal handling Camp operations Carpentry Chainsaw certified Construction Farming Field work Gardening Horticulture Landscaping Manual labor Outfitting Permitting Prescribed fire management Trip logistics

## LANGUAGES

Bilingual Spanish Other (specify)