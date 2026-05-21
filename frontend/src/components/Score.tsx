import type { GameMode, Mark, ScoreBoard } from '../types';

interface ScoreProps {
  score: ScoreBoard;
  mode: GameMode;
  humanMark: Mark | null;
}

export function Score({ score, mode, humanMark }: ScoreProps) {
  const left =
    mode === 'SOLO' && humanMark
      ? { label: `You · ${humanMark}`, value: humanMark === 'X' ? score.x : score.o, accent: humanMark }
      : { label: 'X', value: score.x, accent: 'X' as const };

  const right =
    mode === 'SOLO' && humanMark
      ? {
          label: `Printer · ${humanMark === 'X' ? 'O' : 'X'}`,
          value: humanMark === 'X' ? score.o : score.x,
          accent: (humanMark === 'X' ? 'O' : 'X') as 'X' | 'O',
        }
      : { label: 'O', value: score.o, accent: 'O' as const };

  return (
    <div className="score fade-in fade-in--delay-2">
      <div className="score__side">
        <span className="score__label">{left.label}</span>
        <span className={`score__value score__value--${left.accent.toLowerCase()}`}>
          {left.value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="score__colon" aria-hidden="true">
        ·
      </span>
      <div className="score__side score__side--right">
        <span className="score__label">{right.label}</span>
        <span className={`score__value score__value--${right.accent.toLowerCase()}`}>
          {right.value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="score__draws">
        Draws · <strong>{score.draws.toString().padStart(2, '0')}</strong>
      </span>
    </div>
  );
}
