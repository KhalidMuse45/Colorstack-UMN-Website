/**
 * About-page content (`/about`), patterned on `src/data/landing.ts`.
 *
 * Single source of truth for every string on the About page: the e-board edits
 * copy here and never touches layout in `src/pages/about.astro`.
 *
 * TICKET.md is explicit that this page must not invent a single fact, so every
 * claim below traces to a file in this repository or to the ticket itself:
 *
 *   - `about.lede`, `about.ctas`  ->  `src/data/landing.ts` (§1 hero)
 *   - `about.photo`               ->  `src/data/landing.ts` (§0 photos)
 *   - `story.*`                   ->  `src/data/landing.ts` (§3 mission, §5
 *                                     who we show up for), verbatim imports so
 *                                     the approved copy cannot drift
 *   - `affiliation.*`             ->  TICKET.md (national non-profit),
 *                                     README.md (what ColorStack is),
 *                                     `src/data/nav.ts` (UMN Twin Cities)
 *   - `what.*`                    ->  `src/data/landing.ts` (§4 what we do)
 *
 * House rules that bind anything here (design/LANDING-PAGE.md:19): no em
 * dashes in rendered copy, commas or full stops instead; "ColorStack" is
 * always capital C, capital S.
 */

import { type Cta, community, hero, mission, photos, programs, whatWeDo } from './landing';
import { chapter } from './nav';

export const about = {
  eyebrow: 'About ColorStack UMN',
  title: chapter.name,
  /** The italic lede. Same line as the home hero; it sets the page's tone. */
  lede: hero.lede,
  ctas: hero.ctas as Cta[],
  /** Full-bleed photo. Same shot and crop as the home hero group photo. */
  photo: photos.summitGroup,
};

export const story = {
  label: 'Our story',
  /** The mission headline; it is the chapter's thesis sentence. */
  headline: mission.headline,
  /** The chapter story: the mission, then who we show up for, in order. */
  paragraphs: [...mission.body, ...community.body],
  /** Rotator close on a hairline, same copy as the home Mission section. */
  rotatorPrefix: mission.rotatorPrefix,
  rotator: mission.rotator,
};

/**
 * Wording tracks `README.md:3` almost verbatim, deliberately. An earlier draft
 * called ColorStack "a national non-profit", which is true but is not what any
 * file in this repository says. On a page describing someone else's
 * organisation, the repo's own sentence is the safer authority than a fact
 * recalled from outside it.
 */
export const affiliation = {
  label: 'Part of ColorStack national',
  headline: 'A chapter of a national community.',
  paragraphs: [
    'ColorStack is a community dedicated to increasing the number of Black, Latinx, and Indigenous technologists who graduate and launch rewarding technical careers. ColorStack UMN is the University of Minnesota chapter.',
  ],
};

export const what = {
  label: whatWeDo.label,
  headline: whatWeDo.headline,
  programs,
};