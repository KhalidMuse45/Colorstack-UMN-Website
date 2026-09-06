'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { tokens } from '@/lib/tokens';
import styles from './FloatingCards.module.css';

const FloatingCardsScene = dynamic(() => import('./FloatingCardsScene'), { ssr: false });

/**
 * The ✳ pointer, over cards only. Drawn from `tokens.ink` rather than a literal
 * hex, because a data URI is still a place a colour can drift out of the
 * palette. `pointer` is the fallback if the browser will not take the image.
 */
const STAR_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><text x="14" y="21" font-size="20" text-anchor="middle" fill="${tokens.ink}">✳</text></svg>`,
)}") 14 14, pointer`;

export type FloatingCardsPhoto = {
  /** Stable identity. Falls back to src plus position when a caller omits it. */
  id?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * "In the Room": candid chapter photographs as thin planes turning on their own
 * vertical axes over white. Spec: handoff/docs/07-FLOATINGCARDS.md.
 *
 * CANDIDS ONLY, AND NOT BY THIS COMPONENT'S DOING. `lib/landing.ts` hands it
 * the photographs flagged `candid: true` and nothing else, so the canvas, the
 * server's masonry, the keyboard list and the lightbox are all showing the same
 * set without any of them holding a second copy of the rule. A group shot or a
 * posed portrait cannot appear here by being passed in, only by being flagged
 * candid in `content/landing.ts`, which is where that judgement is recorded.
 *
 * WHAT THE SERVER RENDERS. The static masonry below, every photograph in it,
 * with its alt text. That is the whole section for a reader whose JavaScript
 * has not arrived, has been turned off, or threw on the way in, and it is the
 * reason this component satisfies CLAUDE.md rule 2: the visible state is the
 * server's, and the script only ever replaces it with a richer one.
 *
 * The canvas mounts on the client, in place of the masonry, as soon as the
 * component has mounted. That is a paint or two after hydration and long
 * before anyone has scrolled this far down the page, so the swap is not
 * something a reader watches happen.
 *
 * WHAT IT DOES NOT DO. It does not read `prefers-reduced-motion`, here or
 * anywhere below it. DESIGN.md, "Motion is not optional": the site ships one
 * experience. There is no reduced-motion branch to find.
 *
 * It is also not coupled to scroll in any way. The only thing scroll position
 * decides is whether the render loop is running at all, so that this canvas
 * and the hero's are never drawing in the same frame.
 */
export default function FloatingCards({ photos }: { photos: FloatingCardsPhoto[] }) {
  const captionId = useId();
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const items = useMemo(
    () => photos.map((p, i) => ({ ...p, uid: p.id ?? `${p.src}-${i}` })),
    [photos],
  );

  // docs/07 caps the cloud at sixteen cards, eight on mobile. The button list
  // and the masonry below still carry every photograph, so nothing supplied is
  // unreachable by keyboard on a small screen.
  const shown = useMemo(() => items.slice(0, mobile ? 8 : 16), [items, mobile]);
  const sceneCards = useMemo(
    () => shown.map(({ uid, src, width, height }) => ({ uid, src, width, height })),
    [shown],
  );

  /*
   * The breakpoint is watched, not sampled once. The scene's own layout follows
   * the canvas size on every resize, but the card count and the column count
   * are decided here, and a window dragged across 768px with those frozen gives
   * a phone-width viewport a sixteen-card four-column cloud. Which is exactly
   * the state a reviewer resizing one open page would be looking at.
   */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setMobile(mq.matches);
    on();
    setMounted(true);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  /*
   * docs/07: `frameloop="always"` only while the section is in view. The hero
   * canvas stops when its pin releases and this one starts when it is looked
   * at, so the page never has two render loops going at once. This is a prop
   * rather than a `setFrameloop` call from inside `useFrame`, which is the trap
   * components/hero/HeroScene.tsx documents: the moment such a call sets
   * "demand" its own `useFrame` stops, and nothing is left to set "always".
   */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const on = () => setPageVisible(document.visibilityState === 'visible');
    on();
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  const openPhoto = useCallback((uid: string) => setOpen(uid), []);

  const close = useCallback(() => {
    setOpen((uid) => {
      // Focus goes back to whatever opened the lightbox, which for a keyboard
      // reader is the hidden button and for a pointer is nothing at all.
      if (uid) triggers.current.get(uid)?.focus();
      return null;
    });
  }, []);

  // Focus moves into the lightbox on open.
  useEffect(() => {
    if (open) dialog.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        return;
      }
      // A one-control dialog, so the trap is one line: Tab keeps the close
      // button. `aria-modal` hides the page behind it from assistive tech and
      // this stops a sighted keyboard reader tabbing out of a modal.
      if (e.key === 'Tab') {
        const focusables = dialog.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables || focusables.length === 0) return;
        e.preventDefault();
        focusables[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const openPhotoData = open ? items.find((p) => p.uid === open) : undefined;
  const hoveredPhoto = hovered ? items.find((p) => p.uid === hovered) : undefined;

  return (
    <div className={styles.root} ref={root}>
      <div
        /*
         * No dimming class when the lightbox is open. The canvas keeps
         * rendering at full strength and the lightbox's own white veil is what
         * puts it at 40%: one mechanism, one number, and it cannot drift out of
         * step with the veil the way two stacked opacities did.
         */
        className={styles.stage}
        /*
         * The canvas is decoration as far as assistive technology is
         * concerned: every photograph in it is reachable through the button
         * list below, which carries the same alt text. Before it mounts this
         * same element holds the server's masonry, which is the section for a
         * reader without JavaScript and must stay readable, so the attribute
         * arrives with the canvas rather than being baked into the markup.
         */
        aria-hidden={mounted || undefined}
        style={{ cursor: hovered ? STAR_CURSOR : undefined }}
        /*
         * A pointer can leave the canvas without ever crossing empty space on
         * it, straight off a card and out of the section, in which case neither
         * the card's own pointerout nor `onPointerMissed` fires and the caption
         * line is left holding the alt text of a photo nobody is pointing at.
         */
        onPointerLeave={() => setHovered(null)}
      >
        {mounted ? (
          <FloatingCardsScene
            photos={sceneCards}
            cols={mobile ? 2 : 4}
            tilt={!mobile}
            running={inView && pageVisible}
            hoveredUid={hovered}
            onHover={setHovered}
            onOpen={openPhoto}
          />
        ) : (
          <ul className={styles.masonry}>
            {items.map((p) => (
              <li key={p.uid} className={styles.masonryItem}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  unoptimized
                  className={styles.masonryImage}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*
        The hovered photo's alt text, under the canvas, in Lora italic. Not over
        the card, not in mono, and the line holds its height whether or not
        anything is hovered so nothing below it moves.
      */}
      <p className={styles.caption}>
        {hoveredPhoto?.alt ?? ' '}
      </p>

      {/*
        One button per photograph, clipped out of the layout until something in
        the list takes focus, at which point the whole list appears with a gold
        ring on the focused item. This is the keyboard and screen-reader path
        into the lightbox.
      */}
      <ul className={styles.a11yList}>
        {items.map((p) => (
          <li key={p.uid}>
            <button
              type="button"
              className={styles.a11yButton}
              ref={(el) => {
                if (el) triggers.current.set(p.uid, el);
                else triggers.current.delete(p.uid);
              }}
              onClick={() => openPhoto(p.uid)}
            >
              {p.alt}
            </button>
          </li>
        ))}
      </ul>

      {openPhotoData && (
        <div
          className={styles.lightbox}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className={styles.lightboxPanel}
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${captionId}-open`}
            tabIndex={-1}
          >
            <figure className={styles.lightboxFigure}>
              <Image
                src={openPhotoData.src}
                alt={openPhotoData.alt}
                width={openPhotoData.width}
                height={openPhotoData.height}
                unoptimized
                className={styles.lightboxImage}
              />
              <figcaption className={styles.lightboxCaption} id={`${captionId}-open`}>
                {openPhotoData.alt}
              </figcaption>
            </figure>
            <button type="button" className={styles.lightboxClose} onClick={close}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
