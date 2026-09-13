/**
 * Landing-page content. Single source of truth for every string, photo and
 * link on `/`.
 *
 * Ported verbatim from the Astro site's `src/data/landing.ts` on 2026-09-06.
 * Nothing was added, removed or reworded in the move: the provenance comments
 * below are the record of which facts are confirmed and which slots are empty
 * on purpose, and they are the reason this file is worth carrying across
 * rather than retyping. `lib/landing.ts` shapes it for the page.
 *
 * This extends the pattern already established by `src/data/nav.ts`: typed
 * data modules that components read, so the e-board can edit copy without
 * touching layout. Owned by the orchestrator as integration glue.
 *
 * Copy, section order and photo crops come from
 * `design/reference/LandingPage.dc.html`. The `objectPosition` values there
 * were tuned per photo and `design/LANDING-PAGE.md:25` says to preserve them,
 * so they are carried across verbatim.
 *
 * House rules that bind anything added here:
 *   - No em dashes in body copy (`design/LANDING-PAGE.md:19`). Commas or full
 *     stops instead.
 *   - "ColorStack" is always capital C, capital S.
 *   - No invented stats, quotes, sponsor logos or meeting locations.
 */

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface Cta {
  href: string;
  label: string;
  external?: boolean;
}

export interface Photo {
  /**
   * Stable identity for a photo that appears in a list rather than a fixed
   * slot. Used as the React key and as the lightbox target in FloatingCards,
   * where `src` alone would break the moment the same file was shown twice.
   * Slot photos below do not need one.
   */
  id?: string;
  /** Path under /public. WebP placeholders until the chapter supplies real photos. */
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** CSS object-position. Tuned per photo in the reference; do not "tidy" these. */
  objectPosition?: string;
  /** True while this slot still holds a generated placeholder. */
  placeholder?: boolean;
  /**
   * An unposed moment: someone mid-laugh, a whiteboard mid-problem, two members
   * over one laptop. Absent or false means posed, and posed is the default, so
   * a photograph has to be judged into the gallery rather than out of it.
   *
   * The "In the Room" gallery reads exactly the photographs that carry this,
   * and nothing else. It is the field Sanity's `chapterPhoto` document will
   * carry under the same name when that swap happens; `lib/landing.ts` is where
   * the filter lives, so the query can replace it without touching the gallery.
   *
   * Judged one by one against the per-frame descriptions in
   * `assets-src/photo-triage.md`. A group photograph, a posed portrait or a
   * staged gag does not qualify however good it is: those photographs stay in
   * the array below with no flag, so the reasoning survives in one place rather
   * than being reconstructed from an absence.
   */
  candid?: boolean;
}

