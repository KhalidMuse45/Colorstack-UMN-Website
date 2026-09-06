'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { primaryNav, joinCta, socialNav, contactEmail } from '@/lib/nav';
import Pill from './Pill';
import styles from './Nav.module.css';

/**
 * Desktop: mark + wordmark + seven links + the gold pill.
 * Mobile: mark + wordmark + `[ Menu ]` into a full-screen white sheet with the
 * links in Archivo 700 at 40px, socials and the chapter inbox at the bottom.
 *
 * The bar is transparent over the hero and turns solid white with a 1px line
 * once the hero locks. The wordmark fades in with it: the hero's own wordmark
 * is contracting and fading out over the same scroll, so exactly one of the
 * two is on screen at a time. docs/06: "locked as nav wordmark".
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 80);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
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
        <span className={styles.brandWord}>ColorStack UMN</span>
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
              <span className={styles.brandWord}>ColorStack UMN</span>
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
