# Recon: colorstackumn.org

| field | value |
|---|---|
| repo | `https://github.com/KhalidMuse45/Colorstack-UMN-Website.git` (origin) |
| branch | `revamp/slice-0-scaffold` (`git rev-parse --abbrev-ref HEAD`) |
| HEAD | `d271563737cb53fe2fd6935a4f4506cfd71eed84` — "chore: guardrails, ledger, gitignore, token import fix" |
| date | 2026-08-09 |
| node / npm | `v20.20.1` / `10.8.1` — satisfies `design/SETUP.md` §0 (>=20.11 / >=10) |
| audit scope | existing site only: `index.html`, `styles.css`, `script.js`, `logo.png`, `hudeifi.jpg`, `CNAME`, `README.md`. `design/` treated as the incoming spec, not application code. |

---

## Verdict

**Clean rebuild.** There is no scaffold to renovate — no `package.json` anywhere in the tree, no build tool, no routing, and 8 of the 8 routes in `design/UX-SPEC.md` §2 collapse into one 161-line `index.html`. Every load-bearing decision in `styles.css` is the opposite of the spec: page ground is `#ffffff` (`styles.css:11`), the type stack is Playfair Display + DM Sans (`styles.css:7,23,24`) with zero overlap against Archivo/Lora/IBM Plex Mono, and the layout is three SaaS card grids plus radial gradients and `backdrop-filter` glassmorphism (`styles.css:75,138,149`) — four explicit `UX-SPEC.md` §9 "Don't" violations baked into the structure, not the paint. What is worth carrying forward is **prose and contacts, not code**: the mission statement, three offering blurbs, one real attributed testimonial, and four outbound URLs — all of which migrate as `content/*.json`, so scaffold fresh per `SETUP.md` §4 and cherry-pick from the Reuse list below.

---

## Stack

| thing | value | evidence (path) |
|---|---|---|
| Framework | **None.** Hand-written static HTML. | `index.html` (161 lines, single page) |
| `package.json` | **Absent.** `find . -name package.json` returns nothing outside `.git`. No lockfile, no `node_modules/`. | repo root listing |
| Build tool | None. "Open `index.html` in your browser — no build tools or dependencies required." | `README.md` § Local Development |
| Package manager | n/a (nothing to install) | — |
| Node version pin | None (`.nvmrc`, `engines` absent) | — |
| Language | HTML5 + CSS3 + one vanilla JS file (18 lines) | `script.js` |
| Styling | **Plain CSS**, single file, custom properties in `:root`. No Tailwind, no CSS modules, no styled-components, no preprocessor, no config file of any kind. | `styles.css:10-27` |
| CI | **None.** `.github/` does not exist (`ls: .github: No such file or directory`). | — |
| Deploy target | GitHub Pages, custom domain **`colorstackumn.org`** | `CNAME` (single line) |
| Pages config | No workflow file; Pages is configured in the GitHub repo UI, not in-repo. README says "deployed via GitHub Pages from the `main` branch". | `README.md` § Deployment |
| Deploy-config drift | README advertises the live site as `hudeifi.github.io/colorstack-umn-website` while `origin` is `KhalidMuse45/Colorstack-UMN-Website`. Two different accounts. | `README.md` line 5 vs `git remote -v` |
| Runtime data fetching | **None.** No `fetch`, no `<form>`, no embeds, no third-party `<script src>`. `grep -c '<form\|<input\|<script src="http' index.html` → `0`. | `index.html`, `script.js` |

---

## Route inventory

The site is a **single page with one anchor**. There is no router and no second HTML file. Rows below are the DOM sections of `index.html`, marked against the IA in `UX-SPEC.md` §2 / page specs §5.

