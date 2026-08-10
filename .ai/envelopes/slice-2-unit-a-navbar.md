ROLE:        .claude/agents/implementer.md — read it first, it binds you.

SLICE:       global-chrome (slice 2), Unit A

GOAL:        Build a sticky desktop NavBar and a mobile sheet that traps focus, closes on Esc, and returns focus to the trigger.

SPEC:        design/UX-SPEC.md §2 — these lines bind you:

  "Global nav (desktop): logo left · Events Newsletter Opportunities About right ·
   Join as a gold pill CTA, always last."
  "Global nav (mobile): logo + hamburger. Sheet slides down, full-bleed maroon,
   links in Archivo 32px, Join pill pinned at the bottom of the sheet."
  "Depth rule: nothing is more than 2 clicks from /. No mega-menu. No dropdowns
   in the primary nav."

  Also binding — §5.1.1: the NavBar is sticky, sits on cream, and gains a 1px
  --hairline bottom border on scroll. §6: links underline on hover with a
  --gold-soft highlighter swipe and a --maroon-light ↗ marker when external;
  focus is 2px --focus-ring at 2px offset; no scale or shrink transforms.
  §8: the sheet traps focus and closes on Esc; targets are at least 44×44px.

FILES YOU MAY WRITE:
  src/components/NavBar.astro
  src/components/MobileSheet.astro

FILES YOU MAY READ:
  src/styles/*.css, src/data/nav.ts, src/layouts/Base.astro,
  design/tokens/*.css, design/BRAND-SYSTEM.md,
  design/reference/Chapter Notes Newsletter.html, .ai/plans/global-chrome.md

TOKENS:      Only names declared in src/styles/{colors,typography,spacing}.css.
             Route data comes from src/data/nav.ts — import it, do not restate
             the routes and do not edit that file.

DONE WHEN:
  1. npm run build and npx astro check are both clean, and .githooks/pre-commit
     passes on your diff.
  2. Every interactive element shows a 2px --focus-ring ring at 2px offset under
     keyboard focus. No outline suppression anywhere.
  3. The sheet opens from the hamburger, keeps Tab inside itself while open,
     closes on Esc, and returns focus to the hamburger.
  4. Every transition and animation sits inside
     @media (prefers-reduced-motion: no-preference).
  5. Zero literal hex values, zero literal font stacks. The logo is rendered
     from public/images/colorstack-umn-logo.png with no border, no recolor,
     no crop, and real alt text.

FORBIDDEN:   new dependencies; new hex values; new fonts; touching another
             slice's files; editing src/data/nav.ts, src/layouts/Base.astro,
             src/styles/, design/, or design/UX-SPEC.md. Do not mount your
             components anywhere — the orchestrator wires them into Base.astro.
             Do not create pages to satisfy nav links; /events, /newsletter,
             /opportunities, /about and /join do not exist yet and will 404 in
             dev. That is expected.

REPORT:      diff summary, one line per file; which DONE assertions pass; open
             questions. No prose essays, no summarizing the spec back.
