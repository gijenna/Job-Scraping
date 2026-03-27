

## Plan: Redesign OG Share Cards — Agency-Quality Design

### Problem
Current SVG cards use boring system fonts (Georgia, Arial), cram content into the middle, have tiny text, and lack visual punch. The Basecamp logo is just typed text. Photos are embedded but the layout doesn't use the 1200x630 space effectively. They don't stand out in a social feed.

### Design Direction

**Layout concept: Bold split-panel with editorial energy**

The card uses the full 1200x630 canvas with a confident, magazine-editorial feel:

```text
┌─────────────────────────────────────────────────────┐
│  ┌──────────┐                                       │
│  │          │   NETWORK WITH ME AT                  │
│  │  PHOTO   │   GATHER PNW ←(large, bold)           │
│  │  (large  │                                       │
│  │  rect,   │   JANE DOE ←(48px+ coral, bold)       │
│  │  rounded │   VP of Marketing · Patagonia          │
│  │  corners)│   12 years in the outdoor industry     │
│  │          │                                       │
│  └──────────┘   Ask me about: trail running...       │
│                                                     │
│  [logo][logo][logo][logo]  ← previous brand logos   │
│                                                     │
│  ████████ BASECAMP OUTDOOR [logo]  ·  Register ████ │
│  ████████ www.basecampoutdoorevents.com         ████ │
└─────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Dark teal (#19363B) background** — stands out in light-colored social feeds (LinkedIn/Facebook are white/light gray), creates drama
- **Photo: large rectangle** (~380x420) with subtle rounded corners, left-aligned, color (not grayscale) — the person IS the hook
- **Name in coral (#ED7660)** at 52px+ — immediately readable
- **CTA "Network with me @" in yellow (#FEE123)** — bright accent that pops against dark teal
- **Title/company in cream (#F5E6D3)** — clean hierarchy
- **Previous brand logos** rendered at 40px with cream circle backgrounds for legibility
- **Bottom bar** slightly lighter teal with the actual Basecamp Outdoor logo (fetched from the published site's `/og-basecamp.png` or the stored asset) plus "Register: www.basecampoutdoorevents.com" in yellow
- **Years in industry** shown as a small accent badge
- **Ask me about** in italic cream, truncated elegantly

**Font strategy:** Use the system fonts that render best in resvg-wasm but with much bolder weights and larger sizes. The current issue is tiny font sizes (13-20px on a 1200px canvas). Bumping to 24-52px range with proper weight hierarchy makes all the difference.

### Implementation

**1. Rewrite `buildSvgCard()` in `supabase/functions/expert-og/index.ts`**

- Dark teal full-bleed background instead of cream
- Photo: large rectangle (left side, ~380x440), rounded corners via clipPath, preserveAspectRatio slice
- Right side: yellow CTA text (28px bold), coral name (52px bold), cream title/company (24px), cream years badge, cream ask-me-about italic
- Previous brand logos: row of 40px circles with white bg at bottom-left area
- Bottom strip: fetch Basecamp logo from published URL (`https://sponsor-attract-hub.lovable.app/og-basecamp.png`) as base64, embed it; add "Register: www.basecampoutdoorevents.com" in yellow
- Proper text wrapping for long names (split into two lines if > ~18 chars)
- Clear old cached cards so regeneration happens

**2. Fix the CRM download flow**

The download currently fails. Update `ExpertCRM.tsx`:
- When downloading, call the edge function with `?generate=1` to force-regenerate with the new design
- Parse the returned `image_url`, then use `window.open()` or create an anchor download — the current fetch-blob approach may be blocked by CORS on storage URLs

### Files to change
- `supabase/functions/expert-og/index.ts` — complete rewrite of `buildSvgCard()` for the new design, fetch Basecamp logo
- `src/components/experts/ExpertCRM.tsx` — fix download to use window.open on the returned URL

### No database changes needed

