# Multi-Environment Code Architecture

Visual guide to how multi-environment code design works.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  src/App.jsx                                                │
│  ├─ Imports config                                          │
│  ├─ Imports services                                        │
│  ├─ Imports hooks                                           │
│  └─ Uses useEnvironment() to conditionally render           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────────────┐       ┌──────────────────────────┐
│    Services              │       │    Config                │
├──────────────────────────┤       ├──────────────────────────┤
│ BookService.js           │       │ src/config/index.js      │
│ - getBooks()             │       │                          │
│ - createBook()           │       │ Returns different config │
│ - updateBook()           │       │ based on NODE_ENV        │
│ - deleteBook()           │       │                          │
│                          │       │ environment: 'dev'|'prod'│
│ Checks config:           │       │ enableMockApi: true|false│
│ if (enableMockApi) {     │       │ enableDebug: true|false  │
│   use mock data          │       │ apiUrl: string           │
│ } else {                 │       │ apiKey: string           │
│   call real API          │       │                          │
│ }                        │       │                          │
│                          │       │                          │
└──────────────────────────┘       └──────────────────────────┘
        ↓                                       ↓
┌──────────────────────────┐       ┌──────────────────────────┐
│  Mock Data               │       │  Real API                │
├──────────────────────────┤       ├──────────────────────────┤
│ mocks/bookMocks.js       │       │ https://api.example.com  │
│                          │       │                          │
│ const mockBooks = [      │       │ Requires:                │
│   {                      │       │ - API_KEY                │
│     id: 1,               │       │ - AUTH_TOKEN             │
│     title: 'Book 1',     │       │ - Valid URL              │
│     author: 'Author',    │       │                          │
│     ...                  │       │ Returns:                 │
│   },                     │       │ - Real data              │
│   ...                    │       │ - Actual API response    │
│ ]                        │       │                          │
│                          │       │                          │
└──────────────────────────┘       └──────────────────────────┘
```

---

## Data Flow

### Development (enableMockApi = true)

```
Component
  ↓
useEffect() calls BookService.getBooks()
  ↓
BookService checks config.enableMockApi
  ↓
enableMockApi is TRUE
  ↓
Returns mock data from memory
  ↓
Simulates delay (setTimeout)
  ↓
Component receives data
  ↓
Renders mock books
  ↓
Console shows: [Mock] Fetched books...
```

### Production (enableMockApi = false)

```
Component
  ↓
useEffect() calls BookService.getBooks()
  ↓
BookService checks config.enableMockApi
  ↓
enableMockApi is FALSE
  ↓
Makes HTTP request to config.apiUrl
  ↓
Headers include config.apiKey
  ↓
Real API processes request
  ↓
API returns real data
  ↓
Component receives data
  ↓
Renders real books
  ↓
Console shows: [API] Fetched books...
```

---

## File Dependency Graph

```
App.jsx
├─ imports config
│  └─ config/index.js (reads NODE_ENV)
│
├─ imports BookService
│  ├─ services/BookService.js
│  ├─ reads config
│  ├─ imports mockBooks
│  │  └─ mocks/bookMocks.js
│  └─ conditionally:
│      ├─ uses mock data
│      └─ or calls real API
│
├─ imports hooks
│  ├─ hooks/useEnvironment.js (reads config)
│  ├─ hooks/useLogger.js (reads config)
│  └─ displays based on config
│
├─ imports DebugPanel
│  └─ returns null if !config.enableDebug
│
└─ renders conditionally based on config
```

---

## Configuration Flow

```
NODE_ENV environment variable
  ↓
config/index.js reads NODE_ENV
  ↓
Matches to configs object:
  NODE_ENV='development' → configs.development
  NODE_ENV='staging'     → configs.staging
  NODE_ENV='production'  → configs.production
  ↓
Returns config object:
{
  environment: 'development',
  apiUrl: 'http://localhost:8080/api',
  enableMockApi: true,
  enableDebug: true,
  enableLogging: true,
  apiKey: 'dev-key'
}
  ↓
