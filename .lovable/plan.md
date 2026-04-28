## Goal

Cut the noise on `/guests?slug=...`. One coral CTA at a time, smarter button labels, and the photo circle is the only upload affordance.

---

## 1. Photo circle = the upload button (`AfterPartyIntakeForm.tsx`)

- Remove the separate "Upload photo" rectangle button.
- Wrap the existing photo circle in a `<label htmlFor="photo-input">` so the whole circle is the click/tap target.
- Keep the hidden `<input type="file">`.
- Empty state: circle shows the dashed "Your photo" hint plus a small camera icon, all clickable.
- Filled state: photo fills the circle; below the circle show a tiny `Replace` (link styling) and `Remove` text link. Replace also triggers the same hidden input.
- Cartoon-generating spinner overlays the circle as today.

## 2. Smarter primary button on the My Card section (`MyCardSection.tsx`)

Today the only signal is `isPreRsvpShell` (no photo, no cartoon, no niches, etc.). Problem: a user who RSVPd with just basics and no photo still trips the shell heuristic.

New rule for the button label:
- "Secure my spot" appears **only** when the attendee record has never been saved past `status='invited'` AND has no `email` filled in by the user.
- Use `status` (`invited` vs `confirmed`) as the source of truth, since `submit()` already sets `status='confirmed'` on save. This is set the very first time anyone saves the form.
- All other cases (returning from confirmation email, editing later, no photo yet, etc.) show "Edit my card".

Inside the form's submit button itself, mirror the same logic: show "Secure my spot →" only on a true first save (`!attendeeId || initial.status !== 'confirmed'`). Otherwise show "Save changes".

### Times "Secure my spot" is the right label
Only one: a brand-new visitor filling out the form for the first time, OR a pre-invited shell where Jenna seeded the row but the person has never opened/saved it. After that one save, it's always "Edit my card" / "Save changes".

I'll flag in code with a comment so future-you remembers.

## 3. Post-save preview replaces the editor

After `handleSaved` fires:
- Close the editor (already happens).
- Render a mini preview card (reuse `GuestCard` styling at compact size) directly inside the My Card section, with the existing "Edit my card" coral button overlaid in the top-right corner where it already lives.
- Below it, render the new coral "Want suggestions?" prompt (see #4) instead of the current "See who's coming" CTA, **unless** the user has already filled in matching info.

## 4. New coral "add more about you" prompt

Replaces the current "See who's coming" coral box for users who haven't filled in any matching info (no `niches`, no `looking_for`, no `mind_blowing_fact`, no `creator_types`).

```
You're in ✓
Want suggestions on creators you should meet at the party?
Add a bit more about you and we'll match you to people in the room you might
not have known to look for. Totally optional, you can always do this later.
[ Add more about me → ]
```

Clicking it opens the editor in step 2 (matching info only), scrolling to the niche section. This is exactly the existing `requestEdit()` path with a new `setStep(2)` hint passed through.

For users who **have** filled in matching info, keep the existing "See who's coming →" coral box.

The `MatchesPanel`'s "Finish your card to get matches" empty-state copy stays as a secondary nudge inside the matches list itself.

## 5. Brand reps: one combined card instead of two coral boxes

For brand reps who haven't activated AND haven't filled in matching info, today they'd see two coral-ish boxes. New approach: a single bordered container titled "A couple optional next steps" with two stacked actions:

```
A couple optional next steps
─────────────────────────────────────
[ ✦ Get my brand in the room → ]      (opens BrandActivateButton form inline)
[ + Add more about me → ]              (opens step 2 of the editor)
```

Once activation is sent, that row collapses; if matching info is filled, that row collapses. When both are done, the combined card disappears entirely and we fall back to the standard "See who's coming" coral box.

Removing the standalone `BrandActivateButton` rendering currently in `MyCardSection` (the one above the roster CTA) and the `BrandActivateButton` block currently rendered inside `AfterPartyIntakeForm` — both consolidated into the new combined card. The "prompt her here" mailto card after submission is removed (you said no more "prompt her here" box).

## 6. /blindfold flow gotchas worth raising

- **Brand reps editing later**: Once they've activated AND filled in matching info, they should still be able to edit either. Keep both reachable from the "Edit my card" full editor; the combined-card just disappears from the post-save view.
- **Returning via PIN from a different browser**: The `verifiedAttendeeId` flow still triggers the PIN sheet for non-shell users. After PIN they should land on the preview, not in edit mode, unless they came via `?edit=1`.
- **Locked matches**: If host has locked matches, the matching prompt should still appear if they haven't filled in info — they can still influence who *looks for them*. I'll keep the prompt visible regardless of lock state.
- **Confirmation email link**: I'll double-check the confirmation email's "Edit my card" CTA links to `/guests?slug=...&edit=1` (it currently links to `dashboardUrl` without `&edit=1`). Without `&edit=1`, clicking "Edit my card" in the email lands them on the preview, which is fine — they then click the on-page "Edit my card" button. We can leave email as-is or add `&edit=1` to skip a click. Recommend leaving as-is so they see their card first.
- **Empty state when there's literally nothing to show**: A confirmed user with no photo, no matching info, no activation → preview card looks bare. The mini preview will use the cartoon fallback avatar so it's never empty.

## Files touched

- `src/components/afterparty/MyCardSection.tsx` — button labels, post-save preview, new combined "next steps" card, removal of standalone BrandActivateButton block, new "Add more about me" coral prompt.
- `src/components/afterparty/AfterPartyIntakeForm.tsx` — photo circle as upload target, remove rectangle button, smarter submit button label, accept an optional `startStep` prop so step 2 can be jumped into directly, remove the BrandActivateButton block (moved to MyCardSection's combined card).
- `src/components/afterparty/MatchesPanel.tsx` — no change needed (empty-state copy already correct).

No DB or edge function changes.
