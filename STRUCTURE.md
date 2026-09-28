# Project Structure & Configuration Guide

## Directory Structure

```
react-sample-poc-project/
│
├── .env                           # Local development environment variables
├── .env.example                   # Template for environment variables
├── .env.production                # Production environment variables
│
├── .vscode/
│   ├── settings.json              # VSCode workspace settings (ESLint, Prettier)
│   └── extensions.json            # Recommended VSCode extensions
│
├── .github/
│   └── workflows/
│       └── build.yml              # GitHub Actions CI/CD pipeline
│
├── public/
│   └── index.html                 # HTML entry point
│
├── src/
│   ├── components/                # Reusable React components
│   │   ├── Header/
│   │   │   ├── Header.jsx         # Header component
│   │   │   ├── Header.css         # Component styles
│   │   │   └── Header.test.jsx    # Component tests (add these)
│   │   └── BooksList/
│   │       ├── BooksList.jsx
│   │       ├── BooksList.css
│   │       └── BooksList.test.jsx
│   │
│   ├── utils/
│   │   ├── api.js                 # API client configuration
│   │   └── helpers.js             # Utility functions (add as needed)
│   │
│   ├── __tests__/                 # Centralized tests (optional)
│   │   └── setup.test.js
│   │
│   ├── App.jsx                    # Main App component
│   ├── App.css                    # App styles
│   ├── index.js                   # React app entry point
│   ├── index.css                  # Global styles
│   └── setupTests.js              # Jest configuration
│
├── .eslintrc.json                 # ESLint rules
├── .prettierrc.json               # Prettier formatting rules
├── .prettierignore                # Files to skip formatting
├── .gitignore                     # Git ignore patterns
│
├── babel.config.js                # JavaScript transpilation
├── jest.config.js                 # Testing framework configuration
├── tailwind.config.js             # Tailwind CSS customization
├── postcss.config.js              # CSS processing
│
├── package.json                   # Project metadata & npm scripts
├── package-lock.json              # Locked dependency versions
│
├── BUILD.md                       # Build ecosystem documentation
├── STRUCTURE.md                   # This file
├── README.md                      # Project overview
└── INSTALL.md                     # Installation instructions
```

---

## Configuration Files Overview

### Root Configuration Files

| File | Purpose | Edit When |
|------|---------|-----------|
| `package.json` | Dependencies, scripts, metadata | Adding packages, changing build scripts |
| `.env` | Local dev environment variables | Changing API URLs, enabling debug mode |
| `.env.production` | Production environment variables | Preparing for deployment |
| `.eslintrc.json` | JavaScript linting rules | Changing code standards |
| `.prettierrc.json` | Code formatting rules | Changing code style |
| `.gitignore` | Git ignore patterns | Adding build artifacts or output folders |

### Build & Transpilation

| File | Purpose | Key Config |
|------|---------|-----------|
| `babel.config.js` | Transpile modern JS to ES5 | `@babel/preset-env`, `@babel/preset-react` |
| `jest.config.js` | Testing framework | `testEnvironment: 'jsdom'`, coverage thresholds |
| `postcss.config.js` | CSS processing | Tailwind CSS, Autoprefixer |
| `tailwind.config.js` | Tailwind CSS theme | Custom colors, breakpoints |

### Development Tools

| File | Purpose | Usage |
|------|---------|-------|
| `.vscode/settings.json` | VSCode workspace settings | Auto-format on save, ESLint integration |
| `.vscode/extensions.json` | Recommended extensions | ESLint, Prettier, Tailwind, React snippets |
| `.prettierignore` | Files to skip formatting | node_modules, build, dist |

### CI/CD Pipeline

| File | Purpose | Triggers |
|------|---------|----------|
| `.github/workflows/build.yml` | Automated testing & building | Push to main/develop, Pull requests |

---

## Environment Variables Configuration

### File Hierarchy
1. `.env.example` - Template (safe to commit)
2. `.env` - Local development (git-ignored)
3. `.env.production` - Production values (git-ignored)

### How They Load
- `npm start` → loads `.env` + `.env.local`
- `npm run build` → loads `.env.production` + `.env.production.local`
- `npm test` → loads `.env.test` + `.env.test.local`

### Exposing Variables to Frontend
Only variables prefixed with `REACT_APP_` are available in the browser:

```javascript
// ✅ Works
const apiUrl = process.env.REACT_APP_API_URL;

// ❌ Doesn't work (not exposed)
const secret = process.env.SECRET_KEY;
```

