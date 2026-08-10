# SETUP.md — Slice 0: repo setup

Run this before any design work. The orchestrator does this itself — do not delegate slice 0. Stop at the verification gate and show the human before touching slice 1.

## 0. Prerequisites

```bash
node -v          # >= 20.11
npm -v           # >= 10
git --version
```

If Node is older, fix that first — Astro 5 and the toolchain assume 20+.

## 1. Get the repo

**Existing repo** (preferred — preserves history and issues):
```bash
git clone <chapter-repo-url> colorstack-umn
cd colorstack-umn
git switch -c revamp/slice-0-scaffold
```

**No repo yet:**
```bash
mkdir colorstack-umn && cd colorstack-umn
git init -b main
```

Never work on `main`. Every slice gets `revamp/slice-N-<name>`.

## 2. Ingest the design bundle

Per `PULL-FROM-DESIGN-CHAT.md`. Unzip the bundle to `design/` at the repo root, then:

```bash
cp design/CLAUDE.md ./CLAUDE.md          # or @import it from an existing root CLAUDE.md
git add design/ CLAUDE.md
git commit -m "chore(design): vendor handoff bundle v1"
```

That commit contains **only** the bundle. No scaffold, no config.

## 3. Recon before scaffolding

If step 1 cloned an existing repo, run `design/REPO-RECON.md` now as a read-only subagent. Its verdict decides step 4:

- **incremental redesign** → keep the existing scaffold, skip to §5, migrate styles in place
- **clean rebuild** → scaffold fresh in `_new/`, cherry-pick from the recon reuse list, swap at the end

Do not scaffold over a repo you haven't read.

## 4. Scaffold

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
npm install
npx astro add sitemap
```

Nothing else. No Tailwind (the tokens are plain CSS and Tailwind will fight them), no UI library, no icon package, no animation library. Every future dependency needs a written justification in `HANDOFF-LOG.md`.

Target layout:

```
src/
  styles/          ← tokens land here
  layouts/Base.astro
  components/
  pages/
content/           ← events.json, issues.json, team.json, jobs.json
public/
  fonts/           ← self-hosted woff2
  images/
design/            ← vendored bundle, never hand-edited
.logs/             ← process logs, gitignored
```

```bash
mkdir -p src/styles src/layouts src/components content public/fonts public/images .logs
```

## 5. Wire the tokens

```bash
cp design/tokens/*.css src/styles/
```

`src/styles/styles.css` imports the other three. Import it **first** in `src/layouts/Base.astro` — before any component style — so token declarations win the cascade order they were written for.

Then set the ground truth in `Base.astro`:

```html
<html lang="en">
  <body>
    <slot />
  </body>
</html>
```

with `body { background: var(--cream); color: var(--ink); font-family: var(--font-body); }` — pull the exact token names from `src/styles/colors.css` and `typography.css`, don't guess them.

## 6. Fonts

Self-host; do not ship a runtime Google Fonts request.

```
public/fonts/
  archivo-{500,600,700,800,900}.woff2
  lora-{400,500,600}.woff2  lora-italic-400.woff2
  ibm-plex-mono-{400,500}.woff2
  iciel-gotham-bold.woff2        ← LOGO WORDMARK ONLY
```

Latin subset, `font-display: swap`, `<link rel="preload">` on the two faces the hero uses. `@font-face` blocks live in `src/styles/typography.css` — nowhere else.

If licensed-font redistribution is unresolved, note it in `HANDOFF-LOG.md` under `## Blocked` and ship the Google-hosted trio meanwhile. iCiel Gotham stays local either way.

## 7. Guardrails

`.gitignore`:
```
node_modules/
dist/
.astro/
.logs/
.DS_Store
design.new/
```

Add the brand grep as a pre-commit check (`.githooks/pre-commit`, `chmod +x`, `git config core.hooksPath .githooks`):

```bash
#!/bin/sh
fail=0
grep -rn "#[0-9a-fA-F]\{3,8\}" src/ --include=*.css | grep -v "src/styles/" && { echo "✗ literal hex outside tokens"; fail=1; }
grep -rn "outline: *none" src/ && { echo "✗ outline:none"; fail=1; }
grep -rnE "Colorstack|colorstack UMN|COLORSTACK" src/ content/ && { echo "✗ ColorStack casing"; fail=1; }
grep -rniE "linear-gradient|radial-gradient|backdrop-filter" src/ && { echo "✗ gradient/glass"; fail=1; }
exit $fail
```

## 8. Ledger

```bash
printf '# Handoff log\n\n## Slices\n\n## Blocked\n\n## Dependency justifications\n' > HANDOFF-LOG.md
```

## 9. Processes

Declare the five panes from `ORCHESTRATION.md` §1 in your herdr config — translate this process list into its schema:

```
dev        npm run dev
typecheck  npx tsc --noEmit --watch
lint       npx oxlint --watch src/
a11y       npx pa11y-ci --config .pa11yci.json
ledger     tail -f HANDOFF-LOG.md
```

Each writes to `.logs/<name>.log`. The orchestrator reads those log files; it never starts a server in a foreground tool call.

## 10. Verification gate

```bash
npm run build && npm run dev
```

Confirm, by looking at it:
- [ ] Dev server boots clean, zero console errors
- [ ] Page ground is `--cream` `#FBF5EC` — not white
- [ ] All three layout faces render (Archivo / Lora / IBM Plex Mono), no FOUT flash, no fallback serif
- [ ] `grep -rn "#[0-9a-fA-F]\{6\}" src/ --include=*.css | grep -v src/styles/` → empty
- [ ] Pre-commit hook fires and blocks a deliberate `#ff0000`
- [ ] `design/` untouched since the vendor commit
- [ ] Dependency count matches §4 exactly

```bash
git add -A && git commit -m "feat(scaffold): astro + tokens + fonts + guardrails

Slice 0. Tokens wired from design/tokens. Fonts self-hosted.
Pre-commit brand guardrails active."
```

Then log the slice in `HANDOFF-LOG.md`, report to the human, and **wait for go** before slice 1 (global chrome).
