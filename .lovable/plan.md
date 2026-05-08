## Add "Skills & niches" section to ConnectProfile.tsx

Insert a new `<Section title="Skills & niches">` between the existing "Current role" section (ends line 142) and "Looking for" section (begins line 144). No other files change.

### Imports
Update the taxonomies import to also pull `SKILL_CATEGORIES`, `SKILL_CATEGORY_KEYS`, and `NICHES`. Also import `Checkbox` from `@/components/ui/checkbox` and `Collapsible`/`CollapsibleTrigger`/`CollapsibleContent` from `@/components/ui/collapsible` (both already exist). Add `X` and `ChevronDown` from `lucide-react`.

### Subsection 1: Areas of expertise
Backed by `c.areas_of_expertise` (text[]).

- Local state: `skillSearch` (string), `openCategories` (Set<string>).
- Selected chips row at top: maps over `c.areas_of_expertise`, each pill renders skill name + an X button that removes it via `set("areas_of_expertise", arr.filter(s => s !== skill))`.
- Search input below chips filters skills across all categories (case-insensitive substring match). When search is non-empty, all matching categories auto-expand and only matching skills render.
- Categories list: iterate `SKILL_CATEGORY_KEYS`. For each, render a `Collapsible` with a trigger row showing `{category} ({selectedCountInCategory})` and a chevron. Content is a wrapped grid of skill items; each item is a small Checkbox + label. Toggling adds/removes from `areas_of_expertise`.
- Helper text: "Select the skills that describe what you do best. Brands will filter on these."

### Subsection 2: Niche experience
Backed by `c.niche_experience` (jsonb array of `{niche, years}`).

- Normalize on read: support both array of objects and possible legacy shape; map to `{ [niche]: years|null }` for quick lookup.
- Render all 28 `NICHES` as rows: Checkbox + niche name. When checked, a small numeric `Input` (w-20, type=number, min=0) appears to the right for years.
- Toggle adds/removes `{niche, years: null}`. Years onChange updates that entry's years (parse to integer, blank -> null).
- Persist back as `set("niche_experience", arrayOfObjects)`.
- Helper text: "Outdoor brands care a lot about niche experience. Years are optional but helpful."

### Styling
Match existing dark teal aesthetic: `bg-events-cream/5`, coral accents for selected chips (reuse the `MultiPills` chip style for selected-skill chips), `font-body` everywhere. No em dashes in any copy.

### Out of scope
- No DB schema changes.
- No DEI/demographics fields.
- No edits to signup, dashboard, or other pages.
- No edits to the edge function (existing `candidate-profile` already passes through `areas_of_expertise` and `niche_experience`).
