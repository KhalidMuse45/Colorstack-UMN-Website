# ColorStack UMN — Design Direction (current)

Single source of truth as of 2026-09-06. Supersedes the numbered docs for direction; they remain as history and detail (`docs/01`–`06`). If this file and a numbered doc disagree, this file wins.

## The idea

A student collective that publishes. The site reads like a research lab whose research is people: a confident editorial cadence, image-led storytelling, one avant-garde WebGL moment, and a moment of play before the invitation. Form follows the student's emotional state, in this order:

| Beat | Feeling | What the page does |
|---|---|---|
| Arrival | This is serious, and it is mine | White ground, ink-black Archivo wordmark, one italic line, one gold pill |
| Recognition | Wait, those are my people | The summit photo opens from below and turns from maroon duotone to color. **The room turns on.** |
| Trust | They actually run things | Four programs with photographic evidence, a spec sheet of confirmed facts |
| Belonging | Being first in my family is fine here | The page turns rose and speaks in second person |
| Play | I want to stay | A sliding word puzzle that assembles the page's own sentence, then the unblocked invitation |

References and what each contributes: Taste Labs (cadence, bracket menu, a toy at the end, floating cards), Pentagram case studies (photo → pull quote → photo, metadata sidebar, Next band), Anthropic (warmth on paper, contained scroll-zoom on feature images), Poolside (indented side panel nav on editorial pages), teenage engineering (flat spec-sheet labels), Ramp and Linear (fluid, pinned, scrubbed scrolling).

## Non-negotiables

**Color.** Hexes live only in `lib/tokens.ts` and `app/globals.css`.

| Token | Hex | Job |
|---|---|---|
| page | `#FFFFFF` | Ground. Photos and motion happen on white |
| surfaceWarm (alias cream) | `#FBF5EC` | Reading columns, pull-quote band, spec sheet, newsletter page |
| maroon | `#7A0019` | Chapter ownership: wordmark, active index, emphasis, Next band, duotone dark stop |
| maroonDeep | `#5B0013` | Hover and pressed only |
| gold | `#FFCC33` | Permission: the inclusive phrase underline, the active puzzle piece, the primary pill. Nowhere else |
| goldSoft | `#FFDE7A` | Link hover highlighter |
| ink / inkSoft | `#1F1A17` / `#5C534E` | Body / secondary |
| line | `#E8DCCB` | 1px borders |
| rose | `#C6887F` | The belonging section and duotone grounds. Rose is a change in interpersonal distance, not a section color |
| stackYellow / teal / pink | `#FCB432` / `#2E9E91` / `#F0426B` | National accents. One per page at most, never a ground |

No decorative gradients. No shadows heavier than a 1px hairline. Duotone (grayscale multiplied on maroon or rose) is the only photo treatment.

**Type.** Archivo 700–900 display, hero at `clamp(46px, 10.5vw, 132px)`, leading 0.96, tracking −0.03em. Lora 400–600 body at 17px/1.55, ledes in italic. IBM Plex Mono 11px uppercase +0.08em only for: the gutter index numbers, `[ Menu ]`, spec-sheet keys, the footer, and at most one dated row on editorial pages. iCiel Gotham is the logo only.

**Shape.** Pills for buttons. 12px cards, 6px small elements. 1px hairlines as structure (grids, the spec sheet), not as section openers. Spacing 4/8/12/16/24/32/48/64/96/128.

**Labels are off by default.** No `Fig.` captions, image tags, meta-notes, scroll cues, coordinate lines, keyboard hints, or "Chapter Index" headings. The one allowed caption is the hero's, optional, from Sanity, one string. If the image can speak, let it.

**Voice.** Students are "you," the chapter is "we." "ColorStack" with capital C and S. Title Case headings. No em dashes in prose. One exclamation point per paragraph. Glyphs `✳ ✦ ★` instead of emoji or icons.

**Content.** Real chapter photos only, with truthful alt text and recorded provenance. No stats without a name and date on them. No invented events, testimonials, sponsors or offers. The pull quote is the chapter's own voice, never a fabricated testimonial.

**Logo.** Chapter mark only. Never bordered, obstructed or recolored.

**Accessibility.** Gold focus ring, never `outline:none`. Reduced motion is a first-class path: no canvas, no pin, no roll, no loop, no wipe; the same story in reading order.

## The landing page

Left-aligned 12-column grid, max 1320px. Sticky gutter index `01…06` in mono on desktop, no heading, current item as a maroon dot.

**Nav.** Mascot mark + wordmark, then About · Programs · Events · Newsletter · Opportunities · Resources · Wunderbar, then the gold `Join the List` pill. Transparent over the hero, solid white with a 1px line once the hero locks. Mobile: `[ Menu ]` bracket to a full-screen white sheet. Wunderbar is the e-board's peer-to-peer mock interview platform; it links to a coming-soon page with a waitlist until it ships.

