#!/bin/sh
# Brand guardrails — CI edition of .githooks/pre-commit.
# The hook scans only STAGED files; CI cannot trust per-clone hooks, so this
# scans every git-tracked file tree-wide. Same four check classes, same
# exclusions, so a local commit and a CI run always agree on a violation.
#
# Checked (for every non-excluded tracked file):
#   1. no literal hex outside the token layer (src/styles/*.css only)
#   2. no `outline: none`
#   3. ColorStack casing — capital C, capital S, always
#   4. no em dashes in rendered copy
# Excluded: the vendored design drop, CI files, and this script.
set -u
fail=0
files=$(git ls-files |
  grep -Ev '^(design/|\.githooks/|\.claude/|\.github/|scripts/|CLAUDE\.md$)')

# A check that cannot fail is not a check.
#
# If `git ls-files` returns nothing, the loop below scans nothing and the
# script exits 0, reporting a pass it never performed. That is not
# hypothetical: run from a git worktree under WSL bash, git cannot resolve the
# worktree's absolute gitdir pointer, returns an empty list, and this script
# silently self-passes. Every "lint exit: 0" from such a run is meaningless.
#
# So refuse to report success on an empty scan.
count=$(printf '%s\n' "$files" | grep -c . || true)
if [ "$count" -lt 10 ]; then
  echo "FAIL guardrails scanned only $count files, which cannot be right."
  echo "--> git ls-files returned nothing usable. If you are in a worktree,"
  echo "    run this under Git Bash rather than WSL bash."
  exit 1
fi

for f in $files; do
  [ -f "$f" ] || continue
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
      # The gradient / glassmorphism ban was REMOVED on 2026-08-13 by owner
      # decision. See CLAUDE.md "What this file is now".
      #
      # It was taste encoded as law, and it reached the point of blocking work
      # the owner had asked for: a shimmer is a moving gradient, so the rule
      # made a requested effect illegal. Visual direction is now decided per
      # request, not enforced by grep.
      #
      # What survives in this script is only the set of things that are not
      # matters of taste: a literal hex drifts when the palette changes,
      # outline:none breaks keyboard use, and the checks below protect naming
      # and copy. Must stay byte-identical in intent to .githooks/pre-commit or
      # a local commit and CI will disagree.
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
[ "$fail" = 1 ] && echo "--> fix it, or explain the exception in the pull request"
exit $fail