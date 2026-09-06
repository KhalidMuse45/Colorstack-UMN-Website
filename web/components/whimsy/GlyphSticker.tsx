'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = {
  glyph?: '✳' | '✦' | '★';
  /** 8–14 per brand rules. Sign flips direction. */
  rotate?: number;
  size?: number;
  tone?: 'gold' | 'maroon' | 'rose';
  className?: string;
  delay?: number;
};

/** Spring-pops once on scroll. Max three per page. Never over the hero canvas. */
export default function GlyphSticker({ glyph = '✳', rotate = 11, size = 56, tone = 'gold', className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const color = tone === 'gold' ? 'var(--gold)' : tone === 'maroon' ? 'var(--maroon)' : 'var(--rose)';

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { scale: 0, rotate: rotate - 30 },
        {
          scale: 1,
          rotate,
          duration: 0.9,
          delay,
          ease: 'elastic.out(1, 0.55)',
          scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden
      className={className}
      style={{ display: 'inline-block', fontSize: size, lineHeight: 1, color, transform: `rotate(${rotate}deg)`, willChange: 'transform', userSelect: 'none' }}
    >
      {glyph}
    </span>
  );
}
