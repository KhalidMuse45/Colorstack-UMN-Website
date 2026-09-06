/** Site navigation. Single source of truth for Nav, SideNav, the mobile menu and the footer. */
import { MAILING_LIST, channels, contact, hero } from '@/content/landing';

export type NavItem = { label: string; href: string; note?: string };

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/about', note: 'Mission, e-board, advisors, sponsors' },
  { label: 'Programs', href: '/programs', note: 'Workshops, Leadership, Professional Development, Community' },
  { label: 'Events', href: '/events', note: 'Upcoming and past' },
  { label: 'Newsletter', href: '/newsletter', note: 'Chapter Notes archive' },
  { label: 'Opportunities', href: '/opportunities', note: 'Internships, referrals, scholarships, conference funding' },
  { label: 'Resources', href: '/resources', note: 'Interview prep, résumé and Git guides, community links' },
  { label: 'Wunderbar', href: '/wunderbar', note: 'Peer-to-peer mock interviews, built by the e-board' },
];

/**
 * Changed from the handoff's `process.env.NEXT_PUBLIC_MAILING_LIST_URL ?? '#join'`.
 * That fallback ships a nav pill that goes nowhere whenever the variable is
 * unset, which is every local build. The endpoint is already a single constant
 * in the content file, shared by the hero pill, this pill and the form, so it
 * cannot drift. Label comes from the same place the hero CTA does.
 */
export const joinCta = { label: hero.ctas[0].label, href: MAILING_LIST, external: true };

export const footerNav: NavItem[] = [
  { label: 'Contact', href: '/contact' },
  { label: 'Sponsor us', href: '/sponsor' },
  { label: 'Privacy', href: '/privacy' },
];

/**
 * Socials, for the mobile menu sheet and the footer. Derived from the
 * `channels` list in the content file rather than retyped, so there is one
 * place a handle can be wrong.
 */
export const socialNav: NavItem[] = channels
  .filter((c) => c.label === 'Instagram' || c.label === 'LinkedIn')
  .map((c) => ({ label: c.label, href: c.href, note: c.value }));

/** The chapter inbox. Same constant the contact copy and the footer use. */
export const contactEmail = contact.email;

/** Editorial pages (newsletter, blog, about) use the Poolside-style side panel. */
export const editorialNav: NavItem[] = [
  { label: 'Chapter Notes', href: '/newsletter' },
  { label: 'Issues', href: '/newsletter/issues' },
  { label: 'About', href: '/about' },
  { label: 'Back to site', href: '/' },
];
