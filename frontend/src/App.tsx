import { useCallback, useMemo, useState } from 'react';
import { Board } from './components/Board';
import { Colophon } from './components/Colophon';
import { Dossier } from './components/Dossier';
import { Masthead } from './components/Masthead';
import { MoveLog } from './components/MoveLog';
import { Narrator } from './components/Narrator';
import { Score } from './components/Score';
import { Setup } from './components/Setup';
import { createGame, deleteGame, makeMove, USE_LOCAL } from './api/gameApi';
import type {
  CreateGameRequest,
  GameResponse,
  Mark,
  MoveEntry,
  ScoreBoard,
} from './types';

const CELL_NAMES = [
  'the north-west',
  'the north',
  'the north-east',
  'the west',
  'the centre',
  'the east',
  'the south-west',
  'the south',
  'the south-east',
];

const HUMAN_PHRASES = [
  'measured and quiet',
  'a confident stroke',
  'unhurried',
  'a deliberate hand',
  'pen to paper',
  'firm as a serif',
];

const ROBOT_PHRASES = [
  'the press clicks',
  'a metallic decision',
  'inked, exact',
  'spring released',
  'crisp as type',
  'wheels in motion',
];

const PLAYER_PHRASES = [
  'a hand is heard',
  'paper rustles',
  'next leaf turned',
  'sotto voce',
  'gentle pressure',
  'an even tone',
];

const TODAY = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date());

const EDITION = USE_LOCAL ? 'Demo edition · client press' : 'Live edition · Spring Boot';
const API_NOTE = USE_LOCAL ? 'runs entirely in your browser' : 'served by Spring Boot on :3000';

