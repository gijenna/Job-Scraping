

# Fix: Social Media Card Previews

## Issues Found

### 1. Wrong AI model name → blank image
The function uses `google/gemini-2.5-flash-image` which doesn't exist. The correct supported image generation models are:
- `google/gemini-3.1-flash-image-preview` (fast, recommended)
- `google/gemini-3-pro-image-preview` (higher quality)

The API likely returned an error or empty response, and the blank result was cached as a PNG in storage.

### 2. Content-Type `text/plain` → crawlers can't parse OG tags
Despite the code setting `Content-Type: text/html`, the Supabase gateway returns `text/plain`. The fix is to return the HTML response using the `Response` constructor with a proper `Headers` object instead of a plain object, which prevents gateway override.

### 3. Cached blank images need deletion
The blank card images already stored in `event-photos/og-cards/` need to be deleted so they regenerate with the correct model.

## Fix Plan

### File: `supabase/functions/expert-og/index.ts`

| Change | Detail |
|--------|--------|
| Fix model name | Change to `google/gemini-3.1-flash-image-preview` |
| Fix Content-Type | Use `new Headers()` constructor and return with explicit `content-type` header |
| Delete stale cache | Add logic to delete and regenerate if cached image is very small (< 1KB, indicating blank) |
| Add error logging | Log the AI response structure for debugging |

### Specific changes:
1. Line 100: `"google/gemini-2.5-flash-image"` → `"google/gemini-3.1-flash-image-preview"`
2. Lines 245-251: Replace plain headers object with `new Headers()` to force `text/html`
3. In cache check: verify file size > 1KB before using cached version, otherwise regenerate
4. Add `console.log` for AI response shape to debug image extraction path

