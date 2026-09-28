# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: use nvm)
- npm 8+ or yarn/pnpm
- Git
- VSCode (recommended)

### Initial Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd react-sample-poc-project

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Start development server
npm start
```

The app will open at **http://localhost:3000**

---

## Development Workflow

### Code Formatting & Linting

**Automatic (on save):**
- Prettier auto-formats code
- ESLint checks for errors
- Both configured in VSCode settings

**Manual:**
```bash
npm run format      # Format all files
npm run lint:fix    # Fix linting errors
```

### Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Single run with coverage
npm run test:coverage

# Run specific test file
npm test BooksList

# Clear cache if needed
npm test -- --clearCache
```

### Environment Variables

**Local Development (.env):**
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG_MODE=true
```

**Production (.env.production):**
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG_MODE=false
```

⚠️ **After changing .env files, restart `npm start`**

---

## Project Architecture

### Component Structure

```
src/components/
├── Header/
│   ├── Header.jsx           # Component logic
│   ├── Header.css           # Styling
│   └── Header.test.jsx      # Unit tests
└── BooksList/
    ├── BooksList.jsx
    ├── BooksList.css
    └── BooksList.test.jsx
```

### API Integration

API client is centralized in `src/utils/api.js`:

```javascript
import api from './utils/api';

// Get books
const response = await api.get('/books');

// Post new book
await api.post('/books', { title: 'New Book' });
```

### State Management

Currently using React hooks. For larger apps, consider:
- Redux
- Context API + useReducer
- Zustand
- Recoil

---

## VSCode Setup

### Recommended Extensions
- ESLint
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense

### Quick Install
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
```

### VSCode Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Alt+F` | Format document (Prettier) |
| `Ctrl+Shift+P` → "ESLint: Fix all auto-fixable Problems" | Fix linting |
| `Ctrl+J` | Toggle terminal |

---

## Common Tasks

### Adding a New Component

1. Create folder in `src/components/MyComponent/`

2. Create `MyComponent.jsx`:
```javascript
import './MyComponent.css';

export default function MyComponent() {
  return (
    <div className="my-component">
      {/* Component content */}
    </div>
  );
}
```

3. Create `MyComponent.css`:
```css
.my-component {
  /* Styles */
}
```

4. Create `MyComponent.test.jsx`:
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

5. Import and use in `App.jsx`:
```javascript
import MyComponent from './components/MyComponent/MyComponent';

export default function App() {
  return <MyComponent />;
}
```

### Adding Dependencies

```bash
# Install new package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Remove package
npm uninstall package-name
```

### Debugging

**Browser DevTools:**
1. Open DevTools: `F12` or `Right-click → Inspect`
2. Go to **Components** tab to inspect React components
3. Use **React DevTools** extension for better debugging

**Console Logging:**
```javascript
console.log('Value:', value);
console.warn('Warning:', message);
console.error('Error:', error);
```

**Breakpoints:**
1. Open DevTools Sources tab
2. Click line number to add breakpoint
3. Code will pause at breakpoint

---

## Building for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npx serve -s build
```

**Build Output:**
- Minified JavaScript
- Optimized images
- Chunked code for better loading
- Source maps for debugging

---

## Deployment

### Vercel (Recommended for React)
```bash
npm i -g vercel
vercel
```

### Netlify
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Traditional Server
```bash
# Build locally
npm run build

# Upload build/ folder to your server
# Configure server to serve index.html for all routes
```

---

## Troubleshooting

### "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### "Tests failing"
```bash
# Clear Jest cache
npm test -- --clearCache

# Update snapshots
npm test -- -u
```

### "Build size too large"
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
# Add to scripts in package.json
```

---

## Performance Tips

1. **Code Splitting:** Use React.lazy() for route-based splitting
2. **Memoization:** Use React.memo() for expensive components
3. **Optimize Images:** Compress before adding to project
4. **Remove Console Logs:** Production build should not log
5. **Lazy Load Components:** Load components on-demand

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes, test, commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/feature-name

# Create Pull Request on GitHub
```

---

## Additional Resources

- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material-UI Docs](https://mui.com/)
- [React Router Docs](https://reactrouter.com/)
- [Jest Testing](https://jestjs.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)

---

**Questions? Check BUILD.md and STRUCTURE.md for more detailed information.**