export function App() {
  const [game, setGame] = useState<GameResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState<ScoreBoard>({ x: 0, o: 0, draws: 0 });
  const [moves, setMoves] = useState<MoveEntry[]>([]);
  const [gameNumber, setGameNumber] = useState(1);

  const onStart = useCallback(async (request: CreateGameRequest) => {
    setBusy(true);
    setError(null);
    try {
      const created = await createGame(request);
      setGame(created);
      const startMoves = collectMoves(emptyCells(), created, null, 0);
      setMoves(reverseChronological(startMoves));
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const onCellClick = useCallback(
    async (cellIndex: number) => {
      if (!game || game.finished || busy) return;
      const previous = game;
      setBusy(true);
      setError(null);
      try {
        const updated = await makeMove(game.id, cellIndex);
        const fresh = collectMoves(previous.cells, updated, cellIndex, moves.length);
        setMoves((prev) => [...reverseChronological(fresh), ...prev]);
        setGame(updated);
        if (updated.finished && !previous.finished) {
          setScore((s) => bumpScore(s, updated));
        }
      } catch (e) {
        setError(toMessage(e));
      } finally {
        setBusy(false);
      }
    },
    [busy, game, moves.length],
  );

  const onNewGame = useCallback(async () => {
    if (game) await deleteGame(game.id).catch(() => undefined);
    setGame(null);
    setMoves([]);
    setError(null);
    setGameNumber((n) => n + 1);
  }, [game]);

  const onResetSession = useCallback(async () => {
    if (game) await deleteGame(game.id).catch(() => undefined);
    setGame(null);
    setMoves([]);
    setScore({ x: 0, o: 0, draws: 0 });
    setGameNumber(1);
    setError(null);
  }, [game]);

  const movesPlayed = useMemo(
    () => (game ? game.cells.filter((c) => c !== 'EMPTY').length : 0),
    [game],
  );

  const hoverMark = useMemo<Exclude<Mark, 'EMPTY'> | null>(() => {
    if (!game || game.finished || busy) return null;
    if (game.mode === 'DUO') return game.currentTurn === 'X' ? 'X' : 'O';
    if (game.humanMark && game.currentTurn === game.humanMark) {
      return game.humanMark === 'X' ? 'X' : 'O';
    }
    return null;
  }, [busy, game]);

  return (
    <main className="stage">
      <Masthead volume={gameNumber} edition={EDITION} todayLabel={TODAY} />

      <div className="spread">
        <span className="spread__divider" aria-hidden="true" />

        <section className="board-column fade-in fade-in--delay-2">
          <span className="column-label">The plate</span>

          {game ? (
            <>
              <Board
                cells={game.cells}
                disabled={busy || game.finished}
                hoverMark={hoverMark}
                onCellClick={onCellClick}
              />
              <div className="caption">
                <span className="caption__ink--x">X — vermilion</span>
                <span className="caption__rule" />
                <span className="caption__ink--o">O — cypress</span>
              </div>
              <Narrator
                status={game.status}
                currentTurn={game.currentTurn}
                mode={game.mode}
                humanMark={game.humanMark}
                movesPlayed={movesPlayed}
              />
              <div className="controls">
                <button
                  type="button"
                  className="btn btn--accent"
                  onClick={onNewGame}
                  disabled={busy}
                >
                  {game.finished ? 'Print another' : 'Abandon this print'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={onResetSession}
                  disabled={busy}
                >
                  Reset the session
                </button>
              </div>
            </>
          ) : (
            <p className="setup__hint" style={{ marginTop: 0 }}>
              Choose your edition, then set the press in motion.
            </p>
          )}

          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}
        </section>

        <aside className="sidebar">
          <span className="column-label">The dossier</span>

          {game ? (
            <>
              <Dossier
                mode={game.mode}
                difficulty={game.difficulty}
                humanMark={game.humanMark}
                robotMark={game.robotMark}
                gameNumber={gameNumber}
              />
              <Score score={score} mode={game.mode} humanMark={game.humanMark} />
              <MoveLog moves={moves} />
            </>
          ) : (
            <Setup onStart={onStart} disabled={busy} />
          )}
        </aside>
      </div>

      <Colophon edition={EDITION} apiNote={API_NOTE} />
    </main>
  );
}

function emptyCells(): Mark[] {
  return Array<Mark>(9).fill('EMPTY');
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error';
}

function bumpScore(prev: ScoreBoard, game: GameResponse): ScoreBoard {
  if (game.status === 'X_WON') return { ...prev, x: prev.x + 1 };
  if (game.status === 'O_WON') return { ...prev, o: prev.o + 1 };
  if (game.status === 'DRAW') return { ...prev, draws: prev.draws + 1 };
  return prev;
}

function pick<T>(items: T[], offset: number): T {
  return items[offset % items.length];
}

function collectMoves(
  prevCells: Mark[],
  next: GameResponse,
  humanCellIndex: number | null,
  startOrdinal: number,
): MoveEntry[] {
  const out: MoveEntry[] = [];
  const newlyFilled: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (prevCells[i] === 'EMPTY' && next.cells[i] !== 'EMPTY') {
      newlyFilled.push(i);
    }
  }
  const ordered =
    humanCellIndex !== null && newlyFilled.includes(humanCellIndex)
      ? [humanCellIndex, ...newlyFilled.filter((i) => i !== humanCellIndex)]
      : newlyFilled;

  let ordinal = startOrdinal;
  for (const cellIndex of ordered) {
    ordinal += 1;
    const mark = next.cells[cellIndex] as Exclude<Mark, 'EMPTY'>;
    const actor: MoveEntry['actor'] =
      next.mode === 'DUO' ? 'player' : mark === next.humanMark ? 'you' : 'robot';
    const pool =
      actor === 'you' ? HUMAN_PHRASES : actor === 'robot' ? ROBOT_PHRASES : PLAYER_PHRASES;
    out.push({
      ordinal,
      mark,
      cellIndex,
      actor,
      phrase: `at ${CELL_NAMES[cellIndex]} — ${pick(pool, ordinal)}`,
    });
  }
  return out;
}

function reverseChronological(entries: MoveEntry[]): MoveEntry[] {
  return entries.slice().sort((a, b) => b.ordinal - a.ordinal);
}
