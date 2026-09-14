'use client';

import { useEffect } from 'react';

/**
 * Progressive-enhancement scroll reveal.
 *
 * The hidden state lives in globals.css under `.reveal-ready`, and that class
 * is added by an inline script in the layout before first paint, so a reader
 * without JavaScript still sees every section. This component only promotes
 * elements marked `data-reveal` to `.is-visible` as they enter the viewport.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
}
