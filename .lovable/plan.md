

# Plan: Add "Not Hiring" Section, Navigation Menu, and Firewall Audit

## 1. New "Not Hiring" Section (both pages)

Create a reusable component `EventNotHiringCallout.tsx` placed above `DenverPowerfulPremium` and `PnwPowerfulPremium` respectively. Simple centered text block with the messaging provided, styled to match the existing page aesthetic.

### Files changed:
- **New**: `src/components/event/EventNotHiringCallout.tsx` — reusable section with the copy
- **Edit**: `src/pages/GatherDenver.tsx` — insert `<EventNotHiringCallout />` before `<DenverPowerfulPremium />`
- **Edit**: `src/pages/GatherPNW.tsx` — insert `<EventNotHiringCallout />` before `<PnwPowerfulPremium />`

## 2. Hamburger Navigation Menu (both pages)

Add a fixed top-left hamburger menu (using Shadcn Sheet) to both sponsor pages. The menu will contain:

- **Basecamp Outdoor** → wearetheoutdoorindustry.com
- **Basecamp Match** → basecampjobs.com
- **Events Hub** → /events (main event site)
- On `/gather-denver`: **Gather PNW** → /gather-pnw
- On `/gather-pnw`: **Outside Days Denver** → /gather-denver

### Files changed:
- **New**: `src/components/event/SponsorPageNav.tsx` — hamburger icon + Sheet with links, accepts a prop for which "other event" to show
- **Edit**: `src/pages/GatherDenver.tsx` — add `<SponsorPageNav />` with PNW as the other event
- **Edit**: `src/pages/GatherPNW.tsx` — add `<SponsorPageNav />` with Denver as the other event

## 3. Firewall Audit Findings

After reviewing the project, here are potential issues that could block access behind corporate firewalls:

| Issue | Detail | Fix |
|-------|--------|-----|
| **Large video files bundled in JS** | `hero-pnw.mp4` and `hero-denver.mp4` are imported directly via Vite, which inlines them or creates large asset chunks. Corporate firewalls and proxy servers often block or timeout on very large JS bundles (>5MB). | Move videos to `/public/` folder and reference via static URL paths instead of imports. This lets the browser stream them naturally and avoids bloating the initial JS bundle. |
| **No issue with robots.txt** | Already allows all crawlers. No problem here. |
| **No CSP or X-Frame-Options issues** | No restrictive headers set. No problem here. |
| **LinkedIn CDN images** | Some expert photos reference `media.licdn.com` which corporate firewalls may block. Not actionable — only affects expert detail pages, not the sponsor pages in question. |

The video bundle size is the most likely cause of blocked access. Moving videos to `/public/` is the fix.

### Files changed:
- **Move**: `src/assets/hero-pnw.mp4` → `public/hero-pnw.mp4`
- **Move**: `src/assets/hero-denver.mp4` → `public/hero-denver.mp4`
- **Edit**: All files importing these videos (PnwHero.tsx, EventPNW26.tsx, ExpertInvite.tsx, BrandRepInvite.tsx) — change from import to string path `/hero-pnw.mp4` and `/hero-denver.mp4`

## Summary of all file changes

| File | Action |
|------|--------|
| `src/components/event/EventNotHiringCallout.tsx` | New |
| `src/components/event/SponsorPageNav.tsx` | New |
| `src/pages/GatherDenver.tsx` | Edit — add nav + callout |
| `src/pages/GatherPNW.tsx` | Edit — add nav + callout |
| `src/components/event/PnwHero.tsx` | Edit — use static video path |
| `src/components/event/DenverHero.tsx` | No video import, no change needed |
| `src/pages/EventPNW26.tsx` | Edit — use static video path |
| `src/pages/ExpertInvite.tsx` | Edit — use static video path |
| `src/pages/BrandRepInvite.tsx` | Edit — use static video path |
| `public/hero-pnw.mp4` | Move from src/assets |
| `public/hero-denver.mp4` | Move from src/assets |

