import type { CSSProperties } from 'react';

/**
 * Small stroke icons for the sticky notes and the join form. Same approach as
 * <Arrow>: inline SVG in currentColor, decorative, always aria-hidden.
 */
export type IconName = 'instagram' | 'linkedin' | 'copy' | 'check' | 'mail-check' | 'calendar' | 'newspaper' | 'party' | 'plus' | 'minus' | 'arrow-left' | 'arrow-up';

const PATHS: Record<IconName, string> = {
  instagram: 'M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5ZM12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6ZM17.4 6.4v.1',
  linkedin: 'M4.5 9.5v10M4.5 4.6v.1M9.5 19.5v-10m0 4.5c0-2.5 1.6-4.8 4.3-4.8 2.4 0 3.7 1.6 3.7 4.6v5.7',
  copy: 'M9 9h10.5v10.5H9zM15 9V4.5H4.5V15H9',
  check: 'M5 12.5 10 17.5 19.5 7',
  'mail-check': 'M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7M16 19l2 2 4-4',
  calendar: 'M4 5.5h16v15H4zM4 10h16M8.5 3v5M15.5 3v5',
  newspaper: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8Z',
  party: 'M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'arrow-left': 'M12 19l-7-7 7-7M19 12H5',
  'arrow-up': 'M5 12l7-7 7 7M12 19V5',
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