| route / section | file | keep / redesign / merge / delete | note |
|---|---|---|---|
| `/` | `index.html` | **redesign** | The only route. Becomes `/` Home per §5.1 (8-block order: NavBar → Masthead → next-event band → what we do → photo strip → latest newsletter → JoinBlock → Footer). |
| `<nav>` | `index.html:12-18` | **redesign** | Has zero nav links — only a brand lockup and one external Airtable CTA. §2 requires `Events · Newsletter · Opportunities · About` + `Join` gold pill, plus a mobile sheet. Drop `backdrop-filter` (`styles.css:75`). |
| `.hero` | `index.html:21-27` | **redesign** | Becomes `Masthead` (§5.1.2): Archivo 900 clamp headline, Lora italic subhead, mono live-timestamp row. Kill both `radial-gradient` pseudo-elements (`styles.css:130-151`) and the 20px-radius logo crop (`styles.css:164`). |
| `.mission` + `#about-us` | `index.html:30-60` | **merge → `/about`** | Three paragraphs of real chapter prose. Mission quote can also seed the Home "What we do" lede (§5.1.4). The JS show/hide toggle is deleted with `script.js`. |
| `.stats` "By the Numbers" | `index.html:63-79` | **delete** | "50+ Active Members", "25+ Offers Secured in 2025" are unsourced. `UX-SPEC.md` §9: "Don't invent stats, member counts". "2025 Year Founded" is the only defensible figure — re-home it in `/about` prose. Blocked item below. |
| `.offerings` | `index.html:82-98` | **merge → Home "What we do"** | Copy for all 3 blurbs is salvageable verbatim. The 3-col `.offerings-grid` card grid is deleted — §9 forbids card grids where hairline rows belong; §5.1.4 wants 3 editorial columns opening with a `✳` glyph, no icons. |
| `.testimonial` | `index.html:101-115` | **merge → member spotlight** | Genuinely attributed (Hudeifi Abdihakin, CS 2027, in-repo photo) so it is not an invented testimonial — but re-confirm consent. Becomes a `FigureBlock`/spotlight, not a bordered card. |
| `.contact` | `index.html:118-152` | **merge → `/join` + `/sponsor` + Footer** | Splits three ways: email + Airtable CTA → `/join` (§5.6); `colorstk@umn.edu` ask → `/sponsor` (§5.7); social links → Footer "Connect" column (§2). The 3-up `.contact-grid` and brand-colored hover chrome are deleted. |
| `<footer>` | `index.html:155-157` | **redesign** | One copyright line today. §2 requires hairline top rule, 4 columns (Chapter / Explore / Connect / Colophon), mono meta row with live timestamp. |
| `#about-us` (only anchor) | `index.html:37` | **delete** | Not linked from anywhere in the document — it is a JS toggle target, not a fragment destination. No inbound risk. |
| `/events` | — | **build new** | Does not exist. §5.2 |
| `/newsletter` | — | **build new** | Does not exist. §5.3 |
| `/opportunities` | — | **build new** | Does not exist. §5.4 |
| `/about` | — | **build new** | Does not exist. §5.5 |
| `/about/team` | — | **build new** | Does not exist. §5.5 |
| `/join` | — | **build new** | Does not exist. §5.6 |
| `/sponsor` | — | **build new** | Does not exist. §5.7 |

**Redirects needed: none.** The site is one URL with no deep links, so nothing can break. Two cosmetic risks: (1) any QR/print material pointing at the old Pages URL `hudeifi.github.io/colorstack-umn-website` (`README.md` line 5) — that is a different account from `origin` and is outside this repo's control; (2) `CNAME` must survive the rebuild or the apex domain drops.

---

## Color audit

Every hex literal in `index.html`, `styles.css`, `script.js`, `probe.css`. Mapped against `design/tokens/colors.css`.

