'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

/**
 * Characters roll up on mount. Hero wordmark only. Keeps a visually hidden
 * intact copy so the accessible name and the served HTML both stay whole.
 */
export default function TextRoll({ text, stagger = 0.032, duration = 0.85 }: { text: string; stagger?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.fromTo(
        ref.current.querySelectorAll('[data-ch]'),
        { yPercent: 110 },
        { yPercent: 0, duration, ease: 'expo.out', stagger },
      );
    },
    { scope: ref },
  );

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden style={{ display: 'inline-block' }}>
        {text.split('').map((ch, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <span data-ch style={{ display: 'inline-block', willChange: 'transform' }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
