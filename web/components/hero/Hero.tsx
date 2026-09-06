'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { setHeroPassed } from '@/lib/heroPin';
import TextRoll from '@/components/motion/TextRoll';
import Pill from '@/components/ui/Pill';
import CanvasBoundary from './CanvasBoundary';
import { hasWebGL } from './hasWebGL';
import styles from './Hero.module.css';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export type HeroProps = {
  wordmark: string;
  lede: string;
  primary: { label: string; href: string; external?: boolean };
  photo: { src: string; alt: string; width: number; height: number; objectPosition?: string };
  /** Optional. Off by default (see docs/05). Only renders if set in Sanity. */
  caption?: string;
};

/**
 * The hero melts into the nav.
 *
 * The photograph runs full-bleed from the very top of the viewport, under a
 * nav that has no ground, no border and no blur while it is up there. Four
 * things are visible and no more: the wordmark, the italic lede, one gold
 * pill, and the photo. No eyebrow, no second CTA, no scroll cue, no scroll
 * arrow, no supporters strip.
 *
 * DOM layers, bottom to top:
 *   <img>     colour photo, priority, explicit width and height, object-fit
 *             cover in a box that is already the right shape.
 *   <canvas>  HeroScene: the UV zoom and the duotone lift, unchanged.
 *   scrim     the one gradient on the site, for legibility, out by 35%.
 *   copy      wordmark, lede, one pill, bottom-left on columns 1 to 6.
 *
 * Changed from the previous pass: the clip-path aperture is gone, because the
 * photo now starts at the top edge instead of opening from the bottom 45% of
 * the stage. The pin, the scrub and the shader are otherwise untouched.
 *
 * The nav's white-to-solid switch is published from this timeline. See
 * lib/heroPin.ts for why it is a store rather than a prop.
 *
 * The WebGL guard and the error boundary stay. DESIGN.md now assumes WebGL and
 * makes no fallback a requirement, which is not the same as forbidding one: an
 * uncaught render error in the canvas would take the whole page down with it,
 * and the photograph underneath is already in the right place at the right
 * size. Two lines, and not a reduced-motion branch.
 */
export default function Hero(p: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const cap = useRef<HTMLParagraphElement>(null);
  const progress = useRef(0);

  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [webgl, setWebgl] = useState(false);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    setDesktop(window.matchMedia('(min-width: 768px)').matches);
    setWebgl(hasWebGL());
    setReady(true);
  }, []);

  // If the hero ever unmounts, the nav must not be left believing something is
  // still covering the top of the page.
  useEffect(() => () => setHeroPassed(true), []);

  useGSAP(
    () => {
      if (!ready || !root.current) return;
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
            setRunning(self.isActive);
          },
          // onLeave is the moment the hero has finished and scrolled past the
          // top edge; onEnterBack is the same moment in reverse on the way up.
          onLeave: () => setHeroPassed(true),
          onEnterBack: () => setHeroPassed(false),
        },
      });

      // 0 -> 0.35: the copy leaves and the scrim clears with it, so the
      // photograph is unobstructed long before the duotone lifts at 0.60.
      tl.to(copy.current, { autoAlpha: 0, y: -16, ease: 'none', duration: 0.35 }, 0).to(
        scrim.current,
        { autoAlpha: 0, ease: 'none', duration: 0.35 },
        0,
      );

      if (cap.current) {
        tl.fromTo(cap.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', duration: 0.09 }, 0.85);
      }

      ScrollTrigger.refresh();
    },
    { dependencies: [ready, desktop], scope: root },
  );

  return (
    <section ref={root} data-hero className={styles.hero} aria-label={p.wordmark}>
      <div className={styles.media}>
        <Image
          className={styles.photo}
          src={p.photo.src}
          alt={p.photo.alt}
          width={p.photo.width}
          height={p.photo.height}
          priority
          sizes="100vw"
          style={{ objectPosition: p.photo.objectPosition }}
        />
        {ready && webgl && (
          <CanvasBoundary>
            <HeroScene src={p.photo.src} progress={progress} running={running} displace={desktop} glyphs={desktop} />
          </CanvasBoundary>
        )}
      </div>

      <div ref={scrim} className={styles.scrim} aria-hidden />

      <div ref={copy} className={styles.copyWrap}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.copy}>
              <h1 className={styles.mark}>
                <TextRoll text={p.wordmark} block />
              </h1>
              <p className={styles.lede}>{p.lede}</p>
              <Pill href={p.primary.href} external={p.primary.external} tone="gold">
                {p.primary.label}
              </Pill>
            </div>
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
