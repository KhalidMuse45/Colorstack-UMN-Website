'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';

/**
 * "COPY" chip beside the chapter inbox on the Get in Touch note. Renders
 * nothing until the Clipboard API is confirmed, so the mailto link beside it
 * stays the working fallback.
 */
export default function CopyButton({ text, className }: { text: string; className?: string }) {
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setCanCopy(typeof navigator !== 'undefined' && Boolean(navigator.clipboard)), []);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  if (!canCopy) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => navigator.clipboard.writeText(text).then(() => setCopied(true), () => setCopied(false))}
      aria-label={copied ? `Copied ${text}` : `Copy ${text}`}
    >
      <Icon name={copied ? 'check' : 'copy'} size={13} />
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