| hex found | count | where | maps to token | action |
|---|---|---|---|---|
| `#7a0019` | 2 | `styles.css:3` (comment), `:15` | `--maroon` `#7A0019` | **exact match** — delete the local var, use the token |
| `#ffcc33` | 2 | `styles.css:3` (comment), `:18` | `--gold` `#FFCC33` | **exact match** — delete the local var, use the token |
| `#ffffff` | 3 | `styles.css:11` (`--color-bg`), `:13`, `:22` | `--paper` `#FFFFFF` | **page-background use is a hard violation** — `UX-SPEC.md` §9 "Don't use white `#FFF` as a page background". Page ground must be `--cream` `#FBF5EC`. Card/on-maroon uses map to `--paper` / `--text-on-maroon` |
| `#f8f5f6` | 1 | `styles.css:12` (`--color-bg-alt`) | none — **stray** (cool pink-gray) | replace with `--cream` `#FBF5EC` (warm) or `--paper` for cards |
| `#faf7f8` | 1 | `styles.css:14` (`--color-surface-hover`) | none — **stray** | **dead** — `var(--color-surface-hover)` referenced 0 times. delete |
| `#9b1a35` | 1 | `styles.css:16` (`--color-maroon-light`) | `--maroon-light` is `#900021` — **stray**, off by a visible amount | replace with `--maroon-light` |
| `#5a0013` | 1 | `styles.css:17` (`--color-maroon-dark`) | `--maroon-deep` is `#5B0013` — **stray**, off by one digit | **dead** — referenced 0 times. delete; use `--maroon-deep` |
| `#e6b800` | 1 | `styles.css:19` (`--color-gold-dim`) | `--gold-dark` is `#FFB71E` — **stray**, olive vs bright gold | **dead** — referenced 0 times. delete; use `--gold-dark` |
| `#2d2026` | 1 | `styles.css:20` (`--color-text`) | `--ink` is `#1F1A17` — **stray** | replace with `--ink` |
| `#6b5a60` | 1 | `styles.css:21` (`--color-text-muted`) | `--ink-soft` is `#5C534E` — **stray** | replace with `--ink-soft` |
| `#0a66c2` | 2 | `styles.css:562`, `:583` | none — LinkedIn brand blue, **off-palette** | **delete** — brand-colored hover chrome is not in the system |
| `#e1306c` | 2 | `styles.css:572`, `:585` | none — Instagram brand pink, **off-palette** (`--pink` `#F0426B` exists but is a national accent, not an IG token) | **delete** |
| `#ffffff` (unused surface) | — | `styles.css:13` (`--color-surface`) | — | **dead** — referenced 0 times. delete |

**No hex literals in `index.html` or `script.js`.** All 12 distinct hexes live in `styles.css`; 2 of them are inside the header comment (`styles.css:3`).

### rgba() literals — also strays, none tokenised

| value | count | intent | action |
|---|---|---|---|
| `rgba(122, 0, 25, 0.1)` | 7 | maroon hairline / card border | → `--line` `#E8DCCB` or `--hairline` |
| `rgba(122, 0, 25, 0.2)` | 6 | section top rules | → `--hairline` `rgba(31,26,23,.3)` |
| `rgba(122, 0, 25, 0.08 / .06 / .12 / .25 / .3)` | 8 | shadow tints + icon chip bg | → delete; `--shadow-card` only, "the brand is flat" (§3.3) |
| `rgba(255, 255, 255, 0.95)` | 1 | `styles.css:74` nav glass fill | delete — pairs with the forbidden `backdrop-filter` |
| `rgba(255, 204, 51, 0.08 / 0.12)` | 2 | gold glow, hero radial | delete with the gradients |
| `rgba(10, 102, 194, .15)`, `rgba(225, 48, 108, .15)` | 2 | LinkedIn / Instagram hover shadow | delete |

### Base-layer conflicts that will fight the tokens
- `styles.css:11` `--color-bg: #ffffff` set on `body` (`:42`) — must become `--cream`.
- `styles.css:10-27` declares a **parallel `:root` token set** with colliding intent but different names (`--color-maroon` vs `--maroon`, `--font-body` **same name, different value**). `--font-body` is the sharpest collision: `styles.css:24` sets it to DM Sans, `design/tokens/typography.css` sets it to Lora. Whichever imports last wins — do not migrate in place, replace the file.
- `styles.css:30-34` universal reset (`margin/padding/box-sizing`) is compatible and worth re-creating.
- `styles.css:37` `html { scroll-behavior: smooth }` is **not** gated behind `prefers-reduced-motion` — a `CLAUDE.md` non-negotiable violation.

---

## Font audit

| family | where used | action |
|---|---|---|
| **Playfair Display** (700, 800) | `styles.css:7` Google import; `:23` `--font-display`; applied at `:59, :81, :244, :317, :399` (h1-h3, nav brand, mission text, stat numbers, blockquote mark) | **DELETE** — not in the system. Display role belongs to **Archivo** (`--font-display`, `design/tokens/typography.css`) |
| **DM Sans** (400, 500, 700) | `styles.css:7` Google import; `:24` `--font-body`; applied at `:41, :192, :273, :359` (body, buttons, offering h3) | **DELETE** — not in the system. Body role belongs to **Lora**; UI/button role belongs to **Archivo** |
| `Georgia, serif` | `styles.css:23` — Playfair fallback | **DELETE as used.** Georgia *is* the sanctioned fallback for `--font-body` (Lora), not for display. Do not carry the pairing over |
| `system-ui, sans-serif` | `styles.css:24` — DM Sans fallback | **DELETE** — spec fallback chain is `'Helvetica Neue', Helvetica, sans-serif` (§3.2: "do not substitute other fallbacks") |
| **Archivo** | **absent** | **ADD** — `--font-display`, weights 500-900 |
| **Lora** | **absent** | **ADD** — `--font-body`, 400/500/600 + true italics |
| **IBM Plex Mono** | **absent** | **ADD** — `--font-mono`, 400/500. The entire mono meta-row signature (§4 `MetaRow`, `№` indexes, captions, dates) has no counterpart in the current site |
| **iCiel Gotham** | **absent** | **ADD, logo wordmark only.** `design/tokens/typography.css` `@font-face` points at `../assets/fonts/iCielGothamBold.ttf` — **that file does not exist**; `design/assets/` holds only 3 PNGs. See Blocked |

