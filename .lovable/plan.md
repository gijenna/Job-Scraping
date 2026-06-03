## What we're building

A new app email for OutsideDays26 career-fair attendees, mirroring the after-party thank-you template but rebuilt for this audience. Recipients come from a CSV upload in the admin tool. Career-fair brands and Edges First content are pulled live from the database so the email always reflects current data.

## 1. New email template

File: `supabase/functions/_shared/transactional-email-templates/outsidedays26-thanks.tsx`

Sections in order, mirroring the afterparty template but with the changes you called out:

1. **Hero / opener** — personal hello, thanks for coming to OutsideDays Career Fair at the U of Outside.
2. **Photo gallery** — 8 photos from the uploaded set, plus inline link to `https://anthonymarz.pixieset.com/basecampoutdooroutsidedays/` and the @anthonymarz tag credit line.
3. **Chair giveaway (revised mechanic)** — to enter, complete the 2-question feedback survey at `https://basecampoutdoor.typeform.com/to/oknPzBB6`. Winner gets the KUMA Backtrack chairs (same image asset as afterparty email). Big yellow CTA button to the Typeform.
4. **Work / Hire / Collab box** — same Basecamp Match block with the two promo codes. **Popfly block removed** per your note.
5. **Connect dashboard reminder** — new block: "Don't forget to message the industry experts and recruiters you chatted with and make sure you come up in employer searches" with CTA button → `/outsidedays26/connect`.
6. **Edges First spotlight** — full-width section styled like the industry-expert cards on `/outsidedays26`. Headline / blurb / photo / CTA pulled from the existing Edges First expert record in `industry_experts` (joined via `expert_city_assignments` to the outsidedays26 city). Pitch leans on "need a website in the next year? talk to Edges First" framing. CTA → her site.
7. **Vibes section** — "Big thanks to our vibes crew" with chips for Outside, Sap's, Edges First, Best Day, and NEMO Equipment (each linked).
8. **Thank you to Outside** — dedicated callout: hosted the career fair and kept it free for everyone, with link to Outside.
9. **Career-fair sponsors grid** — every brand on the OutsideDays26 event map as logo chips (linked to each brand's `website_url`). VF brands listed as separate chips. Beverage sponsors field removed entirely. Uses existing favicon fallback for logos.
10. **P.S. / next stop + sign-off** — short note, signed by Jenna / Basecamp.

Styling matches the afterparty thank-you: cream cards, Dark Teal headings, Coral inline links, Josefin Sans, Yellow giveaway accents, no em dashes.

## 2. Live data fetched at render time

Inside `send-transactional-email` (or pre-fetched by the new sender function and passed as `templateData`), we fetch once per send:

- `event_map_brands` rows where `event_slug = 'outsidedays26'` → name, website_url, logo_url. Each row becomes a sponsor chip. VF-family brands are included individually because they're already separate rows.
- The Edges First record from `industry_experts` (filtered by expert assignment to outsidedays26) → photo_url, name/title, blurb, website_url.

Data is passed in `templateData` so the template stays pure render.

## 3. Admin sender UI (CSV upload)

New section in `src/pages/AdminAfterParty.tsx` (or wherever the existing bulk-send admin lives), labeled "OutsideDays26 thank-you":

- Drag-and-drop / file picker accepting `.csv` with `email,name` columns (name optional).
- Parsed client-side, deduped, lowercased.
- Preview table: row count, first 5 recipients, "Send to me only (test)" and "Send to all (N)" buttons.
- POSTs to a new edge function `send-outsidedays26-thanks` with `{ mode: "test" | "all", recipients: [{email, name}] }`.

## 4. New edge function

`supabase/functions/send-outsidedays26-thanks/index.ts`

- Admin-gated (same pattern as `send-afterparty-thanks`: ADMIN_EMAIL list or `@wearetheoutdoorindustry.com` domain).
- Accepts recipients from the request body (no DB lookup needed since CSV is the source of truth).
- Fetches event_map_brands + Edges First expert once.
- Skips any recipient already sent `outsidedays26-thanks` (status sent/pending) in the last 24h.
- Uses `EdgeRuntime.waitUntil` for background processing in `mode: all`, same fetch-based call to `send-transactional-email` as the afterparty sender.
- Reply-to: jenna@wearetheoutdoorindustry.com.

## 5. Registry + deploy

- Register `outsidedays26-thanks` in `_shared/transactional-email-templates/registry.ts`.
- Deploy `send-transactional-email` and the new `send-outsidedays26-thanks` after edits.

## Open items I'll need from you once it's built

- The CSV of OutsideDays26 attendees (you mentioned you'll provide it).
- Confirmation the Edges First expert record on `/outsidedays26` is the one to spotlight (I'll use whichever record is tagged to that city; if there are multiple I'll ask).
- A quick approve on the draft intro copy before sending — you said you'd rewrite if you don't like it, so I'll send a test to you first.

## Things I'm intentionally NOT doing

- Not touching the existing `send-afterparty-thanks` flow or its template.
- Not pulling recipients from any DB table (CSV only, per your answer).
- No beverage sponsors section.
- No Popfly block in the work/hire/collab card.