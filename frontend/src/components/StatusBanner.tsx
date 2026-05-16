import type { GameMode, GameStatus, Mark } from '../types';

interface StatusBannerProps {
  status: GameStatus;
  currentTurn: Mark;
  mode: GameMode;
  humanMark: Mark | null;
}

export function StatusBanner({ status, currentTurn, mode, humanMark }: StatusBannerProps) {
  const message = formatMessage(status, currentTurn, mode, humanMark);
  const variant = status === 'IN_PROGRESS' ? 'status--info' : 'status--result';

  return (
    <div className={`status ${variant}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

function formatMessage(
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
