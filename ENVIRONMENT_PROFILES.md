# Environment Profiles Implementation

Complete working example of environment profiles for your React app.

---

## Quick Overview

```
Development    → .env.development + .env.local
Staging        → Injected by CI/CD secrets
Production     → Injected by CI/CD secrets
```

---

## Step-by-Step Setup

### Step 1: Create .env Files

**`.env`** (Safe defaults - commit to git)
```env
# Default values for all environments
REACT_APP_API_TIMEOUT=30000
REACT_APP_VERSION=0.1.0
```

**`.env.example`** (Template - commit to git)
```env
# ===== API Configuration =====
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_KEY=your_api_key_here
REACT_APP_AUTH_TOKEN=your_auth_token_here

# ===== Feature Flags =====
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_MOCK_API=false

# ===== App Configuration =====
REACT_APP_APP_NAME=React Sample POC
REACT_APP_VERSION=0.1.0
REACT_APP_API_TIMEOUT=30000

# ===== Monitoring (optional) =====
# REACT_APP_SENTRY_DSN=
# REACT_APP_ANALYTICS_ID=
```

**`.env.development`** (Development environment - can commit)
```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_MOCK_API=true
```

**`.env.staging`** (Staging environment - DO NOT commit with secrets)
```env
NODE_ENV=staging
REACT_APP_API_URL=https://staging-api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=true
REACT_APP_ENABLE_MOCK_API=false
# Secrets injected by CI/CD:
# REACT_APP_API_KEY=
# REACT_APP_AUTH_TOKEN=
```

**`.env.production`** (Production environment - DO NOT commit with secrets)
```env
NODE_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=false
REACT_APP_ENABLE_MOCK_API=false
# Secrets injected by CI/CD:
# REACT_APP_API_KEY=
# REACT_APP_AUTH_TOKEN=
```

**`.env.local`** (Local overrides - git-ignored)
```env
# Override anything for your local machine
REACT_APP_API_KEY=your-local-dev-key
REACT_APP_AUTH_TOKEN=your-local-dev-token
```

### Step 2: Update .gitignore

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging
.env.staging.local
.env.production.local

# Don't ignore templates
!.env.example
!.env.development
```

### Step 3: Create Configuration Module

**`src/config/index.js`:**
```javascript
/**
 * Environment-based configuration
 * Supports: development, staging, production
 */

const configs = {
  development: {
    // API
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    apiKey: process.env.REACT_APP_API_KEY || 'dev-key',
    authToken: process.env.REACT_APP_AUTH_TOKEN || 'dev-token',
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),

    // Feature flags
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
    enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
    enableMockApi: process.env.REACT_APP_ENABLE_MOCK_API === 'true',

    // App info
    appName: process.env.REACT_APP_APP_NAME || 'React Sample',
    version: process.env.REACT_APP_VERSION || '0.1.0',

    // Monitoring (optional)
    sentryDsn: process.env.REACT_APP_SENTRY_DSN || null,
    analyticsId: process.env.REACT_APP_ANALYTICS_ID || null,
  },

  staging: {
    // API
    apiUrl: process.env.REACT_APP_API_URL,
    apiKey: process.env.REACT_APP_API_KEY,  // Must be provided
    authToken: process.env.REACT_APP_AUTH_TOKEN,  // Must be provided
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),

    // Feature flags
    enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
    enableLogging: process.env.REACT_APP_ENABLE_LOGGING === 'true',
    enableMockApi: false,

    // App info
    appName: process.env.REACT_APP_APP_NAME || 'React Sample (Staging)',
    version: process.env.REACT_APP_VERSION || '0.1.0',

    // Monitoring
    sentryDsn: process.env.REACT_APP_SENTRY_DSN || null,
    analyticsId: process.env.REACT_APP_ANALYTICS_ID || null,
  },

  production: {
    // API
    apiUrl: process.env.REACT_APP_API_URL,
    apiKey: process.env.REACT_APP_API_KEY,  // Must be provided
    authToken: process.env.REACT_APP_AUTH_TOKEN,  // Must be provided
    apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '60000'),

    // Feature flags
    enableDebug: false,
    enableLogging: false,
    enableMockApi: false,

    // App info
    appName: process.env.REACT_APP_APP_NAME || 'React Sample',
    version: process.env.REACT_APP_VERSION || '0.1.0',

    // Monitoring
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    analyticsId: process.env.REACT_APP_ANALYTICS_ID,
  },
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Get config for environment
const config = configs[env];

