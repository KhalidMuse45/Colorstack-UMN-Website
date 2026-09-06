#!/bin/sh
# Four checks. See docs/01-BRAND-RULES.md "Guardrails that survive".
set -u
fail=0
files=$(git ls-files | grep -Ev '^(docs/|sanity/|scripts/|\.github/|public/)')
for f in $files; do
  [ -f "$f" ] || continue
  case "$f" in
    *.css|*.tsx|*.ts|*.jsx|*.js)
      case "$f" in
        lib/tokens.ts|app/globals.css) ;;
        *)
          grep -nE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?\b' "$f" && { echo "FAIL $f: literal hex, use a token"; fail=1; }
          ;;
      esac
      grep -n 'outline: *none' "$f" && { echo "FAIL $f: outline:none"; fail=1; }
      ;;
  esac
  grep -nE '(^|[^A-Za-z/_.-])(colorstack|Colorstack|colorStack|COLORSTACK)([^A-Za-z/_.-]|$)' "$f" && { echo "FAIL $f: ColorStack casing"; fail=1; }
done
# em dashes only in content and Sanity seed files
for f in $(git ls-files 'content/*' 'scripts/seed-*' 2>/dev/null); do
  grep -n "—" "$f" | grep -v '№' && { echo "FAIL $f: em dash in copy"; fail=1; }
done
exit $fail