Components import and use config
  ↓
Behavior changes based on config values
```

---

## Environment Comparison

```
┌────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Config:                                                    │
│ ├─ environment: 'development'                              │
│ ├─ enableMockApi: true                                     │
│ ├─ enableDebug: true                                       │
│ ├─ enableLogging: true                                     │
│ └─ apiUrl: 'http://localhost:8080/api'                    │
│                                                            │
│ What Happens:                                              │
│ ✓ BookService uses mock data                              │
│ ✓ BooksList loads instantly (no network)                  │
│ ✓ DebugPanel shows in corner                              │
│ ✓ Console shows detailed logs                             │
│ ✓ Can modify mock data for testing                        │
│                                                            │
│ Use Case:                                                  │
│ Development without backend API server                    │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    PRODUCTION                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Config:                                                    │
│ ├─ environment: 'production'                               │
│ ├─ enableMockApi: false                                    │
│ ├─ enableDebug: false                                      │
│ ├─ enableLogging: false                                    │
│ └─ apiUrl: 'https://api.yourdomain.com/api'              │
│                                                            │
│ What Happens:                                              │
│ ✗ BookService calls real API                              │
│ ✓ BooksList waits for network response                    │
│ ✗ DebugPanel doesn't render                               │
│ ✗ Console is clean (no logs)                              │
│ ✗ Cannot modify data (read-only)                          │
│                                                            │
│ Use Case:                                                  │
│ Production deployment with full backend                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Request Flow Comparison

### Development Request

```
Component calls BookService.getBooks()
              ↓
BookService checks config.enableMockApi (true)
              ↓
await delay(500)  ← Simulates network delay
              ↓
Returns mockBooks array from memory
              ↓
NO HTTP request made
              ↓
No network latency
              ↓
Fast iteration and testing
```

### Production Request

```
Component calls BookService.getBooks()
              ↓
BookService checks config.enableMockApi (false)
              ↓
Makes HTTP request:
  GET https://api.yourdomain.com/api/books
  Headers: { 'X-API-Key': config.apiKey }
              ↓
Network request sent over internet
              ↓
Backend processes request
              ↓
Backend returns JSON response
              ↓
Real data received by component
              ↓
Actual network latency
              ↓
Production-ready behavior
```

---

## Conditional Rendering Pattern

```
┌─────────────────────────────────────────────────────────────┐
│ Components read config and conditionally render             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ App.jsx:                                                     │
│                                                              │
│ {enableMockApi && (                                          │
│   <div>⚠️ Using Mock API</div>                              │
│ )}                                                           │
│                                                              │
│ {enableDebug && (                                            │
│   <DebugPanel />                                             │
│ )}                                                           │
│                                                              │
│ Result:                                                      │
│ ├─ Development: Shows indicators + DebugPanel                │
│ └─ Production: Clean UI, no debug info                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Hook Usage Pattern

```
┌─────────────────────────────────────────────────────────────┐
│ Hooks provide environment info to components                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Component:                                                   │
│                                                              │
│ const { log, error } = useLogger('BooksList')                │
│ const { enableMockApi, isDevelopment } = useEnvironment()   │
│                                                              │
│ useEffect(() => {                                            │
│   log('Component mounted')  ← Only logs in dev              │
│   if (enableMockApi) {      ← Dev only                       │
│     console.log('Using mock data')                           │
│   }                                                          │
│ }, [])                                                       │
│                                                              │
│ Benefits:                                                    │
│ ✓ Components don't know about NODE_ENV                      │
│ ✓ Use hooks instead of direct env checks                    │
│ ✓ Easy to test and mock                                     │
│ ✓ Single source of truth (config module)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Selection Pattern

