# OutsideDays26 Career Fair Thank-You Email - Updates

Edits target `supabase/functions/_shared/transactional-email-templates/outsidedays26-thanks.tsx` and the sponsor-override logic in `supabase/functions/send-outsidedays26-thanks/index.ts`.

## 1. Upload new assets to `email-assets` bucket
- `outsidedays26-thanks/edges-first-logo.png` (the navy "E" logo provided)
- `outsidedays26-thanks/connect-card-example.png` (Chelcie Hunt card screenshot)
- Reuse existing `outsidedays26-sponsor/AnthonyMarz_Basecamp-043.jpg` for the "We're Hiring" hero banner.

## 2. Add a brand URL/logo override map in `send-outsidedays26-thanks/index.ts`
Since brand chips are sourced from `event_map_brands` at send time, add a lookup applied after the DB fetch that overrides `website_url` (and, where needed, `logo_url`) for these brands without touching the public event map:

| Brand (match by lowercased name) | website_url |
|---|---|
| Department of Natural Resources / CO DNR | https://dnr.colorado.gov/careers |
| Alterra Mountain Company, A Basin, Winter Park, Steamboat Resort | https://www.alterramtn.co/en/careers |
| Aspen / Aspen One | https://aspen.com/careers/ |
| ALTRA, Smartwool, Vans, Icebreaker, The North Face, VF, VF Corporation, Timberland, Jansport | https://www.vfc.com/careers |
| Cotopaxi | https://www.cotopaxi.com/pages/jobs?srsltid=AfmBOor3_BFljUoPHjHFnCZ8yvnSVWc8nAoj5pXap-s_s5d16BOxHSZG |
| Maine Outdoor Brands | https://maineoutdoorbrands.com/job-board/ |
| REI | https://www.rei.jobs/careers-home |
| Outcrop Wilderness | https://www.outcropwilderness.com/ |
| ing Outdoors / Writing Outdoors | (note: user message cuts off at "Write ingOutdoors"; treat as `ing Outdoors` and leave existing URL — I'll flag this in the response) |
| Edges First | https://edgesfirst.co/ (with uploaded logo) |

Also: filter out `Oakley` from the brand list before passing to the template.

Apply the same overrides to `previewData.sponsors` in the template so admin preview matches sends.

## 3. Template layout/content changes

Section order after the intro becomes:
1. **KUMA giveaway** (unchanged copy)
2. **Basecampjobs.com / "Want to work, hire, or collab" promo** (moved up to sit directly under KUMA)
3. **Keep the conversations going** — add a left column with the uploaded Chelcie Hunt card image and caption *"Here's an example of what employers see"*; existing copy + Connect button stay in the right column.
4. **Edges First spotlight** (Kelly Bleck) — add the Edges First navy logo next to/under Kelly's photo column.
5. Photos gallery (unchanged)
6. Outside thank-you (unchanged)
7. **We're Hiring hero banner** — insert the `AnthonyMarz_Basecamp-043.jpg` banner image just above the brands grid (same styling as the sponsor email's `heroBannerWrap` / `heroBanner`).
8. Brands grid — Oakley removed; Edges First added to `VIBES` with `logo_url` pointing to the uploaded Edges First PNG so the bubble renders the real logo; also ensure Edges First appears in the company brand list with the same logo + edgesfirst.co URL.
9. Sign-off (unchanged)

## 4. Send a test to Jenna
Invoke `send-outsidedays26-thanks` with `mode: "test"` to render against live DB data and confirm overrides + new images render correctly.

## Open question
The original message ends with "Write ingOutdoors" — likely a typo for "ing Outdoors" or possibly a different brand "Writing Outdoors". I'll keep the existing `ing Outdoors` entry as-is and flag this for confirmation in the response, rather than guess a URL.
