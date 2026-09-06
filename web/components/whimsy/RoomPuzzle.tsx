'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import styles from './RoomPuzzle.module.css';

/**
 * The play beat: an eight-tile 3x3 sliding puzzle whose tiles are the words of
 * one sentence. docs/02 and docs/06.
 *
 * Rules it has to keep:
 *   - Always solvable. It is shuffled only by legal moves from the solved
 *     state, never by permuting the tiles, so it cannot land on one of the
 *     unreachable half of the 9! arrangements.
 *   - No timer, no score, no completion gate. The invitation underneath it is
 *     never blocked by it.
 *   - 180ms tile moves and no celebration animation.
 *   - Hint is A* with Manhattan distance and marks the next tile to slide.
 *
 * SERVER STATE = SOLVED. The sentence renders in reading order in the HTML, so
 * with JavaScript off the page still says what it means, and a search engine
 * or a screen reader reads a sentence rather than a jumble. The shuffle is
 * something the script adds.
 */

type Board = (number | null)[];

const SIZE = 3;
const CELLS = SIZE * SIZE;
/** Tile n belongs in cell n. The blank belongs last. */
const SOLVED: Board = [0, 1, 2, 3, 4, 5, 6, 7, null];

const blankAt = (b: Board) => b.indexOf(null);

/** Cells a tile could slide from, given where the blank is. */
function movable(b: Board): number[] {
  const z = blankAt(b);
  const zr = Math.floor(z / SIZE);
  const zc = z % SIZE;
  const out: number[] = [];
  if (zr > 0) out.push(z - SIZE);
  if (zr < SIZE - 1) out.push(z + SIZE);
  if (zc > 0) out.push(z - 1);
  if (zc < SIZE - 1) out.push(z + 1);
  return out;
}

function slide(b: Board, from: number): Board {
  const z = blankAt(b);
  const next = b.slice();
  next[z] = b[from];
  next[from] = null;
  return next;
}

function manhattan(b: Board): number {
  let d = 0;
  for (let i = 0; i < CELLS; i += 1) {
    const v = b[i];
    if (v === null) continue;
    d += Math.abs(Math.floor(i / SIZE) - Math.floor(v / SIZE)) + Math.abs((i % SIZE) - (v % SIZE));
  }
  return d;
}

/** Minimal binary heap. A sorted array would turn A* into a quadratic search. */
class Heap<T> {
  private a: T[] = [];
  constructor(private less: (x: T, y: T) => boolean) {}
  get size() {
    return this.a.length;
  }
  push(v: T) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.less(this.a[i], this.a[p])) break;
      [this.a[i], this.a[p]] = [this.a[p], this.a[i]];
      i = p;
    }
  }
  pop(): T | undefined {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length > 0 && last !== undefined) {
      this.a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.a.length && this.less(this.a[l], this.a[m])) m = l;
        if (r < this.a.length && this.less(this.a[r], this.a[m])) m = r;
        if (m === i) break;
        [this.a[i], this.a[m]] = [this.a[m], this.a[i]];
        i = m;
      }
    }
    return top;
  }
}

/**
 * A* with Manhattan distance. Returns the value of the tile to slide next, or
 * null if the board is already solved or the search was capped.
 *
 * It carries the first move down the tree instead of storing parent pointers,
 * because the only thing a hint needs is that first step.
 */
function nextMove(start: Board): number | null {
  const key = (b: Board) => b.join(',');
  const goal = key(SOLVED);
  if (key(start) === goal) return null;

  type Node = { board: Board; g: number; f: number; first: number };
  const open = new Heap<Node>((x, y) => x.f < y.f);
  const best = new Map<string, number>();

  best.set(key(start), 0);
  for (const from of movable(start)) {
    const board = slide(start, from);
    const tile = start[from] as number;
    open.push({ board, g: 1, f: 1 + manhattan(board), first: tile });
  }

  let guard = 0;
  while (open.size > 0) {
    guard += 1;
    // Sixty thousand expansions is far past the worst 8-puzzle case with this
    // heuristic. The cap is only here so a hint can never hang the tab.
    if (guard > 60000) return null;

    const node = open.pop();
    if (!node) break;
    const k = key(node.board);
    if (k === goal) return node.first;

    const seen = best.get(k);
    if (seen !== undefined && seen <= node.g) continue;
    best.set(k, node.g);

    for (const from of movable(node.board)) {
      const board = slide(node.board, from);
      const g = node.g + 1;
      const bk = key(board);
      const prior = best.get(bk);
      if (prior !== undefined && prior <= g) continue;
      open.push({ board, g, f: g + manhattan(board), first: node.first });
    }
  }
  return null;
}

