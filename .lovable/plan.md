## Problem

As an admin, the entire EditableText element is clickable, which intercepts clicks meant for buttons, links, and navigation. The pencil icon also only appears on hover, so on touch devices it's invisible.

## Fix

Update `src/components/EditableText.tsx` so that:

1. The text span itself is **not** a click target. Render the text normally (no `cursor-pointer`, no `onClick` on the wrapper, no `group/edit` swallowing clicks). The text behaves exactly as it does for non-admins, so underlying buttons, links, and navigation work normally.
2. The **pencil icon** becomes the sole edit trigger. It sits next to the text (inline, small, absolutely or inline-positioned so it doesn't disrupt layout), is always visible to admins (not hover-only), and has its own `onClick` that calls `setDraft(displayText); setEditing(true)` plus `stopPropagation` so clicking the pencil doesn't also trigger the underlying button/link.
3. Pencil styling stays subtle: small coral icon, low opacity by default, full opacity on hover, with a tooltip "Edit". Keep it inside an inline button so it's keyboard-accessible.
4. Editing UI (textarea/input + save/cancel) remains unchanged.

No other components or behavior change. Non-admin rendering is unchanged. This is a single-file edit.

## Out of scope

- `EditableLink` (separate component, not mentioned by the user; can be done in a follow-up if it has the same issue).
- Any layout, content, routing, auth, schema, or edge function changes.