```
┌─────────────────────────────────────────────────────────────┐
│ Services automatically adapt to environment                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ // Component doesn't care which service                     │
│ import BookService from '../services/BookService'            │
│                                                              │
│ // BookService is smart - it knows which to use              │
│ // based on config.enableMockApi                            │
│                                                              │
│ // Same API regardless of environment                       │
│ BookService.getBooks()  ← Works in dev & prod              │
│                                                              │
│ Advantages:                                                  │
│ ✓ No if/else in components                                  │
│ ✓ Service handles complexity                                │
│ ✓ Easy to swap implementations                              │
│ ✓ Testing is simple                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Debug Information Flow

### When enableDebug = true

```
npm start
  ↓
config.enableDebug = true
  ↓
useLogger hooks enable console logging
  ↓
Components call log(), error(), warn()
  ↓
Messages printed to console
  ↓
Developer sees:
  [BooksList] Component mounted
  [BookService] Fetching books from Mock API
  [BooksList] Books fetched (3 items)
  ↓
DebugPanel component renders
  ↓
Shows in bottom-right:
  Environment: development
  API URL: http://localhost:8080/api
  Mock API: ✅ ON
  Logging: ✅ ON
```

### When enableDebug = false

```
NODE_ENV=production npm run build
  ↓
config.enableDebug = false
  ↓
useLogger hooks disable console logging
  ↓
Components call log(), error(), warn()
  ↓
Messages NOT printed (silently ignored)
  ↓
Developer sees: (nothing in console)
  ↓
DebugPanel component returns null
  ↓
Shows in bottom-right: (nothing)
  ↓
Clean production environment
```

---

## Integration Points

```
┌──────────────────────────────────────────────────────────────┐
│                    Where config is used                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ BookService.js         → Decides mock vs real API            │
│ useLogger hook         → Enables/disables logging            │
│ useEnvironment hook    → Provides env info                   │
│ DebugPanel.jsx         → Shows/hides debug UI                │
│ App.jsx                → Shows/hides indicators              │
│ BooksList.jsx          → Conditional rendering               │
│                                                               │
│ Total integration points: 6+                                 │
│ All controlled by: 1 config module                           │
│ Changed via: NODE_ENV environment variable                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Change Propagation

```
NODE_ENV environment variable change
        ↓
config/index.js reads new value
        ↓
Returns different config object
        ↓
All components using config get new values
        ↓
Services adapt behavior
        ↓
Hooks change behavior
        ↓
UI updates accordingly
        ↓
Single change affects entire app
```

---

## Benefits Summary

```
┌──────────────────────────────────────────────────────────────┐
│                   Benefits of Multi-Env Design               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ 1. OFFLINE DEVELOPMENT                                       │
│    No backend required to develop UI                         │
│    Mock data always available                                │
│    No network latency during development                     │
│                                                               │
│ 2. FEATURE TESTING                                           │
│    Test features without hitting real API                    │
│    Control test data                                         │
│    No risk of modifying production data                      │
│                                                               │
│ 3. DEBUGGING                                                 │
│    Detailed logging in development                           │
│    Debug panel shows configuration                           │
│    Easy to trace issues                                      │
│                                                               │
│ 4. CLEAN PRODUCTION                                          │
│    No debug UI in production                                 │
│    Minimal logging for performance                           │
│    Professional user experience                              │
│                                                               │
│ 5. SINGLE CODEBASE                                           │
│    Same code runs in all environments                        │
│    Configuration controls behavior                           │
│    Easy to maintain                                          │
│                                                               │
│ 6. EASY TESTING                                              │
│    Mock services for unit tests                              │
│    Predictable test data                                     │
│    No external dependencies                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## See Also

- [MULTIENV_CODE_DESIGN.md](MULTIENV_CODE_DESIGN.md) - Design patterns
- [MULTIENV_IMPLEMENTATION.md](MULTIENV_IMPLEMENTATION.md) - Working code examples
- [ENVIRONMENT_PROFILES.md](ENVIRONMENT_PROFILES.md) - Configuration setup
