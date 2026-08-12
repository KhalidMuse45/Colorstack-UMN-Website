# Agent and contributor scaffolding

Everything an incoming developer *or* AI agent needs to pick this rebuild up mid-flight. Read this file first.

---

## 1. What this project is

A full rebuild of **colorstackumn.org** against a vendored design bundle. The old site was a single 161-line `index.html` with its own conflicting token system; it was deleted in slice 1. See `history/RECON.md` for the audit that produced that verdict.

The work runs as an **orchestrated multi-agent loop**: one orchestrator decomposes and gates, subagents implement one slice at a time. `../CLAUDE.md` is the constitution and auto-loads in Claude Code.

---

## 2. Where everything lives

| Path | What it is | Editable? |
|---|---|---|
| `../design/` | Vendored design bundle — spec, tokens, reference newsletter | **Never hand-edit.** Corrections go back through the design session; see `../design/PULL-FROM-DESIGN-CHAT.md` |
| `../design/UX-SPEC.md` | **The authority.** IA, page specs, tokens, motion, a11y | read-only |
| `../design/BRAND-SYSTEM.md` | Rationale behind the visual direction | read-only |
| `../design/reference/Chapter Notes Newsletter.html` | The visual north star | read-only |
| `../CLAUDE.md` | Orchestrator constitution — non-negotiables, loop, ledger rules | root by contract |
| `../HANDOFF-LOG.md` | **The ledger.** Slice status, blockers, deviations, dependency justifications | root by contract — a herdr pane tails it |
| `history/RECON.md` | Audit of the pre-revamp site: what was salvageable and where | root |
| `plans/` | One plan per slice, written before fan-out | here |
| `envelopes/` | Ready-to-inject delegation envelopes | here |
| `../.claude/agents/` | Planner / Implementer / Reviewer role definitions | **must stay there** — Claude Code discovers agents from `.claude/agents/` |

Two files deliberately did **not** move into `docs/`: `HANDOFF-LOG.md` (the constitution names it at root, and the ledger pane tails that exact path) and `CLAUDE.md` (auto-loaded from root). `RECON.md` now lives at `docs/history/RECON.md`.

---

## 3. Current position

Slice 1 is done and gated. Slice 2 is planned but **not started** — no implementer has written a file.

| # | Slice | Status |
|---|---|---|
| 1 | Scaffold + tokens + fonts + guardrails | **done** (`7e5b710`) |
| 2 | Global chrome — NavBar / MobileSheet / Footer | planned, envelopes ready |
| 3 | Primitives — MetaRow, FigureBlock, EventCard, JoinBlock, … | not started |
| 4 | Content layer — `content/*.json` + loaders | not started |
| 5 | Home `/` | not started |
| 6 | `/join` + `/events` | not started |
| 7 | `/newsletter` archive + reader | not started |
| 8 | `/opportunities` + `/about` + `/about/team` | not started |
| 9 | `/sponsor` | blocked — needs real reach numbers |
| 10 | Motion + a11y + perf, and the Node 22 / Astro 7 upgrade | not started |

The slice order is reconciled from `../design/ORCHESTRATION.md` §4 and `../design/UX-SPEC.md` §10, which disagree in three places. The reconciliation and its reasoning are in `../HANDOFF-LOG.md`.

---

## 4. Running it

