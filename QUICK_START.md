# 🚀 Quick Start - DormTalk

## For New Team Members

### The 5-Step Setup (Takes 5 minutes)

```bash
# 1. Navigate to project folder
cd path/to/DormTalk

# 2. Install dependencies ⚠️ DON'T SKIP THIS!
npm install

# 3. Verify .env.local exists
ls .env.local

# 4. Run the app
npm run dev

# 5. Open browser
# Go to: http://localhost:3000
```

## ⚠️ Most Common Issue

**Error**: "Cannot find module 'next'" or similar

**Cause**: You forgot to run `npm install`

**Fix**: Run `npm install` in the project directory

## 📋 What You Need

- ✅ Node.js v18+ installed
- ✅ GitHub repo cloned
- ✅ `.env.local` file in root directory
- ✅ Run `npm install` (creates `node_modules/` folder)

## 🆘 Quick Troubleshooting

| Problem                  | Solution                                       |
| ------------------------ | ---------------------------------------------- |
| "npm: command not found" | Install Node.js from nodejs.org                |
| "Cannot find module"     | Run `npm install`                              |
| "Port 3000 in use"       | Run `lsof -ti:3000 \| xargs kill -9`           |
| ".env.local not found"   | Copy file to root directory                    |
| Still broken?            | Run `rm -rf node_modules .next && npm install` |

## 📖 Full Documentation

See `TEAM_SETUP_GUIDE.md` for detailed instructions and troubleshooting.

---

**TL;DR**: Clone repo → Copy .env.local → Run `npm install` → Run `npm run dev` → Open localhost:3000
