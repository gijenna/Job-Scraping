

# Fix: Generate Branded Card Image for Social Media Previews

## Problem
Currently the `expert-og` edge function sets `og:image` to the expert's raw headshot photo. Social platforms show just the photo with no context about who the person is, their role, or the event. The user wants a fully branded card image — matching the Polaroid-style expert card design — with name, title, company, field of work, and event branding.

## Approach

Use the **Lovable AI image generation** capability (Gemini Flash Image model) to generate a branded card image on-the-fly inside the `expert-og` edge function. The function will:

1. Fetch expert data from the database
2. Call the Lovable AI gateway with a prompt describing the card layout, passing the expert's photo as input
3. Upload the resulting image to the `event-photos` storage bucket (cached by slug so it's only generated once)
4. Use the public storage URL as the `og:image`

**Why AI image generation?** Deno edge functions don't have access to Canvas/Sharp/Puppeteer for server-side image rendering. The AI model can composite the expert's photo with text overlay in a branded layout.

### Card image design prompt will include:
- Teal background (`#1a3a3a`) with the expert's B&W photo in a cream Polaroid frame
- Expert name in coral, title + company in yellow
- Field of work badge
- Event title and "Basecamp Outdoor" branding at the bottom
- 1200×630px landscape format (optimal for social platforms)

### Caching strategy:
- Before generating, check if `event-photos/{slug}-og-card.png` already exists in storage
- If yes, use the existing URL (skip generation)
- If no, generate, upload, then use
- When expert updates their profile, delete the cached image so it regenerates on next share

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/expert-og/index.ts` | Add AI card generation, storage caching, fix Content-Type header, add image dimension meta tags |

## Technical Details

- Uses `LOVABLE_API_KEY` secret (already configured) to call `ai.gateway.lovable.dev`
- Uses `event-photos` bucket (already public) for cached card images
- Generated image is 1200×630px PNG — optimal for LinkedIn/Facebook/Twitter
- `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/png` meta tags added
- Expert's photo is passed to the model as an input image for compositing
- Fallback: if AI generation fails, falls back to the expert's raw photo URL

