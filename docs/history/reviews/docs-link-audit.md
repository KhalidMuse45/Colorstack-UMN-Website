# Docs link audit — infra-multidev, Unit C

Audited 2026-08-10 against the working tree. Scope: README.md, CONTRIBUTING.md,
CLAUDE.md, `.ai/**/*.md`, HANDOFF-LOG.md, RECON.md, `design/*.md` (plus
`.claude/agents/*.md` and `design/agents/*.md`, outside the enumerated list,
found dirty while reading). Method: every `[text](dest)` link resolved against
the filesystem; every code-span path reference checked for file-relative
resolve and for the `plans/` → `.ai/plans/` and `CNAME` → `public/CNAME`
moves; external URLs probed with `curl -sIL/-sL` (GET fallback).

Net: **0 broken markdown links, 0 heading anchors, 6 stale path references
fixed (all in `.ai/README.md`)**. Everything else that is broken or stale is
below, report-only, with the correct target. Nothing outside the write list
was edited; nothing was deleted or moved.

---

## 1. Fixed (`.ai/README.md` — link/path fixes only)

All six are code-span paths that did not resolve from the file's directory
(`.ai/`). `.ai/OWNERSHIP.md`, written in this same slice, already uses the
`../` convention, so the map file is now consistent with it. No prose touched.

| file:line | was | now | why |
|---|---|---|---|
| `.ai/README.md:51` | `design/ORCHESTRATION.md`, `design/UX-SPEC.md` | `../design/ORCHESTRATION.md`, `../design/UX-SPEC.md` | resolved to `.ai/design/…` — no such dir |
| `.ai/README.md:71` | `.githooks/pre-commit` | `../.githooks/pre-commit` | resolved to `.ai/.githooks/` |
| `.ai/README.md:73` | `src/styles/{colors,typography,spacing,styles}.css` | `../src/styles/{…}.css` | resolved to `.ai/src/` |
| `.ai/README.md:90` | `src/data/nav.ts` | `../src/data/nav.ts` | resolved to `.ai/src/` |
| `.ai/README.md:122` | `src/styles/typography.css`, `design/tokens/typography.css`, `SETUP.md`, `public/fonts/` | `../src/styles/…`, `../design/tokens/…`, `../design/SETUP.md`, `../public/fonts/` | `SETUP.md` did not resolve from anywhere (it lives in `design/`); the rest resolved to `.ai/` |
| `.ai/README.md:124` | `public/CNAME` | `../public/CNAME` | resolved to `.ai/public/` |

Markdown links fixed: **0** (there were none broken in the write list).

---

## 2. Broken elsewhere — report only (correct target shown; NOT edited)

### 2a. Root `CLAUDE.md` — copied from `design/CLAUDE.md` without re-rooting
(`design/PULL-FROM-DESIGN-CHAT.md` step 4 instructs the copy; the copy never
got `design/` prefixes.)

- `CLAUDE.md:6` `` `UX-SPEC.md` `` → `design/UX-SPEC.md`
- `CLAUDE.md:6` `` `BRAND-SYSTEM.md` `` → `design/BRAND-SYSTEM.md`
- `CLAUDE.md:6` `` `reference/Chapter Notes Newsletter.html` `` → `design/reference/Chapter Notes Newsletter.html`
- `CLAUDE.md:8` `` `tokens/*.css` `` → `design/tokens/*.css`
- `CLAUDE.md:18` `` `ORCHESTRATION.md` `` → `design/ORCHESTRATION.md`
- `CLAUDE.md:20` `` `REPO-RECON.md` `` → `design/REPO-RECON.md`
- `CLAUDE.md:21` `` `agents/planner.md`, `agents/implementer.md`, `agents/reviewer.md` `` → `design/agents/*.md` (vendored originals) or `.claude/agents/*.md` (enforcing copies)
- `CLAUDE.md:37` `` `ORCHESTRATION.md §3` `` → `design/ORCHESTRATION.md §3`

### 2b. `.claude/agents/*.md` (outside the enumerated DONE scope; found while reading)

