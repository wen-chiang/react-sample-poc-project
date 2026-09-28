# Build Ecosystem Configuration Guide

This document explains all the build, development, and configuration tools in this React project.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Build Configuration Files](#build-configuration-files)
3. [Environment Variables](#environment-variables)
4. [Build Scripts](#build-scripts)
5. [Code Quality Tools](#code-quality-tools)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

---

## Build Configuration Files

### 1. **package.json**
**Location:** `./package.json`

**Purpose:** Defines project metadata, dependencies, and scripts.

**Key Sections:**
- `dependencies`: Runtime packages (React, Axios, Material-UI)
- `devDependencies`: Development tools (react-scripts)
- `scripts`: NPM command shortcuts
- `eslintConfig`: ESLint configuration
- `browserslist`: Target browser support

**Edit When:**
- Adding/removing dependencies
- Modifying build scripts
- Changing browser targets

---

### 2. **ESLint Configuration**
**Location:** `./.eslintrc.json`

**Purpose:** Defines JavaScript/JSX linting rules to maintain code quality.

**Key Settings:**
```json
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "eqeqeq": "error"
  }
}
```

**Edit When:**
- Enabling/disabling specific lint rules
- Adding stricter code standards
- Adjusting for team preferences

**Common Rules:**
| Rule | Purpose |
|------|---------|
| `no-console` | Warns about console.log in production |
| `no-unused-vars` | Catches unused variables |
| `eqeqeq` | Enforces strict equality (=== vs ==) |
| `prefer-const` | Encourages const over let |

**Run ESLint:**
```bash
npm run lint
```

---

### 3. **Prettier Configuration**
**Location:** `./.prettierrc.json`

**Purpose:** Automatic code formatting (spacing, quotes, line length).

**Key Settings:**
```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Options Explained:**
| Option | Value | Meaning |
|--------|-------|---------|
| `semi` | `true` | Add semicolons at end of statements |
| `singleQuote` | `true` | Use single quotes instead of double |
| `printWidth` | `100` | Wrap lines at 100 characters |
| `tabWidth` | `2` | Use 2 spaces for indentation |
| `trailingComma` | `es5` | Add trailing commas where valid in ES5 |

**Run Prettier:**
```bash
npm run format
```

---

### 4. **Tailwind CSS Configuration**
**Location:** `./tailwind.config.js`

**Purpose:** Customize Tailwind CSS theme and plugins.

**Common Customizations:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#3B82F6',
      },
    },
  },
};
```

---

### 5. **PostCSS Configuration**
**Location:** `./postcss.config.js`

**Purpose:** Processes CSS (Tailwind, autoprefixer, etc.).

**Typical Setup:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

### 6. **Jest Configuration**
**Location:** `./jest.config.js`

**Purpose:** Configures testing framework and test runners.

**Key Settings:**
```javascript
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx}']
}
```

**Coverage Thresholds:**
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

**Run Tests:**
```bash
npm test
npm run test:coverage
```

---

### 7. **Babel Configuration**
**Location:** `./babel.config.js`

**Purpose:** Transpiles modern JavaScript to browser-compatible code.

**Key Presets:**
- `@babel/preset-env`: Converts ES6+ to ES5
- `@babel/preset-react`: Transforms JSX to JS

---

## Environment Variables

### Location: `.env`, `.env.local`, `.env.production`

Environment variables are loaded based on `NODE_ENV`:
- `.env` - Loaded in all environments
- `.env.local` - Local overrides (git-ignored)
- `.env.production` - Production-specific values

### Available Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `REACT_APP_API_URL` | `http://localhost:8080/api` | API endpoint |
| `REACT_APP_API_TIMEOUT` | `30000` | Request timeout in ms |
| `NODE_ENV` | `development` | Environment type |
| `REACT_APP_ENABLE_DEBUG_MODE` | `true` | Enable debug logging |

### Important Notes
- Only variables prefixed with `REACT_APP_` are exposed to the frontend
- `NODE_ENV` is built-in and available
- For local changes, create `.env.local` (git-ignored)
- Copy `.env.example` to `.env` to start

### Usage in Code
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const isDev = process.env.NODE_ENV === 'development';
```

---

## Build Scripts

### Available Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `npm start` | Start dev server (hot reload) | http://localhost:3000 |
| `npm run build` | Create optimized production build | `build/` folder |
| `npm test` | Run tests in watch mode | Console output |
| `npm run test:coverage` | Generate coverage report | `coverage/` folder |
| `npm run lint` | Check code quality | Console warnings/errors |
| `npm run format` | Auto-format code | Modified files |
| `npm run format:check` | Check formatting without changes | Console output |
| `npm eject` | Expose Create React App config | ⚠️ One-way operation |

### Development Server
```bash
npm start
```
- Runs on http://localhost:3000
- Auto-reloads on file changes
- Shows linting errors in browser

### Production Build
```bash
npm run build
```
- Creates optimized build in `build/` folder
- Minifies and chunks code
- Optimizes images and CSS
- Ready for deployment

---

## Code Quality Tools

### ESLint (Linting)
**Checks:** Syntax errors, unused variables, code standards

```bash
npm run lint
```

### Prettier (Formatting)
**Ensures:** Consistent code style and formatting

```bash
npm run format
```

### Combined Quality Check
```bash
npm run lint && npm run format:check
```

---

## Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Files Location
- Place tests alongside components: `Component.test.js` or `Component.spec.js`
- Or in a `__tests__` folder

### Example Test
```javascript
import { render, screen } from '@testing-library/react';
import BooksList from './BooksList';

test('renders books list', () => {
  render(<BooksList />);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deployment Checklist
- [ ] Set production environment variables in `.env.production`
- [ ] Run tests: `npm test`
- [ ] Check linting: `npm run lint`
- [ ] Build: `npm run build`
- [ ] Test the build: `npx serve -s build`
- [ ] Deploy the `build/` folder to your hosting

### Supported Hosting
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Docker container
- Traditional web server

### Docker Example
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Configuration File Reference

```
project-root/
├── .env                      # Local dev environment variables
├── .env.example              # Template for environment variables
├── .env.production           # Production environment variables
├── .eslintrc.json            # ESLint rules
├── .prettierrc.json          # Prettier formatting rules
├── .prettierignore           # Files to skip formatting
├── .gitignore                # Git ignore patterns
├── babel.config.js           # JavaScript transpilation
├── jest.config.js            # Testing configuration
├── tailwind.config.js        # Tailwind CSS customization
├── postcss.config.js         # CSS processing
├── package.json              # Project metadata & scripts
└── README.md                 # Project overview
```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Clear Cache and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
- Check variable is prefixed with `REACT_APP_`
- Restart dev server after changing `.env`
- Verify file is saved

### Build Fails
```bash
npm run lint  # Check for linting errors
npm run build -- --stats  # Build with stats
```

---

## Next Steps

1. **Add More Scripts** to `package.json`:
   ```json
   "lint": "eslint src --ext .js,.jsx",
   "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
   "format:check": "prettier --check \"src/**/*.{js,jsx,css}\""
   ```

2. **Set Up Pre-commit Hooks** (optional):
   ```bash
   npm install husky lint-staged --save-dev
   npx husky install
   ```

3. **Add CI/CD** workflows for automated testing/deployment

4. **Configure VSCode** for better integration (see `.vscode/settings.json`)

---

**Last Updated:** 2024
