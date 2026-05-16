export type Mark = 'X' | 'O' | 'EMPTY';

export type GameMode = 'SOLO' | 'DUO';

export type Difficulty = 'LITE' | 'HARD';

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
  humanMark?: Mark;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
