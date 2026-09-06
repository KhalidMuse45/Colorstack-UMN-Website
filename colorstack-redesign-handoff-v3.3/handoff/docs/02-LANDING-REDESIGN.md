# 02 — Landing Page Redesign (`/`)

> Revised per `05-REVISIONS.md`: white canvas, labels stripped, full nav, three board patterns added. Where this file and an older Astra build disagree, this file wins.

## Positioning

A student collective that publishes. The site reads like a research lab whose research is people: stark cadence, image-led storytelling, a metadata spine, and one moment of play at the end. References: Taste Labs (cadence, bracket menu, footer toy), Pentagram case study pages (image → pull-quote → image rhythm, metadata sidebar, "Next" band), Anthropic (warmth on paper, hand-made whimsy), teenage engineering (tiny flat labels, spec-sheet tone).

White canvas, maroon, gold, cream as the warm reading surface. No new colors.

## Where the boldness goes

One place: the hero. The photo zoom with the duotone lifting to color is the memorable thing. Every section after it is quiet and disciplined. If a later section starts competing with the hero, cut it back.

## Layout concept

Left-aligned throughout. A 12-column grid, max 1320px, 24px gutters, 20px page padding on mobile. Long copy sits in columns 1–7 (max 60ch for Lora). Photos may break the grid and run full-bleed. On desktop a sticky page index sits in the left gutter (column 1, 40px wide) listing `01 … 06` in mono; current index in a maroon dot. No heading on it, no `№`.

```
┌──────────────────────────────────────────────────────────────┐
│ ⓜ ColorStack UMN   About Programs Events Newsletter          │  nav, white
│                    Opportunities Resources Wunderbar  (Join)  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ COLORSTACK                                                   │  hero, pinned 150vh
│ UMN                                                          │  four elements only
│ A home for Black and Latinx CS students at the U... (italic) │
│ (Join the List)                                              │
│                                                              │
│ ░░░░░░░░░░░░░░░ duotone photo, bottom 45% ░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░  scales to fill, turns color  ░░░░░░░░░░░░░░ │
├──────────────────────────────────────────────────────────────┤
│ We're building the room we wanted as freshmen.               │  white
│ Building a space for [Black students.] ← TextLoop            │
├──────────────────────────────────────────────────────────────┤
│ Four things we run all year.                                 │  white
│ ┌────────photo────────┐  Workshops                           │
│ │                     │  Git, interview data structures...   │
│ └─────────────────────┘                                      │
│ ┌ cream ─────────────────────────────────────────────────┐   │
│ │  “Every board seat is a student one.”                  │   │  pull quote on cream
│ └────────────────────────────────────────────────────────┘   │
│ ┌────────photo────────┐  Leadership ...                      │
├──────────────────────────────────────────────────────────────┤
│ ┌ cream ─────────────────────────────────────────────────┐   │
│ │ MEMBERS      OFFERS       FOUNDED      MEETS           │   │  spec sheet on cream
│ │ 100+         10+          ·            ·               │   │
│ └────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ rose:  If you're the first in your family...                 │
│ white: This is what a Tuesday looks like. (grid)             │
│ white: (voices marquee, empty until real quotes)             │
│ white: (drag-card toy + mailing list)                        │
├──────────────────────────────────────────────────────────────┤
│ → Next: About the chapter                                    │  next band, maroon
├──────────────────────────────────────────────────────────────┤
│ footer, mono, chapter mark bottom-right                      │
└──────────────────────────────────────────────────────────────┘
```

## Section spec

### Hero (`components/hero/Hero.tsx` + `HeroScene.tsx`)

Pinned scene, 150vh scroll travel beyond the viewport, scrubbed. Named "the room turns on." Full table with Astra's reasoning in `06`.

| Scroll | Wordmark | Photo (canvas) | Other |
|---|---|---|---|
| 0% | Full size, rolled in once on load | Below the stage, duotone maroon → white | Lede and one gold pill |
| 0–43% | Contracts toward masthead position | Aperture opening | Lede and pill recede |
| 0–60% | Locked as nav wordmark | Full viewport; scale 1.00 → 1.35 | Nav ground turns solid |
| 60–69% | — | Duotone lifts to color: the room turns on | — |
| 85–94% | — | Holds | Optional single caption rises 30px |
| After | — | Canvas stops rendering | Stillness |

