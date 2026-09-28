# Environment Profiles with Secrets - Visual Guide

**Answer to: "How does React use different profiles for different environments with secrets not in git?"**

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT                         │
├─────────────────────────────────────────────────────────────┤
│ .env (safe defaults)                                         │
│ .env.local (YOUR SECRET - git-ignored)                      │
│ .env.development (dev config)                               │
│          ↓                                                   │
│ npm start                                                    │
│          ↓                                                   │
│ Loads: process.env.REACT_APP_API_KEY = "your-dev-secret"  │
│          ↓                                                   │
│ src/config.js reads environment variables                   │
│          ↓                                                   │
│ Components use config                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         STAGING                             │
├─────────────────────────────────────────────────────────────┤
│ GitHub Actions triggered (push to staging branch)           │
│          ↓                                                   │
│ GitHub retrieves secrets from Secret Manager                │
│ ├── STAGING_API_URL                                         │
│ ├── STAGING_API_KEY                                         │
│ └── STAGING_AUTH_TOKEN                                      │
│          ↓                                                   │
│ Sets environment variables                                  │
│ NODE_ENV=staging npm run build                              │
│          ↓                                                   │
│ React embeds secrets in bundle                              │
│ (variables are built-in, not dynamic)                       │
│          ↓                                                   │
│ Deploy build/ folder to staging server                      │
│          ↓                                                   │
│ Users download app with embedded staging secrets            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       PRODUCTION                            │
├─────────────────────────────────────────────────────────────┤
│ GitHub Actions triggered (push to main branch)              │
│          ↓                                                   │
│ GitHub retrieves secrets from Secret Manager                │
│ ├── PROD_API_URL                                            │
│ ├── PROD_API_KEY                                            │
│ └── PROD_AUTH_TOKEN                                         │
│          ↓                                                   │
│ Sets environment variables                                  │
│ NODE_ENV=production npm run build                           │
│          ↓                                                   │
│ React embeds secrets in bundle                              │
│          ↓                                                   │
│ Deploy build/ folder to production CDN                      │
│          ↓                                                   │
│ Users download app with embedded production secrets         │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparison: Local vs CI/CD

### Local Development (Your Machine)

```
File Structure:
├── .env               ← Safe defaults
├── .env.example       ← Template (in git)
└── .env.local         ← YOUR SECRETS (git-ignored, only on your machine)

What happens:
npm start
  ↓
React loads .env + .env.local
  ↓
process.env.REACT_APP_API_KEY = (value from your .env.local)
  ↓
JavaScript running in DevTools can access your secrets
  ↓
Only on YOUR machine - not shared

Git status:
$ git status
On branch main
nothing to commit
(because .env.local is in .gitignore)
```

### Staging/Production (CI/CD Platform)

```
File Structure:
├── .env (safe defaults)
├── .env.example (template)
└── (NO .env.staging, NO .env.production in git)

What happens:
GitHub Actions workflow triggered
  ↓
Retrieves secrets from GitHub Secrets Manager
  ↓
Sets environment variables during build:
   REACT_APP_API_KEY=${{ secrets.STAGING_API_KEY }}
  ↓
npm run build
  ↓
React embeds the secret in the JavaScript bundle
  ↓
Deployed to server
  ↓
Users download app with embedded secret

Git status:
$ git status
On branch main
nothing to commit
(secrets never in git)
```

---

## Three Different Scenarios

### Scenario 1: You're Working Locally

```
Your Machine:
  .env ..................... REACT_APP_API_URL=http://localhost:8080
  .env.local ............... REACT_APP_API_KEY=your-local-dev-key
  (git-ignored)

$ npm start

process.env.REACT_APP_API_KEY = "your-local-dev-key"
(Only accessible on YOUR machine)

Your Teammate:
  .env ..................... REACT_APP_API_URL=http://localhost:8080
  .env.local ............... REACT_APP_API_KEY=their-own-dev-key
  (git-ignored, different from yours)

$ npm start

process.env.REACT_APP_API_KEY = "their-own-dev-key"
(Only accessible on THEIR machine)

Git:
No .env.local in repository - both developers have different local secrets
```

### Scenario 2: Pushing to Staging

