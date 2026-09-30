/** Site navigation. Single source of truth for Nav, SideNav, the mobile menu and the footer. */
import { channels, contact } from '@/content/landing';
import { JOIN_PATH } from '@/content/join';

export type NavItem = { label: string; href: string; note?: string };

export const primaryNav: NavItem[] = [
  { label: 'About', href: '/#about' },
  { label: 'What we do', href: '/#what-we-do' },
  { label: 'Meet the board', href: '/#meet-the-board' },
  { label: 'Our people', href: '/#in-the-room' },
  { label: 'Get in touch', href: '/#get-in-touch' },
];

/**
 * Top-right CTA. Opens the chapter's own join form (`join-form.html`) instead
 * of the hosted Logicform, so signups stay on the site and end on the
 * "You're on the list" confirmation.
 */
export const joinCta = { label: 'Join the community', href: JOIN_PATH };

export const footerNav: NavItem[] = [
  { label: 'Get involved', href: JOIN_PATH },
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