export interface Program {
  title: string;
  body: string;
  photo: Photo;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Channel {
  label: string;
  value: string;
  marker: string;
  href: string;
}

/* ── Shared ────────────────────────────────────────────────────────────── */

/**
 * The mailing-list endpoint. `docs/CONTENT-NEEDED.md` carried this as an open question
 * ("Mailing-list endpoint unknown, same list as the newsletter?"). The landing
 * reference answers it: the hero CTA, the nav CTA, the form and the closer all
 * post to this same Logicform. Resolved, single constant so it cannot drift.
 */
export const MAILING_LIST = 'https://logicform.io/v/6a4aacba51ee6e65572aaa48';

const CHAPTER_EMAIL = 'colorstk@umn.edu';

/* ── Photos ────────────────────────────────────────────────────────────── */

/**
 * All six are real chapter photos, supplied by the chapter on 2026-08-12 and
 * converted to WebP. No placeholders remain on the landing page. Masters live
 * in `assets-src/photos/` so a shot can be re-cropped without going back to a
 * phone; see `assets-src/README.md` for the conversion command.
 *
 * Alt text describes what is actually in each frame, not what the reference
 * assumed. These are identifiable chapter members in chapter spaces, supplied
 * by the chapter for this purpose.
 *
 * To swap one: replace the master, re-run the conversion, update width and
 * height here to the real output dimensions, and keep the alt text truthful.
 * A `placeholder: true` flag is still supported by the Photo type for any
 * future slot that needs one.
 */
export const photos = {
  staircaseGroup: {
    src: '/images/candids/staircase-group.webp',
    alt: 'ColorStack UMN members seated together on a marble staircase',
    width: 1600,
    height: 2400,
    objectPosition: 'center',
    caption: 'ColorStack UMN, together at Walter.',
  },
  summitGroup: {
    src: '/images/summit-group.webp',
    alt: 'ColorStack UMN members gathered around a table at a national student conference, name badges on, smiling for a group photo',
    width: 2400,
    height: 1800,
    objectPosition: 'center 46%',
  },
  summitPortrait: {
    src: '/images/summit-portrait.webp',
    alt: 'The ColorStack UMN delegation posed together at a national conference, name badges on',
    width: 1400,
    height: 1750,
  },
  summitSignage: {
    src: '/images/summit-signage.webp',
    alt: 'Stacked Up Summit 2026 welcome screen at the conference venue',
    width: 2000,
    height: 1500,
  },
  ideathon: {
    src: '/images/ideathon.webp',
    alt: 'ColorStack UMN members working through the Ideathon on laptops, event screens behind them',
    width: 2400,
    height: 1600,
  },
  gameNightChess: {
    src: '/images/game-night-chess.webp',
    alt: 'ColorStack UMN members playing chess and Connect Four around a table at game night',
    width: 1440,
    height: 956,
  },
  gameNightSignage: {
    src: '/images/game-night-signage.webp',
    alt: 'Two ColorStack UMN members beside the hand-drawn whiteboard they made for game night, reading "Destress with ColorStack, game night, Jeopardy and board games"',
    width: 1440,
    height: 956,
  },

  /*
   * ── Second batch, supplied 2026-09-05 ────────────────────────────────
   *
   * The e-board supplied three new sets on 2026-09-05: a ColorStack Bootcamp
   * night, two Ideathon frames, and a board photoshoot at Northrop Auditorium,
   * plus a folder of Stacked Up Summit photographs credited in their filenames
   * to Chloe Jackman Photography. That last set is third-party professional
   * work rather than a member's camera roll, so it was held until the chapter
   * confirmed on 2026-09-06 that the files had been legally downloaded and
   * could be used on the site. Every summit file below carries the
   * photographer credit in SOURCES.json.
   *
   * Descriptions, quality notes and the alt text below come from
   * `assets-src/photo-triage.md`, which reviewed all sixty masters. Alt text is
   * carried across from that file, adjusted only where the final crop shows
   * something slightly different from the uncropped master, and each such
   * adjustment is noted on the entry.
   *
   * Widths and heights are the real output dimensions of the converted WebP,
   * measured from the files, not the master's dimensions.
   */

  /** Workshops. The whiteboard is legible at full width, which is the point. */
  bootcampJeopardy: {
    src: '/images/bootcamp-jeopardy.webp',
    alt: 'Three ColorStack UMN members standing beside a whiteboard reading "ColorStack Bootcamp, let\'s play Jeopardy" with résumé and interview categories',
    width: 2400,
    height: 1500,
  },
  /** Leadership. Students running the room, which is what the copy claims. */
  ideathonPresenting: {
    src: '/images/ideathon-presenting.webp',
    alt: 'Three students presenting a project slide at a table during the Ideathon, one speaking into a microphone',
    width: 2400,
    height: 1500,
  },
  /** Professional Development. A recruiter conversation, on the nose. */
  summitRecruiter: {
    src: '/images/summit-recruiter.webp',
    alt: 'A recruiter talking with a student at a Rubrik recruiting booth at the Stacked Up Summit',
    width: 2400,
    height: 1500,
  },

  /* Portrait roll on the rose band. Portrait crops, 1400x1750. */
  redScarfPortrait: {
    src: '/images/red-scarf-portrait.webp',
    alt: 'A student smiling in a red scarf, standing in a colonnaded campus hallway',
    width: 1400,
    height: 1750,
  },
  /**
   * The triage sheet reads "posing with raised fists" for both people. In the
   * final crop only the person on the right has both fists up; the other is
   * pointing at himself. Alt text follows the crop.
   */
  staircaseFists: {
    src: '/images/staircase-fists.webp',
    alt: 'Two students posing on a grand staircase facing the camera, one with both fists raised',
    width: 1400,
    height: 1750,
  },
  /**
   * The triage sheet transcribed the sign as "Presidents Circle 2 East". The
   * crop reads "Presidents Circle East 2", so the alt text does too.
   */
  presidentsCircle: {
    src: '/images/presidents-circle.webp',
    alt: 'Two students posed under a wall sign reading "Presidents Circle East 2", one pointing up at it',
    width: 1400,
    height: 1750,
  },
} as const satisfies Record<string, Photo>;

/* ── Candids ───────────────────────────────────────────────────────────── */

/**
 * The candidate pool for the "In the Room" gallery. Fifteen photographs, of
 * which the twelve carrying `candid: true` are the ones that float.
 *
 * THE FLAG IS THE GATE. `lib/landing.ts` hands the gallery only the flagged
 * entries, so adding a photograph here does not put it on the page: judging it
 * unposed does. Three are deliberately unflagged and stay in the list with the
 * reason on the entry, because a photograph rejected silently is a decision
 * somebody has to make again from scratch next time.
 *
 * Textures, not slot photos: each is converted at 1200px on its longest side
 * with NO crop, because mixed aspect ratios are most of what makes the cloud
 * read as real material rather than tiles (handoff/docs/07). Card size in the
 * scene comes from the aspect below, so these width and height values are load
 * bearing and must be the real output dimensions.
 *
 * The order is deliberate. Neighbours differ in aspect, so no two landscapes
 * and no long run of portraits sit next to each other in the 4x4 grid, and the
 * first eight flagged entries still mix when mobile takes only eight.
 *
 * Provenance: fourteen of the fifteen were supplied by the e-board on
 * 2026-09-05, the summit set among them confirmed clear for use on 2026-09-06
 * and credited to Chloe Jackman Photography in SOURCES.json. The fifteenth,
 * game night, is from the 2026-08-12 batch and is the only genuinely
 * unstaged chapter-event photograph in the set.
 *
 * One honest caveat, recorded in `assets-src/photo-triage.md` open question 3
 * and repeated here so it is not lost: the Northrop photographs are a styled
 * board photoshoot, not Tuesday-meeting snapshots. The headline over them says
 * "This is what a Tuesday looks like." The e-board should either bless that or
 * supply real meeting-night photographs to swap in. Nothing else changes when
 * they do: replace the file, update the dimensions, keep the alt truthful.
 */
export const candids: Photo[] = [
  /** User-selected board portrait; intentionally not marked as a candid. */
  {
    ...photos.staircaseGroup,
    id: 'staircase-group',
  },
  /** Work in progress, nobody looking at the lens. The clearest candid here. */
  {
    id: 'ideathon-room',
    src: '/images/candids/ideathon-room.webp',
    alt: 'Students at round tables with laptops during the Ideathon, a countdown timer on the screen at the front of the room',
    width: 1200,
    height: 800,
    candid: true,
  },
  /**
   * Four people mid-conversation, not four people arranged. The triage sheet
   * reads "genuine unposed group energy", and they are turned toward each other
   * rather than out at the camera, which is the line between this and
   * `staircase-group` above.
   */
  {
    id: 'elevator-lobby',
    src: '/images/candids/elevator-lobby.webp',
    alt: 'Four people talking and smiling together in a marble elevator lobby',
    width: 900,
    height: 1200,
    candid: true,
  },
  /** Hands on a keyboard, code on the monitor. Exactly the brief's example. */
  {
    id: 'lab-typing',
    src: '/images/candids/lab-typing.webp',
    alt: 'A person typing at a computer lab keyboard with code visible on the monitor',
    width: 800,
    height: 1200,
    candid: true,
  },
  /** Triage: "candid conference-lounge moment", one hand caught mid-gesture. */
  {
    id: 'summit-couches',
    src: '/images/candids/summit-couches.webp',
    alt: 'Five people talking in a conference lounge seating area, one gesturing with a raised hand',
    width: 1200,
    height: 800,
    candid: true,
  },
  /** Three people talking, one on his phone. Nothing arranged about it. */
  {
    id: 'window-trio',
    src: '/images/candids/window-trio.webp',
    alt: 'Three people talking together in a room with a large window, one checking his phone',
    width: 900,
    height: 1200,
    candid: true,
  },
  /**
   * NOT A CANDID. The triage sheet's own words are "solo portrait in the grand
   * corridor": one subject, placed, facing the lens. A posed portrait is ruled
   * out by name however good the light is.
   */
  {
    id: 'corridor-portrait',
    src: '/images/candids/corridor-portrait.webp',
    alt: 'A person standing alone in a grand marble corridor beneath a coffered ceiling',
    width: 1200,
    height: 1200,
  },
  /** Two people sitting, one on his phone. A gap between frames, not a pose. */
  {
    id: 'staircase-landing',
    src: '/images/candids/staircase-landing.webp',
    alt: 'Two people sitting on a grand staircase landing, one checking his phone',
    width: 900,
    height: 1200,
    candid: true,
  },
  /** A conversation at a booth, photographed from outside it. */
  {
    id: 'summit-duolingo',
    src: '/images/candids/summit-duolingo.webp',
    alt: 'Three people talking near a Duolingo booth at the Stacked Up Summit, colorful cube seating around them',
    width: 1200,
    height: 800,
    candid: true,
  },
  /**
   * NOT A CANDID. A staged gag: the triage sheet describes a "playful boxing
   * pose", and a pose held for the camera is a pose whether it is formal or
   * funny. It reads as a candid at a glance, which is the reason to be explicit
   * about why it is out rather than leaving the next reader to wonder.
   */
  {
    id: 'playful-boxing',
    src: '/images/candids/playful-boxing.webp',
    alt: 'Two people facing off in a playful boxing pose on a stairway landing',
    width: 900,
    height: 1200,
  },
  /**
   * The only photograph in the pool taken at an ordinary chapter night rather
   * than at a shoot or a conference, which makes it the one that most nearly
   * earns the "this is what a Tuesday looks like" headline. Re-encoded to
   * 1200px for the gallery; the full-size file stays where the Community
   * program card reads it.
   */
  {
    id: 'game-night-chess',
    src: '/images/candids/game-night-chess.webp',
    alt: 'ColorStack UMN members playing chess and Connect Four around a table at game night',
    width: 1200,
    height: 797,
    candid: true,
  },
  /** Back to the camera. Whatever else it is, it is not posed for anyone. */
  {
    id: 'lab-workstation',
    src: '/images/candids/lab-workstation.webp',
    alt: 'A person at a computer lab workstation, seen from behind, with blank monitors in front of them',
    width: 800,
    height: 1200,
    candid: true,
  },
  /** Two people talking to each other, not to the lens. */
  {
    id: 'stairway-talk',
    src: '/images/candids/stairway-talk.webp',
    alt: 'Two people talking on a stairway landing beside a tall window',
    width: 900,
    height: 1200,
    candid: true,
  },
  /** Triage: "sharp, well lit, candid". A meal, mid-sentence. */
  {
    id: 'summit-dining',
    src: '/images/candids/summit-dining.webp',
    alt: 'Three students at a dining table wearing Stacked Up Summit lanyards, talking over food',
    width: 1600,
    height: 1067,
    candid: true,
  },
  /**
   * One person, but not a portrait: he is looking at his phone rather than at
   * the camera, and the frame is a moment taken rather than a subject arranged.
   * That is the distinction that keeps it in and `corridor-portrait` out.
   */
  {
    id: 'red-chair',
    src: '/images/candids/red-chair.webp',
    alt: 'A person sitting in a red lounge chair, checking his phone',
    width: 800,
    height: 1200,
    candid: true,
  },
];

/* ── 1. Hero ───────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: 'University of Minnesota · Twin Cities',
  /** Rolled character by character by TextRoll. Keep it short. */
  wordmark: 'ColorStack UMN',
  lede: 'A home for Black and Latinx computer science students at the U, where you find your people, sharpen your craft, and land the offer.',
  ctas: [
    { href: MAILING_LIST, label: 'Join the List', external: true },
    { href: '#what-we-do', label: 'See What We Do' },
  ] as Cta[],
  photo: photos.staircaseGroup as Photo,
};

