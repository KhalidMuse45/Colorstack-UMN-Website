# `.ai/reviews/` — review artifacts & how to comment

Audit reports and review verdicts land here, one file per review. This page is
the general guide for writing review comments in this repo — on GitHub PRs or
in files here — whether you are a human or an agent.

## Where comments go

| What | Where |
|---|---|
| Line-level feedback on a PR | GitHub PR review comments |
| A full review verdict (gate) | `HANDOFF-LOG.md` ledger row + a file here if long |
| One-off audits (links, a11y, perf) | A file here: `<topic>-audit.md` |

## How to write a comment

Every blocking comment needs four parts (same shape as the reviewer role's
defect format):

1. **What's wrong** — one sentence, no hedging.
2. **Where** — `path:line`.
3. **How you know** — the spec line, token name, command output, or hook rule
   it violates. "Feels off" is not evidence.
4. **What correct looks like** — concrete, so the author can fix it without
   guessing.

Non-blocking observations are **notes** — prefix them `Nit:` and never mix
them into a blocking list. Judge the diff, not the author; skip praise and
restating what the code does.

## Checklists

The PR checklist lives in `.github/pull_request_template.md` and mirrors
`CONTRIBUTING.md`. A reviewer verdict is always one of `PASS`,
`PASS WITH NOTES`, or `FAIL` + numbered defects (see
`.claude/agents/reviewer.md` for the full gate).

## For agents

Log every review outcome as a ledger row in `HANDOFF-LOG.md`. Advisory
auto-checks are welcome here but never authoritative — the reviewer gate is.
