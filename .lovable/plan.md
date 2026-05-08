## Add "Background" section to ConnectProfile.tsx

Insert one new `<Section title="Background">` immediately after the "Looking for" section and before "Dream companies" in `src/pages/outsidedays/ConnectProfile.tsx`. No other files touched. No schema changes.

### Field 1: Total years of professional experience
- `<Field label="Total years of professional experience" hint="Across your whole career, all fields combined.">`
- Numeric `<Input type="number" min={0}>` bound to `c.total_years_professional`
- Empty string clears to `null`; otherwise `Number(value)`

### Field 2: Prior careers (repeater, max 3)
- New inline component `PriorCareersPicker` (kept local to file, matching the pattern of `SkillsPicker` / `NichePicker`)
- Reads/writes `c.prior_careers` as `Array<{ field: string; focus: string; years: number | null }>`, normalized on read with `Array.isArray` guard
- Helper text above the list: "Worked in multiple fields? Add up to 3 prior careers so brands see your full story. A senior salesperson transitioning to marketing is way more valuable than '1 year of marketing.'"
- Each entry rendered as a bordered card with a `Row` of:
  - Field `<Select options={FIELDS}>` (changing field clears focus for that entry)
  - Focus `<Select options={FOCUSES_BY_FIELD[entry.field] || []}>`
  - Years `<Input type="number" min={0}>`
  - A small `X` remove button (top-right of card)
- "Add another prior career" `<Button variant="secondary">` below the list
  - Disabled when `entries.length >= 3`
  - Appends `{ field: "", focus: "", years: null }`

### Field 3: Outdoor industry experience
- Yes/No via existing `<Select options={["Yes","No"]}>` pattern (matches the relocation toggle already in the file)
- Bound to `c.outdoor_industry_experience` (boolean, `""` when null)
- When `true`, reveal `<Field label="Years in outdoor industry"><Input type="number" min={0}></Field>` bound to `c.outdoor_industry_years`
- When toggled to No/empty, clear `outdoor_industry_years` to `null`
- Helper text under the toggle: "Outdoor brands care if you've worked in the industry before."

### Field 4: Management experience
- Same Yes/No pattern, bound to `c.management_experience`
- When `true`, reveal numeric input bound to `c.management_years`
- When toggled off, clear `management_years` to `null`

### Out of scope
- No DEI/demographics fields
- No DB migrations, no edge function changes (the existing `candidate-profile` function passes these fields through)
- No edits to signup, dashboard, or any other component
- No em dashes in any new copy
