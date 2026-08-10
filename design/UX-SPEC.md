# ColorStack UMN — Website Revamp
### UX + Design Handoff Spec (for CLI agent implementation)

**Version** 1.0 · Aug 2026 · **Source of truth:** this repo (`ColorStack UMN Design System`)
**Target:** `colorstackumn.org` — full rebuild
**Design direction:** *modern technical editorial* — the same architecture already shipped in `templates/newsletter/Newsletter.dc.html`. The website is the newsletter's world, expanded.

---

## 0. How to use this document

You are implementing a static, fast, accessible site. Read sections in order. Every value in §3 (Tokens) is copy-paste ready and already exists in this repo — **import the CSS, do not re-declare tokens**. Section §9 (Do's & Don'ts) contains hard brand rules; violating them is a failed build, not a style opinion.

**Non-negotiables before you write code:**
1. Import `styles.css` from the design system root. It cascades `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`.
2. Never hardcode a hex that exists as a token.
3. "ColorStack" is always capital **C**, capital **S**. Never "Colorstack", "COLORSTACK" in body copy, or "color stack".
4. iCiel Gotham is the **logo wordmark only**. Never a headline, never UI.

---

## 1. Goals & audience

### Primary goals
| # | Goal | Success signal |
|---|---|---|
| G1 | Get students to **join the mailing list** | Mailing-list form submits from any page in ≤2 clicks |
| G2 | Make the **next event** unmissable | Event date/time/location visible above the fold on `/` |
| G3 | Prove the chapter is **active and real** | Photos, past events, member spotlights, newsletter archive |
| G4 | Route students to **jobs & opportunities** | Job board reachable from global nav |
| G5 | Give recruiters/sponsors a **credible contact path** | Sponsor/contact page with a real ask |

### Audiences (priority order)
1. **UMN Black & Latinx CS students** — the whole point. Skimming on a phone between classes. Wants: when's the next thing, is it for me, how do I get in.
2. **Curious allies / other majors** — wants: can I come.
3. **Recruiters & sponsors** — wants: reach, credibility, contact.
4. **Incoming e-board / national ColorStack** — wants: chapter legitimacy, brand consistency.

### Design principle
> **Editorial, not corporate.** This is a student publication that happens to be a website. Hairlines and mono meta rows over cards-in-a-grid. Warm cream, never white-app-gray.

---

## 2. Information architecture

```
/                      Home — masthead, next event, what we do, latest newsletter, join
/events                Upcoming + past events (event detail pages optional, see §5.2)
/newsletter            "Chapter Notes" archive — issue list + reader
/opportunities         Jobs, internships, ColorStack national programs
/about                 Mission, chapter story, national affiliation
/about/team            E-board directory (duotone headshots)
/join                  Mailing list + Slack/GroupMe + first-timer FAQ
/sponsor               For recruiters & sponsors
```

**Global nav (desktop):** logo left · `Events` `Newsletter` `Opportunities` `About` right · **`Join`** as a gold pill CTA, always last.
**Global nav (mobile):** logo + hamburger. Sheet slides down, full-bleed maroon, links in Archivo 32px, `Join` pill pinned at the bottom of the sheet.
**Footer:** hairline top rule, 4 columns (Chapter / Explore / Connect / Colophon), mono meta row with copyright + "A ColorStack chapter at the University of Minnesota Twin Cities" + a live-updating timestamp (matches the newsletter masthead device).

**Depth rule:** nothing is more than 2 clicks from `/`. No mega-menu. No dropdowns in the primary nav.

---

## 3. Design tokens (import, don't retype)

```html
<link rel="stylesheet" href="/styles.css">
```

