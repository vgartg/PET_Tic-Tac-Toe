import type { Difficulty, GameMode, Mark } from '../types';

interface DossierProps {
  mode: GameMode;
  difficulty: Difficulty | null;
  humanMark: Mark | null;
  robotMark: Mark | null;
  gameNumber: number;
}

function modeCaption(mode: GameMode): string {
  return mode === 'SOLO' ? 'Solo — human vs printer' : 'Duo — passing the press';
}

function diffCaption(difficulty: Difficulty | null): string {
  if (!difficulty) return '—';
  if (difficulty === 'IMPOSSIBLE') return 'Impossible · perfect minimax';
  return difficulty === 'HARD' ? 'Hard · opens & closes lines' : 'Lite · merry randomness';
}

export function Dossier({ mode, difficulty, humanMark, robotMark, gameNumber }: DossierProps) {
  return (
    <dl className="dossier fade-in fade-in--delay-2">
      <dt className="dossier__key">Volume</dt>
      <dd className="dossier__value">
        № {gameNumber.toString().padStart(3, '0')} <small>this session</small>
      </dd>

      <dt className="dossier__key">Edition</dt>
      <dd className="dossier__value">{modeCaption(mode)}</dd>

      <dt className="dossier__key">Opponent</dt>
      <dd className="dossier__value">{diffCaption(difficulty)}</dd>

      {mode === 'SOLO' && humanMark && robotMark && (
        <>
          <dt className="dossier__key">Roles</dt>
          <dd className="dossier__value">
            You · <span className={`accent--${humanMark.toLowerCase()}`}>{humanMark}</span>{' '}
            <small>vs</small> Printer ·{' '}
            <span className={`accent--${robotMark.toLowerCase()}`}>{robotMark}</span>
          </dd>
        </>
      )}
    </dl>
  );
}
