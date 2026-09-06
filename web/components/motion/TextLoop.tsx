'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './TextLoop.module.css';

type Props = {
  /** Phrases in order. The last one is where the loop stops and stays. */
  items: string[];
  /** Seconds each phrase holds. docs/02: 2.4s. */
  interval?: number;
  className?: string;
};

/**
 * TextLoop, ported from the Astro `src/components/motion/TextLoop.astro` to
 * React. Same contract, three deliberate differences from the Astro original:
 *
 *   1. It cycles ONCE and holds on the last item. docs/06: "The mission phrase
 *      cycles once and holds on 'you.' Not a loop." The Astro version wrapped
 *      with `% frames.length` and ran forever.
 *   2. It does not roll per character. Motion budget: the hero wordmark is the
 *      only per-character effect on the page.
 *   3. It always arms. The Astro version refused to arm under reduced motion;
 *      DESIGN.md, "Motion is not optional", means nothing here reads that
 *      query any more.
 *
 * PROGRESSIVE ENHANCEMENT, kept from the original. The collapse-into-one-cell
 * layout is the armed state, not the base state. Server-rendered HTML lists
 * every phrase in normal flow, so with JavaScript off the whole rotator reads
 * as a sentence and no phrase is stranded at opacity 0. The script adds the
 * hidden state, never the visible one.
 *
 * The visible phrases are marked aria-hidden while a live copy of the full
 * list stays in the accessibility tree, so a screen reader is not read a
 * ticker.
 */
export default function TextLoop({ items, interval = 2.4, className }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;

    setArmed(true);

    // Only burn a timer while the rotator is actually on screen, and only
    // start once it has been seen, so the reader does not arrive after it has
    // already finished.
    let timer = 0;
    let seen = false;

    const step = () => {
      setIndex((i) => {
        const next = i + 1;
        // Stop at the last item. It holds there for the rest of the session.
        if (next >= items.length - 1) {
          window.clearInterval(timer);
          timer = 0;
          return items.length - 1;
        }
        return next;
      });
    };

    const start = () => {
      if (timer !== 0 || seen) return;
      seen = true;
      timer = window.setInterval(step, Math.max(400, interval * 1000));
    };

    const node = root.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      start();
      return () => window.clearInterval(timer);
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) start();
    });
    io.observe(node);

    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [items, interval]);

  return (
    <>
      {/* Only once the visible frames have been hidden from the a11y tree,
          otherwise the unarmed page would announce the list twice. */}
      {armed && <span className="sr-only">{items.join(' ')}</span>}
      <span
        ref={root}
        className={`${styles.loop} ${className ?? ''}`}
        data-motion={armed ? 'in' : undefined}
        aria-hidden={armed || undefined}
      >
        {items.map((item, i) => (
          <span key={item} className={styles.frame} data-active={armed && i === index ? '' : undefined}>
            {item}
          </span>
        ))}
      </span>
    </>
  );
}
