import type { Mark } from '../types';
import { Cell } from './Cell';

interface BoardProps {
  cells: Mark[];
  disabled: boolean;
  onCellClick: (index: number) => void;
}

export function Board({ cells, disabled, onCellClick }: BoardProps) {
  return (
    <div className="board" role="grid" aria-label="Tic-Tac-Toe board">
      {cells.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          disabled={disabled}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
}
