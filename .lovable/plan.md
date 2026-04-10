

## Fix Brand Square Info Visibility

**Problem**: In the "Meet the Teams" brand squares:
1. The hiring blurb is truncated to 1 line (`line-clamp-1`) for non-admin viewers
2. The "Visit our site" link and rep count are hidden from admins (only shown to `!isAdmin`)
3. Admins only see the editable fields, not the rendered output alongside them

**Changes — single file: `src/components/event/BrandUmbrellaSection.tsx`**

1. **Remove `line-clamp-1`** from the hiring blurb paragraph (line 112) so the full text is always visible
2. **Always show rep count and "Visit our site" link** — remove the `!isAdmin` conditions so admins can also see the rendered rep count and site link (the admin editable fields stay below as they are)
3. Keep the admin editable fields for `careersKey` and `hiringKey` so admins can still edit, but show the guest-visible rendered versions above them too

This ensures both admins and visitors always see the full blurb, rep count, and site link — whether the box is expanded or collapsed.

