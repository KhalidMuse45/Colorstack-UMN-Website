# PULL-FROM-DESIGN-CHAT.md — Bootstrapping the parent Claude Code session

The design work lives in a separate design session, not in your repo. This file is how you get it in, and how you pull updates later.

## Why a pull, not a link
The design environment is not a git remote and not a filesystem you can reach. Nothing auto-syncs. The design session **exports a bundle**; you **ingest a folder**. Every refresh is a fresh export. Treat the bundle as an upstream vendor drop.

## First ingest

1. Download the handoff bundle from the design session (`design_handoff_website_revamp`, delivered as a zip).
2. Unzip into the repo at `design/` — flat, no nesting:
   ```
   <repo>/design/
     README.md  CLAUDE.md  ORCHESTRATION.md  UX-SPEC.md  BRAND-SYSTEM.md
     REPO-RECON.md  PULL-FROM-DESIGN-CHAT.md
     agents/  tokens/  reference/  assets/
   ```
3. Commit it as its own commit, untouched: `chore(design): vendor handoff bundle v1`. Never hand-edit files in `design/` — edits get clobbered on the next pull. Corrections go back through the design session.
4. Symlink or copy `design/CLAUDE.md` to the repo root `CLAUDE.md` (or `@import` it from an existing one) so it auto-loads.
5. Copy `design/tokens/*.css` into your real source tree (e.g. `src/styles/`) and import `styles.css` first in the entry stylesheet. Tokens are the one thing that leaves `design/`.
6. Record provenance in `design/BUNDLE.md`:
   ```
   bundle: v1
   pulled: <ISO 8601 timestamp>
   source: design session "ColorStack UMN Design System"
   contains: UX-SPEC.md, BRAND-SYSTEM.md, tokens/, reference/, assets/, agents/
   notes: <anything you had to reconcile>
   ```

## Paste-ready bootstrap prompt

Run this as the first message to the orchestrator, from the repo root:

> You are the orchestrator for the ColorStack UMN website revamp.
>
> Read, in order: `design/CLAUDE.md`, `design/ORCHESTRATION.md`, `design/UX-SPEC.md` (full), `design/BRAND-SYSTEM.md`, and the three role files in `design/agents/`. Open `design/reference/Chapter Notes Newsletter.html` and describe its visual language back to me in five bullets so I know you've actually looked at it.
>
> Then run the recon in `design/REPO-RECON.md` as a single read-only subagent. It writes only `RECON.md`.
>
> When recon lands, give me: (a) your verdict — incremental redesign or clean rebuild, (b) the slice plan reconciled against `UX-SPEC.md` §10, (c) the herdr pane contract from `ORCHESTRATION.md` §1 filled in for this repo's actual commands, (d) anything in `§11 Open questions` you need me to answer before slice 1.
>
> Do not write any application code yet. Do not install anything. Stop and wait for my go.

## Pulling an update later

When the design session revises the spec:

1. Export a fresh bundle. Unzip to `design.new/`.
2. Diff before replacing — this is the important step:
   ```bash
   diff -ru design/ design.new/ > design/CHANGES-vN.diff
   ```
3. Read the diff yourself and classify each change: **cosmetic** (copy, wording), **token change** (recolor, type scale — touches every page), **structural** (IA, new route, layout rewrite).
4. Replace `design/` with `design.new/`, bump `BUNDLE.md`, commit as `chore(design): vendor handoff bundle vN`.
5. Only then open implementation tasks. A token change is a repo-wide slice, not a one-file fix — plan it as such.
6. Never let a bundle pull and application changes share a commit.

## Going the other direction
Findings the design session needs — an impossible layout, a missing asset, a contrast failure in the spec itself — go in `design/FEEDBACK.md` as a numbered list with file paths and screenshots. The human carries it back to the design session; the fix returns as bundle `vN+1`. Do not silently "fix" the spec in code: the divergence will outlive you.

## Sanity check after any pull
```bash
grep -rn "#[0-9a-fA-F]\{6\}" src/ --include=*.css | grep -v tokens/   # should be empty
grep -rn "outline: *none" src/                                        # should be empty
grep -rn "colorstack\|Colorstack\|COLORSTACK" src/ --include=*.{html,jsx,tsx,astro,md}  # audit casing
```