/* ── 2. Stat band ──────────────────────────────────────────────────────── */

/**
 * Confirmed real by the chapter on 2026-08-12.
 *
 * Flagged in `docs/CONTENT-NEEDED.md` and repeated here because this band is the most
 * sponsor-facing claim on the page: the retired site advertised "50+ Active
 * Members" and "25+ Offers Secured". Members doubling is plausible; offers
 * falling from 25+ to 10+ is not obviously so. Worth one more look before
 * launch. Do not edit these without a chapter source.
 */
export const stats: Stat[] = [
  { value: '180+', label: 'Members in the chapter' },
  { value: '50+', label: 'Internship and full-time offers' },
];

export const statsAside =
  'Numbers matter, but the room matters more. Every offer on this list started with someone showing up to a Tuesday meeting and staying for the people.';

/* ── 3. Mission ────────────────────────────────────────────────────────── */

export const mission = {
  label: 'Our mission',
  headline: "We're building the room we wanted as freshmen.",
  body: [
    'ColorStack UMN exists to increase the number of Black and Latinx students who graduate from the University of Minnesota with a computer science degree, and a career to walk into.',
    'We do that three ways. We teach the technical skills the classroom skips, we open doors to recruiters and alumni who look like us, and we keep a community close enough that no one has to figure out sophomore year alone.',
  ],
  /**
   * Cycled once by TextLoop and held. Ends on "you." deliberately; keep it
   * last. FIX-2 §5 fixes the sequence at these four phrases, down from six.
   */
  rotatorPrefix: 'Building a space for',
  rotator: ['Black students.', 'Latinx students.', 'first-generation students.', 'you.'],
};