### 3.1 Color
| Token | Value | Use |
|---|---|---|
| `--maroon` | `#7A0019` | Primary. Masthead ground, primary buttons, headings |
| `--maroon-deep` | `#5B0013` | Hover/pressed on maroon |
| `--maroon-light` | `#900021` | Link hover ↗ marker, accents |
| `--gold` | `#FFCC33` | Highlight, secondary CTA fill |
| `--gold-dark` | `#FFB71E` | Gold hover/pressed |
| `--gold-soft` | `#FFDE7A` | Link hover highlighter-swipe |
| `--stack-yellow` | `#FCB432` | **THE** ColorStack yellow — national mark only, sparingly |
| `--teal` | `#2E9E91` | Accent (badges, glyphs) — sparingly |
| `--pink` | `#F0426B` | Accent — sparingly |
| `--coral` | `#FB6D4C` | Accent — sparingly |
| `--rose` | `#C6887F` | Duotone photo ground |
| `--cream` | `#FBF5EC` | **Page background — the default, not white** |
| `--paper` | `#FFFFFF` | Cards |
| `--ink` / `--ink-soft` | `#1F1A17` / `#5C534E` | Body / secondary text |
| `--line` | `#E8DCCB` | Borders on cream |
| `--hairline` | `rgba(31,26,23,.3)` | Editorial rules on light |
| `--hairline-inverse` | `rgba(251,245,236,.35)` | Rules on maroon |
| grays | `#333333 #5A5A5A #777677 #D5D6D2` | Official UMN Folwell secondary |

**Ratio guide per page:** ~70% cream, ~20% maroon (bands), ~7% gold, ≤3% national accents combined.

### 3.2 Typography — three-tier editorial stack

Fonts load from Google Fonts (already in `tokens/typography.css`):

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

| Role | Family | Token | Weights | Rules |
|---|---|---|---|---|
| **Display / headlines / masthead** | **Archivo** | `--font-display` | 500–900 | Grotesque. Tracking `-0.01em`. Leading 1.02 (hero) / 1.12 (headings). Sentence or Title Case, never ALL CAPS above 24px |
| **Body / editorial** | **Lora** | `--font-body` | 400/500/600 + true italics | Ledes are *italic*. Leading 1.55. Max measure **68ch** |
| **Meta / labels / captions / timestamps** | **IBM Plex Mono** | `--font-mono` | 400/500 | 11px, UPPERCASE, tracking `+0.08em`. Meta rows, `№` indexes, figure captions, nav utility |
| **Logo wordmark ONLY** | iCiel Gotham Bold | `--font-logo` | 700–900 | `assets/fonts/iCielGothamBold.ttf`. **Never** in layouts |

Fallback chains are declared in the token file (`Helvetica Neue` / `Georgia` / `SF Mono`) — do not substitute other fallbacks.

**Scale** (`--text-*`): hero 56 · h1 40 · h2 28 · h3 20 · body 17 · small 14 · caption 12 · meta 11.
**Fluid rule:** clamp the hero only — `clamp(38px, 7vw, 92px)` for the home masthead; everything else steps at breakpoints.

### 3.3 Space, radius, shadow
Scale `--space-1…8` = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64. Section vertical rhythm: `--space-8` mobile, `96px` desktop.
Radius: `--radius-sm` 6 · `--radius-md` 12 (cards) · `--radius-pill` 999 (buttons, chips).
Shadow: `--shadow-card` only, and rarely. **The brand is flat.**

### 3.4 Grid & breakpoints
12-col, max content width **1200px**, gutter 24px (mobile 16px). Editorial text blocks sit in cols 2–8, not full width.
Breakpoints: `640` (sm) · `900` (md) · `1200` (lg). Mobile-first CSS.

---

## 4. Component inventory

Reuse from `components/core/` — do not re-invent:

| Component | Props | Notes |
|---|---|---|
| `Button` | `variant: 'primary'\|'gold'\|'ghost'`, `size: 'sm'\|'md'\|'lg'`, `disabled` | Pill. Primary = maroon/white, gold = gold/maroon text |
| `Badge` | `tone: 'maroon'\|'gold'\|'teal'\|'pink'\|'outline'` | Event type, date, tag chips |
| `Card` | `title`, `glyph` (default `✳`), `padded` | White on cream, 12px radius |
| `Input` | `label`, `placeholder`, `type`, `hint` | Gold focus ring |