```
You:
$ git push origin feature-branch

GitHub:
Receives push
  ↓
Workflow triggered: .github/workflows/deploy.yml
  ↓
Reads GitHub Secrets:
  ├── STAGING_API_URL = "https://staging-api.example.com"
  ├── STAGING_API_KEY = "staging-key-xyz"
  └── STAGING_AUTH_TOKEN = "staging-token-abc"
  ↓
env:
  NODE_ENV: staging
  REACT_APP_API_URL: ${{ secrets.STAGING_API_URL }}
  REACT_APP_API_KEY: ${{ secrets.STAGING_API_KEY }}
  ↓
npm run build
  ↓
Creates: build/index.js containing:
  const apiUrl = "https://staging-api.example.com"
  const apiKey = "staging-key-xyz"
  ↓
Uploads build/ to staging server
```

### Scenario 3: Merging to Production

```
You:
$ git push origin main

GitHub:
Receives push
  ↓
Workflow triggered: .github/workflows/deploy.yml
  ↓
Reads GitHub Secrets:
  ├── PROD_API_URL = "https://api.example.com"
  ├── PROD_API_KEY = "prod-key-123"
  └── PROD_AUTH_TOKEN = "prod-token-456"
  ↓
env:
  NODE_ENV: production
  REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
  REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}
  ↓
npm run build
  ↓
Creates: build/index.js containing:
  const apiUrl = "https://api.example.com"
  const apiKey = "prod-key-123"
  ↓
Uploads build/ to production server
```

---

## How Environment Variables Flow

```
┌─────────────────────────────────────────────────────────┐
│ STAGE 1: Inject Variables (at build time)               │
├─────────────────────────────────────────────────────────┤
│ Source: .env files or CI/CD secrets                     │
│ Example: REACT_APP_API_KEY=my-secret-key                │
│          ↓                                               │
│ Target: process.env during build                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 2: Build JavaScript (npm run build)               │
├─────────────────────────────────────────────────────────┤
│ React replaces all process.env.REACT_APP_* references   │
│ Example: process.env.REACT_APP_API_KEY                  │
│          becomes: "my-secret-key"                       │
│                                                         │
│ Result: build/index.js                                  │
│ const apiKey = "my-secret-key"  ← Hardcoded!            │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 3: Deploy (static files)                          │
├─────────────────────────────────────────────────────────┤
│ Upload build/ folder to server                          │
│ It's just static HTML/JS/CSS now                        │
│ No secrets are injected at runtime                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 4: Users Download App                             │
├─────────────────────────────────────────────────────────┤
│ Browser downloads JavaScript                            │
│ Can see secrets in source code (if they inspect)        │
│ Secrets are embedded, not dynamic                       │
└─────────────────────────────────────────────────────────┘
```

---

## Key Insight: Build-Time vs Runtime

### ❌ WRONG: Expecting runtime injection

```javascript
// This doesn't work!
// process.env variables are NOT loaded at runtime
// They're replaced during build!

import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL  // ❌
});

// At runtime, this is already:
// const api = axios.create({ baseURL: "https://api.example.com" })
// Cannot change after build!
```

### ✅ RIGHT: Understanding build-time replacement

```javascript
// At BUILD time:
// process.env.REACT_APP_API_URL = "https://api.example.com"
//
// Result AFTER build:
// const apiUrl = "https://api.example.com"  ← Hardcoded in bundle!

import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Bundle contains:
// const api = axios.create({ baseURL: "https://api.example.com" })
```

---

## File Lifecycle

```
Development

.env.local created
    ↓
$ npm start
    ↓
.env.local is READ
    ↓
process.env populated
    ↓
config.js reads process.env
    ↓
Components use config
    ↓
DEV SERVER (running, not built)


Staging/Production

$ git push
    ↓
GitHub Actions triggered
    ↓
Retrieve secrets from GitHub Secrets
    ↓
$ npm run build with secrets
    ↓
build/ folder created (hardcoded secrets)
    ↓
Upload build/ to server
    ↓
User downloads app (secrets embedded)


Important:
- npm start = NOT built, variables loaded dynamically
- npm run build = Built once, variables embedded permanently
- Deployed app = Cannot change secrets without rebuild
```

