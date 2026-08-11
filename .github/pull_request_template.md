<!-- One slice per branch: revamp/<slice-name>. Full rules: CONTRIBUTING.md -->

## Before you open a PR

- [ ] `npm run build` — clean
- [ ] `npm run check` — 0 errors, 0 warnings
- [ ] `git config core.hooksPath .githooks` is set and the pre-commit hook ran

## What the hook enforces (double-check the diff)

- [ ] No literal hex values outside `src/styles/{colors,typography,spacing,styles}.css` — `var(--token)` or nothing
- [ ] No suppressed focus outlines — every interactive element keeps the visible 2px gold ring at 2px offset
- [ ] No gradients, radial gradients, or `backdrop-filter`
- [ ] "ColorStack" — capital C, capital S, always

## Ledger

- [ ] Work logged in `HANDOFF-LOG.md` — deviations with justification, missing data under `## Blocked`