Shader (`heroShader.ts`): one full-screen plane, cover-fit. Uniforms: `uTexture`, `uProgress` (0–1 from ScrollTrigger), `uPointer` (normalized, eased), `uTime`, `uMaroon`, `uCream`, `uGrain`. Effects, in order: UV zoom by progress, 3px pointer displacement (falls off with distance), luminance → duotone mix, blend to source color by `smoothstep(0.60, 0.69, uProgress)`, film grain at 0.035 on the plane only.

Glyph field: eight `✳ ✦ ★` sprites drift at the edges of the canvas, scatter from the cursor, return gently. Same canvas. They never cover text or links. Drop them if frame time on a mid-range laptop exceeds 8ms.

Reduced motion: no canvas. `<img>` with `object-fit: cover`, the color version, static at full size. Wordmark and lede render immediately.

Mobile (< 768px): canvas stays, pin distance 120vh, no pointer displacement, no glyph field.

Copy (from `landing.ts`):
- Wordmark: `ColorStack UMN`
- Lede: `A home for Black and Latinx computer science students at the U, where you find your people, sharpen your craft, and land the offer.`
- CTA: `Join the List` (gold pill, external to Logicform)
- No eyebrow. No second CTA. No scroll cue. No location line. No caption unless set in Sanity.

Above the fold is four things. If a build adds a fifth, remove it.

### Mission

H2 in Archivo 800 at 40px, two Lora paragraphs from `mission.body`, then the rotator line: prefix in Lora, target word in Archivo 700 maroon with a gold underline, cycled once by TextLoop at 2.4s per item. Ends on "you." and holds; it does not loop. Reduced motion shows "you." immediately. Nothing else moves.

### What We Do

Pentagram rhythm: full-bleed 16:9 photo (one 8% clip-path wipe on enter, once), then a two-column row: title (Archivo 700, 28px) left, body (Lora) right. No metadata line under the title on this page. Between programs 2 and 3, one PullQuote in Lora italic 32px on a cream band that runs edge to edge: `“Every board seat is a student one.”` Photos are color, not duotone, here. No cards, no borders, no hover effects. The section is long on purpose.

### Spec sheet (`SpecSheet.tsx`)

Sits on a cream band. Renders only if two or more stats are confirmed; otherwise the band is omitted entirely. Hardware-label treatment. Four cells across (two on mobile), 1px hairline grid, no fills. Mono key top-left of each cell, Archivo 900 value at 64px. NumberRoll on first entry. Cells with unconfirmed data render a `·` and a mono note `confirm with e-board` in dev only. Confirmed: `100+ Members`, `10+ Offers`. The aside from `statsAside` sits right of the grid in Lora italic.

### Who We Show Up For

Rose (`#C6887F`) ground, full-bleed section. Text in cream. Headline `If you're the first in your family to do this, you're in the right place.` One duotone portrait (grayscale multiply on rose) right of the copy, cycling through `community.roll` on a 4s interval with a wipe.

### In the Room

Four-photo grid, 2×2, gutters 24px, 12px radius. Photos load as maroon duotone via CSS multiply; on hover (or on scroll into view on touch) the overlay fades and the photo turns color. Headline `This is what a Tuesday looks like.`

### Voices

Marquee of quote cards, Lora italic, paper cards, 12px radius, 1px line border. **Renders nothing until `testimonials` has at least two documents in Sanity.** No placeholders.

### Get in Touch (`whimsy/RoomPuzzle.tsx` primary, `CardDeck.tsx` alternate)

The play beat. Astra's sliding word puzzle beats the card deck (see `06`): an eight-tile 3×3 slide puzzle whose tiles are the words of one sentence, shuffled by legal moves from the solved state so it is always solvable. The solved sentence is the page's message. Until the e-board writes one, use `You have a place in this room ✳`. The active tile carries a gold mark; the empty cell is a 12px card outline. Tile moves are 180ms position transitions, no celebration animation. A `Hint` text link (A* with Manhattan distance) and a `Shuffle` text link sit under the grid in Lora, not mono. No timer, no score, no completion required.

Directly beneath, unblocked: the mailing-list form (email input + gold pill `Join the List`), the chapter email with click-to-copy, Instagram, LinkedIn. The invitation never waits on the puzzle.

Reduced motion: tiles move without transition. The puzzle still works.

`CardDeck` (drag-to-stamp photos) stays in the repo as an alternate for pages that want it, e.g. the Events page footer.