### New components to build for the site
| Name | Purpose | Spec |
|---|---|---|
| `MetaRow` | Hairline row above every section | Mono 11px uppercase: `№ 03 — UPCOMING EVENTS — 2 MIN READ`, 1px `--hairline` above |
| `Masthead` | Home hero | Archivo 900 clamp headline on cream, live timestamp mono row, hairline rules top & bottom |
| `EventCard` | Event listing item | Date block (mono) · title (Archivo 700, 24px) · location + Badge · RSVP link. **Row, not a box**, separated by hairlines |
| `FigureBlock` | Photo + caption | Duotone image, mono caption `FIG. 04 — LAST SEASON'S KICKOFF`, optional sticker overlay |
| `IssueRow` | Newsletter archive item | Issue №, date, headline, `→` |
| `PersonTile` | E-board member | Duotone headshot on `--rose`, name Archivo 600, role mono 11px |
| `JoinBlock` | Mailing-list capture | Maroon band, Input + gold Button, one line of reassurance copy |
| `StickerLayer` | Collage decoration | `assets/stickers/*`, `multiply` blend on cream, rotate 8–14°, **`pointer-events:none`**, `aria-hidden` |
| `NavBar` / `MobileSheet` / `Footer` | Chrome | Per §2 |

---

## 5. Page specs

### 5.1 `/` Home
Order, top to bottom:
1. **NavBar** (sticky, cream, 1px `--hairline` bottom on scroll).
2. **Masthead** — `ColorStack UMN` in Archivo 900 at clamp size, subhead in Lora italic: one sentence on who the chapter is for. Mono row with live date/time + chapter location. Two CTAs: `Join the list` (gold pill) + `See events` (ghost).
3. **Next event band** — maroon full-bleed. Date huge in Archivo, title, location, RSVP gold pill. If no upcoming event, this band swaps to "Next semester's schedule drops soon — join the list" (never render an empty band).
4. **What we do** — 3 editorial columns, each opening with a `✳` glyph, Lora body. No icons.
5. **Photo strip** — 3 `FigureBlock`s from real events, duotone, mono captions, one sticker overlay total (restraint).
6. **Latest newsletter** — pull the most recent Chapter Notes issue: №, headline, 2-line dek, `Read issue →`, plus `All issues →`.
7. **JoinBlock** — maroon.
8. **Footer**.

### 5.2 `/events`
Hairline-separated `EventCard` rows, not a card grid. Two groups: **Upcoming** then **Past** (past at 60% opacity meta, still linked to photos). Filter chips (`Badge` outline): All · Workshop · Social · Career · Ideathon. Event detail pages are **optional** — if an event has no unique content, the row links straight to the RSVP URL.

### 5.3 `/newsletter`
Archive index of `IssueRow`s, newest first, grouped by semester with a mono divider (`FALL 2026`). Clicking opens the issue reading view — reuse the newsletter template's layout at content width; **do not restyle it**. Include a "Get it in your inbox" JoinBlock at the bottom of every issue.

### 5.4 `/opportunities`
Two sections: **Jobs & internships** (hairline rows: company · role · deadline Badge · apply ↗) and **ColorStack national programs** (Fellowship, Summer Fund, etc. — link out, describe honestly, do not imply chapter ownership). Add a mono note with the last-updated date; stale job boards kill trust.

### 5.5 `/about` + `/about/team`
About: chapter story in Lora with an italic lede, national affiliation paragraph, one full-bleed photo. Team: `PersonTile` grid — 2 cols mobile / 4 desktop, duotone headshots on `--rose`, LinkedIn ↗ per person. Alumni in a smaller mono list beneath.

### 5.6 `/join`
The conversion page. Above the fold: the form, nothing else competing. Below: "What you'll get" (3 mono-numbered lines), "Do I have to be Black or Latinx?" honest FAQ (answer: events are open, the community centers Black & Latinx students), Slack/GroupMe links, and the email `colorstk@umn.edu`.

### 5.7 `/sponsor`
Chapter reach numbers (real ones only — never invent stats), what sponsorship funds, past partners, and a single contact CTA to `colorstk@umn.edu`. Keep it one screen of scroll.

---

## 6. Interaction & motion

| Element | Behavior |
|---|---|
| Links | Underline on hover + `--gold-soft` highlighter swipe behind the text + `--maroon-light` `↗` marker for external |
| Buttons | maroon → `--maroon-deep`; gold → `--gold-dark`. Darken on press. **No scale/shrink transforms** |
| Section reveal | Fade + 16px rise, 0.8s `cubic-bezier(.22,1,.36,1)`, 0.15s stagger |
| Images | Wipe open via `clip-path` (unfolding-paper feel) |
| Stickers | Spring pop-in |
| Focus | 2px `--focus-ring` (gold) offset 2px — visible on every interactive element, never `outline:none` |

