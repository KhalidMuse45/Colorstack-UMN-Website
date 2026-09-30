import type { CSSProperties } from 'react';

/**
 * Small stroke icons for the sticky notes and the join form. Same approach as
 * <Arrow>: inline SVG in currentColor, decorative, always aria-hidden.
 */
export type IconName = 'instagram' | 'linkedin' | 'copy' | 'check' | 'mail' | 'calendar' | 'news' | 'people' | 'plus' | 'minus';

const PATHS: Record<IconName, string> = {
  instagram: 'M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5ZM12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6ZM17.4 6.4v.1',
  linkedin: 'M4.5 9.5v10M4.5 4.6v.1M9.5 19.5v-10m0 4.5c0-2.5 1.6-4.8 4.3-4.8 2.4 0 3.7 1.6 3.7 4.6v5.7',
  copy: 'M9 9h10.5v10.5H9zM15 9V4.5H4.5V15H9',
  check: 'M5 12.5 10 17.5 19.5 7',
  mail: 'M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7',
  calendar: 'M4 5.5h16v15H4zM4 10h16M8.5 3v5M15.5 3v5',
  news: 'M4 4.5h12.5v15H6.5A2.5 2.5 0 0 1 4 17V4.5Zm12.5 5H20V17a2.5 2.5 0 0 1-5 0M7.5 8.5H13M7.5 12H13M7.5 15.5h3',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M15.5 4.3a3.5 3.5 0 0 1 0 6.4M17.5 14.8c2.2.6 3.6 2.4 4 5.2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
};

export default function Icon({ name, size = 16, className, style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={{ width: size, height: size, flex: 'none', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
