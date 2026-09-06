# 06 — Astra's design notes, reconciled

Astra shipped a `Design Notes` file with the first demo ("The Room Turns On"). Its reasoning is stronger than what it built. This page says what we adopt from it, what we adapt, and what we overrule, so the next build inherits the thinking without re-inheriting the wall of labels.

## Adopted as written

These go into the spec verbatim or near it.

- **"The room turns on" is the name of the hero moment.** Use it in code comments, in the Sanity field description, and when briefing anyone. It is the one major emotional release on the page. Everything after it uses stillness.
- **Scroll input stays native.** The pin is a sticky stage inside a 250vh parent; a small rAF damping smooths the visual, and nothing intercepts wheel, touch or keyboard. (This is compatible with Lenis; Lenis is the damping. If Lenis ever fights the pin on a device, drop Lenis before you drop native scroll.)
- **The canvas stops rendering after the hero.** `frameloop="demand"` once the ScrollTrigger leaves, plus a hidden-document stop. Astra's line: the page has earned attention, it can now use stillness.
- **Eight glyph sprites, not twenty-four.** Drift at the edges, scatter from the pointer, return gently. They never move text, cover links, or follow past the hero. `HeroScene.tsx` updated.
- **Grain only on the photographic plane.** Never on surfaces. Astra's reason is the right one: it links the opening to a chapter-photo archive, it is not a texture for fashion.
- **One 8% clip-path wipe on program photos, once.** Text and spec rows never fly in. Replaces the v1 "full inset wipe."
- **The mission phrase cycles once and holds on "you."** Not a loop. Reduced motion shows "you." immediately.
- **The pull quote is the chapter's own voice, not a testimonial.** No name, no role, nothing that implies one.
- **No statistics until a person signs their name to them.** Astra went further and shipped none; that is also acceptable for launch. The spec sheet renders only confirmed stats, and if there are fewer than two, it does not render at all.
- **Provenance files.** `SOURCES.json` (which photo, who supplied it, posed or candid, permission) and `QA-REPORT.json` (what was actually exercised: fallback, reduced motion, GPU, keyboard) ship with every build. Add both to the "done" definition in `README.md`.
- **Rose as a change in interpersonal distance, not a section color.** The whole belonging section turns rose so the page moves from public introduction to a closer conversation. Keep that framing; it explains why rose appears once.
- **Gold is permission, not decoration.** It underlines the inclusive phrase, marks the active piece in the play section, and makes the final invitation obvious. Nowhere else.

## Adapted

**The play beat.** Astra replaced the drag-card deck with an eight-tile sliding word puzzle that assembles the page's own sentence, solvable by construction, A* hints, no timer, no score, no gate before joining. That is a better idea than the card deck: the student builds the message rather than swiping photos. We keep the puzzle as the primary play component (`whimsy/RoomPuzzle.tsx`) and demote `CardDeck` to an alternate. The sentence is e-board copy, not designer copy; until the chapter writes one, use the mission rotator's last state: `You have a place in this room ✳`. The v1 demo's mono "keyboard hint" over the puzzle is gone; the puzzle explains itself with its first tile.

**The caption.** Astra's table has a caption rising at 85–94% "so that only after recognition do we identify the moment and make the image evidence." Good reasoning, applied too widely: the build put a caption on every photo. Rule stands: the hero caption is the only caption on the landing page, it is optional, it comes from Sanity, and there is exactly one string, not two stacked ones.

**Program "quiet captions and metadata."** Astra's notes want each program photo followed by "title, narrative and metadata." The metadata line is what became the `01 / Learn By Doing` image tags. Keep title and narrative. Drop the metadata line on the landing page. On the `/programs` page, where a program has a real cadence (`Thursdays · Keller 3-180`), a single mono line under the title is real information and allowed.

**Hairlines.** Astra uses a 1px rule to "separate chapters, programs and facts, establishing reading order without boxing every thought." Agreed for programs and facts. Not as a section opener on every section; the H2 and whitespace do that.

## Overruled, with the reason

**Cream rather than white.** Astra's case: cream makes the page a chapter publication rather than software marketing, and carries both the arrival's seriousness and the later warmth without a second identity. That is true of the reading experience and false of the motion. Against cream the duotone lift is a warm-to-warm shift and the wipes lose their edge; against white the room visibly turns on. So the compromise in `05` is the decision: **white is the ground the motion happens on; cream is the surface people read on.** Reading column, pull-quote band, spec sheet and the newsletter page are cream. Astra's argument survives where it is right, which is the newsletter and the long-form pages. It does not get the hero.

**The hero's chrome.** Astra's arrival beat lists "a single editorial entrance." The build shipped an eyebrow, a rotating tagline, a lede, a location line, a scroll cue and two captions. The notes describe the right thing; the build did not do it. Four elements above the fold. See `05`.

**"IBM Plex Mono for every label, caption and metadata row."** Astra's reason ("information looks recorded, not advertised") is exactly why it should be rare: when everything is recorded, nothing is. Mono for the gutter index, `[ Menu ]`, the spec sheet keys, the footer, and one optional row on editorial pages.

## Astra's progress table, reconciled

This replaces the hero table in `02`.

| Scroll | Wordmark | Photo (canvas) | Other | Reason (Astra's, kept) |
|---|---|---|---|---|
| 0% | Full size, rolled in once on load (850ms, 32ms per character) | Below the stage, duotone maroon → white | Lede and one gold pill | Let the student register the name before a scene |
| 0–43% | Contracts toward masthead position | Aperture opening | Lede and pill recede | The institution becomes the frame, the students the subject |
| 0–60% | Locked as nav wordmark | Aperture reaches full viewport; scale 1.00 → 1.35 | Nav ground turns solid white | Recognition grows from a glimpse into a room you can enter |
| 60–69% | — | `uMix` 0 → 1: duotone lifts to original color | — | **The room turns on.** The one release |
| 85–94% | — | Holds | Optional single caption rises 30px | Only after recognition do we name the moment |
| After | — | Canvas stops rendering | Page uses stillness | Attention has been earned |

## What this changes in code

- `HeroScene.tsx`: sprite count 24 → 8, positioned at edges; `frameloop` handoff to `demand` after the pin ends; `uMix` window 0.60–0.69.
- `Reveal.tsx`: `wipe` mode is an 8% inset, not 100%.
- `TextRoll.tsx`: 850ms / 32ms stagger defaults.
- `TextLoop` (to port): plays once, holds on the last item.
- `SpecSheet.tsx`: returns null with fewer than two confirmed stats.
- New: `whimsy/RoomPuzzle.tsx` spec (in `02`); `CardDeck` becomes optional.
- New: `SOURCES.json` and `QA-REPORT.json` templates in `next/`.
