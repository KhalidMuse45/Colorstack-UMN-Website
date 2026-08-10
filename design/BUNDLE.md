bundle: v1
pulled: 2026-08-10T06:19:56Z
source: design session "ColorStack UMN Design System"
contains: UX-SPEC.md, BRAND-SYSTEM.md, tokens/, reference/, assets/, agents/
notes: unzipped into repo root, quarantined into design/ post-hoc
deviations (blessed by human 2026-08-10, not clean — SETUP.md §10 checkbox is "blessed", not "untouched"):
  - design/tokens/styles.css — 3 @import paths rewritten in d271563. The bundle shipped
    'tokens/colors.css' etc., which do not resolve from inside design/tokens/. Corrected
    to './colors.css'. Report upstream so v2 ships resolvable paths.
  - design/assets/{brand-ref-dos-donts,brand-ref-identity,colorstack-umn-logo}.png added
    in d271563 (were loose in the repo root after the post-hoc quarantine).
known bundle gaps (do NOT fix here — route through design/FEEDBACK.md):
  - assets/fonts/iCielGothamBold.ttf is referenced by tokens/typography.css:11 but absent.
  - assets/stickers/* is referenced by UX-SPEC.md §4 (StickerLayer) but absent.
