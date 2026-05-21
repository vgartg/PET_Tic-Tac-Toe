import { useState } from 'react';
import type { CreateGameRequest, Difficulty, GameMode, Mark } from '../types';

interface SetupProps {
  onStart: (request: CreateGameRequest) => void;
  disabled: boolean;
}

type HumanMark = Exclude<Mark, 'EMPTY'>;

const MODE_OPTIONS: { value: GameMode; label: string; sub: string }[] = [
  { value: 'SOLO', label: 'Solo', sub: 'against the printer' },
  { value: 'DUO', label: 'Duo', sub: 'hot-seat for two' },
];

const DIFF_OPTIONS: { value: Difficulty; label: string; sub: string }[] = [
  { value: 'LITE', label: 'Lite', sub: 'random and merry' },
  { value: 'HARD', label: 'Hard', sub: 'opens & closes lines' },
  { value: 'IMPOSSIBLE', label: 'Impossible', sub: 'minimax · cannot lose' },
];

const MARK_OPTIONS: { value: HumanMark; label: string; sub: string }[] = [
  { value: 'X', label: 'X', sub: 'you go first' },
  { value: 'O', label: 'O', sub: 'printer goes first' },
];

export function Setup({ onStart, disabled }: SetupProps) {
  const [mode, setMode] = useState<GameMode>('SOLO');
  const [difficulty, setDifficulty] = useState<Difficulty>('HARD');
  const [humanMark, setHumanMark] = useState<HumanMark>('X');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onStart(mode === 'SOLO' ? { mode, difficulty, humanMark } : { mode });
  };

  return (
    <form className="setup fade-in fade-in--delay-3" onSubmit={handleSubmit}>
      <Row label="Mode">
        <Toggle name="mode" value={mode} options={MODE_OPTIONS} onChange={setMode} disabled={disabled} />
      </Row>

      <Row label="Difficulty">
        <Toggle
          name="difficulty"
          value={difficulty}
          options={DIFF_OPTIONS}
          onChange={setDifficulty}
          disabled={disabled || mode === 'DUO'}
        />
      </Row>

      <Row label="Your mark">
        <Toggle
          name="mark"
          value={humanMark}
          options={MARK_OPTIONS}
          onChange={setHumanMark}
          disabled={disabled || mode === 'DUO'}
        />
      </Row>

      <p className="setup__hint">
        {mode === 'SOLO'
          ? 'A single human, one stubborn printer, and nine squares of warm paper.'
          : 'Pass the press between two players — first to align three takes the day.'}
      </p>

      <div className="controls">
        <button type="submit" className="btn btn--accent" disabled={disabled}>
          Set the press
        </button>
      </div>
    </form>
  );
}

interface RowProps {
  label: string;
  children: React.ReactNode;
}

function Row({ label, children }: RowProps) {
  return (
    <div className="setup__row">
      <span className="setup__label">{label}</span>
      <div>{children}</div>
    </div>
  );
}

interface ToggleProps<T extends string> {
  name: string;
  value: T;
  options: { value: T; label: string; sub: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}

function Toggle<T extends string>({ name, value, options, onChange, disabled }: ToggleProps<T>) {
  return (
    <div className={`toggle${disabled ? ' toggle--disabled' : ''}`}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`toggle__option${disabled ? ' toggle__option--disabled' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={disabled}
          />
          <span className="toggle__option-label">
            {opt.label} <small>{opt.sub}</small>
          </span>
        </label>
      ))}
    </div>
  );
}
