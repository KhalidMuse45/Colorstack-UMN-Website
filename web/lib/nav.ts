/** Site navigation. Single source of truth for Nav, SideNav, the mobile menu and the footer. */
import { MAILING_LIST, channels, contact, hero } from '@/content/landing';

export type NavItem = { label: string; href: string; note?: string };

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/#about' },
  { label: 'What we do', href: '/#what-we-do' },
  { label: 'Our people', href: '/#in-the-room' },
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
  { label: 'Get involved', href: '/#join' },
  { label: 'Partner with us', href: `mailto:${contact.email}` },
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
