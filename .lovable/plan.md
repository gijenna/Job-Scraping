

# Industry Expert System - Phase 1: Database + Admin Dashboard

This is a large project. We'll build it in 3 phases. **Phase 1** (this plan) establishes the data layer, admin CRM, and expert card prototypes. Phases 2-3 (public pages, Google Sheets sync, LinkedIn scraping) will follow.

---

## Phase 1 Scope

### 1. Database Tables

**`expert_cities`** - Event/city configurations
- `id`, `slug` (e.g. "denver"), `name` ("Denver"), `event_title`, `event_date`, `event_location`, `event_time_details`, `arrival_time`, `branding_color` (accent override), `hero_image_url`, `active` (boolean)

**`industry_experts`** - Expert profiles (one row per person)
- `id`, `full_name`, `email`, `location` (array of city slugs), `job_title`, `current_company`, `photo_url`, `linkedin_url`, `field_of_work`, `years_in_industry`, `years_in_city`, `ask_me_about`, `favorite_media`, `previous_companies` (text), `niche_interests` (text array), `status` (enum: invited / viewed / started / confirmed), `created_by` (admin who invited), `created_at`, `updated_at`

**`expert_city_assignments`** - Links experts to cities with per-city card versions
- `id`, `expert_id` (FK), `city_slug`, `card_version` (jsonb - stores card overrides per city if they differ), `published` (boolean - admin controls visibility on public site), `created_at`

**`expert_questions`** - "I have questions" submissions
- `id`, `expert_id` (FK, nullable), `expert_name`, `city_slug`, `question_text`, `admin_answer`, `show_in_faq` (boolean), `created_at`

RLS: Public read for published experts. Authenticated CRUD for admins (using existing domain-restricted auth).

### 2. Admin Dashboard (`/admin/experts`)

Uses existing `/admin` auth (domain-restricted to @wearetheoutdoorindustry.com and @basecampjobs.com).

**CRM View:**
- Table/list with columns: Name, Email, City/Event, Status (invited/viewed/started/confirmed), Date Invited, Actions
- Filter by city/event
- Visual status indicators (color-coded badges)
- Click row to expand/edit expert details
- "Add Expert" button opens a form: enter name + optional LinkedIn URL
  - Generates personalized URL: `/Denverexperts/firstname-lastname`
  - Attempts LinkedIn scrape via Firecrawl to pre-populate card (title, company, photo)
  - If scrape fails, creates placeholder card with name only
- Bulk actions: publish/unpublish cards to public event page
- Column showing if expert has multiple city assignments

**City/Event Management:**
- Add new cities with event details (name, date, location, schedule, branding)
- Per-city view of experts

**FAQ Management:**
- View all submitted questions
- Enter answers, toggle "show in FAQ" to publish on expert pages

### 3. Expert Card Design (Two Prototypes)

Both use the same card component, just different layouts:

**Card Design (Polaroid style):**
- B&W photo in a polaroid frame with slight rotation/shadow
- Cream text on dark teal background
- Name in coral, title + company in yellow
- Company logo fetched via `logo.clearbit.com/domain.com` (free, no API key)
- LinkedIn icon overlay on photo (clickable)
- Previous company logos in a row
- Field of work tag/badge
- Expandable section: niche interests, "ask me about"

**Prototype A - Carousel:** One large center card with peek of adjacent cards + arrows. Company logos of off-screen experts float near arrows.

**Prototype B - Grid:** All cards visible in a responsive grid, click to expand/focus one.

Both will be built as components so you can compare and choose.

### 4. Firecrawl Integration (LinkedIn Attempt)

- Connect Firecrawl connector to project
- Edge function `scrape-linkedin` calls Firecrawl to scrape a LinkedIn profile URL
- Extract: name, headline (title), company, profile photo URL
- Fallback: if scrape returns limited data, populate what's available and leave rest blank
- Admin sees pre-filled form and can edit before saving

### 5. Google Sheets Two-Way Sync (Setup)

- Requires a Google Cloud service account JSON key
- Edge function `sync-google-sheets` handles bidirectional sync:
  - On expert create/update in DB -> push to Google Sheet
  - Periodic pull from Sheet -> update DB (or webhook-triggered)
- Will request API key in Phase 1, implement sync logic

---

## Routes Added

- `/admin/experts` - Admin CRM dashboard
- `/Denverexperts` - Public Denver experts page (Phase 2)
- `/Denverexperts/:name` - Personalized expert invite page (Phase 2)
- `/Portlandexperts`, `/MNexperts` - Same pattern per city (Phase 2)

---

## Files Created/Modified

**New files:**
- `src/pages/AdminExperts.tsx` - CRM dashboard
- `src/components/experts/ExpertCard.tsx` - Polaroid-style card
- `src/components/experts/ExpertCarousel.tsx` - Prototype A
- `src/components/experts/ExpertGrid.tsx` - Prototype B
- `src/components/experts/AddExpertDialog.tsx` - Admin add expert form
- `src/components/experts/ExpertCRM.tsx` - CRM table component
- `src/components/experts/FAQManager.tsx` - FAQ admin panel
- `src/lib/api/firecrawl.ts` - Firecrawl client
- `supabase/functions/scrape-linkedin/index.ts` - LinkedIn scrape edge function

**Modified files:**
- `src/App.tsx` - Add routes
- Database migration for all new tables + RLS policies

---

## Dependencies Needed

- Firecrawl connector (already available in workspace, needs linking)
- Google Sheets API key (will request when ready)

---

## What Phase 2 Covers (next)

- Public expert pages (`/Denverexperts`, `/Portlandexperts`, `/MNexperts`)
- Personalized invite pages with `/name` URLs
- "I'm In" button with leaf confetti + intake form
- "I have questions" flow
- Name-based return/edit flow
- Non-personalized generic version
- Event page carousel integration + PNG download

## Phase 3

- Google Sheets two-way sync implementation
- Email notifications (when ready to add)
- Status tracking (page viewed, button clicked)

