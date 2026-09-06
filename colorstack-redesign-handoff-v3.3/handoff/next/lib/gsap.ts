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

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, useGSAP };