// Validate required variables
if (!config) {
  throw new Error(`Unknown environment: ${env}`);
}

// Warn if required variables are missing in production
if (env === 'production') {
  const required = ['apiUrl', 'apiKey', 'authToken'];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    console.error(
      '❌ Missing required environment variables in production:',
      missing
    );
    throw new Error('Missing production environment variables');
  }
}

// Log config in debug mode
if (config.enableDebug) {
  console.log(`✅ Loaded ${env} environment:`, {
    apiUrl: config.apiUrl,
    enableDebug: config.enableDebug,
    enableLogging: config.enableLogging,
    // Don't log secrets!
  });
}

export default config;
```

### Step 4: Create API Client

**`src/utils/api.js`:**
```javascript
import axios from 'axios';
import config from '../config';

/**
 * Create API client with environment-specific config
 */
export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': config.apiKey,
    'Authorization': `Bearer ${config.authToken}`,
  },
});

/**
 * Request interceptor - add logging if enabled
 */
api.interceptors.request.use((request) => {
  if (config.enableLogging) {
    console.log('📤 API Request:', {
      method: request.method,
      url: request.url,
      data: request.data,
    });
  }
  return request;
});

/**
 * Response interceptor - handle responses
 */
api.interceptors.response.use(
  (response) => {
    if (config.enableLogging) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (config.enableLogging) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 5: Use in Components

**`src/App.jsx`:**
```javascript
import { useEffect, useState } from 'react';
import api from './utils/api';
import config from './config';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use config throughout the app
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', config.apiUrl);
    console.log('Debug Mode:', config.enableDebug);

    // Fetch data using API client
    if (!config.enableMockApi) {
      api
        .get('/books')
        .then((res) => setData(res.data))
        .catch((err) => setError(err.message));
    } else {
      // Use mock data in development
      setData([
        { id: 1, title: 'Mock Book 1' },
        { id: 2, title: 'Mock Book 2' },
      ]);
    }
  }, []);

  return (
    <div>
      <h1>{config.appName} v{config.version}</h1>

      {config.enableDebug && (
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
          <h3>🐛 Debug Info</h3>
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>API URL: {config.apiUrl}</p>
          <p>Mock API: {config.enableMockApi ? 'ON' : 'OFF'}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

## Running Different Environments

### Development (Local)

```bash
# 1. Setup local environment
cp .env.example .env.local

# 2. Edit with your local secrets (git-ignored)
cat >> .env.local << EOF
REACT_APP_API_KEY=my-local-key-12345
REACT_APP_AUTH_TOKEN=my-local-token-xyz
EOF

# 3. Start dev server
npm start

# Loads: .env → .env.development → .env.local
```

### Staging (CI/CD)

**GitHub Actions Workflow:**
```yaml
name: Deploy to Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Build for staging
        env:
          NODE_ENV: staging
          REACT_APP_API_URL: ${{ secrets.STAGING_API_URL }}
          REACT_APP_API_KEY: ${{ secrets.STAGING_API_KEY }}
          REACT_APP_AUTH_TOKEN: ${{ secrets.STAGING_AUTH_TOKEN }}
        run: npm run build
      
      - name: Deploy to staging server
        run: |
          # Your deployment script here
          scp -r build/* user@staging.yourdomain.com:/var/www/app/
```

**GitHub Secrets Setup:**
```
Settings → Secrets and variables → Actions

Name: STAGING_API_URL
Value: https://staging-api.yourdomain.com/api

Name: STAGING_API_KEY
Value: (your staging API key)

Name: STAGING_AUTH_TOKEN
Value: (your staging auth token)
```

### Production (CI/CD)

**GitHub Actions Workflow:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Lint & Test
        run: |
          npm run lint
          npm run test:coverage
      
      - name: Build for production
        env:
          NODE_ENV: production
          REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
          REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}
          REACT_APP_AUTH_TOKEN: ${{ secrets.PROD_AUTH_TOKEN }}
          REACT_APP_SENTRY_DSN: ${{ secrets.PROD_SENTRY_DSN }}
        run: npm run build
      
      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_KEY }}
        run: |
          aws s3 sync build/ s3://my-bucket/ --delete
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_ID }} \
            --paths "/*"
```

**GitHub Secrets Setup (Production):**
```
Settings → Secrets and variables → Actions

PROD_API_URL
PROD_API_KEY
PROD_AUTH_TOKEN
PROD_SENTRY_DSN
AWS_ACCESS_KEY
AWS_SECRET_KEY
CLOUDFRONT_ID
```

---

## Vercel Deployment

**`vercel.json`:**
```json
{
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_API_KEY": "@react_app_api_key",
    "REACT_APP_AUTH_TOKEN": "@react_app_auth_token"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}
```

**Vercel Dashboard:**
```
Project Settings → Environment Variables

Development
├── REACT_APP_API_URL: http://localhost:8080/api
├── REACT_APP_API_KEY: dev-key
└── REACT_APP_AUTH_TOKEN: dev-token

Preview (Staging)
├── REACT_APP_API_URL: https://staging-api.yourdomain.com/api
├── REACT_APP_API_KEY: (staging key)
└── REACT_APP_AUTH_TOKEN: (staging token)

Production
├── REACT_APP_API_URL: https://api.yourdomain.com/api
├── REACT_APP_API_KEY: (prod key)
└── REACT_APP_AUTH_TOKEN: (prod token)
```

---

## Netlify Deployment

**`netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  REACT_APP_API_URL = "https://api.yourdomain.com/api"

[context.development]
[context.development.environment]
  REACT_APP_API_URL = "http://localhost:8080/api"
  REACT_APP_ENABLE_DEBUG = "true"

[context.deploy-preview]
[context.deploy-preview.environment]
  REACT_APP_API_URL = "https://staging-api.yourdomain.com/api"
```

**Netlify UI:**
```
Site settings → Build & deploy → Environment

REACT_APP_API_URL
REACT_APP_API_KEY
REACT_APP_AUTH_TOKEN

Click "Edit variables" for each branch/context
```

---

## Testing Environments

**`src/__tests__/config.test.js`:**
```javascript
import config from '../config';

describe('Configuration', () => {
  it('should load development config', () => {
    process.env.NODE_ENV = 'development';
    expect(config.enableDebug).toBe(true);
  });

  it('should load production config without debug', () => {
    process.env.NODE_ENV = 'production';
    expect(config.enableDebug).toBe(false);
  });

  it('should have API URL', () => {
    expect(config.apiUrl).toBeDefined();
    expect(config.apiUrl).toMatch(/^https?:\/\//);
  });

  it('should throw if production variables missing', () => {
    process.env.NODE_ENV = 'production';
    process.env.REACT_APP_API_KEY = '';
    expect(() => require('../config')).toThrow();
  });
});
```

---

## Checklist

- [ ] Create `.env`, `.env.example`, `.env.development`
- [ ] Create `.env.staging` and `.env.production` (don't commit)
- [ ] Update `.gitignore` to exclude `.env.*`
- [ ] Create `src/config/index.js` configuration module
- [ ] Create `src/utils/api.js` API client using config
- [ ] Test: `npm start` loads development config
- [ ] Test: `NODE_ENV=staging npm run build` uses staging config
- [ ] Setup CI/CD secrets (GitHub, Vercel, Netlify, etc.)
- [ ] Test: CI/CD build uses injected secrets
- [ ] Document required environment variables

---

## Diagram: How Environment Profiles Work

```
Local Development
├── .env (defaults)
├── .env.development (dev config)
└── .env.local (local secrets, git-ignored)
    ↓
npm start
    ↓
src/config/index.js loads from process.env
    ↓
config object with development settings
    ↓
api.js uses config
    ↓
Components use config


Staging (CI/CD)
├── GitHub Actions triggered on push to staging
├── Retrieves secrets from GitHub Secrets
├── Sets NODE_ENV=staging
├── npm run build (embeds secrets in bundle)
└── Deploys build/


Production (CI/CD)
├── GitHub Actions triggered on push to main
├── Retrieves secrets from GitHub Secrets
├── Sets NODE_ENV=production
├── npm run build (embeds secrets in bundle)
└── Deploys build/ to S3/CDN
```

---

**Next: See SECRETS_MANAGEMENT.md for security best practices**
