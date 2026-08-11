# scripts/ — repo-local tooling

## guardrails.sh

Tree-wide brand guardrail lint for CI — the counterpart of `.githooks/pre-commit`.
The hook scans only **staged** files for a commit; CI cannot trust per-clone
hooks, so this scans **every git-tracked file** (`git ls-files`). Both run the
same four check classes and the same exclusions, so a local commit and a CI run
always agree on a violation.

Run it:

```bash
bash scripts/guardrails.sh
```

Exit 0 = clean; exit 1 = at least one violation (each printed with `FAIL`,
file, and the offending line). It exits 1 if any of:

1. a literal hex value appears outside the token layer
   (`src/styles/{colors,typography,spacing,styles}.css`);
2. `outline: none` suppresses a focus ring;
3. `linear-gradient` / `radial-gradient` / `backdrop-filter` (glassmorphism);
4. `Colorstack`/`COLORSTACK` casing appears outside the sanctioned repo-slug
   carve-out (`github.com/KhalidMuse45/Colorstack-UMN-Website`).

Exclusions mirror the hook exactly and add the CI files:

- `design/` — vendored bundle (quotes violations to forbid them)
- `.githooks/`, `.ai/`, `.claude/`, `.github/`, `scripts/` — hooks, agent and
  orchestration docs, CI config, this script
- `CLAUDE.md`, `HANDOFF-LOG.md`, `RECON.md`
- any path allowlisted in `.guardrail-allow` (exact match, one per line)

The four token files stay in the scan but skip only the hex check — color
tokens are the sanctioned home of literal hexes.

CI wires this in `.github/workflows/ci.yml`, after `npm run build`, against the
tracked tree. If a legitimately-needed violation ever lands, allowlist the path
in `.guardrail-allow` **and** log the why in `HANDOFF-LOG.md` — never edit the
script to silence a flag.