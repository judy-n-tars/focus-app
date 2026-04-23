const STORAGE_KEY = 'focus-app-data';

// Use window.localStorage when available (browser/tests), fallback to global
const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return null;
};

export function getTodayKey() {
  return new Date().toDateString();
}

export function load() {
  const storage = getStorage();
  const saved = storage?.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.date === getTodayKey()) {
      return parsed;
    }
  }
  
  return {
    date: getTodayKey(),
    focuses: [],
    completed: 0,
    totalPomodoros: 0
  };
}

export function save(data) {
  const storage = getStorage();
  storage?.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetIfNewDay(data) {
  if (data.date !== getTodayKey()) {
    return {
      date: getTodayKey(),
      focuses: [],
      completed: 0,
      totalPomodoros: 0
    };
  }
  return data;
}