### Next band (`NextBand.tsx`)

Full-width maroon, 120px tall, `Next: About the chapter` in Archivo 700 white. On hover the About page's lead photo slides up from the bottom edge to 40% height.

### Footer

Mono here is fine: it is the footer. Chapter mark bottom-right, 32px. Full sitemap, contact email with click-to-copy, socials. `© 2026 ColorStack UMN · Not affiliated with the University of Minnesota` (confirm wording with chapter).

## Navigation (`ui/Nav.tsx`)

Desktop: mascot chapter mark left (24px), wordmark, then eight links, then the gold pill. White ground, 1px `line` bottom border appears after the hero locks.

| Label | Route | Notes |
|---|---|---|
| About | `/about` | Mission, e-board with photos, advisors, national chapter, sponsors |
| Programs | `/programs` | The four programs, each with its own page |
| Events | `/events` | Upcoming + past. Uses `FloatingCards` hero |
| Newsletter | `/newsletter` | Chapter Notes archive. Editorial treatment, cream reading column, `SideNav` |
| Opportunities | `/opportunities` | Internships, referrals, scholarships, conference funding |
| Resources | `/resources` | Interview prep, résumé guide, Git guide, Discord/GroupMe links |
| Wunderbar | `/wunderbar` | The e-board's peer-to-peer mock interview platform. Coming-soon page with waitlist until it ships |
| Join | Logicform | Gold pill. Always visible |

Mobile: mark + wordmark + `[ Menu ]` bracket. Full-screen white menu with the eight links in Archivo 700 at 40px, socials and contact email at the bottom.

Footer adds `Contact`, `Sponsor us`, `Privacy`.

## The three board patterns

From the annotated inspiration board (Taste Labs / Poolside / Anthropic). Each is one reusable component.

**FloatingCards (Taste Labs) — Events page hero.** A cloud of 10–14 event flyers and photos as textured planes in R3F, drifting slowly, tilting a few degrees toward the cursor, sitting on white. Hover raises a card; click brings it to the front and shows the event's title, date and RSVP pill beneath the canvas. On the landing page, an optional smaller version (6 cards) may sit in the Events teaser between In the Room and Get in Touch. Reduced motion: a static 3-column grid.

**SideNav (Poolside) — editorial pages.** A rounded (12px), 1px-bordered panel fixed top-left, containing the Goldy chapter mark and a short vertical list: `Chapter Notes · Issues · About · Back to site`. Cream panel on a white page, or white panel on a cream reading page. Collapses to the `[ Menu ]` bracket below 900px.

**ZoomImage (Anthropic) — feature images and CTA bands.** A contained image (max 1320px, not full-bleed) that scrolls in at scale 0.86 with 12px corners and settles to scale 1.0 with 0px corners over roughly 60vh of scroll, headline and one pill sitting on top in white. Plain GSAP, no canvas. Use for newsletter issue headers, event pages, the Wunderbar coming-soon page, and the final CTA band on any page. Not on the landing hero, which keeps the WebGL zoom.

## Motion budget

- Easing: `cubic-bezier(.22,1,.36,1)`, 0.8s, 0.15s stagger. Define once in `lib/gsap.ts`.
- Scroll: Lenis, `lerp: 0.09`, synced to GSAP ticker.
- Hero: ScrollTrigger pin + scrub 0.6.
- Images: one 8% clip-path wipe (`inset(0 0 8% 0)` → `inset(0)`) on enter, once.
- Text: TextRoll on hero wordmark only, 850ms, 32ms per character, once. Everywhere else, no per-character effects.
- Stickers: spring `{ stiffness: 260, damping: 18 }`, once, staggered 0.1s.
- Hover on links: gold-soft highlighter, 200ms, `background-size` trick.

Nothing else animates. If an agent adds a fade-and-rise to every section, remove it.

## Whimsy allowance (per page)

- Up to two glyph stickers, rotated 8–14°, never on the hero canvas as DOM elements.
- One marginalia note in the outer gutter, Lora italic 14px, `inkSoft`. Landing: `we meant it about the snacks.` beside In the Room.
- Custom cursor `✳` in gold over interactive elements, desktop only.

## Copy rules for this page

- No stats, quotes, logos or locations that are not in `landing.ts` or Sanity.
- No em dashes in prose.
- "ColorStack" casing.
