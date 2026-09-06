# 05 — Revisions after the first demo

The first Astra build compiled and the hero zoom worked. Three things were wrong, and two of them were the spec's fault. This page records what changed and why, so the next build does not repeat it.

## What we saw

- **Over-labeling.** Six `Fig. 0N` captions, four "image tags" (`01 / Learn By Doing`), six "meta-notes" (`Good People. Real Work.`), a scroll cue, a "keyboard hint," a "chapter coordinate," and a labeled "Chapter Index" rail. Every image had a mono badge on it. The site read like a museum wall, not a room.
- **Gimmicks at the top.** The hero carried an eyebrow, a wordmark, a tagline, a lede, a CTA, a scroll cue, a location line, a caption, and a second caption. The photo was the point and it was buried.
- **Cream flattened the motion.** Duotone lifting to color and clip-path wipes both read stronger against white. Cream softened every edge.

## What changed

### 1. The image speaks. Labels are gone by default.

| Before (spec v1) | Now |
|---|---|
| Every section opens with a mono `№ 0N — Label` row and a hairline | Sections open with the H2. No meta row. The sticky index in the gutter is the only place section numbers appear, and it has no "Chapter Index" heading |
| Every full-bleed photo gets a `Fig. 0N` caption | No captions on photos. The one exception is the hero, and only at the end of the zoom, and only if the chapter wants the event named. Default: off |
| Image tags on program photos | Removed. The program title beside the photo is the label |
| "Meta-notes" over sections | Removed. If a line is good it goes in the body copy in Lora; if it is not, it goes |
| Scroll cue, keyboard hint, coordinate line | Removed |
| Mono for every small string | Mono only for: the sticky index numbers, the nav bracket `[ Menu ]`, the spec-sheet keys, and the footer. Nothing else |

The hero now has four things: the wordmark, the italic lede, one gold pill, and the photo. That is the whole above-the-fold.

### 2. Constraints that were mandates are now allowances

The v1 spec said "every section opens with a meta row" and "mono opens every section." That turned a texture into a rule and produced the wall of labels. `01-BRAND-RULES.md` now says the mono meta row *may* be used, at most once per page outside the spec sheet and footer. `02-LANDING-REDESIGN.md` was rewritten to match.

### 3. White canvas

Page background is now `#FFFFFF`. Cream `#FBF5EC` moves to a secondary surface: the editorial reading column, the spec sheet ground, pull-quote grounds, the newsletter page. So the brand keeps its warmth where people read, and the motion happens on white where it is sharpest.

Token changes: `--page: #FFFFFF`, `--surface-warm: #FBF5EC`. The old `--cream` name stays as an alias for `--surface-warm`. Cards on white use a 1px `--line` border, no fill. Cards on cream use paper `#FFFFFF`.

### 4. The three ideas from the board

The annotated inspiration board (Taste Labs / Poolside / Anthropic notes) is now in the spec as three named patterns:

- **Floating cards (Taste Labs) → Events section.** Event flyers and photos float as a loose 3D cloud on the hero canvas of the Events page, drifting, tilting toward the cursor, one clicked card zooming to the front. This replaces the hero photo zoom on that page. Component: `FloatingCards.tsx`.
- **Indented side nav with the mascot (Poolside) → Editorial pages.** On the newsletter, blog and about pages, the nav is a rounded, bordered panel top-left containing the Goldy chapter mark and a short vertical link list. Component: `SideNav.tsx`.
- **Scroll zoom on the feature image (Anthropic) → any editorial post, event page, or CTA band.** A contained image (not full-bleed) that scales from ~0.86 to 1.0 and rounds its corners from 12px to 0 as it scrolls into view, with the headline sitting on top. Reusable, cheaper than the WebGL hero, allowed on any page. Component: `ZoomImage.tsx`.

### 5. Full navigation

The v1 nav had two links and a pill. The e-board needs the whole site reachable from it. See `02` for the map; the short form:

`About · Programs · Events · Newsletter · Opportunities · Resources · Wunderbar · Join` plus a `Contact` in the footer and the `[ Menu ]` bracket for the full-screen menu on mobile.

**Wunderbar** is the e-board's peer-to-peer mock interview platform. It gets a top-level nav item now (linking to a coming-soon page with a waitlist) so the IA does not need to change when it ships.

## What did not change

Fonts, hexes (other than the page ground), pill buttons, the hero zoom mechanics, the motion budget, the Sanity model, the stack. Voice rules. The no-invented-stats rule.

## Checklist for the next build

- [ ] Hero has exactly four elements above the fold
- [ ] Zero `Fig.` captions unless the chapter turned the hero one on
- [ ] Zero image tags, meta-notes, scroll cues
- [ ] At most one mono meta row on the page outside the spec sheet and footer
- [ ] Page ground is white; reading columns and spec sheet are cream
- [ ] Nav shows all eight items on desktop, `[ Menu ]` on mobile
- [ ] Wunderbar link present
- [ ] Events page uses `FloatingCards`, not the photo zoom
