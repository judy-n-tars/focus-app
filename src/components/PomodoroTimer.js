import { MODES, formatTime, getNextMode, playNotification } from '../lib/timer.js';
import { load } from '../lib/storage.js';

export function createPomodoroTimer(container, onSessionComplete) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2><span class="icon">🍅</span> Pomodoro Timer</h2>
    <div class="mode-indicators">
      <div class="mode-dot active" id="dot-work"></div>
      <div class="mode-dot" id="dot-short"></div>
      <div class="mode-dot" id="dot-long"></div>
    </div>
    <div class="timer-display">
      <div class="time" id="timer">25:00</div>
      <div class="status" id="status">Time to focus</div>
    </div>
    <div class="controls">
      <button class="btn-primary" id="startBtn">Start</button>
      <button class="btn-secondary" id="resetBtn">Reset</button>
    </div>
    <div class="focus-selector">
      <label for="focusSelect">Working on:</label>
      <select class="focus-select" id="focusSelect">
        <option value="-1">General / No specific focus</option>
      </select>
    </div>
  `;
  
  container.appendChild(card);
  
  const timerEl = card.querySelector('#timer');
  const statusEl = card.querySelector('#status');
  const startBtn = card.querySelector('#startBtn');
  const resetBtn = card.querySelector('#resetBtn');
  const focusSelect = card.querySelector('#focusSelect');
  const dots = {
    work: card.querySelector('#dot-work'),
    short: card.querySelector('#dot-short'),
    long: card.querySelector('#dot-long')
  };
  
  let currentMode = 'work';
  let timeLeft = MODES.work.time;
  let isRunning = false;
  let interval = null;
  let completedSessions = 0;
  
  function updateDisplay() {
    timerEl.textContent = formatTime(timeLeft);
    statusEl.textContent = MODES[currentMode].label;
  }
  
  function updateDots() {
    dots.work.classList.toggle('active', currentMode === 'work');
    dots.short.classList.toggle('active', currentMode === 'shortBreak');
    dots.long.classList.toggle('active', currentMode === 'longBreak');
  }
  
  function switchMode(mode) {
    currentMode = mode;
    timeLeft = MODES[mode].time;
    updateDisplay();
    updateDots();
  }
  
  function completeSession() {
    if (currentMode === 'work') {
      completedSessions++;
      const focusIndex = parseInt(focusSelect.value);
      onSessionComplete(focusIndex);
      switchMode(getNextMode(currentMode, completedSessions));
    } else {
      switchMode('work');
    }
    
    isRunning = false;
    startBtn.textContent = 'Start';
    playNotification();
  }
  
  function toggleTimer() {
    if (isRunning) {
      clearInterval(interval);
      isRunning = false;
      startBtn.textContent = 'Start';
    } else {
      isRunning = true;
      startBtn.textContent = 'Pause';
      interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
          completeSession();
        }
      }, 1000);
    }
  }
  
  function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    startBtn.textContent = 'Start';
    timeLeft = MODES[currentMode].time;
    updateDisplay();
  }
  
  startBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  // Auto-refresh focus options on storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'focus-app-data') {
      const data = load();
      updateFocusOptions(data.focuses);
    }
  });
  
  updateDisplay();
  updateDots();
  
  return {
    updateFocusOptions: (focuses) => {
      focusSelect.innerHTML = '<option value="-1">General / No specific focus</option>' +
        focuses.map((f, i) => `<option value="${i}">${escapeHtml(f.text)}</option>`).join('');
    },
    getSelectedFocus: () => parseInt(focusSelect.value)
  };
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
