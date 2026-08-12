/**
 * Landing-page content. Single source of truth for every string, photo and
 * link on `/`.
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
  /** Path under /public. WebP placeholders until the chapter supplies real photos. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position. Tuned per photo in the reference; do not "tidy" these. */
  objectPosition?: string;
  /** True while this slot still holds a generated placeholder. */
  placeholder?: boolean;
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
 * The mailing-list endpoint. `HANDOFF-LOG.md` carried this as an open question
 * ("Mailing-list endpoint unknown, same list as the newsletter?"). The landing
 * reference answers it: the hero CTA, the nav CTA, the form and the closer all
 * post to this same Logicform. Resolved, single constant so it cannot drift.
 */
export const MAILING_LIST = 'https://logicform.io/v/6a4aacba51ee6e65572aaa48';

const CHAPTER_EMAIL = 'colorstk@umn.edu';

/* ── Photos ────────────────────────────────────────────────────────────── */

/**
 * Every one of these is a generated placeholder. `design/LANDING-PAGE.md:25`
 * claims the real photos are already in the repo; they are not. See
 * `HANDOFF-LOG.md`. Swap the file, keep the alt text and objectPosition.
 */
export const photos = {
  summitGroup: {
    src: '/images/summit-group.webp',
    alt: 'ColorStack UMN members gathered around a table at a national student conference, name badges on, smiling for a group photo',
    width: 1920,
    height: 1080,
    objectPosition: 'center 46%',
    placeholder: true,
  },
  summitPortrait: {
    src: '/images/summit-portrait.webp',
    alt: 'ColorStack UMN delegation in business attire at a national conference',
    width: 1400,
    height: 1750,
    objectPosition: 'center 76%',
    placeholder: true,
  },
  summitSignage: {
    src: '/images/summit-signage.webp',
    alt: 'Welcome screen at the national conference venue',
    width: 1600,
    height: 1200,
    placeholder: true,
  },
  ideathon: {
    src: '/images/ideathon.webp',
    alt: 'ColorStack UMN members working through the Ideathon on laptops',
    width: 1600,
    height: 1200,
    placeholder: true,
  },
  gameNightChess: {
    src: '/images/game-night-chess.webp',
    alt: 'Members playing chess and Connect Four at ColorStack UMN game night',
    width: 1600,
    height: 1200,
    placeholder: true,
  },
  gameNightSignage: {
    src: '/images/game-night-signage.webp',
    alt: 'Two ColorStack UMN members holding a hand-drawn whiteboard they made for game night',
    width: 1600,
    height: 1200,
    placeholder: true,
  },
} as const satisfies Record<string, Photo>;

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
  photo: photos.summitGroup as Photo,
};

/* ── 2. Stat band ──────────────────────────────────────────────────────── */

/**
 * Confirmed real by the chapter on 2026-08-12.
 *
 * Flagged in `HANDOFF-LOG.md` and repeated here because this band is the most
 * sponsor-facing claim on the page: the retired site advertised "50+ Active
 * Members" and "25+ Offers Secured". Members doubling is plausible; offers
 * falling from 25+ to 10+ is not obviously so. Worth one more look before
 * launch. Do not edit these without a chapter source.
 */
export const stats: Stat[] = [
  { value: '100+', label: 'Members in the chapter' },
  { value: '10+', label: 'Internship and full-time offers' },
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
  /** Cycled by TextLoop. Ends on "you." deliberately; keep it last. */
  rotatorPrefix: 'Building a space for',
  rotator: [
    'Black students.',
    'Latinx students.',
    'marginalized students.',
    'low-income students.',
    'first-generation students.',
    'you.',
  ],
};

/* ── 4. What we do ─────────────────────────────────────────────────────── */

export const whatWeDo = {
  label: 'What we do',
  headline: 'Four things we run all year.',
  hint: 'Hover any photo to read more.',
};

export const programs: Program[] = [
  {
    title: 'Workshops',
    body: 'Git, interview data structures, résumé teardowns, mock technical screens, and project nights where you actually ship something.',
    photo: photos.ideathon,
  },
  {
    title: 'Leadership',
    body: 'Every board seat is a student one. Members run events, manage budgets, pitch sponsors, and lead committees.',
    photo: photos.gameNightSignage,
  },
  {
    title: 'Professional Development',
    body: 'Alumni and recruiter connections, conference delegations, and a referral network that has put members in front of hiring teams.',
    photo: photos.summitPortrait,
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
  /** Stacked photo roll, cycled by TextLoop in `stack` mode. */
  roll: [
    photos.summitGroup,
    photos.summitPortrait,
    photos.summitSignage,
    photos.ideathon,
  ] as Photo[],
};

/* ── 6. In the room ────────────────────────────────────────────────────── */

export const inTheRoom = {
  label: 'In the room',
  headline: 'This is what a Tuesday looks like.',
  grid: [
    photos.gameNightChess,
    photos.gameNightSignage,
    photos.summitPortrait,
    photos.summitSignage,
  ] as Photo[],
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

/* ── 10. Split closer ──────────────────────────────────────────────────── */

export const closer = [
  {
    step: 'Step one',
    title: 'Join the list',
    href: MAILING_LIST,
    tone: 'gold' as const,
  },
  {
    step: 'Step two',
    title: 'Come to a meeting',
    href: 'https://www.instagram.com/colorstackumn/',
    tone: 'ink' as const,
  },
];
