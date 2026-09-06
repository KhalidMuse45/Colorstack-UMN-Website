'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Wrap {children} in app/layout.tsx. Lenis drives scroll, GSAP's ticker drives
 * Lenis, ScrollTrigger listens to Lenis. One raf loop for everything.
 *
 * The handoff version read the reduced-motion media query during render and
 * returned bare children on a match, which both threw a hydration error (the
 * server had already committed to the Lenis branch) and is now against policy
 * anyway: DESIGN.md, "Motion is not optional". Nothing here reads the query.
 */
function Bridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);
  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: false }}>
      <Bridge />
      {children}
    </ReactLenis>
  );
}
