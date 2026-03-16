

# Plan: Expert Card Social Sharing

## Overview

Enable experts to share their cards on social media with rich preview images after completing their profile. This requires solving the core SPA problem: social media crawlers don't execute JavaScript, so they can't see React-rendered content.

## Architecture

```text
Expert completes card
       ↓
Success screen shows "Share your card" buttons
(LinkedIn, Twitter/X, Facebook, Copy Link)
       ↓
Share URL: /Portlandexperts/view/{slug}
       ↓
When a social crawler hits that URL:
  Edge function serves HTML with OG meta tags
  (expert name, title, company, photo as OG image)
       ↓
When a real browser hits that URL:
  Edge function redirects to /pnw26 (event page)
       ↓
Pre-filled share message includes card link
```

## Implementation

### 1. Edge function: `expert-og` — serves OG meta tags for crawlers

An edge function that:
- Accepts `?slug=expert-slug&city=portland` query params
- Fetches expert data from the database
- For **crawler user agents** (facebookexternalhit, Twitterbot, LinkedInBot, etc.): returns an HTML page with proper OG meta tags using the expert's photo as `og:image`, their name/title as `og:title`, and a description like "Meet [Name] at Gather PNW — [Title] at [Company]"
- For **real browsers**: redirects to the event page (`/pnw26` for portland, `/OutsideDays26` for denver)
- The share URL format: `https://sponsor-attract-hub.lovable.app/share/expert?slug=hannah-harrick&city=portland`

Add a route in `App.tsx` and also configure the edge function URL so crawlers hit it directly.

**Important**: Since this is a Lovable SPA, crawlers won't hit edge functions via client-side routing. We'll use the edge function URL directly as the share link: `https://qpnzjcbdtybwazceggmv.supabase.co/functions/v1/expert-og?slug=...&city=...`. This is the URL that gets shared on social media. When real users click it, they get redirected to the event page.

### 2. Share buttons in ExpertIntakeForm success screen

After "Card saved!", add a share section with:
- **Share on LinkedIn** — opens LinkedIn share dialog with pre-filled URL + message
- **Share on X/Twitter** — opens Twitter intent with pre-filled tweet
- **Copy share link** — copies the edge function share URL
- Pre-filled message: "I'm an Industry Expert at Gather PNW by @BasecampOutdoor! Come meet me and other outdoor industry professionals. Register free → [event link]"

### 3. Share button on ExpertDetail page

Add a small share icon on the `/Portlandexperts/view/:name` detail page so experts who revisit can share again.

### 4. Reminder capability (optional/future)

Add a `share_reminder_sent` boolean column to `expert_city_assignments`. A scheduled edge function (via pg_cron) could query experts who haven't shared yet as the event approaches, but the actual reminder delivery (email) requires email infrastructure. For now, we'll add the DB column and note this as a future enhancement once email is configured.

## Files

| File | Changes |
|------|---------|
| `supabase/functions/expert-og/index.ts` | New edge function for OG meta + redirect |
| `supabase/config.toml` | Add `verify_jwt = false` for expert-og |
| `src/components/experts/ExpertIntakeForm.tsx` | Add share buttons to success screen |
| `src/components/experts/ShareCardButtons.tsx` | New reusable share button component |
| `src/pages/ExpertDetail.tsx` | Add share button |

## Technical Details

- The OG image will be the expert's `photo_url` directly — this works well since social platforms crop to card format anyway
- `og:title` = "{Name} — Industry Expert at {Event Title}"
- `og:description` = "{Title} at {Company} · Meet me at {Event} in {City}"
- The share URL uses the edge function directly so crawlers get server-rendered HTML
- Real browsers get a 302 redirect to the event page (e.g. `/pnw26`)
- No database migration needed beyond the optional reminder column

