import { describe, it, expect } from 'vitest';
import { weeksUntil, parseHours, avgSpeed } from '../utils/index.js';

describe('weeksUntil', () => {
  it('returns a number between 2 and 20 for a future race date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 70); // 10 weeks out
    const weeks = weeksUntil(future.toISOString().split('T')[0]);
    expect(weeks).toBeGreaterThanOrEqual(2);
    expect(weeks).toBeLessThanOrEqual(20);
  });

  it('returns 0 for a past date', () => {
    expect(weeksUntil('2020-01-01')).toBe(0);
  });
});

describe('parseHours', () => {
  it('parses "4:30" to 4.5', () => {
    expect(parseHours('4:30')).toBe(4.5);
  });

  it('parses "5:00" to 5.0', () => {
    expect(parseHours('5:00')).toBe(5.0);
  });

  it('returns 0 for empty string', () => {
    expect(parseHours('')).toBe(0);
  });
});

describe('avgSpeed', () => {
  it('computes avg speed for 106 km in 4:30', () => {
    expect(avgSpeed(106, '4:30')).toBe('23.6');
  });
});
