# Fix: previous-company logos missing on live cards

## Root cause

Two different functions resolve a company logo:

1. **Editing UI** (`BubbleLogoPicker.tsx` → `logoFor`): if no explicit URL override is saved, it **guesses** a domain from the company name (`patagonia` → `patagonia.com`) and asks Google's favicon service for it. This is why logos appear while editing even though the user never typed a URL.

2. **Live cards** (`ExpertCard`, `ExpertCardCompact`, `ExpertLivePreview`, `PrintExpertCard` → `CompanyLogoWithFallback` → `getCompanyLogoUrl` in `src/lib/expert-types.ts`): if there is no domain override **and** the company isn't in the small hardcoded `COMPANY_DOMAINS` map, it returns `null`, so the card falls straight to the coral initials tile.

Result: every expert who relied on the picker's auto-guess (the majority) silently lost their public logos. People who explicitly typed a URL kept them, because that path uses the saved override.

## Fix

Make `getCompanyLogoUrl` use the exact same fallback ladder as the picker so the live card matches what the user sees in edit:

1. Explicit `domainOverrides[company]` (URL the user pasted) — unchanged.
2. Hardcoded `COMPANY_DOMAINS[company]` (curated list) — unchanged.
3. **NEW** guess: `${slug(company)}.com` via Google favicon (`faviconFromUrl` from `src/lib/url-logo.ts`), matching `BubbleLogoPicker.logoFor` exactly.

`CompanyLogoWithFallback` already has an `onError` handler that swaps in coral initials, so when the guessed domain doesn't exist, the live card will degrade to initials just like before, and successful guesses (Patagonia, REI, Nike, etc.) will render the real favicon. No data migration needed.

## File to change
- `src/lib/expert-types.ts` — extend `getCompanyLogoUrl` with the slug-guess fallback.

## Out of scope
- No changes to `BubbleLogoPicker`, the cards, or the database. The picker's behavior stays the same; the live card will simply now mirror it.
- No change to the COMPANY_DOMAINS curated list.