**Net: 0 of 4 required families present; 2 families to remove.** The Google Fonts import at `styles.css:7` is a render-blocking runtime request that `SETUP.md` §6 explicitly forbids ("do not ship a runtime Google Fonts request") — note that `design/tokens/typography.css` currently ships one anyway, which is a spec-internal conflict to resolve at slice 0.

---

## Content sources

Everything is **hardcoded in `index.html`**. No CMS, no markdown, no JSON, no Google Sheet, nothing fetched at runtime.

| content type | current home | target file | salvageable? |
|---|---|---|---|
| Mission statement | `index.html:32-35` | `/about` + Home lede | **Yes, verbatim.** One quoted sentence, on-brand |
| Chapter story (3 paras) | `index.html:38-56` | `/about` body | **Yes, verbatim.** Real, specific, no placeholder copy |
| Stats (3) | `index.html:66-77` | — | **No.** "50+", "25+" unsourced → §9 violation. "2025 Year Founded" survives as prose only |
| Offerings (3 blurbs) | `index.html:85-96` | Home "What we do" (§5.1.4) | **Yes, copy reusable.** Discard the card wrapper |
| Testimonial (1) | `index.html:104-112` | member spotlight | **Yes** — attributed to a named member with an in-repo photo. Re-confirm consent |
| Email | `index.html:127, 129, 139, 142` (`colorstk@umn.edu`) | `content/` + Footer + `/join` + `/sponsor` | **Yes.** Matches `UX-SPEC.md` §5.6/§5.7 |
| Social links | `index.html:134, 144` | Footer "Connect" | **Yes.** See Integrations |
| Join CTA | `index.html:17, 26, 151` (Airtable) | `/join` `JoinBlock` | **Yes**, pending confirmation it is the mailing list |
| **Events** | **does not exist** | `content/events.json` | Nothing to migrate — §5.2 starts from zero. `UX-SPEC.md` §11 open question |
| **Newsletter archive** | **does not exist** in the site; one issue exists as `design/reference/Chapter Notes Newsletter.html` (9.0 MB) | `content/issues.json` | Reference only — the vendored file is the visual north star, not site content |
| **Team / e-board** | **does not exist** | `content/team.json` | Nothing to migrate. No headshots in repo besides `hudeifi.jpg` |
| **Jobs / opportunities** | **does not exist** | `content/jobs.json` | Nothing to migrate |
| **Sponsors** | **does not exist** | — | Nothing to migrate. §9 forbids inventing sponsor logos |

### Images in repo

| file | dimensions | bytes | displayed at | finding |
|---|---|---|---|---|
| `logo.png` | 1544 × 1534 | 149,630 | 36px (`styles.css:92`) and 120px (`:162`) | **~13× oversized**, PNG not WebP/AVIF, no `width`/`height` attributes on either `<img>` (`index.html:14, 22`) → CLS risk, §8 violation. Also `border-radius: 8px/20px` + `object-fit: cover` **crops and rounds the ColorStack logo** — `UX-SPEC.md` §9: "Don't recolor, obstruct, crop, or put a border around the ColorStack logo" |
| `hudeifi.jpg` | 745 × 738 | 208,431 | 56px (`styles.css:424`) | **~13× oversized** and *heavier than the 1544px logo* — unoptimised JPEG. No `width`/`height` attrs (`index.html:108`) |

