## Add a photo capture step to the candidate signup wizard

Edit only `src/pages/outsidedays/Connect.tsx`. No backend, schema, or other-page changes. The Background section was already implemented in the previous turn so it is not part of this plan.

### Where it goes
Insert a new step between current step 1 (phone) and current step 2 (poachable + career stage). Steps reindex from 5 total to 6 total:
- 0: name + email
- 1: phone
- 2: **photo (new)**
- 3: poachable + career stage
- 4: field + focus + years
- 5: the hook

Update the progress-bar `[0,1,2,3,4]` to `[0,1,2,3,4,5]`, the `stepValid()` step indices, the `next()` boundary check (`step < 5`), the final-step button label condition, and shift step bodies accordingly.

### Step 2 UI
- Title: "Add your photo"
- Body: "Snap a quick selfie or upload a headshot. Recruiters meet 600 people in one day. A face makes you 10 times more memorable."
- Three stacked buttons:
  - **Take selfie** → triggers a hidden `<input type="file" accept="image/*" capture="user">`
  - **Upload from device** → triggers a hidden `<input type="file" accept="image/*">`
  - **Skip for now** → calls `setStep(step + 1)` without changing data
- After a file is chosen, show a small circular preview (~80px) using `URL.createObjectURL`
- Step is always valid (file optional). Continue button reads "Continue" as on other steps.
- No camera-permission prompt is invoked directly; the OS handles `capture="user"` and silently falls back to the gallery if the camera is denied, satisfying the graceful-fallback requirement (the second "Upload from device" button is always available).

### File handling (deferred upload)
The signup edge function and the `candidate-photos` storage bucket both require an authenticated session, so the actual upload must happen after `candidateSignupCreate` succeeds.
- Hold the chosen `File` in local state: `const [photoFile, setPhotoFile] = useState<File | null>(null)` plus `photoPreview` (object URL, revoked on cleanup/replace).
- Validate on selection: must be `image/*`, ≤ 5MB. On failure, toast and don't store.
- In `next()` after the existing `candidateSignupCreate(d)` call, if `photoFile` is set:
  1. `candidateUploadSignedUrl("photo", photoFile.name, photoFile.type)`
  2. `fetch(upload_url, { method: "PUT", headers: { "Content-Type": photoFile.type }, body: photoFile })`
  3. `candidateAttachUpload("photo", storage_path)`
  4. Wrap in try/catch; on failure show a non-blocking toast ("Photo upload failed, you can add it from your profile") and still navigate to home so the account isn't lost.

### Imports to add
`useRef` from react, no new lib imports beyond `candidateUploadSignedUrl` and `candidateAttachUpload` from `@/lib/connect-session` (already exported).

### Out of scope
- No edits to other steps, other pages, edge functions, taxonomies, storage buckets, or DB schema.
- No DEI/demographics fields, no Background section work (already done).
- No em dashes anywhere in new copy.
