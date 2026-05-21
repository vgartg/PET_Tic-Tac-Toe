import type { CSSProperties } from 'react';
import type { Mark as MarkValue } from '../types';

interface MarkProps {
  value: Exclude<MarkValue, 'EMPTY'>;
  variant?: 'placed' | 'ghost';
  className?: string;
}

export function Mark({ value, variant = 'placed', className }: MarkProps) {
  const cls = [
    'mark',
    value === 'X' ? 'mark--x' : 'mark--o',
    variant === 'placed' ? 'mark--placed' : 'mark--ghost',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (value === 'X') {
    const style = { '--mark-len': 150 } as CSSProperties;
    return (
      <svg
        className={cls}
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
        style={style}
      >
        <path
          className="mark-stroke mark-stroke--first"
          d="M18 18 L82 82"
          strokeWidth="11"
        />
        <path
          className="mark-stroke mark-stroke--second"
          d="M82 18 L18 82"
          strokeWidth="11"
        />
      </svg>
    );
  }

  const style = { '--mark-len': 230 } as CSSProperties;
  return (
    <svg
      className={cls}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <path
        className="mark-stroke"
        d="M50 14 C70 14 86 30 86 50 C86 70 70 86 50 86 C30 86 14 70 14 50 C14 30 30 14 50 14 Z"
        strokeWidth="10"
      />
    </svg>
  );
}
