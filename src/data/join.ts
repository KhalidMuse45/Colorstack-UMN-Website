/**
 * `/join` page content. Single source of truth for every string on the join
 * page, the same way `src/data/landing.ts` is the source for `/`.
 *
 * Values that already exist on the home page are imported from
 * `../data/landing` rather than restated, so the field label, the submit
 * label, the chapter email and the mailing-list endpoint cannot drift
 * between the pages that share them.
 *
 * House rules that bind anything added here, mirrored from
 * `src/data/landing.ts`:
 *   - No em dashes in body copy (`design/LANDING-PAGE.md:19`). Commas, full
 *     stops or colons instead.
 *   - "ColorStack" is always capital C, capital S.
 *   - No invented facts. Slack and GroupMe have no link anywhere in this
 *     repository (UX-SPEC 5.6 asks for them; TICKET.md says to leave the slot
 *     out entirely), so neither appears here. Meeting time and location are
 *     deliberately unclaimed (`design/LANDING-PAGE.md:134`), and the question
 *     is routed to the inbox the way the landing page's contact copy does.
 */
import { MAILING_LIST, getInTouch, channels } from './landing';

/** `<title>` and `<meta name="description">` for the /join page. */
export const joinPage = {
  title: 'Join ColorStack UMN',
  description:
    'The ColorStack UMN mailing list: event invites, internship deadlines, and Chapter Notes, our monthly newsletter. Any major, any year, any background.',
};

/**
 * Above-the-fold conversion band: the form and nothing competing with it.
 *
 * The form copies the working `GetInTouch.astro` form exactly: a plain GET to
 * the Logicform endpoint, a real wrapping `<label>`, and a submit that keeps
 * the gold focus ring. Every field string is the landing form's own, imported
 * so the two forms can never disagree.
 */
export const joinHero = {
  label: 'Join the chapter',
  headline: 'Come find your people.',
  intro: 'Event invites, internship deadlines, and Chapter Notes, our monthly newsletter. Any major, any year, any background. Everyone is welcome at the table.',
  formAction: MAILING_LIST,
  fieldLabel: getInTouch.fieldLabel,
  placeholder: getInTouch.placeholder,
  submit: getInTouch.submit,
  altLabel: getInTouch.altLabel,
  altHref: getInTouch.altHref,
};

/**
 * "What you'll get". Three numbered lines, all drawn from the landing page's
 * approved copy in `src/data/landing.ts`. Phrasing compacted, nothing new
 * promised:
 *   1. title from mission.body[1] "the technical skills the classroom skips";
 *      body is programs[0].body verbatim.
 *   2. title from mission.body[1] "we open doors to recruiters and alumni";
 *      body is programs[2].body minus its opening clause.
 *   3. title from the home description "a community that shows up"; body is
 *      programs[3].body's opening plus hero.lede's "where you find your
 *      people".
 */
export const whatYoullGet = {
  label: "What you'll get",
  headline: 'Three things the chapter runs all year.',
  items: [
    {
      title: 'Skills the classroom skips',
      body: 'Git, interview data structures, résumé teardowns, mock technical screens, and project nights where you actually ship something.',
    },
    {
      title: 'Doors to alumni and recruiters',
      body: 'Conference delegations and a referral network that has put members in front of hiring teams.',
    },
    {
      title: 'A community that shows up',
      body: 'Game nights, potlucks, study halls before finals, and a room where you find your people.',
    },
  ],
};

/**
 * First-timer FAQ. Substance per UX-SPEC 5.6: "events are open to everyone,
 * the community centers Black & Latinx students". No overclaim, no softening.
 */
export const faq = {
  label: 'Good questions',
  question: 'Do I have to be Black or Latinx to come?',
  answer:
    'Not at all. Events are open to everyone. Any major, any year, any background is welcome at the table. The community centers Black and Latinx students. That is who the chapter is for, and many of us are the first in our family to do this. Nobody has to figure out sophomore year alone.',
};

/**
 * Community channels. The chapter email and the two social links that exist
 * in this repository: `channels` from `src/data/landing.ts`. The note routes
 * the meeting time/location question to the inbox, mirroring the landing
 * page's contact copy (`src/data/landing.ts:289`).
 */
export const connectSection = {
  label: 'The community',
  headline: 'Follow along, or write to us.',
  meetNote:
    'Want to know when and where we meet? Write to us and a board member will get back to you.',
};

export const communityLinks = channels;