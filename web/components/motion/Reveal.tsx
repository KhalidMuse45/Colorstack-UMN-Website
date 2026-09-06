'use client';

import { useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { gsap, useGSAP, DURATION, EASE_GSAP } from '@/lib/gsap';

/** The elements a reveal is allowed to be. Deliberately short. */
type RevealTag = 'div' | 'figure' | 'section' | 'article' | 'aside' | 'li';

/**
 * The four props Reveal actually passes to whichever tag it renders. Stating
 * them beats `ElementType`, whose props resolve to `never`, and beats
 * `ElementType<P>`, whose union of every intrinsic element that accepts P is
 * large enough for TypeScript to give up on (TS2590).
 */
type RevealComponent = (props: {
  ref?: Ref<HTMLElement>;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => ReactNode;

type Props = {
  children: ReactNode;
  as?: RevealTag;
  /** 'rise' = fade and a 24px rise. 'wipe' = one 8% clip-path unfold (docs/06). */
  mode?: 'rise' | 'wipe';
  delay?: number;
  className?: string;
};

/**
 * Use sparingly. The landing page uses `wipe` on the program photos and
 * nothing else. Do not wrap every element: docs/02's motion budget says if an
 * agent adds a fade-and-rise to every section, remove it.
 *
 * The hidden state is set by GSAP and never by CSS, so with JavaScript off the
 * children are simply there.
 *
 * FIXED from the handoff, which typed `as` as the bare `ElementType`. TypeScript
 * resolves the props of an unconstrained ElementType to `never`, so `ref`,
 * `className`, `style` and `children` all failed to typecheck at once. It is
 * the same class of trap CLAUDE.md records for `as?: string` in Astro: the
 * escape hatch quietly takes the whole interface with it. The tag list is
 * closed now and the props it is used with are stated.
 */
export default function Reveal({ children, as = 'div', mode = 'rise', delay = 0, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
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

  const Tag = as as unknown as RevealComponent;

  return (
    <Tag ref={ref} className={className} style={{ willChange: mode === 'wipe' ? 'clip-path' : 'transform, opacity' }}>
      {children}
    </Tag>
  );
}
