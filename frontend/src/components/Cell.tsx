import type { Mark } from '../types';

interface CellProps {
  index: number;
  value: Mark;
  disabled: boolean;
  onClick: (index: number) => void;
}

export function Cell({ index, value, disabled, onClick }: CellProps) {
  const isEmpty = value === 'EMPTY';
  const label = isEmpty ? '' : value;
  const className = `cell${isEmpty ? '' : ` cell--${value.toLowerCase()}`}`;

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || !isEmpty}
      onClick={() => onClick(index)}
      aria-label={isEmpty ? `Empty cell ${index + 1}` : `Cell ${index + 1}: ${value}`}
    >
      {label}
    </button>
  );
}
