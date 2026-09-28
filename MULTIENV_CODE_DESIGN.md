# Multi-Environment Code Design

Structure your React code to work differently in different environments.

---

## Table of Contents

1. [Overview](#overview)
2. [Environment-Specific Implementations](#environment-specific-implementations)
3. [Mock APIs for Development](#mock-apis-for-development)
4. [Feature Flags](#feature-flags)
5. [Environment-Aware Components](#environment-aware-components)
6. [Environment-Aware Hooks](#environment-aware-hooks)
7. [Conditional Logic](#conditional-logic)
8. [Complete Example](#complete-example)

---

## Overview

Multi-env code design means your React code behaves differently based on environment:

```
development   → Use mock APIs, verbose logging, debug UI
staging       → Use staging APIs, normal logging, feature testing
production    → Use prod APIs, minimal logging, optimized
```

### Benefits

✅ Develop offline with mock data
✅ Test features without hitting real APIs
✅ Different logging strategies per environment
✅ Feature flags for gradual rollout
✅ Development-only UI components
✅ Different error handling strategies
✅ Environment-specific optimizations

---

## Environment-Specific Implementations

### Pattern 1: Single Service with Environment Logic

**`src/services/BookService.js`:**
```javascript
import config from '../config';
import { mockBooks } from './mocks/bookMocks';

class BookService {
  async getBooks() {
    if (config.enableMockApi) {
      // Development: Return mock data
      return Promise.resolve(mockBooks);
    }

    // Production: Call real API
    const response = await fetch(`${config.apiUrl}/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  }

  async getBookById(id) {
    if (config.enableMockApi) {
      return Promise.resolve(mockBooks.find((b) => b.id === id));
    }

    const response = await fetch(`${config.apiUrl}/books/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  }

  async createBook(book) {
    if (config.enableMockApi) {
      // Mock: Add to local state
      const newBook = { ...book, id: Date.now() };
      return Promise.resolve(newBook);
    }

    const response = await fetch(`${config.apiUrl}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to create book');
    return response.json();
  }
}

export default new BookService();
```

### Pattern 2: Dynamic Imports (Better for Large Services)

Create separate files for mock and real implementations:

```
services/
├── BookService/
│   ├── index.js          ← Dynamic import based on env
│   ├── RealBookService.js
│   └── MockBookService.js
```

**`src/services/BookService/index.js`:**
```javascript
import config from '../../config';

let BookService;

if (config.enableMockApi) {
  // Development: Import mock service
  BookService = require('./MockBookService').default;
} else {
  // Production: Import real service
  BookService = require('./RealBookService').default;
}

export default BookService;
```

**`src/services/BookService/RealBookService.js`:**
```javascript
import config from '../../config';

class RealBookService {
  async getBooks() {
    const response = await fetch(`${config.apiUrl}/books`, {
      headers: {
        'X-API-Key': config.apiKey,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }

  async createBook(book) {
    const response = await fetch(`${config.apiUrl}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  }
}

export default new RealBookService();
```

**`src/services/BookService/MockBookService.js`:**
```javascript
const mockBooks = [
  { id: 1, title: 'React Guide', author: 'John Doe', year: 2024 },
  { id: 2, title: 'Web Dev 101', author: 'Jane Smith', year: 2023 },
  { id: 3, title: 'JavaScript Pro', author: 'Mike Johnson', year: 2024 },
];

class MockBookService {
  constructor() {
    this.books = [...mockBooks];
    this.nextId = Math.max(...this.books.map((b) => b.id)) + 1;
  }

  async getBooks() {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.books), 500);
    });
  }

  async getBookById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const book = this.books.find((b) => b.id === id);
        resolve(book);
      }, 300);
    });
  }

  async createBook(book) {
    return new Promise((resolve) => {
      const newBook = { ...book, id: this.nextId++ };
      this.books.push(newBook);
      setTimeout(() => resolve(newBook), 500);
    });
  }

  async updateBook(id, updates) {
    return new Promise((resolve) => {
      const index = this.books.findIndex((b) => b.id === id);
      if (index !== -1) {
        this.books[index] = { ...this.books[index], ...updates };
      }
      setTimeout(() => resolve(this.books[index]), 300);
    });
  }

  async deleteBook(id) {
    return new Promise((resolve) => {
      this.books = this.books.filter((b) => b.id !== id);
      setTimeout(() => resolve(true), 300);
    });
  }
}

export default new MockBookService();
```

### Usage in Components

```javascript
import BookService from '../services/BookService';

export default function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Works with both real and mock service automatically!
    BookService.getBooks().then(setBooks);
  }, []);

  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

---

## Mock APIs for Development

### Strategy 1: Mock API with Axios Interceptor

**`src/utils/mockApiInterceptor.js`:**
```javascript
import axios from 'axios';
import { mockBooks, mockAuthors } from './mocks';

export function setupMockApi(api) {
  // Intercept GET requests
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // If real API fails, try mock data
      if (error.config.url.includes('/api/books')) {
        return {
          data: mockBooks,
          status: 200,
          statusText: 'OK (Mock)',
        };
      }
      return Promise.reject(error);
    }
  );

  return api;
}
```

### Strategy 2: MSW (Mock Service Worker)

Setup mock API server that intercepts requests:

**`src/mocks/handlers.js`:**
```javascript
import { rest } from 'msw';
import { mockBooks, mockAuthors } from './data';

export const handlers = [
  // Mock GET /api/books
  rest.get('/api/books', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockBooks));
  }),

  // Mock POST /api/books
  rest.post('/api/books', (req, res, ctx) => {
    const newBook = { ...req.body, id: Date.now() };
    mockBooks.push(newBook);
    return res(ctx.status(201), ctx.json(newBook));
  }),

  // Mock GET /api/authors
  rest.get('/api/authors', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockAuthors));
  }),
];
```

**`src/mocks/server.js`:**
```javascript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**`src/index.js`:**
```javascript
import config from './config';

// Setup mock API for development
if (config.enableMockApi && process.env.NODE_ENV === 'development') {
  const { server } = require('./mocks/server');
  server.listen({ onUnhandledRequest: 'bypass' });
}

ReactDOM.render(<App />, document.getElementById('root'));
```

---

## Feature Flags

### Pattern 1: Environment-Based Flags

**`src/features/index.js`:**
```javascript
import config from '../config';

export const features = {
  // Feature only in staging/production
  newUserDashboard:
    config.enableNewFeatures && config.environment !== 'development',

  // Feature in staging for testing
  betaFeatures: ['staging', 'development'].includes(config.environment),

  // Advanced mode only in development
  advancedMode: config.environment === 'development',

  // Debug panel only in development
  debugPanel: config.enableDebug,

  // Error tracking in production only
  errorTracking: config.environment === 'production',
};

export function hasFeature(featureName) {
  return features[featureName] === true;
}
```

### Pattern 2: Remote Feature Flags

**`src/services/FeatureFlagService.js`:**
```javascript
class FeatureFlagService {
  constructor() {
    this.flags = {};
    this.loaded = false;
  }

  async loadFlags() {
    try {
      // Fetch from backend or config server
      const response = await fetch('/api/feature-flags');
      this.flags = await response.json();
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      // Fallback to defaults
      this.flags = this.getDefaults();
    }
  }

  getDefaults() {
    return {
      newDashboard: false,
      betaFeatures: false,
      darkMode: true,
      aiAssistant: false,
    };
  }

  isEnabled(flagName) {
    return this.flags[flagName] === true;
  }
}

export default new FeatureFlagService();
```

### Usage in Components

```javascript
import { hasFeature, features } from '../features';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {features.newUserDashboard && <NewDashboard />}

      {!features.newUserDashboard && <OldDashboard />}

      {features.debugPanel && <DebugPanel />}

      {features.advancedMode && <AdvancedSettings />}
    </div>
  );
}
```

---

## Environment-Aware Components

### Pattern 1: Development-Only Components

**`src/components/DebugPanel.jsx`:**
```javascript
import config from '../config';

export default function DebugPanel() {
  // Only render in development with debug enabled
  if (!config.enableDebug) return null;

  return (
    <div style={styles.debugPanel}>
      <h3>🐛 Debug Panel</h3>
      <div>
        <strong>Environment:</strong> {process.env.NODE_ENV}
      </div>
      <div>
        <strong>API URL:</strong> {config.apiUrl}
      </div>
      <div>
        <strong>Mock API:</strong> {config.enableMockApi ? 'ON' : 'OFF'}
      </div>
      <div>
        <strong>Logging:</strong> {config.enableLogging ? 'ON' : 'OFF'}
      </div>
    </div>
  );
}

const styles = {
  debugPanel: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#f0f0f0',
    border: '2px solid #333',
    padding: '10px',
    fontSize: '12px',
    zIndex: 9999,
  },
};
```

### Pattern 2: Environment-Specific Error Handlers

**`src/components/ErrorBoundary.jsx`:**
```javascript
import config from '../config';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (config.enableLogging) {
      console.error('Error caught:', error, errorInfo);
    }

    if (config.environment === 'production') {
      // Send to error tracking service
      this.sendToSentry(error, errorInfo);
    }
  }

  sendToSentry(error, errorInfo) {
    if (config.sentryDsn) {
      // Send to Sentry
      fetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify({ error: error.toString(), errorInfo }),
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px' }}>
          {config.enableDebug ? (
            <>
              <h1>❌ Error occurred</h1>
              <pre>{this.state.error?.toString()}</pre>
            </>
          ) : (
            <h1>Something went wrong. Please refresh the page.</h1>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## Environment-Aware Hooks

### Custom Hook: useEnvironment

**`src/hooks/useEnvironment.js`:**
```javascript
import { useEffect, useState } from 'react';
import config from '../config';

export function useEnvironment() {
  return {
    isDevelopment: config.environment === 'development',
    isStaging: config.environment === 'staging',
    isProduction: config.environment === 'production',
    enableDebug: config.enableDebug,
    enableMockApi: config.enableMockApi,
    enableLogging: config.enableLogging,
    apiUrl: config.apiUrl,
  };
}

// Usage
export default function Component() {
  const { isDevelopment, enableDebug } = useEnvironment();

  return (
    <div>
      {isDevelopment && <p>⚠️ Running in development</p>}
      {enableDebug && <DebugInfo />}
    </div>
  );
}
```

### Custom Hook: useFeatureFlag

**`src/hooks/useFeatureFlag.js`:**
```javascript
import { useState, useEffect } from 'react';
import FeatureFlagService from '../services/FeatureFlagService';

export function useFeatureFlag(flagName) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    FeatureFlagService.loadFlags().then(() => {
      setIsEnabled(FeatureFlagService.isEnabled(flagName));
    });
  }, [flagName]);

  return isEnabled;
}

// Usage
export default function NewFeature() {
  const isEnabled = useFeatureFlag('newDashboard');

  if (!isEnabled) return <div>Feature coming soon</div>;

  return <div>New Feature Here</div>;
}
```

### Custom Hook: useLogger

**`src/hooks/useLogger.js`:**
```javascript
import config from '../config';

export function useLogger(componentName) {
  const log = (message, data) => {
    if (config.enableLogging) {
      console.log(`[${componentName}] ${message}`, data);
    }
  };

  const error = (message, err) => {
    if (config.enableLogging) {
      console.error(`[${componentName}] ${message}`, err);
    }
  };

  const warn = (message, data) => {
    if (config.enableLogging) {
      console.warn(`[${componentName}] ${message}`, data);
    }
  };

  return { log, error, warn };
}

// Usage
export default function BooksList() {
  const { log, error } = useLogger('BooksList');

  useEffect(() => {
    log('Component mounted');

    BookService.getBooks()
      .then((books) => log('Books loaded', books))
      .catch((err) => error('Failed to load books', err));
  }, []);

  return <div>Books...</div>;
}
```

---

## Conditional Logic

### Pattern 1: Environment Checks in Components

```javascript
import config from '../config';

export default function App() {
  return (
    <div>
      {/* Show mock indicator in development */}
      {config.enableMockApi && (
        <div style={{ backgroundColor: 'yellow', padding: '10px' }}>
          ⚠️ Using Mock API
        </div>
      )}

      {/* Show debug info in development */}
      {config.enableDebug && <DebugPanel />}

      {/* Show different content per environment */}
      {config.environment === 'development' && <DevTools />}
      {config.environment === 'staging' && <StagingBanner />}
      {config.environment === 'production' && <ProductionApp />}

      {/* Analytics only in production */}
      {config.environment === 'production' && <Analytics />}
    </div>
  );
}
```

### Pattern 2: Environment-Based Routes

**`src/routes/index.js`:**
```javascript
import config from '../config';

export function getRoutes() {
  const routes = [
    { path: '/', component: Home },
    { path: '/books', component: BooksList },
    { path: '/about', component: About },
  ];

  // Add development-only routes
  if (config.enableDebug) {
    routes.push({ path: '/debug', component: DebugPage });
    routes.push({ path: '/style-guide', component: StyleGuide });
  }

  // Add staging-only routes
  if (config.environment === 'staging') {
    routes.push({ path: '/test-features', component: TestFeaturesPage });
  }

  return routes;
}
```

---

## Complete Example

### Full Project Structure

```
src/
├── config/
│   └── index.js                    ← Environment config
│
├── services/
│   ├── BookService/
│   │   ├── index.js                ← Dynamic import
│   │   ├── RealBookService.js      ← Production
│   │   └── MockBookService.js      ← Development
│   │
│   └── FeatureFlagService.js       ← Feature flags
│
├── components/
│   ├── App.jsx                     ← Uses env logic
│   ├── DebugPanel.jsx              ← Dev-only
│   ├── BooksList.jsx               ← Uses services
│   └── ErrorBoundary.jsx           ← Env-aware errors
│
├── hooks/
│   ├── useEnvironment.js
│   ├── useFeatureFlag.js
│   └── useLogger.js
│
├── features/
│   └── index.js                    ← Feature flags
│
├── mocks/
│   ├── data.js                     ← Mock data
│   ├── handlers.js                 ← MSW handlers
│   └── server.js                   ← MSW server
│
└── index.js                        ← Setup mock API
```

### Sample Implementation

**`src/config/index.js`:**
```javascript
const configs = {
  development: {
    environment: 'development',
    apiUrl: 'http://localhost:8080/api',
    enableMockApi: true,
    enableDebug: true,
    enableLogging: true,
    apiKey: 'dev-key',
  },
  production: {
    environment: 'production',
    apiUrl: 'https://api.example.com/api',
    enableMockApi: false,
    enableDebug: false,
    enableLogging: false,
    apiKey: process.env.REACT_APP_API_KEY,
  },
};

export default configs[process.env.NODE_ENV || 'development'];
```

**`src/components/App.jsx`:**
```javascript
import { useEffect } from 'react';
import config from '../config';
import BooksList from './BooksList';
import DebugPanel from './DebugPanel';
import ErrorBoundary from './ErrorBoundary';
import { useLogger } from '../hooks/useLogger';

export default function App() {
  const { log } = useLogger('App');

  useEffect(() => {
    log('App loaded', {
      environment: config.environment,
      apiUrl: config.apiUrl,
      mockApi: config.enableMockApi,
    });
  }, []);

  return (
    <ErrorBoundary>
      <div>
        <h1>📚 Book Store</h1>

        {/* Show environment indicator */}
        {config.enableMockApi && (
          <div style={{ background: 'lightyellow', padding: '10px', margin: '10px 0' }}>
            ⚠️ Using Mock API (Development Mode)
          </div>
        )}

        {/* Main content */}
        <BooksList />

        {/* Debug panel */}
        {config.enableDebug && <DebugPanel />}
      </div>
    </ErrorBoundary>
  );
}
```

**`src/components/BooksList.jsx`:**
```javascript
import { useEffect, useState } from 'react';
import BookService from '../services/BookService';
import { useLogger } from '../hooks/useLogger';
import config from '../config';

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { log, error: logError } = useLogger('BooksList');

  useEffect(() => {
    log('Fetching books from', config.enableMockApi ? 'Mock API' : 'Real API');

    BookService.getBooks()
      .then((data) => {
        setBooks(data);
        log('Books fetched', data);
      })
      .catch((err) => {
        setError(err.message);
        logError('Failed to fetch books', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Books ({books.length})</h2>
      {books.map((book) => (
        <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{book.title}</h3>
          <p>Author: {book.author}</p>
          <p>Year: {book.year}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Running Different Environments

```bash
# Development (uses mock API, debug mode ON)
npm start

# Staging (uses staging API, debug mode OFF)
NODE_ENV=staging npm start

# Production (uses prod API, minimal logging)
NODE_ENV=production npm run build
npx serve -s build
```

---

## Benefits Summary

| Benefit | How Achieved |
|---------|-------------|
| **Offline Development** | Mock API in development |
| **Feature Testing** | Feature flags |
| **Debug Info** | Debug panel, logging |
| **Different APIs** | Dynamic service imports |
| **Error Handling** | Environment-aware error boundaries |
| **Performance** | Minimal logging in production |
| **Testing** | Mock data for unit tests |
| **Rollout** | Gradual feature flag deployment |

---

## Next Steps

1. Create `src/config/index.js` with environment config
2. Create `src/services/` with real and mock implementations
3. Create `src/features/` with feature flags
4. Add environment-aware components
5. Use environment hooks in your components
6. Test in different environments

---

**See also: ENVIRONMENT_PROFILES.md for configuration setup**
