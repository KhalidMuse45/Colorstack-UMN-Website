'use client';

import { useEffect, useState } from 'react';
import styles from './PageIndex.module.css';

/**
 * The sticky gutter index: `01 … 06` in mono down the left gutter, the current
 * section shown as a maroon dot. Desktop only, no heading.
 *
 * Driven by the `data-index` attributes the page puts on its sections, so the
 * numbering lives with the sections rather than being restated here. The
 * server renders the full list from `count` and the script only ever changes
 * which one is current, so nothing here depends on JavaScript to exist.
 *
 * Decorative on purpose: these are spans, not links, and the whole rail is
 * aria-hidden. It reports where you are, it is not a way to get anywhere, so
 * it owes a screen reader nothing and it cannot become a dead control when a
 * script fails.
 */
export default function PageIndex({ count = 6 }: { count?: number }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>(() =>
    Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, '0')),
  );

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-index]'));
    if (sections.length === 0) {
      setLabels([]);
      return;
    }

    // Reconcile with what the page actually rendered. Voices, for one, renders
    // nothing at all until there are two real testimonials.
    setLabels(sections.map((s) => s.dataset.index ?? ''));

    // Track the whole intersecting set rather than only the last section to
    // enter it. Setting `current` on entry alone leaves the dot stuck on
    // whatever was last read: scroll back to the top of the page and the rail
    // still claims you are in section 02.
    const live = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const n = (e.target as HTMLElement).dataset.index;
          if (!n) continue;
          if (e.isIntersecting) live.add(n);
          else live.delete(n);
        }
        // Topmost of whatever is crossing the band, so overlapping sections
        // resolve the same way every time.
        const sorted = Array.from(live).sort();
        setCurrent(sorted.length > 0 ? sorted[0] : null);
      },
      // A band across the middle of the viewport: whichever section crosses it
      // is the one being read.
      { rootMargin: '-45% 0px -45% 0px' },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  if (labels.length === 0) return null;

  return (
    <div className={styles.index} aria-hidden>
      {labels.map((n) => (
        <span key={n} className={styles.item} data-current={n === current ? '' : undefined}>
          {n}
        </span>
      ))}
    </div>
  );
}
