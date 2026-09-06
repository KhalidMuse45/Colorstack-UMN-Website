/** Site navigation. Single source of truth for Nav, SideNav, the mobile menu and the footer. */
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

export const joinCta = { label: 'Join the List', href: process.env.NEXT_PUBLIC_MAILING_LIST_URL ?? '#join', external: true };

export const footerNav: NavItem[] = [
  { label: 'Contact', href: '/contact' },
  { label: 'Sponsor us', href: '/sponsor' },
  { label: 'Privacy', href: '/privacy' },
];

/** Editorial pages (newsletter, blog, about) use the Poolside-style side panel. */
export const editorialNav: NavItem[] = [
  { label: 'Chapter Notes', href: '/newsletter' },
  { label: 'Issues', href: '/newsletter/issues' },
  { label: 'About', href: '/about' },
  { label: 'Back to site', href: '/' },
];
