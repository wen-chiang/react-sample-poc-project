# Installation Guide

This guide will help you set up Node.js, npm, and NVM for the React Sample POC Project.

## Table of Contents

- [Windows Installation](#windows-installation)
- [macOS Installation](#macos-installation)
- [Linux Installation](#linux-installation)
- [Verify Installation](#verify-installation)
- [Project Setup](#project-setup)

---

## Windows Installation

### Option 1: Using NVM for Windows

**NVM for Windows** allows you to manage multiple Node.js versions.

#### Step 1: Download NVM for Windows

1. Visit: [nvm-windows releases](https://github.com/coreybutler/nvm-windows/releases)
2. Download the latest `nvm-setup.exe` (e.g., `nvm-setup.exe`)
3. Run the installer and follow the prompts

#### Step 2: Close and Reopen Terminal

After installation, close your terminal/PowerShell and reopen it.

#### Step 3: Install Node.js Using NVM

```powershell
# Install the latest LTS version
nvm install latest

# Or install a specific version
nvm install 18.17.0

# List installed versions
nvm list

# Switch to a specific version
nvm use 18.17.0
```

#### Step 4: Verify Installation

```powershell
node --version
npm --version
```

### Option 2: Direct Node.js Installation

If you prefer not to use NVM:

1. Visit: [nodejs.org](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer
4. Follow the installation wizard
5. Check the box to install npm

#### Verify Installation

```powershell
node --version
npm --version
```

---

## macOS Installation

### Option 1: Using NVM (Recommended)

#### Step 1: Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install NVM

```bash
brew install nvm
```

#### Step 3: Configure Shell

Add NVM to your shell profile. Open your shell configuration file:

```bash
# For Zsh (default on macOS)
nano ~/.zshrc

# For Bash
nano ~/.bash_profile
```

Add these lines:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"
```

Press `Ctrl+X`, then `Y`, then `Enter` to save and exit.

#### Step 4: Reload Shell

```bash
source ~/.zshrc  # or source ~/.bash_profile
```

#### Step 5: Install Node.js

```bash
# Install the latest LTS version
nvm install node

# Or install a specific version
nvm install 18.17.0

# Set default version
nvm alias default 18.17.0

# List installed versions
nvm list
```

#### Step 6: Verify Installation

```bash
node --version
npm --version
```

### Option 2: Using Homebrew Directly

```bash
# Install Node.js (includes npm)
brew install node

# Verify
node --version
npm --version
```

### Option 3: Direct Download

1. Visit: [nodejs.org](https://nodejs.org/)
2. Download the macOS Installer (LTS)
3. Run the installer and follow prompts
4. Verify installation as shown above

---

## Linux Installation

### Option 1: Using NVM (Recommended)

#### Step 1: Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### Step 2: Reload Shell

```bash
source ~/.bashrc
```

Or close and reopen your terminal.

#### Step 3: Install Node.js

```bash
# Install the latest LTS version
nvm install node

# Or install a specific version
nvm install 18.17.0

# Set default version
nvm alias default 18.17.0

# List installed versions
nvm list
```

#### Step 4: Verify Installation

```bash
node --version
npm --version
```

### Option 2: Using Package Manager

#### Ubuntu/Debian

```bash
# Update package manager
sudo apt update

# Install Node.js (includes npm)
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

#### Fedora/RHEL

```bash
# Install Node.js (includes npm)
sudo dnf install nodejs

# Verify
node --version
npm --version
```

#### Arch Linux

```bash
# Install Node.js (includes npm)
sudo pacman -S nodejs npm

# Verify
node --version
npm --version
```

---

## Verify Installation

After installation, verify everything is working:

```bash
# Check Node.js version
node --version
# Expected: v18.x.x or higher

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Check npm registry
npm config get registry
# Expected: https://registry.npmjs.org/
```

---

## Project Setup

Once Node.js and npm are installed, set up the React project:

### Step 1: Navigate to Project Directory

```bash
cd c:\Work-Zone\react-sample-poc-project
# or on macOS/Linux
cd ~/Work-Zone/react-sample-poc-project
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- React 18
- React DOM 18
- React Router DOM 6
- Material-UI (MUI)
- Axios
- React Hook Form
- And more...

### Step 3: Start Development Server

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

### Step 4: (Optional) Make Sure Backend is Running

For full functionality, ensure your backend API is running at `http://localhost:8080`

---

## Troubleshooting

### NVM not found (Windows)

- Make sure you ran the installer as Administrator
- Close and reopen your terminal completely
- Restart your computer if needed

### NVM not found (macOS/Linux)

- Run `source ~/.bashrc` or `source ~/.zshrc`
- Check that NVM was added to your shell profile
- Restart your terminal

### npm ERR! code ERESOLVE

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install --legacy-peer-deps
```

### Permission Denied (Linux/macOS)

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH
export PATH=~/.npm-global/bin:$PATH
```

### Port 3000 Already in Use

```bash
# Use a different port
PORT=3001 npm start
```

---

## Next Steps

1. ✅ Install Node.js and npm
2. ✅ Run `npm install`
3. ✅ Run `npm start`
4. 📖 See [README.md](README.md) for more information
5. 🚀 Start building!

---

## Useful npm Commands

```bash
# Install dependencies
npm install

# Install specific package
npm install package-name

# Install development dependency
npm install --save-dev package-name

# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# List installed packages
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update

# Uninstall package
npm uninstall package-name
```

---

## Resources

- [Node.js Official Website](https://nodejs.org/)
- [npm Official Website](https://www.npmjs.com/)
- [NVM for Windows](https://github.com/coreybutler/nvm-windows)
- [NVM for macOS/Linux](https://github.com/nvm-sh/nvm)
- [npm Documentation](https://docs.npmjs.com/)
