# Quick Start: Environment Profiles with Secrets

**Answer to: "How to use React with different profiles for different environments where values come from secrets, not git?"**

---

## The Short Answer

```
Development:     Secrets in .env.local (git-ignored, local machine only)
Staging:         Secrets injected by CI/CD at build time
Production:      Secrets injected by CI/CD at build time
```

**Core Principle:**
> Environment variables are embedded in the React bundle at build time. Secrets are never stored in git; they come from CI/CD platform's secret manager or environment.

---

## Quick Implementation (5 Minutes)

### 1. Create Configuration File

**`src/config.js`:**
```javascript
// Environment-specific configuration
const config = {
  development: {
    apiUrl: 'http://localhost:8080/api',
    apiKey: process.env.REACT_APP_API_KEY || 'dev-key',
    enableDebug: true,
  },
  staging: {
    apiUrl: 'https://staging-api.yourdomain.com/api',
    apiKey: process.env.REACT_APP_API_KEY,  // From CI/CD secret
    enableDebug: false,
  },
  production: {
    apiUrl: 'https://api.yourdomain.com/api',
    apiKey: process.env.REACT_APP_API_KEY,  // From CI/CD secret
    enableDebug: false,
  },
};

const env = process.env.NODE_ENV || 'development';
export default config[env];
```

### 2. Create .env Files

**`.env.example`** (commit to git - template)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_KEY=your_key_here
```

**`.env`** (commit - safe defaults)
```env
# Default values, no secrets
```

**`.env.local`** (git-ignore - local secrets)
```env
REACT_APP_API_KEY=my-local-secret-key-12345
```

**`.env.production`** (git-ignore, not needed if using CI/CD)
```env
# Secrets come from CI/CD, not stored here
```

### 3. Update .gitignore

```gitignore
.env
.env.local
.env.*.local
.env.production
.env.staging
```

### 4. Use in Components

```javascript
import config from './config';
import axios from 'axios';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'X-API-Key': config.apiKey,
  },
});

export default function App() {
  console.log('Using API:', config.apiUrl);
  if (config.enableDebug) {
    console.log('Debug mode ON');
  }
  return <div>App</div>;
}
```

### 5. Setup CI/CD Secrets

**GitHub Actions** `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      # Inject secrets from GitHub Secrets
      - run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          REACT_APP_API_KEY: ${{ secrets.API_KEY }}
      
      - run: npm run deploy  # Your deployment script
```

**Add secrets to GitHub:**
```
Settings → Secrets and variables → Actions

API_URL = https://api.yourdomain.com/api
API_KEY = (paste your production API key here)
```

Done! ✅

---

## How It Works

### Local Development Flow

```
1. npm start
   ↓
2. Load .env (defaults)
3. Load .env.development (or .env by default)
4. Load .env.local (YOUR LOCAL SECRETS)
   ↓
5. React app has process.env.REACT_APP_API_KEY from .env.local
   ↓
6. src/config.js reads process.env
   ↓
7. Components use config with YOUR local secrets
```

### Production Build Flow (CI/CD)

```
1. Code pushed to GitHub main branch
   ↓
2. GitHub Actions triggered
   ↓
3. GitHub retrieves secrets:
   ├── REACT_APP_API_URL
   ├── REACT_APP_API_KEY
   └── REACT_APP_AUTH_TOKEN
   ↓
4. Sets them as environment variables:
   env:
     REACT_APP_API_URL: ${{ secrets.API_URL }}
     REACT_APP_API_KEY: ${{ secrets.API_KEY }}
   ↓
5. npm run build (React embeds these values in bundle)
   ↓
6. build/ folder contains hardcoded values:
   const apiUrl = "https://api.yourdomain.com/api"
   const apiKey = "prod-key-12345"
   ↓
7. Deploy build/ folder to production server
   ↓
8. Users download JavaScript with embedded secrets
```

---

## Three Environment Examples

### Development (Local Machine)

```bash
# Setup
cp .env.example .env.local
echo "REACT_APP_API_KEY=my-dev-key" >> .env.local

# Run
npm start

# Loads: process.env.REACT_APP_API_KEY = "my-dev-key"
```

### Staging (GitHub Actions)

```yaml
- name: Build Staging
  env:
    REACT_APP_API_URL: ${{ secrets.STAGING_API_URL }}
    REACT_APP_API_KEY: ${{ secrets.STAGING_API_KEY }}
  run: npm run build
```

**GitHub Secrets:**
```
STAGING_API_URL = https://staging-api.yourdomain.com/api
STAGING_API_KEY = staging-key-from-secret-manager
```

### Production (GitHub Actions)

```yaml
- name: Build Production
  env:
    REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
    REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}
  run: npm run build
