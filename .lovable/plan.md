# Mobile UX Fixes

Three layout-only changes. No backend, schema, or data changes.

## 1. ConnectPersonSheet close button (top-right, sticky, 44x44)

File: `src/components/connect/ConnectPersonSheet.tsx`

- Add a sticky header bar inside `SheetContent` that stays pinned to the top of the sheet (not the scrolling card content).
- Inside it, render an X button positioned top-right.
  - Tap target: `w-11 h-11` (44px), rounded full, `bg-events-cream/10 hover:bg-events-cream/20`.
  - Icon: `X` from lucide, `w-5 h-5`, `text-events-cream` for contrast on dark teal.
  - `aria-label="Close"`, calls `onClose`.
- Remove the existing `pt-10` padding on the scroll container since the sticky bar now reserves the space.
- Sticky bar uses `sticky top-0 z-10 bg-events-teal/95 backdrop-blur` and lives above the scroll area (or as a `sticky` first child inside it).
- Applies to both `subjectType="brand_rep"` and `subjectType="expert"` since the same component is used.

## 2. ConnectHome mobile top nav fits 375px

File: `src/pages/outsidedays/ConnectHome.tsx` (header block only, lines ~112-157)

Approach: keep desktop layout intact; on mobile, collapse secondary items into icons and rely on a bottom area only if needed. Simpler: switch to compact icon-only buttons for Connections / Profile / How-it-works on mobile, full text on `sm:` and up.

Changes:
- Map/List toggle: shrink padding on mobile (`px-3` instead of `px-4`), keep visible.
- Connections button: icon-only on mobile (`Users` icon from lucide, `w-4 h-4`), text label hidden via `hidden sm:inline` span; full label on `sm:` and up. Tap target `w-10 h-10`.
- Profile button: icon-only on mobile (`User` icon), text on `sm:`+. Tap target `w-10 h-10`.
- How this works: currently `hidden sm:inline-flex`. Make it visible on mobile too as a small icon-only button (`HelpCircle`, `w-10 h-10`).
- Header container: tighten `gap-3` to `gap-1.5` on mobile (`gap-1.5 sm:gap-3`), reduce horizontal `px-4` to `px-3 sm:px-4`.
- Title block: shrink to `text-xl` on mobile and truncate subtitle if needed so the right cluster always fits.

Verification at 375px: all four controls (Map/List, Connections, Profile, How) visible without horizontal scroll, each at least 40px tap target. Desktop unchanged because all changes are mobile-prefixed.

## 3. Replace "Outside Days" wordmark with the proper logo image

File: `src/pages/outsidedays/ConnectHome.tsx`

- Import `connectLogo from "@/assets/connect-basecamp-outside-days.png"` (same asset used by `ConnectShell` on `/connect/full`).
- Replace the `EditableText` h1 ("Outside Days") + subtitle block in the header with an `<img src={connectLogo} alt="Outside Days" className="h-8 sm:h-10 w-auto" />`.
- Keep the subtitle "Denver 26" small text or remove if it crowds the bar at 375px (remove on mobile via `hidden sm:block`).

## Verification

- 375px viewport: open `/outsidedays26/connect` (map view) — logo visible top-left, all 4 nav controls fit without scroll.
- Tap a brand bubble → ConnectPersonSheet opens → X visible top-right, scroll content, X stays pinned, tap closes.
- Open Industry Expert Zone → tap an expert → same X behavior.
- Desktop ≥768px: header looks the same as before with text labels.

## Out of scope

DB schema, edge functions, auth, the map component, card content, badge labels, dashboard.
