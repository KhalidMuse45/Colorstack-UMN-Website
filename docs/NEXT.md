# What is left

Pick-up point for the next developer. Written 2026-08-12, after the landing
page landed on `revamp/landing-hero`.

Read `docs/README.md` first for the repository map, then this. The running
ledger with full rationale is `HANDOFF-LOG.md`; this file is only the
forward-looking list.

## State of play

`/` is built and working. `/motion-lab` is an internal gate route showing the
nine motion primitives in isolation. **Those are the only two routes that
exist.** Everything else the nav points at is a 404.

The whole landing page reads its copy, photos and links from
`src/data/landing.ts`. Change strings there, not in the components.

Verified on the landing page, so you can trust these and focus elsewhere:
JavaScript disabled and reduced motion both leave every section readable with
nothing stranded at `opacity: 0`; no horizontal overflow at 1280 or 375;
`astro check` 0/0/0; `npm run lint` and `npm run build` pass.

## Blocked on the chapter, not on code

These are the only things a developer cannot unblock alone.

- **Testimonials.** `testimonials` in `src/data/landing.ts` is an empty array
  on purpose, so the Voices section renders nothing at all rather than an
  empty band. The reference's three quotes read "Placeholder quote / Replace"
  and `design/LANDING-PAGE.md:133` says they must not ship. Add real quotes
  with a real name and role and the section appears by itself. **Do not invent
  quotes to fill it.**
- **Verify the stat band.** It says `100+` members and `10+` offers, confirmed
  by the chapter. The retired site claimed `50+` members and `25+` offers.
  Members doubling is plausible; offers falling from 25+ to 10+ is not
  obviously so. This is the most sponsor-facing number on the page, so it is
  worth one more check before launch.
- **Meeting time and location.** Deliberately absent everywhere.
  `design/LANDING-PAGE.md:134` says the location is unconfirmed and must not
  be invented. The contact copy routes that question to the inbox instead.
- **Three photo slots reuse summit shots.** All six landing photos are real,
  but the chapter may prefer different frames for `summit-portrait` and the
  two game-night slots. Masters are in `assets-src/photos/`; the conversion
  command is in `assets-src/README.md`.

## Next up, in order

### 1. The requested extras
Asked for directly, not in the design bundle. Nothing here is spec'd, so agree
the look before building.

- **Join dialog.** A real `<dialog>` for the mailing-list capture. Must be
  keyboard-closable, must return focus to whatever opened it, and must still
  work with JS off (fall back to the existing form in the maroon band, which
  is a plain GET to the Logicform endpoint).
- **Multi-colour word-tile bar for the sub-bar.** The swatches supplied with
  the request (`#ff2e20`, `#7c4dff`, `#22e58b`, and so on) are a different
  palette and **would fail the brand rules and the pre-commit hook**. Retone
  to maroon, gold, rose, teal and coral before building, and show the owner
  first. Reduced motion must render the bar assembled and static.
- **Text ripple on the ColorStack logo.** `TextEffect` already does per
  character reveal and is the natural base. The logo is currently a PNG in the
  NavBar, so this needs a text wordmark first, and note that
  `design/CLAUDE.md` restricts the iCiel Gotham face to the logo wordmark
  only, and that binary is not in the repo.
- **Toolbar / dock.** `LiquidMenu` is already mounted bottom right as `Fab`.
  Clarify whether the dock is meant to replace it or sit alongside it, because
  two floating controls on one page is one too many.

### 2. Landing polish pass
Build order #7 in `design/LANDING-PAGE.md`.

- Lighthouse and an axe run. Neither has been run yet on the real page.
- Full keyboard traversal of the whole page, not just the components.
- Check the LCP. The hero photo is `loading="eager"` with `fetchpriority=high`
  and is 404KB; if LCP is over the 2.0s budget in `UX-SPEC.md` section 8,
  serve a smaller hero variant rather than lazy-loading it.
- Above-the-fold arming may flash. Content renders visible, then JS arms the
  hidden state, then the observer reveals. Below the fold that is invisible;
  on the hero `TextRoll` it could show as a one frame flicker. If it does,
  arm from a blocking inline script in `<head>` instead of a module script.

### 3. The seven missing routes
This is the biggest remaining chunk and the most visible bug. The nav links to
all of these and every one 404s:

`/events` · `/newsletter` · `/opportunities` · `/about` · `/about/team` ·
`/join` · `/sponsor`

Each has a spec in `design/UX-SPEC.md` section 5. Note that `UX-SPEC.md` is
superseded by `LANDING-PAGE.md` **for styling** (no pills, no mono, no em
dashes), but its information architecture and page contents still stand.

`/newsletter` is the exception and the one place the editorial treatment
survives: IBM Plex Mono, `No.` indexes, `Fig.` captions. Reference is
`design/reference/Chapter Notes Newsletter.html`.

**When you build one of these, delete its entry from the `--skip` list in the
`lint:links` script in `package.json`.** Those skips are temporary and exist
only because the routes 404 today. Leaving them in means the link checker
silently stops protecting that route.

### 4. Wonder bar
**Stop before building this.** The owner asked to discuss the design first.

## Conventions that will bite you

All enforced by `.githooks/pre-commit` and `scripts/guardrails.sh`, which are
deliberately identical so a local commit and CI never disagree.

- No literal hex outside `src/styles/`. Use `var(--token)`.
- No pills. `--radius-control` is 10px for controls, `--radius-media` is 14px
  for media and cards. `--radius-pill` is newsletter and print only.
- No IBM Plex Mono on the site. Labels use `SectionLabel`, which is Archivo
  700 at `--text-label` / `--tracking-label`. Mono is `/newsletter` only.
- No em dashes in rendered copy. Commas or full stops. Code comments are fine.
- Never `outline: none`.
- Motion must degrade. Server HTML renders the **final, visible** state and
  scripts only ever add the hidden one. If you write a component that starts
  hidden and reveals in a script, it will strand content for anyone with JS
  off or reduced motion on, and that fails the definition of done.
- `design/` is a vendored drop. Never hand-edit it.

One Astro trap worth knowing, because it cost real time: declaring
`as?: string` in a `Props` interface **silently voids the entire interface**.
The component still compiles, `astro check` reports zero errors, and nothing
on it is type checked. Use the generic form instead, as in
`src/components/motion/TextRoll.astro`.
