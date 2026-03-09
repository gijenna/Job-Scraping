

## Problem

All generated invite/copy links use `window.location.origin`, which resolves to the Lovable **preview URL** (requires login). External users (experts, brand reps) cannot access these links.

Your published URL is: **https://sponsor-attract-hub.lovable.app**

## Plan

Create a shared constant for the published base URL and replace all `window.location.origin` usages across the three affected files:

1. **`src/lib/utils.ts`** — Add a constant:
   ```ts
   export const PUBLISHED_BASE_URL = "https://sponsor-attract-hub.lovable.app";
   ```

2. **`src/components/experts/AddExpertDialog.tsx`** — Replace `window.location.origin` with `PUBLISHED_BASE_URL` in the `generateLink` function (line ~31-34).

3. **`src/components/experts/ExpertCRM.tsx`** — Replace all `window.location.origin` references (~lines 71, 74, 181) with `PUBLISHED_BASE_URL`.

4. **`src/components/experts/BrandDashboard.tsx`** — Replace all `window.location.origin` references (~lines 55, 163, 176) with `PUBLISHED_BASE_URL`.

This ensures every generated link, displayed URL, copied URL, and "Go to" link points to the publicly accessible published site.

