
Fix the share-card system to use Card V3 01 as the only template source of truth, then generate just Jeff Stine first for approval.

1. Replace the current `expert-og` card renderer
- Rewrite `supabase/functions/expert-og/index.ts` so it no longer outputs the V1 sunset doodle SVG.
- Rebuild `buildSvgCard()` to match Card V3 01 specifically, using the linked conversation/cards as the reference.
- Preserve the existing data pipeline: real photo, job title, current company, years in industry, ask-me-about text, previous companies, and company-domain overrides.

2. Match Jeff Stine exactly
- Use Jeff’s actual stored inputs already in the database:
  - Sr. Manager, Key Accounts - North America
  - Arc’teryx
  - 11 years in industry
  - Ask-me-about text from his record
  - Previous companies: Icebreaker, Hi-Tec Sports, NASA
  - Real uploaded headshot
- Ensure the career-journey row uses the correct logos from `company_domains`, in the right order.

3. Keep the existing delivery path
- Do not invent a separate preview system.
- Keep the same `expert-og/{slug}/{city}` endpoint and the same `?generate=1` regeneration flow, because the CRM download button already depends on it.
- This guarantees that once Jeff is approved, the same path can later serve all final cards and the CRM download will use the correct image instead of stale old cards.

4. Tighten cache behavior for approval
- Keep force-regenerate clearing old stored files before rebuilding Jeff’s PNG.
- Make sure the generated filename/path remains the same so both share links and download actions pick up the approved V3 01 card.

5. After Jeff is approved
- Bulk-regenerate the rest of the experts/brand reps through the same function.
- Skip and flag anyone missing required final assets instead of generating placeholders.
- Verify Superfeet resolves consistently across all brand reps before the full run.

Technical notes
- Current root cause: `supabase/functions/expert-og/index.ts` is hardcoded to the wrong V1-style renderer, and both CRM downloads and public share links point to that same function.
- Jeff Stine’s Portland assignment is confirmed/published and has complete data, so he is the correct approval target.
- No database migration is needed for this fix; the issue is in rendering/template logic only.
