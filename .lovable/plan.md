

# Filtered CSV Export

## Problem
The "Export CSV" button in the header exports **all** experts regardless of the filters set in the CRM table (city, type, saved status). The filters live inside `ExpertCRM` but the download function lives in `AdminExperts`.

## Solution
Move the Export CSV button into the `ExpertCRM` component, right next to the existing filter controls. It will use the already-computed `filteredExperts` array plus filtered assignments, so whatever you see in the table is exactly what gets exported.

## Changes

| File | What |
|------|------|
| `src/components/experts/ExpertCRM.tsx` | Add an "Export CSV" button next to the filter row that builds the CSV from `filteredExperts` using the same logic currently in `AdminExperts.downloadCSV`. Include the current filter values in the filename (e.g. `basecamp-experts-portland-brand_rep-2026-04-03.csv`). |
| `src/pages/AdminExperts.tsx` | Remove the header-level "Export CSV" button since it now lives inside the CRM tab where the filters are. |

## Details
- The CSV columns and format stay identical (Name, Email, Job Title, Company, Field, Status, LinkedIn, Cities, Type, Years in Industry, Years in City, Ask Me About, Niche Interests, Share Links).
- The button label shows the count: "Export CSV (12)" matching the existing filtered count display.
- Filename includes active filters for clarity: `basecamp-experts-portland-brand_rep-active-2026-04-03.csv`. When filter is "all", that segment is omitted.

