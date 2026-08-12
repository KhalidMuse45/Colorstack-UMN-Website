# Repository map

Start here if you are new, human or agent. Every path below is where it is on
purpose. If you cannot find something in under thirty seconds, that is a bug in
this file, so fix this file.

## The one rule that outranks the rest

`design/` is a **vendored drop** from the design session. Never hand-edit
anything inside it. Corrections go back through the design session and return
as a new bundle. See `design/BUNDLE.md` for provenance and known gaps.

## Where things live

```
/                       config and the three documents that must sit at root
  README.md               project overview, quick start
  CLAUDE.md               orchestrator constitution, binds every agent
  HANDOFF-LOG.md          the ledger. Root is mandated by CLAUDE.md
  package.json            scripts: dev, build, check, lint, lint:links
  astro.config.mjs        static output, sitemap, /motion-lab excluded
  opencode.json           model routing for delegated opencode panes
  .guardrail-allow        per-path guardrail exemptions, each needs a ledger line

design/                 VENDORED. Do not edit.
  LANDING-PAGE.md         current spec for the website. SUPERSEDES UX-SPEC.md
  UX-SPEC.md              original spec. Still authoritative for /newsletter
  BRAND-SYSTEM.md         the rationale behind the rules
  BUNDLE.md               provenance, deviations, known bundle gaps
  tokens/                 source tokens. Copied into src/styles/, never imported
  reference/              LandingPage.dc.html and the newsletter, reference only
  components/motion/      the nine React primitives, as .jsx.txt behavioural refs
  agents/                 planner / implementer / reviewer role definitions

docs/                   everything written for humans and agents
  README.md               this file
  NEXT.md                 WHAT IS LEFT. Read this first if you are picking the project up
  CONTRIBUTING.md         how to branch, commit, and open a PR
  AGENTS.md               how the multi-agent loop actually runs here
  OWNERSHIP.md            which role may write which paths
  templates/
    envelope.md           the delegation envelope template. Copy, do not edit
  history/                finished work. Read for context, never update
    RECON.md              audit of the pre-revamp site
    plans/                slice plans, as executed
    envelopes/            the envelopes those slices were run from
    reviews/              review verdicts and audits

src/
  pages/                  one file per route
    index.astro           the home page
    motion-lab.astro      internal gate route, noindex, all nine primitives
  layouts/
    Base.astro            html shell, token import order, skip link, chrome
  components/
    chrome/               NavBar, MobileSheet, Footer. Every page gets these
    motion/               the nine ported primitives. Behaviour, not layout
  data/                   the content layer. Copy lives here, not in pages
    nav.ts                routes and chapter identity strings
    landing.ts            every string, photo and link on the home page
  styles/                 THE TOKEN LAYER. The only place a literal hex is legal
    styles.css            imports the other three, in cascade order
    colors.css  typography.css  spacing.css

public/                 served verbatim at the site root
  fonts/                  self-hosted woff2, latin subset
  images/                 photos. The .webp files are generated placeholders
  CNAME                   custom domain, survives every build

scripts/
  guardrails.sh           brand rules, tree-wide. What CI runs
  gen-placeholders.mjs    regenerates the placeholder photos. Hand-run, not a build step

.githooks/pre-commit    the same brand rules, staged files only
.github/                CI, deploy, CODEOWNERS, PR template
.claude/                Claude Code agent definitions and slash commands
```

## Where do I put a new file?

| Adding | Put it in |
| --- | --- |
| A new route | `src/pages/` |
| A section of the home page | `src/components/landing/`, create it |
| Something every page shows | `src/components/chrome/` |
| Reusable animation behaviour | `src/components/motion/` |
| Copy, links, photo lists | `src/data/`, never inline in a page |
| A colour, size or radius | `src/styles/`, and only if no token fits |
| A photo | `public/images/`, as `.webp`, with width and height at the call site |
| Notes on finished work | `docs/history/`, and a line in `HANDOFF-LOG.md` |

## Things that will fail your commit

`.githooks/pre-commit` and `scripts/guardrails.sh` enforce these. They are
deliberately identical, so a local commit and CI never disagree.

- A literal hex outside `src/styles/`. Use `var(--token)`.
- `outline: none` anywhere.
- A gradient or `backdrop-filter`, except inside `src/components/motion/`,
  where `backdrop-filter` is allowed and `linear-gradient` is allowed only on a
  line that also says `mask`.
- Misspelling the chapter name. It is **ColorStack**: capital C, capital S, one
  word. A lowercase s or an all-caps spelling both fail the commit. (This file
  cannot show you the wrong forms, because the rule would reject this file.)

`docs/history/` is exempt, because those documents quote violations in order to
forbid them.

## Landing page rules that catch people out

From `design/LANDING-PAGE.md`, which supersedes `UX-SPEC.md` for the site:

- **No pills.** 10px on controls (`--radius-control`), 14px on media and cards
  (`--radius-media`). `--radius-pill` is newsletter and print only.
- **No IBM Plex Mono on the site.** Labels are Archivo 700 at `--text-label` /
  `--tracking-label`. Mono is `/newsletter` only.
- **No em dashes in body copy.** Commas or full stops. Code comments are fine.
- **No invented anything.** No stats, quotes, sponsor logos or meeting location.
  If data is missing, ship the empty state and log it in `HANDOFF-LOG.md`.
- Motion must degrade: with JavaScript off or reduced motion on, nothing may
  sit at `opacity: 0`. Server HTML renders the final state; scripts only add.
