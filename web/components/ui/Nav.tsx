'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { primaryNav, joinCta, socialNav, contactEmail } from '@/lib/nav';
import { getHeroPassed, onHeroPassed } from '@/lib/heroPin';
import Pill from './Pill';
import styles from './Nav.module.css';

/**
 * Desktop: mark + wordmark top-left, seven links and the gold pill top-right.
 * Mobile: mark + wordmark + `[ Menu ]` into a full-screen white sheet.
 *
 * TWO STATES, ONE DOM.
 *
 * At the top of the page the bar is fully transparent and sits on the hero
 * photograph: white links, white wordmark, no background, no border, no blur.
 * The moment the hero has scrolled past the top edge it returns to the site's
 * default: white ground, 1px var(--line) bottom line, ink links, maroon
 * wordmark, and it stays there for the rest of the page. Scrolling back up
 * reverses it. Everything is a 240ms colour crossfade on the house easing, and
 * both states use the same markup and the same measurements, so nothing jumps.
 *
 * The switch is whichever of these notices first: the hero's ScrollTrigger
 * `onLeave`, published through lib/heroPin, or the hero's own bottom edge
 * crossing the top of the viewport, measured here on scroll.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let fromPin = getHeroPassed();

    const read = () => {
      const hero = document.querySelector<HTMLElement>('[data-hero]');
      // No hero on this page: the nav is simply in its default state.
      const scrolledPast = !hero || hero.getBoundingClientRect().bottom <= 0;
      setSolid(fromPin || scrolledPast);
    };

    const stop = onHeroPassed((value) => {
      fromPin = value;
      read();
    });

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      stop();
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    /*
     * FIXED from the handoff, which set `documentElement.style.overflow` and
     * left it set. Lenis puts its own inline styles on the same element, so
     * clearing the property to '' on close also cleared Lenis's, and the page
     * came back with smooth scrolling half detached. A class the sheet owns,
     * removed on cleanup, touches nothing Lenis wrote.
     */
    document.body.classList.add(styles.locked);
    // Captured now, not read in the cleanup: by then the ref may point
    // somewhere else, and eslint is right to say so.
    const returnTo = opener.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove(styles.locked);
      document.removeEventListener('keydown', onKey);
      // Send focus back where it came from, not to the top of the document.
      returnTo?.focus();
    };
  }, [open]);

  return (
    <header className={`${styles.nav} ${solid ? styles.solid : ''}`}>
      <Link href="/" className={styles.brand} aria-label="ColorStack UMN, home">
        <Image src="/images/colorstack-umn-mark-192.webp" alt="" width={24} height={24} priority />
        <span>ColorStack UMN</span>
      </Link>

      <nav className={styles.links} aria-label="Primary">
        {primaryNav.map((i) => (
          <Link key={i.href} href={i.href} className="link">
            {i.label}
          </Link>
        ))}
      </nav>

      <div className={styles.right}>
        <span className={styles.pillSlot}>
          <Pill href={joinCta.href} external={joinCta.external} tone="gold">
            {joinCta.label}
          </Pill>
        </span>
        <button
          ref={opener}
          type="button"
          className={styles.bracket}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          [ Menu ]
        </button>
      </div>

      {open && (
        <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={styles.sheetTop}>
            <Link href="/" className={styles.brand} onClick={() => setOpen(false)} aria-label="ColorStack UMN, home">
              <Image src="/images/colorstack-umn-mark-192.webp" alt="" width={24} height={24} />
              <span>ColorStack UMN</span>
            </Link>
            {/* autoFocus is correct here: the sheet is a modal dialog and
                focus has to enter it when it opens. */}
            <button type="button" className={styles.bracket} onClick={() => setOpen(false)} autoFocus>
              [ Close ]
            </button>
          </div>

          <nav className={styles.sheetLinks} aria-label="Primary">
            {primaryNav.map((i) => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)}>
                {i.label}
              </Link>
            ))}
          </nav>

          <div className={styles.sheetFoot}>
            <Pill href={joinCta.href} external={joinCta.external} tone="gold">
              {joinCta.label}
            </Pill>
            <div className={styles.sheetSocials}>
              {socialNav.map((s) => (
                <a key={s.href} className="link" href={s.href} target="_blank" rel="noopener">
                  {s.label}
                </a>
              ))}
              <a className="link" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
