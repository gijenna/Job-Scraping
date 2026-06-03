## Goal

Send a branded HTML email to the 199 checked-in Denver/Oakley RiNo afterparty attendees with: photo gallery link, KUMA chair giveaway prompt (reply-all), Basecamp Jobs + Popfly promo codes, sponsor thank-yous (all hyperlinked to Instagram, no visible URLs), music/food shout-outs, swag bag list, 9pm raffle list, and final Basecamp/Popfly follow CTA. Test first to Jenna, then full send on your approval.

## What gets built

**1. New email template** — `supabase/functions/_shared/transactional-email-templates/afterparty-thanks-giveaway.tsx`
- Subject: "One last giveaway from Basecamp x Popfly! Open meeee for gifties."
- Built with React Email components, brand colors (Dark Teal, Coral, Cream), Josefin Sans
- All brand names are clickable links (website + Instagram handle styled as link, no raw URLs shown)
- Embedded sections: hero copy, Photos link, KUMA chair giveaway block with chair image, Jobs/Popfly promo codes, Sponsors grid, Bevys grid (with the 8 IG links you supplied), Music (DJ Homie) + Food (Joey Parm) shout-out, Swag bags, 9pm raffle list, P.S. follow Basecamp + Popfly
- Registered in `registry.ts`

**2. Images hosted in `email-assets` bucket**
- KUMA Backtrack chair (pulled from kumaoutdoorgear.com)
- 3-5 event photos that you upload in chat

**3. New send edge function** — `supabase/functions/send-afterparty-thanks/index.ts`
- Admin-only (verifies caller is an admin user)
- Accepts `{ mode: 'test' | 'all' }`
  - `test`: sends only to jenna@wearetheoutdoorindustry.com
  - `all`: queries `afterparty_attendees` where `checked_in_at IS NOT NULL AND email IS NOT NULL`, dedupes by email, invokes `send-transactional-email` for each with a stable idempotency key (`afterparty-thanks-{attendee_id}`) so retries don't double-send
- Returns count queued

**4. Admin UI button** — small "Send afterparty thank-you email" card in `AfterPartyAdmin` with two buttons: "Send test to Jenna" and "Send to all checked-in (199)". The full-send button requires a typed confirmation.

## Flow

1. You upload event photos in your next message
2. I host photos + KUMA chair image, build the template, deploy
3. I trigger the test send to jenna@wearetheoutdoorindustry.com
4. You confirm it looks right
5. You click "Send to all checked-in" in the admin UI (or tell me to fire it)

## Notes

- Existing send infra (queue, suppression, unsubscribe footer) is reused, so unsubscribed addresses are skipped automatically and the required unsubscribe footer is appended.
- "Reply all" works because the email's reply-to is jenna@wearetheoutdoorindustry.com; recipients hitting Reply will go to Jenna (true reply-all to the whole list isn't possible since each recipient gets an individual send, which is correct for deliverability).
- No em dashes anywhere in the copy.
- One small caveat: 199 sends will count against your monthly email quota. If you're still tight on quota, top up Cloud & AI balance before the full send.
