import { beforeEach } from 'vitest';

// Polyfill localStorage for jsdom
if (typeof window !== 'undefined' && !window.localStorage) {
  const store = {};
  window.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

beforeEach(() => {
  if (typeof localStorage?.clear === 'function') {
    localStorage.clear();
  }
});
