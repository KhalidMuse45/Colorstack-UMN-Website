# Landing page fixes — one pass

Read `DESIGN.md`. Then make these seven changes on the landing page. Everything you need is specified below; do not invent anything beyond it. Do them in order and do not skip the verification at the end.

## 1. Hero photo: full color, no two-tone

Remove the duotone/tint treatment from the hero photo entirely. The photo is full color at every scroll position.

- In the hero shader, delete the luminance-to-duotone step and the uniforms that drive it (any mix, dark-color and light-color uniforms). Keep: cover-fit, the UV zoom driven by scroll progress (scale 1.00 → 1.45), the 3px normalized pointer displacement that falls off with distance, and film grain at 0.035 on the photo plane only.
- The media container's background is white, not maroon.
- Delete any CSS class that applies grayscale + multiply to photos, and every use of it on the landing page.
- Update `DESIGN.md` and `docs/02`: the hero moment is the aperture opening plus the zoom. Replace any sentence about the duotone lifting to color.

## 2. Glyph sprites in the hero that rotate and scatter on hover

Replace the placeholder shapes in the hero canvas with real glyph sprites.

- Build three textures at runtime: draw ✳ (U+2733), ✦ (U+2726) and ★ (U+2605) each onto a 128×128 canvas, centered, in the gold token color, at ~96px font-size, and use them as sprite materials (transparent, depthWrite off).
- Eight sprites, placed only in the left and right 18% of the viewport width so they never sit over copy. Each has a random y, a random size between 0.08 and 0.18 world units, a random rotation phase, and a slow downward drift (0.05–0.13 units/s) that wraps to the top.
- Every frame: rotate each sprite continuously at 0.2 rad/s plus its phase; compute its distance to the pointer in world units; if within 1.1 units, push it away along the pointer→sprite vector by up to 0.9 units, eased with lerp 0.08; when the pointer leaves, it lerps back to its drift position at the same rate.
- The sprites are on the same canvas as the photo, render only while the hero pin is active, and are disabled below 768px.

## 3. Tile states (used by the puzzle in step 6)

Define these once and reuse them:

- Default tile: white background, 1px border in the line token, 12px radius, maroon text in Archivo 800 at clamp(18px, 2.7vw, 34px), aspect-ratio 1.28, centered content, a small mono index bottom-left at 9px in the secondary-ink token.
- Hover: background switches to the soft-gold token, border unchanged. 120ms transition on background only.
- The tile carrying the word ROOM: background gold token, border gold token, maroon text. This is the single "permission" gold on the page.
- The tile carrying the ✳ glyph: background maroon token, border maroon, glyph in white at clamp(35px, 4vw, 58px); its corner index is also white.
- Hint state: 3px maroon outline inset by 5px, background soft-gold.
- Empty cell: transparent background, 1px dashed border in the line token, cursor default; contains the mono text "room to move" at 9px uppercase, +0.07em tracking, centered, max-width 75px. This is the only instruction text in the puzzle.
- Solved: the puzzle container's border turns maroon.

## 4. Logo

Use the chapter mark with Goldy Gopher in the nav, top-left, 24px tall, next to the "ColorStack UMN" wordmark. That's it. Nowhere else needs the mark; the footer and mobile menu use the wordmark text. If the Goldy file isn't in `public/images`, tell me and I'll supply it.

## 5. Mission rotator: inline, gold underline, cycles once

Currently the rotating word drops to its own line under "Building a space for" and is unstyled. Fix it to this exact spec:

- Container: display flex, align-items center, flex-wrap wrap, gap 8px 14px, min-height 84px, a 1px hairline on top, padding-top 25px, margin-top 63px (38px on mobile).
- Prefix "Building a space for": Lora italic, 23px (21px on mobile), ink color. It never moves.
- Rotating word: Archivo 800, clamp(23px, 3vw, 39px), letter-spacing −0.035em, maroon; text-decoration underline with the gold token as the underline color, 5px thick, 7px underline offset.
- Swap animation: the word gets a class that sets opacity 0 and translateY(7px) for 180ms, the text changes, the class is removed, and it eases back over 240ms with the site easing. Only the word animates.
- Sequence: "Black students." → "Latinx students." → "first-generation students." → "you." at 2.4s per item, runs once on scroll-into-view, holds on "you." forever. No loop.
- Below 640px the container switches to flex-direction column with align-items flex-start and min-height 115px so the word stacks under the prefix. At all wider sizes it must be one line.

## 6. The puzzle: replace the current one with this

An eight-tile sliding word puzzle on a 3×3 grid. The solved state reads, left to right, top to bottom: YOU / HAVE / A / PLACE / IN / THIS / ROOM / ✳ / [empty]. Tile values 1–8 map to those eight words in that order; the empty cell is position 9.

Layout:

- Container: 1px hairline border, 12px radius, 24px padding (16px on mobile), cream background, max-width 560px, right column of a two-column section. Left column: H2 in Archivo 800 at 40px, a Lora paragraph "Slide a tile into the open space. Put the sentence back together.", and a Lora italic line "No rush. Some things are worth figuring out just because."
- Meta row at the top: left, mono 11px uppercase "The belonging puzzle"; right, a move counter in the same mono. 1px hairline underneath, 19px padding-bottom.
- Grid: 3 columns, 9px gap, 20px margin-top, user-select none. Tiles as specified in step 3.
- Controls row under the grid: two pills, "Shuffle" left and "A little help" right, 44px min-height, mono 10px uppercase labels, 20px margin-top.
- Status line under the controls: Lora 14px in the secondary-ink token, min-height 48px, 20px margin-top. Initial text: "A place for every piece. Start with a tile beside the open space." On a hint: "Try the highlighted tile." On solve: "That's the whole sentence. You're in." in maroon.
- No keyboard instructions text, no goal line, no timer, no score, no completion gate.

