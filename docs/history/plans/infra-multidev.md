# Plan — infra-multidev (repo organization, CI/CD, multi-dev scaffolding)

Requested 2026-08-10: make the repo ready for multi-dev use — explicit ownership
boundaries so agents extend features without overstepping each other, lint checks,
link checks, and full CI/CD.

## Recon summary (what exists)

- Astro 5 static site, Node 20 machine. Slice 1 gated; slice 2 planned, unstarted.
- Brand rules enforced only by `.githooks/pre-commit`, staged files only, opt-in
  per clone (`core.hooksPath`). **No CI of any kind.** No lint entry point.
- Deploy is GitHub Pages via `public/CNAME`; no deploy workflow exists — deploys
  are implicitly manual.
- Ownership rules exist but are scattered across `.ai/README.md`, `CONTRIBUTING.md`
  and the constitution — no single map, no CODEOWNERS, no PR template.

## Decomposition — two file-disjoint units

| Unit | Pane | Files | Goal |
|---|---|---|---|
| A — CI/CD | `w9:p2` (v4flash3) | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `scripts/guardrails.sh`, `scripts/README.md` | typecheck + build + tree-wide brand lint + link check on every PR/push; Pages deploy on main |
| B — ownership | `w9:p3` (kimi) → local subagent after pane died | `.ai/OWNERSHIP.md`, `.ai/envelopes/TEMPLATE.md`, `.github/CODEOWNERS`, `.github/pull_request_template.md`, `CONTRIBUTING.md` (extend) | one file answering "who owns this path, how do I claim work" |
| C — docs links | `w9:p4` (DeepSeek V4 Flash Free) | `README.md`, `.ai/README.md`, `.ai/plans/*`, `.ai/reviews/docs-link-audit.md` | every markdown relative link/anchor verified; CI only covers dist/ — added mid-slice when the second implementer pane became available |

## DONE assertions (slice level)

1. `npm run check`, `npm run build`, `npm run lint` all exit 0 on the integrated tree.
2. `bash scripts/guardrails.sh` exits 1 when a literal hex is planted in a tracked `.astro` file, 0 on the clean tree.
3. Both workflow files parse as valid YAML; every third-party action is major-pinned.
4. The pre-commit hook and `scripts/guardrails.sh` agree on every file class they scan (same checks, same exclusions) — a commit that passes locally cannot fail CI's guardrail step, and vice versa.
5. `.ai/OWNERSHIP.md` exists and every ownership claim in it is derivable from `.ai/README.md`, `CONTRIBUTING.md`, or `design/ORCHESTRATION.md`.
6. `.ai/reviews/docs-link-audit.md` exists; zero broken relative markdown links remain in files inside Unit C's write list.

Orchestrator-owned glue (after review): `package.json` npm scripts (`lint`,
`lint:links` if warranted), ledger, integration commit.

## Decisions binding this slice

- **No new dependencies.** Link check runs via `npx` in CI only, mirroring the
  pa11y-ci precedent (HANDOFF-LOG "Dependency justifications").
- **Lint = the brand guardrails + `astro check`**, tree-wide. oxlint was
  deliberately dropped in slice 1; that call stands. If a future slice needs a
  JS linter it goes through a new dependency justification.
- **CI guardrail script mirrors the hook exactly** (same four check classes, same
  exclusions) so local and CI verdicts never disagree.
- **CODEOWNERS uses only real handles** (@KhalidMuse45). Inventing usernames
  violates the no-invented-data rule; per-area entries ship commented out.

## Deviations from the documented pane contract

The `.ai/README.md` §7 workspace (`w3`, dev-server pane, ledger tail pane) does
not exist in this session. Live workspace is `w9`: p1 orchestrator, p2 + p3
opencode implementers, no watch panes. The "confirm the server pane is green
before delegating" step is skipped — there is no server pane to read. Logged
here rather than silently ignored.
