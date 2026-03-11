

# Fix Portland Date Display: April 16

## Problem
The ExpertInvite and BrandRepInvite pages format the Portland date using `new Date(city.event_date)` with `.toLocaleDateString()`. The database stores `2026-04-16 00:00:00+00` (UTC midnight), which converts to **April 15** in US timezones (PDT is UTC-7). This is a timezone bug.

## Fix
In both `ExpertInvite.tsx` and `BrandRepInvite.tsx`, replace the timezone-sensitive `new Date()` parsing with UTC-safe parsing so the displayed date matches the stored date:

```ts
// Before (timezone-sensitive — shows Apr 15 in US):
new Date(city.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

// After (UTC-safe — shows Apr 16):
new Date(city.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
```

Same fix for the year:
```ts
new Date(city.event_date).toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' })
```

## Files to Edit (2)
1. **`src/pages/ExpertInvite.tsx`** — Lines 392, 395: Add `timeZone: 'UTC'` to both `toLocaleDateString` calls
2. **`src/pages/BrandRepInvite.tsx`** — Lines 374, 377: Same fix

All other Portland pages (PnwHero, EventPNW26, GatherPNWExport, EventOverview) already hardcode "April 16, 2026" correctly.

