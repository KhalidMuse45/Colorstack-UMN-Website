# Handoff: ColorStack UMN Website Revamp

## Read this first (CLI agent kickoff)

You are rebuilding **colorstackumn.org**. Everything you need is in this folder.

**Running a multi-agent orchestration?** Start at `PULL-FROM-DESIGN-CHAT.md` (how to ingest this bundle + the paste-ready bootstrap prompt), then `CLAUDE.md` → `ORCHESTRATION.md` → `REPO-RECON.md` → `SETUP.md`. The single-agent path below still applies underneath it.

**Just need to stand the repo up?** `SETUP.md` is slice 0 — prerequisites through the first commit, with a verification gate at the end.

**Building the landing page?** `LANDING-PAGE.md` is the current spec for it and **supersedes `UX-SPEC.md` wherever they disagree** — the site is no longer editorial in style. Reference implementation: `reference/LandingPage.dc.html`.

**Order of operations:**
1. Read `UX-SPEC.md` end to end. It is the authoritative spec — IA, page-by-page layout, tokens, fonts, motion, a11y, and hard brand rules.
2. Read `BRAND-SYSTEM.md` for brand voice, logo rules, and rationale behind the visual direction.
3. Skim `reference/Chapter Notes Newsletter.html` in a browser. **This is the visual north star** — the website is this editorial language expanded to a site. Match its hairline rules, mono meta rows, duotone imagery, and cream ground.
4. Copy `tokens/*.css` into the new project and import `styles.css` first in your entry stylesheet. Never redeclare or hardcode a token value.
5. Build in the order given in §10 of `UX-SPEC.md`.

## About the design files
The HTML in `reference/` is a **design reference**, not production code. Do not ship it as-is. Recreate its look and behavior in whatever environment the site targets, using that environment's conventions. The CSS token files, however, **are** production-ready — copy them directly.

## Fidelity
**High fidelity.** Colors, type scale, spacing, and motion values in `UX-SPEC.md` are final. Match them exactly. Where the spec is silent (micro-copy, exact photo crops), make a judgment call consistent with the reference newsletter and note it.

## Recommended stack
No framework is required — this is a content site. Recommended: **Astro** (or plain HTML + a light build step) with static output, zero client JS by default, and progressive enhancement for the mobile nav sheet and scroll reveals. If you use React/Next, keep pages static and avoid client components for content.

Content should be file-driven so the e-board can edit without you:
```
content/events.json      # upcoming + past events
content/issues.json      # newsletter archive entries
content/team.json        # e-board members + headshots
content/jobs.json        # opportunities board
```

## Suggested first prompt to run

> Read `UX-SPEC.md`, `BRAND-SYSTEM.md`, and open `reference/Chapter Notes Newsletter.html`.
> Scaffold an Astro static site with `tokens/*.css` imported globally via `styles.css`.
> Build the global chrome (NavBar, MobileSheet, Footer) and the `/` home page exactly per §5.1 of the spec.
> Use only the tokens defined in `tokens/colors.css` — no new hex values, no new fonts beyond Archivo / Lora / IBM Plex Mono.
> Stop after the home page and show me the result before continuing.

## Definition of done (check before every commit)
- [ ] Page background is `--cream` `#FBF5EC`, never white
- [ ] Only 3 typefaces in layouts: Archivo (display), Lora (body), IBM Plex Mono (meta). iCiel Gotham is **logo only**
- [ ] "ColorStack" always capital C, capital S
- [ ] No gradients, textures, glassmorphism, or heavy shadows
- [ ] Hairline rows used where the spec calls for them — no SaaS card grids
- [ ] No border, recolor, or obstruction on the ColorStack logo; national green/yellow-S mark never used
- [ ] Every interactive element has a visible gold focus ring; no `outline: none`
- [ ] All motion gated behind `prefers-reduced-motion`
- [ ] Decorative glyphs/stickers are `aria-hidden` and `pointer-events: none`
- [ ] No invented stats, member counts, or sponsor logos
- [ ] Lighthouse a11y 100, LCP < 2.0s on 4G

## Design tokens
Full tables live in §3 of `UX-SPEC.md`. Source files: `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`.

Fonts (Google, already imported in `tokens/typography.css`):
```
Archivo 500;600;700;800;900   — display / headlines
Lora 400;500;600 + italics    — body
IBM Plex Mono 400;500         — meta, captions, timestamps
iCiel Gotham Bold (local .ttf) — LOGO WORDMARK ONLY
```
Self-host or `preconnect` these; `font-display: swap`; subset to latin.

## Assets
- `assets/colorstack-umn-logo.png` — official chapter mark (maroon ground, gold S, block M + Goldy)
- `assets/brand-ref-identity.png` — national brand identity sheet (voice, color, logo, fonts)
- `assets/brand-ref-dos-donts.png` — national social-media Do's & Don'ts sheet
- Event photos, headshots, and sticker collage art are **not** included — request them from the chapter. Ship duotone placeholders on `--rose` until they arrive; never lorem-ipsum a photo slot.

## Files in this bundle
```
README.md                   ← you are here
PULL-FROM-DESIGN-CHAT.md    how the parent session ingests + re-pulls this bundle
CLAUDE.md                   orchestrator constitution (auto-loads in Claude Code)
ORCHESTRATION.md            pane contract, delegation envelope, slice sequence, gates
REPO-RECON.md               read-only recon brief → produces RECON.md
LANDING-PAGE.md             landing-page addendum — supersedes UX-SPEC for the site
SETUP.md                    slice 0: scaffold, tokens, fonts, guardrails, first commit
agents/planner.md           plan-only role
agents/implementer.md       scoped-write role
agents/reviewer.md          verdict-only role
UX-SPEC.md                  full UX + visual specification
BRAND-SYSTEM.md             brand voice, color/type rationale, logo rules
components/motion/          nine dependency-free React motion primitives (.jsx.txt — see RESTORE.md)
tokens/                     styles.css + colors/typography/spacing — copy into the project
reference/                  Chapter Notes newsletter + LandingPage.dc.html (reference only; no photos — already in the repo)
assets/                     chapter logo + national brand reference sheets
```

## Open questions to resolve with the chapter
Listed in §11 of `UX-SPEC.md`: mailing-list form endpoint, event data source, licensed vs. Google fonts, headshot availability, and confirmed reach numbers for `/sponsor`.
