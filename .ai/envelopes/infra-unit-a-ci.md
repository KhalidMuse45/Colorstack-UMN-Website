ROLE:        .claude/agents/implementer.md — read it first, it binds you.

SLICE:       infra-multidev, Unit A — CI/CD pipeline + tree-wide brand lint + link check

CONTEXT:     Astro 5 static site, Node 20 (engines ^20.19.0 || >=22.12.0). Slice 1
             (scaffold/tokens/fonts/guardrails) is done and gated. Brand rules are
             currently enforced ONLY by .githooks/pre-commit, which scans staged
             files and is opt-in per clone. There is no CI at all. Deploy target is
             GitHub Pages, apex domain via public/CNAME (Astro emits it into dist/).
             Read .ai/README.md §5 and §8 before writing anything.

GOAL:        Every PR and push to main gets typecheck + build + brand-guardrail +
             link checks in GitHub Actions, and main auto-deploys to GitHub Pages.

SPEC:        .ai/README.md §5 (the commit-failing rules) and .githooks/pre-commit
             (the four check classes). CI must enforce the SAME four classes
             tree-wide: literal hex outside the token layer, outline suppression,
             gradient/glassmorphism, ColorStack casing (carve-out: the exact
             github.com/KhalidMuse45/Colorstack-UMN-Website slug only).

FILES YOU MAY WRITE:
  .github/workflows/ci.yml
  .github/workflows/deploy.yml
  scripts/guardrails.sh
  scripts/README.md

FILES YOU MAY READ:
  .githooks/pre-commit, .guardrail-allow, package.json, astro.config.mjs,
  .ai/README.md, CONTRIBUTING.md, HANDOFF-LOG.md, .ai/plans/infra-multidev.md

DONE WHEN:
  1. `bash scripts/guardrails.sh` exits 0 on the current tree, and exits 1 when a
     literal hex is planted in a scratch .astro file (test both, then delete the
     fixture — it must not appear in your diff). The script scans git-tracked
     files (not staged) and mirrors the hook's exclusions exactly: design/,
     .githooks/, .ai/, .claude/, .github/, scripts/, CLAUDE.md, HANDOFF-LOG.md,
     RECON.md, the four token files src/styles/{colors,typography,spacing,styles}.css
     (hex check only), and paths listed in .guardrail-allow.
  2. ci.yml runs on pull_request and on push to main: npm ci → npm run check →
     npm run build → bash scripts/guardrails.sh → link check. Node 20 via
     actions/setup-node with npm cache enabled.
  3. The link check runs against ./dist after the build using npx (linkinator or
     equivalent — NO package.json changes), covers internal links, skips external
     social domains that block bots (linkedin.com, instagram.com), and the skip
     list sits visibly in the workflow with a one-line comment. Do NOT pre-add
     skips for unbuilt routes that dist does not link yet.
  4. deploy.yml deploys ./dist to GitHub Pages ONLY on push to main, using
     actions/configure-pages + actions/upload-pages-artifact + actions/deploy-pages
     with the standard pages permissions block and concurrency group. No extra
     CNAME handling — Astro already emits public/CNAME into dist/.
  5. Both workflow files parse as valid YAML (verify locally, e.g.
     `npx js-yaml <file>`), and every third-party action is pinned to a major
     version tag (@v4/@v5).

FORBIDDEN:   new package.json dependencies or scripts (the orchestrator wires npm
             scripts after integration); editing .githooks/, package.json, src/,
             public/, design/, CONTRIBUTING.md, README.md, HANDOFF-LOG.md, or any
             file not in your write list; inventing repo secrets or env values;
             changing the Node engine range; leaving test fixtures behind.

REPORT:      diff summary, one line per file; which DONE assertions pass and how
             you verified 1 and 5; open questions. No prose essays.
