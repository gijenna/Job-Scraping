

# Per-Page Favicon & OG Preview Image — Admin-Editable

## What This Delivers

An admin panel on each page where you can upload or set a custom favicon and Open Graph preview image (the image that shows when someone shares a link on social media/Slack/etc). These are stored in the database via the existing `event_settings` system and applied dynamically — no Lovable credits burned.

## Important Limitation

Since this is a single-page app (SPA), dynamically setting OG meta tags via JavaScript works for **some** social crawlers (Twitter/X executes JS) but **not all** (Facebook, LinkedIn, iMessage often do not). To fully solve OG previews for all platforms, we will also create an **edge function** that serves correct meta tags to bot crawlers before they hit the SPA. This is the industry-standard approach for SPAs.

---

## Implementation

### 1. Admin UI Component: `PageMetaEditor`

A small floating admin widget (similar to the existing admin gear panel) that appears on each page when authenticated. It provides:
- **Favicon**: Upload an image or paste a URL. Stored as `event_settings` key `page_favicon`.
- **OG Image**: Upload an image or paste a URL. Stored as key `page_og_image`.
- **OG Title / OG Description**: Editable text fields. Stored as `page_og_title` and `page_og_description`.

Uploads go to a new `page-meta` storage bucket.

**New file:** `src/components/event/PageMetaEditor.tsx`

### 2. Client-Side Meta Tag Hook: `usePageMeta`

A hook consumed by each page that:
- Reads `page_favicon`, `page_og_image`, `page_og_title`, `page_og_description` from `event_settings` for the current page slug.
- Dynamically updates `document.title` and the favicon `<link>` element.
- Dynamically updates/creates OG and Twitter meta tags in `<head>`.

**New file:** `src/hooks/usePageMeta.ts`

### 3. Edge Function for Bot Crawlers: `og-meta`

An edge function at `/functions/v1/og-meta?path=/PNW26` that:
- Reads the `event_settings` for the given page slug.
- Returns an HTML document with correct `<meta>` tags for crawlers.
- This can be pointed to via a redirect rule or used with a lightweight proxy for social sharing links.

**New file:** `supabase/functions/og-meta/index.ts`

### 4. Storage Bucket

Create a `page-meta` public bucket for uploaded favicon and OG images.

**DB migration:** `INSERT INTO storage.buckets (id, name, public) VALUES ('page-meta', 'page-meta', true);` with appropriate RLS policies allowing authenticated users to upload.

### 5. Wire Into Pages

Add `<PageMetaEditor />` and the `usePageMeta` hook to each page that uses `EditableTextProvider`:
- `EventPNW26.tsx` (slug: `pnw26`)
- `EventOutsideDays26.tsx` (slug: `outsidedays26`)
- `EventOutsideDaysCOS.tsx` (slug: `outsidedays26-cos`)
- `GatherDenver.tsx`, `GatherPNW.tsx`, `Events.tsx`, etc.

### Files Changed/Created

| File | Action |
|------|--------|
| `src/components/event/PageMetaEditor.tsx` | New — admin UI for favicon + OG image |
| `src/hooks/usePageMeta.ts` | New — dynamic meta tag updates |
| `supabase/functions/og-meta/index.ts` | New — serves meta tags to bot crawlers |
| Migration for `page-meta` bucket | New |
| `EventPNW26.tsx`, `EventOutsideDays26.tsx`, + other pages | Add `PageMetaEditor` + `usePageMeta` |

