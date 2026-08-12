---
description: Load the ColorStack UMN design bundle and act on it
argument-hint: [sync | landing | check | <question>]
---

Design source of truth lives in `design/`. Nothing auto-syncs from the design
tool; `design/` is a vendored drop. Never hand-edit it.

Read now, in order:
- @design/CLAUDE.md
- @design/LANDING-PAGE.md
- @design/BUNDLE.md

`design/LANDING-PAGE.md` SUPERSEDES `design/UX-SPEC.md` for the website.
Editorial styling (IBM Plex Mono, No. indexes, Fig. captions) is /newsletter only.
No pills. No em dashes in body copy. Tokens only, from `design/tokens/`.
The NavBar is already implemented - do not rebuild it.

Now handle: $ARGUMENTS

- `sync`     -> read design/BUNDLE.md, diff design/ against what the code
               implements, list what drifted. Do not change code yet.
- `landing`  -> open design/reference/LandingPage.dc.html, then propose the
               next unbuilt slice from LANDING-PAGE.md Build order. Stop
               before writing code and wait for go.
- `check`    -> audit the repo against the Definition of done in
               design/LANDING-PAGE.md. Report violations with paths. No fixes.
- anything else -> answer it from the bundle. Quote the file and line you used.

Never invent stats, quotes, a meeting location, or sponsor logos. The
testimonials in the reference are placeholders and must not ship.
