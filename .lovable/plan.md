

# Plan: Separate Card Styles & Logo Management Per Section

## Problem

1. **Card styles**: Brand reps and industry experts share one `card_style` setting per event. You want independent style control for each section.
2. **Logo management**: The ticker (who's attending) and "by the numbers" (who's partnering) share the same logo list. These represent different groups and need separate management.

This applies across all 4 pages: `/pnw26`, `/outsidedays26`, `/gather-denver`, `/gather-pnw`.

## Solution

### 1. Separate card style settings

Change the setting key from a single `card_style` to two keys per event:
- `card_style_brand_reps` 
- `card_style_experts`

**CardStylePicker** gets a new `settingKey` prop (defaults to `card_style` for backward compat). Each section renders its own picker with the appropriate key.

**Files changed:**
- `CardStylePicker.tsx` — accept `settingKey` prop
- `DenverAttendeeSections.tsx` — use separate settings for brand reps vs experts sections, each with its own `CardStylePicker`
- `PnwWhosComing.tsx` — use `card_style_experts` key (PNW only shows experts, not brand reps, but keeps the pattern consistent)

### 2. Separate logo lists (ticker vs partners)

Use distinct event slugs to separate the two logo pools:
- Ticker logos: keep existing slug (e.g. `gather-denver`, `pnw26`)
- Partner/stats logos: new slug suffix `-partners` (e.g. `gather-denver-partners`, `pnw26-partners`)

Each page gets two `useEventLogos` calls and two `AdminLogoManager` instances (labeled "Ticker Logos" and "Partner Logos").

**AdminLogoManager** gets an optional `label` prop so the admin panel shows which list they're editing.

**Files changed:**
- `AdminLogoManager.tsx` — add `label` prop for display
- `GatherDenver.tsx` — two `useEventLogos` calls (`gather-denver` for ticker, `gather-denver-partners` for stats); two `AdminLogoManager` instances
- `GatherPNW.tsx` — two calls (`gather-pnw` for ticker, `gather-pnw-partners` for stats/future use)
- `EventPNW26.tsx` — two calls (`pnw26` for ticker, `pnw26-partners` for brand grid)
- `EventOutsideDays26.tsx` — two calls (`denver26` for ticker, `denver26-partners` for stats)
- `DenverByTheNumbers.tsx` — no change (already receives logos as prop)
- `PnwByTheNumbers.tsx` — accept optional `logos` prop like Denver does, so it can receive partner logos from the page

### Summary of all file changes

| File | Change |
|------|--------|
| `CardStylePicker.tsx` | Add `settingKey` prop |
| `DenverAttendeeSections.tsx` | Separate card style per section |
| `PnwWhosComing.tsx` | Use `card_style_experts` setting key |
| `AdminLogoManager.tsx` | Add `label` prop for multi-instance clarity |
| `GatherDenver.tsx` | Two logo hooks + two admin managers |
| `GatherPNW.tsx` | Two logo hooks + two admin managers |
| `EventPNW26.tsx` | Two logo hooks + two admin managers |
| `EventOutsideDays26.tsx` | Two logo hooks + two admin managers |
| `PnwByTheNumbers.tsx` | Accept optional `logos` prop |

No database changes needed — the `event_logos` and `event_settings` tables already support arbitrary slugs and keys.

