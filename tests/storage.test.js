import { describe, it, expect, beforeEach, vi } from 'vitest';
import { load, save, getTodayKey, resetIfNewDay } from '../src/lib/storage.js';

// Mock localStorage for tests
const mockStorage = {};

vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); })
});

describe('Storage', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
  });

  describe('getTodayKey', () => {
    it('returns current date as string', () => {
      const today = getTodayKey();
      expect(typeof today).toBe('string');
      expect(today).toBe(new Date().toDateString());
    });
  });

  describe('load', () => {
    it('returns default data when no saved data exists', () => {
      const data = load();
      expect(data).toEqual({
        date: getTodayKey(),
        focuses: [],
        completed: 0,
        totalPomodoros: 0
      });
    });

    it('returns saved data when it exists for today', () => {
      const testData = {
        date: getTodayKey(),
        focuses: [{ text: 'Test goal', completed: false, pomodoros: 0 }],
        completed: 0,
        totalPomodoros: 1
      };
      save(testData);
      
      const loaded = load();
      expect(loaded).toEqual(testData);
    });

    it('returns default data when saved data is from yesterday', () => {
      const oldData = {
        date: 'Mon Jan 01 2024',
        focuses: [{ text: 'Old goal', completed: true, pomodoros: 5 }],
        completed: 1,
        totalPomodoros: 5
      };
      localStorage.setItem('focus-app-data', JSON.stringify(oldData));
      
      const loaded = load();
      expect(loaded.date).toBe(getTodayKey());
      expect(loaded.focuses).toEqual([]);
      expect(loaded.completed).toBe(0);
    });
  });

  describe('save', () => {
    it('saves data to localStorage', () => {
      const testData = {
        date: getTodayKey(),
        focuses: [],
        completed: 0,
        totalPomodoros: 0
      };
      save(testData);
      
      const stored = JSON.parse(mockStorage['focus-app-data']);
      expect(stored).toEqual(testData);
    });
  });

  describe('resetIfNewDay', () => {
    it('returns same data if date matches today', () => {
      const data = {
        date: getTodayKey(),
        focuses: [{ text: 'Goal', completed: false, pomodoros: 0 }],
        completed: 0,
        totalPomodoros: 1
      };
      
      const result = resetIfNewDay(data);
      expect(result).toBe(data);
    });

    it('returns reset data if date is different', () => {
      const oldData = {
        date: 'Mon Jan 01 2024',
        focuses: [{ text: 'Old goal', completed: true, pomodoros: 5 }],
        completed: 1,
        totalPomodoros: 5
      };
      
      const result = resetIfNewDay(oldData);
      expect(result).toEqual({
        date: getTodayKey(),
        focuses: [],
        completed: 0,
        totalPomodoros: 0
      });
    });
  });
});