**Hotlinked images: none in the shipped site.** `index.html` references only `logo.png` and `hudeifi.jpg`, both local. **`README.md` line 1 hotlinks `images/logo.png`, a path that does not exist** — `images/` was removed at commit `e36e85a` "Delete files directory" and paths were flattened at `c704491`, but the README was never updated. The README badge is a broken image today. A higher-res master exists at `design/assets/colorstack-umn-logo.png` (1.5 MB) — prefer it as the source for the rebuild.

---

## Integrations

Recorded from source only; **no external URL was fetched** per the brief.

| service | status | evidence |
|---|---|---|
| **Airtable form** — `https://airtable.com/appkIPLm5Mc9fi6GG/pagXtcxrlrF9Tiff7/form` | **Unverified (not fetched).** This is the de-facto join path, linked 3× ("Become a Member" / "Join Us" / "Become a Member →"). It is an **outbound link to a hosted form, not a POST endpoint** — the site has no `<form>` and captures nothing itself | `index.html:17, 26, 151` |
| **Mailing list** | **Does not exist in this repo.** `UX-SPEC.md` §11 asks where the mailing-list form posts; the answer is "nowhere — there is no form". The Airtable form above may or may not be the same list as the newsletter's Logicform endpoint | `grep -c '<form' index.html` → `0` |
| **LinkedIn** — `https://www.linkedin.com/company/colorstackumn/about/` | Unverified (not fetched). Well-formed company URL. `target="_blank"` **without `rel="noopener noreferrer"`** | `index.html:134` |
| **Instagram** — `https://www.instagram.com/colorstackumn/` | Unverified (not fetched). `target="_blank"` **without `rel`**. **Inconsistent with README**, which links a single post `https://www.instagram.com/p/DPesfD-kkT0/` instead of the profile | `index.html:144`; `README.md` § Contributing |
| **Email** — `mailto:colorstk@umn.edu` | Present 3×. Matches the address specified in `UX-SPEC.md` §5.6/§5.7, so treat as canonical | `index.html:127, 129, 139, 142` |
| **ColorStack national** — `https://www.colorstack.org` | README only, not on the site | `README.md` line 3 |
| **Old Pages URL** — `https://hudeifi.github.io/colorstack-umn-website/` | Different GitHub account from `origin` (`KhalidMuse45`). Ownership unclear | `README.md` line 5 |
| **Analytics** | **None.** No gtag / GA / Plausible / Fathom / Umami / Hotjar / Segment anywhere | `grep -niE 'gtag\|google-analytics\|googletagmanager\|plausible\|fathom\|umami\|hotjar\|segment' index.html script.js` → empty |
| **Slack / GroupMe / Discord / Linktree** | **None.** `UX-SPEC.md` §5.6 requires Slack/GroupMe links on `/join` — no URLs exist in the repo to use | — |
| **Calendar embed** | **None** | — |
| **Third-party scripts** | **None.** Only `<script src="script.js">` | `index.html:159` |
| **Google Fonts CDN** | Live render-blocking `@import` for Playfair Display + DM Sans — both fonts are being deleted, so this request goes away | `styles.css:7` |

### Secrets

**No hardcoded secret, key, token, or credential found.** Scanned `index.html`, `styles.css`, `script.js`, `README.md`, `CNAME`, `.claude/settings.local.json` for `AKIA*`, `ghp_*`, `sk-*`, `-----BEGIN`, `Bearer …`, `api_key=` — zero matches. The only configuration file present, `.claude/settings.local.json`, holds a Bash permission allowlist and no credentials. The Airtable base/page identifiers embedded in the form URL (`index.html:17`) are public form-share identifiers, not secrets, but they are the only externally-meaningful identifiers in the repo. *(Locations only; no values echoed.)*

---

## Slice-0 state on this branch

### Done

| item | state | evidence |
|---|---|---|
| §1 branch | `revamp/slice-0-scaffold`, not `main` ✔ | `git rev-parse --abbrev-ref HEAD` |
| §2 bundle vendored | commit `ffea06a` contains **only** `design/` + root `CLAUDE.md` (18 files) ✔ exactly as §2 requires | `git show --stat ffea06a` |
| §7 `.gitignore` | all six required entries present (`node_modules/ dist/ .astro/ .logs/ .DS_Store design.new/`) ✔ | `.gitignore` |
| §7 pre-commit hook | exists, `-rwxr-xr-x` ✔, `core.hooksPath=.githooks` ✔ | `.githooks/pre-commit`, `git config core.hooksPath` |
| §8 ledger | `HANDOFF-LOG.md` scaffolded with the exact three headings ✔ | `HANDOFF-LOG.md` |
| `.logs/` | created with `.keep`; `dev.log` shows one `HEAD / 200` from a static server | `.logs/dev.log` |
| `plans/` | created, empty (not part of SETUP.md; from `ORCHESTRATION.md`) | `plans/` |
| `.claude/agents/` | `planner.md`, `implementer.md`, `reviewer.md` present — **untracked** (`?? .claude/`) | `git status --porcelain` |

