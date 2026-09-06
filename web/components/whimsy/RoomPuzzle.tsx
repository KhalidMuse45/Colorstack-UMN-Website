'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  SIZE,
  SOLVED,
  applyMove,
  emptyIndex,
  isSolved,
  nextSolutionMove,
  shuffle,
  type Board,
} from './roomPuzzle.logic';
import styles from './RoomPuzzle.module.css';

/**
 * The belonging puzzle. FIX-2 sections 3 and 6.
 *
 * Eight word tiles on a 3x3 grid. Solved, they read the sentence left to
 * right, top to bottom. No timer, no score, no completion gate: the invitation
 * underneath is never waiting on this.
 *
 * SERVER STATE = SOLVED. The sentence renders in reading order in the HTML, so
 * with the script off the page still says what it means and a screen reader
 * reads a sentence rather than a jumble. The shuffle is what the script adds.
 *
 * The logic (neighbors, move, shuffle, the A* hint) is in roomPuzzle.logic.ts
 * so it can be run outside a browser.
 */

/*
 * Copy. It would normally live in content/landing.ts with the rest, but that
 * file is the chapter's voice and these are the puzzle's own interface strings,
 * quoted verbatim from FIX-2 section 6. The sentence itself is a prop and does
 * come from content.
 */
const META_LABEL = 'The belonging puzzle';
const OPEN_SPACE = 'room to move';
const MOVES_LABEL = 'Moves';
const SHUFFLE_LABEL = 'Shuffle';
const HELP_LABEL = 'A little help';
const STATUS = {
  idle: 'A place for every piece. Start with a tile beside the open space.',
  hint: 'Try the highlighted tile.',
  solved: "That's the whole sentence. You're in.",
};

/** FIX-2 section 3: the hint ring is shown for 1.6s. */
const HINT_MS = 1600;

/** A single character that is neither a letter nor a digit, such as the glyph. */
const GLYPH = /^[^\p{L}\p{N}]$/u;

type Slide = { index: number; dx: number; dy: number; refocus: boolean };

type Props = {
  /** The solved sentence. One word per tile, in reading order. */
  sentence: string;
  /**
   * The word whose tile carries the gold. FIX-2 section 3 puts it on ROOM, the
   * page's single permission gold; it is a prop so the component is not welded
   * to one sentence.
   */
  accentWord?: string;
};

export default function RoomPuzzle({ sentence, accentWord = 'room' }: Props) {
  const words = useMemo(() => sentence.split(/\s+/).filter(Boolean), [sentence]);

  const [board, setBoard] = useState<Board>(SOLVED);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState<number | null>(null);
  const [played, setPlayed] = useState(false);

  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const slide = useRef<Slide | null>(null);

  // The shuffle is the script's addition. The server sent the sentence.
  useEffect(() => {
    setBoard(shuffle());
  }, []);

  useEffect(() => {
    if (hint === null) return;
    const id = window.setTimeout(() => setHint(null), HINT_MS);
    return () => window.clearTimeout(id);
  }, [hint]);

  /*
   * The 180ms slide, done as an invert-then-release rather than by animating
   * the grid: the tiles are rendered in board order so that DOM order is
   * reading order, which means the moved word is already painted in its new
   * cell by the time this runs. It is offset back to the cell it came from
   * with the transition suppressed, the style is flushed, and then both are
   * released, so the transform transition in the stylesheet carries it across.
   */
  useLayoutEffect(() => {
    const step = slide.current;
    slide.current = null;
    if (!step) return;
    const el = cells.current[step.index];
    if (!el) return;

    el.style.transition = 'none';
    el.style.setProperty('--dx', String(step.dx));
    el.style.setProperty('--dy', String(step.dy));
    // Force the offset to be committed before it is taken away again.
    el.getBoundingClientRect();
    el.style.transition = '';
    el.style.removeProperty('--dx');
    el.style.removeProperty('--dy');

    // A tile activated from the keyboard becomes the open space, which is not
    // focusable, so focus follows the word to where it landed.
    if (step.refocus) el.focus();
  }, [board]);

  const move = useCallback(
    (from: number) => {
      const next = applyMove(board, from);
      if (next === null) return;
      const gap = emptyIndex(board);
      slide.current = {
        index: gap,
        dx: (from % SIZE) - (gap % SIZE),
        dy: Math.floor(from / SIZE) - Math.floor(gap / SIZE),
        refocus: typeof document !== 'undefined' && document.activeElement === cells.current[from],
      };
      setBoard(next);
      setMoves((n) => n + 1);
      setHint(null);
      setPlayed(true);
    },
    [board],
  );

  /*
   * Arrow keys move focus within the grid. Enter and Space are the button's
   * own activation and land on onClick, so they are not handled here.
   */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const step = steps[event.key];
    if (!step) return;

    const here = cells.current.findIndex((el) => el !== null && el === document.activeElement);
    if (here < 0) return;
    event.preventDefault();

    let col = here % SIZE;
    let row = Math.floor(here / SIZE);
    // Step over the open space, which is not a button.
    for (let i = 0; i < SIZE; i += 1) {
      col += step[0];
      row += step[1];
      if (col < 0 || col >= SIZE || row < 0 || row >= SIZE) return;
      const target = cells.current[row * SIZE + col];
      if (target) {
        target.focus();
        return;
      }
    }
  };

  const help = () => {
    const from = nextSolutionMove(board);
    if (from === null) return;
    setHint(from);
    cells.current[from]?.focus();
  };

  const restart = () => {
    setBoard(shuffle());
    setMoves(0);
    setHint(null);
    setPlayed(false);
  };

  const solved = isSolved(board);
  const tone = solved && played ? 'solved' : hint !== null ? 'hint' : 'idle';

  return (
    <div className={styles.puzzle} data-solved={solved ? '' : undefined}>
      <div className={styles.meta}>
        <span>{META_LABEL}</span>
        <span>
          {MOVES_LABEL} {moves}
        </span>
      </div>

      <div className={styles.grid} role="group" aria-label={META_LABEL} onKeyDown={onKeyDown}>
        {board.map((value, index) => {
          if (value === 0) {
            return (
              /* No ref: the button that used to sit here has already had its
                 own ref called with null, which clears the slot. Not
                 aria-hidden either, so a screen reader still finds the open
                 space between the words. */
              <div key={index} className={styles.open}>
                <span className={styles.openLabel}>{OPEN_SPACE}</span>
              </div>
            );
          }

          const word = words[value - 1] ?? '';
          const variant = GLYPH.test(word)
            ? styles.glyph
            : word.toLowerCase() === accentWord.toLowerCase()
              ? styles.accent
              : '';

          return (
            <button
              key={index}
              type="button"
              ref={(el) => {
                cells.current[index] = el;
              }}
              className={`${styles.tile} ${variant} ${hint === index ? styles.hint : ''}`}
              onClick={() => move(index)}
              aria-label={`Word: ${word}, position ${index + 1}`}
            >
              <span aria-hidden>{word}</span>
              <span className={styles.index} aria-hidden>
                {value}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.control} onClick={restart}>
          {SHUFFLE_LABEL}
        </button>
        <button type="button" className={styles.control} onClick={help}>
          {HELP_LABEL}
        </button>
      </div>

      <p className={styles.status} data-tone={tone} aria-live="polite">
        {STATUS[tone]}
      </p>
    </div>
  );
}
