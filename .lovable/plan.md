

# Add Company Domain/URL Field for Expert Logo Resolution

## Problem
The `getCompanyLogoUrl` function uses a hardcoded domain map + a naive guess for unknown companies. Many company logos fail to load because the guessed domain is wrong. You want to add a domain/URL field per company (like the event logos system) so logos always resolve.

## Solution

### 1. Database: Add `company_domains` column to `industry_experts`

Add a `jsonb` column `company_domains` that stores a map of company name → domain, e.g.:
```json
{"Rab": "rab.equipment", "Mystery Ranch": "mysteryranch.com"}
```

This covers both `current_company` and `previous_companies` in one field.

### 2. Update `getCompanyLogoUrl` to accept an optional domain override map

Modify the function signature to `getCompanyLogoUrl(company: string, domainOverrides?: Record<string, string>)`. It checks overrides first, then the hardcoded map, then the guess fallback.

### 3. Update the intake form with domain fields

In `ExpertIntakeForm.tsx`, add a small domain input next to the "Current Company" field and beside each previous company entry. When a company name is typed, if the logo preview fails (using `onError`), show a subtle prompt: "Add domain for logo". Store results in `company_domains`.

### 4. Pass domain overrides through card components

Update `ExpertCard`, `ExpertCardMinimal`, `ExpertLivePreview`, and `ExpertCardCompact` to read `company_domains` from the expert data and pass it to `getCompanyLogoUrl`.

### 5. Update Expert type

Add `company_domains` to the `Expert` interface in `expert-types.ts`.

## Files changed

| File | Change |
|------|--------|
| **Migration** | Add `company_domains jsonb default '{}'` to `industry_experts` |
| `src/lib/expert-types.ts` | Add `company_domains` to `Expert` interface; update `getCompanyLogoUrl` signature |
| `src/components/experts/ExpertIntakeForm.tsx` | Add domain input fields for current + previous companies |
| `src/components/experts/ExpertCard.tsx` | Pass `company_domains` to `getCompanyLogoUrl` |
| `src/components/experts/ExpertCardMinimal.tsx` | Same |
| `src/components/experts/ExpertCardCompact.tsx` | Same |
| `src/components/experts/ExpertLivePreview.tsx` | Same |

