# Plan: global-chrome (slice 2)

## Goal
Every page carries a keyboard-navigable NavBar, a focus-trapping MobileSheet, and a four-column Footer, all built from tokens and hairlines rather than boxes.

## Spec basis — UX-SPEC.md §2

> **Global nav (desktop):** logo left · `Events` `Newsletter` `Opportunities` `About` right · **`Join`** as a gold pill CTA, always last.
> **Global nav (mobile):** logo + hamburger. Sheet slides down, full-bleed maroon, links in Archivo 32px, `Join` pill pinned at the bottom of the sheet.
> **Footer:** hairline top rule, 4 columns (Chapter / Explore / Connect / Colophon), mono meta row with copyright + "A ColorStack chapter at the University of Minnesota Twin Cities" + a live-updating timestamp (matches the newsletter masthead device).
> **Depth rule:** nothing is more than 2 clicks from `/`. No mega-menu. No dropdowns in the primary nav.

Also binding: §5.1.1 (NavBar is sticky, cream, gains a 1px `--hairline` bottom on scroll), §6 (link hover = underline + `--gold-soft` swipe + `--maroon-light` `↗` on external; focus = 2px gold at 2px offset; no scale transforms), §8 (skip-to-content, sheet traps focus and closes on `Esc`, targets ≥44×44px).

Where the spec is silent: the live timestamp's format. Default to the reference newsletter's device — `toLocaleTimeString('en-GB', { hour12: false })`, mono, in the meta row.

## File plan

| file | new/edit | responsibility | ~lines |
|---|---|---|---|
| `src/components/NavBar.astro` | new | sticky desktop nav + hamburger trigger | ~140 |
| `src/components/MobileSheet.astro` | new | full-bleed maroon sheet, focus trap, Esc | ~160 |
| `src/components/Footer.astro` | new | 4 columns + mono meta row + live clock | ~170 |
| `src/data/nav.ts` | **done, orchestrator-owned** | route data both units read | — |
| `src/layouts/Base.astro` | **orchestrator, after both units land** | skip link, mount chrome, `<main id="main">` | ~15 |

## Parallel units

- **Unit A** — `src/components/NavBar.astro`, `src/components/MobileSheet.astro`
- **Unit B** — `src/components/Footer.astro`

File-disjoint. Neither unit touches `nav.ts`, `Base.astro`, or the other's files.

## Tokens used
`--cream` / `--surface-page`, `--maroon` / `--accent-primary`, `--maroon-deep`, `--maroon-light`, `--gold` / `--accent-highlight`, `--gold-dark`, `--gold-soft`, `--text-on-maroon`, `--text-on-gold`, `--ink` / `--text-body`, `--ink-soft` / `--text-muted`, `--hairline`, `--hairline-inverse`, `--line` / `--border-default`, `--focus-ring`, `--font-display`, `--font-body`, `--font-mono`, `--text-hero`…`--text-meta`, `--leading-*`, `--tracking-display`, `--tracking-meta`, `--space-1`…`--space-8`, `--radius-pill`.

No value outside this list. Anything missing is an escalation, not an invention.

## DONE assertions
1. `npm run build` and `npx astro check` are clean; `.githooks/pre-commit` passes on the diff.
2. Every interactive element shows a 2px `--focus-ring` ring at 2px offset under keyboard focus; no `outline` suppression anywhere.
3. The mobile sheet opens from the hamburger, traps `Tab` inside itself, closes on `Esc`, and returns focus to the hamburger.
4. Every transition and animation sits inside `@media (prefers-reduced-motion: no-preference)`.
5. Zero literal hex values, zero literal font stacks, zero card grids; section divisions are 1px hairlines.

## Risks
- **Sticky nav + scroll hairline** tempts a scroll listener. Prefer a CSS-only approach if one exists at acceptable fidelity; if JS is required, keep it to a passive listener toggling one class, and log it.
- **Focus trap correctness** is the most likely defect. It must include the close button and the pinned `Join` pill, and must not leak to background content.
- **The live clock** must not cause layout shift as digits change — reserve width with `tabular-nums` or a fixed `ch` width.
- Units A and B will independently reach for a "nav link" style. Duplication is expected at this slice; deduplicating into a primitive is slice 3's job, not theirs.

## Open questions
None blocking. `/join`, `/events`, `/newsletter`, `/opportunities`, `/about`, `/about/team`, `/sponsor` do not exist yet — links will 404 in dev until slices 5–9. That is expected and must not be "fixed" by removing links or inventing pages.
