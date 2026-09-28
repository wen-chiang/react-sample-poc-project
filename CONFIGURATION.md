# Configuration Reference

Quick reference for all configuration files and their purposes.

## Configuration Files at a Glance

| File | Purpose | Key Settings |
|------|---------|--------------|
| `.env` | Local dev variables | API_URL, DEBUG_MODE |
| `.env.production` | Production variables | Production API_URL |
| `package.json` | Dependencies & scripts | Scripts, versions |
| `.eslintrc.json` | Code linting rules | Lint severity, rules |
| `.prettierrc.json` | Code formatting | Quote style, line width |
| `.gitignore` | Git ignore patterns | node_modules, build |
| `babel.config.js` | JavaScript transpilation | Presets, plugins |
| `jest.config.js` | Testing framework | Test paths, coverage |
| `tailwind.config.js` | CSS theme | Colors, spacing |
| `postcss.config.js` | CSS processing | Tailwind, autoprefixer |
| `.vscode/settings.json` | Editor config | Formatter, linter integration |

---

## Configuration by Purpose

### 🌐 API & Backend Configuration

**File:** `.env` / `.env.production`

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=30000
```

**Usage:**
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const timeout = parseInt(process.env.REACT_APP_API_TIMEOUT);
```

---

### 🔧 Build & Dev Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint src --ext .js,.jsx",
    "format": "prettier --write src/**",
    "eject": "react-scripts eject"
  }
}
```

**Run:** `npm run <script-name>`

---

### 🎨 Code Quality & Linting

**Files:**
- `.eslintrc.json` - Lint rules
- `.prettierrc.json` - Format rules
- `.prettierignore` - Skip formatting

**ESLint Common Rules:**
```json
{
  "rules": {
    "no-console": "warn",           // Warn on console.log
    "no-unused-vars": "error",      // Error on unused vars
    "eqeqeq": "error",              // Require ===
    "prefer-const": "warn"          // Warn on let when const works
  }
}
```

**Prettier Options:**
```json
{
  "semi": true,                     // Add semicolons
  "singleQuote": true,              // Use single quotes
  "printWidth": 100,                // Line length
  "tabWidth": 2,                    // Indent size
  "trailingComma": "es5"            // Trailing commas in arrays/objects
}
```

---

### 🧪 Testing Configuration

**File:** `jest.config.js`

```javascript
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/src/**/*.test.js'
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
}
```

**Run Tests:**
```bash
npm test                  # Watch mode
npm run test:coverage     # Coverage report
```

---

### 📦 JavaScript Transpilation

**File:** `babel.config.js`

```javascript
{
  presets: [
    ['@babel/preset-env'],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
}
```

**Purpose:** Convert modern JavaScript/JSX to browser-compatible ES5

---

### 🎨 Styling Configuration

**Files:**
- `tailwind.config.js` - Tailwind CSS theme
- `postcss.config.js` - CSS processing

**Tailwind Theme:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#0066FF'
      },
      spacing: {
        128: '32rem'
      }
    }
  }
};
```

**PostCSS:**
```javascript
{
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

### 📝 Git & Ignore Patterns

**File:** `.gitignore`

```
node_modules/              # Dependencies
build/                     # Build output
dist/                      # Distribution
.env                       # Environment (secrets)
.env.local
coverage/                  # Test coverage
.DS_Store                  # macOS files
*.log                      # Log files
```

---

### 💻 VSCode Integration

**Files:**
- `.vscode/settings.json` - Editor settings
- `.vscode/extensions.json` - Recommended extensions

**Settings:**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**Install Extensions:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

---

### 🔄 CI/CD Pipeline

**File:** `.github/workflows/build.yml`

**Triggers:** Push to main/develop, Pull Requests

**Steps:**
1. Checkout code
2. Install Node.js
3. Install dependencies (`npm ci`)
4. Run linting (`npm run lint`)
5. Check formatting (`npm run format:check`)
6. Run tests with coverage (`npm run test:coverage`)
7. Build project (`npm run build`)
8. Upload coverage to Codecov

---

## Quick Configuration Tasks

### Change ESLint Rule

Edit `.eslintrc.json`:
```json
{
  "rules": {
    "no-console": "off"  // Allow console.log
  }
}
```
Then restart VSCode.

### Change Code Style

Edit `.prettierrc.json`:
```json
{
  "printWidth": 120,      // Wider lines
  "tabWidth": 4,          // 4-space indent
  "singleQuote": false    // Use double quotes
}
```
Then run `npm run format`.

### Add Environment Variable

1. Add to `.env`:
   ```env
   REACT_APP_MY_VAR=value
   ```

2. Add to `.env.production`:
   ```env
   REACT_APP_MY_VAR=prod_value
   ```

3. Use in code:
   ```javascript
   const value = process.env.REACT_APP_MY_VAR;
   ```

4. Restart `npm start`

### Change Test Coverage Threshold

Edit `jest.config.js`:
```javascript
coverageThresholds: {
  global: {
    branches: 80,      // Was 50
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

### Add Tailwind Custom Color

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'brand-blue': '#0066FF',
      'brand-red': '#FF3333'
    }
  }
}
```

Usage in HTML/JSX:
```jsx
<div className="bg-brand-blue text-brand-red">
  Content
