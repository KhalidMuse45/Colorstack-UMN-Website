'use client';

/**
 * One boolean, shared between the hero and the nav: has the hero scrolled past
 * the top edge?
 *
 * The nav's transparent state belongs to the hero, but the nav is rendered in
 * the layout and the hero in the page, so neither can pass the other a prop.
 * A three-line store beats threading a context provider through the whole tree
 * for a single boolean that changes twice a session.
 *
 * The hero publishes from its ScrollTrigger `onLeave` and `onEnterBack`. The
 * nav also measures the hero's own bottom edge on scroll and ORs the two, so
 * whichever notices first wins. Both readings agree by construction: the pin
 * spacer's bottom crosses the top of the viewport at exactly the moment the
 * pin releases. The measurement is also correct before the hero has built its
 * timeline, and it is what makes a page with no hero render solid immediately.
 */
let passed = false;
const listeners = new Set<(value: boolean) => void>();

export function setHeroPassed(value: boolean) {
  if (value === passed) return;
  passed = value;
  for (const fn of listeners) fn(value);
}

export function getHeroPassed() {
  return passed;
}

export function onHeroPassed(fn: (value: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
