

## Redesign `BestDayRegistrantSpotlight.tsx` — Agency-Quality Title Sponsor Feature

### Problems with Current Version
- Uses wrong logo (square social promo image, not the sun wordmark)
- No section title ("A Proudly Sober Event")
- Wrong North Face quote (paraphrased, not the real one the user provided)
- All 4 photos dumped in a generic grid
- Too much vertical space, not enough impact
- Best Day not featured as a title sponsor

### Changes — Single File: `src/components/event/BestDayRegistrantSpotlight.tsx`

**Logo**: Replace the square `916_IG_Feed_Ads` image with the actual Best Day Brewing sun wordmark logo. The header logo on their site is an inline SVG, but they have this usable asset: `https://bestdaybrewing.com/cdn/shop/files/HeaderImageBestDay.png` for branding. For the logo itself, I'll use the Clearbit-style approach or the closest CDN match. Since the logo SVG isn't directly linkable, I'll recreate the key visual: use the horizontal text + sun icon from their OG/social presence, or use `https://bestdaybrewing.com/cdn/shop/files/916_IG_Feed_Ads_1200_x_1200_px_3.png` BUT styled as a small circular badge alongside a text treatment of "BEST DAY BREWING" in their brand font/color (#4d6d7e).

Actually — better approach: I'll use the logo.clearbit.com service (`https://logo.clearbit.com/bestdaybrewing.com`) which typically returns their favicon/logo, or I'll embed the Best Day logo as an SVG directly in the component, recreating the sun starburst + wordmark from the screenshot.

**Redesigned Layout** (compact, two-column, agency feel):

```text
┌─────────────────────────────────────────────┐
│  ☀ BEST DAY BREWING (logo, large, centered) │
│                                             │
│  "A Proudly Sober Event"  (section title)   │
│                                             │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │              │  │ Vibe line + why it    │ │
│  │  Photo 1     │  │ matters brief copy    │ │
│  │  (event)     │  │                       │ │
│  │              │  │ "On a personal note..." │
│  │              │  │ — Recruiter, TNF      │ │
│  └──────────────┘  └──────────────────────┘ │
│                                             │
│  ┌──────────────────────────────────────────┐│
│  │  Photo 4 (wide, event)                   ││
│  └──────────────────────────────────────────┘│
│                                             │
│  Explore Best Day Brewing →                 │
└─────────────────────────────────────────────┘
```

- Use only photos 1 and 4 (the two end photos)
- Photo 1: left column, tall, paired with quote content on right
- Photo 4: full-width cinematic strip below
- The real North Face quote (the personal sobriety one the user provided)
- Vibe line from SoberEventSection kept brief
- Best Day Brewing featured prominently with their brand colors (#4d6d7e dusty blue, #F5F0E8 cream)
- Less vertical space overall — tighter padding, no filler cards

**Best Day Feature Copy**: Brief line about what makes them special — "Born in Northern California, Best Day Brewing crafts the world's best-tasting non-alcoholic beer for the adventure-seeking, fun-loving outdoor community." (pulled from their actual site copy)

### Technical Details

Single file edit: `src/components/event/BestDayRegistrantSpotlight.tsx`

- Replace `BEST_DAY_LOGO` URL — will try `https://logo.clearbit.com/bestdaybrewing.com` for the clean logo, falling back to recreating the wordmark with styled text + their sun icon
- Import only `bestdayEvent1` and `bestdayEvent4`
- Remove the 4-photo grid
- Add "A Proudly Sober Event" as a styled `h2` title
- Replace the paraphrased quote with the real North Face recruiter quote
- Two-column layout: photo left, quote + copy right (stacks on mobile)
- Full-width photo strip below with photo 4
- Tighter padding: `py-12 md:py-16` instead of `py-16 md:py-20`
- Add brief Best Day description line featuring their brand story

No other files need to change — `BestDayExample.tsx` already imports and uses this component correctly.

