# 🍂 Focus Dashboard

A unified Pomodoro timer and daily focus planner with warm autumn colors. Plan your goals, track your sessions, and see your progress — all in one place.

## Features

- **Daily Focus Goals** — Add up to 3 main goals for the day
- **Pomodoro Timer** — 25-min focus sessions, 5-min short breaks, 15-min long breaks
- **Goal Tracking** — Select which goal you're working on before starting a session
- **Progress Dashboard** — See completion rate and total sessions
- **Auto-Sync** — Timer sessions automatically count toward selected goals
- **Daily Reset** — Goals reset automatically at midnight
- **Local Storage** — All data stays on your device

## Live Demo

[**Open Focus Dashboard**](https://judy-n-tars.github.io/focus-app)

## Quick Start

### Option 1: Open Locally
```bash
open index.html
```

### Option 2: Local Server
```bash
cd focus-app
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: GitHub Pages (Live)
Visit: https://judy-n-tars.github.io/focus-app

## Project Structure

```
focus-app/
├── index.html              # Main entry point
├── src/
│   ├── main.js             # App initialization
│   ├── lib/
│   │   ├── storage.js      # localStorage utilities
│   │   └── timer.js        # Timer logic and modes
│   ├── components/
│   │   ├── FocusPlanner.js    # Goal management
│   │   ├── PomodoroTimer.js   # Timer component
│   │   └── ProgressPanel.js   # Progress visualization
│   └── styles/
│       ├── theme.css       # Color palette and variables
│       └── main.css        # Component styles
├── tests/
│   ├── setup.js            # Test configuration
│   ├── storage.test.js     # Storage tests
│   └── timer.test.js       # Timer logic tests
├── package.json
├── vitest.config.js
└── .github/workflows/deploy.yml
```

## Development

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test           # Run once
npm run test:watch # Watch mode
```

### Test Coverage
```bash
npm run test:coverage
```

## Deployment

This project is configured for GitHub Pages deployment:

```bash
# Enable GitHub Pages (one-time setup)
gh repo edit --enable-gh-pages

# Deploy to GitHub Pages
git push origin main
```

The app will be available at: `https://<username>.github.io/focus-app`

GitHub Actions automatically deploys on every push to `main`.

## Tech Stack

- **Vanilla JavaScript** — ES6 modules, no framework
- **CSS3** — Custom properties, no preprocessor
- **Vitest** — Unit testing framework
- **jsdom** — Browser environment for tests

## Testing

All core logic is tested:
- Timer modes and transitions (18 tests)
- Storage operations and daily reset (7 tests)
- **Total: 25 tests**

Run tests with `npm test`. All tests must pass before deployment.

## Design Principles

1. **No god files** — All files under 300 lines
2. **Modular components** — Separate concerns (timer, planner, progress)
3. **Production-ready** — Tested, documented, deployable
4. **Warm autumn theme** — Consistent color palette throughout

## License

MIT
