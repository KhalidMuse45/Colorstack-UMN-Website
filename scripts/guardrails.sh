#!/bin/sh
# Brand guardrails — CI edition of .githooks/pre-commit.
# The hook scans only STAGED files; CI cannot trust per-clone hooks, so this
# scans every git-tracked file tree-wide. Same four check classes, same
# exclusions, so a local commit and a CI run always agree on a violation.
#
# Checked (for every non-excluded tracked file):
#   1. no literal hex outside the token layer (src/styles/*.css only)
#   2. no `outline: none`
#   3. no gradients / backdrop-filter (glassmorphism)
#   4. ColorStack casing — capital C, capital S, always
# Excluded: vendored bundle, orchestration docs, CI files, this script, and any
# path allowlisted in .guardrail-allow.
set -u
fail=0
files=$(git ls-files |
  grep -Ev '^(design/|\.githooks/|\.ai/|\.claude/|\.github/|scripts/|CLAUDE\.md$|HANDOFF-LOG\.md$|RECON\.md$)')
for f in $files; do
  [ -f "$f" ] || continue
  if [ -f .guardrail-allow ] && grep -qxF "$f" .guardrail-allow; then continue; fi
  case "$f" in
    *.css|*.astro|*.jsx|*.tsx|*.svelte|*.vue)
      case "$f" in
        src/styles/colors.css|src/styles/typography.css|src/styles/spacing.css|src/styles/styles.css)
          ;;   # token layer, copied from design/tokens/ — literal hexes are the point
        *)
          grep -nE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?\b' "$f" &&
            { echo "FAIL $f — literal hex outside src/styles/ (use var(--token))"; fail=1; }
          ;;
      esac
      grep -n "outline: *none" "$f" && { echo "FAIL $f — outline:none"; fail=1; }
      grep -niE "linear-gradient|radial-gradient|backdrop-filter" "$f" && { echo "FAIL $f — gradient/glassmorphism"; fail=1; }
      ;;
  esac
  case "$f" in
    *.html|*.js|*.ts|*.jsx|*.tsx|*.astro|*.json|*.md)
      # The GitHub repo slug is itself misspelled ("Colorstack-UMN-Website").
      # Docs must be able to quote the real clone URL, so that exact remote
      # path is the one sanctioned exception. Rename the repo upstream and
      # this line should be deleted.
      if grep -nE 'Colorstack|COLORSTACK' "$f" |
           grep -v 'github\.com/KhalidMuse45/Colorstack-UMN-Website'; then
        echo "FAIL $f — ColorStack casing"; fail=1
      fi
      ;;
  esac
done
[ "$fail" = 1 ] && echo "--> fix it, or allowlist the path in .guardrail-allow and log why in HANDOFF-LOG.md"
exit $fail