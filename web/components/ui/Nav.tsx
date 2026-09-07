'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { primaryNav, joinCta, socialNav, contactEmail } from '@/lib/nav';
import Pill from './Pill';
import styles from './Nav.module.css';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !open) return;
    el.showModal();
    const returnTo = opener.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const mq = window.matchMedia('(min-width: 900px)');
    const closeOnDesktop = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener('change', closeOnDesktop);
    return () => {
      mq.removeEventListener('change', closeOnDesktop);
      el.close();
      document.body.style.overflow = previousOverflow;
      returnTo?.focus();
    };
  }, [open]);

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="ColorStack UMN, home">
          <Image src="/images/colorstack-umn-mark-192.webp" alt="" width={30} height={30} />
          <span>ColorStack <span className={styles.location}>UMN</span></span>
        </Link>
        <nav className={styles.links} aria-label="Primary">
          {primaryNav.map(i => <a key={i.href} href={i.href}>{i.label}</a>)}
        </nav>
        <div className={styles.right}>
          <span className={styles.join}><Pill href={joinCta.href} external tone="maroon">Join the community <span aria-hidden="true">↗</span></Pill></span>
          <button ref={opener} className={styles.menuButton} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-navigation">Menu <span aria-hidden="true">+</span></button>
        </div>
      </div>
      <dialog ref={dialog} id="mobile-navigation" className={styles.sheet} aria-label="Navigation" onCancel={() => setOpen(false)} onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <div className={styles.sheetTop}>
          <Link className={styles.brand} href="/" onClick={() => setOpen(false)}>ColorStack UMN</Link>
          <button type="button" className={styles.close} onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button>
        </div>
        <nav className={styles.sheetLinks} aria-label="Mobile primary">
          {primaryNav.map((i, index) => <a key={i.href} href={i.href} onClick={() => setOpen(false)}><span className={styles.number}>0{index + 1}</span>{i.label}<span aria-hidden="true">↗</span></a>)}
        </nav>
        <div className={styles.sheetFoot}>
          <Pill href={joinCta.href} external tone="maroon">Join the community ↗</Pill>
          <div className={styles.socials}>
            {socialNav.map(s => <a href={s.href} key={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>)}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
