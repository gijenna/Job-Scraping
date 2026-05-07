## 1. Archive brand partner cards in the Expert CRM

Mirror how past-event experts are handled today: keep the data, just hide them from the active list with an "Archived" toggle.

- In `src/components/experts/BrandDashboard.tsx`, add an `archived` filter (defaulting to hiding archived brands) plus a small "Show archived" toggle and an "Archive" action on each brand card (next to the existing edit/delete).
- Archive state stored on the brand expert row. We'll add a nullable `archived_at timestamptz` column to `experts` (covers both brands and any future expert archiving) via migration; `null` = active, timestamp = archived. Default queries on the live event pages already filter by `event_assignments`, so this only affects the CRM listing.
- "Archive" sets `archived_at = now()`; "Restore" clears it. Existing delete stays as a hard-delete.

This way you can stash brands from past events without losing their reps or contact info, just like archiving a person.

## 2. Even spacing on the live "Meet the Teams" rep grid

Current behavior: `BrandUmbrellaSection.tsx` line 145 uses a fixed `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` grid, so 1–4 reps cling to the left and 5 looks correct only by accident.

Replace the fixed grid with a count-aware layout (desktop ≥ md):

| Reps | Layout |
|------|--------|
| 1 | 1 centered |
| 2 | 2 evenly spaced |
| 3 | 3 evenly spaced |
| 4 | 4 evenly spaced |
| 5 | 5 across (current squished look) |
| 6 | 3 + 3 |
| 7 | 4 + 3 |
| 8 | 4 + 4 |
| 9 | 5 + 4 |
| 10 | 5 + 5 |
| 11+ | 5 per row, last row centered |

Implementation: a small helper `splitRepsIntoRows(count)` returns an array of row sizes; render one flex row per group with `justify-center` and a fixed card width (`w-[160px] md:w-[180px]`) so spacing stays even regardless of count. Mobile (<md) keeps a simple 2-column grid so cards don't get tiny.

No changes to card visuals, expand/collapse, or the bubble logos above.

## 3. Brand rep submissions → Google Sheet (new spreadsheet, existing tab)

You confirmed a different spreadsheet entirely. Two things I need from you before I wire this up:

1. **Spreadsheet ID** of the new sheet (the long string in the URL between `/d/` and `/edit`). I'll store it as a new secret `GOOGLE_SPREADSHEET_ID_BRAND_REPS`.
2. **Tab name** to append into (e.g. `BrandReps` or `Submissions`). I'll add it as a constant in the function — easy to change later.

Also: please share the sheet with the existing service account email (the one used by `sync-expert`) as **Editor** so it has write access. If you're not sure of that email, I can pull it from the `GOOGLE_SERVICE_ACCOUNT_KEY` secret and tell you.

Once you confirm those, I'll:

- Update `supabase/functions/sync-expert/index.ts` so when the submitted expert `is_brand_rep === true`, it appends to `${GOOGLE_SPREADSHEET_ID_BRAND_REPS}` / `<tab>!A1:append` instead of (or in addition to — your call) the per-city sheet.
- Match the column order to whatever headers already exist in that tab. If you tell me the column headers, I'll map them exactly; otherwise I'll mirror the existing expert sync columns.

### Question before I proceed
For brand rep submissions, do you want them to **only** go to the new brand-reps sheet, or **both** the city sheet AND the brand-reps sheet? Default I'd pick: **only the brand-reps sheet** so the city tabs stay clean.

## Technical notes

- Migration: `ALTER TABLE experts ADD COLUMN archived_at timestamptz;` (nullable, no backfill needed).
- `BrandDashboard` filters: `brandEntries.filter(b => showArchived ? true : !b.expert.archived_at)`.
- Row-splitter pseudocode:
  ```ts
  const ROW_PATTERNS: Record<number, number[]> = {
    1:[1], 2:[2], 3:[3], 4:[4], 5:[5],
    6:[3,3], 7:[4,3], 8:[4,4], 9:[5,4], 10:[5,5],
  };
  function splitReps(n: number) {
    if (ROW_PATTERNS[n]) return ROW_PATTERNS[n];
    const rows = []; let left = n;
    while (left > 5) { rows.push(5); left -= 5; }
    rows.push(left);
    return rows;
  }
  ```
- New secret needed: `GOOGLE_SPREADSHEET_ID_BRAND_REPS` (added via add_secret tool after you give me the ID).

## Files touched
- `supabase/migrations/<new>.sql` — add `archived_at` column
- `src/components/experts/BrandDashboard.tsx` — archive toggle + actions
- `src/components/event/BrandUmbrellaSection.tsx` — even-spacing row layout
- `supabase/functions/sync-expert/index.ts` — brand-rep sheet branch

Please reply with: **(a) the new spreadsheet ID, (b) the tab name, (c) only-new-sheet vs both sheets** and I'll execute.