```

**GitHub Secrets:**
```
PROD_API_URL = https://api.yourdomain.com/api
PROD_API_KEY = prod-key-from-secret-manager
```

---

## Where Do Secrets Come From?

### Development
- ✅ Local machine: `.env.local` file
- ✅ Team share: Ask teammate for local `.env.local`

### Staging/Production
- ✅ GitHub Secrets (via Settings → Secrets)
- ✅ Vercel Environment Variables (via Dashboard)
- ✅ Netlify Environment Variables (via Dashboard)
- ✅ AWS Systems Manager Parameter Store
- ✅ Google Cloud Secret Manager
- ✅ Azure Key Vault
- ✅ Any CI/CD platform's secret manager

### NOT from:
- ❌ Git repository (never!)
- ❌ Hardcoded in code (never!)
- ❌ Public shared files (never!)

---

## File Structure

```
project/
├── .env                    ← Safe defaults (committed)
├── .env.example            ← Template (committed)
├── .env.local              ← Local secrets (git-ignored) ⭐
├── .env.production         ← (git-ignored, optional)
├── .gitignore              ← Ensure .env* ignored
│
├── src/
│   ├── config.js           ← Config module ⭐
│   ├── utils/api.js        ← API client using config
│   └── App.jsx             ← Uses config
│
└── .github/workflows/
    └── deploy.yml          ← CI/CD secrets injection ⭐
```

---

## Common Questions

### Q: Where should I store the production secrets?
**A:** In your CI/CD platform's secret manager (GitHub Secrets, Vercel, Netlify, etc.). Never commit them to git.

### Q: Can I use the same secret for dev, staging, and prod?
**A:** ❌ No! Use different keys for each environment. If one is compromised, you can rotate just that one.

### Q: What if I accidentally commit `.env` with secrets?
**A:** 
1. Revoke the exposed secrets immediately
2. Remove from git history: `git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' -r`
3. Add new secrets to secret manager
4. Force push: `git push -u origin main --force` ⚠️ (be careful!)

### Q: How do I test different environment configs?
**A:** 
```bash
# Test development
npm start                              # Uses .env.local

# Test staging
NODE_ENV=staging npm run build
npx serve -s build

# Test production
NODE_ENV=production npm run build
npx serve -s build
```

### Q: Can secrets be accessed from the browser?
**A:** ⚠️ **Yes!** Any REACT_APP_ variable is embedded in the JavaScript and visible to browser users. 
- ✅ OK: Public API URLs, public API keys, feature flags
- ❌ NOT OK: Database passwords, private keys, internal tokens

### Q: How often should I rotate secrets?
**A:** 
- Development: Monthly
- Staging: Monthly
- Production: Every 3 months (or after exposure)

---

## Troubleshooting

### Problem: Secrets not loading in dev

```bash
# Check that .env.local exists
ls -la .env.local

# Check content
cat .env.local

# Restart dev server
npm start

# Verify in browser console
console.log(process.env.REACT_APP_API_KEY)
```

### Problem: Build works locally but not in CI/CD

**Solution:** CI/CD doesn't have your `.env.local` file. Add secrets to CI/CD platform:

```yaml
- run: npm run build
  env:
    REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}  # ← Must come from secrets
```

### Problem: Different behavior in dev vs production

**Solution:** Check NODE_ENV and verify config file:

```javascript
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('config:', require('./config').default);
```

### Problem: "Cannot find module .env.local"

**This is OK!** .env.local is optional. React will just use .env instead.

If you NEED the file:
```bash
cp .env.example .env.local
```

---

## Security Best Practices

1. ✅ Never commit `.env*` files with secrets
2. ✅ Use `.gitignore` to prevent accidents
3. ✅ Use different secrets for each environment
4. ✅ Rotate secrets regularly
5. ✅ Use secret manager for production
6. ✅ Log secrets in production (never!)
7. ✅ Use HTTPS everywhere
8. ✅ Validate/sanitize environment variables

---

## Real-World Example

**Your Setup:**

```javascript
// src/config.js
export default {
  development: {
    apiUrl: 'http://localhost:8080/api',
    apiKey: process.env.REACT_APP_API_KEY,  // From .env.local
    dbUrl: 'http://localhost:27017',
  },
  production: {
    apiUrl: 'https://api.yourdomain.com/api',
    apiKey: process.env.REACT_APP_API_KEY,  // From CI/CD secret
    dbUrl: undefined,  // NOT exposed to frontend
  },
}[process.env.NODE_ENV || 'development'];
```

**Your .env files:**

```
.env (committed)
├── No secrets

.env.local (git-ignored, local machine)
├── REACT_APP_API_KEY=my-dev-key-12345

.env.example (committed, template)
├── REACT_APP_API_KEY=your_key_here
```

**Your CI/CD:**

```yaml
# .github/workflows/deploy.yml
- run: npm run build
  env:
    REACT_APP_API_KEY: ${{ secrets.PROD_API_KEY }}
```

**Your GitHub Secrets:**
```
PROD_API_KEY = (actual production key from secret manager)
```

**Flow:**
```
Local Dev:
npm start → reads .env.local → process.env.REACT_APP_API_KEY = "my-dev-key-12345"

Production:
GitHub Actions → reads secrets → npm run build → builds with PROD_API_KEY
```

---

## Next Steps

1. Create `src/config.js` with your environments
2. Create `.env`, `.env.example`, `.env.local`
3. Update `.gitignore` to exclude `.env*`
4. Setup CI/CD secrets in GitHub/Vercel/Netlify
5. Test local dev: `npm start`
6. Test CI/CD build: Push to main branch

---

## See Also

- [SECRETS_MANAGEMENT.md](SECRETS_MANAGEMENT.md) - Detailed security guide
- [ENVIRONMENT_PROFILES.md](ENVIRONMENT_PROFILES.md) - Complete implementation guide
- [CONFIGURATION.md](CONFIGURATION.md) - Configuration reference
