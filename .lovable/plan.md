

# Update "Not Hiring" Callout — Copy, Styling, and Placement

## 1. Move section directly under the ticker on both pages

**GatherPNW.tsx**: Move `<EventNotHiringCallout />` from after `<PnwUOPartner />` to directly after `<EventLogoTicker />`.

**GatherDenver.tsx**: Move `<EventNotHiringCallout />` from after `<DenverFestivalPartner />` to directly after `<EventLogoTicker />`.

## 2. Update copy and styling in `EventNotHiringCallout.tsx`

New copy as provided, with these readability improvements:
- **Smaller body text**: `text-sm md:text-base` instead of `text-base md:text-lg`
- **More whitespace between paragraphs**: `space-y-6` instead of `space-y-4`
- **Staggered fade-in per paragraph**: Each `<p>` gets a slight delay via framer-motion, drawing the eye down line by line — this is the single most effective technique to get people to actually read short-form copy
- **Narrower max-width**: Keep `max-w-2xl` to ensure the second paragraph wraps to two lines comfortably
- The "Employed, respected..." line gets its own paragraph as a punchy standalone
- Final line stays bold/semibold as the closer

### Updated copy structure:
1. "You need to be unforgettable before the role ever opens."
2. "This isn't about collecting resumes. It's about staying in the back of someone's mind until the timing is right. So when it is, you're not a cold option. You're the obvious one."
3. "That ticker above? That's who's in the room. The top performers your competitors want to poach."
4. "Employed, respected, and quietly deciding which companies are worth leaving for."
5. "Basecamp isn't a recruiting tactic. It's a revenue strategy."
6. **"Show up like it matters. Because it does."**

## Files changed

| File | Change |
|------|--------|
| `src/components/event/EventNotHiringCallout.tsx` | New copy, smaller text, more spacing, staggered animations |
| `src/pages/GatherPNW.tsx` | Move callout to right after ticker |
| `src/pages/GatherDenver.tsx` | Move callout to right after ticker |

