I’ll make these focused fixes across the Connect flow:

1. **Fix Save basics immediately**
   - Update the candidate signup backend so a basics-only account can be created with just first name, last name, email, and phone.
   - Remove the dependency on `poachable_status` and other full-profile fields for this basics save path.
   - Keep full-profile submit validation separate so users can still complete the fuller profile later.

2. **Make Connect text genuinely admin-editable**
   - Wrap remaining visible Connect-page headings, labels, helper text, button text, option labels, placeholders, empty states, and modal copy with the existing `EditableText` / `event_settings` system.
   - Cover the pages/components currently still hardcoded, including map/home, profile/full signup, how-it-works, note composer, connection forms/sheets, and related Connect UI.
   - Add an admin-visible note or clear behavior so if you do not see edit pencils, it is clear you are not signed in as admin.
   - Do this without any AI or credit-based text generation.

3. **Correct note wording**
   - Change “Jenna Celmer will get an email” and related explainer text to accurate language that does not overpromise delivery.
   - Use wording like “Note saved for follow-up” or “Your note is saved and will be included with their Connect follow-up when applicable.”
   - Make that text editable too.

4. **Adjust hero photo/logo composition**
   - Reposition the hero image object-position on mobile/desktop so the person’s face sits beside the logo rather than behind it.
   - Keep the dark overlay so the logo stays legible.

5. **Improve niche experience UX and wording**
   - Replace the current single-column mobile niche list with a compact grid/chip UX that fits all niche options on one phone screen more cleanly.
   - Update the helper copy to explain this is real work experience in those niches, not interests.
   - Preserve selected niches and years of experience, with a compact way to add/edit years.

6. **Filter industry experts correctly on the map**
   - Update the Denver experts hook and map/list usage so the Industry Expert Zone only shows published Denver assignments that are not `brand_rep` and not marked as brand reps.
   - Keep brand-rep cards attached to brand tiles only.

7. **Remove duplicate close controls in expanded cards**
   - Adjust the Connect sheet/card composition so the expanded expert or brand card has one clean close button, not duplicative X controls.
   - Keep the close button placement consistent and mobile-friendly.

8. **Verify the reported paths**
   - Check the failing `signup_create_basics` path after the backend fix.
   - Inspect the mobile Connect full page layout at the current 390px viewport for hero/logo and niche UX.
   - Confirm map expert filtering uses Denver-only non-brand-rep assignments.