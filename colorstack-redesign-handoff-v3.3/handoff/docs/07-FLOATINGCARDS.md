# 07 — FloatingCards: the rotating photo gallery

Modeled on the rotating-cards section at tastelabs.com. Replaces the 2×2 hover-duotone grid in "In the Room" on the landing page; also the Events page hero with flyers instead of photos.

## What Taste Labs is doing

About sixteen thin cards float in a loose 4×4 grid with jittered positions and slight depth differences. Each is a flat plane with a screenshot texture. Each rotates slowly and independently around its own vertical axis, out of phase with its neighbours, so at any moment some are face-on, some edge-on slivers, some mirrored (the back of the plane, same texture). The camera never moves. No scroll coupling, no zoom. Mixed aspect ratios are most of what makes it read as real material rather than tiles.

## Brief for the agent

```
Build `components/whimsy/FloatingCards.tsx`.

WHAT IT IS
A section (100vh desktop, 70vh mobile) with a single React Three Fiber canvas on a white ground. 12–16 candid chapter photos float as thin textured planes in a loose 4×4 grid. Each card rotates slowly on its own Y axis at its own speed and phase, so some are face-on, some edge-on, some showing their back. The camera is static. Nothing is coupled to scroll. Ambient and quiet: photos turning on a string, not a carousel.

THE CANDID PART
Real chapter moments, not posed group shots: someone mid-laugh at a workshop, a whiteboard with a half-solved problem, the snack table, two members over one laptop. Mixed aspect ratios on purpose: portrait phone shots, landscape camera shots, a couple of near-square crops. Card size comes from the image's aspect (fixed height ~0.9 units, width from aspect). Never crop to a uniform tile. Every image needs truthful alt text and an entry in SOURCES.json. Source: Sanity `chapterPhoto` documents with `candid: true`.

LAYOUT
- col, row in 0..3; x = (col − 1.5) × spacing, y = (row − 1.5) × spacing; add ±20% jitter to x and y; z in −0.8..0.2.
- Spacing so the cloud fills ~70% of viewport width at the camera distance.
- side={THREE.DoubleSide}; the back shows the same texture, mirrored is fine.
- meshBasicMaterial, toneMapped={false}; photo colors stay true on white.

MOTION
- Each card: rotation.y += speed × dt; speed 0.15..0.35 rad/s, random sign, random initial phase. Optional bob: y += sin(t × 0.4 + phase) × 0.02.
- Pointer: whole group tilts toward the cursor by at most 4° on X and Y, lerped at 0.05. No scatter.
- Hover: the card stops rotating, eases to face the camera (rotation.y → nearest multiple of 2π) over ~400ms, lifts z by 0.3. Cursor becomes ✳. Alt text appears as a Lora italic line under the canvas, not over the card, not in mono.
- Click / Enter: plain lightbox, full photo centered on white with a 1px line border, alt text beneath in Lora, Esc or click-outside closes. Canvas keeps rendering behind at reduced opacity. 200ms fade, no zoom animation needed.
- Leave: the card resumes rotating from where it stopped.

PERFORMANCE
- dpr [1, 1.5], antialias off, one canvas. frameloop="always" only while in view (IntersectionObserver → setFrameloop), "demand" otherwise.
- Textures 1200px longest side, WebP, drei useTexture + Suspense; white skeleton until loaded, no spinner.
- Cap 16 cards. Mobile: 8 cards, no pointer tilt.

WEBGL UNAVAILABLE (technical fallback only)
Static 4-column masonry (2 on mobile), 12px corners, hover shows alt text, click opens the same lightbox. Same API, different renderer. There is no reduced-motion variant; do not read prefers-reduced-motion anywhere.

ACCESSIBILITY
Canvas is aria-hidden. A visually hidden list of buttons, one per photo with its alt text, sits beside the canvas so keyboard and screen-reader users can open any photo. Focus moves into the lightbox on open and back to the trigger on close.

API
<FloatingCards photos={[{ id, src, alt, width, height }]} />

DO NOT
- Overlay any text, badge, caption, or number on the cards.
- Add shadows, glow, reflections, or a dark ground.
- Couple rotation or position to scroll.
- Auto-open or auto-focus a card.
- Add a reduced-motion branch.
```

## Schema change

Add `candid: boolean` (default false) to `chapterPhoto` so the e-board flags eligible uploads. The landing query filters `candid == true` for this section.
