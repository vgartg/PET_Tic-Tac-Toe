import { useState } from 'react';
import type { CreateGameRequest, Difficulty, GameMode, Mark } from '../types';

interface GameSetupProps {
  onStart: (request: CreateGameRequest) => void;
  disabled: boolean;
}

export function GameSetup({ onStart, disabled }: GameSetupProps) {
  const [mode, setMode] = useState<GameMode>('SOLO');
  const [difficulty, setDifficulty] = useState<Difficulty>('HARD');
  const [humanMark, setHumanMark] = useState<Exclude<Mark, 'EMPTY'>>('X');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onStart(
      mode === 'SOLO'
        ? { mode, difficulty, humanMark }
        : { mode },
    );
  };

  return (
    <form className="setup" onSubmit={handleSubmit}>
      <fieldset className="setup__group" disabled={disabled}>
        <legend>Mode</legend>
        <label>
          <input
            type="radio"
            name="mode"
            value="SOLO"
            checked={mode === 'SOLO'}
            onChange={() => setMode('SOLO')}
          />
          Solo (vs robot)
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="DUO"
            checked={mode === 'DUO'}
            onChange={() => setMode('DUO')}
          />
          Duo (two players)
        </label>
      </fieldset>

      {mode === 'SOLO' && (
        <>
          <fieldset className="setup__group" disabled={disabled}>
            <legend>Difficulty</legend>
            <label>
              <input
                type="radio"
                name="difficulty"
                value="LITE"
                checked={difficulty === 'LITE'}
                onChange={() => setDifficulty('LITE')}
              />
              Lite (random)
            </label>
            <label>
              <input
                type="radio"
                name="difficulty"
                value="HARD"
                checked={difficulty === 'HARD'}
                onChange={() => setDifficulty('HARD')}
              />
              Hard
            </label>
          </fieldset>

          <fieldset className="setup__group" disabled={disabled}>
            <legend>Your mark</legend>
            <label>
              <input
                type="radio"
                name="mark"
                value="X"
                checked={humanMark === 'X'}
                onChange={() => setHumanMark('X')}
              />
              X (you go first)
            </label>
            <label>
              <input
                type="radio"
                name="mark"
                value="O"
                checked={humanMark === 'O'}
                onChange={() => setHumanMark('O')}
              />
              O (robot goes first)
            </label>
          </fieldset>
        </>
      )}

      <button type="submit" className="button button--primary" disabled={disabled}>
        Start game
      </button>
    </form>
  );
}
