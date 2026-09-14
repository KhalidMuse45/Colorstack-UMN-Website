import type { CSSProperties } from 'react';

/**
 * Inline SVG arrows for link affordances.
 *
 * Unicode arrows (↗ ↓ →) fall back to Apple Color Emoji on iOS, which shows a
 * blue emoji instead of a mark in the site's ink or gold. Drawing them as SVG
 * keeps the weight, colour (currentColor) and alignment under our control on
 * every platform. Decorative, so always aria-hidden.
 */
type ArrowDirection = 'up-right' | 'right' | 'down';

const PATHS: Record<ArrowDirection, string> = {
  'up-right': 'M4.6 9.4 9.4 4.6M5.4 4.6h4v4',
  right: 'M3.6 7h6.8M6.8 3.6 10.4 7l-3.6 3.4',
  down: 'M7 3.6v6.8M3.6 6.8 7 10.4l3.4-3.6',
};

export default function Arrow({ direction = 'up-right', className, style }: { direction?: ArrowDirection; className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className ? `arrow-icon ${className}` : 'arrow-icon'}
      style={style}
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[direction]} />
    </svg>
  );
}
