ROLE:        .claude/agents/<planner|implementer|reviewer>.md — read it first, it binds you.

SLICE:       <slice-name> (slice <n>), Unit <A|B|C>

GOAL:        <one sentence, testable>

SPEC:        design/UX-SPEC.md §<n> — these lines bind you:

  "<quote the 3–8 lines that bind this unit — never paste the whole spec>"

  <Also binding — any additional sections (§6 interaction, §8 a11y, …) quoted
   or precisely cited, narrowest slice that binds.>

FILES YOU MAY WRITE:
  <explicit list — creating siblings the plan names is allowed,
   editing outside the list is not>

FILES YOU MAY READ:
  src/styles/*.css, design/tokens/*.css, design/BRAND-SYSTEM.md,
  design/reference/Chapter Notes Newsletter.html, docs/history/plans/<slice-plan>.md,
  <specific source files this unit must import or match>

TOKENS:      Only names declared in src/styles/{colors,typography,spacing}.css.
             <Where shared data comes from — import it, do not restate it,
              do not edit that file.>

DONE WHEN:
  1. <3–5 checkable assertions. Typically: npm run build and npx astro check
     clean, .githooks/pre-commit passes on the diff.>
  2. <focus rings: 2px --focus-ring at 2px offset, no outline suppression>
  3. <unit-specific behavior, checkable>
  4. <motion inside @media (prefers-reduced-motion: no-preference)>
  5. <zero literal hex values, zero literal font stacks, …>

FORBIDDEN:   new dependencies; new hex values; new fonts; touching another
             slice's files; editing src/data/*, src/layouts/Base.astro,
             src/styles/, design/, or design/UX-SPEC.md.
             <Unit-specific prohibitions: do not mount components — the
              orchestrator wires them in; do not invent stats, names, numbers,
              or pages for routes that do not exist yet.>

REPORT:      diff summary, one line per file; which DONE assertions pass; open
             questions. No prose essays, no summarizing the spec back.