- `.claude/agents/planner.md:13` `` `plans/<slice>.md` `` → **genuinely stale from the `plans/` → `.ai/plans/` move**: correct is `.ai/plans/<slice>.md`
- `.claude/agents/planner.md:11` inputs `UX-SPEC.md`, `BRAND-SYSTEM.md`, `tokens/*.css`, `reference/Chapter Notes Newsletter.html` → `../design/…`; `RECON.md` → `../RECON.md`
- `.claude/agents/implementer.md:7-8` `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`, `reference/Chapter Notes Newsletter.html` → `../design/tokens/…`, `../design/reference/…`
- `.claude/agents/reviewer.md:24,29` `reference/Chapter Notes Newsletter.html`, `UX-SPEC.md` → `../design/reference/…`, `../design/UX-SPEC.md`

### 2c. Vendored `design/` bundle — written for the design-session root; several paths don't resolve from inside `design/`

- `design/CLAUDE.md:12` `` `HANDOFF-LOG.md` `` → root `HANDOFF-LOG.md` (there is no `design/HANDOFF-LOG.md`)
- `design/REPO-RECON.md` root-oriented paths that don't resolve from `design/`: `RECON.md`, `package.json`, `.github/workflows/`, `CNAME`, `content/*.json`
- `design/BUNDLE.md:8` `` `design/tokens/styles.css` `` → root-relative (from `design/` it reads `design/design/tokens/…`)
- `design/BRAND-SYSTEM.md` absent-artifact refs (already logged as known gaps in `design/BUNDLE.md`, do not fix here): `assets/fonts/iCielGothamBold.ttf` (:11, :67), `assets/stickers/pressed-flowers.jpg` / `dove-etching.webp` (:36), and the design-session tree that was not vendored: `components/core/` (:58), `templates/newsletter/` (:59), `guidelines/` (:57), `SKILL.md` (:60), `uploads/*` (:8-12)
- `design/UX-SPEC.md` spec-internal refs to the same un-vendored tree: `templates/newsletter/Newsletter.dc.html` (:6), `components/core/` (:128), `assets/fonts/iCielGothamBold.ttf` (:108), `assets/stickers/*` (:147), `content/*.json` (:267, aspirational)
- `design/PULL-FROM-DESIGN-CHAT.md` channel files that don't exist yet (created per pull): `design/CHANGES-vN.diff` (:51), `design/FEEDBACK.md` (:59)
- `design/agents/planner.md:8` `` `plans/<slice>.md` `` — matches the design bundle's own `plans/` convention; make it follow `.ai/plans/` only if the design session decides its planners also move.

### 2d. `.ai/plans/` + `.ai/envelopes/` — root-relative convention, not stale (no action)

Plan and envelope paths (`src/components/*.astro`, `src/data/nav.ts`,
`design/UX-SPEC.md`, `design/tokens/*.css`, `design/BRAND-SYSTEM.md`,
`design/reference/…`, `.github/workflows/*.yml`, `scripts/*`, `CONTRIBUTING.md`)
are written repo-root-relative and resolve from the root, not from
`.ai/plans/` or `.ai/envelopes/`. They were written after the file moves, so
nothing is stale because of a move. Envelopes are unwritable by contract
(FORBIDDEN); harmonizing plans to the `../` convention is optional, not
required. Representative spots if ever touched: `.ai/plans/global-chrome.md:21-25`,
`.ai/plans/infra-multidev.md:21-24`, `.ai/envelopes/TEMPLATE.md:19-20`,
`.ai/envelopes/slice-2-unit-a-navbar.md:26-28`.

### 2e. README.md — informational, not stale

- README structure tree lists `content/` (:42) but no `content/` dir exists.
  Planned: created in slice 4 per `SETUP.md` §4 and `.ai/README.md` §3. Not a
  link, not stale — flagged for awareness only.
- README.md:5 live-site link returns HTTP 404 (see §3).

---

## 3. External URL table

All probed live on 2026-08-10. `mailto:` has no HTTP status. `WARN` = checked,
unreliable for bots, do not treat as failure.

