import type { Mark as MarkValue } from '../types';
import { Mark } from './Mark';

interface CellProps {
  index: number;
  value: MarkValue;
  isWinning: boolean;
  hoverMark: Exclude<MarkValue, 'EMPTY'> | null;
  disabled: boolean;
  onClick: (index: number) => void;
}

export function Cell({ index, value, isWinning, hoverMark, disabled, onClick }: CellProps) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const isEmpty = value === 'EMPTY';

  const cls = ['cell'];
  if (row > 0) cls.push(`cell--row-${row}`);
  if (col > 0) cls.push(`cell--col-${col}`);
  if (isWinning) cls.push('cell--win');

  return (
    <button
      type="button"
      className={cls.join(' ')}
      disabled={disabled || !isEmpty}
      onClick={() => onClick(index)}
      aria-label={isEmpty ? `Cell ${index + 1}, empty` : `Cell ${index + 1}, ${value}`}
    >
      <span className="cell__index">№{(index + 1).toString().padStart(2, '0')}</span>
      {!isEmpty && <Mark value={value as Exclude<MarkValue, 'EMPTY'>} className="cell__mark" />}
      {isEmpty && hoverMark && (
        <Mark value={hoverMark} variant="ghost" className="cell__ghost" />
      )}
    </button>
  );
}
