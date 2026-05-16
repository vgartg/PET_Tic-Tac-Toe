import type { GameMode, GameStatus, Mark } from '../types';
import { formatStatusMessage } from '../utils/statusMessage';

interface StatusBannerProps {
  status: GameStatus;
  currentTurn: Mark;
  mode: GameMode;
  humanMark: Mark | null;
}

export function StatusBanner({ status, currentTurn, mode, humanMark }: StatusBannerProps) {
  const message = formatStatusMessage(status, currentTurn, mode, humanMark);
  const variant = status === 'IN_PROGRESS' ? 'status--info' : 'status--result';

  return (
    <div className={`status ${variant}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
