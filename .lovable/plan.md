

# Add Privacy Policy, Terms & Conditions, and Footer Links

## Overview

Create GDPR-compliant Privacy Policy and Terms & Conditions pages, then add a minimal footer with links to both on all public-facing pages. Since you collect emails via Typeform for event communications only (not selling data), the policies will reflect that limited, lawful use.

## Pages to Create

### `/privacy` — Privacy Policy
Standard GDPR-compliant privacy policy covering:
- **Data controller**: Basecamp Outdoor (your entity)
- **Data collected**: Name, email, professional info submitted via event registration and expert intake forms
- **Lawful basis**: Legitimate interest (event communication) and consent (form submission)
- **Purpose**: Communicating about events the user registered for or inquired about — explicitly stating data is **not sold or shared** with third parties
- **Data retention**: Kept for the duration of event communication; users can request deletion
- **User rights**: Access, rectification, erasure, portability, objection (GDPR Articles 15-21)
- **Contact**: Email address for data requests
- **Cookies**: Minimal/no tracking cookies disclosure

### `/terms` — Terms & Conditions (route `/T&C` redirects here)
Standard terms covering:
- Service description (event discovery and registration platform)
- User responsibilities
- Intellectual property
- Limitation of liability
- Governing law
- Changes to terms

## Footer Component

A reusable `SiteFooter` component added to the bottom of all public pages:
- Minimal design matching the teal/cream aesthetic
- Links: Privacy Policy | Terms & Conditions
- "© 2026 Basecamp Outdoor" copyright line

### Pages receiving the footer:
- `Events.tsx` (home)
- `EventPNW26.tsx`
- `EventOutsideDays26.tsx`
- `GatherPNW.tsx`
- `GatherDenver.tsx`
- `ExpertInvite.tsx`
- `BrandRepInvite.tsx`
- `CityExperts.tsx`
- `ExpertDetail.tsx`

## Files

| File | Change |
|------|--------|
| `src/pages/PrivacyPolicy.tsx` | New — full privacy policy page |
| `src/pages/TermsConditions.tsx` | New — full T&C page |
| `src/components/SiteFooter.tsx` | New — reusable footer with links |
| `src/App.tsx` | Add routes: `/privacy`, `/T&C` |
| 9 page files above | Add `<SiteFooter />` at bottom |

