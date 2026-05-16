import { describe, expect, it } from 'vitest';
import { formatStatusMessage } from './statusMessage';

describe('formatStatusMessage', () => {
  it('reports a draw', () => {
    expect(formatStatusMessage('DRAW', 'X', 'SOLO', 'X')).toBe("It's a draw!");
  });

  it('congratulates the human on a SOLO win', () => {
    expect(formatStatusMessage('X_WON', 'X', 'SOLO', 'X')).toBe('You won! Good job');
  });

  it('announces a SOLO loss when the human does not match the winner', () => {
    expect(formatStatusMessage('O_WON', 'O', 'SOLO', 'X')).toBe('Oops... you lost');
  });

  it('uses neutral phrasing in DUO mode', () => {
    expect(formatStatusMessage('X_WON', 'X', 'DUO', null)).toBe('Player X wins!');
  });

  it('signals the robot is thinking when it is the robot turn in SOLO', () => {
    expect(formatStatusMessage('IN_PROGRESS', 'O', 'SOLO', 'X')).toBe('Robot is thinking...');
  });

  it('shows the current turn while the game is in progress', () => {
    expect(formatStatusMessage('IN_PROGRESS', 'X', 'DUO', null)).toBe('Turn: X');
  });
});
