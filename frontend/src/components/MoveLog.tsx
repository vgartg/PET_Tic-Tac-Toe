import type { MoveEntry } from '../types';

interface MoveLogProps {
  moves: MoveEntry[];
}

const CELL_LABELS = ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'];

export function MoveLog({ moves }: MoveLogProps) {
  return (
    <section className="log fade-in fade-in--delay-3">
      <div className="log__header">
        <span>№</span>
        <span>Actor</span>
        <span>Cell</span>
        <span style={{ textAlign: 'right' }}>Margin</span>
      </div>
      {moves.length === 0 ? (
        <p className="log__row log__row--ghost">
          The presser awaits the first move…
        </p>
      ) : (
        <ol className="log__rows">
          {moves.map((m) => (
            <li className="log__row" key={m.ordinal}>
              <span className="log__no">{m.ordinal.toString().padStart(2, '0')}</span>
              <span className="log__actor">
                <span className={`log__mark log__mark--${m.mark.toLowerCase()}`}>{m.mark}</span>
                {actorWord(m.actor)}
              </span>
              <span className="log__cell">{CELL_LABELS[m.cellIndex]}</span>
              <span className="log__phrase">{m.phrase}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function actorWord(actor: MoveEntry['actor']): string {
  if (actor === 'you') return 'you';
  if (actor === 'robot') return 'the printer';
  return 'a hand';
}
