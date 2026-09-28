# Environment Profiles & Secrets Management Guide

How to use different configurations for different environments while keeping secrets secure.

---

## Table of Contents

1. [Environment Variable Basics](#environment-variable-basics)
2. [Local Development with Secrets](#local-development-with-secrets)
3. [Different Environment Profiles](#different-environment-profiles)
4. [Secrets Management Strategies](#secrets-management-strategies)
5. [Production Deployment](#production-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)

---

## Environment Variable Basics

### How React Exposes Variables

Only variables with `REACT_APP_` prefix are exposed to the frontend:

```javascript
// ✅ Available in browser
const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

// ❌ NOT available in browser (security!)
const databaseUrl = process.env.DATABASE_URL;
const privateKey = process.env.PRIVATE_KEY;
```

### Why This Matters

```
.env files are BUILT INTO the bundle at build time
├── Public information: API URLs, feature flags
├── Secrets NOT recommended in .env files
└── Secrets should come from: CI/CD, environment, deployment platform
```

---

## Local Development with Secrets

### Option 1: Local .env Files (For Development Only)

**File Structure:**
```
.env                 ← Local dev (git-ignored)
.env.example         ← Template (committed)
.env.production      ← Production (git-ignored)
.env.staging         ← Staging (git-ignored)
```

**`.env.example` (SAFE - committed to git):**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_MOCK_API=false

# Replace with your actual values
REACT_APP_API_KEY=your_api_key_here
REACT_APP_AUTH_TOKEN=your_token_here
```

**`.env` (LOCAL - git-ignored):**
```env
# Copy from .env.example and add your local secrets
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_KEY=my-local-dev-key-12345
REACT_APP_AUTH_TOKEN=my-local-token-xyz
```

**`.gitignore` (Ensure these are ignored):**
```
# Environment variables
.env
.env.local
.env.*.local
.env.development.local
```

**Setup Steps:**
```bash
# 1. Copy template
cp .env.example .env

# 2. Edit .env with your local secrets
nano .env

# 3. Start dev server
npm start

# 4. .env is loaded, secrets are available
```

---

### Option 2: Environment Injection (Safer - Recommended)

Instead of storing secrets in `.env` files, inject them at runtime:

**`.env` (Safe defaults only):**
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG=false
```

**Load secrets from shell/environment:**

**Windows PowerShell:**
```powershell
# Set environment variable for session
$env:REACT_APP_API_KEY = "my-secret-key"
$env:REACT_APP_AUTH_TOKEN = "my-token"

# Then start React
npm start
```

**macOS/Linux:**
```bash
# Set environment variables
export REACT_APP_API_KEY="my-secret-key"
export REACT_APP_AUTH_TOKEN="my-token"

# Then start React
npm start
```

**Or create a `.env.local` (git-ignored):**
```env
REACT_APP_API_KEY=my-secret-key
REACT_APP_AUTH_TOKEN=my-token
```

---

## Different Environment Profiles

### Strategy 1: Multiple .env Files

Create separate `.env` files for each environment:

```
.env.development    ← Dev environment
.env.staging        ← Staging environment
.env.production     ← Production environment
.env                ← Default/local
```

**`.env.development` (Can commit - no secrets):**
```env
NODE_ENV=development
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=30000
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_LOGGING=true
```

**`.env.staging` (Don't commit - has staging secrets):**
```env
NODE_ENV=staging
REACT_APP_API_URL=https://staging-api.yourdomain.com/api
REACT_APP_API_TIMEOUT=30000
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=true
REACT_APP_API_KEY=staging-key-from-secret-manager
REACT_APP_AUTH_TOKEN=staging-token-from-secret-manager
```

**`.env.production` (Don't commit - has prod secrets):**
```env
NODE_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_API_TIMEOUT=60000
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=false
REACT_APP_API_KEY=prod-key-from-secret-manager
REACT_APP_AUTH_TOKEN=prod-token-from-secret-manager
```

**How React Loads .env Files:**

When you run `npm start` with `NODE_ENV=staging`:
```
1. Load .env                    (default values)
2. Load .env.staging            (override with staging)
3. Load .env.staging.local      (override with local staging)
```

**Usage:**
```bash
# Development
npm start                                    # Uses .env.development

# Staging
NODE_ENV=staging npm start                  # Uses .env.staging

# Production (build time)
NODE_ENV=production npm run build           # Uses .env.production
```

---

### Strategy 2: Environment Variable Chaining

Create a config file that handles environment logic:

**`src/config.js`:**
```javascript
// Config object based on environment
const config = {
  development: {
    apiUrl: 'http://localhost:8080/api',
    apiTimeout: 30000,
    enableDebug: true,
    enableLogging: true,
    apiKey: process.env.REACT_APP_API_KEY || 'dev-key',
    authToken: process.env.REACT_APP_AUTH_TOKEN || 'dev-token',
  },
  staging: {
    apiUrl: 'https://staging-api.yourdomain.com/api',
    apiTimeout: 30000,
    enableDebug: false,
    enableLogging: true,
    apiKey: process.env.REACT_APP_API_KEY,
    authToken: process.env.REACT_APP_AUTH_TOKEN,
  },
  production: {
    apiUrl: 'https://api.yourdomain.com/api',
    apiTimeout: 60000,
    enableDebug: false,
    enableLogging: false,
    apiKey: process.env.REACT_APP_API_KEY,  // Must come from environment
    authToken: process.env.REACT_APP_AUTH_TOKEN,  // Must come from environment
  },
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration
export default config[env];
```

**Usage in Components:**
```javascript
import config from './config';

// Use config
const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'X-API-Key': config.apiKey,
    'Authorization': `Bearer ${config.authToken}`,
  },
});

if (config.enableDebug) {
  console.log('Debug mode enabled');
}
```

---

## Secrets Management Strategies

### ❌ What NOT to Do

```javascript
// ❌ DON'T: Hardcode secrets in code
const API_KEY = 'super-secret-key-12345';
const AUTH_TOKEN = 'secret-token-xyz';

// ❌ DON'T: Commit .env files with secrets to git
// These files will be exposed in git history forever

// ❌ DON'T: Put secrets in JavaScript visible to browser
// Anything in browser is visible to users (check DevTools)
```

### ✅ Recommended Approaches

#### 1. **Local Development: .env.local (Not Committed)**

```
Development machine only
├── .env                    ← Safe defaults (committed)
├── .env.local              ← Local secrets (git-ignored)
└── node_modules/
```

**`.env` (committed):**
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG=true
```

**`.env.local` (not committed):**
```env
REACT_APP_API_KEY=my-local-key
REACT_APP_AUTH_TOKEN=my-local-token
```

**`.gitignore` (ensure it's ignored):**
```
.env.local
.env.*.local
```

#### 2. **Staging/Production: CI/CD Secrets**

Never commit `.env.staging` or `.env.production` to git.

Instead, use CI/CD platform's secret management:

**GitHub Actions Example:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        env:
          REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
          REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}
          REACT_APP_AUTH_TOKEN: ${{ secrets.PROD_AUTH_TOKEN }}
        run: npm run build
      
      - name: Deploy
        run: |
          # Deploy build/ folder
```

**Vercel Example:**
```
Project Settings → Environment Variables

Name: REACT_APP_API_URL
Value: https://api.yourdomain.com/api
Environments: Production

Name: REACT_APP_API_KEY
Value: (paste from secret manager)
Environments: Production

Name: REACT_APP_AUTH_TOKEN
Value: (paste from secret manager)
Environments: Production
```

**Netlify Example:**
```
Site settings → Build & deploy → Environment

REACT_APP_API_URL
REACT_APP_API_KEY
REACT_APP_AUTH_TOKEN

Or link to secrets in secret manager
```

#### 3. **Production: Secret Manager**

Use dedicated secret management for production:

**Options:**
- AWS Secrets Manager
- Azure Key Vault
- Google Cloud Secret Manager
- HashiCorp Vault
- 1Password, LastPass
- Doppler, Snyk, etc.

**Workflow:**
```
Secret Manager
    ↓ (at build time)
CI/CD Pipeline
    ↓ (inject as env vars)
Build Process
    ↓ (embed in bundle)
Deployed App
```

---

## Production Deployment

### Deployment Workflow

```
1. Developer commits code
   ├── .env.example (only safe values)
   └── .eslintrc.json, package.json, etc.

2. CI/CD Pipeline starts
   ├── Retrieves secrets from Secret Manager
   ├── Sets environment variables
   ├── npm run build (secrets embedded in bundle)
   └── Uploads build/ folder

3. Production Server
   ├── Serves static build
   ├── JavaScript includes secrets (at build time)
   └── Users access app
```

### Security Considerations

**What gets bundled:**
```javascript
// In production bundle:
const apiUrl = 'https://api.yourdomain.com/api';
const apiKey = 'prod-key-12345';  // ⚠️ Visible in bundle!

// Anything in REACT_APP_ is visible to anyone
// who inspects the JavaScript
```

**What doesn't get bundled:**
```javascript
// NOT in bundle (safe):
const dbPassword = process.env.DATABASE_PASSWORD;
const privateKey = process.env.PRIVATE_KEY;

// These are only available on server
```

**Best Practice:**
- ✅ Public API endpoints in REACT_APP_
- ✅ Public API keys in REACT_APP_ (if service allows)
- ❌ Database credentials (never in REACT_APP_)
- ❌ Private keys (never in REACT_APP_)
- ❌ Sensitive authentication secrets (use backend instead)

---

## CI/CD Pipeline

### GitHub Actions Example

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint & Format Check
        run: |
          npm run lint
          npm run format:check
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build with production secrets
        env:
          REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
          REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}
          REACT_APP_AUTH_TOKEN: ${{ secrets.PROD_AUTH_TOKEN }}
          REACT_APP_SENTRY_DSN: ${{ secrets.PROD_SENTRY_DSN }}
        run: npm run build
      
      - name: Upload to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_KEY }}
        run: aws s3 sync build/ s3://my-bucket/ --delete
      
      - name: Invalidate CloudFront
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_KEY }}
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
      
      - name: Notify deployment
        if: success()
        run: echo "✅ Deployed to production"
```

**Store secrets in GitHub:**
```
Repository Settings → Secrets and variables → Actions

PROD_API_URL      https://api.yourdomain.com/api
PROD_API_KEY      (from secret manager)
PROD_AUTH_TOKEN   (from secret manager)
AWS_ACCESS_KEY    (from AWS)
AWS_SECRET_KEY    (from AWS)
CLOUDFRONT_ID     (your distribution)
```

---

## Complete Example: Multi-Environment Setup

### File Structure

```
project/
├── .env                       ← Defaults (committed)
├── .env.example               ← Template (committed)
├── .env.development           ← Dev config (can commit)
├── .env.staging               ← Staging (DON'T commit)
├── .env.production            ← Prod (DON'T commit)
├── .env.local                 ← Local overrides (git-ignored)
├── .env.staging.local         ← Local staging (git-ignored)
├── .env.production.local      ← Local prod (git-ignored)
│
├── src/
│   ├── config.js              ← Configuration management
│   ├── utils/
│   │   └── api.js             ← API client using config
│   └── App.jsx
│
├── .github/
│   └── workflows/
│       ├── build.yml          ← Build on every commit
│       └── deploy.yml         ← Deploy on push to main
│
└── .gitignore                 ← Ensure .env.* files ignored
```

### Files Content

**`.gitignore`:**
```
# Environment files (secrets)
.env
.env.local
.env.*.local
.env.production
.env.staging

# Build outputs
node_modules/
build/
dist/
coverage/
```

**`.env.example`:**
```env
# Safe defaults - everyone can see these
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_LOGGING=true

# These need to be set locally or via CI/CD
# REACT_APP_API_KEY=your_key_here
# REACT_APP_AUTH_TOKEN=your_token_here
```

**`.env.production` (locally created, not committed):**
```env
NODE_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_LOGGING=false

# These are injected by CI/CD, not stored here
REACT_APP_API_KEY=will-be-injected-by-ci
REACT_APP_AUTH_TOKEN=will-be-injected-by-ci
```

**`src/config.js`:**
```javascript
const environments = {
  development: {
    apiUrl: 'http://localhost:8080/api',
    enableDebug: true,
    enableLogging: true,
    apiKey: process.env.REACT_APP_API_KEY || 'dev-key',
  },
  production: {
    apiUrl: 'https://api.yourdomain.com/api',
    enableDebug: false,
    enableLogging: false,
    apiKey: process.env.REACT_APP_API_KEY,  // Must be injected
  },
};

const env = process.env.NODE_ENV || 'development';
export default environments[env];
```

**`src/utils/api.js`:**
```javascript
import axios from 'axios';
import config from '../config';

export const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'X-API-Key': config.apiKey,
  },
});

if (config.enableDebug) {
  console.log('API Config:', config);
}

export default api;
```

### Running Different Environments

**Development (local):**
```bash
# 1. Create .env.local with local secrets
echo "REACT_APP_API_KEY=my-local-key" > .env.local

# 2. Start dev server
npm start

# Uses: .env → .env.local
```

**Staging (CI/CD):**
```bash
# GitHub Actions automatically injects secrets
env:
  NODE_ENV=staging
  REACT_APP_API_URL=https://staging-api.yourdomain.com
  REACT_APP_API_KEY=${{ secrets.STAGING_API_KEY }}

npm run build
```

**Production (CI/CD):**
```bash
# GitHub Actions injects production secrets
env:
  NODE_ENV=production
  REACT_APP_API_URL=https://api.yourdomain.com
  REACT_APP_API_KEY=${{ secrets.PROD_API_KEY }}

npm run build
```

---

## Checklist: Secure Environment Setup

- [ ] Create `.env.example` with safe defaults (committed to git)
- [ ] Add `.env`, `.env.*.local` to `.gitignore`
- [ ] Create `.env` locally with development secrets
- [ ] Test: `npm start` loads secrets correctly
- [ ] Setup CI/CD secrets (GitHub/Vercel/Netlify)
- [ ] Test: CI/CD build uses injected secrets
- [ ] Never commit `.env.production` or `.env.staging` with real secrets
- [ ] Use secret manager for production
- [ ] Document which variables are required
- [ ] Rotate secrets regularly
- [ ] Monitor secret access in production

---

## Common Mistakes & Solutions

### ❌ Problem: Secrets committed to git
```bash
# This happened! Secrets in git history forever
git log --all --full-history -- ".env.production"

# Solution:
# 1. Revoke exposed secrets immediately
# 2. Use BFG Repo-Cleaner to remove from history
# 3. Re-add secrets from secret manager
```

### ❌ Problem: Secrets not available in build
```bash
# Secrets only injected at runtime, not at build time
# React build embeds vars at build time, not runtime!

# Solution:
# Inject secrets BEFORE npm run build
export REACT_APP_API_KEY="value"
npm run build  # ✅ Now key is embedded
```

### ❌ Problem: Public API key exposed
```javascript
// API key visible in browser
const apiKey = 'sk-1234567890abcdef';  // Visible to all users!

// Solution:
// Option 1: Use authentication instead
// Option 2: Rotate key if exposed
// Option 3: Use proxy/backend for sensitive calls
```

### ❌ Problem: Development and production using same secrets
```bash
# Development data affected by production code
npm start  # Accidentally uses production API!

# Solution:
# Always use different API keys for different environments
# .env.local for development
# .env.production for production
```

---

## Summary

**Local Development:**
- Store secrets in `.env.local` (git-ignored)
- Copy template from `.env.example`

**Staging/Production:**
- Use CI/CD secret management
- Inject secrets at build time
- Never commit real secrets

**Key Principle:**
```
Secrets at Build Time (for React)
├── Environment variables
├── CI/CD platform secrets
└── Secret managers

NOT in Version Control
├── No .env with secrets
├── No hardcoded credentials
└── No exposed API keys
```

---

**For your specific setup, see next file: ENVIRONMENT_PROFILES.md**
