'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { primaryNav, joinCta } from '@/lib/nav';
import Pill from './Pill';
import styles from './Nav.module.css';

/**
 * Desktop: mark + wordmark + eight links + gold pill on white.
 * Mobile: mark + wordmark + [ Menu ]. Full-screen white menu.
 * Bottom border and solid ground appear once the hero has locked (scrollY > 80).
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 80);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
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
        <Pill href={joinCta.href} external={joinCta.external} tone="gold">
          {joinCta.label}
        </Pill>
        <button className={styles.bracket} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
          [ Menu ]
        </button>
      </div>

      {open && (
        <div className={styles.sheet} role="dialog" aria-modal="true" aria-label="Menu">
          <button className={styles.bracket} onClick={() => setOpen(false)} autoFocus>
            [ Close ]
          </button>
          <nav className={styles.sheetLinks}>
            {primaryNav.map((i) => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)}>
                {i.label}
              </Link>
            ))}
          </nav>
          <Pill href={joinCta.href} external={joinCta.external} tone="gold">
            {joinCta.label}
          </Pill>
        </div>
      )}
    </header>
  );
}
