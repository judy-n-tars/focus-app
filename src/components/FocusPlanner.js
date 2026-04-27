import { load, save } from '../lib/storage.js';

export function createFocusPlanner(container, onAddPomodoro) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2><span class="icon">🎯</span> Today's Focus</h2>
    <input type="text" class="focus-input" id="focusInput" placeholder="What's your main goal today?" maxlength="80">
    <button class="add-btn" id="addBtn">Add Focus Goal</button>
    <ul class="focus-list" id="focusList"></ul>
    <div class="stats" id="statsSection" style="display: none;">
      <div class="stat-row">
        <span class="stat-label">Completed</span>
        <span class="stat-value" id="completedCount">0 / 0</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Total Pomodoros</span>
        <span class="stat-value" id="totalPomodoros">0</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill" style="width: 0%"></div>
      </div>
    </div>
  `;
  
  container.appendChild(card);
  
  const focusInput = card.querySelector('#focusInput');
  const addBtn = card.querySelector('#addBtn');
  const focusList = card.querySelector('#focusList');
  const statsSection = card.querySelector('#statsSection');
  const completedCount = card.querySelector('#completedCount');
  const totalPomodoros = card.querySelector('#totalPomodoros');
  const progressFill = card.querySelector('#progressFill');
  
  let data = load();
  
  function render() {
    if (data.focuses.length === 0) {
      focusList.innerHTML = '';
      statsSection.style.display = 'none';
      return;
    }
    
    focusList.innerHTML = data.focuses.map((focus, index) => `
      <li class="focus-item ${focus.completed ? 'completed' : ''}" data-index="${index}">
        <div class="checkbox ${focus.completed ? 'checked' : ''}" onclick="window.focusToggle(${index})"></div>
        <span class="focus-text">${escapeHtml(focus.text)}</span>
        <span class="pomodoro-count">${focus.pomodoros || 0} 🍅</span>
        <button class="delete-btn" onclick="window.focusDelete(${index})" title="Delete goal">✕</button>
      </li>
    `).join('');
    
    statsSection.style.display = 'block';
    completedCount.textContent = `${data.completed} / ${data.focuses.length}`;
    totalPomodoros.textContent = data.totalPomodoros;
    
    const progress = data.focuses.length > 0 
      ? (data.completed / data.focuses.length) * 100 
      : 0;
    progressFill.style.width = `${progress}%`;
  }
  
  function addFocus() {
    const text = focusInput.value.trim();
    if (!text) return;
    
    data.focuses.push({ text, completed: false, pomodoros: 0 });
    focusInput.value = '';
    save(data);
    render();
    onAddPomodoro(); // Trigger timer dropdown update
  }
  
  // Auto-refresh on storage changes (cross-tab sync)
  window.addEventListener('storage', (e) => {
    if (e.key === 'focus-app-data') {
      data = load();
      render();
    }
  });
  
  window.focusToggle = (index) => {
    data.focuses[index].completed = !data.focuses[index].completed;
    data.completed = data.focuses.filter(f => f.completed).length;
    save(data);
    render();
    onAddPomodoro(); // Update timer dropdown
  };
  
  window.focusDelete = (index) => {
    data.focuses.splice(index, 1);
    data.completed = data.focuses.filter(f => f.completed).length;
    save(data);
    render();
    onAddPomodoro(); // Update timer dropdown
  };
  
  window.focusAddPomodoro = (focusIndex) => {
    if (focusIndex >= 0 && focusIndex < data.focuses.length) {
      if (!data.focuses[focusIndex].pomodoros) {
        data.focuses[focusIndex].pomodoros = 0;
      }
      data.focuses[focusIndex].pomodoros++;
      data.totalPomodoros++;
      save(data);
      render();
    } else {
      data.totalPomodoros++;
      save(data);
      render();
    }
  };
  
  addBtn.addEventListener('click', addFocus);
  focusInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addFocus();
  });
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  render();
  
  return {
    getData: () => data,
    refresh: render
  };
}