**Hero: the room turns on.** Above the fold is four things: wordmark, italic lede, one gold pill, photo. Pinned with 150vh of extra travel; native scroll, Lenis as damping.

| Scroll | Wordmark | Photo (canvas) | Other |
|---|---|---|---|
| 0% | Rolled in once on load (850ms, 32ms/char) | Below the stage, duotone maroon → white | Lede, pill |
| 0–43% | Contracts toward masthead | Aperture opening | Lede and pill recede |
| 0–60% | Locked as nav wordmark | Full viewport, scale 1.00 → 1.35 | Nav turns solid |
| 60–69% | — | Duotone lifts to color | — |
| 85–94% | — | Holds | Optional caption rises 30px |
| After | — | Canvas stops rendering | Stillness |

Shader: one cover-fit plane; UV zoom, 3px pointer displacement, luminance duotone, `smoothstep(0.60, 0.69)` mix to color, grain on the plane only. Eight glyph sprites at the edges scatter from the cursor and never cross copy. Mobile: no displacement, no sprites. Reduced motion: a static color `<img>`.

**Mission.** H2 `We're building the room we wanted as freshmen.` Two Lora paragraphs. Rotator `Building a space for … you.` with a gold underline on the target word; cycles once, holds on "you."

**What We Do.** Pentagram rhythm on white: full-bleed photo (one 8% wipe, once), then title left and body right. No metadata line. Between programs 2 and 3, a cream band with the single pull quote: `Every board seat is a student one.` No cards, no hover effects.

**Spec sheet.** Cream band, hairline grid, mono keys, Archivo 900 values rolling once. Renders only with two or more confirmed stats; otherwise the band is omitted. Confirmed today: `100+ Members`, `10+ Offers`. Lora italic aside beside it.

**Who We Show Up For.** Rose ground, white text. `If you're the first in your family to do this, you're in the right place.` One duotone portrait cycling with a wipe.

**In the Room.** `This is what a Tuesday looks like.` 2×2 grid, duotone that turns to color on hover. One marginalia note in the gutter, Lora italic: `we meant it about the snacks.` Up to two glyph stickers rotated 8–14°.

**Voices.** Renders only with two or more real testimonials in Sanity.

**Get in Touch: the puzzle.** Eight-tile 3×3 slide puzzle whose tiles are the words of one sentence, shuffled by legal moves so it is always solvable; A* hints; 180ms tile moves; no timer, score, or gate. Placeholder sentence until the e-board writes theirs: `You have a place in this room ✳`. Directly beneath, unblocked: email input + gold pill, chapter email with click-to-copy, socials.

**Next band.** Full-width maroon, `Next: About the chapter`, the next page's photo peeking up on hover.

**Footer.** Mono is fine here. Full sitemap, Contact, Sponsor us, Privacy, chapter mark bottom-right.

## Reusable patterns for other pages

- **FloatingCards** (Taste Labs): the Events page hero. 10–14 flyers as textured planes on white, drifting, tilting toward the cursor, click brings one forward with title, date and RSVP beneath. Reduced motion: a static grid.
- **SideNav** (Poolside): editorial pages. A 12px-radius bordered panel top-left with the Goldy mark and `Chapter Notes · Issues · About · Back to site`. Cream on white pages, white on cream pages.
- **ZoomImage** (Anthropic): contained image entering at scale 0.86 / 12px corners, settling to 1.0 / 0px over ~60vh, headline and one pill on top. Newsletter headers, event pages, Wunderbar, CTA bands. Never the landing hero.
- **MetaSidebar** (Pentagram): About page. `Founded · Members · Meets · E-Board · National chapter · Advisors`.

## Motion budget

One easing: `cubic-bezier(.22,1,.36,1)`, 0.8s, 0.15s stagger. Lenis at `lerp: 0.09`. One canvas per page. Hero scrub ≤ 0.6. Images: one 8% wipe, once. Text: the hero roll only. Springs: glyph stickers only. Nothing else moves. If a later section starts competing with the hero, cut it back.

## Stack

Next.js 15 App Router · Sanity v3 (studio at `/studio`) · GSAP + ScrollTrigger · Lenis · React Three Fiber + drei · Framer Motion (drag only) · CSS Modules on custom properties, no Tailwind. Guardrails: literal hex outside the two token files, `outline:none`, ColorStack casing, em dashes in copy. Every build ships `SOURCES.json` (photo provenance) and `QA-REPORT.json` (what was actually tested).

## Definition of done for a build

- Four elements above the fold
- Zero captions, tags, notes or cues unless the hero caption is set in Sanity
- At most one mono row outside the spec sheet and footer
- White ground; cream on reading surfaces only
- All eight nav items on desktop, `[ Menu ]` on mobile, Wunderbar present
- Canvas stops after the hero; reduced-motion path exercised
- `SOURCES.json` and `QA-REPORT.json` filled in honestly
