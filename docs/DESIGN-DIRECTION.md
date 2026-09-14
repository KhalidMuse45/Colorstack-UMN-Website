# Landing Page Design Direction

Recorded 2026-09-14, from a design-direction review of `feat/landing-polish`.
This is the frame the remaining polish decisions should be judged against.

## Direction

### Purpose

One conversion: get a UMN student onto the mailing list. Secondary: read as
credible to recruiters and sponsors who land here to vet the chapter. Every
CTA already funnels to the single `MAILING_LIST` constant in
`web/content/landing.ts`. That discipline is correct; keep it.

### Audience

First: a Black or Latinx CS student (often first-generation) deciding in about
ten seconds whether this room is for them. What they scan first is the
photography: "do these people look like me, does this look real?" Second: a
recruiter scanning the stat band and programs for legitimacy.

### Tone

**Editorial documentary.** Warm, evidence-led, magazine-like: numbered
sections (`01 / Our purpose`), maroon smallcaps eyebrows, serif ledes, big
tight-tracked display headings, generous section rhythm. UMN maroon and gold
as identity, with rose, teal and pink as accents so the palette stays
multi-dimensional. Not a startup landing page, not a template. A chapter
portrait.

### The memorable detail

**Photography as proof.** This is the page's one big idea:

- Every program claim is illustrated by a photo of that actual program.
- The candid gallery is gated by a judged `candid: true` flag, with rejection
  reasons recorded in `web/content/landing.ts` so no decision has to be
  re-made from scratch.
- Empty testimonials and partners render nothing rather than filler.

The polish rule that falls out of this: **never let a decorative element
compete with a photograph, and never let an unearned claim onto the page.**
The FloatingCards candid cloud (mixed real aspect ratios, no crops) is the
signature moment. Protect it.

### Constraints

- Handoff v3.3 is law.
- Brand hexes live only in `web/lib/tokens.ts` and `web/app/globals.css`.
- No em dashes in body copy.
- No invented stats, quotes, meeting locations or sponsors.
- Motion is the design; the only fallback is for WebGL failure.

## Open findings (as of 2026-09-14)

In priority order. Items 2 and 3 need a maintainer's call on intent; the rest
are mechanical.

1. **Token drift.** `web/lib/tokens.ts` claims to mirror `globals.css` but has
   diverged: CSS has `--surface-warm: #F7F5F1`, `--ink: #221E20`,
   `--line: #E6E1DE` while tokens.ts still carries `#FBF5EC`, `#1F1A17`,
   `#E8DCCB`. tokens.ts feeds the hero shader, so WebGL surfaces render in the
   old warm palette against the new CSS one, a subtle two-tone seam where the
   hero meets the document. Decide which palette is intended and update the
   other file to match before merge.

2. **Reduced-motion conflict.** `globals.css` carries a
   `prefers-reduced-motion` kill-switch, but the standing decision was no
   reduced-motion query at all (motion is the design, WebGL-failure fallback
   only). Either the decision was reversed during this branch or the block
   snuck back in. Make the call deliberately: a `.01ms` global override also
   flattens the scroll-reveal system.

3. **Board section ships lorem ipsum.** Roles and bios in
   `web/content/landing.ts` are marked placeholders honestly, but on a page
   whose identity is "nothing unearned," Latin bios under real names and real
   portraits is the loudest possible violation of its own rule. If real roles
   cannot be confirmed before merge, render name and portrait only, on the
   same empty-renders-nothing contract testimonials and partners follow.

4. **Dead content.** `whatWeDo.hint` ("Hover any photo to read more") and the
   `mission.rotator` array are defined in content but no longer rendered by
   `page.tsx`; the mission signoff is now static. If the TextLoop rotator was
   intentionally retired, remove the dead content and its FIX-2 comment so the
   file stays the single source of truth it claims to be.

Everything else checks out against the review checklist: the first viewport
carries the subject (real hero photo, one CTA), hierarchy supports scanning,
the palette is multi-hued, assets carry the subject matter rather than acting
as filler, and empty-content contracts prevent hollow sections.
