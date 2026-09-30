/**
 * Copy for the join form, `join-form.html`. Mirrors the Pencil frames
 * "join-form.html, Full Page" and "join-form.html, Submitted", with the
 * design's em dashes swapped for commas and full stops (chapter preference).
 */

/** Route of the join form. Static export writes it as `out/join-form.html`. */
export const JOIN_PATH = '/join-form';

/**
 * Where the form posts. A Cloudflare Pages Function in `web/functions/api/join.ts`
 * validates the submission and stores it in the `JOIN_SUBMISSIONS` KV namespace.
 */
export const JOIN_ENDPOINT = '/api/join';

export const joinHero = {
  eyebrow: 'ColorStack UMN · Mailing list',
  headline: 'Pull up a chair.',
  body: "One list, everything the chapter is up to. Any major, any year, any background. There's a seat for you.",
  perks: ['Event invites, before they hit Instagram', 'Internship & recruiting deadlines', 'Chapter Notes, our monthly newsletter'],
  caption: 'ColorStack UMN, together at Walter.',
  back: 'Back to the site',
};

export const joinForm = {
  eyebrow: 'Join the list · About a minute',
  title: 'Tell us a little about you.',
  name: { label: 'Full name', placeholder: 'First and last name' },
  email: { label: 'UMN email', placeholder: 'x500@umn.edu' },
  year: { label: 'Year', options: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad'] },
  major: { label: 'Major', placeholder: 'Computer Science, Data Science, MIS…' },
  interests: { label: 'What are you looking for?', options: ['Workshops', 'Leadership', 'Community', 'Professional Development'] },
  newsletter: 'Send me Chapter Notes, our monthly newsletter.',
  submit: 'Join the List',
  submitting: 'Saving your seat…',
  sign: 'see you at the next meeting!',
  error: "Something went wrong on our end. Try again, or email us and we'll add you by hand.",
};

export const joinSuccess = {
  eyebrow: 'Join the list · Submitted',
  headline: "Glad you're here.",
  body: "Your seat's saved. Here's what to expect over the next few weeks, and who to ask if anything's unclear.",
  noteEyebrow: "You're in · Welcome",
  title: "You're on the list.",
  noteBody: 'A confirmation is headed to your UMN inbox with the next meeting date. Chapter Notes will find you once a month.',
  rows: [
    { label: 'Next up', value: 'Next event, details on our Instagram', icon: 'calendar' as const },
    { label: 'Follow along', value: '@colorstackumn', icon: 'instagram' as const },
  ],
  back: 'Back to ColorStack UMN',
};

export const joinSteps = {
  eyebrow: '01 / After you hit join',
  title: "Here's what happens next.",
  aside: ['No hoops, no interview.', "Just a seat that's already yours."],
  steps: [
    { title: "You're on the list", body: "A confirmation lands in your UMN inbox right away, with what's coming up next.", note: 'check your inbox!', icon: 'mail' as const },
    { title: 'Chapter Notes arrives', body: 'Our monthly newsletter: event invites, internship deadlines, and wins from members.', note: 'once a month, promise', icon: 'news' as const },
    { title: 'Pull up to an event', body: 'Come to our next event, and bring a friend. Follow our Instagram so you never miss one.', note: "we'll save you a seat", icon: 'people' as const, cta: 'Follow @colorstackumn' },
  ],
};

export const boardApplications = {
  eyebrow: '02 / Board applications',
  title: 'Want to help run the chapter?',
  body: "Board applications are closed for now. Join our list and you'll be the first to know when they drop.",
  cta: 'Join the list to hear first',
  status: 'Applications closed',
  noteTitle: 'Where you could sit.',
  stamp: 'opening soon!',
  stampSub: 'dates TBD, stay tuned',
  roles: [
    { role: 'President & Vice Presidents', what: 'Set the direction' },
    { role: 'Treasurer & Secretary', what: 'Budgets, notes, logistics' },
    { role: 'Event Coordinator', what: 'Meetings, socials, workshops' },
    { role: 'Outreach & Public Relations', what: 'Campus, Twin Cities, Instagram' },
    { role: 'Academic & Professional Dev.', what: 'Recruiters, alumni, interview prep' },
  ],
  sign: 'your name could go here!',
};

export const joinFaq = {
  eyebrow: '03 / Good questions',
  title: 'Before you hit join.',
  scribble: 'ask us anything, really',
  items: [
    { q: 'Do I have to be a CS major?', a: "No. Any major, any year, any background. If you're curious about tech, there's a seat for you." },
    { q: 'Does joining the list cost anything?', a: 'Nothing. Joining the list and getting Chapter Notes is free.' },
    { q: 'How often will you email me?', a: 'About once a month for Chapter Notes, plus the occasional event reminder. Nothing else.' },
  ],
};

/** The Get in Touch sticky note on the landing page (Pencil: Start a Conversation Note). */
export const getInTouchNote = {
  eyebrow: 'Get in touch',
  title: 'Start a conversation.',
  emailLabel: 'Email the board',
  body: 'Questions about joining, partnering, or speaking at a meeting? Get in touch.',
  sign: "we'd love to hear from",
  signEmphasis: 'you!',
};