### Not done — SETUP.md §4-§10

| § | requirement | state |
|---|---|---|
| **§4** | `npm create astro@latest . --template minimal --typescript strict`, `npm install`, `npx astro add sitemap` | **Not started.** No `package.json`, no `astro.config`, no `tsconfig.json`, no lockfile |
| **§4** | dirs `src/styles src/layouts src/components content public/fonts public/images` | **None exist** |
| **§5** | `cp design/tokens/*.css src/styles/` | **Not done.** Tokens are still only in `design/tokens/`; `index.html` links no token file |
| **§5** | `src/layouts/Base.astro` with `body { background: var(--cream) … }` | **Not done.** Page ground is still `#ffffff` (`styles.css:11`) |
| **§6** | self-hosted woff2 in `public/fonts/` (Archivo / Lora / IBM Plex Mono / iCiel Gotham) | **Not done.** No `public/`. Site still runtime-imports Playfair + DM Sans (`styles.css:7`) |
| **§9** | five herdr processes (`dev typecheck lint a11y ledger`) writing to `.logs/<name>.log` | **Not done.** No herdr config in repo, no `.pa11yci.json`, no oxlint/tsc. Only `.logs/dev.log` from an ad-hoc static server |
| **§10** | `npm run build && npm run dev` gate + 7 checkboxes | **Unreachable** — no `package.json`, so neither command exists. 0 of 7 boxes satisfiable |

### Deviations and leftover test artifacts — needs decision

1. **The pre-commit hook is a rewrite, not the §7 script, and it is weaker.** `SETUP.md` §7 specifies four `grep -rn` checks over `src/`, the first being **literal hex outside `src/styles/`**. The shipped hook (`.githooks/pre-commit`) scans only *staged* files and **drops the literal-hex check entirely** — the single most important guardrail for "never hardcode a hex". The staged-file approach is defensible (`src/` does not exist yet) but the missing hex check is a gap. Not logged in `HANDOFF-LOG.md`.
2. **`.guardrail-allow` contains `styles.css`** — permanently exempting the main stylesheet from the gradient / `backdrop-filter` / `outline:none` checks. The hook's own failure message requires logging why in `HANDOFF-LOG.md`; **`HANDOFF-LOG.md` is empty**.
3. **A guardrail probe was committed into production CSS.** `styles.css:672` is `.x{backdrop-filter:blur(4px)}`, added by `d271563` — a hook test that was never reverted and is now live glassmorphism in the shipped stylesheet.
4. **`probe.css` is staged (`A  probe.css`)** containing `.y{background:linear-gradient(red,blue)}`. It is a deliberate hook-failure fixture mid-test. It must not reach a commit. The §10 checkbox "pre-commit hook fires and blocks a deliberate `#ff0000`" is therefore **in flight and unverified** — and note the hook cannot block `#ff0000` at all, per deviation 1.
5. **`design/` has been modified since the vendor commit**, breaking the §10 checkbox "`design/` untouched since the vendor commit". `git diff --name-only ffea06a HEAD -- design/` returns 4 paths: `design/tokens/styles.css` (import paths rewritten `tokens/*.css` → `./*.css`) and 3 added PNGs in `design/assets/`. The import fix is correct and necessary — but per `CLAUDE.md` the bundle is "never hand-edited", so this needs to be either blessed or re-vendored.
6. **`.claude/` is untracked** while `CLAUDE.md` is modified but uncommitted (` M CLAUDE.md`). The working tree is not clean; a crash right now loses the agent definitions.

---

## Reuse list

Files worth keeping verbatim — **two**. Everything else is content extraction, not file reuse.

| file | why |
|---|---|
| `CNAME` | One line, `colorstackumn.org`. Load-bearing for the apex domain; GitHub Pages drops the custom domain if it disappears from the deploy branch. Carry it into the rebuild unchanged. |
| `hudeifi.jpg` | Only real member photo in the repo. Reuse the **source pixels**, not the file — needs WebP/AVIF conversion and a duotone-on-`--rose` treatment per §4 `PersonTile` / §5.5. |

