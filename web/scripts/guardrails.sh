#!/bin/sh
# Four checks, and only four. See handoff/docs/01-BRAND-RULES.md,
# "Guardrails that survive":
#
#   1. no literal hex outside lib/tokens.ts and app/globals.css
#   2. no `outline: none`
#   3. "ColorStack" casing, capital C, capital S
#   4. no em dash in string literals under content/
#
# Everything else (gradients, transforms, pills, fonts, dependency bans) was
# removed from lint on purpose. Visual direction is decided per request, not
# enforced by grep.
#
# Run from web/: `sh scripts/guardrails.sh`, which is what `npm run lint` does.
set -u
fail=0

cd "$(dirname "$0")/.." || exit 1

# ── Which files ──────────────────────────────────────────────────────────
#
# A CHECK THAT CANNOT FAIL IS NOT A CHECK.
#
# The handoff script used a bare `git ls-files`, which lists only files git
# already tracks. Every file in this directory was brand new and untracked when
# the app was first built, so that command returned nothing, the loop below
# scanned nothing, and the script exited 0 having checked precisely zero lines.
# The repository has been burned by exactly this before, from a worktree under
# the wrong bash; see scripts/guardrails.sh at the repository root.
#
# So: list tracked AND untracked-but-not-ignored files, and then refuse to
# report success on an implausibly small scan.
files=$(git ls-files --cached --others --exclude-standard 2>/dev/null |
  grep -Ev '^(node_modules/|\.next/|public/|scripts/)')

count=$(printf '%s\n' "$files" | grep -c . || true)
if [ "$count" -lt 25 ]; then
  echo "FAIL guardrails scanned only $count files, which cannot be right."
  echo "--> git ls-files returned nothing usable. Run this from web/ under"
  echo "    Git Bash, inside the repository."
  exit 1
fi

for f in $files; do
  [ -f "$f" ] || continue
  case "$f" in
    *.css|*.tsx|*.ts|*.jsx|*.js|*.mjs)
      case "$f" in
        lib/tokens.ts|app/globals.css) ;;   # the token layer, the only two
        *)
          grep -nE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?\b' "$f" &&
            { echo "FAIL $f: literal hex, use a token"; fail=1; }
          ;;
      esac
      grep -n 'outline: *none' "$f" && { echo "FAIL $f: outline:none"; fail=1; }
      ;;
  esac
  case "$f" in
    *.css|*.ts|*.tsx|*.js|*.jsx|*.mjs|*.json|*.md|*.html)
      grep -nE '(^|[^A-Za-z/_.-])(colorstack|Colorstack|colorStack|COLORSTACK)([^A-Za-z/_.-]|$)' "$f" &&
        { echo "FAIL $f: ColorStack casing"; fail=1; }
      ;;
  esac
done

# ── 4. em dashes in copy ────────────────────────────────────────────────
# Chapter preference: commas or full stops in prose. Scoped to content/, which
# is where the copy lives.
content=$(git ls-files --cached --others --exclude-standard 'content/*' 2>/dev/null)
if [ -z "$content" ]; then
  echo "FAIL guardrails found no files under content/ to check for em dashes."
  exit 1
fi
for f in $content; do
  [ -f "$f" ] || continue
  grep -n '—' "$f" && { echo "FAIL $f: em dash in copy"; fail=1; }
done

if [ "$fail" = 1 ]; then
  echo "--> fix it, or explain the exception in the pull request"
fi
exit $fail
