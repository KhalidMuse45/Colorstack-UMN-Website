'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/lib/landing';
import styles from './PhotoRoll.module.css';

/**
 * One duotone portrait cycling on a wipe. docs/02, Who We Show Up For.
 *
 * Progressive enhancement is the same trick the Astro TextLoop used for its
 * stacked mode: the server renders the frames in normal flow inside a box that
 * clips, so the first photograph is the resting, visible state and the rest are
 * out of frame rather than hidden. The script stacks them and starts the roll.
 */
export default function PhotoRoll({ photos, interval = 4 }: { photos: Photo[]; interval?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (photos.length < 2) return;
    setArmed(true);

    let timer = 0;
    const step = () => {
      setIndex((i) => {
        setPrev(i);
        return (i + 1) % photos.length;
      });
    };

    const start = () => {
      if (timer === 0) timer = window.setInterval(step, Math.max(1000, interval * 1000));
    };
    const stop = () => {
      if (timer !== 0) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const node = root.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      start();
      return stop;
    }

    // Only burn a timer while the roll is on screen.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) start();
        else stop();
      }
    });
    io.observe(node);

    return () => {
      io.disconnect();
      stop();
    };
  }, [photos.length, interval]);

  return (
    <div ref={root} className={styles.roll} data-motion={armed ? 'in' : undefined}>
      {photos.map((p, i) => (
        <figure
          key={p.src}
          className={styles.frame}
          data-state={armed ? (i === index ? 'active' : i === prev ? 'prev' : 'idle') : undefined}
          aria-hidden={armed && i !== index ? true : undefined}
        >
          <Image
            src={p.src}
            alt={p.alt}
            width={p.width}
            height={p.height}
            sizes="(min-width: 900px) 40vw, 100vw"
            style={{ objectPosition: p.objectPosition }}
          />
        </figure>
      ))}
    </div>
  );
}
