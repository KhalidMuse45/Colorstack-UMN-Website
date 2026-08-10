ROLE:        .claude/agents/implementer.md — read it first, it binds you.

SLICE:       global-chrome (slice 2), Unit B

GOAL:        Build a four-column Footer closed by a mono meta row carrying the copyright, the chapter affiliation line, and a live-updating timestamp.

SPEC:        design/UX-SPEC.md §2 — these lines bind you:

  "Footer: hairline top rule, 4 columns (Chapter / Explore / Connect / Colophon),
   mono meta row with copyright + 'A ColorStack chapter at the University of
   Minnesota Twin Cities' + a live-updating timestamp (matches the newsletter
   masthead device)."

  Also binding — §6: links underline on hover with a --gold-soft highlighter
  swipe and a --maroon-light ↗ marker when external; focus is 2px --focus-ring
  at 2px offset; no scale or shrink transforms. §8: targets are at least
  44×44px, and the footer is a real <footer> landmark.

  The reference for the meta row is the masthead and footer of
  design/reference/Chapter Notes Newsletter.html — mono 11px, uppercased in CSS
  (never in the source text), +0.08em tracking, 1px hairline above.

FILES YOU MAY WRITE:
  src/components/Footer.astro

FILES YOU MAY READ:
  src/styles/*.css, src/data/nav.ts, src/layouts/Base.astro,
  design/tokens/*.css, design/BRAND-SYSTEM.md,
  design/reference/Chapter Notes Newsletter.html, .ai/plans/global-chrome.md

TOKENS:      Only names declared in src/styles/{colors,typography,spacing}.css.
             Route data and the chapter strings come from src/data/nav.ts —
             import them, do not restate them, do not edit that file.

DONE WHEN:
  1. npm run build and npx astro check are both clean, and .githooks/pre-commit
     passes on your diff.
  2. Every interactive element shows a 2px --focus-ring ring at 2px offset under
     keyboard focus. No outline suppression anywhere.
  3. The live timestamp is progressive enhancement: the page is valid and
     readable with JavaScript disabled, and the clock reserves its own width so
     ticking digits cause no layout shift.
  4. Every transition and animation sits inside
     @media (prefers-reduced-motion: no-preference).
  5. Zero literal hex values, zero literal font stacks. Columns are separated by
     hairlines and whitespace — no card grid, no boxes, no shadows.

FORBIDDEN:   new dependencies; new hex values; new fonts; touching another
             slice's files; editing src/data/nav.ts, src/layouts/Base.astro,
             src/styles/, design/, or design/UX-SPEC.md. Do not mount your
             component anywhere — the orchestrator wires it into Base.astro.
             Do not invent a founding year, a member count, a sponsor, or any
             other number for the Colophon column. If a slot needs data we do
             not have, leave it out and say so in your report.

REPORT:      diff summary, one line per file; which DONE assertions pass; open
             questions. No prose essays, no summarizing the spec back.
