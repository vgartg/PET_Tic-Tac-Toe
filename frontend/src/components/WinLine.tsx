import type { CSSProperties } from 'react';

interface WinLineProps {
  line: readonly [number, number, number] | null;
}

function centerOf(index: number): { x: number; y: number } {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return { x: col * 100 + 50, y: row * 100 + 50 };
}

export function WinLine({ line }: WinLineProps) {
  if (!line) return null;
  const start = centerOf(line[0]);
  const end = centerOf(line[2]);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const style = { '--line-len': length } as CSSProperties;

  return (
    <svg
      className="win-line"
      viewBox="0 0 300 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="win-line__path"
        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
        style={style}
      />
    </svg>
  );
}
