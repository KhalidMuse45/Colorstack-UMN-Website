'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Characters roll up on mount. The hero wordmark and nothing else: the motion
 * budget allows exactly one per-character effect on the page.
 *
 * FIXED: the glyphs are grouped into words now.
 *
 * Every character mask is an `inline-block`, and a run of inline-blocks is a
 * run of separate break opportunities, so the browser was free to break a line
 * between any two letters. At the hero size the wordmark is wider than its six
 * columns, and it duly wrapped as "ColorSta / ck UMN". Wrapping each word in
 * an `inline-block` of its own restores the single break opportunity at the
 * space, so it wraps as "ColorStack / UMN", which is what the layout sketch in
 * docs/02 shows.
 *
 * This is the identical trap the Astro TextLoop carries a comment about, and
 * it cost that component real time before this one inherited it.
 *
 * `Array.from` per word rather than `split('')`, so a surrogate pair stays one
 * glyph rather than being torn into two broken halves.
 *
 * The stagger index runs across the whole string rather than restarting at
 * each word, so the roll reads as one left-to-right sweep.
 */
export default function TextRoll({
  text,
  stagger = 0.032,
  duration = 0.85,
  block = false,
}: {
  text: string;
  stagger?: number;
  duration?: number;
  /**
   * One word per line, decided here rather than left to the font's advance
   * widths. The hero uses it: see the note in Hero.module.css about the layout
   * shift a font-dependent line count was causing.
   *
   * It is a prop rather than a CSS rule the caller writes, because the word
   * span carries an inline `display`, and an inline style beats a class from a
   * CSS module every time. A caller writing `.mark [data-word] { display:
   * block }` would silently do nothing, which is exactly what happened once.
   */
  block?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current.querySelectorAll('[data-ch]'),
        { yPercent: 110 },
        { yPercent: 0, duration, ease: 'expo.out', stagger },
      );
    },
    { scope: ref },
  );

  // Keep the separators, so the spaces survive the regroup.
  const tokens = text.split(/(\s+)/).filter((t) => t !== '');

  return (
    <>
      {/* The served HTML and the accessible name both stay whole. */}
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden style={{ display: 'inline-block' }}>
        {tokens.map((token, t) =>
          /^\s+$/.test(token) ? (
            ' '
          ) : (
            <span key={t} data-word style={{ display: block ? 'block' : 'inline-block', whiteSpace: 'nowrap' }}>
              {Array.from(token).map((ch, i) => (
                <span
                  key={i}
                  style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
                >
                  <span data-ch style={{ display: 'inline-block', willChange: 'transform' }}>
                    {ch}
                  </span>
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </>
  );
}
