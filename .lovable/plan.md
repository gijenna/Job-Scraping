

# Redesign Index Page as "Basecamp Gather" Hub

## Overview
Transform the main landing page from a Denver-specific sponsor pitch into a general **Basecamp Gather** hub that introduces the brand and funnels visitors to either the Denver or PNW event pages.

---

## What Changes

### 1. Add Basecamp Logo
- Copy the uploaded `Basecamp_Logo_MAIN_1.png` into `src/assets/`
- Import it in the updated HeroSection

### 2. Redesign the Hero Section (`HeroSection.tsx`)
- Replace the "Basecamp Outdoor x Outside Days" tagline with general Basecamp branding
- Display the **Basecamp logo** prominently instead of the "GATHER DENVER 2026" title
- Update headline to something like **"GATHER"** with a subtitle about the outdoor industry's premier career events (plural, not Denver-specific)
- Replace the date line with **two event buttons**:
  - **"Portland - April 16"** linking to `/gather-pnw`
  - **"Denver - May 29"** linking to `/gather-denver`
- Remove the "Become a Sponsor" and "View Partnership Tiers" CTAs (those belong on event-specific pages)
- Remove the "Named one of two top activations" accolade (Denver-specific)
- Keep the existing hero image for now (the user can swap it later with a more diverse photo)

### 3. Simplify the Index Page Layout (`Index.tsx`)
Remove Denver-specific sections and keep only general/overview content:
- **Keep**: HeroSection (redesigned), LogoTicker, EventOverview, ValueProps, RecruiterValue, StatsSection, Testimonials, CTASection
- **Remove**: Schedule (event-specific), PartnershipTiers (event-specific, references Denver pricing)

### 4. Update EventOverview Component
- Add **"Learn More" buttons** to each event card that link to `/gather-pnw` and `/gather-denver` respectively

### 5. Update CTASection
- Change the email subject from "GATHER Denver 2026" to a general "GATHER Events 2026"
- Keep the general "Ready to Be Part of This?" messaging (already event-agnostic)

### 6. Update Page Metadata
- Change `<title>` in `index.html` from "Lovable App" to "Basecamp Gather | Outdoor Industry Career Events"

---

## Technical Details

### Files Modified
| File | Change |
|------|--------|
| `src/assets/Basecamp_Logo_MAIN_1.png` | New file (copied from upload) |
| `src/components/HeroSection.tsx` | Replace Denver branding with Basecamp logo, general headline, two event link buttons |
| `src/pages/Index.tsx` | Remove `Schedule` and `PartnershipTiers` imports/usage |
| `src/components/EventOverview.tsx` | Add "Learn More" link buttons on each event card |
| `src/components/CTASection.tsx` | Generalize email subject line |
| `index.html` | Update page title and meta descriptions |

### No changes to
- `/gather-pnw` and `/gather-denver` pages (they remain as-is)
- Export pages
- Any shared UI components