### Common Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_ENABLE_DEBUG_MODE=false
REACT_APP_ENABLE_LOGGING=true

# Build Info
REACT_APP_VERSION=0.1.0
REACT_APP_BUILD_DATE=2024-01-01
```

---

## NPM Scripts Reference

| Script | Command | Purpose |
|--------|---------|---------|
| `npm start` | `react-scripts start` | Start dev server with hot reload |
| `npm run build` | `react-scripts build` | Create production build |
| `npm test` | `react-scripts test` | Run tests in watch mode |
| `npm run test:coverage` | `react-scripts test --coverage` | Generate coverage report |
| `npm run lint` | `eslint src --ext .js,.jsx` | Check code quality |
| `npm run lint:fix` | `eslint ... --fix` | Auto-fix linting issues |
| `npm run format` | `prettier --write src/**` | Format all code |
| `npm run format:check` | `prettier --check src/**` | Check formatting |
| `npm run eject` | `react-scripts eject` | ⚠️ Exposes CRA config (irreversible) |

---

## Code Quality Workflow

### Before Committing

```bash
# 1. Format code
npm run format

# 2. Check linting
npm run lint

# 3. Run tests
npm run test:coverage

# 4. Build check
npm run build
```

### Quick Command
```bash
npm run lint:fix && npm run format && npm run test:coverage
```

---

## Common Configuration Tasks

### Adding a New Environment Variable

1. Add to `.env.example`:
   ```env
   REACT_APP_NEW_VAR=default_value
   ```

2. Add to `.env`:
   ```env
   REACT_APP_NEW_VAR=local_value
   ```

3. Use in code:
   ```javascript
   const value = process.env.REACT_APP_NEW_VAR;
   ```

4. Restart dev server for changes to take effect

### Customizing ESLint Rules

Edit `.eslintrc.json`:

```json
{
  "rules": {
    "no-console": "off",          // Allow console.log
    "prefer-const": "error",      // Require const
    "eqeqeq": "warn"              // Warn on == usage
  }
}
```

### Changing Code Style (Prettier)

Edit `.prettierrc.json`:

```json
{
  "printWidth": 120,              // Wider lines
  "tabWidth": 4,                  // Larger indent
  "singleQuote": false,           // Use double quotes
  "semi": false                   // Remove semicolons
}
```

### Tailwind CSS Customization

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#0066FF',
        danger: '#FF3333'
      },
      spacing: {
        128: '32rem'
      }
    }
  }
};
```

### Add Jest Test Coverage

Edit `jest.config.js`:

```javascript
{
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ],
  coverageThresholds: {
    global: {
      branches: 70,      // Increase from 50%
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

---

## Development Workflow

### 1. Setup Phase
```bash
npm install
cp .env.example .env
npm start
```

### 2. Development Phase
- Code changes → Auto hot reload
- Save file → ESLint checks + Prettier formats
- Tests run on changes

### 3. Pre-commit Phase
```bash
npm run lint:fix
npm run format
npm run test:coverage
```

### 4. CI/CD Phase (GitHub Actions)
- Runs on push/PR
- Lints, formats, tests, builds
- Reports coverage to Codecov

### 5. Deployment Phase
```bash
npm run build
# Deploy contents of build/ folder
```

---

## Troubleshooting Configuration

### "Environment variable not loading"
- ✅ Variable must start with `REACT_APP_`
- ✅ Restart dev server after `.env` change
- ✅ Check file is saved
- ✅ Verify no typos

### "ESLint errors not showing in editor"
- ✅ Install ESLint extension
- ✅ Check `.vscode/settings.json` exists
- ✅ Reload VSCode window

### "Prettier not auto-formatting"
- ✅ Install Prettier extension
- ✅ Enable "Format on Save" in VSCode settings
- ✅ Check `.prettierrc.json` is present

### "Tests failing after config change"
- ✅ Clear Jest cache: `npm test -- --clearCache`
- ✅ Restart dev server
- ✅ Check `jest.config.js` syntax

### "Build fails"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Next Steps

1. ✅ Review and customize `.eslintrc.json` for team standards
2. ✅ Review and customize `.prettierrc.json` for code style
3. ✅ Set up Git pre-commit hooks (husky + lint-staged)
4. ✅ Configure environment variables for your API
5. ✅ Add more build scripts as needed
6. ✅ Set up production deployment pipeline

---

**For detailed build documentation, see [BUILD.md](BUILD.md)**
