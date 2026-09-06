'use client';

import Image from 'next/image';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import styles from './ZoomImage.module.css';

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Headline + optional pill, rendered on top of the image in white. */
  children?: ReactNode;
  priority?: boolean;
};

/**
 * Anthropic-style contained scroll zoom. Enters at scale .86 with 12px
 * corners and settles to 1.0 / 0px over ~60vh. Plain GSAP, no canvas.
 * For newsletter headers, event pages, Wunderbar, and CTA bands.
 * Not for the landing hero.
 */
export default function ZoomImage({ src, alt, width, height, children, priority }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!frame.current || prefersReducedMotion()) return;
      gsap.fromTo(
        frame.current,
        { scale: 0.86, borderRadius: 12 },
        {
          scale: 1,
          borderRadius: 0,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top 90%', end: 'top 30%', scrub: 0.5 },
        },
      );
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={styles.wrap}>
      <div ref={frame} className={styles.frame}>
        <Image src={src} alt={alt} width={width} height={height} sizes="100vw" priority={priority} />
        {children && <div className={styles.overlay}>{children}</div>}
      </div>
    </div>
  );
}
