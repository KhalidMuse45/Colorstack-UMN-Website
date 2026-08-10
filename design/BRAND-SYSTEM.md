# ColorStack UMN Design System

Design system for **ColorStack UMN** — the ColorStack chapter e-board at the University of Minnesota Twin Cities. ColorStack is a national community supporting Black and Latinx computer science students; chapters run events, mailing lists, and social media under the national brand adapted to their school's colors.

Per national brand guidelines ("we encourage you to use your school colors for your branding"), this chapter system pairs **UMN maroon & gold** with ColorStack national accents.

## Sources
- `assets/brand-ref-identity.png` — national Brand Identity page (voice, colors, logos, fonts) — provided as `uploads/Capture.PNG`
- `assets/brand-ref-dos-donts.png` — "Dos & Don'ts of Social Media" chapter marketing sheet — `uploads/doesdont.png`
- `assets/colorstack-umn-logo.png` — official chapter logo (maroon bg, gold ColorStack "S", block M + Goldy) — `uploads/OfficialLogo.png`
- `assets/fonts/iCielGothamBold.ttf` — logo wordmark font binary (LOGO ONLY) — `uploads/iCielGothamBold.ttf`
- `uploads/pasted-1783237605541-0.png` … `pasted-1783237704614-0.png` — four Cargo "Test Studio Notes" reference screens defining the newsletter's editorial architecture: hairline meta rows with timestamps, giant grotesque masthead, duotone portrait on tinted ground, serif body with italic ledes, numbered footnote index, hairline footer.
- User note: chapter logo maroon is HEX `#7A0019`.