/* ── 4. What we do ─────────────────────────────────────────────────────── */

export const whatWeDo = {
  label: 'What we do',
  headline: 'Four things we run all year.',
  hint: 'Hover any photo to read more.',
};

/**
 * Photos re-slotted on 2026-09-06 from the 2026-09-05 batch. Body copy is
 * untouched: only the evidence under each claim changed, so that each program
 * is now illustrated by a photograph of that program rather than by whichever
 * of the original six was closest to hand.
 *
 *   Workshops                 game night signage -> a Bootcamp résumé night
 *   Leadership                game night signage -> students presenting at the Ideathon
 *   Professional Development  a posed delegation -> a recruiter conversation
 *   Community                 unchanged, game night is still the only one
 */
export const programs: Program[] = [
  {
    title: 'Workshops',
    body: 'Git, interview data structures, résumé teardowns, mock technical screens, and project nights where you actually ship something.',
    photo: photos.bootcampJeopardy,
  },
  {
    title: 'Leadership',
    body: 'Every board seat is a student one. Members run events, manage budgets, pitch sponsors, and lead committees.',
    photo: photos.ideathonPresenting,
  },
  {
    title: 'Professional Development',
    body: 'Alumni and recruiter connections, conference delegations, and a referral network that has put members in front of hiring teams.',
    photo: photos.summitRecruiter,
  },
  {
    title: 'Community',
    body: 'Game nights, potlucks, study halls before finals, and outreach with Twin Cities students who need to see someone who looks like them writing code.',
    photo: photos.gameNightChess,
  },
];

