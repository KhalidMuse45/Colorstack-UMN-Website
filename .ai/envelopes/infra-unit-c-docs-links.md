ROLE:        .claude/agents/implementer.md — read it first, it binds you.

SLICE:       infra-multidev, Unit C — docs cleanup + markdown link audit

CONTEXT:     The repo's docs cross-reference each other heavily (README.md,
             CONTRIBUTING.md, .ai/*, design/*, HANDOFF-LOG.md). Files have moved
             during the revamp (plans/ → .ai/plans/, CNAME → public/, old site
             deleted), so some relative links and anchors may be stale. CI link
             checking (Unit A, in flight) only covers the built site in dist/ —
             markdown docs are not covered by it. This unit closes that gap once,
             by hand, with a written audit.

GOAL:        Every relative link and anchor in the repo's markdown docs is
             verified; broken ones inside the write list are fixed; everything
             else is reported with file:line.

SPEC:        .ai/README.md §2 (canonical locations of every doc). Do not move
             files — the constitution pins HANDOFF-LOG.md, CLAUDE.md, RECON.md at
             root and design/ is vendored.

FILES YOU MAY WRITE:
  README.md                       (link/path fixes only — no content rewrites)
  .ai/README.md                   (link/path fixes only)
  .ai/plans/*.md                  (link/path fixes only)
  .ai/reviews/docs-link-audit.md  (the audit report — create .ai/reviews/)

FILES YOU MAY READ:  every markdown file in the repo, .gitignore, .guardrail-allow

DONE WHEN:
  1. Every relative link and heading anchor in README.md, CONTRIBUTING.md,
     CLAUDE.md, .ai/**/*.md, HANDOFF-LOG.md, RECON.md, design/*.md has been
     resolved against the working tree. Broken ones in your write list are
     fixed; broken ones outside it (design/, CONTRIBUTING.md, CLAUDE.md,
     HANDOFF-LOG.md, RECON.md) are listed in the report with file:line and the
     correct target — NOT edited.
  2. Every external URL in those files is enumerated in the report with an
     HTTP status from `curl -sIL -o /dev/null -w "%{http_code}"` (or WARN if
     unreachable / bot-blocked — linkedin.com and instagram.com will block; do
     not fail on them).
  3. .ai/reviews/docs-link-audit.md exists with three sections: fixed, broken
     elsewhere (report-only), external URL table. Plus a short "stray files"
     section: anything tracked at repo root that no doc references (report
     only, delete nothing).
  4. Zero edits outside the write list; "ColorStack" casing preserved (the
     exact github.com/KhalidMuse45/Colorstack-UMN-Website slug is the one
     sanctioned exception).

FORBIDDEN:   editing design/, CONTRIBUTING.md, CLAUDE.md, HANDOFF-LOG.md,
             RECON.md, src/, public/, .github/, scripts/, package.json,
             .githooks/, existing envelopes; deleting or moving any file;
             rewording prose beyond the minimal link fix; new dependencies.

REPORT:      diff summary, one line per file; which DONE assertions pass; count
             of fixed vs report-only links; open questions. No prose essays.
