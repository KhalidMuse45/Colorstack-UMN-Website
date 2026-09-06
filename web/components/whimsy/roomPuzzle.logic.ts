/**
 * The belonging puzzle, logic only. FIX-2 section 6.
 *
 * Deliberately a separate file from RoomPuzzle.tsx: it imports nothing, touches
 * no DOM and holds no React state, so the shuffle and the A* hint can be
 * compiled and exercised in node rather than checked by eye in a browser.
 * CLAUDE.md, "a check that cannot fail is not a check".
 *
 * Board: nine slots holding the tile values 1 to 8, and 0 for the open space.
 * Tile v belongs in slot v - 1, so the solved board is [1..8, 0] and the words
 * read left to right, top to bottom.
 */

export const SIZE = 3;
export const CELLS = SIZE * SIZE;

export type Board = number[];

/** The open space. */
export const EMPTY = 0;

/** FIX-2 section 6: the solved state is [1,2,3,4,5,6,7,8,0]. */
export const SOLVED: Board = [1, 2, 3, 4, 5, 6, 7, 8, 0];

/** Where the open space currently sits. */
export const emptyIndex = (board: Board): number => board.indexOf(EMPTY);

/**
 * The indices reachable from `index` by one slide: up, down, left and right
 * inside the 3x3, no wrap. A tile can move only when the open space is one of
 * these.
 */
export function neighbors(index: number): number[] {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const out: number[] = [];
  if (row > 0) out.push(index - SIZE);
  if (row < SIZE - 1) out.push(index + SIZE);
  if (col > 0) out.push(index - 1);
  if (col < SIZE - 1) out.push(index + 1);
  return out;
}

/** The swap itself, with the legality check already done by the caller. */
function swap(board: Board, from: number, gap: number): Board {
  const next = board.slice();
  next[gap] = board[from];
  next[from] = EMPTY;
  return next;
}

/**
 * The board after sliding the tile at `from` into the open space, or null if
 * that is not a legal move. The counter, the transition and the focus move all
 * live in the component; this is only the state change.
 */
export function applyMove(board: Board, from: number): Board | null {
  const gap = emptyIndex(board);
  if (!neighbors(from).includes(gap)) return null;
  return swap(board, from, gap);
}

/** The A* heuristic: the sum of the Manhattan distances of tiles 1 to 8. */
export function heuristic(board: Board): number {
  let total = 0;
  for (let i = 0; i < CELLS; i += 1) {
    const value = board[i];
    if (value === EMPTY) continue;
    const goal = value - 1;
    total +=
      Math.abs(Math.floor(i / SIZE) - Math.floor(goal / SIZE)) +
      Math.abs((i % SIZE) - (goal % SIZE));
  }
  return total;
}

export const isSolved = (board: Board): boolean => board.every((v, i) => v === SOLVED[i]);

/**
 * FIX-2 section 6: start from the solved state and apply 60 to 100 random
 * legal moves, never undoing the one just made. Never a random permutation:
 * half of the 9! arrangements are unreachable, and a walk of legal moves
 * cannot land on one of them, so solvability is a property of the method and
 * does not have to be tested for at runtime.
 *
 * `random` is a parameter so the walk can be driven by a seeded generator in a
 * test.
 */
export function shuffle(random: () => number = Math.random): Board {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const steps = 60 + Math.floor(random() * 41);
    let board = SOLVED.slice();
    // The cell the last tile came from, which is where the open space is now.
    // Moving it back would undo the previous move.
    let undo = -1;
    for (let i = 0; i < steps; i += 1) {
      const gap = emptyIndex(board);
      const options = neighbors(gap).filter((cell) => cell !== undo);
      const from = options[Math.floor(random() * options.length)];
      undo = gap;
      board = swap(board, from, gap);
    }
    // A walk that happens to close back on the sentence is not a shuffle.
    if (!isSolved(board)) return board;
  }
  return SOLVED.slice();
}

/** Minimal binary heap. A sorted array would make A* quadratic. */
class Heap<T> {
  private items: T[] = [];

  constructor(private less: (a: T, b: T) => boolean) {}

  get size(): number {
    return this.items.length;
  }

  push(value: T): void {
    this.items.push(value);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(this.items[i], this.items[parent])) break;
      [this.items[i], this.items[parent]] = [this.items[parent], this.items[i]];
      i = parent;
    }
  }

  pop(): T | undefined {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0 && last !== undefined) {
      this.items[0] = last;
      let i = 0;
      for (;;) {
        const left = i * 2 + 1;
        const right = left + 1;
        let best = i;
        if (left < this.items.length && this.less(this.items[left], this.items[best])) best = left;
        if (right < this.items.length && this.less(this.items[right], this.items[best])) best = right;
        if (best === i) break;
        [this.items[i], this.items[best]] = [this.items[best], this.items[i]];
        i = best;
      }
    }
    return top;
  }
}

/** FIX-2 section 6: the search is capped at 20,000 expanded nodes. */
export const NODE_CAP = 20000;

/**
 * The fallback when the cap is hit: of the legal moves, the one whose
 * resulting board has the lowest Manhattan total.
 */
export function greediestMove(board: Board): number | null {
  let best: number | null = null;
  let bestScore = Infinity;
  for (const from of neighbors(emptyIndex(board))) {
    const next = swap(board, from, emptyIndex(board));
    const score = heuristic(next);
    if (score < bestScore) {
      bestScore = score;
      best = from;
    }
  }
  return best;
}

/**
 * A* from the current board to the solved board, Manhattan heuristic, capped
 * at NODE_CAP expansions. Returns the index of the tile to slide next, which
 * is the first move on the found path, or null if the board is already solved.
 *
 * The first move is carried down the tree instead of stored as parent
 * pointers, because the first step is the only thing a hint needs.
 */
export function nextSolutionMove(start: Board): number | null {
  if (isSolved(start)) return null;

  const goal = SOLVED.join(',');
  type Node = { board: Board; g: number; f: number; first: number };

  const open = new Heap<Node>((a, b) => a.f < b.f);
  const bestG = new Map<string, number>();
  bestG.set(start.join(','), 0);

  const startGap = emptyIndex(start);
  for (const from of neighbors(startGap)) {
    const board = swap(start, from, startGap);
    open.push({ board, g: 1, f: 1 + heuristic(board), first: from });
  }

  let expanded = 0;
  while (open.size > 0) {
    const node = open.pop();
    if (!node) break;

    const key = node.board.join(',');
    if (key === goal) return node.first;

    const seen = bestG.get(key);
    if (seen !== undefined && seen <= node.g) continue;
    bestG.set(key, node.g);

    expanded += 1;
    // The cap is here so a hint can never hang the tab.
    if (expanded > NODE_CAP) return greediestMove(start);

    const gap = emptyIndex(node.board);
    for (const from of neighbors(gap)) {
      const board = swap(node.board, from, gap);
      const g = node.g + 1;
      const childKey = board.join(',');
      const prior = bestG.get(childKey);
      if (prior !== undefined && prior <= g) continue;
      open.push({ board, g, f: g + heuristic(board), first: node.first });
    }
  }

  return greediestMove(start);
}