/* ── 5. Who we show up for ─────────────────────────────────────────────── */

export const community = {
  label: 'Who we show up for',
  headline: "If you're the first in your family to do this, you're in the right place.",
  body: [
    'A lot of us are first-generation students. Nobody at home could explain what a résumé screen was, why you need a GitHub, or how internship recruiting starts a year early. We turn that hidden curriculum into something you can just ask about.',
    'We also send a delegation to the national conference every year, and we chase the funding so cost never decides who gets to go.',
  ],
  /**
   * Stacked photo roll, cycled by TextLoop in `stack` mode.
   *
   * Portraits since 2026-09-06. The section is one duotone portrait cycling on
   * rose, so the roll now holds portrait-shaped frames rather than the mix of
   * landscapes it inherited. The incumbent `summitPortrait` stays in the
   * rotation on purpose: three of the four are from the same Northrop
   * photoshoot, and without it the whole cycle would be one hallway.
   */
  roll: [
    photos.redScarfPortrait,
    photos.staircaseFists,
    photos.summitPortrait,
    photos.presidentsCircle,
  ] as Photo[],
};

/* ── 6. In the room ────────────────────────────────────────────────────── */

/**
 * The `grid` of four photos this object used to carry is gone as of
 * 2026-09-06. It fed the 2x2 hover-duotone grid, which is retired: the section
 * is now the rotating FloatingCards gallery and it reads `candids` above.
 * Nothing consumed `grid` afterwards, so it went rather than sitting here as a
 * second, quietly diverging list of the same kind of thing.
 */
export const inTheRoom = {
  label: 'In the room',
  headline: 'A few moments, together.',
};

/* ── 7. Voices ─────────────────────────────────────────────────────────── */

export const voices = {
  label: 'Voices',
  headline: 'In their words.',
};

/**
 * INTENTIONALLY EMPTY.
 *
 * `design/LANDING-PAGE.md:133`: the three cards in the reference read
 * "Placeholder quote / Replace" and "must not ship. Chapter owes real quotes
 * with names and roles." `CLAUDE.md` bans invented testimonials outright.
 *
 * The page MUST treat an empty array as "render no Voices section at all"
 * rather than rendering an empty band. When the chapter supplies real quotes,
 * add them here with a real name and role and the section appears. Nothing
 * else needs to change.
 */