Everything above is gated on `@media (prefers-reduced-motion: reduce)` → transitions ≤0.01ms, no transforms.

---

## 7. Content rules

- **Tone:** fun, enthusiastic, community-driven. Vibrant, relatable. Speaks to students as **you**; the chapter is **we**.
- **Headings:** Title Case.
- **Exclamation points:** on-brand, max one per paragraph.
- **Emoji:** avoid on the website. Use the decorative glyph set instead: `✳ ✦ ★ ✔ ✖`.
- **Never** placeholder copy in a shipped build. If content is missing, ship the section empty-state, not lorem.
- Dates: `Thu · Sep 18 · 6:00 PM` (mono, middot separated).

---

## 8. Accessibility & performance

- WCAG **AA** minimum. Verified pairs: white on `--maroon` ✔ · `--ink` on `--cream` ✔ · `--maroon` on `--gold` ✔. **`--gold` text on cream ✘ — never do it.**
- Semantic landmarks (`header/nav/main/footer`), one `h1` per page, logical heading order.
- All decorative stickers/glyphs `aria-hidden="true"`.
- Every image gets real alt text describing the event/person; duotone is a treatment, not content.
- Keyboard: full tab traversal, skip-to-content link, mobile sheet traps focus and closes on `Esc`.
- Targets ≥44×44px.
- Budget: LCP <2.0s on 4G. Self-host or `preconnect` the Google fonts, `font-display: swap`, subset to latin. Images as WebP/AVIF with width/height set. No JS framework needed for a content site — ship static HTML/CSS with progressive-enhancement JS.

---

## 9. Do's & Don'ts (hard brand rules)

### ✔ Do
- Use **UMN school colors** as the primary identity — national guidelines explicitly encourage chapters to use their school colors.
- Spell it **ColorStack** — capital C, capital S. Every time.
- Put the **school logo/mascot bottom-right** on shareable graphics.
- Keep pages **cream** (`--cream`), cards white.
- Use hairlines and mono meta rows to divide content — this is the system's signature.
- Use `--stack-yellow` `#FCB432` when the ColorStack national mark appears.
- Keep decoration sparse: at most one sticker cluster per viewport.
- Give every section a `№` and a purpose.

### ✘ Don't
- **Don't** use the national green-background / yellow-S mark — chapters may not.
- **Don't** recolor, obstruct, crop, or put a **border around** the ColorStack logo.
- **Don't** use any yellow other than `#FCB432` for the national mark.
- **Don't** set headlines or UI in **iCiel Gotham** — logo wordmark only.
- **Don't** introduce gradients, textures, glassmorphism, or heavy drop shadows. The brand is flat.
- **Don't** add fonts. Three families + logo font. That's the system.
- **Don't** use emoji in site chrome or headings.
- **Don't** build card grids where hairline rows belong — it turns the editorial voice into a SaaS template.
- **Don't** invent stats, member counts, or sponsor logos.
- **Don't** use white `#FFF` as a page background.
- **Don't** hardcode hexes — tokens exist.

---

## 10. Build order (suggested)

1. Scaffold + import `styles.css`; verify all four font families render (check Lora italics and Plex Mono tracking specifically).
2. Chrome: NavBar, MobileSheet, Footer.
3. Primitives: MetaRow, FigureBlock, EventCard, JoinBlock.
4. `/` Home end-to-end. Get it right before anything else — it's 80% of traffic.
5. `/events`, `/join` (the two conversion paths).
6. `/newsletter` archive + reader.
7. `/opportunities`, `/about`, `/about/team`, `/sponsor`.
8. Motion layer + `prefers-reduced-motion` pass.
9. A11y audit (axe + keyboard-only run) and Lighthouse.

---

## 11. Open questions for the chapter

- Where does the mailing-list form post? (The newsletter currently uses a Logicform endpoint — confirm it's the same list.)
- Is event data manual or from a calendar/Airtable feed? Recommend a single `events.json` the e-board can edit.
- Do we have licensed Helvetica/Georgia-class fonts, or stay on the Google stand-ins? (Current: Archivo/Lora/IBM Plex Mono.)
- Real headshots for all e-board members, or duotone placeholders for gaps?
- Confirmed reach numbers for `/sponsor`.
