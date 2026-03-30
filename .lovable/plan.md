

## Redesign BestDayRegistrantSpotlight + Fix "Presented by" Pill

### What's changing

**1. `src/components/event/BestDayRegistrantSpotlight.tsx` — Full rewrite**

Clone Best Day Brewing's homepage aesthetic for this section:
- **Background**: Warm cream `#f6efe7` (their site bg) instead of dark teal gradient
- **Text color**: Dusty blue `#4d6d7e` (their brand primary) instead of cream
- **Yellow accent**: `#f1bd26` (their heading color)
- **Font**: Keep existing fonts but style to match their clean, editorial feel

Layout — two-column, mirroring their homepage:

```text
┌──────────────────────────────────────────────────────┐
│  bg: #f6efe7 (Best Day cream)                        │
│                                                      │
│  ☀ TITLE SPONSOR          [Variety Pack image,       │
│  A Proudly Sober Event     right-aligned, large,     │
│                            from their CDN]           │
│  Vibe line (editable)                                │
│                                                      │
│  ┌─────────────────────┐                             │
│  │ 🟤 photo  "quote    │                             │
│  │          text..."   │                             │
│  │   — Recruiter, TNF  │                             │
│  └─────────────────────┘                             │
│                                                      │
│  Let's have the best day yet.                        │
│                                                      │
│  Explore Best Day Brewing →                          │
└──────────────────────────────────────────────────────┘
```

Key elements:
- **Right side**: Large product image from their CDN: `https://bestdaybrewing.com/cdn/shop/files/Variety_Pack_Press_2.png?v=1774462461&width=1445` (the two variety packs stacked)
- **Left side**: "Title Sponsor" eyebrow in yellow, "A Proudly Sober Event" as h2 in dusty blue, editable vibe line, then testimonial bubble
- **Testimonial bubble**: Rounded card with circular photo (the LinkedIn headshot URL provided), quote text, and "Recruiter, The North Face" attribution — styled like existing testimonials
- **"Let's have the best day yet"**: Tagline in yellow italic, centered below
- **CTA**: "Explore Best Day Brewing →" linking to bestdaybrewing.com
- **No event photos** (user said "don't add my photos")
- All text wrapped in `EditableText` components with `settingKey`s

**2. `src/pages/BestDayExample.tsx` — Fix "Presented by" pill**

- Change `BEST_DAY_LOGO` from the square can image to `https://logo.clearbit.com/bestdaybrewing.com` (their actual logo)
- Wrap the logo in the pill inside an `<a>` tag linking to `https://bestdaybrewing.com`

### Files

| Action | File |
|--------|------|
| Rewrite | `src/components/event/BestDayRegistrantSpotlight.tsx` |
| Edit | `src/pages/BestDayExample.tsx` — fix logo URL + add hyperlink on pill |

