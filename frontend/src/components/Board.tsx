import type { Mark } from '../types';
import { WINNING_LINES } from '../types';
import { Cell } from './Cell';
import { WinLine } from './WinLine';

interface BoardProps {
  cells: Mark[];
  disabled: boolean;
  hoverMark: Exclude<Mark, 'EMPTY'> | null;
  onCellClick: (index: number) => void;
}

function detectWinningLine(cells: Mark[]): readonly [number, number, number] | null {
  for (const line of WINNING_LINES) {
    const a = cells[line[0]];
    if (a !== 'EMPTY' && a === cells[line[1]] && a === cells[line[2]]) return line;
  }
  return null;
}

export function Board({ cells, disabled, hoverMark, onCellClick }: BoardProps) {
  const winningLine = detectWinningLine(cells);
  const winningSet = new Set<number>(winningLine ?? []);

  return (
    <div className="board-frame fade-in fade-in--delay-3">
      <span className="board-frame__corner board-frame__corner--tl" aria-hidden="true" />
      <span className="board-frame__corner board-frame__corner--tr" aria-hidden="true" />
      <span className="board-frame__corner board-frame__corner--bl" aria-hidden="true" />
      <span className="board-frame__corner board-frame__corner--br" aria-hidden="true" />
      <div className="board" role="grid" aria-label="Tic-Tac-Toe board">
        {cells.map((value, index) => (
          <Cell
            key={index}
            index={index}
            value={value}
            isWinning={winningSet.has(index)}
            hoverMark={hoverMark}
            disabled={disabled}
            onClick={onCellClick}
          />
        ))}
        <WinLine line={winningLine} />
      </div>
    </div>
  );
}
