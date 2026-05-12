## What is happening

- The production HTML fallback in `index.html` is hardcoded to the After Party Open Graph and Twitter metadata.
- Social crawlers are currently receiving that static HTML for `/denverreps/jenna-celmer` and `/outsidedays26`, so they show the After Party preview before any React metadata can run.
- The existing metadata helper function only knows a few exact paths. It does not cover `/denverreps/:name`, and `/outsidedays26` currently has no `page_og_*` image/title settings in the database.

## Plan

1. **Remove the After Party metadata from the global fallback**
   - Change `index.html` to use neutral Basecamp Outdoor defaults instead of `/afterparty-og.png`.
   - This prevents non-After Party pages from inheriting the After Party card when crawlers hit the app shell directly.

2. **Constrain After Party metadata to After Party routes only**
   - Update the `og-meta` backend function so only `/afterparty`, `/afterparty/:name`, `/afterpartyoakley`, `/afterpartyoakley/:name`, `/guests`, and `/guestsoakley` resolve to the `afterparty` metadata.
   - Add route handling for `/denverreps` and `/denverreps/:name` so those get Denver brand rep metadata, not After Party metadata.
   - Keep existing event and `/e/:eventId` behavior intact.

3. **Set the correct share metadata values**
   - Add or update `event_settings` values for:
     - `outsidedays26`: title similar to `The outdoor industry's favorite career event`, with the existing relevant Outside Days image.
     - `denverreps`: title similar to `Fill out your card for Outside Days`, with the same relevant Outside Days image unless there is already a better Denver rep card asset available.
   - Do not alter unrelated page copy or auth behavior.

4. **Deploy and verify**
   - Deploy the updated metadata function.
   - Test crawler responses for:
     - `https://basecampoutdoorevents.com/outsidedays26`
     - `https://basecampoutdoorevents.com/denverreps/jenna-celmer`
     - `https://basecampoutdoorevents.com/afterparty`
   - Confirm the first two no longer include `afterparty-og.png`, and After Party pages still do.