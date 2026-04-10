

## Link Click Tracking for Admins

### What this does
Every hyperlink on the site will automatically track clicks. As an admin, you'll see a small tooltip on any link showing its total click count. You'll also get a "Download CSV" button on each page to export all link click data for that page.

### Database

**New table: `link_clicks`**
- `id` (uuid, PK)
- `created_at` (timestamptz, default now())
- `page_path` (text) — e.g. `/PNW26`
- `link_url` (text) — the href that was clicked
- `link_text` (text) — visible text of the link
- `session_id` (text, nullable) — anonymous session fingerprint for unique visitor tracking

RLS: public insert (anyone can log a click), authenticated select (only admins can read).

### Implementation

1. **Create `LinkTracker` wrapper component** (`src/components/LinkTracker.tsx`)
   - Wraps the entire app (inside `BrowserRouter`, above `Routes`)
   - Uses a delegated click handler on the document to intercept all `<a>` tag clicks
   - On each click, fires an async insert to `link_clicks` with the current `pathname`, `href`, and link text
   - Does NOT block navigation — fire-and-forget insert
   - Generates a random session ID in `sessionStorage` for basic deduplication

2. **Create `AdminLinkTooltip` behavior** (inside `LinkTracker`)
   - When `isAdmin` is true, adds a global CSS class that shows click count badges
   - On mount (admin only), fetches aggregated click counts for the current page path: `SELECT link_url, link_text, count(*) FROM link_clicks WHERE page_path = ? GROUP BY link_url, link_text`
   - Renders a floating tooltip/badge near each link showing the count (using a portal or data attribute approach)
   - Includes a floating "Download Link Stats CSV" button fixed to the bottom-right corner

3. **CSV export**
   - Queries `link_clicks` for the current `page_path`, groups by `link_url` and `link_text`, orders by count desc
   - Generates a CSV with columns: Link Text, URL, Click Count
   - Downloads via `Blob` + `URL.createObjectURL`

### Files changed
- **Migration**: Create `link_clicks` table with RLS policies
- **New**: `src/components/LinkTracker.tsx` — delegated click tracking + admin tooltips + CSV download
- **Edit**: `src/App.tsx` — wrap routes with `<LinkTracker>`

### Technical notes
- Delegated event listener approach means zero changes to existing link components — all `<a>` tags are tracked automatically
- Click logging is fire-and-forget (no `await`) so it never slows navigation
- Admin detection reuses the existing `supabase.auth.getSession()` pattern
- The tooltip will appear as a small badge (e.g. "42 clicks") on hover, styled unobtrusively
- CSV filename will include the page path and date, e.g. `link-clicks-PNW26-2026-04-10.csv`

