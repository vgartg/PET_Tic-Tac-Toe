import type { GameMode, GameStatus, Mark } from '../types';
import { narratorContent } from '../utils/statusMessage';

interface NarratorProps {
  status: GameStatus;
  currentTurn: Mark;
  mode: GameMode;
  humanMark: Mark | null;
  movesPlayed: number;
}

export function Narrator(props: NarratorProps) {
  const { status, currentTurn, mode, humanMark, movesPlayed } = props;
  const content = narratorContent(status, currentTurn, mode, humanMark, movesPlayed);
  const cls = ['narrator', content.result ? 'narrator--result' : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} role="status" aria-live="polite">
      <p className="narrator__line">
        {renderHead(content.head, content.emphasis)}
      </p>
      {content.sub && <span className="narrator__sub">{content.sub}</span>}
    </div>
  );
}

function renderHead(head: string, emphasis: Exclude<Mark, 'EMPTY'> | undefined) {
  if (!emphasis) return head;
  const token = emphasis;
  const parts = head.split(token);
  if (parts.length < 2) return head;
  return parts.map((segment, idx) => (
    <span key={idx}>
      {segment}
      {idx < parts.length - 1 && (
        <span className={`accent--${token.toLowerCase()}`}>{token}</span>
      )}
    </span>
  ));
}
