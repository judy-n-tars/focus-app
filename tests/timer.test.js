import { describe, it, expect } from 'vitest';
import { MODES, formatTime, getNextMode, shouldCompleteSession } from '../src/lib/timer.js';

describe('Timer', () => {
  describe('MODES', () => {
    it('has correct work duration (25 minutes)', () => {
      expect(MODES.work.time).toBe(25 * 60);
      expect(MODES.work.label).toBe('Time to focus');
    });

    it('has correct short break duration (5 minutes)', () => {
      expect(MODES.shortBreak.time).toBe(5 * 60);
      expect(MODES.shortBreak.label).toBe('Short break');
    });

    it('has correct long break duration (15 minutes)', () => {
      expect(MODES.longBreak.time).toBe(15 * 60);
      expect(MODES.longBreak.label).toBe('Long break');
    });
  });

  describe('formatTime', () => {
    it('formats 25 minutes correctly', () => {
      expect(formatTime(25 * 60)).toBe('25:00');
    });

    it('formats 5 minutes correctly', () => {
      expect(formatTime(5 * 60)).toBe('05:00');
    });

    it('formats seconds with leading zero', () => {
      expect(formatTime(125)).toBe('02:05');
    });

    it('formats zero correctly', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('formats single digit minutes', () => {
      expect(formatTime(305)).toBe('05:05');
    });
  });

  describe('getNextMode', () => {
    it('returns short break after work session 1', () => {
      expect(getNextMode('work', 1)).toBe('shortBreak');
    });

    it('returns short break after work session 2', () => {
      expect(getNextMode('work', 2)).toBe('shortBreak');
    });

    it('returns short break after work session 3', () => {
      expect(getNextMode('work', 3)).toBe('shortBreak');
    });

    it('returns long break after work session 4', () => {
      expect(getNextMode('work', 4)).toBe('longBreak');
    });

    it('returns long break after work session 8', () => {
      expect(getNextMode('work', 8)).toBe('longBreak');
    });

    it('returns work after short break', () => {
      expect(getNextMode('shortBreak', 1)).toBe('work');
    });

    it('returns work after long break', () => {
      expect(getNextMode('longBreak', 4)).toBe('work');
    });
  });

  describe('shouldCompleteSession', () => {
    it('returns true for work mode', () => {
      expect(shouldCompleteSession('work', 1)).toBe(true);
    });

    it('returns false for short break', () => {
      expect(shouldCompleteSession('shortBreak', 1)).toBe(false);
    });

    it('returns false for long break', () => {
      expect(shouldCompleteSession('longBreak', 4)).toBe(false);
    });
  });
});
