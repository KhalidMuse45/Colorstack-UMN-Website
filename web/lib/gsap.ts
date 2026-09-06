'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** The house easing. Use for every reveal. */
export const EASE = 'cubic-bezier(.22,1,.36,1)';
export const EASE_GSAP = 'expo.out';
export const DURATION = 0.8;
export const STAGGER = 0.15;

/**
 * There is deliberately no `prefersReducedMotion` helper here any more, and
 * nothing in this app reads the media query.
 *
 * DESIGN.md, "Motion is not optional" (owner decision, 2026-09-06): the site
 * ships one experience and no reduced-motion variant. The only fallback in the
 * build is technical rather than preferential: if WebGL will not initialise,
 * the hero shows its static colour photograph in the same layout and
 * everything else still animates. See components/hero/Hero.tsx.
 *
 * What did not change, and is not negotiable: the server renders the final
 * visible state, so a script that fails can never strand content; every
 * interactive piece works from the keyboard and reads correctly to a screen
 * reader; focus rings stay.
 */
export { gsap, ScrollTrigger, useGSAP };
