ROLE:        .claude/agents/implementer.md — read it first, it binds you.

SLICE:       infra-multidev, Unit B — multi-dev ownership scaffolding

CONTEXT:     This repo runs an orchestrated multi-agent loop (.ai/README.md §6–7):
             one orchestrator, implementer agents working one envelope each on
             disjoint file sets. Slices 2–10 are queued (.ai/README.md §3). This
             unit makes path ownership explicit so parallel developers and agents
             can extend features without colliding.

GOAL:        A contributor or agent can find, in one file, who owns any path, how
             to claim new work, and how to extend a feature without crossing an
             ownership boundary.

SPEC:        .ai/README.md §2 (where everything lives), §6 (the loop and fan-out
             rules), §7 (pane contract). Envelope format: design/ORCHESTRATION.md §3
             and the two existing envelopes in .ai/envelopes/.

FILES YOU MAY WRITE:
  .ai/OWNERSHIP.md
  .ai/envelopes/TEMPLATE.md
  .github/CODEOWNERS
  .github/pull_request_template.md
  CONTRIBUTING.md   (extend only — do not delete or rewrite existing sections)

FILES YOU MAY READ:
  .ai/README.md, .ai/plans/*, .ai/envelopes/*, design/ORCHESTRATION.md,
  CONTRIBUTING.md, README.md, HANDOFF-LOG.md, CLAUDE.md

DONE WHEN:
  1. .ai/OWNERSHIP.md maps every top-level path to an owner class
     (orchestrator-owned glue / slice-owned / vendored-never-edit / generated)
     and states the extension rules: new components in src/components/, new pages
     in src/pages/, one slice per branch, shared files (src/layouts/Base.astro,
     src/data/*, src/styles/*, package.json) are orchestrator-only. Everything is
     derived from .ai/README.md, CONTRIBUTING.md, and design/ORCHESTRATION.md —
     invent nothing new.
  2. .ai/envelopes/TEMPLATE.md is a fill-in-the-blanks copy of the envelope
     format from design/ORCHESTRATION.md §3, matching the style of the two
     existing slice-2 envelopes.
  3. .github/CODEOWNERS uses ONLY the real handle @KhalidMuse45 as the default
     owner; per-area lines are present but commented out, with a note to fill in
     real handles. Inventing usernames is forbidden.
  4. .github/pull_request_template.md is a short checklist mirroring
     CONTRIBUTING.md ("Before you open a PR", the commit-failing rules, and
     "work logged in HANDOFF-LOG.md") — no new policy.
  5. CONTRIBUTING.md gains one short "Branching & ownership" section: branch
     naming revamp/<slice-name>, one slice per branch, disjoint file sets within
     a slice, link to .ai/OWNERSHIP.md. Nothing else in the file changes.

FORBIDDEN:   new dependencies; editing src/, public/, design/, .githooks/,
             package.json, README.md, CLAUDE.md, HANDOFF-LOG.md, or the two
             existing slice-2 envelopes; inventing names, GitHub handles, stats,
             or policies not already present in the repo docs. "ColorStack" —
             capital C, capital S, always; the exact GitHub slug URL is the one
             sanctioned exception.

REPORT:      diff summary, one line per file; which DONE assertions pass; open
             questions. No prose essays.
