# Contributing

This site is mid-rebuild against a vendored design system. Before you write anything, read **[`.ai/README.md`](.ai/README.md)** — it is the map: current slice status, where the spec lives, the pane contract, and the gotchas already paid for.

## Setup

Requires Node `^20.19` or `>=22.12`.

```bash
npm install
git config core.hooksPath .githooks   # required — enables the brand guardrails
npm run dev                           # http://localhost:4321
```

`core.hooksPath` is per-clone and not set automatically. Skip it and you will push commits that violate the brand rules.

## Before you open a PR

```bash
npm run build     # must be clean
npm run check     # astro check — 0 errors, 0 warnings
```

## What will fail your commit

Enforced by `.githooks/pre-commit`:

- A literal hex value anywhere except `src/styles/{colors,typography,spacing,styles}.css`. Everywhere else it is `var(--token)` or nothing.
- Suppressing a focus outline. Every interactive element keeps a visible 2px gold ring at 2px offset.
- Gradients, radial gradients, or `backdrop-filter`. The brand is flat.
- Misspelling **ColorStack** — capital C, capital S, always.

## What will fail review

Not machine-checkable, equally binding. Full text in [`design/UX-SPEC.md`](design/UX-SPEC.md) §9.

- Page ground is `--cream`. Never white.
- Three layout faces only: Archivo (display), Lora (body), IBM Plex Mono (meta). iCiel Gotham is the logo wordmark and never appears in a layout.
- Hairline rows and mono meta rows where the spec calls for them. No card grids — they turn the editorial voice into a SaaS template.
- All motion gated behind `prefers-reduced-motion`. Decorative glyphs are `aria-hidden` and `pointer-events: none`.
- **No invented stats, member counts, testimonials, or sponsor logos.** If the data is missing, leave the slot out and log it in [`HANDOFF-LOG.md`](HANDOFF-LOG.md) under `## Blocked`.

## Two boundaries that matter

**`design/` is vendored — never hand-edit it.** It is an upstream drop from the design session. Corrections go back through that session and return as a new bundle; see [`design/PULL-FROM-DESIGN-CHAT.md`](design/PULL-FROM-DESIGN-CHAT.md). A local "fix" gets clobbered on the next pull and the divergence outlives you.

**`src/styles/` is the token layer.** The four files there are copies of `design/tokens/`. Do not redeclare a token, and do not add a value that does not already exist — a missing token is an escalation, not an invention. The one sanctioned divergence is `typography.css`, which self-hosts the fonts instead of using the bundle's runtime Google Fonts import; that is documented in the file itself.

## Branching & ownership

- Branches are named `revamp/<slice-name>` — **one slice per branch**.
- Parallel work within a slice runs on **disjoint file sets** — never the same file.
- Who owns which path, how to claim work, and how to extend a feature without crossing a boundary: [`.ai/OWNERSHIP.md`](.ai/OWNERSHIP.md).

## Logging your work

Append to [`HANDOFF-LOG.md`](HANDOFF-LOG.md). It is how the next person — human or agent — resumes without re-deriving your reasoning. Record deviations and their justification, not just what changed.
