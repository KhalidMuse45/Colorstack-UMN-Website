'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import TextRoll from '@/components/motion/TextRoll';
import Pill from '@/components/ui/Pill';
import styles from './Hero.module.css';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export type HeroProps = {
  wordmark: string;
  lede: string;
  primary: { label: string; href: string; external?: boolean };
  photo: { src: string; alt: string; width: number; height: number };
  /** Optional. Off by default (see docs/05). Only renders if set in Sanity. */
  caption?: string;
};

/**
 * Pinned scene, 150vh. See docs/02-LANDING-REDESIGN.md hero table.
 * Four elements above the fold: wordmark, lede, one pill, photo. Nothing else.
 *
 * DOM layers, bottom to top:
 *   <Image>   color photo, priority. The LCP element. Sits under the canvas
 *             so the page has an image the instant HTML lands.
 *   <canvas>  HeroScene. Opaque once its texture loads.
 *   copy      wordmark, lede, one pill. Optional caption.
 */
export default function Hero(p: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLHeadingElement>(null);
  const cap = useRef<HTMLParagraphElement>(null);
  const progress = useRef(0);
  const active = useRef(true);

  const [reduced, setReduced] = useState(false);
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    setDesktop(window.matchMedia('(min-width: 768px)').matches);
  }, []);

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const pinDistance = desktop ? '+=150%' : '+=120%';

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: pinDistance,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
          onToggle: (self) => {
            active.current = self.isActive;
          },
        },
      });

      // 0 → 0.6: media opens to full viewport, copy fades, wordmark shrinks to nav
      tl.fromTo(
        media.current,
        { clipPath: 'inset(55% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 0.6 },
        0,
      )
        .to(copy.current, { autoAlpha: 0, y: -16, ease: 'none', duration: 0.35 }, 0)
        .to(
          mark.current,
          { scale: 0.18, x: 0, y: 0, transformOrigin: 'left top', ease: 'none', duration: 0.6 },
          0,
        );
      // 0.85 → 1: optional caption
      if (cap.current) {
        tl.fromTo(cap.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', duration: 0.09 }, 0.85);
      }

      // lock body scroll position on refresh so the pin doesn't jump
      ScrollTrigger.refresh();
    },
    { dependencies: [reduced, desktop], scope: root },
  );

  return (
    <section ref={root} className={styles.hero} aria-label="ColorStack UMN">
      <div ref={media} className={styles.media} style={reduced ? { clipPath: 'none' } : undefined}>
        <Image src={p.photo.src} alt={p.photo.alt} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
        {!reduced && (
          <HeroScene src={p.photo.src} progress={progress} active={active} displace={desktop} glyphs={desktop} />
        )}
      </div>

      <div className={styles.copyWrap}>
        <h1 ref={mark} className={styles.mark}>
          <TextRoll text={p.wordmark} />
        </h1>
        <div ref={copy} className={styles.row}>
          <p className={styles.lede}>{p.lede}</p>
          <div className={styles.ctas}>
            <Pill href={p.primary.href} external={p.primary.external} tone="gold">
              {p.primary.label}
            </Pill>
          </div>
        </div>
      </div>

      {p.caption && (
        <p ref={cap} className={styles.caption}>
          {p.caption}
        </p>
      )}
    </section>
  );
}
