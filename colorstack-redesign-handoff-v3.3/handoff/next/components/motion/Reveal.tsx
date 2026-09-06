'use client';

import { useRef, type ReactNode, type ElementType } from 'react';
import { gsap, useGSAP, DURATION, EASE_GSAP, prefersReducedMotion } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** 'rise' = fade + 24px rise. 'wipe' = one restrained 8% clip-path unfold for images (docs/06). */
  mode?: 'rise' | 'wipe';
  delay?: number;
  className?: string;
};

/**
 * Use sparingly. The landing page uses `wipe` on images and `rise` on at most
 * one block per section. Do not wrap every element.
 */
export default function Reveal({ children, as: Tag = 'div', mode = 'rise', delay = 0, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const from = mode === 'wipe' ? { clipPath: 'inset(0 0 8% 0)' } : { autoAlpha: 0, y: 24 };
      const to = mode === 'wipe' ? { clipPath: 'inset(0 0 0% 0)' } : { autoAlpha: 1, y: 0 };
      gsap.fromTo(ref.current, from, {
        ...to,
        duration: DURATION,
        delay,
        ease: EASE_GSAP,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={{ willChange: mode === 'wipe' ? 'clip-path' : 'transform, opacity' }}>
      {children}
    </Tag>
  );
}
