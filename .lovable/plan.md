

## Fix: Six Moon Designs logo missing in brand umbrella card

**Problem**: The expandable brand cards in `BrandUmbrellaSection` use `getCompanyLogoUrl()` from `src/lib/expert-types.ts` to find logos. This function checks a hardcoded `COMPANY_DOMAINS` dictionary — "Six Moon Designs" isn't listed, so it returns `null` and shows initials ("SM") instead of the logo.

The bubble/partner logos work because they pull `logo_url` directly from the `event_logos` database table, bypassing this function entirely.

**Fix**: Add `'six moon designs': 'sixmoondesigns.com'` to the `COMPANY_DOMAINS` map in `src/lib/expert-types.ts`.

### File changed
- **`src/lib/expert-types.ts`** — Add one line to the `COMPANY_DOMAINS` record:
  ```
  'six moon designs': 'sixmoondesigns.com',
  ```

This is a one-line change. The Google Favicon API will then resolve the logo from `sixmoondesigns.com`, matching what already displays in the bubble section.

