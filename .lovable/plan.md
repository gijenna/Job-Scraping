

# Link Bubble Logos to Their URLs

## Problem
The `CascadingLogoBubbles` component ignores the `url` field on logos, so clicking a bubble does nothing even when a URL has been added via the admin logo manager.

## Changes

### `src/components/event/CascadingLogoBubbles.tsx`
1. Add `url?: string | null` to the `LogoItem` interface
2. Wrap each bubble's inner content in an `<a>` tag when `item.logo.url` exists, otherwise keep as-is

```tsx
// Inside the rainLogos.map render:
const bubble = (
  <motion.div ...>
    <motion.div ...>
      <img ... />
    </motion.div>
  </motion.div>
);

return item.logo.url ? (
  <a key={i} href={item.logo.url} target="_blank" rel="noopener noreferrer">
    {bubble}
  </a>
) : (
  <React.Fragment key={i}>{bubble}</React.Fragment>
);
```

No other files need changes — the `FeaturedTeamsSection` already passes logo objects that include `url` from `useEventLogos`.