/**
 * Shuffle by walking legal moves out from the solved state, never undoing the
 * move just made. Solvability is a property of the walk, so it does not need
 * to be checked.
 */
function shuffled(steps = 80): Board {
  let b = SOLVED.slice();
  let last = -1;
  for (let i = 0; i < steps; i += 1) {
    const options = movable(b).filter((c) => c !== last);
    const from = options[Math.floor(Math.random() * options.length)];
    last = blankAt(b);
    b = slide(b, from);
  }
  // A shuffle that happens to land back on the sentence is not a shuffle.
  return b.join(',') === SOLVED.join(',') ? shuffled(steps) : b;
}

export default function RoomPuzzle({ sentence }: { sentence: string }) {
  const words = useMemo(() => sentence.split(/\s+/).filter(Boolean), [sentence]);
  const [board, setBoard] = useState<Board>(SOLVED);
  const [mark, setMark] = useState<number | null>(null);
  const tiles = useRef(new Map<number, HTMLButtonElement>());

  // The shuffle is the script's addition. The server sent the sentence.
  useEffect(() => {
    setBoard(shuffled());
    setMark(null);
  }, []);

  useEffect(() => {
    if (mark === null) return;
    const id = window.setTimeout(() => setMark(null), 1800);
    return () => window.clearTimeout(id);
  }, [mark]);

  const move = useCallback((from: number, refocus = false) => {
    setBoard((b) => {
      if (!movable(b).includes(from)) return b;
      const tile = b[from];
      if (refocus && tile !== null) {
        // Keep the keyboard on the tile it just pushed.
        window.requestAnimationFrame(() => tiles.current.get(tile)?.focus());
      }
      return slide(b, from);
    });
    setMark(null);
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const z = blankAt(board);
    const zr = Math.floor(z / SIZE);
    const zc = z % SIZE;
    let from = -1;
    // Arrow names the direction the tile travels, so Up slides the tile that
    // sits below the gap upward into it.
    if (e.key === 'ArrowUp' && zr < SIZE - 1) from = z + SIZE;
    else if (e.key === 'ArrowDown' && zr > 0) from = z - SIZE;
    else if (e.key === 'ArrowLeft' && zc < SIZE - 1) from = z + 1;
    else if (e.key === 'ArrowRight' && zc > 0) from = z - 1;
    if (from < 0) return;
    e.preventDefault();
    move(from, true);
  };

  const hint = () => {
    const tile = nextMove(board);
    setMark(tile);
    if (tile !== null) tiles.current.get(tile)?.focus();
  };

  const gap = board.indexOf(null);

  return (
    <div className={styles.wrap}>
      <div
        className={styles.board}
        onKeyDown={onKeyDown}
        role="group"
        aria-label={`Sliding word puzzle. Arrange the tiles to read: ${sentence}`}
      >
        {board.map((value, cell) =>
          value === null ? null : (
            <button
              key={value}
              type="button"
              ref={(el) => {
                if (el) tiles.current.set(value, el);
                else tiles.current.delete(value);
              }}
              className={`${styles.cell} ${styles.tile}`}
              data-mark={mark === value ? '' : undefined}
              style={
                { '--r': Math.floor(cell / SIZE), '--c': cell % SIZE } as CSSProperties
              }
              onClick={() => move(cell)}
              aria-label={`${words[value] ?? ''}, row ${Math.floor(cell / SIZE) + 1}, column ${(cell % SIZE) + 1}`}
            >
              <span aria-hidden>{words[value] ?? ''}</span>
            </button>
          ),
        )}
        <span
          className={`${styles.cell} ${styles.empty}`}
          aria-hidden
          style={{ '--r': Math.floor(gap / SIZE), '--c': gap % SIZE } as CSSProperties}
        />
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.control} onClick={hint}>
          Hint
        </button>
        <button
          type="button"
          className={styles.control}
          onClick={() => {
            setBoard(shuffled());
            setMark(null);
          }}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
}