</div>
```

---

## Environment Variables Cheatsheet

### Local Development (.env)
```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG_MODE=true
REACT_APP_ENABLE_LOGGING=true
```

### Production (.env.production)
```env
NODE_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG_MODE=false
REACT_APP_ENABLE_LOGGING=false
```

### Testing (.env.test)
```env
NODE_ENV=test
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENABLE_MOCK_API=true
```

---

## Configuration Checklist

Before deploying to production:

- [ ] Review `.env.production` settings
- [ ] Update API URLs for production
- [ ] Disable debug mode and verbose logging
- [ ] Run `npm run build` successfully
- [ ] Run `npm run test:coverage` - coverage >= thresholds
- [ ] Run `npm run lint` - no errors
- [ ] Check bundle size is reasonable
- [ ] Test build locally: `npx serve -s build`

---

## Common Issues & Solutions

### Issue: Environment variables not loading
**Solution:**
1. Check variable starts with `REACT_APP_`
2. Restart dev server: `npm start`
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: ESLint not working in VSCode
**Solution:**
1. Install ESLint extension
2. Reload VSCode (Ctrl+Shift+P → "Reload Window")
3. Check `.eslintrc.json` exists

### Issue: Prettier not formatting
**Solution:**
1. Install Prettier extension
2. Enable "Format on Save" in VSCode
3. Check `.prettierrc.json` syntax

### Issue: Tests failing after config change
**Solution:**
```bash
npm test -- --clearCache
npm test
```

### Issue: Build fails
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## File Locations Summary

```
Configuration Files:
├── .env                           (Local dev)
├── .env.production                (Production)
├── .eslintrc.json                 (Linting)
├── .prettierrc.json               (Formatting)
├── .gitignore                     (Git)
├── babel.config.js                (JS transpilation)
├── jest.config.js                 (Testing)
├── tailwind.config.js             (Tailwind theme)
├── postcss.config.js              (CSS processing)
├── package.json                   (Dependencies/Scripts)
├── .vscode/settings.json          (VSCode)
└── .github/workflows/build.yml    (CI/CD)

Documentation:
├── BUILD.md                       (Build ecosystem)
├── STRUCTURE.md                   (Project structure)
├── DEVELOPMENT.md                 (Dev guide)
└── CONFIGURATION.md               (This file)
```

---

**For detailed information, see:**
- [BUILD.md](BUILD.md) - Comprehensive build documentation
- [STRUCTURE.md](STRUCTURE.md) - Project structure & organization
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development workflow guide
