## Changes to `afterparty-tonight.tsx` (9am email)

### 1. Compact match layout (horizontal)

Replace the current stacked "miniMatch" cards with a single horizontal row of 5 small pills using a React Email `Row` + `Column` table layout (the only reliable way to do horizontal in email HTML). Each pill shows just `#N` on top and the first name below, on a cream chip with a yellow left border. Drops the role line entirely to keep the row short. Falls back to a wrap on narrow clients via fixed small column widths.

### 2. Restore hyperlinks

Wrap all brand/sponsor/raffle names in `<Link>` components with the exact URLs the user provided:

- **Swag bag (50 guests):** deuter, ing Outdoors, Nite Ize, Hydrapak, creepers socks, PAKA, Puffin drinkware, Oakley
- **Activities / drinks paragraph:** Sap's, Best Day, Strive Soda, Telluride Brewing, Westbound & Down, Brez, Ska Brewing, 4 Noses, Rod & Hammer
- **Raffle list:** each prize name links to its product page, each `@handle` links to its Instagram (full list of 9 items per user message)

Links use the existing coral underlined `mapsLink` style for consistency.

### 3. Test send

Call `send-transactional-email` with template `afterparty-tonight`, recipient `jenna@wearetheoutdoorindustry.com`, attendee #36, same 5 sample matches as preview.

### Out of scope

- No changes to `afterparty-matches.tsx` (5pm email), edge function logic, cron jobs, or admin UI.
- No copy changes beyond adding links.