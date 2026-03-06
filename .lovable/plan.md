

# Hero Video Update + Sample Events

## Changes

### 1. Update `src/components/events/EventsHero.tsx`
- Remove the static illustration image (right column)
- Convert to a full-width video background hero (similar to `src/components/event/EventHero.tsx` pattern)
- Video source: `https://videos.pexels.com/video-files/31477724/13421411_2560_1440_30fps.mp4`
- Add dark overlay (60-70% opacity) so cream text remains legible over the bright desert/bird footage
- Keep "What's On" + "Happenings at Basecamp" text, centered
- Keep the ripped paper SVG divider below
- Remove the 2-column grid layout, switch to centered single-column text over video

### 2. Add sample events to the database
Insert 5-6 sample events with varied types, dates, costs, and locations using real outdoor industry event photos from the existing assets folder.

### 3. Files modified
- `src/components/events/EventsHero.tsx` — video background hero
- Database migration — sample event data insert

