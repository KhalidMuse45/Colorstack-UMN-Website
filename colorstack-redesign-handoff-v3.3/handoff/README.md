# ColorStack UMN — Redesign Handoff (v3)

**Start with `DESIGN.md`.** It is the consolidated current direction. The numbered docs below hold the detail and the decision history; where they disagree with `DESIGN.md`, `DESIGN.md` wins.

| # | File | What it settles |
|---|------|-----------------|
| 0 | `README.md` | This index. How agents should work. |
| ★ | `DESIGN.md` | The one-file current direction. Read first. |
| 1 | `docs/01-BRAND-RULES.md` | The only hard constraints that survive. Retires `design/LANDING-PAGE.md` and the old guardrails. |
| 2 | `docs/02-LANDING-REDESIGN.md` | Page-by-page spec for `/`. Section order, copy, motion, hero WebGL scene. |
| 3 | `docs/03-STACK-AND-MIGRATION.md` | Next.js App Router + Sanity + GSAP/Lenis/R3F. Astro → Next migration plan. |
| 4 | `docs/04-SANITY-CONTENT-MODEL.md` | Schemas, queries, editing workflow for the e-board. |
| 5 | `docs/05-REVISIONS.md` | What changed after the first Astra demo: white canvas, labels stripped, full nav, board patterns. Read this before 02. |
| 6 | `docs/06-ASTRA-NOTES-RECONCILED.md` | Which of Astra's design-notes arguments we adopt, adapt, or overrule, and why. |
| — | `next/` | Drop-in React components, tokens, GSAP/Lenis/R3F setup. |
| — | `sanity/` | Schema types ready for `sanity init`. |

## For agents

- **Brand rules win.** If anything in `02`, `03`, or the components conflicts with `01`, `01` is correct and the other file has a bug. Fix the other file.
- **`design/LANDING-PAGE.md` is retired.** Do not read it for direction. `design/UX-SPEC.md` is reference only; where it conflicts with `01`, `01` wins.
- **Copy comes from `src/data/landing.ts`** (Astro repo) until Sanity is populated. Do not invent stats, quotes, sponsor logos, or meeting locations. The voices array is intentionally empty until the chapter supplies real quotes.
- **One canvas per page.** The hero owns WebGL. Nothing else gets a `<Canvas>`.
- **Labels are off by default.** No `Fig.` captions, image tags, meta-notes or scroll cues. See 05.
- **Motion is orchestrated, not scattered.** The hero zoom is the memorable moment. Everything after it is quiet: clip-path wipes on images, one text roll on entry, spring only on glyph stickers.
- **Every build ships `SOURCES.json` and `QA-REPORT.json`** (templates in `next/`). Photo provenance and what was actually tested.
- **Reduced motion is a first-class path**, not a fallback. Every animated component ships a static equivalent.
- Component files are TypeScript React for Next 15 App Router. `"use client"` is marked where required. Server components by default.
