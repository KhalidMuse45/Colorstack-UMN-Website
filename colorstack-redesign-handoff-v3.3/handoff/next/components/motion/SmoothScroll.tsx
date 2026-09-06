'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/**
 * Wrap {children} in app/layout.tsx. Lenis drives scroll, GSAP's ticker
 * drives Lenis, ScrollTrigger listens to Lenis. One raf loop for everything.
 * With prefers-reduced-motion the wrapper renders children unchanged.
 */
function Bridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);
  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  if (typeof window !== 'undefined' && prefersReducedMotion()) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: false }}>
      <Bridge />
      {children}
    </ReactLenis>
  );
}