**Content to extract (not files):** mission statement (`index.html:32-35`), chapter story (`:38-56`), 3 offering blurbs (`:85-96`), the attributed testimonial (`:104-112`), `colorstk@umn.edu`, and the 3 outbound URLs (Airtable / LinkedIn / Instagram) → `content/*.json`.

**Prefer over the in-repo logo:** `design/assets/colorstack-umn-logo.png` (1.5 MB master) rather than the 1544px `logo.png`.

---

## Delete list

| file / block | reason |
|---|---|
| `styles.css` (all 673 lines) | Parallel `:root` token set that **collides on `--font-body`** with `design/tokens/typography.css`; white page ground (`:11`); Playfair + DM Sans (`:7, :23, :24`); 2 `radial-gradient`s (`:138, :149`); 2 `backdrop-filter`s (`:75, :672`); 3 card grids (`:292, :337, :536`); 10 `box-shadow`s against a flat brand; ungated `scroll-behavior: smooth` (`:37`); zero `:focus` rules; 4 dead custom properties. Nothing survives migration in place. |
| `script.js` (18 lines) | Its only job is the About-Us show/hide toggle, and that section moves to `/about` as always-visible prose. Also: no null guards (throws if `#about-us` is absent), sets `display:none` via inline style with no `aria-expanded`/`aria-controls`. |
| `index.html` | Replaced by the Astro route tree (§5.1-§5.7). Extract the copy first. |
| `probe.css` | **Staged.** Guardrail test fixture containing a deliberate `linear-gradient`. Unstage and delete before any commit. |
| `styles.css:672` `.x{backdrop-filter:blur(4px)}` | Committed hook probe left in production CSS. Removed with the file. |
| `.stats` block (`index.html:63-79`) | Unsourced member/offer counts — `UX-SPEC.md` §9 "Don't invent stats". |
| `.guardrail-allow` entry `styles.css` | Once `styles.css` is deleted, the exemption is stale and silently weakens the hook for whatever occupies that path next. |
| `logo.png` | 1544×1534 / 149 KB PNG serving a 36px slot. Regenerate from `design/assets/colorstack-umn-logo.png` as sized WebP. |
| `README.md` (rewrite, not delete) | Broken image (`images/logo.png` does not exist), a live-site URL on a different GitHub account, a "Tech Stack" table naming Playfair/DM Sans, and the invented "Members: 50+ · Offers Secured: 25+" line reproduced outside the site. |

### Accessibility debt already present (carry into the rebuild's acceptance criteria)

- **No focus styles at all.** `grep -n outline styles.css index.html script.js` → empty. Good news: **no `outline: none` anywhere**. Bad news: no `:focus` or `:focus-visible` rule either, so every one of the 9 interactive elements relies on the UA default ring — which is near-invisible on the maroon pills. §6 requires an explicit 2px `--focus-ring` gold ring at 2px offset.
- **No `prefers-reduced-motion` block anywhere**, yet the sheet uses 6 `translateY` hover transforms and `scroll-behavior: smooth` (`styles.css:37`). Direct `CLAUDE.md` non-negotiable violation.
- **No skip-to-content link** (§8 requires one).
- `#about-us` is hidden by JS with no `aria-expanded` / `aria-controls` on `#learn-more-btn` (`script.js:8-18`); the button label carries bare `↓` / `↑` glyphs as its only state signal.
- `target="_blank"` without `rel="noopener noreferrer"` on both social links (`index.html:134, 144`).
- Decorative content not hidden from AT: the `✉` glyph (`index.html:124`) and the 3 inline brand `<svg>`s lack `aria-hidden="true"`.
- No `width`/`height` on any `<img>` (`index.html:14, 22, 108`) → layout shift.
- No `<meta name="description">`, no Open Graph/Twitter tags, no favicon in `<head>` (`index.html:3-8`).
- **Passing already:** `lang="en"`, exactly one `<h1>`, logical h1→h2→h3 order, all 3 images have real alt text, `--color-text-muted` `#6b5a60` on `#f8f5f6` clears AA.
- Semantics are partly there (`<nav> <header> <section> <footer>`) but there is **no `<main>`** landmark (§8 requires it).

### Undocumented but load-bearing

