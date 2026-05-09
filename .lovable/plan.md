## Plan

1. **Replace Connect app branding assets**
   - Copy the uploaded transparent Basecamp Outdoor @ Outside Days logo into the project assets.
   - Copy the uploaded real event photo into the project assets.
   - Update `ConnectShell` so all Connect entry/profile pages use the new logo and real event photo instead of the current missing logo/mountain image.
   - Add a dark teal/coral overlay layer behind the logo so the transparent cream logo stays legible on the photo.

2. **Fix the profile save and photo-upload blocker**
   - On `/outsidedays26/connect/full`, add a clear **Save basics** button directly under first name, last name, email, and phone.
   - This button will only validate name, email, and phone, then create the candidate record/session using a lightweight “basics first” path.
   - After that succeeds, photo and resume upload will work immediately without requiring career stage.
   - Keep the existing **Submit and see the map** behavior for the full required profile completion flow.
   - Update the upload toast copy so it points to the new save button.

3. **Add backend support for saving basics only**
   - Update the candidate auth function to support a `signup_create_basics` action requiring only first name, last name, email, and phone.
   - Reuse the existing duplicate-email check and session cookie creation.
   - Add a matching `candidateSignupCreateBasics` helper in `src/lib/connect-session.ts`.
   - Do not loosen the full `signup_create` requirements, so map access still requires the full profile.

4. **Make Connect text admin-editable**
   - Wrap hardcoded Connect app text in `EditableText` across these areas:
     - `/outsidedays26/connect`
     - `/outsidedays26/connect/full`
     - `/outsidedays26/connect/profile`
     - `/outsidedays26/connect/home`
     - `/outsidedays26/connect/how-it-works`
     - `/outsidedays26/connect/connections`
     - shared Connect components such as `ConnectionForm`, `ConnectActionFooter`, `NoteComposer`, and picker labels/help text.
   - Include button labels, option labels like “Select...”, helper text, empty states, modal titles, and CTA copy.
   - Keep dynamic user data, typed form values, candidate names, brand names, expert names, and taxonomy arrays as data, not editable page copy.

5. **Ensure admin-only editing remains locked down**
   - Keep all editable copy behind the existing `EditableTextProvider` admin gate.
   - Do not expose edit controls to candidate sessions or anonymous PIN sessions.
   - Add providers where missing on Connect pages so admin-editable text loads and saves consistently.

6. **Remove em dashes everywhere**
   - Replace all em dash characters in app source, backend functions, comments, and docs with commas, periods, colons, parentheses, or hyphens as appropriate.
   - Specifically fix visible copy like “Got it — take me to Connect”.
   - Re-scan the repo for the em dash character and remove remaining occurrences.

7. **Verify the requested flows**
   - Confirm the uploaded logo and real event photo render on Connect pages with enough overlay contrast.
   - Confirm non-admin users see no editable controls.
   - Confirm an admin `@wearetheoutdoorindustry.com` user can edit Connect page text, buttons, and helper copy.
   - Confirm the full profile page allows saving basics before career stage, then allows photo upload.
   - Confirm the final em dash scan returns no matches.