# Multi-Environment Code: Working Implementation

Copy-paste ready code examples for environment-aware React application.

---

## Quick Setup (Copy-Paste Ready)

### Step 1: Create Config Module

**`src/config/index.js`:**
```javascript
/**
 * Environment Configuration
 * Usage: import config from './config'
 */

const configs = {
  development: {
    environment: 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    enableMockApi: process.env.REACT_APP_ENABLE_MOCK_API === 'true' || true,
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true' || true,
    enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true' || true,
    apiKey: process.env.REACT_APP_API_KEY || 'dev-key',
  },

  staging: {
    environment: 'staging',
    apiUrl: process.env.REACT_APP_API_URL,
    enableMockApi: false,
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true' || false,
    enableLogging: true,
    apiKey: process.env.REACT_APP_API_KEY,
  },

  production: {
    environment: 'production',
    apiUrl: process.env.REACT_APP_API_URL,
    enableMockApi: false,
    enableDebug: false,
    enableLogging: false,
    apiKey: process.env.REACT_APP_API_KEY,
  },
};

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

if (config.enableDebug) {
  console.log('✅ Loaded', env, 'config:', {
    apiUrl: config.apiUrl,
    enableMockApi: config.enableMockApi,
    enableDebug: config.enableDebug,
  });
}

export default config;
```

### Step 2: Create Mock Data

**`src/services/mocks/bookMocks.js`:**
```javascript
/**
 * Mock data for development
 */

export const mockBooks = [
  {
    id: 1,
    title: 'React: The Complete Guide',
    author: 'Maximilian Schwarzmüller',
    year: 2024,
    description: 'Learn React from scratch',
    price: 99.99,
  },
  {
    id: 2,
    title: 'JavaScript: The Definitive Guide',
    author: 'David Flanagan',
    year: 2020,
    description: 'Master JavaScript',
    price: 89.99,
  },
  {
    id: 3,
    title: 'Web Design with CSS',
    author: 'Ethan Nicholas',
    year: 2023,
    description: 'Create beautiful websites',
    price: 79.99,
  },
];

export const mockAuthors = [
  { id: 1, name: 'Maximilian Schwarzmüller' },
  { id: 2, name: 'David Flanagan' },
  { id: 3, name: 'Ethan Nicholas' },
];

/**
 * Simulate API delay
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### Step 3: Create Mock Book Service

**`src/services/BookService.js`:**
```javascript
/**
 * Book Service - Works with both real and mock APIs
 */

import config from '../config';
import { mockBooks, delay } from './mocks/bookMocks';

class BookService {
  constructor() {
    this.books = [...mockBooks];
    this.nextId = Math.max(...this.books.map((b) => b.id)) + 1;
  }

