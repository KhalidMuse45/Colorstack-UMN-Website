# ORCHESTRATION.md — Multi-Agent Operating Manual

## 0. The stack you're running inside

```
Ghostty            terminal / tmux surface — human's eyes
└── herdr          process harness — supervises long-lived processes, restarts, log capture
    └── opencode   agentic harness — session + tool boundary
        └── Claude Code (YOU) = ORCHESTRATOR
            ├── Planner      (read-only, produces plans)
            ├── Implementer  (write, scoped to one slice)
            └── Reviewer     (read-only + test runner, produces verdicts)
```

You own the middle. herdr owns *processes*; you own *tasks*. Do not try to manage restarts, ports, or log tailing — emit the process contract (§2) and let herdr supervise it.

## 1. Pane contract (what the human sees in Ghostty)

Ask herdr to hold five long-lived processes. Substitute your actual herdr invocation; the contract is what matters.

| Pane | Process | Purpose | Restart |
| --- | --- | --- | --- |
| 0 | `opencode` → Claude Code orchestrator | your session | manual |
| 1 | dev server (`astro dev` / `vite`) | live preview | auto |
| 2 | typecheck + lint watch | fast feedback | auto |
| 3 | test/a11y watch (`vitest`, `axe`, `pa11y`) | review gate | auto |
| 4 | `tail -f HANDOFF-LOG.md` | human-readable ledger | auto |

Rules:
- **Never** start a dev server yourself in a foreground tool call — it blocks your session. Declare it in the herdr config and read pane 1's log file instead.
- Every process writes to `.logs/<pane>.log`. Subagents read logs; they never own processes.
- If a pane is red, stop fanning out and fix it. A broken watcher makes every downstream verdict meaningless.

## 2. Node-agent bring-up

Before any delegation, confirm the ground is real:

```bash
node -v && npm -v                 # expect node >= 20
git rev-parse --abbrev-ref HEAD   # confirm you are NOT on main
```

Then create the working branch and the ledger:

```bash
git switch -c revamp/<slice-name>
touch HANDOFF-LOG.md .logs/.keep
```

One branch per slice. One slice in flight at a time on the integration branch; parallel subagents work on **disjoint file sets** within that slice, never the same file.

## 3. Delegation rules

**Fan out when** the work splits into ≥2 file-disjoint units of similar size, each describable in under ~10 lines.
**Do it yourself when** the change is <30 lines, crosses every subagent's files, or is integration glue.

For each delegated task, hand the subagent exactly this envelope — nothing more, nothing less:

```
ROLE:        agents/<role>.md
SLICE:       <name>  (e.g. "global-chrome")
GOAL:        one sentence, testable
SPEC:        UX-SPEC.md §<n> (quote the 3–8 lines that bind you)
FILES YOU MAY WRITE:   <explicit list — creating siblings is allowed, editing outside is not>
FILES YOU MAY READ:    tokens/*.css, reference/, BRAND-SYSTEM.md, <specific source files>
TOKENS:      only from tokens/colors.css, tokens/typography.css, tokens/spacing.css
DONE WHEN:   <3–5 checkable assertions>
FORBIDDEN:   new dependencies, new hex values, new fonts, touching another slice's files,
             editing tokens/, editing UX-SPEC.md
REPORT:      diff summary + which DONE assertions pass + open questions. No prose essays.
```

Context discipline — this is the whole game:
- Give each subagent the **narrowest** slice of spec that binds it. Never paste the whole `UX-SPEC.md` into a subagent.
- Subagents do not talk to each other. All coordination goes through you.
- Kill and re-spawn a subagent rather than letting it accumulate a long, confused history.
- A subagent that reports "I also fixed X" gets its X reverted unless X was in its file list.

## 4. Slice sequence

Follow `UX-SPEC.md` §10. Concretely:

| # | Slice | Parallelizable into | Gate |
| --- | --- | --- | --- |
| 1 | Scaffold + tokens wired | — (you do it) | dev server boots, cream ground renders, 3 fonts load |
| 2 | Global chrome | NavBar / MobileSheet / Footer | keyboard nav, focus rings, reduced-motion |
| 3 | Home `/` | hero / upcoming-events row / newsletter CTA | matches §5.1, no card grid |
| 4 | Content layer | `events.json` / `issues.json` / `team.json` / `jobs.json` + loaders | schema validates, empty states exist |
| 5 | Interior pages | `/about` + `/events` / `/newsletter` + `/jobs` | each page's §5.x |
| 6 | `/sponsor` | — | zero invented numbers |
| 7 | Polish pass | motion / a11y / perf | Lighthouse a11y 100, LCP < 2.0s on 4G |

Integrate and commit after **every** slice. Squash subagent noise into one clean commit per slice with the ledger line in the body.

## 5. Review gate

Nothing merges without a Reviewer verdict. Reviewer returns `PASS`, `PASS WITH NOTES`, or `FAIL + specific defects`. On `FAIL`, re-delegate to the **same** Implementer with only the defect list — do not re-send the original envelope.

Run the `README.md` definition-of-done checklist at every gate. Any unchecked box blocks the merge.

## 6. Escalate to the human, don't guess

Stop and ask when you hit:
- a missing asset (photo, headshot, sponsor logo)
- a form endpoint or third-party service credential
- a licensed font decision
- anything that would require inventing a number

Log it in `HANDOFF-LOG.md` under `## Blocked` and move to the next slice rather than idling.