Logic:

- State is an array of 9 slots holding values 1–8 and 0 for empty. Solved state is `[1,2,3,4,5,6,7,8,0]`.
- `neighbors(index)`: the indices reachable by one slide (up/down/left/right within the 3×3, no wrap).
- `move(from)`: if the empty slot is in `neighbors(from)`, swap them, increment the move counter, and animate the tile with a 180ms transform transition; otherwise do nothing.
- `shuffle()`: start from the solved state and apply 60–100 random legal moves (never undoing the immediately previous move) so the result is always solvable. Reset the counter and status. Never use a random permutation.
- `nextSolutionMove()`: A* search from the current state to the solved state using the sum of Manhattan distances of tiles 1–8 as the heuristic, capped at 20,000 expanded nodes. Return the first move on the found path. Apply the hint class to that tile for 1.6s. If the cap is hit, fall back to the neighbor with the lowest resulting heuristic.
- Keyboard: tiles are buttons in DOM order; arrow keys move focus within the grid; Enter or Space calls `move()` on the focused tile. Screen readers get an aria-live status line and each tile is labeled "Word: X, position N".
- Directly below the puzzle section, unblocked: the email input, the gold "Join the List" pill, the chapter email with click-to-copy, and social links.

## 7. The floating photo gallery: rebuild it, centered, candids only

The current version is off-center, uses the wrong photos, and doesn't read as a cloud. Rebuild `FloatingCards` from this spec. It replaces the "In the Room" section entirely; delete the old 2×2 grid.

Photos:

- Only candid photos: unposed moments, someone mid-laugh, a whiteboard mid-problem, the snack table, two members over one laptop. No group shots, no posed portraits, no flyers. Source them from the Sanity `chapterPhoto` documents where `candid == true`; if that field doesn't exist yet, add it (boolean, default false) and set it true on the eligible photos in `public/images`. If fewer than 8 candids exist, tell me which photos you found and stop; do not pad with posed shots.
- Mixed aspect ratios on purpose. Each card's size comes from its image's aspect: fixed height 0.9 world units, width = 0.9 × aspect. Never crop to a uniform tile.
- Textures 1200px longest side, WebP, loaded with Suspense; the section is blank white until they're ready, no spinner.

Layout (this is where it went wrong):

- The canvas is a section 100vh tall on desktop, 70vh on mobile, full container width, white ground. The camera is at z = 3.2, fov 45, looking at the origin, and never moves.
- Compute the layout after the canvas mounts, from the actual viewport size in world units at z = 0. Cards go in a 4×4 grid (4×2 on mobile with 8 cards): x = (col − 1.5) × sx, y = (row − 1.5) × sy, where sx = 0.72 × viewportWidth / 4 and sy = 0.72 × viewportHeight / 4. Then add ±20% of sx/sy as random jitter, and z in −0.8 … 0.2. The result must be centered on the origin: compute the bounding box of all card centers and subtract its center from every position so the cloud's center is (0, 0) regardless of jitter.
- Recompute on resize.
- `side = DoubleSide`; the back shows the same texture, mirrored is fine.
- `meshBasicMaterial`, `toneMapped false`, so photo colors stay true on white.

Motion:

- Each card rotates on its own Y axis: `rotation.y += speed × dt`, speed 0.15–0.35 rad/s, random sign, random initial phase. Optional bob: `y += sin(t × 0.4 + phase) × 0.02`.
- The whole group tilts toward the pointer by at most 4° on X and Y, lerped at 0.05. No scatter, no displacement, no scroll coupling.
- Hover on a card: it stops rotating, eases to face the camera (rotation.y → nearest multiple of 2π) over ~400ms, and lifts z by 0.3. Cursor becomes ✳. Its alt text appears as a Lora italic 14px line under the canvas, left-aligned to the container, not over the card, not in mono.
- Click or Enter: a plain lightbox: the full photo centered on white with a 1px line border, alt text beneath in Lora, Esc or click-outside closes. The canvas keeps rendering behind at 40% opacity. 200ms fade. No zoom animation.
- Leave: the card resumes rotating from where it stopped.

Performance:

- dpr [1, 1.5], antialias off, one canvas. `frameloop="always"` only while the section is in view (IntersectionObserver → setFrameloop), `"demand"` otherwise.
- Cap at 16 cards. On mobile, 8 cards, no pointer tilt.

Accessibility:

- The canvas is aria-hidden. A visually hidden list of buttons, one per photo with its alt text, sits beside the canvas so keyboard and screen-reader users can open any photo in the lightbox. Focus moves into the lightbox on open and back to the trigger on close.

Do not:

- Overlay any text, badge, caption, or number on the cards.
- Add shadows, glow, reflections, or a dark ground.
- Couple rotation or position to scroll.
- Auto-open or auto-focus a card.
- Add a reduced-motion branch.

## 8. Verify before finishing

- Hero: full-color photo at scroll 0%, 50%, 100%; no tint anywhere on the page.
- Hover the hero: ✳ ✦ ★ sprites are real glyph shapes, rotating, scattering from the cursor, returning.
- Mission rotator: single line at 1440px, word underlined in gold, ends on "you." and stops.
- Goldy mark in the nav.
- Puzzle: run shuffle 20 times programmatically; assert every state is solvable and "A little help" returns a legal move that reduces the heuristic.
- Gallery: log the bounding-box center of the card positions after layout; it must be within 0.05 units of (0, 0) at 1440×900 and at 390×844. Confirm every card's source photo has `candid == true`. Hover one card and confirm it faces the camera and shows alt text below.
- Run `scripts/guardrails.sh`. Attach screenshots of hero, mission, gallery, and puzzle at 1440×900 and 390×844.
