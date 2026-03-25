

# Fix Expanded Card Sizing

## Problem
When Card B (compact) or Card C (minimal) expands to show the full Card A view, the expanded card inherits the narrow grid column width of its parent grid. Card A needs ~280px width but compact grid cells are narrower, and minimal cells are tiny (~80px). This makes the expanded card look squished.

## Solution
Instead of rendering the expanded Card A inline within the grid cell, render it as a **fixed-position overlay/modal** centered on screen. This guarantees the Card A renders at its natural size regardless of which card type triggered the expansion.

### Changes to `ExpertCardCompact.tsx`
- When expanded, render the Card A in a **fixed overlay** with a backdrop, centered on screen, at a fixed max-width (~320px) matching Card A's natural size
- Add a click-outside-to-close behavior on the backdrop

### Changes to `ExpertCardMinimal.tsx`
- Same overlay approach as compact

### Implementation Detail
```tsx
// Both compact and minimal, when expanded:
if (expanded) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setExpanded(false)} />
      {/* Card A at natural size */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setExpanded(false)}>
        <div className="w-full max-w-xs" onClick={e => e.stopPropagation()}>
          <button className="absolute top-2 right-2 ..."><X /></button>
          <ExpertCard expert={expert} expanded />
        </div>
      </div>
    </>
  );
}
```

## Files Changed

| File | Change |
|------|--------|
| `src/components/experts/ExpertCardCompact.tsx` | Render expanded state as centered overlay with max-w-xs |
| `src/components/experts/ExpertCardMinimal.tsx` | Same overlay treatment |

