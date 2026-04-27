import { load } from '../lib/storage.js';

export function createProgressPanel(container) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2><span class="icon">📊</span> Today's Progress</h2>
    <div id="progressContent">
      <div class="empty-state">
        <div style="font-size: 48px; margin-bottom: 12px;">🍁</div>
        <p>Add your focus goals to start tracking</p>
      </div>
    </div>
  `;
  
  container.appendChild(card);
  
  const progressContent = card.querySelector('#progressContent');
  
  function render(data) {
    if (data.focuses.length === 0) {
      progressContent.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 48px; margin-bottom: 12px;">🍁</div>
          <p>Add your focus goals to start tracking</p>
        </div>
      `;
      return;
    }
    
    const progress = (data.completed / data.focuses.length) * 100;
    const emoji = getProgressEmoji(progress);
    
    progressContent.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 56px; margin-bottom: 16px;">${emoji}</div>
        <div style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 8px;">
          ${Math.round(progress)}% Complete
        </div>
        <div style="color: var(--text-secondary); font-size: 14px;">
          ${data.completed} of ${data.focuses.length} goals completed
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border-color);">
          <div style="color: var(--accent-primary); font-size: 32px; font-weight: 700;">${data.totalPomodoros}</div>
          <div style="color: var(--text-secondary); font-size: 14px;">Pomodoro sessions today</div>
        </div>
      </div>
    `;
  }
  
  function getProgressEmoji(progress) {
    if (progress === 0) return '🌱';
    if (progress < 33) return '🌿';
    if (progress < 66) return '🍂';
    if (progress < 100) return '🍁';
    return '🎉';
  }
  
  // Auto-refresh on storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'focus-app-data') {
      const data = load();
      render(data);
    }
  });
  
  return { render };
}
