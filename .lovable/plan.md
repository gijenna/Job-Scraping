## Goal

Decouple share previews so:
- **Afterparty** invites keep their current preview (Basecamp Match / Out of Office card) — no change.
- **All Denver** brand-rep and industry-expert invites use the uploaded "Basecamp Outdoor @ Outside Days · May 28, 2026 · Denver" hero image as their share preview.
- **Portland & Minneapolis** expert/brand-rep invites continue to use the existing auto-generated per-expert V3 01 cards.

## How it works today

- Afterparty share link → `og-meta` edge function → reads `page_og_image` from `event_settings` (slug `afterparty`). Independent system. **Untouched.**
- Expert / brand-rep share link → `expert-og` edge function (`supabase/functions/expert-og/index.ts`) → generates a per-expert PNG (V3 01 dark-teal card) per `(slug, city)` and caches it in storage at `og-cards/{slug}-{city}-og-card.png`.

## Changes

### 1. Save the Outside Days Denver hero as a static asset
- Copy the uploaded screenshot to `public/og-denver-outside-days.png` so it serves at `https://sponsor-attract-hub.lovable.app/og-denver-outside-days.png` (a stable URL the edge function can return).

### 2. Edit `supabase/functions/expert-og/index.ts`
- Add a small lookup of city-level override images:
  ```ts
  const CITY_OG_OVERRIDE: Record<string, string> = {
    denver: "https://sponsor-attract-hub.lovable.app/og-denver-outside-days.png",
  };
  ```
- In the request handler, **before** calling `getOrGenerateOgCard`, check `CITY_OG_OVERRIDE[city]`. If set, use that URL as `ogImage` and skip generation entirely. This applies to both `industry_expert` and `brand_rep` types in Denver.
- The redirect behavior for humans (302 to event page with `?expert=` / `?brand=` param) stays exactly the same — only the meta image crawlers see changes.
- Portland and Minneapolis fall through to existing logic unchanged.

### 3. Afterparty preview
- No code touched. `og-meta` continues to serve the afterparty image from `event_settings`.

## Verification

After deploy, validate share previews with the Facebook / LinkedIn debugger or a quick `curl -A "facebookexternalhit/1.1" <share-url>`:
- `…/functions/v1/expert-og/<slug>/denver` → `<meta property="og:image">` should be the new Outside Days Denver image.
- `…/functions/v1/expert-og/<slug>/portland` → should still be the per-expert V3 01 generated card.
- `/afterparty` share preview → unchanged.

## Notes

- No DB migration needed.
- No cache to clear (Denver previews bypass the cached PNGs entirely; the previously generated Denver cards in storage can stay — they simply won't be referenced anymore).
- If you later want to override Portland or MN the same way, just add another entry to `CITY_OG_OVERRIDE`.
