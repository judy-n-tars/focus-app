export const MODES = {
  work: { time: 25 * 60, label: 'Time to focus' },
  shortBreak: { time: 5 * 60, label: 'Short break' },
  longBreak: { time: 15 * 60, label: 'Long break' }
};

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getNextMode(currentMode, completedSessions) {
  if (currentMode === 'work') {
    return completedSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
  }
  return 'work';
}

export function shouldCompleteSession(currentMode, completedSessions) {
  return currentMode === 'work';
}

export function playNotification() {
  try {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    
    oscillator.connect(gain);
    gain.connect(audio.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audio.currentTime);
    
    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + 0.3);
  } catch (e) {
    console.log('Audio not supported');
  }
}
