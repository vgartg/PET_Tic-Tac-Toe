import type { GameMode, GameStatus, Mark } from '../types';

export interface NarratorContent {
  head: string;
  emphasis?: Exclude<Mark, 'EMPTY'>;
  sub?: string;
  result: boolean;
}

const RESULT_HEADLINES: Record<'win' | 'loss' | 'draw' | 'duo_x' | 'duo_o', string> = {
  win: 'You won — splendid',
  loss: 'Oops, you lost',
  draw: 'A draw, by the printer',
  duo_x: 'X claims the page',
  duo_o: 'O claims the page',
};

export function narratorContent(
  status: GameStatus,
  currentTurn: Mark,
  mode: GameMode,
  humanMark: Mark | null,
  movesPlayed: number,
): NarratorContent {
  if (status === 'DRAW') {
    return { head: RESULT_HEADLINES.draw, sub: 'Nine moves, no kingdom', result: true };
  }
  if (status === 'X_WON' || status === 'O_WON') {
    const winner: Exclude<Mark, 'EMPTY'> = status === 'X_WON' ? 'X' : 'O';
    if (mode === 'SOLO' && humanMark) {
      const head = winner === humanMark ? RESULT_HEADLINES.win : RESULT_HEADLINES.loss;
      return { head, emphasis: winner, sub: `Final move · ${movesPlayed}`, result: true };
    }
    return {
      head: winner === 'X' ? RESULT_HEADLINES.duo_x : RESULT_HEADLINES.duo_o,
      emphasis: winner,
      sub: `Final move · ${movesPlayed}`,
      result: true,
    };
  }
  if (mode === 'SOLO' && humanMark && humanMark !== 'EMPTY') {
    if (currentTurn !== humanMark) {
      return { head: 'The robot is thinking…', sub: `Move ${movesPlayed + 1}`, result: false };
    }
    return { head: 'Your move', emphasis: humanMark, sub: `Move ${movesPlayed + 1}`, result: false };
  }
  const turn: Exclude<Mark, 'EMPTY'> = currentTurn === 'X' ? 'X' : 'O';
  return {
    head: `${turn} to move`,
    emphasis: turn,
    sub: `Move ${movesPlayed + 1} · Duo edition`,
    result: false,
  };
}

export function formatStatusMessage(
  status: GameStatus,
  currentTurn: Mark,
  mode: GameMode,
  humanMark: Mark | null,
): string {
  return narratorContent(status, currentTurn, mode, humanMark, 0).head;
}