export const testimonials: Testimonial[] = [];

/* ── 8. Get in touch ───────────────────────────────────────────────────── */

export const getInTouch = {
  headline: 'Come find your people.',
  body: 'Event invites, internship deadlines, and Chapter Notes, our monthly newsletter. Any major, any year, any background. Everyone is welcome at the table.',
  formAction: MAILING_LIST,
  fieldLabel: 'Your UMN email',
  placeholder: 'you@umn.edu',
  submit: 'Sign me up',
  altLabel: 'Or just email us',
  altHref: `mailto:${CHAPTER_EMAIL}`,
};

/* ── 9. Contact ────────────────────────────────────────────────────────── */

export const contact = {
  label: 'Contact us',
  headline: 'Recruiters, sponsors, and curious students, same inbox.',
  body: 'Want to speak at a meeting, sponsor an event, or just find out when we meet? Write to us and a board member will get back to you.',
  email: CHAPTER_EMAIL,
};

/**
 * No meeting location and no meeting time. `design/LANDING-PAGE.md:134`:
 * "Meeting location unconfirmed. Do not invent one." The contact copy above
 * routes that question to the inbox on purpose.
 */
export const channels: Channel[] = [
  {
    label: 'Email',
    value: CHAPTER_EMAIL,
    marker: 'Fastest',
    href: `mailto:${CHAPTER_EMAIL}`,
  },
  {
    label: 'Instagram',
    value: '@colorstackumn',
    marker: '↗',
    href: 'https://www.instagram.com/colorstackumn/',
  },
  {
    label: 'LinkedIn',
    value: 'ColorStack UMN',
    marker: '↗',
    href: 'https://www.linkedin.com/company/colorstackumn/',
  },
  {
    label: 'Mailing list',
    value: 'Chapter Notes',
    marker: 'Monthly ↗',
    href: MAILING_LIST,
  },
];

/* ── 9b. Partners ──────────────────────────────────────────────────────── */

/**
 * Companies and organisations that support the chapter.
 *
 * **Empty on purpose, and it must stay empty until someone supplies real
 * names.** No sponsor or partner exists anywhere in this repository: not in
 * `src/data`, not in `public/images`, not in the design drop. Inventing one,
 * or padding this with logos of companies members happen to have interned at,
 * would be a claim of endorsement the chapter never made, on the page most
 * likely to be read by the companies in question.
 *
 * `Partners.astro` returns null while this is empty, so the site shows nothing
 * rather than a heading over a blank strip. Same contract as `testimonials`.
 *
 * To turn the section on: add entries here, drop the logo files into
 * `public/images/partners/`, and it appears. Nothing else needs to change.
 * Logos should be the partner's own supplied asset, and permission to display
 * a mark is worth having in writing before it ships.
 */
export interface Partner {
  /** Organisation name, spelled as they spell it */
  name: string;
  /** Path under public/, e.g. /images/partners/acme.webp */
  logo: string;
  /** Optional link to the partner */
  href?: string;
}

export const partners: Partner[] = [];

/** Heading and copy for the partner band. Shown only when `partners` is not empty. */
export const partnerBand = {
  label: 'Partners',
  headline: 'The people backing this work.',
  /** The partnership ask. Points at the same inbox as everything else. */
  cta: 'Partner with us',
  ctaHref: `mailto:${CHAPTER_EMAIL}`,
};

/* ── 10. Split closer ──────────────────────────────────────────────────── */

export const closer = [
  {
    step: 'Step one',
    title: 'Join the list',
    href: MAILING_LIST,
    tone: 'gold' as const,
  },
  {
    /**
     * "Come to a meeting" until 2026-08-13, pointing at Instagram.
     *
     * It invited people to something the site cannot tell them how to attend:
     * the meeting time and location are unconfirmed and
     * `design/LANDING-PAGE.md:134` forbids inventing them, so the panel named
     * a weekly commitment and then handed the reader off to a feed to work the
     * details out themselves.
     *
     * "Come to an event" makes the same invitation without implying a standing
     * slot, and the link now goes to the list, which is where someone who
     * wants in should actually go. Same `MAILING_LIST` constant as step one,
     * the hero CTA, the nav CTA and the form, so the endpoint cannot drift.
     */
    step: 'Step two',
    title: 'Come to an event',
    href: MAILING_LIST,
    tone: 'ink' as const,
  },
];
