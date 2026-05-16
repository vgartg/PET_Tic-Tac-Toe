import { useCallback, useState } from 'react';
import { Board } from './components/Board';
import { GameSetup } from './components/GameSetup';
import { StatusBanner } from './components/StatusBanner';
import { createGame, deleteGame, makeMove } from './api/gameApi';
import type { CreateGameRequest, GameResponse } from './types';

export function App() {
  const [game, setGame] = useState<GameResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const startGame = useCallback(async (request: CreateGameRequest) => {
    setBusy(true);
    setError(null);
    try {
      const created = await createGame(request);
      setGame(created);
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const handleCellClick = useCallback(
    async (cellIndex: number) => {
      if (!game || game.finished) return;
      setBusy(true);
      setError(null);
      try {
        const updated = await makeMove(game.id, cellIndex);
        setGame(updated);
      } catch (e) {
        setError(toMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [game],
  );

  const handleReset = useCallback(async () => {
    if (game) {
      await deleteGame(game.id).catch(() => undefined);
    }
    setGame(null);
    setError(null);
  }, [game]);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Tic-Tac-Toe</h1>
      </header>

      {!game && <GameSetup onStart={startGame} disabled={busy} />}

      {game && (
        <section className="game">
          <StatusBanner
            status={game.status}
            currentTurn={game.currentTurn}
            mode={game.mode}
            humanMark={game.humanMark}
          />
          <Board
            cells={game.cells}
            disabled={busy || game.finished}
            onCellClick={handleCellClick}
          />
          <button type="button" className="button" onClick={handleReset}>
            New game
          </button>
        </section>
      )}

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}
    </main>
  );
}

function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}