Requires Node `^20.19` or `>=22.12`.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output to dist/
npm run check        # astro check
git config core.hooksPath .githooks   # once per clone — enables the brand guardrails
```

---

## 5. The rules that will fail your commit

These are enforced by `../.githooks/pre-commit`, not by review. Full list in `../CLAUDE.md`.

- **No literal hex outside the token layer.** Only `../src/styles/{colors,typography,spacing,styles}.css` may contain one. Everywhere else: `var(--token)` or nothing.
- **No suppressing focus outlines.** Every interactive element keeps a visible 2px gold ring at 2px offset.
- **No gradients, textures, glassmorphism, or heavy shadows.** The brand is flat.
- **"ColorStack" — capital C, capital S.** Always. The one exception is the GitHub repo slug, which is misspelled upstream; the hook carves that out by exact URL. Rename the repo and that exception should be deleted.

Not hook-enforced but equally binding: page ground is `--cream`, never white. Three layout faces only — Archivo, Lora, IBM Plex Mono; iCiel Gotham is the logo wordmark and never appears in a layout. Hairline rows where the spec says rows — never a SaaS card grid. All motion gated behind `prefers-reduced-motion`. **No invented stats, member counts, testimonials, or sponsor logos** — leave the slot empty and log it in the ledger.

---

## 6. The loop

```
recon → plan → fan out → review → integrate → gate → next slice
```

Never skip review. Never fan out more than one slice deep without integrating. Commit once per slice with the ledger line in the body.

**Fan out** when the work splits into ≥2 file-disjoint units of similar size. **Do it yourself** when the change is under ~30 lines, crosses every subagent's files, or is integration glue — shared data files and layout mounting points are always orchestrator-owned, which is why `../src/data/nav.ts` was written before slice 2 fanned out.

Each subagent gets exactly one envelope (`envelopes/`), never a second task in the same session. A subagent that reports "I also fixed X" gets X reverted unless X was in its write list.

---

## 7. The pane contract

herdr workspace `colorstack` = `w3`. Pane IDs are `w3:pN` — the `3-N` shorthand in some docs is not valid herdr syntax.

| Pane | Tab | Process |
|---|---|---|
| `w3:p1` | orchestrator | the orchestrating agent session |
| `w3:p2` | watch | `npm run dev` → `.logs/dev.log` |
| `w3:p4` | watch | `tail -f HANDOFF-LOG.md` |
| `w3:p3`, `w3:p6` | agents | implementer panes, max 3 concurrent |

```bash
herdr pane split w3:p3 --direction down
herdr agent start <name> --kind opencode --pane w3:pN --timeout 120000
herdr agent prompt w3:pN "$(cat history/envelopes/<envelope>.md)" --wait
herdr agent wait w3:pN --status done --timeout 900
herdr pane read w3:pN --source recent --lines 200
```

Close the pane after collecting — long-lived subagent panes accumulate confused history.

---

## 8. Gotchas already paid for

- **Node 20 pins us to Astro 5.** `astro@7` and current `create-astro` need ≥22.12. The consequence is 3 `npm audit` findings (2 high) that only Astro 7 fixes — all build/dev-time, none shipped in static output. Scheduled for slice 10. Don't "fix" it with `npm audit fix --force`; that silently jumps a major.
- **`../src/styles/typography.css` diverges from `../design/tokens/typography.css` on purpose.** The bundle ships a runtime Google Fonts `@import`; `../design/SETUP.md` §6 forbids it. Faces are self-hosted latin-subset woff2 in `../public/fonts/`. Do not "restore" the import.
- **iCiel Gotham has no `@font-face`.** The binary is absent from the bundle and the chapter mark is a PNG, so nothing needs the face. `--font-logo` stays declared so restoring it is one block.
- **`../public/CNAME` must survive every build.** It carries the apex domain. Don't move it back to the repo root.
- **Links to unbuilt routes will 404 in dev.** That is expected until slices 5–9. Do not remove links or invent pages to make it quiet.
- **This machine ran out of disk mid-slice-2.** If tooling starts failing in strange ways, check `df -h /` before debugging anything else.

---

## 9. Open questions blocking later slices

Tracked in `../HANDOFF-LOG.md` under `## Blocked`. The ones that stop work:

- Mailing-list form endpoint — blocks `/join` and every `JoinBlock`
- Event data source — blocks the home next-event band and `/events`
- Team roster + headshots — blocks `/about/team`
- Slack / GroupMe URLs — required by `UX-SPEC.md` §5.6
- Confirmed reach numbers — blocks `/sponsor` entirely
- Consent for the existing member testimonial and photo
