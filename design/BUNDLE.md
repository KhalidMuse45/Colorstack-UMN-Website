bundle: v2
pulled: 2026-08-12T00:24 (local mtime of the unzipped drop; the zip carried no manifest timestamp)
source: design session "ColorStack UMN Design System"
contains: UX-SPEC.md, LANDING-PAGE.md, BRAND-SYSTEM.md, tokens/, reference/, assets/, agents/, components/motion/
notes: |
  Ingested surgically, NOT as a wholesale directory replacement. Reason: the v2 drop
  ships LF line endings and the vendored v1 files are CRLF, so `diff -rq` reports all
  16 carried-over files as changed. Verified with `diff --strip-trailing-cr` that 15 of
  them are byte-identical modulo line endings. Replacing wholesale would have produced a
  ~3000-line commit in which the four real changes were unreviewable, defeating the
  diff-before-replace step in PULL-FROM-DESIGN-CHAT.md §"Pulling an update later".

  Applied (classified per PULL-FROM-DESIGN-CHAT.md step 3):
    - STRUCTURAL  LANDING-PAGE.md (new) — supersedes UX-SPEC.md for the website.
    - STRUCTURAL  components/motion/ (new) — nine dependency-free React motion
                  primitives + types.d.ts + RESTORE.md. Kept at their shipped
                  `.jsx.txt` names: design/ is a read-only vendor drop and the
                  suffix is what stops a build tool treating them as live source.
    - STRUCTURAL  reference/LandingPage.dc.html (new) — reference implementation.
    - COSMETIC    README.md — adds the LANDING-PAGE.md pointer and two file-map rows.
  Not applied: the 15 CRLF-only deltas. Content is identical; re-committing them would
  be pure churn. Normalising design/ to LF is a separate janitorial commit if wanted.

  Carried forward from v1, still true:
    - design/tokens/styles.css — 3 @import paths rewritten in d271563 ('./colors.css').
      v2 STILL ships the unresolvable 'tokens/colors.css' form. Not re-broken here.
      Report upstream again for v3.
    - design/assets/{brand-ref-dos-donts,brand-ref-identity,colorstack-umn-logo}.png
      added in d271563.
known bundle gaps (do NOT fix here — route through design/FEEDBACK.md):
  - assets/fonts/iCielGothamBold.ttf is referenced by tokens/typography.css:11 but absent.
  - assets/stickers/* is referenced by UX-SPEC.md §4 (StickerLayer) but absent.
  - LANDING-PAGE.md:16 mandates 10px control / 14px media radii, but tokens/spacing.css
    ships only --radius-sm 6 / --radius-md 12 / --radius-pill 999 and its comment still
    reads "brand shapes are pill-heavy". The spec's own no-pill rule has no token to
    satisfy it. NEW IN v2.
  - LANDING-PAGE.md:25 states the landing-page photos "already exist in the repo".
    They do not. public/images/ holds only colorstack-umn-logo.png and
    hudeifi-abdihakin.jpg. Seven are referenced by reference/LandingPage.dc.html:
    summit-group, summit-portrait, summit-signage, ideathon, game-night-chess,
    game-night-signage, logo. NEW IN v2.
