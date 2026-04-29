# Team Setup Guide - DormTalk

## 🚨 Common Issue: "It's not working!"

If you cloned the repo and copied `.env.local` but the app won't run, you're probably missing **Step 3** below (installing dependencies).

## 📋 Complete Setup Steps for New Team Members

### Step 1: Install Node.js ✅ (You did this!)

Make sure you have Node.js installed:

```bash
node --version
# Should show v18.x or higher
```

If not installed, download from: https://nodejs.org/

### Step 2: Clone Repository & Copy Environment File ✅ (You did this!)

```bash
# Clone the repo
git clone https://github.com/DylanKane17/DormTalk.git
cd DormTalk

# Copy the .env.local file
# (You already did this)
```

### Step 3: Install Dependencies ⚠️ **MOST LIKELY MISSING!**

**This is the step most people forget!**

```bash
npm install
```

This command:

- Reads `package.json`
- Downloads all required packages (Next.js, React, Supabase, Tailwind, etc.)
- Creates a `node_modules` folder with ~300MB of dependencies
- Creates/updates `package-lock.json`

**Without this step, the app CANNOT run!**

### Step 4: Verify .env.local File

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kqqowyynjnkvrlcowwod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcW93eXluam5rdnJsY293d29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTU0NjgsImV4cCI6MjA5MDM5MTQ2OH0.lSb1R-NOW9t5La4pCXYsKD6RxN5phRCYy6dGOeBTCWY
```

**Important**: This file should be in the root directory (same level as `package.json`)

### Step 5: Run the Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.2.1
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 6: Open in Browser

Navigate to: http://localhost:3000

You should see the DormTalk homepage!

## 🐛 Troubleshooting Common Issues

### Issue 1: "npm: command not found"

**Problem**: Node.js/npm not installed properly

**Solution**:

```bash
# On macOS with Homebrew
brew install node

# Or download installer from nodejs.org
```

### Issue 2: "Cannot find module 'next'"

**Problem**: Dependencies not installed

**Solution**:

```bash
npm install
```

### Issue 3: "EACCES: permission denied"

**Problem**: Permission issues with npm

**Solution**:

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Then try again
npm install
```

### Issue 4: "Port 3000 already in use"

**Problem**: Another app is using port 3000

**Solution**:

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Issue 5: ".env.local not found" or "Invalid Supabase URL"

**Problem**: Environment file missing or in wrong location

**Solution**:

```bash
# Make sure .env.local is in the root directory
ls -la .env.local

# Should show the file
# If not, create it with the correct values
```

### Issue 6: "Module not found: Can't resolve '@supabase/supabase-js'"

**Problem**: Dependencies corrupted or not fully installed

**Solution**:

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 7: Build errors or TypeScript errors

**Problem**: Cache issues or outdated dependencies

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try running again
npm run dev
```

## 📁 What Should Be in Your Project Folder?

After proper setup, you should have:

```
DormTalk/
├── .env.local                 ✅ (copied from team)
├── .gitignore                 ✅ (from repo)
├── node_modules/              ✅ (created by npm install)
├── package.json               ✅ (from repo)
├── package-lock.json          ✅ (created by npm install)
├── next.config.mjs            ✅ (from repo)
├── tailwind.config.js         ✅ (from repo)
├── src/                       ✅ (from repo)
├── public/                    ✅ (from repo)
└── ... (other files)
```

**Key point**: `node_modules/` folder should exist and be ~300MB in size!

## ✅ Quick Verification Checklist

Run these commands to verify your setup:

```bash
# 1. Check Node.js is installed
node --version
# Should show: v18.x or higher

# 2. Check npm is installed
npm --version
# Should show: 9.x or higher

# 3. Check you're in the right directory
pwd
# Should end with: /DormTalk or /dorm-talk

# 4. Check .env.local exists
cat .env.local
# Should show the Supabase credentials

# 5. Check node_modules exists
ls node_modules
# Should show many folders (next, react, @supabase, etc.)

# 6. Try running the dev server
npm run dev
# Should start without errors
```

## 🎯 Step-by-Step for Your Group Member

Tell them to run these exact commands:

```bash
# 1. Navigate to the project folder
cd path/to/DormTalk

# 2. Install dependencies (THIS IS THE KEY STEP!)
npm install

# 3. Verify .env.local exists
cat .env.local

# 4. Run the development server
npm run dev

# 5. Open browser to http://localhost:3000
```

## 🔄 Updating Code from GitHub

When pulling new changes from the repo:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Clear cache if needed
rm -rf .next

# 4. Run the dev server
npm run dev
```

## 💡 Pro Tips

1. **Always run `npm install` after cloning** - This is the #1 forgotten step!

2. **Keep .env.local private** - Never commit this file to GitHub

3. **Use the same Node version** - Check with `node --version`

4. **Clear cache when weird errors occur** - Delete `.next` folder

5. **Check the terminal output** - Error messages usually tell you what's wrong

## 🆘 Still Not Working?

If you've followed all steps and it's still not working:

1. **Share the exact error message** - Copy the full error from terminal

2. **Check what command failed**:
   - `npm install` failed? → Node.js/npm issue
   - `npm run dev` failed? → Dependencies or code issue
   - Browser shows error? → Supabase connection issue

3. **Verify file structure**:

   ```bash
   ls -la
   # Should show .env.local, package.json, src/, etc.
   ```

4. **Check Node.js version**:

   ```bash
   node --version
   # Should be v18 or higher
   ```

5. **Try a clean install**:
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run dev
   ```

## 📞 Getting Help

When asking for help, provide:

1. **Operating System**: macOS, Windows, Linux?
2. **Node.js version**: Output of `node --version`
3. **Error message**: Full error from terminal
4. **What step failed**: npm install? npm run dev? Browser?
5. **What you've tried**: List the troubleshooting steps you've done

## Summary

**The most common issue is forgetting to run `npm install`!**

The complete setup is:

1. ✅ Install Node.js
2. ✅ Clone repo
3. ⚠️ **Run `npm install`** ← Most people forget this!
4. ✅ Copy .env.local
5. ✅ Run `npm run dev`
6. ✅ Open http://localhost:3000

That's it! 🎉
