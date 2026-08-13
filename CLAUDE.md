# Working on this repository

Notes for anyone, human or AI, making changes here. Start with
[README.md](README.md) to run the site, [CONTRIBUTING.md](CONTRIBUTING.md) for
the workflow, and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it is
put together.

## The four rules

Everything else is a preference. These are not.

**1. Never invent chapter data.** No member counts, offer numbers,
testimonials, quotes, names, meeting times or locations that you cannot trace
to a file in this repository. This is a real student organisation's public
site, read by recruiters and sponsors. A fabricated statistic is a claim made
on the chapter's behalf that nobody actually made. If a fact is missing, leave
the slot out and add it to [docs/CONTENT-NEEDED.md](docs/CONTENT-NEEDED.md).

**2. Motion degrades.** The server renders the final, visible state. Scripts
only ever add the hidden one. A component that starts hidden and reveals in a
script strands its content for anyone with JavaScript off, reduced motion on,
or a script that threw.

**3. Accessibility is not styling.** Every interactive element keeps a visible
focus ring; never `outline: none`. All motion sits behind
`prefers-reduced-motion`. Images carry alt text describing what is actually in
the frame.

**4. `design/` is a vendored drop.** Never hand-edit it. Five bugs have been
found in its reference components, so check it rather than trusting it.

## Animation is encouraged

There is no list of banned visual techniques, and there used to be. Motion,
gradients, animated gradients, shimmers, glow, blur, masks, scroll-triggered
and staggered effects are all fair game, grounded in the chapter's maroon and
gold.

Aim for fast and deliberate: quick movement, slight deceleration, a crisp
stop. If the reader has to wait to read the content, the effect has failed.

Four things every effect must still do, because they are engineering rather
than taste: cause no layout shift, respect reduced motion, keep a truthful
resting state, and be built as a reusable component with props rather than
hard-coded to one string. `src/components/motion/NumberRoll.astro` is the
worked example.

## Conventions worth keeping

Break them when there is a reason, and say so in the commit.

- Copy lives in `src/data/*.ts`, not inline in components.
- Prefer `var(--token)` over a literal hex. Hardcoded colours are what drift
  when the palette changes.
- "ColorStack" is capital C, capital S. It is the organisation's name.
- Reuse a primitive in `src/components/motion/` before writing a new one.
- No new dependencies without saying what they cost. The landing page's LCP
  budget is 2000ms and it currently measures 1744ms, so a framework would put
  it over.

## Three traps that have cost real time

**Verify against the filesystem and the build output, not your own report.** An
agent once made a correct edit, stashed it, and reported success; it was caught
only because a built file came out byte-identical to the baseline. Another
verified a transform by reading the inline style, which was the one property
that was correct while the rendered result was wrong.

**A check that cannot fail is not a check.** `scripts/guardrails.sh` now
refuses to report success on an implausibly small scan, because run from a
worktree under the wrong bash it returned no files and silently passed.

**`as?: string` in an Astro `Props` interface silently voids the whole
interface.** The component still compiles, `astro check` reports zero errors,
and nothing on it is type checked. Use the generic form, as in
`src/components/motion/Reveal.astro`.
