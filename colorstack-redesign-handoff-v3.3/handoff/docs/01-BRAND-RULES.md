# 01 — Brand Rules

These are the constraints that survive. Everything else in the old `design/` folder is reference, not law.

**Retired:** `design/LANDING-PAGE.md` (the "no pills, no mono, light tint" addendum) and the taste-based checks in `scripts/guardrails.sh`. Reasons at the bottom.

## Color

Hexes live in two files only: `next/lib/tokens.ts` (JS, read by the shader) and `next/app/globals.css` (CSS custom properties). Nowhere else.

**Revised in 05:** the page ground is white. Cream is a secondary, warm surface for reading columns, the spec sheet, pull quotes and the newsletter page.

| Token | Hex | Use |
|---|---|---|
| `maroon` | `#7A0019` | Primary. Headers, buttons, section grounds, duotone dark stop |
| `maroonDeep` | `#5B0013` | Hover / pressed |
| `maroonLight` | `#900021` | Meta labels on cream |
| `gold` | `#FFCC33` | Highlight, focus ring, primary CTA fill |
| `goldDark` | `#FFB71E` | Gold pressed |
| `goldSoft` | `#FFDE7A` | Link hover highlighter swipe |
| `page` | `#FFFFFF` | Page background. Motion and photos sit on white |
| `surfaceWarm` (alias `cream`) | `#FBF5EC` | Reading columns, spec sheet, pull-quote grounds, newsletter |
| `paper` | `#FFFFFF` | Cards on cream surfaces. On white, cards use a 1px `line` border and no fill |
| `ink` | `#1F1A17` | Body text |
| `inkSoft` | `#5C534E` | Secondary text |
| `line` | `#E8DCCB` | 1px borders on cream |
| `rose` | `#C6887F` | Duotone / editorial section grounds |
| `stackYellow` | `#FCB432` | The only ColorStack yellow. Sparingly |
| `teal` | `#2E9E91` | National accent. Sparingly |
| `pink` | `#F0426B` | National accent. Sparingly |

Rules:
- UMN maroon and gold carry the identity. National accents are seasoning: one per page at most, never a background.
- No gradients as decoration. A shader mixing two flat colors is not a gradient; a CSS `linear-gradient` background is.
- No drop shadows heavier than `0 1px 0 rgba(31,26,23,.08)`.

## Type

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display | Archivo | 700–900 | Leading 0.96–1.12, tracking −0.01 to −0.03em. Hero `clamp(46px, 10.5vw, 132px)`, H1 40, H2 28, H3 20 |
| Body | Lora | 400–600 | 17px, leading 1.55. Ledes and intros in italic: the italic lede is a signature |
| Meta | IBM Plex Mono | 400–500 | 11px, uppercase, tracking +0.08em. Sticky index numbers, `[ Menu ]`, spec-sheet keys, footer. That is the whole list |

- iCiel Gotham Bold is the logo wordmark only. Never headlines or UI.
- Mono is back on the web, but as seasoning. Rule from 05: at most one mono meta row per page outside the spec sheet and footer. No captions on photos by default, no image tags, no mono "notes" over sections. If the image can speak, let it.

## Shape

- Buttons and chips: full pills, `999px`. Pills echo the logo's stacked bars. The old addendum's "no pills" is reversed.
- Cards: 12px. Small elements: 6px. Media: 12px, or square-cornered when full-bleed.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Hairlines: 1px `rgba(31,26,23,.3)` on white or cream, `rgba(255,255,255,.35)` on maroon. Use them as structure (grids, the spec sheet), not as section openers.

## Imagery

- Warm, candid, real chapter photos only. No stock, no generated people.
- Duotone is the editorial treatment: grayscale multiplied onto maroon or rose. The hero shader does this in GLSL; elsewhere use CSS `mix-blend-mode: multiply` over a solid ground.
- No filters beyond duotone. No background textures. No SVG illustration.
- Photos of identifiable members are used with chapter permission. Keep alt text truthful.

## Decoration

- Glyphs `✳ ✦ ★` instead of emoji or icon fonts. Rotated 8–14° when used as stickers.
- Pressed-flower and etching images may be multiply-blended onto cream as stickers.

## Voice

- Fun, enthusiastic, student-to-student. Students are "you", the chapter is "we".
- "ColorStack": capital C, capital S. Always.
- Title Case for headings. Sentence case for UI labels.
- One exclamation point per paragraph, max.
- No em dashes in body copy (chapter preference). Commas or full stops. Meta rows may use an em dash between the `№` index and the label; that is a typographic device, not prose.

## Logo

- Chapter mark only (maroon ground, gold S, block M, Goldy). Never the national green/yellow mark.
- Never bordered, obstructed, or recolored. Minimum 24px height on web.
- Sits bottom-right on generated graphics.

## Interaction

- Hover: gold-soft highlighter swipe on links, `↗` marker appears. Maroon darkens to `maroonDeep`.
- Press: darkens further. Never shrink, never scale below 1.
- Focus: 2px gold ring, 2px offset. `outline: none` is banned.
- Always respect `prefers-reduced-motion`.

## Guardrails that survive

Replace `scripts/guardrails.sh` with checks for exactly these:
1. No literal hex outside `lib/tokens.ts` and `app/globals.css`.
2. No `outline: none` / `outline:none`.
3. "ColorStack" casing.
4. No em dash in string literals under `content/` or in Sanity portable text.

Everything else (gradients, transforms, pills, fonts, dependency bans) is removed from lint. Visual direction is decided per request, not enforced by grep.

## Why the addendum is retired

`design/LANDING-PAGE.md` scoped the editorial layer (mono, `№`, hairlines, duotone, pills) to print and stripped it from the web. The redesign's direction is the opposite: a stark, editorial, research-lab site with one avant-garde WebGL moment. Keeping the addendum would make the brief illegal. The nine dependency-free motion primitives it mandated are superseded by GSAP, Lenis and R3F; they stay in git history only.
