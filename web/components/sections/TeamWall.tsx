'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import type { BoardMember } from '@/content/landing';
import styles from './TeamWall.module.css';

/**
 * The team portrait wall.
 *
 * A full-bleed, continuously scrolling strip of board portraits, not a card
 * carousel. The set is rendered twice and the track translates by -50% on a
 * linear loop, so it never visibly jumps. Portraits are grayscale and silent
 * until a pointer or keyboard focus selects one: then only that portrait
 * returns to color and its name and role rise from the bottom-left. Hovering
 * the strip pauses the drift and releasing resumes it from the same offset.
 *
 * Reduced motion stops the drift and turns the strip into a normal horizontal
 * scroller.
 */

/** Editorial rhythm: equal heights, varying widths. Faces stay centred. */
const ASPECTS = ['3 / 4', '1 / 1', '4 / 5', '1 / 1', '5 / 6', '1 / 1', '3 / 4', '1 / 1'];

const SIZES = '(max-width: 640px) 62vw, (max-width: 1100px) 30vw, 420px';

export default function TeamWall({ members }: { members: BoardMember[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  useEffect(() => {
    const clear = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-person]')) return;
      setActiveId(null);
    };
    document.addEventListener('pointerdown', clear);
    return () => document.removeEventListener('pointerdown', clear);
  }, []);

  /**
   * Touch selection only. Pointer type is device truth: a real tap reports
   * "touch" or "pen", a mouse click reports "mouse" and is left to :hover so
   * the desktop interaction stays hover-only. Keyboard reaches the same state
   * through :focus-within, so no click handler is needed there.
   */
  const onPointerDown = (event: ReactPointerEvent) => {
    touched.current = event.pointerType !== 'mouse';
  };

  const toggle = (id: string) => {
    if (!touched.current) return;
    setActiveId((current) => (current === id ? null : id));
  };

  const renderPortrait = (member: BoardMember, index: number, interactive: boolean) => (
    <>
      <span className={styles.frame} style={{ aspectRatio: ASPECTS[index % ASPECTS.length] }}>
        <ResponsiveImage
          className={styles.photo}
          src={member.src}
          alt={interactive ? `Portrait of ${member.name}` : ''}
          width={member.width}
          height={member.height}
          sizes={SIZES}
        />
      </span>
      {interactive && (
        <span className={styles.info}>
          <span className={styles.name}>{member.name}</span>
          <span className={styles.role}>{member.role}</span>
        </span>
      )}
    </>
  );

  return (
    <div
      ref={viewport}
      className={`${styles.viewport} ${activeId ? styles.paused : ''}`}
    >
      <ul className={styles.track} role="list" aria-label="ColorStack UMN board members">
        {members.map((member, index) => (
          <li
            key={member.id}
            className={`${styles.person} ${activeId === member.id ? styles.active : ''}`}
            data-person
          >
            <button
              type="button"
              className={styles.hit}
              aria-label={`${member.name}, ${member.role}`}
              onPointerDown={onPointerDown}
              onClick={() => toggle(member.id)}
            >
              {renderPortrait(member, index, true)}
            </button>
          </li>
        ))}
        {members.map((member, index) => (
          <li
            key={`duplicate-${member.id}`}
            className={`${styles.person} ${styles.duplicate}`}
            aria-hidden="true"
          >
            <span className={styles.hit}>{renderPortrait(member, index, false)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
