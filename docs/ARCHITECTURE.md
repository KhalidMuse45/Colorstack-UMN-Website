# Architecture

How the site is put together, and where to put a new file.

## Stack

Astro, static output, **no runtime JavaScript framework and no client-side
dependencies**. Every interactive piece is a small vanilla script scoped to its
component. That is a deliberate constraint: the site is mostly text and photos,
and a framework would cost more than it returns.

## Where things live

```
src/
  pages/          one file per route, composes section components
  layouts/        Base.astro: <head>, fonts, nav, footer, skip link
  components/
    chrome/       NavBar, MobileSheet, Footer. On every page
    landing/      sections of the home page, one component each
    motion/       reusable animation primitives, used across pages
  data/           ALL COPY LIVES HERE. One module per page
  styles/         design tokens. The only place a literal hex may appear
public/           served as-is: fonts, images, CNAME
assets-src/       photo masters. Not served. Sources for re-crops
design/           vendored design authority. NEVER hand-edit
scripts/          guardrails.sh, the tree-wide brand check
.githooks/        pre-commit, the staged-file version of the same check
```

## The two rules that shape everything else

**1. Copy lives in `src/data/*.ts`, never inline in a component.** The e-board
should be able to change a headline without touching layout. If you find
yourself typing a sentence into an `.astro` file, it belongs in a data module.

**2. Motion degrades.** The server renders the **final, visible** state, and
scripts only ever *add* the hidden one. A component that starts hidden and
reveals in a script strands its content for anyone with JavaScript off,
reduced motion on, or a script that threw.

That second rule has real teeth. `Reveal.astro` follows it, so use it rather
than writing your own reveal. It also has a measurable payoff: the reveal
system used to arm elements that were already on screen, which cost **2.4
seconds of LCP** until it was fixed to skip them.

## Adding a new page

1. Add the copy to a new `src/data/<page>.ts` with a header comment saying what
   it is and where each fact came from.
2. Add `src/pages/<page>.astro`, wrap it in `Base.astro`, give it a real title
   and description.
3. Compose it from existing components. Read `src/components/` before writing a
   new one.
4. Delete the route from the `--skip` list in the `lint:links` script in
   `package.json`. Those skips exist only for routes that 404 today, and
   leaving one in means the link checker stops protecting the route.

## The design drop

`design/` is vendored from a separate design process. Never hand-edit it.

It is the authority on **what the site should say and be**, not gospel on how
to build it: five separate bugs have been found in its React reference
components, so treat it as a reference to check rather than copy. The Astro
components in `src/components/motion/` are ports, not wrappers, and where they
differ from the reference the difference is documented in the component.

- `UX-SPEC.md` — page contents and information architecture
- `LANDING-PAGE.md` — supersedes UX-SPEC for landing page styling
- `BRAND-SYSTEM.md` — the reasoning behind the visual language
- `tokens/` — the source of the CSS custom properties copied into `src/styles/`

## Gates

Three commands, all of which CI also runs:

    npm run check    # astro check, types across .astro files
    npm run lint     # brand guardrails, tree-wide
    npm run build    # must succeed

`.githooks/pre-commit` runs the same brand checks against staged files, so a
local commit and CI never disagree. `scripts/guardrails.sh` refuses to report
success if it scans an implausibly small number of files, because a check that
cannot fail is not a check.
