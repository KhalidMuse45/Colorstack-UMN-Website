# Landing Page — Handoff Addendum

Supplements the base handoff. Read `README.md` and `UX-SPEC.md` first; this file covers only the landing page built after that spec was written.

## What changed since the spec

`UX-SPEC.md` describes an editorial site: mono meta rows, `№` section indexes, `Fig.` captions, hairline architecture. **That treatment is now scoped to `/newsletter` and print only.** The website drops it.

Landing page rules that supersede the spec:

| Element | Spec said | Now |
| --- | --- | --- |
| Section labels | `№ 03 — Who We Show Up For`, IBM Plex Mono | `Who we show up for`, Archivo 700, 12.5px, `0.16em`, uppercase, `--maroon-light` |
| Small text / captions | IBM Plex Mono | Archivo 600. Mono does not appear on the site at all |
| Corner radius | pill (`999px`) | 10px controls, 14px media and cards. **No pills anywhere** |
| Photo treatment | maroon duotone | light tint: `saturate(1.04) contrast(1.03) brightness(1.02)` on `#F3E9DA` |
| Section rhythm | hairline rows | motion-led sections; hairline only as an internal divider |

Body copy uses **no em dashes**. Commas or full stops instead. This is a chapter preference, not a typographic accident — keep it when you write new copy.

## Source of truth

`templates/landing-page/LandingPage.dc.html` in the design system. It renders standalone in a browser. Read it as the reference implementation: section order, copy, photo crops, and every motion call site.

**Photos are not in this bundle.** They already exist in the repo. `reference/LandingPage.dc.html` points at `./img/*`, so its image slots will render empty when opened standalone — that is expected. Repoint those paths at wherever the repo keeps them, and preserve the `object-position` crop values in the reference; they were tuned per photo.

## The motion components

Nine primitives ship in the design system bundle. They are hand-written, dependency-free equivalents of the motion-primitives library — no npm, no Tailwind, no `motion` package.

| Component | Where it is used |
| --- | --- |
| `TextRoll` | hero wordmark, CTA headline — characters roll up on entry |
| `TextLoop` | mission rotator; also the photo roll in "Who we show up for" (`stack`) |
| `PhotoReveal` | programs carousel tiles — photo + progressive-blur caption |
| `ProgressiveBlur` | the layered blur inside `PhotoReveal`; usable standalone |
| `InfiniteSlider` | programs marquee, testimonials marquee (`reverse`) |
| `AnimatedGroup` | "In the room" photo grid |
| `TextEffect` | per-character fade/blur — alternative to `TextRoll` |
| `Accordion` | not on the landing page; available for FAQ pages |
| `LiquidMenu` | fixed gooey CTA, bottom right |

Each has a `.d.ts` next to it in `components/motion/` with full prop docs. Read those before wiring anything.

### Two ways to consume them

**A. Port the source (recommended).** The nine sources are in `components/motion/` with a trailing `.txt` on each filename — strip it first:
```bash
cd components/motion && for f in *.jsx.txt; do mv "$f" "${f%.txt}"; done
```
(The suffix keeps the design-system compiler from treating these handoff copies as a second component set. See `components/motion/RESTORE.md`.)

Then copy the folder into your source tree. They are plain React with no imports beyond `react`. `types.d.ts` carries the prop declarations for all nine; keep it beside them.

**B. Use the upstream library instead.** If you would rather depend on motion-primitives:
```bash
npm install motion clsx tailwind-merge
npx shadcn@latest add "https://motion-primitives.com/c/text-roll.json"
```
```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```
Prop names were deliberately kept close to upstream, so the swap is mostly an import change. **Caveat:** upstream requires Tailwind. This project's tokens are plain CSS. Picking B means adding Tailwind, which fights `tokens/*.css`. Do not do it without asking.

## Known trap: whitespace children

Every component that maps over `React.Children` must filter whitespace-only text nodes:
```js
React.Children.toArray(children)
  .filter(c => c !== null && c !== undefined && !(typeof c === 'string' && c.trim() === ''))
```
JSX newlines between sibling elements become string children. Without the filter you get empty grid cells, blank marquee slots, and blank frames in the loop. This bit three components during the build. The shipped source already handles it — preserve it if you refactor.

Second trap: numeric props arriving as strings (`height="400"` → `"400"`, an invalid CSS length React silently drops). The components coerce with a `len()` helper. Keep it.

## Section order

1. Sticky nav — **you already have this. Keep yours.** Match the type and the 10px CTA radius only.
2. Hero: eyebrow, `TextRoll` wordmark, italic Lora line, two buttons
3. Full-bleed group photo
4. Maroon stat band: `100+` members, `10+` offers
5. Mission: headline + two paragraphs, then the `TextLoop` rotator on a hairline
6. What we do: `InfiniteSlider` of four `PhotoReveal` tiles
7. Who we show up for: gold popout plate + stacked `TextLoop` photo roll, copy right
8. In the room: `AnimatedGroup` photo grid
9. Voices: reverse `InfiniteSlider` of testimonial cards
10. Get in touch: maroon band, `TextRoll` headline, mailing-list form
11. Contact us: hairline channel rows
12. Split closer: two full-height panels, gold and near-black
13. Footer

## Build order

Do these as separate slices, integrating between each. Do not fan out across slices.

1. **Port motion components** — copy the nine files, verify each renders in isolation before touching the page. Gate: a scratch route showing all nine.
2. **Hero + stat band** — `TextRoll`, full-bleed photo, maroon numbers.
3. **Mission + TextLoop.**
4. **Programs carousel** — `InfiniteSlider` + `PhotoReveal`. Highest-risk slice; the measurement logic is subtle. Gate: marquee loops with no visible seam or stutter.
5. **Community + In the room + Voices.**
6. **Get in touch + Contact + split closer + footer.**
7. **Polish** — reduced-motion audit, keyboard path, Lighthouse.

## Definition of done — landing page

Additions to the base checklist in `README.md`:

- [ ] Zero `border-radius: 999px` / `rounded-full` in landing-page code
- [ ] No IBM Plex Mono on the site (newsletter only)
- [ ] No em dashes in body copy
- [ ] No `№` indexes or `Fig.` captions outside `/newsletter`
- [ ] Every `Children.toArray` call filters whitespace nodes
- [ ] Marquees loop seamlessly at 1280px and 375px
- [ ] Every motion component reveals with `prefers-reduced-motion: reduce` — nothing stranded at `opacity: 0`
- [ ] `PhotoReveal` captions reachable by keyboard and readable on tap
- [ ] Photos load at full resolution, correct crop focus preserved

## One repo change you must make first

`ProgressiveBlur` uses `backdrop-filter`. The pre-commit hook in `.githooks/pre-commit` blocks that string. Before slice 1:

```bash
# .githooks/pre-commit — narrow the glassmorphism rule
# Allow backdrop-filter inside the motion components; keep blocking gradients.
```
Change the gradient/glass grep to exclude your motion component directory, and log the exception in `HANDOFF-LOG.md`. Do not delete the rule wholesale — it is still catching real glassmorphism elsewhere.

## Still open

- **Testimonials are placeholders.** Three cards read "Placeholder quote / Replace". They must not ship. Chapter owes real quotes with names and roles.
- **Meeting location unconfirmed.** No location currently claimed on the page. Do not invent one.
- `img/summit-signage.jpg` is in the grid; swap if the chapter prefers a different shot.
