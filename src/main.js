import { load } from './lib/storage.js';
import { createFocusPlanner } from './components/FocusPlanner.js';
import { createPomodoroTimer } from './components/PomodoroTimer.js';
import { createProgressPanel } from './components/ProgressPanel.js';

function init() {
  const plannerContainer = document.getElementById('planner-container');
  const timerContainer = document.getElementById('timer-container');
  const progressContainer = document.getElementById('progress-container');
  const currentDate = document.getElementById('currentDate');
  
  // Set date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = new Date().toLocaleDateString('en-US', options);
  
  // Initialize components
  const planner = createFocusPlanner(plannerContainer, () => {
    const data = planner.getData();
    timer.updateFocusOptions(data.focuses);
  });
  
  const timer = createPomodoroTimer(timerContainer, (focusIndex) => {
    window.focusAddPomodoro(focusIndex);
    const data = planner.getData();
    progress.render(data);
  });
  
  const progress = createProgressPanel(progressContainer);
  
  // Initial render
  const data = load();
  progress.render(data);
}

init();
