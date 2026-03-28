

## Plan: Generate 3 Real Expert Cards in Round 2 #9 Style (with tweaks)

### Design modifications from round2_09 (Gradient Sunset)

1. **Replace fire icon with actual Basecamp campfire logo** (uploaded `Untitled_design_1-3.png`)
2. **Bottom text**: "Register free · basecampoutdoorevents.com"
3. **Brand polaroids**: Mini tilted polaroid frames for each previous company, arranged left-to-right as a career journey (earliest job on left, current company on right). More companies = slightly smaller polaroids. Each polaroid contains the company logo.
4. **Current company logo**: Small logo next to name/title area in the main polaroid
5. **One card in dark emerald green** (`#19363B`) instead of black background so you can compare

### 3 Real Experts to render

| Expert | Title | Company | Previous | Years | Ask Me About |
|--------|-------|---------|----------|-------|-------------|
| Emmy Negrin | Head of Community Impact | Columbia Sportswear | adidas, Discord, Yahoo, Outward Bound | 15 | Community Impact, Leadership Coaching, Wilderness Guiding |
| Michael Chamberlain-Torres | Sr. Recruiter | Patagonia | Patagonia, Marriott | 5 | Purposeful Business |
| Ellie Rivkin | Material Developer | Columbia | Gap, Wool&, Freelance | 16 | All things textiles. Size inclusive, sustainable apparel design. |

### Implementation steps

1. Copy the AI image generation script to /tmp
2. Generate 3 cards — Emmy (black bg), Michael (dark emerald `#19363B` bg), Ellie (black bg)
3. Each prompt will specify:
   - Round 2 #9 gradient sunset style as base
   - Actual Basecamp campfire circle logo (from uploaded image) instead of fire icon
   - "Register free · basecampoutdoorevents.com" at bottom
   - Career journey polaroids (left = first job, right = current) with real company logos
   - Small current company logo near name/title in main polaroid
   - Real expert data (name, title, company, years, ask-me-about)
   - "Network with me in Portland"
   - "[X] years in the outdoor industry" clearly labeled
4. Save to `/mnt/documents/` as `expert_emmy.png`, `expert_michael.png`, `expert_ellie.png`

### No code changes — mockup generation only

