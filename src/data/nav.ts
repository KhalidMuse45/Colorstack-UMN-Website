/**
 * Single source of truth for site navigation. Owned by the orchestrator as
 * integration glue: NavBar, MobileSheet, and Footer all read it, so no
 * implementer edits it. Routes come straight from UX-SPEC.md §2.
 *
 * Depth rule (§2): nothing is more than 2 clicks from `/`. No mega-menu,
 * no dropdowns in the primary nav.
 */

export interface NavLink {
  href: string;
  label: string;
}

/** Primary nav, in order. `Join` is NOT here — it is a gold pill CTA and
 *  always renders last, separately. */
export const primaryNav: NavLink[] = [
  { href: '/events', label: 'Events' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/about', label: 'About' },
];

/** The persistent conversion CTA. Gold pill, always last. */
export const joinCta: NavLink = { href: '/join', label: 'Join' };

/** Footer column 2. Superset of the primary nav — includes the depth-2
 *  routes that the primary nav deliberately omits. */
export const exploreNav: NavLink[] = [
  ...primaryNav,
  { href: '/about/team', label: 'Team' },
  { href: '/sponsor', label: 'Sponsor' },
];

/** Footer column 3. External links open in a new tab and carry the
 *  maroon-light ↗ marker (§6). */
export const connectNav: NavLink[] = [
  { href: 'mailto:colorstk@umn.edu', label: 'colorstk@umn.edu' },
  { href: 'https://www.instagram.com/colorstackumn/', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/colorstackumn/', label: 'LinkedIn' },
];

/** True for anything that leaves the site and should get the ↗ marker. */
export const isExternal = (href: string): boolean =>
  href.startsWith('http') || href.startsWith('mailto:');

/** Chapter identity strings. Kept here so casing is enforced in one place. */
export const chapter = {
  name: 'ColorStack UMN',
  affiliation:
    'A ColorStack chapter at the University of Minnesota Twin Cities',
  email: 'colorstk@umn.edu',
} as const;
