'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import type { BoardMember } from '@/content/landing';
import TeamWall from './TeamWall';
import styles from './MeetTheBoard.module.css';

/**
 * Meet the board.
 *
 * On first scroll into view the portraits deal themselves into a layered deck,
 * one at a time, the way the design reference stacks them: the newest frame
 * lands centre stage and the frames before it fan out behind. When the last
 * portrait has shown, the deck hands off to the continuously scrolling
 * portrait wall (TeamWall). Reduced motion skips the intro and renders the
 * wall directly.
 */

const TICK_MS = 520;
const SETTLE_MS = 900;

/** Depth 0 is the front frame; higher depths fan further back and fade out. */
const DECK = [
  { x: 0, y: 0, r: 0, s: 1, o: 1 },
  { x: -18, y: 18, r: -4.5, s: 0.93, o: 1 },
  { x: 22, y: -14, r: 3.6, s: 0.89, o: 1 },
  { x: -8, y: 34, r: 2, s: 0.85, o: 0.9 },
  { x: 30, y: 22, r: -5.5, s: 0.81, o: 0.6 },
  { x: 0, y: 46, r: 0, s: 0.78, o: 0 },
] as const;

const ACCENT: Record<BoardMember['accent'], string> = {
  maroon: styles.accentMaroon,
  gold: styles.accentGold,
  rose: styles.accentRose,
  teal: styles.accentTeal,
  pink: styles.accentPink,
};

type Phase = 'intro' | 'wall';

function deckStyle(depth: number, total: number): CSSProperties {
  const step = DECK[Math.min(depth, DECK.length - 1)];
  return {
    '--x': `${step.x}px`,
    '--y': `${step.y}px`,
    '--r': `${step.r}deg`,
    '--s': String(step.s),
    opacity: step.o,
    zIndex: total - depth,
  } as CSSProperties;
}

export default function MeetTheBoard({ members }: { members: BoardMember[] }) {
  const total = members.length;
  const [phase, setPhase] = useState<Phase>(total > 1 ? 'intro' : 'wall');
  const [front, setFront] = useState(0);
  const [ready, setReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || total < 2) {
      setPhase('wall');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        setReady(true);
        observer.disconnect();
      },
      { threshold: 0.25, rootMargin: '0px 0px -12% 0px' },
    );
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, [total]);

  useEffect(() => {
    if (phase !== 'intro' || !ready) return;
    if (front >= total - 1) {
      const id = window.setTimeout(() => setPhase('wall'), SETTLE_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setFront(front + 1), TICK_MS);
    return () => window.clearTimeout(id);
  }, [phase, ready, front, total]);

  if (total === 0) return null;

  const current = members[front];

  return (
    <section id="meet-the-board" ref={section} className={styles.board} aria-labelledby="board-heading">
      <div className={`container ${styles.head}`} data-reveal>
        <p className="eyebrow">05 / Meet the board</p>
        <h2 id="board-heading">The students behind the chapter.</h2>
        <p className={styles.lede}>
          The people who plan the meetings, pitch the sponsors, and keep the door open for whoever
          comes next. Hover a portrait to put a name to the face.
        </p>
      </div>

      <ul className="sr-only">
        {members.map((member) => (
          <li key={member.id}>
            {member.name}. {member.role}.
          </li>
        ))}
      </ul>

      {phase === 'intro' ? (
        <div className={styles.intro}>
          <div className={styles.stage} aria-hidden="true">
            {members.map((member, index) => {
              const depth = (front - index + total) % total;
              return (
                <figure
                  key={member.id}
                  className={`${styles.deckCard} ${ACCENT[member.accent]}`}
                  style={deckStyle(depth, total)}
                >
                  <span className={styles.cardPanel} />
                  <ResponsiveImage
                    className={styles.deckPhoto}
                    src={member.src}
                    alt=""
                    width={member.width}
                    height={member.height}
                    sizes="(max-width: 640px) 46vw, 300px"
                  />
                </figure>
              );
            })}
          </div>

          <div className={styles.caption}>
            <p key={front} className={styles.captionInner}>
              <span className={styles.captionName}>{current.name}</span>
              <span className={styles.captionRole}>{current.role}</span>
            </p>
            <div className={styles.progress} role="presentation">
              <span className={styles.progressFill} style={{ width: `${((front + 1) / total) * 100}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.wallIn}>
          <TeamWall members={members} />
        </div>
      )}
    </section>
  );
}
