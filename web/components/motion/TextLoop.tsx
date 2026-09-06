'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './TextLoop.module.css';

type Props = {
  /** Static, never moves, never animates. "Building a space for". */
  prefix: string;
  /** Phrases in order. The last one is where the sequence stops and stays. */
  items: string[];
  /** Seconds each phrase holds. FIX-2 §5: 2.4s. */
  interval?: number;
  className?: string;
};

/** FIX-2 §5: out in 180ms, then the text changes and it eases back over 240ms. */
const OUT_MS = 180;

/**
 * The mission rotator: prefix and rotating word on ONE line, the word underlined
 * in gold, the sequence running once on scroll-into-view and holding on its last
 * phrase forever. FIX-2 §5 is the whole specification; the measurements it names
 * live in TextLoop.module.css.
 *
 * PROGRESSIVE ENHANCEMENT. The server renders the RESTING state, which is the
 * final state: the last phrase, styled exactly as it will look when the sequence
 * has finished. A reader whose JavaScript never arrives, or whose script throws,
 * sees the finished sentence rather than a phrase stranded mid-cycle. The script
 * only ever rewinds to the first phrase and plays forward to the state that was
 * already on the page.
 *
 * Only the word moves. The prefix is a separate element that no animation ever
 * touches, so nothing reflows around it.
 *
 * The rotating word is hidden from the accessibility tree once the script is
 * driving it, with a visually hidden copy of the full list alongside, so a
 * screen reader is read the sentence rather than a ticker.
 */
export default function TextLoop({ prefix, items, interval = 2.4, className }: Props) {
  const root = useRef<HTMLParagraphElement>(null);
  /** Which phrase the DOM is showing. Mirrors `index` without re-arming the effect. */
  const cursor = useRef(0);
  const last = Math.max(0, items.length - 1);

  const [index, setIndex] = useState(last);
  const [armed, setArmed] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // One phrase is not a sequence: it stays exactly as the server drew it.
    if (items.length < 2) return;

    // Rewind to the top of the sequence now that the script is demonstrably
    // running. Until this point the page shows the finished state.
    cursor.current = 0;
    setIndex(0);
    setLeaving(false);
    setArmed(true);

    const hold = Math.max(400, interval * 1000);
    let cycle = 0;
    let swap = 0;
    let started = false;

    const step = () => {
      setLeaving(true);
      swap = window.setTimeout(() => {
        cursor.current = Math.min(cursor.current + 1, items.length - 1);
        setIndex(cursor.current);
        setLeaving(false);
        // Reached the last phrase. It holds there for the rest of the session:
        // the sequence runs once and does not loop.
        if (cursor.current >= items.length - 1) {
          window.clearInterval(cycle);
          cycle = 0;
        }
      }, OUT_MS);
    };

    const start = () => {
      if (started) return;
      started = true;
      cycle = window.setInterval(step, hold);
    };

    const stop = () => {
      window.clearInterval(cycle);
      window.clearTimeout(swap);
    };

    const node = root.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      start();
      return stop;
    }

    // Runs on scroll-into-view, so nobody arrives after it has already finished.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      }
    });
    io.observe(node);

    return () => {
      io.disconnect();
      stop();
    };
  }, [items, interval]);

  return (
    <p ref={root} className={`${styles.rotator} ${className ?? ''}`}>
      <span className={styles.prefix}>{prefix}</span>
      <span className={styles.word} data-leaving={leaving || undefined} aria-hidden={armed || undefined}>
        {items[index] ?? items[last]}
      </span>
      {/* Added only once the visible word has left the accessibility tree,
          otherwise the unarmed page would be read twice. */}
      {armed && <span className="sr-only">{items.join(' ')}</span>}
    </p>
  );
}
