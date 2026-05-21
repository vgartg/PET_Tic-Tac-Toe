export type Mark = 'X' | 'O' | 'EMPTY';

export type GameMode = 'SOLO' | 'DUO';

export type Difficulty = 'LITE' | 'HARD' | 'IMPOSSIBLE';

export type GameStatus = 'IN_PROGRESS' | 'X_WON' | 'O_WON' | 'DRAW';

export interface GameResponse {
  id: string;
  mode: GameMode;
  difficulty: Difficulty | null;
  humanMark: Mark | null;
  robotMark: Mark | null;
  cells: Mark[];
  currentTurn: Mark;
  status: GameStatus;
  finished: boolean;
}

export interface CreateGameRequest {
  mode: GameMode;
  difficulty?: Difficulty;
  humanMark?: Exclude<Mark, 'EMPTY'>;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export interface ScoreBoard {
  x: number;
  o: number;
  draws: number;
}

export interface MoveEntry {
  ordinal: number;
  mark: Exclude<Mark, 'EMPTY'>;
  cellIndex: number;
  actor: 'you' | 'robot' | 'player';
  phrase: string;
}

export const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
