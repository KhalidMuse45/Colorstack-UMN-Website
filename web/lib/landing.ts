/**
 * The landing page's data source.
 *
 * `getLanding()` returns exactly the shape `handoff/next/lib/sanity/queries.ts`
 * promises, built from `content/landing.ts`. The page component does not know
 * or care where the data came from.
 *
 * THE SWAP POINT IS HERE. When the Sanity project exists, drop in
 * `lib/sanity/client.ts` and `lib/sanity/queries.ts` from the handoff and make
 * the body of `getLanding()` below `return client.fetch(landingQuery, ...)`.
 * Nothing in `app/page.tsx` or any component changes: same field names, same
 * types, same async signature. Keep `content/landing.ts` until that swap has
 * been verified against real documents, per docs/03 step 4.
 *
 * Every value below is read from `content/landing.ts`. Nothing is invented
 * here, and nothing should be. Two strings come from the design spec rather
 * than the chapter, and both are marked at their use site.
 */
import {
  MAILING_LIST,
  community,
  contact,
  channels,
  getInTouch,
  hero,
  inTheRoom,
  mission,
  programs as programsContent,
  stats as statsContent,
  statsAside,
  testimonials as testimonialsContent,
  voices,
  whatWeDo,
  type Channel,
} from '@/content/landing';

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, tuned per photo in the design reference. */
  objectPosition?: string;
  event?: string;
  caption?: string;
};

export type Landing = {
  /**
   * Present because Sanity's landingPage document carries it and the Astro
   * content file carries it. Nothing renders it: the hero is exactly four
   * elements (wordmark, lede, one gold pill, photo) per DESIGN.md.
   */
  heroEyebrow: string;
  heroWordmark: string;
  heroLede: string;
  heroPrimaryCta: string;
  heroPhoto: Photo;

  missionHeadline: string;
  missionBody: string[];
  missionRotatorPrefix: string;
  missionRotator: string[];

  programsHeadline: string;
  programs: { title: string; body: string; pullQuote?: string; order: number; photo: Photo }[];

  stats: { value: string; label: string; confirmedOn: string }[];
  statsAside?: string;

  communityHeadline: string;
  communityBody: string[];
  communityRoll: Photo[];

  roomHeadline: string;
  marginalia?: string;
  roomGrid: Photo[];

  voicesHeadline: string;
  testimonials: { quote: string; name: string; role?: string }[];

  /** For the alternate CardDeck play component. Unused on this page. */
  deckPhotos: Photo[];

  mailingListUrl: string;

  /** Get in Touch and the footer. Straight from the content file. */
  contactEmail: string;
  channels: Channel[];
  getInTouchHeadline: string;
  getInTouchBody: string;
  getInTouchFieldLabel: string;
  getInTouchPlaceholder: string;

  /**
   * The sliding-puzzle sentence. DESIGN.md: "Placeholder sentence until the
   * e-board writes theirs". Eight words for eight tiles. Design copy, not a
   * chapter claim, so it states nothing about the chapter that could be wrong.
   */
  puzzleSentence: string;
};

/**
 * `2026-08-12` is the date `content/landing.ts` records for the chapter
 * confirming both numbers. The spec sheet renders only stats that carry one,
 * and only when there are two or more of them.
 */
const STATS_CONFIRMED_ON = '2026-08-12';

/**
 * The pull quote between programs 2 and 3. It is the chapter's own sentence,
 * lifted from the Leadership program body in `content/landing.ts`, not a
 * testimonial and not attributed to a person. Specified verbatim in DESIGN.md.
 */
const PULL_QUOTE = 'Every board seat is a student one.';

/** docs/02 whimsy allowance: one marginalia note per page, this exact line. */
const MARGINALIA = 'we meant it about the snacks.';

/** docs/02: the placeholder until the e-board writes their own sentence. */
const PUZZLE_SENTENCE = 'You have a place in this room ✳';

export async function getLanding(): Promise<Landing> {
  return {
    heroEyebrow: hero.eyebrow,
    heroWordmark: hero.wordmark,
    heroLede: hero.lede,
    // The gold pill. `hero.ctas[1]` is the second CTA the redesign removed.
    heroPrimaryCta: hero.ctas[0].label,
    heroPhoto: hero.photo,

    missionHeadline: mission.headline,
    missionBody: [...mission.body],
    missionRotatorPrefix: mission.rotatorPrefix,
    missionRotator: [...mission.rotator],

    programsHeadline: whatWeDo.headline,
    programs: programsContent.map((p, i) => ({
      title: p.title,
      body: p.body,
      pullQuote: i === 1 ? PULL_QUOTE : undefined,
      order: i,
      photo: p.photo,
    })),

    stats: statsContent.map((s) => ({ ...s, confirmedOn: STATS_CONFIRMED_ON })),
    statsAside,

    communityHeadline: community.headline,
    communityBody: [...community.body],
    communityRoll: [...community.roll],

    roomHeadline: inTheRoom.headline,
    marginalia: MARGINALIA,
    roomGrid: [...inTheRoom.grid],

    voicesHeadline: voices.headline,
    // Empty on purpose. See the comment on `testimonials` in content/landing.ts.
    // The Voices section renders nothing at all while this has fewer than two.
    testimonials: [...testimonialsContent],

    deckPhotos: [...community.roll],

    mailingListUrl: MAILING_LIST,

    contactEmail: contact.email,
    channels: [...channels],
    getInTouchHeadline: getInTouch.headline,
    getInTouchBody: getInTouch.body,
    getInTouchFieldLabel: getInTouch.fieldLabel,
    getInTouchPlaceholder: getInTouch.placeholder,

    puzzleSentence: PUZZLE_SENTENCE,
  };
}
