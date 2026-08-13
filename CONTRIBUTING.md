# Contributing

Thanks for working on this. It is a real student organisation's public site, so a few
things are stricter here than in a class project. Everything that matters is on this page.

## Setup

Clone, install and run the site by following [Local development](README.md#local-development)
in the README. Do not skip the `git config core.hooksPath .githooks` line. It is per clone
and it is what installs the checks below.

## Before you commit

```bash
npm run check     # astro check: 0 errors, 0 warnings, 0 hints
npm run lint      # brand and accessibility guardrails
npm run build     # must complete
```

`.githooks/pre-commit` runs the guardrails over your staged files. CI runs
`scripts/guardrails.sh`, which runs the same checks over every tracked file. The two are
kept deliberately in sync, so a commit that passes locally will not be rejected by CI.

## What actually fails a commit

Three rules, taken from `scripts/guardrails.sh`. Everything else is review, not machinery.

1. **No literal hex colour** in `.css`, `.astro`, `.jsx`, `.tsx`, `.svelte` or `.vue`. The
   only exceptions are the four token files, `src/styles/colors.css`,
   `typography.css`, `spacing.css` and `styles.css`. Anywhere else, use `var(--token)`.
   If the token you need does not exist, ask rather than inventing a value.
2. **No `outline: none`**, in the same set of file types. See accessibility below.
3. **ColorStack casing**: capital C, capital S, in every `.html`, `.js`, `.ts`, `.jsx`,
   `.tsx`, `.astro`, `.json` and `.md` file. The one permitted exception is the clone URL
   `https://github.com/KhalidMuse45/Colorstack-UMN-Website`, because the repository slug
   itself is misspelled upstream.

The vendored design drop, CI config and this repository's own notes are excluded from the
scan. If you believe you have a genuine exception, explain why in the pull request.

## Never invent chapter data

This is the rule that matters most, and no tool can catch it for you.

Do not add member counts, offer or internship numbers, testimonials, quotes, names,
meeting times or locations unless you can trace them to a file in this repository. This
site is read by recruiters and by prospective sponsors, and a fabricated statistic
misleads them on the chapter's behalf. Plausible-looking filler is worse than an empty
slot, not better.

If data is missing, leave the slot out entirely and add it to
[`docs/CONTENT-NEEDED.md`](docs/CONTENT-NEEDED.md). A section
that renders nothing is the correct outcome, not a bug to be papered over.

## Accessibility

Two rules that are not up for discussion.

- **Every interactive element keeps a visible focus ring.** Never write `outline: none`.
  If you replace the default ring, the replacement has to be clearly visible when the
  element is reached by keyboard.
- **All motion is gated behind `prefers-reduced-motion`.** A reader with reduced motion on
  sees the finished state immediately, never a broken or empty layout. The server HTML
  must render the final, visible state; scripts may only add the hidden one. A component
  that starts hidden and reveals itself in a script strands its content for anyone whose
  JavaScript did not run.

## Two boundaries

**Copy lives in `src/data/*.ts`, not inline in components.** Strings, links and image
captions go in the data file for that page. This lets the e-board correct wording without
touching layout, and it keeps a single place to check when copy is questioned.

**`design/` is a vendored drop. Never hand-edit it.** It arrives from the design session
as a whole bundle, and a local fix there is silently overwritten on the next pull. If you
find a mistake in it, and five have been found so far, note it in the pull request and
send it upstream.

## Opening a pull request

Branch off `main`, keep one topic per branch, and run the three commands above before you
push. In the description, say what you changed and call out anything you did differently
from the spec, along with the reason. If your change leaves follow-up work, add it to
[`docs/ROADMAP.md`](docs/ROADMAP.md) so the next person can pick it up.
