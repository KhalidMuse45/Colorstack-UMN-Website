'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
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
 * "The room turns on." Pinned scene, 150vh of travel. docs/06 hero table.
 *
 * Four elements above the fold: wordmark, italic lede, one gold pill, photo.
 * Nothing else. No eyebrow, no second CTA, no scroll cue, no location line.
 *
 * DOM layers, bottom to top:
 *   <Image>   colour photo, priority. The LCP element, and the whole picture
 *             for anyone whose browser cannot give us a WebGL context.
 *   <canvas>  HeroScene, opaque once its texture loads.
 *   copy      wordmark, lede, one pill. Optional caption.
 *
 * THE ONLY FALLBACK IS TECHNICAL. DESIGN.md, "Motion is not optional": there
 * is no reduced-motion variant and nothing here reads the media query. If
 * WebGL is unavailable, or the scene throws while mounting, the photograph
 * underneath is already in the right place at the right size and the pin, the
 * clip, the wordmark contraction and everything downstream carry on exactly as
 * they would have. What is lost is the duotone lift, and only that.
 */
export default function Hero(p: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLHeadingElement>(null);
  const cap = useRef<HTMLParagraphElement>(null);
  const progress = useRef(0);

  // `ready` keeps the first client render identical to the server's. The real
  // values land in an effect, so nothing here can cause a hydration mismatch.
  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [webgl, setWebgl] = useState(false);

  // Whether the canvas should be rendering. False once the pin releases, so
  // the page can use stillness (docs/06). React state rather than a ref: it is
  // the Canvas `frameloop` prop, and it has to cause a render to take effect.
  const [running, setRunning] = useState(true);

  useEffect(() => {
    setDesktop(window.matchMedia('(min-width: 768px)').matches);
    setWebgl(hasWebGL());
    setReady(true);
  }, []);

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
        },
      });

      // 0 -> 0.6: the aperture opens to the full viewport while the copy
      // recedes and the wordmark contracts toward the masthead.
      tl.fromTo(
        media.current,
        { clipPath: 'inset(55% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 0.6 },
        0,
      )
        .to(copy.current, { autoAlpha: 0, y: -16, ease: 'none', duration: 0.35 }, 0)
        .to(
          mark.current,
          { scale: 0.18, transformOrigin: 'left top', ease: 'none', duration: 0.6 },
          0,
        )
        // 0.45 -> 0.6: the wordmark hands off to the one in the nav, which
        // fades in on the same scroll (see ui/Nav.tsx, scrollY > 80).
        .to(mark.current, { autoAlpha: 0, ease: 'none', duration: 0.15 }, 0.45);

      if (cap.current) {
        tl.fromTo(cap.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', duration: 0.09 }, 0.85);
      }

      ScrollTrigger.refresh();
    },
    { dependencies: [ready, desktop], scope: root },
  );

  return (
    <section ref={root} className={styles.hero} aria-label={p.wordmark}>
      <div ref={media} className={styles.media}>
        <Image
          src={p.photo.src}
          alt={p.photo.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: p.photo.objectPosition }}
        />
        {ready && webgl && (
          <CanvasBoundary>
            <HeroScene src={p.photo.src} progress={progress} running={running} displace={desktop} glyphs={desktop} />
          </CanvasBoundary>
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