| URL | where | http |
|---|---|---|
| https://www.colorstack.org | README.md:3; RECON.md:167 | 200 |
| **https://colorstackumn.org** | README.md:5 (Live Site) | **404** ⚠ |
| https://github.com/KhalidMuse45/Colorstack-UMN-Website | README.md:60 (clone URL); RECON.md:5 | 200 |
| https://www.linkedin.com/company/colorstackumn/about/ | README.md:106; RECON.md:164 | 999 → WARN (bot-blocked) |
| https://www.instagram.com/colorstackumn/ | README.md:107; RECON.md:165 | 200 |
| https://www.instagram.com/p/DPesfD-kkT0/ | RECON.md:165 | 200 |
| https://airtable.com/appkIPLm5Mc9fi6GG/pagXtcxrlrF9Tiff7/form | RECON.md:162 | 200 |
| https://hudeifi.github.io/colorstack-umn-website/ | RECON.md:168 | 404 (old Pages URL on a different account — RECON already flags it as outside repo control) |
| https://lucide.dev | design/BRAND-SYSTEM.md:50 | 200 |
| https://fonts.googleapis.com/css2?family=Archivo… (the §3.2 `@import`) | design/UX-SPEC.md:100 | 200 |
| mailto:colorstk@umn.edu | README.md:105; RECON.md:166 | n/a (mailto) |

The one actionable 404 is `colorstackumn.org` — the apex Pages deploy. It is
consistent with the rebuilt-but-not-yet-deployed state (old site deleted in
slice 1, deploy workflow landed in infra-multidev Unit A). Escalate to the
orchestrator: after `deploy.yml` runs on main, re-probe.

---

## 4. Stray files — report only, delete nothing

Scope: files tracked at the repo root (`git ls-files`, top level). Every one
is referenced by at least one markdown doc. No root-level strays.

- CLAUDE.md CONTRIBUTING.md HANDOFF-LOG.md README.md RECON.md — cross-referenced (README.md, `.ai/README.md`, `.ai/OWNERSHIP.md`, RECON.md, CLAUDE.md)
- `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json` — `HANDOFF-LOG.md` (slice-1 ledger), `.ai/OWNERSHIP.md` (ownership map), RECON.md
- `.gitignore`, `.guardrail-allow`, `.githooks/` — RECON.md, HANDOFF-LOG.md, `design/SETUP.md`, README.md
- `public/CNAME` — README.md:29,80; `.ai/README.md:124`; HANDOFF-LOG.md — referenced
- `design/`, `src/`, `.claude/`, `.ai/` — referenced throughout

Informational (not root level, but orphaned-by-name):
- `public/images/hudeifi-abdihakin.jpg` — **referenced by no markdown doc by
  that name**. RECON.md references the deleted `hudeifi.jpg`; the rebranded
  file is a content asset for the slice-2+ testimonial/spotlight. No action; on
  record so slice 4/5 wire it deliberately.
- Untracked right now (present, not yet committed): `.ai/OWNERSHIP.md`,
  `.ai/envelopes/TEMPLATE.md`, `.ai/plans/infra-multidev.md`, `.ai/envelopes/infra-*`,
  `.github/*`, `.ai/reviews/`. All except this report are owned by the other
  infra-multidev units.

---

## Counts & DONE assertions

- Markdown links resolved against the tree: **20** (README.md 8, CONTRIBUTING.md 6, `.ai/OWNERSHIP.md` 5, `design/BRAND-SYSTEM.md` 1). Broken: **0**.
- Heading anchors (`[…](#…)`): **0 present** in the whole repo — nothing to check.
- Stale path references fixed: **6** (all `.ai/README.md`, §1). Report-only: §2a 8, §2b 4, §2c bundled, §2d convention-only.
- External URLs enumerated: **10 probed + mailto** (§3). One 404 with an owner (`colorstackumn.org`); two WARN/bot-blocked (LinkedIn) and one historical 404 (old Pages URL).

DONE assertions:
1. Every relative link and heading anchor resolved — **pass**. Broken items in the write list fixed (0 links, 6 paths); broken outside listed with file:line + correct target, not edited.
2. Every external URL enumerated with an HTTP status (WARN for bot-blocked) — **pass**.
3. `.ai/reviews/docs-link-audit.md` exists with fixed / broken-elsewhere / external-URL sections plus a stray-files section — **pass** (this file; `.ai/reviews/` was created).
4. Zero edits outside the write list; "ColorStack" casing preserved; the exact `github.com/KhalidMuse45/Colorstack-UMN-Website` slug untouched — **pass**.

## Open questions
- **`colorstackumn.org` returns 404.** Decide deploy order now that `deploy.yml` exists; re-probe after it runs.
- Fix the `CLAUDE.md`/`.claude/agents/` path references (§2a, §2b) in a later unit? Both are outside this envelope's write list; they are mechanical `design/`-prefix additions and belong to the orchestrator-owned glue set.