

# Admin Edit for Brand Rep Cards + Logo Initials Fallback

## Two changes

### 1. Admin edit button for brand rep cards

Currently the BrandDashboard shows brand cards with copy/delete actions but no way to edit the underlying expert record (name, company, photo, etc.). Add an **Edit** button that opens a dialog with the `ExpertIntakeForm` pre-filled with the brand rep's data, allowing admins to modify any field.

**Files changed:**
- `src/components/experts/BrandDashboard.tsx` — add Edit (pencil) icon button per brand card that opens a Dialog containing `ExpertIntakeForm` pre-populated with the expert's data. On save, refresh the list.

Also add edit capability in the main ExpertCRM table — an Edit button per row that opens the same dialog.

- `src/components/experts/ExpertCRM.tsx` — add Edit (pencil) button in the Actions column that opens a Dialog with `ExpertIntakeForm` for that expert.

### 2. Company logo initials fallback

When a company logo fails to load (favicon not found), instead of hiding the element entirely, show a small circle with the company's initials using Basecamp brand colors.

Replace the `onError` handler pattern across all card components. Instead of `style.display = 'none'`, replace the `<img>` with a colored initials badge (coral background `#ED7660`, cream text `#F5E6D3` — or teal background `#19363B` with yellow text `#E1B624` for variety).

Create a small reusable component `CompanyLogoWithFallback` that:
- Renders the favicon `<img>` 
- On error, swaps to a div with initials (first letter of each word, max 2 chars)
- Uses Basecamp colors: `bg-events-coral` with `text-events-cream` for current company, `bg-events-teal` with `text-events-yellow` for previous companies

**Files changed:**
- `src/components/experts/CompanyLogoWithFallback.tsx` — **New** reusable component
- `src/components/experts/ExpertCard.tsx` — replace `<img>` + `onError` with `CompanyLogoWithFallback`
- `src/components/experts/ExpertCardMinimal.tsx` — same
- `src/components/experts/ExpertCardCompact.tsx` — same  
- `src/components/experts/ExpertLivePreview.tsx` — same
- `src/components/event/RegistrantBrands.tsx` — same pattern for brand logos that fail

## Summary

| File | Change |
|------|--------|
| `src/components/experts/CompanyLogoWithFallback.tsx` | **New** — img with initials fallback |
| `src/components/experts/BrandDashboard.tsx` | Add Edit button + Dialog with ExpertIntakeForm |
| `src/components/experts/ExpertCRM.tsx` | Add Edit button + Dialog with ExpertIntakeForm |
| `src/components/experts/ExpertCard.tsx` | Use CompanyLogoWithFallback |
| `src/components/experts/ExpertCardMinimal.tsx` | Use CompanyLogoWithFallback |
| `src/components/experts/ExpertCardCompact.tsx` | Use CompanyLogoWithFallback |
| `src/components/experts/ExpertLivePreview.tsx` | Use CompanyLogoWithFallback |
| `src/components/event/RegistrantBrands.tsx` | Use initials fallback for brand logos |

No database changes needed.

