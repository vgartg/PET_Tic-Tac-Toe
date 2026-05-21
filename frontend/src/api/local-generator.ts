import type {
  CreateGameRequest,
  Difficulty,
  GameMode,
  GameResponse,
  GameStatus,
  Mark,
} from '../types';
import { WINNING_LINES } from '../types';

type PlayerMark = Exclude<Mark, 'EMPTY'>;

interface GameState {
  id: string;
  mode: GameMode;
  difficulty: Difficulty | null;
  humanMark: PlayerMark | null;
  robotMark: PlayerMark | null;
  cells: Mark[];
  currentTurn: PlayerMark;
  status: GameStatus;
}

const store = new Map<string, GameState>();
const CORNERS = [0, 2, 6, 8];
const CENTER = 4;

function uuid(): string {
  const g = globalThis.crypto;
  if (g && typeof g.randomUUID === 'function') return g.randomUUID();
  const hex = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) s += '-';
    else if (i === 14) s += '4';
    else s += hex[(Math.random() * 16) | 0];
  }
  return s;
}

function opponent(mark: PlayerMark): PlayerMark {
  return mark === 'X' ? 'O' : 'X';
}

function computeStatus(cells: Mark[]): GameStatus {
  for (const line of WINNING_LINES) {
    const a = cells[line[0]];
    if (a !== 'EMPTY' && a === cells[line[1]] && a === cells[line[2]]) {
      return a === 'X' ? 'X_WON' : 'O_WON';
    }
  }
  return cells.every((c) => c !== 'EMPTY') ? 'DRAW' : 'IN_PROGRESS';
}

function emptyIndices(cells: Mark[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < cells.length; i++) if (cells[i] === 'EMPTY') out.push(i);
  return out;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function liteMove(cells: Mark[]): number {
  return pickRandom(emptyIndices(cells));
}

function smartMove(cells: Mark[], mark: PlayerMark): number {
  const empties = emptyIndices(cells);
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestMoves: number[] = [];
  for (const idx of empties) {
    const next = cells.slice();
    next[idx] = mark;
    const score = minimaxOpponent(next, mark, 1);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [idx];
    } else if (score === bestScore) {
      bestMoves.push(idx);
    }
  }
  return pickRandom(bestMoves);
}

function terminalScore(cells: Mark[], self: PlayerMark, depth: number): number | null {
  const status = computeStatus(cells);
  if (status === 'IN_PROGRESS') return null;
  if (status === 'DRAW') return 0;
  const selfWon = (status === 'X_WON' && self === 'X') || (status === 'O_WON' && self === 'O');
  return selfWon ? 10 - depth : -10 + depth;
}

function minimaxOpponent(cells: Mark[], self: PlayerMark, depth: number): number {
  const terminal = terminalScore(cells, self, depth);
  if (terminal !== null) return terminal;
  const opp = opponent(self);
  let best = Number.POSITIVE_INFINITY;
  for (const idx of emptyIndices(cells)) {
    const next = cells.slice();
    next[idx] = opp;
    const score = minimaxSelf(next, self, depth + 1);
    if (score < best) best = score;
  }
  return best;
}

function minimaxSelf(cells: Mark[], self: PlayerMark, depth: number): number {
  const terminal = terminalScore(cells, self, depth);
  if (terminal !== null) return terminal;
  let best = Number.NEGATIVE_INFINITY;
  for (const idx of emptyIndices(cells)) {
    const next = cells.slice();
    next[idx] = self;
    const score = minimaxOpponent(next, self, depth + 1);
    if (score > best) best = score;
  }
  return best;
}

function hardMove(cells: Mark[], mark: PlayerMark): number {
  const own = cells.filter((c) => c === mark).length;
  if (own === 0) {
    if (cells[CENTER] === 'EMPTY') return CENTER;
    const corners = CORNERS.filter((i) => cells[i] === 'EMPTY');
    if (corners.length) return pickRandom(corners);
  }
  for (const line of WINNING_LINES) {
    let count = 0;
    let target: number | null = null;
    let blocked = false;
    for (const idx of line) {
      const c = cells[idx];
      if (c === mark) count++;
      else if (c === 'EMPTY') target = idx;
      else {
        blocked = true;
        break;
      }
    }
    if (!blocked && count === 2 && target !== null) return target;
  }
  return liteMove(cells);
}

function snapshot(g: GameState): GameResponse {
  return {
    id: g.id,
    mode: g.mode,
    difficulty: g.difficulty,
    humanMark: g.humanMark,
    robotMark: g.robotMark,
    cells: g.cells.slice(),
    currentTurn: g.currentTurn,
    status: g.status,
    finished: g.status !== 'IN_PROGRESS',
  };
}

function applyMove(g: GameState, cellIndex: number): void {
  if (g.status !== 'IN_PROGRESS') throw new Error('Game is already finished');
  if (cellIndex < 0 || cellIndex >= 9) throw new Error('Cell index must be in [0, 9)');
  if (g.cells[cellIndex] !== 'EMPTY') throw new Error(`Cell ${cellIndex} is already occupied`);
  g.cells[cellIndex] = g.currentTurn;
  g.status = computeStatus(g.cells);
  if (g.status === 'IN_PROGRESS') g.currentTurn = opponent(g.currentTurn);
}

function playRobotIfNeeded(g: GameState): void {
  if (g.mode !== 'SOLO' || g.status !== 'IN_PROGRESS') return;
  if (g.currentTurn === g.humanMark) return;
  const robotMark = g.robotMark as PlayerMark;
  let move: number;
  if (g.difficulty === 'IMPOSSIBLE') move = smartMove(g.cells, robotMark);
  else if (g.difficulty === 'HARD') move = hardMove(g.cells, robotMark);
  else move = liteMove(g.cells);
  applyMove(g, move);
}

export function localCreate(request: CreateGameRequest): GameResponse {
  if (request.mode === 'SOLO') {
    if (!request.difficulty) throw new Error('difficulty is required for SOLO');
    if (!request.humanMark) throw new Error('humanMark is required for SOLO');
  }
  const human = request.mode === 'SOLO' ? (request.humanMark as PlayerMark) : null;
  const robot = human ? opponent(human) : null;
  const game: GameState = {
    id: uuid(),
    mode: request.mode,
    difficulty: request.mode === 'SOLO' ? (request.difficulty as Difficulty) : null,
    humanMark: human,
    robotMark: robot,
    cells: Array(9).fill('EMPTY'),
    currentTurn: 'X',
    status: 'IN_PROGRESS',
  };
  store.set(game.id, game);
  playRobotIfNeeded(game);
  return snapshot(game);
}

export function localGet(id: string): GameResponse {
  const g = store.get(id);
  if (!g) throw new Error(`Game ${id} not found`);
  return snapshot(g);
}

export function localMove(id: string, cellIndex: number): GameResponse {
  const g = store.get(id);
  if (!g) throw new Error(`Game ${id} not found`);
  applyMove(g, cellIndex);
  playRobotIfNeeded(g);
  return snapshot(g);
}

export function localDelete(id: string): void {
  store.delete(id);
}