  async getBooks() {
    if (config.enableMockApi) {
      await delay(500);
      if (config.enableLogging) console.log('📚 [Mock] Fetched books:', this.books);
      return Promise.resolve(this.books);
    }

    // Real API call
    try {
      const response = await fetch(`${config.apiUrl}/books`, {
        headers: {
          'X-API-Key': config.apiKey,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      if (config.enableLogging) console.log('📚 [API] Fetched books:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch books:', error);
      throw error;
    }
  }

  async getBookById(id) {
    if (config.enableMockApi) {
      await delay(300);
      const book = this.books.find((b) => b.id === id);
      if (config.enableLogging) console.log('📖 [Mock] Fetched book:', book);
      return Promise.resolve(book);
    }

    try {
      const response = await fetch(`${config.apiUrl}/books/${id}`, {
        headers: {
          'X-API-Key': config.apiKey,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch book');
      const data = await response.json();
      if (config.enableLogging) console.log('📖 [API] Fetched book:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch book:', error);
      throw error;
    }
  }

  async createBook(book) {
    if (config.enableMockApi) {
      await delay(500);
      const newBook = { ...book, id: this.nextId++ };
      this.books.push(newBook);
      if (config.enableLogging) console.log('✨ [Mock] Created book:', newBook);
      return Promise.resolve(newBook);
    }

    try {
      const response = await fetch(`${config.apiUrl}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.apiKey,
        },
        body: JSON.stringify(book),
      });
      if (!response.ok) throw new Error('Failed to create book');
      const data = await response.json();
      if (config.enableLogging) console.log('✨ [API] Created book:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create book:', error);
      throw error;
    }
  }

  async updateBook(id, updates) {
    if (config.enableMockApi) {
      await delay(300);
      const index = this.books.findIndex((b) => b.id === id);
      if (index !== -1) {
        this.books[index] = { ...this.books[index], ...updates };
        if (config.enableLogging) console.log('📝 [Mock] Updated book:', this.books[index]);
        return Promise.resolve(this.books[index]);
      }
      return Promise.reject(new Error('Book not found'));
    }

    try {
      const response = await fetch(`${config.apiUrl}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': config.apiKey,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update book');
      const data = await response.json();
      if (config.enableLogging) console.log('📝 [API] Updated book:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to update book:', error);
      throw error;
    }
  }

  async deleteBook(id) {
    if (config.enableMockApi) {
      await delay(300);
      this.books = this.books.filter((b) => b.id !== id);
      if (config.enableLogging) console.log('🗑️ [Mock] Deleted book:', id);
      return Promise.resolve(true);
    }

    try {
      const response = await fetch(`${config.apiUrl}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': config.apiKey,
        },
      });
      if (!response.ok) throw new Error('Failed to delete book');
      if (config.enableLogging) console.log('🗑️ [API] Deleted book:', id);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete book:', error);
      throw error;
    }
  }
}

export default new BookService();
```

### Step 4: Create Environment Hooks

**`src/hooks/useEnvironment.js`:**
```javascript
/**
 * Hook: useEnvironment
 * Usage: const { isDevelopment, enableDebug } = useEnvironment()
 */

import config from '../config';

export function useEnvironment() {
  return {
    isDevelopment: config.environment === 'development',
    isStaging: config.environment === 'staging',
    isProduction: config.environment === 'production',
    environment: config.environment,
    enableDebug: config.enableDebug,
    enableMockApi: config.enableMockApi,
    enableLogging: config.enableLogging,
    apiUrl: config.apiUrl,
  };
}
```

**`src/hooks/useLogger.js`:**
```javascript
/**
 * Hook: useLogger
 * Usage: const { log, error, warn } = useLogger('ComponentName')
 */

import config from '../config';

export function useLogger(componentName) {
  const prefix = `[${componentName}]`;

  return {
    log: (message, data) => {
      if (config.enableLogging) {
        console.log(`${prefix} ${message}`, data || '');
      }
    },
    error: (message, err) => {
      if (config.enableLogging) {
        console.error(`${prefix} ❌ ${message}`, err || '');
      }
    },
    warn: (message, data) => {
      if (config.enableLogging) {
        console.warn(`${prefix} ⚠️ ${message}`, data || '');
      }
    },
  };
}
```

### Step 5: Create Debug Panel Component

**`src/components/DebugPanel.jsx`:**
```javascript
/**
 * Debug Panel - Only shown in development with debug enabled
 * Shows environment info and current config
 */

import config from '../config';

export default function DebugPanel() {
  if (!config.enableDebug) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#1a1a1a',
        color: '#0f0',
        border: '2px solid #0f0',
        borderRadius: '4px',
        padding: '15px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
      }}
    >
      <div style={{ marginBottom: '10px', fontWeight: 'bold', borderBottom: '1px solid #0f0' }}>
        🐛 DEBUG PANEL
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>Environment:</strong>
        <br />
        {config.environment}
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>API URL:</strong>
        <br />
        {config.apiUrl}
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>Mock API:</strong>
        <br />
        {config.enableMockApi ? '✅ ON' : '❌ OFF'}
      </div>

      <div style={{ marginBottom: '5px' }}>
        <strong>Logging:</strong>
        <br />
        {config.enableLogging ? '✅ ON' : '❌ OFF'}
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
        NODE_ENV: {process.env.NODE_ENV}
      </div>
    </div>
  );
}
```

### Step 6: Create Updated Components

**`src/components/BooksList.jsx`:**
```javascript
/**
 * Books List Component
 * Works with both real and mock APIs
 */

import { useEffect, useState } from 'react';
import BookService from '../services/BookService';
import { useLogger } from '../hooks/useLogger';
import { useEnvironment } from '../hooks/useEnvironment';

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { log, error: logError } = useLogger('BooksList');
  const { enableMockApi } = useEnvironment();

  useEffect(() => {
    log('Component mounted, fetching books...');

    BookService.getBooks()
      .then((data) => {
        log('Successfully loaded', data.length, 'books');
        setBooks(data);
        setError(null);
      })
      .catch((err) => {
        logError('Failed to load books', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>📚 Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>❌ Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>
          📚 Books ({books.length})
          {enableMockApi && ' - Mock Data'}
        </h2>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{book.title}</h3>
            <p style={{ margin: '5px 0' }}>
              <strong>Author:</strong> {book.author}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Year:</strong> {book.year}
            </p>
            {book.description && (
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                {book.description}
              </p>
            )}
            {book.price && (
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: 'green' }}>
                ${book.price}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**`src/App.jsx`:**
```javascript
/**
 * Main App Component
 * Demonstrates environment-aware rendering
 */

import { useEffect } from 'react';
import BooksList from './components/BooksList';
import DebugPanel from './components/DebugPanel';
import { useEnvironment } from './hooks/useEnvironment';
import { useLogger } from './hooks/useLogger';
import config from './config';

import './App.css';

export default function App() {
  const { enableMockApi, enableDebug, environment } = useEnvironment();
  const { log } = useLogger('App');

  useEffect(() => {
    log('App mounted', {
      environment,
      enableMockApi,
      enableDebug,
      apiUrl: config.apiUrl,
    });
  }, []);

  return (
    <div className="app">
      <header style={{ backgroundColor: '#282c34', color: 'white', padding: '20px' }}>
        <h1>📚 Book Store</h1>
        <p style={{ margin: '10px 0', fontSize: '14px' }}>
          Environment: <strong>{environment}</strong>
        </p>
      </header>

      <main>
        {/* Show mock indicator */}
        {enableMockApi && (
          <div
            style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              color: '#856404',
              padding: '15px',
              margin: '20px',
              borderRadius: '4px',
            }}
          >
            <strong>⚠️ Running with Mock API</strong>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              No real API calls will be made. Data is generated locally.
            </p>
          </div>
        )}

        {/* Show debug banner */}
        {enableDebug && (
          <div
            style={{
              backgroundColor: '#e7f3ff',
              border: '1px solid #2196F3',
              color: '#004085',
              padding: '15px',
              margin: '20px',
              borderRadius: '4px',
            }}
          >
            <strong>🐛 Debug Mode Enabled</strong>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              Check the browser console for detailed logging.
            </p>
          </div>
        )}

        {/* Main content */}
        <BooksList />
      </main>

      {/* Debug panel - only shown when enabled */}
      <DebugPanel />
    </div>
  );
}
```

---

## Running Different Environments

### Development (Mock API, Full Debug)

```bash
# Uses config.development with mock API enabled
npm start

# Check console for logging
# See debug panel in bottom-right corner
```

### Staging (Real API, Minimal Debug)

```bash
# Set environment to staging
NODE_ENV=staging npm start

# Or build for staging
NODE_ENV=staging npm run build
```

### Production (Real API, No Debug)

```bash
# Build for production
NODE_ENV=production npm run build

# Test production build locally
npx serve -s build
```

---

## Environment Variables to Set

**`.env` or `.env.local`:**
```env
# Development defaults
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_MOCK_API=true
REACT_APP_API_KEY=dev-key-12345
```

**`.env.production`:**
```env
# Production values (set via CI/CD)
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=false
REACT_APP_ENABLE_MOCK_API=false
REACT_APP_API_KEY=(injected by CI/CD)
```

---

## File Structure to Create

```
src/
├── config/
│   └── index.js                 ← Copy Step 1
│
├── services/
│   ├── BookService.js           ← Copy Step 3
│   └── mocks/
│       └── bookMocks.js         ← Copy Step 2
│
├── hooks/
│   ├── useEnvironment.js        ← Copy Step 4
│   └── useLogger.js             ← Copy Step 4
│
├── components/
│   ├── DebugPanel.jsx           ← Copy Step 5
│   ├── BooksList.jsx            ← Copy Step 6
│   └── App.jsx                  ← Copy Step 6
│
└── App.css
```

---

## What You Get

✅ **Mock API in Development** - Develop offline
✅ **Real API in Production** - Production-ready
✅ **Automatic Logging** - Controlled by config
✅ **Debug Panel** - Dev environment only
✅ **Environment Hooks** - Easy to use in components
✅ **Different Behavior per Environment** - Automatically handled

---

## Test It

```bash
# 1. Create all files from steps 1-6 above
# 2. Install dependencies
npm install

# 3. Run development
npm start
# You should see:
# - Mock API indicator
# - Debug panel (bottom-right)
# - Console logs
# - Books from mock data

# 4. Test production build
NODE_ENV=production npm run build
npx serve -s build
# No debug panel, no mock indicator
```

---

**See MULTIENV_CODE_DESIGN.md for more patterns and strategies**