- **`CNAME` is the entire deploy config.** No workflow, no `vercel.json`, no `netlify.toml` — GitHub Pages is wired in the repo settings UI. Nothing in-repo records the source branch or the Pages environment. Losing `CNAME` silently drops the apex domain.
- **`--font-body` is declared in two places with two different values** (`styles.css:24` = DM Sans; `design/tokens/typography.css` = Lora). Import order decides the winner. This is the single most dangerous thing about migrating in place, and it is the strongest mechanical argument for a clean rebuild.
- The `design/tokens/styles.css` import-path fix at `d271563` is undocumented in `HANDOFF-LOG.md` despite editing the "never hand-edited" bundle.

---

## Blocked / needs human

- **Stats are unsourced — three slots to fill or drop.** "50+ Active Members" and "25+ Offers Secured in 2025" (`index.html:70-77`, repeated in `README.md`) have no source in the repo. `UX-SPEC.md` §9 forbids inventing them and §5.7 requires "real ones only" for `/sponsor`. Need the e-board's real numbers, or these sections ship as empty-state. **Blocks `/sponsor` entirely.**
- **iCiel Gotham font file is missing.** `design/tokens/typography.css` declares `@font-face { src: url('../assets/fonts/iCielGothamBold.ttf') }` but `design/assets/` contains only 3 PNGs — there is no `fonts/` directory. The logo wordmark cannot render as specified. Need the licensed file plus a redistribution answer (`SETUP.md` §6 says to note it under `## Blocked` and ship the Google trio meanwhile).
- **Sticker assets missing.** `UX-SPEC.md` §4 `StickerLayer` requires `assets/stickers/*`; `design/assets/` has no `stickers/`. Blocks §5.1.5 photo-strip decoration.
- **Spec-internal font conflict.** `SETUP.md` §6 says "do not ship a runtime Google Fonts request", but `design/tokens/typography.css` line 8 ships exactly that `@import`. Someone must decide: self-host and strip the `@import` from the vendored token file (another `design/` edit), or accept the CDN request. Affects the §10 "no FOUT flash" checkbox.
- **Where does the mailing list actually post?** (`UX-SPEC.md` §11 Q1.) The site has no form — it links out to an Airtable form (`index.html:17`). Is that the same list as the newsletter's Logicform endpoint, or a second one? `/join` (§5.6) cannot be built until this is settled.
- **No Slack / GroupMe URLs exist anywhere in the repo**, but `UX-SPEC.md` §5.6 requires them on `/join`. Need the invite links.
- **Event data source undecided** (`UX-SPEC.md` §11 Q2). Zero event data in the repo. `/events` (§5.2) and the Home "next event" band (§5.1.3) both start empty — and §5.1.3 says never render an empty band, so the fallback copy path is the day-one path.
- **Team roster and headshots do not exist.** One photo in repo (`hudeifi.jpg`). `/about/team` (§5.5) is fully blocked. (`UX-SPEC.md` §11 Q4: real headshots or duotone placeholders?)
- **Repo ownership / deploy account mismatch.** `origin` is `github.com/KhalidMuse45/Colorstack-UMN-Website` but `README.md` advertises `hudeifi.github.io/colorstack-umn-website`. Which account actually serves `colorstackumn.org`, and who holds the DNS? A rebuild that lands on the wrong repo does not go live. **Note also the repo name itself spells it "Colorstack"** — lowercase `s`, against the `CLAUDE.md` casing rule. Renaming a GitHub repo is a human decision (it changes the Pages URL and breaks the README link).
- **Testimonial consent.** Hudeifi Abdihakin's quote and photo (`index.html:104-112`) are the only person-identifying content. Confirm consent to carry forward before republishing.
- **Slice-0 artifacts must be cleaned before the gate:** unstage/delete `probe.css`, strip `styles.css:672`, decide whether the `design/tokens/styles.css` edit is blessed or re-vendored, and backfill `HANDOFF-LOG.md` with the `.guardrail-allow` justification and the hook-rewrite rationale. The working tree is currently dirty (` M CLAUDE.md`, `A probe.css`, `?? .claude/`).
- **The pre-commit hook cannot catch a literal hex** — the check `SETUP.md` §7 lists first was dropped in the rewrite. Decide whether to restore it (scoped to staged files) before slice 1, since "never hardcode a hex" is a `CLAUDE.md` non-negotiable with no automated enforcement right now.