---

## The Secret Sandwich

```
┌──────────────────────────────────────┐
│ Secret comes from 1 of 3 places:     │
├──────────────────────────────────────┤
│                                      │
│ Local Dev:                           │
│ .env.local ← You create manually     │
│                                      │
│ Staging:                             │
│ GitHub Secrets ← Stored in GitHub    │
│                                      │
│ Production:                          │
│ GitHub Secrets ← Stored in GitHub    │
│                                      │
└──────────────────────────────────────┘
         ↓ (all paths lead here)
┌──────────────────────────────────────┐
│ At build time:                       │
│ process.env.REACT_APP_API_KEY        │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ React build process:                 │
│ Replaces with actual value           │
│ const apiKey = "the-actual-secret"   │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Result in build/index.js:            │
│ Hardcoded: const apiKey = "..."      │
│ Cannot change without rebuild        │
└──────────────────────────────────────┘
```

---

## Security: What's Visible Where?

```
┌─────────────────────────────────────────────────────────────┐
│ Visible in Git (❌ Should NOT have secrets)                │
├─────────────────────────────────────────────────────────────┤
│ .env (safe defaults)          ✅ OK
│ .env.example (template)       ✅ OK
│ .env.local (secrets)          ❌ Git-ignored!
│ .env.production (secrets)     ❌ Git-ignored!
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Visible in CI/CD Secrets (✅ This is the right place)      │
├─────────────────────────────────────────────────────────────┤
│ GitHub Secrets                ✅ Encrypted in GitHub
│ Vercel Secrets                ✅ Encrypted in Vercel
│ Netlify Secrets               ✅ Encrypted in Netlify
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Visible in Deployed App (⚠️ Cannot avoid if using REACT_APP_)
├─────────────────────────────────────────────────────────────┤
│ Browser can inspect source code           ⚠️
│ JavaScript contains hardcoded secrets     ⚠️
│ Users can see in DevTools                 ⚠️
│                                                             │
│ SOLUTION: Only use REACT_APP_ for:                         │
│ - Public API URLs                                          │
│ - Public API keys (if service allows)                      │
│ - Feature flags                                            │
│ - NOT for database passwords                              │
│ - NOT for private keys                                     │
│ - NOT for sensitive auth tokens                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary Comparison Table

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Secrets Source** | `.env.local` (local file) | GitHub Secrets | GitHub Secrets |
| **Git Contains Secrets** | ❌ No (git-ignored) | ❌ No (git-ignored) | ❌ No (git-ignored) |
| **When Injected** | At `npm start` | At build time | At build time |
| **How Stored** | Plain text local file | Encrypted in GitHub | Encrypted in GitHub |
| **Only Your Machine?** | ✅ Yes | ❌ In bundle | ❌ In bundle |
| **Example File** | `.env.local` | (N/A in git) | (N/A in git) |
| **Setup Cost** | 2 minutes | 5 minutes | 5 minutes |
| **Rotation** | Manual | Manual | Manual |

---

## Quick Decision Tree

```
I'm developing locally
  ├─ Create .env.local
  └─ Add REACT_APP_API_KEY=your-key

I'm deploying to staging
  ├─ Add secret to GitHub: Settings → Secrets
  ├─ Add to workflow: env: REACT_APP_API_KEY: ${{ secrets.STAGING_KEY }}
  └─ npm run build will use it

I'm deploying to production
  ├─ Add secret to GitHub: Settings → Secrets
  ├─ Add to workflow: env: REACT_APP_API_KEY: ${{ secrets.PROD_KEY }}
  └─ npm run build will use it

I accidentally committed .env with secrets
  ├─ Revoke the secrets immediately
  ├─ Remove from git history (BFG Repo-Cleaner)
  └─ Create new secrets in secret manager
```

---

## See Full Documentation

- [ENVIRONMENT_QUICK_START.md](ENVIRONMENT_QUICK_START.md) - Implementation in 5 minutes
- [ENVIRONMENT_PROFILES.md](ENVIRONMENT_PROFILES.md) - Complete working example with code
- [SECRETS_MANAGEMENT.md](SECRETS_MANAGEMENT.md) - Security best practices and strategies
