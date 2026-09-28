# Multi-Environment Code - Quick Reference

Cheat sheet for environment-aware code patterns.

---

## Quick Patterns

### 1. Check Environment in Component

```javascript
import config from '../config';

if (config.enableDebug) {
  // Show debug UI
}

if (config.environment === 'production') {
  // Production-only code
}

if (config.enableMockApi) {
  // Using mock data
}
```

### 2. Use Logger Hook

```javascript
import { useLogger } from '../hooks/useLogger';

const { log, error, warn } = useLogger('ComponentName');

log('Message', data);     // Only in dev if logging enabled
error('Error message', err);
warn('Warning message', data);
```

### 3. Use Environment Hook

```javascript
import { useEnvironment } from '../hooks/useEnvironment';

const { isDevelopment, isProduction, enableDebug, enableMockApi } = useEnvironment();

if (isDevelopment) {
  // Dev-only code
}

if (enableMockApi) {
  // Using mock API
}
```

### 4. Conditional Component Rendering

```javascript
import config from '../config';

{config.enableDebug && <DebugPanel />}
{config.environment === 'production' && <ProductionOnlyUI />}
{config.enableMockApi && <MockIndicator />}
```

### 5. Service with Mock/Real Logic

```javascript
import config from '../config';

class MyService {
  async getData() {
    if (config.enableMockApi) {
      return Promise.resolve(mockData);
    }
    return fetch(`${config.apiUrl}/data`);
  }
}
```

---

## Configuration Values

```javascript
config = {
  environment: 'development' | 'staging' | 'production',
  apiUrl: string,
  enableMockApi: boolean,
  enableDebug: boolean,
  enableLogging: boolean,
  apiKey: string
}
```

---

## Environment Behavior

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Mock API** | ✅ Yes | ❌ No | ❌ No |
| **Debug Panel** | ✅ Yes | ❌ No | ❌ No |
| **Console Logs** | ✅ Yes | ✅ Yes | ❌ No |
| **API URL** | localhost | staging | production |
| **Mock Data** | Used | N/A | N/A |

---

## File Checklist

```
☐ src/config/index.js
☐ src/services/BookService.js
☐ src/services/mocks/bookMocks.js
☐ src/hooks/useEnvironment.js
☐ src/hooks/useLogger.js
☐ src/components/DebugPanel.jsx
☐ .env (with mock values)
☐ .env.production (real values)
```

---

## Commands

```bash
# Development (mock API)
npm start

# Staging (real staging API)
NODE_ENV=staging npm start

# Production (real prod API)
NODE_ENV=production npm run build
npx serve -s build
```

---

## Common Mistakes ❌

```javascript
// ❌ Don't hardcode API URLs
const url = 'https://api.example.com/api';

// ✅ Do use config
const url = config.apiUrl;

// ❌ Don't console.log in production
console.log('Debug info:', data);

// ✅ Do use logger hook
const { log } = useLogger('Component');
log('Debug info:', data);

// ❌ Don't ignore mock data
if (isProd) { /* only then use API */ }

// ✅ Do check enableMockApi
if (config.enableMockApi) { /* use mock */ }
```

---

## Best Practices ✅

1. Always import config from centralized module
2. Use hooks for environment info
3. Let services handle mock/real logic
4. Check enableMockApi, not NODE_ENV directly
5. Use useLogger instead of console.log
6. Conditionally render UI based on config
7. Keep mock data realistic
8. Test in all environments

---

## Debugging Tips

**Check current config:**
```javascript
import config from './config';
console.log('Current config:', config);
```

**See all available hooks:**
```javascript
import { useEnvironment } from './hooks/useEnvironment';
import { useLogger } from './hooks/useLogger';

const env = useEnvironment();
console.log('Environment:', env);
```

**Verify service behavior:**
```javascript
// Check if using mock or real
import BookService from './services/BookService';
import config from './config';

BookService.getBooks().then(data => {
  console.log('Using:', config.enableMockApi ? 'Mock' : 'Real API');
  console.log('Data:', data);
});
```

---

## Environment Variable Reference

### `.env` (Local Development)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_MOCK_API=true
REACT_APP_API_KEY=dev-key
```

### `.env.production` (Production)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=false
REACT_APP_ENABLE_MOCK_API=false
REACT_APP_API_KEY=(from CI/CD secrets)
```

---

## See Full Guides

- [MULTIENV_IMPLEMENTATION.md](MULTIENV_IMPLEMENTATION.md) - Copy-paste ready code
- [MULTIENV_CODE_DESIGN.md](MULTIENV_CODE_DESIGN.md) - Design patterns
- [MULTIENV_ARCHITECTURE.md](MULTIENV_ARCHITECTURE.md) - Visual architecture
