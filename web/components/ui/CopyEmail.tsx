'use client';

import { useEffect, useState } from 'react';
import styles from './CopyEmail.module.css';

/**
 * The chapter inbox with click-to-copy. Used by the footer and by Get in
 * Touch.
 *
 * The server renders a plain `mailto:` link, which is the working, final
 * state. The script upgrades it to a button that copies. If the script never
 * runs, or the Clipboard API is missing, the address is still readable and
 * still clickable.
 */
export default function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanCopy(typeof navigator !== 'undefined' && Boolean(navigator.clipboard));
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  if (!canCopy) {
    return (
      <a className={`link ${className ?? ''}`} href={`mailto:${email}`}>
        {email}
      </a>
    );
  }

  return (
    <span className={`${styles.wrap} ${className ?? ''}`}>
      <button
        type="button"
        className={styles.copy}
        onClick={() => {
          navigator.clipboard.writeText(email).then(
            () => setCopied(true),
            () => setCopied(false),
          );
        }}
      >
        {email}
      </button>
      <span className={styles.said} data-shown={copied ? '' : undefined} aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </span>
  );
}