## CONTENT FUNDAMENTALS
- **Tone:** "fun, enthusiastic, and community-driven … vibrant and relatable language" (national brand voice). Warm, welcoming, energetic — never corporate.
- **Voice:** speaks to students as "you"; the chapter is "we". Direct calls to action ("Use your school colors", "Join us").
- **Casing:** headings in Title Case; **ColorStack is always spelled with capital C and capital S** (hard rule from Dos & Don'ts).
- **Emoji:** used sparingly in social copy; brand materials favor decorative glyphs (✳ starbursts, ✦ sparkles) over emoji. Avoid emoji in formal comms.
- **Exclamation points** are on-brand ("…for your ColorStack chapter!"). One per paragraph, max.

## VISUAL FOUNDATIONS
Direction: **modern technical editorial** (per the Cargo reference screens) in ColorStack UMN colors.
- **Color:** UMN maroon `#7A0019` (masthead/section grounds, primary actions) + UMN gold `#FFCC33` (highlight). Official UMN secondary palette (Folwell): Dark Maroon `#5B0013`, Light Maroon `#900021`, Dark Gold `#FFB71E`, Light Gold `#FFDE7A` (hover-highlight color for links), grays `#333333/#5A5A5A/#777677/#D5D6D2` — for tone-on-tone pairings. Rose `#C6887F` (maroon tint) grounds duotone sections. National accents sparingly: ColorStack yellow `#FCB432` (never any other yellow — hard rule), teal `#2E9E91`, pink `#F0426B`, coral `#FB6D4C`. Pages are warm cream `#FBF5EC`, cards white.
- **Type:** three-tier editorial stack. Archivo 700–900 (grotesque) for mastheads/headlines, tight leading, −0.01em. Lora serif for body — ledes italic, 1.55 leading. IBM Plex Mono 11px uppercase +0.08em for meta rows, indexes, timestamps. **iCiel Gotham = logo wordmark ONLY, never headlines/UI.**
- **Editorial architecture:** 1px hairline rules (`--hairline`, `--hairline-inverse`) divide everything; each section opens with a mono meta row (№, title, read time); numbered indexes like footnotes; live timestamp in the masthead.
- **Imagery:** duotone treatment — grayscale portrait multiplied onto rose/maroon grounds (Cargo-style halftone feel). Member headshots via image slots.
- **Color:** UMN maroon `#7A0019` (primary, headers, buttons) + UMN gold `#FFCC33` (highlight). National accents used sparingly: ColorStack yellow `#FCB432` (never any other yellow — hard rule), teal `#2E9E91`, pink `#F0426B`, coral `#FB6D4C`. Page background is warm cream `#FBF5EC`, not white; cards are white on cream.
- **Type (legacy note):** Archer was the national body font; no binary provided.
- **Shape language:** pill/rounded-slab shapes echo the logo's stacked bars. Buttons are pills; cards use 12px radius; chips are full pills.
- **Backgrounds:** flat cream pages; solid maroon blocks for hero/footer bands; no gradients, no textures, no photography treatment mandated.
- **Decoration:** small starburst ✳ / sparkle ✦ glyphs in gold or pink as bullet markers and dividers (seen throughout national materials).
- **Shadows:** mostly flat. Cards may use a faint maroon-tinted shadow (`--shadow-card`). No heavy elevation.
- **Borders:** 1px `#E8DCCB` on cream; never put a border around the ColorStack logo (hard rule).
- **Animation:** scroll-triggered editorial reveals — sections fade/rise (0.8s, cubic-bezier(.22,1,.36,1), 0.15s stagger), images wipe open like unfolding paper (clip-path), stickers pop with a spring; the sneak-peek clipping "rips" in. All gated on prefers-reduced-motion and off in email-preview mode.
- **Mixed media / stickers:** collage elements scattered around FIG images — `assets/stickers/pressed-flowers.jpg` and `assets/stickers/dove-etching.webp` (multiply-blended onto cream) plus typographic glyph stickers (✳ ★ ✦) in brand colors, rotated 8–14°, always pointer-events:none.
- **Hover:** links & rows highlight in Light Gold `#FFDE7A` (highlighter-swipe feel) with a Light Maroon `#900021` ↗ marker; maroon → Dark Maroon `#5B0013`; links underline.
- **Press:** darken further; no shrink effects.
- **Imagery:** event photos of members — warm, candid. School logo/mascot goes bottom-right corner of graphics (national rule).
- **Layout:** left-aligned headings with a glyph marker; centered layouts for social graphics; generous whitespace.

## Logo rules (from Dos & Don'ts)
- Use designated ColorStack logos for promotional purposes only.
- Chapters may NOT use the national green-background/yellow-S mark.
- Never obstruct the logo, never border it, never recolor the yellow off `#FCB432` (national) — chapter mark uses maroon/gold.
- School logo or mascot in the bottom-right corner of graphics.

## ICONOGRAPHY
- No icon system was provided. National materials use **unicode/decorative glyphs** (✳ ✦ ✔ ✖) as bullets and accents rather than an icon font.
- Recommendation (intentional addition): if icons are needed, use [Lucide](https://lucide.dev) from CDN at 1.75px stroke, colored `--maroon` — flagged as a substitution, not a brand asset.
- Assets on hand: chapter logo PNG only. No SVG logo, no icon set, no illustrations were provided.

## Index
- `styles.css` — global entry; imports all tokens
- `tokens/` — `colors.css`, `typography.css` (@font-face), `spacing.css`
- `assets/` — chapter logo, brand reference sheets, font binary
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/core/` — Button, Input, Badge, Card (+ cards, prompts, d.ts)
- `templates/newsletter/` — "Chapter Notes" Fall 2026 mailing-list template (DC): masthead + 8 numbered columns (DSA · Discrete Etiquettes · The ColorStack Repo · Rabbit Hole of the Week · Member Spotlight · Recruiter Insight · Behind the Scenes · Question of the Week)
- `SKILL.md` — agent skill entry point

## Intentional additions
- Standard component set (Button, Input, Badge, Card) — no component source existed; sized to the chapter's needs (mailing list, event promos).
- Editorial webfonts (no binaries provided; nearest Google matches to the Cargo reference): Archivo ≈ Helvetica grotesque, Lora ≈ Georgia-class serif, IBM Plex Mono for meta. Swap in licensed fonts if the chapter buys them.

## Caveats
- iCiel Gotham Bold is reserved for the logo wordmark; it is not used in layouts.
- Newsletter headline/body/mono fonts are Google-font stand-ins for the Helvetica/Georgia look in the reference screens.
