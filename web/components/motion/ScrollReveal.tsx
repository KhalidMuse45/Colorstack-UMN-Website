'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Progressive-enhancement scroll reveal.
 *
 * The hidden state lives in globals.css under `.reveal-ready`, and that class
 * is added by an inline script in the layout before first paint, so a reader
 * without JavaScript still sees every section. This component only promotes
 * elements marked `data-reveal` to `.is-visible` as they enter the viewport.
 *
 * It lives in the root layout, which stays mounted across client-side
 * navigation, so it re-scans on every route change. Otherwise a page reached
 * through a <Link> (home → join form) keeps its sections hidden.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));

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
  }, [pathname]);

  return null;
}
