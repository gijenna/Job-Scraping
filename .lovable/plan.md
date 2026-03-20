

# Confluence Map Enhancements

## Changes

### 1. Make "Visit Office" link editable + social icons editable when populated
- Social icons with existing links need an admin edit capability (currently once populated, no edit option)
- Make the "Visit Office" URL editable via the same inline edit pattern
- Social icons only show for non-admins if they have a link populated

### 2. Much larger, more detailed illustrated icons
- Replace the tiny 14-16px SVG icons with much larger, more detailed illustrations (~60-80px) that fill the state area like the TripSavvy reference
- Each state gets richer, multi-element illustrations: mountains with snow caps, trees with detail, kayakers on water, skiers on slopes, etc.
- Larger, bolder state abbreviation labels (font-size ~16-20 instead of 9)

### 3. Add Nevada as a member state
- Add NV to `confluenceData.ts` with: "Nevada Division of Outdoor Recreation", placeholder data
- Add NV to `stateColors` and `stateIcons`

### 4. Add nonprofit partner field
- Add `nonprofitPartner` and `nonprofitPartnerUrl` and `nonprofitPartnerLogo` to `StateOffice` interface
- Pre-populate: ME → Maine Outdoor Brands (maineoutdoorbrands.com), PA → PORA (paoutdoors.org)
- Show as a small logo circle in the card (in the area where MapPin/state name was — replacing that row)
- Only show if populated; admin can add/edit via the same inline edit pattern
- Link out to the partner site

### 5. Remove the MapPin + state name row from the card stats grid
- Replace with nonprofit partner display area

## Files Changed

| File | Change |
|------|--------|
| `src/components/event/confluenceData.ts` | Add NV, add `nonprofitPartner`/`nonprofitPartnerUrl`/`nonprofitPartnerLogo` fields, pre-populate ME & PA partners |
| `src/components/event/ConfluenceMap.tsx` | Rebuild activity icons at 4-5x size with richer detail; larger state labels; editable Visit Office link; editable social icons when populated; nonprofit partner in card; remove MapPin row |

