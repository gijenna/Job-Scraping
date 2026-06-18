## /minneapolis26 restructure

### 1. Hero (MNHero.tsx)
- Remove the negative margins (`-mb-8 md:-mb-10`) that overlap the lockup onto the kicker.
- Use explicit, balanced spacing: ~16px between lockup and kicker, ~24px between kicker/headline/sub/date.
- Add `pb-20 md:pb-28` so the date line breathes off the bottom edge of the photo (not flush to image edge).
- Lockup max-width stays 360px; no overlap.

### 2. New "How It Works" section (replaces MNTwoSessions + MNORGatherings)
Create `MNHowItWorks.tsx`. Cream background, dark forest text. Structure:

- Eyebrow: "HOW IT WORKS"
- Headline: "Two Gatherings. 100 seats each. Here's the play."
- 4-step flow (numbered, all admin-editable):
  1. **Pick your session** — two compact session cards inline (Thu Aug 20, 3–5 PM Happy Hour / Fri Aug 21, 10 AM–12 PM Women's Brunch), each with its own Register button. First 100 per session.
  2. **Plan your conversations** — browse the expert cards, pick who you want to meet. Link → /MNexperts.
  3. **Grab your OR guest pass** — sent day-of, no OR Summer Market badge needed.
  4. **Walk into the Basecamp Outdoor Lounge** — chat with experts, see old friends, meet the room.
- Closing line folds in the OR Gatherings context (presented with Outdoor Retailer + press link) so the standalone block can be cut.

### 3. Watercolor scene illustration
Generate one wide watercolor/gouache illustration of the Basecamp Outdoor Lounge inside the Minneapolis Convention Center:
- Loose watercolor, warm earthy palette (cream/forest/coral/sage matching site).
- Airy indoor lounge with industrial windows, plants, a wooden "OR GATHERINGS" hanging sign.
- GCI Outdoor Grab-and-Go Rockers in small conversation clusters (using the linked product silhouette).
- High-top tables with people chatting.
- Hanging category signs above zones: "MARKETING", "OPERATIONS", "PRODUCT", "RETAIL", "MEDIA".
- Beside several rockers, easel-style "expert cards" with real past Denver/PNW expert names + roles (I'll pull 5–6 from past_experts data before generating).
- Embedded full-bleed inside How It Works, above the steps.

### 4. Three Kinds of People (MNWhatIsThis.tsx)
Rewrite the three cards. Equal pill widths, new labels and copy:

| Card | Pill | Headline | Body |
|---|---|---|---|
| 1 | LEVEL UP | Already in the industry, ready to level up. | Skip the cold-email game. The people who can shortcut your next move are in this room. |
| 2 | BREAK IN | Mid-career, industry-curious. | You've got the skills. You need the network and the intel. Two hours, the right room, real conversations. |
| 3 | NO FOMO | Curious about the OR show. | Not a buyer, not press, not invited? Doesn't matter. Hug your friends. See what the show is actually about. Walk in free. |

All pills 2 words / identical padding so they line up across the cards. Section sub-headline: "Three reasons people walk in." All copy stays admin-editable.

### 5. Cuts & reorder
- **Remove** `MNORGatherings` from the page (content folds into How It Works closing line).
- **Remove** `MNTwoSessions` from the page (folded into How It Works step 1).
- New section order: MNHero → MNWhatIsThis → MNHowItWorks → MNExpertGrid → MNPastExperts → MNGallery → MNSponsors → MNFinalCTA.

### Technical notes
- New file: `src/components/minneapolis/MNHowItWorks.tsx` — uses `EditableText`/`EditableLink` for every string and URL.
- New asset: `src/assets/mn26/lounge-watercolor.png.asset.json` via image generation (premium tier for fidelity + legible signage text).
- Edits: `MNHero.tsx` (spacing), `MNWhatIsThis.tsx` (copy + pill widths), `EventMinneapolis26.tsx` (sections array).
- No DB migrations. New copy uses fresh `event_settings` keys with sensible defaults so admin can edit immediately.
