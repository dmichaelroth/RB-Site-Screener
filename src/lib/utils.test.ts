import { describe, it, expect } from 'vitest';
import { formatNumber, getScoreColor } from './utils';

describe('formatNumber', () => {
  it('returns "N/A" for undefined', () => {
    expect(formatNumber(undefined)).toBe('N/A');
  });

  it('formats number with default decimals', () => {
    expect(formatNumber(1234)).toBe('1,234');
  });

  it('formats number with specified decimals', () => {
    expect(formatNumber(1234.56, 2)).toBe('1,234.56');
  });
});

describe('getScoreColor', () => {
  it('returns correct color for high score', () => {
    expect(getScoreColor(85)).toBe('bg-emerald-500');
  });

  it('returns correct color for medium score', () => {
    expect(getScoreColor(55)).toBe('bg-yellow-500');
  });

  it('returns correct color for low score', () => {
    expect(getScoreColor(25)).toBe('bg-red-500');
  });
});
