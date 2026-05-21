import { describe, expect, it } from 'vitest';
import { formatStatusMessage, narratorContent } from './statusMessage';

describe('narratorContent', () => {
  it('declares a draw with a final-move sub', () => {
    const out = narratorContent('DRAW', 'X', 'SOLO', 'X', 9);
    expect(out.result).toBe(true);
    expect(out.head).toMatch(/draw/i);
  });

  it('congratulates the human on a SOLO win', () => {
    const out = narratorContent('X_WON', 'X', 'SOLO', 'X', 5);
    expect(out.result).toBe(true);
    expect(out.head).toMatch(/won/i);
    expect(out.emphasis).toBe('X');
  });

  it('flags a SOLO loss when the winner is not the human', () => {
    const out = narratorContent('O_WON', 'O', 'SOLO', 'X', 7);
    expect(out.result).toBe(true);
    expect(out.head).toMatch(/lost/i);
  });

  it('announces a DUO winner', () => {
    const out = narratorContent('X_WON', 'X', 'DUO', null, 5);
    expect(out.result).toBe(true);
    expect(out.head).toMatch(/X claims/);
  });

  it('marks the robot turn while a SOLO game is in progress', () => {
    const out = narratorContent('IN_PROGRESS', 'O', 'SOLO', 'X', 1);
    expect(out.result).toBe(false);
    expect(out.head).toMatch(/robot/i);
  });

  it('shows whose turn it is in DUO mode', () => {
    const out = narratorContent('IN_PROGRESS', 'X', 'DUO', null, 0);
    expect(out.result).toBe(false);
    expect(out.head).toBe('X to move');
  });
});

describe('formatStatusMessage', () => {
  it('returns the same headline as narratorContent', () => {
    expect(formatStatusMessage('DRAW', 'X', 'SOLO', 'X')).toMatch(/draw/i);
    expect(formatStatusMessage('IN_PROGRESS', 'X', 'DUO', null)).toBe('X to move');
  });
});
