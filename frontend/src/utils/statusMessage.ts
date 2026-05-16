import type { GameMode, GameStatus, Mark } from '../types';

export function formatStatusMessage(
  status: GameStatus,
  currentTurn: Mark,
  mode: GameMode,
  humanMark: Mark | null,
): string {
  if (status === 'DRAW') {
    return "It's a draw!";
  }
  if (status === 'X_WON' || status === 'O_WON') {
    const winner = status === 'X_WON' ? 'X' : 'O';
    if (mode === 'SOLO' && humanMark) {
      return winner === humanMark ? 'You won! Good job' : 'Oops... you lost';
    }
    return `Player ${winner} wins!`;
  }
  if (mode === 'SOLO' && humanMark && currentTurn !== humanMark) {
    return 'Robot is thinking...';
  }
  return `Turn: ${currentTurn}`;
}
