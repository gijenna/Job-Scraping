
Goal: fix three regressions in Featured Teams on /PNW26 (and mirror on Denver pages): bubble links not opening, brand-box CTA not user-friendly/clickable, and featured-brand card expansion still rendering too thin.

What’s causing the issues right now
1) Bubble links are dropped before render:
- `EventPNW26.tsx`, `EventOutsideDays26.tsx`, `EventOutsideDaysCOS.tsx` build `bubbleBrands` without `url`, so `CascadingLogoBubbles` receives no links.
2) Many saved URLs are missing protocol (`https://`), so anchors navigate as relative paths and appear broken.
3) Featured brand cards in `BrandUmbrellaSection.tsx` still use local `expandedCards` + inline `<ExpertCard />` in narrow grid cells, which forces thin/squished expansion and bypasses the modal expansion behavior already implemented in `ExpertCardMinimal`.

Implementation plan

1) Pass bubble URLs end-to-end
- Update `bubbleBrands` mapping in:
  - `src/pages/EventPNW26.tsx`
  - `src/pages/EventOutsideDays26.tsx`
  - `src/pages/EventOutsideDaysCOS.tsx`
- Include `url: l.url || null` in mapped objects.
- Update `FeaturedTeamsSection` prop typing to include optional `url`.

2) Normalize external links before rendering
- Add a small URL normalizer (http/https guard) and apply it in:
  - `src/components/event/CascadingLogoBubbles.tsx` (bubble links)
  - `src/components/event/BrandUmbrellaSection.tsx` (brand box site links)
- Behavior:
  - If URL has no protocol, prepend `https://`.
  - If URL is empty/invalid after trim, render non-link fallback.

3) Make featured brand CTA guest-friendly
- In `BrandUmbrellaSection.tsx`, replace current guest link label with:
  - text: `Visit our site`
  - keep external-link icon and `target="_blank" rel="noopener noreferrer"`.
- Keep admin editable fields unchanged.

4) Fix featured-brand card expansion to true Card A modal size
- In `BrandUmbrellaSection.tsx`:
  - Remove `expandedCards` state and `toggleCard` logic entirely.
  - Remove inline expanded `<ExpertCard expert={expert} expanded />` path.
  - Render only `ExpertCardMinimal` for each expert in umbrella grid (no parent onClick wrapper that hijacks clicks).
- This ensures clicks use `ExpertCardMinimal`’s existing fixed overlay modal, preserving regular Card A proportions (not constrained by grid column width).

5) Console warning cleanup (quick hardening)
- Update `src/components/ui/badge.tsx` to `React.forwardRef` to prevent ref warnings when animation/layout libs pass refs through composed trees.

Technical details
- Files to edit:
  - `src/pages/EventPNW26.tsx`
  - `src/pages/EventOutsideDays26.tsx`
  - `src/pages/EventOutsideDaysCOS.tsx`
  - `src/components/event/FeaturedTeamsSection.tsx`
  - `src/components/event/CascadingLogoBubbles.tsx`
  - `src/components/event/BrandUmbrellaSection.tsx`
  - `src/components/ui/badge.tsx`
- No database schema or policy changes required.
- No backend function changes required.

Validation checklist
1) Guest view: bubble logos with URLs open correct external sites in new tabs (including URLs entered as `domain.com`).
2) Guest view: each featured brand box shows `Visit our site` (not raw URL text), and link opens externally.
3) Featured brand expert click opens centered Card A modal with consistent width/height (not thin/squished).
4) Close behavior still works (X button + backdrop click).
5) Re-check console for removed/ref-reduced warnings during expand/collapse interactions.
