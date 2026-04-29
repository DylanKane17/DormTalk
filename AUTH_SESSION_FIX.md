# Authentication Session Fix - "App thinks I'm not logged in"

## Problem

The app shows you as logged out even though you successfully signed in. This happens when authentication sessions aren't being stored or retrieved properly across different computers.

## Common Causes

1. **Browser cookies disabled or blocked**
2. **Localhost vs 127.0.0.1 mismatch**
3. **Browser cache/storage issues**
4. **Different browser security settings**
5. **Incognito/Private mode**
6. **Browser extensions blocking cookies**

## Quick Fixes (Try These First)

### Fix 1: Clear Browser Data and Retry

```bash
# 1. Stop the dev server (Ctrl+C)

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart the dev server
npm run dev

# 4. In browser:
# - Open DevTools (F12)
# - Go to Application tab
# - Clear all storage:
#   - Cookies
#   - Local Storage
#   - Session Storage
# - Close DevTools
# - Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

# 5. Try logging in again
```

### Fix 2: Use Consistent URL

**Problem**: Switching between `localhost` and `127.0.0.1` breaks cookies

**Solution**: Always use the same URL

```bash
# If you started with localhost:3000, always use:
http://localhost:3000

# Don't switch to:
http://127.0.0.1:3000
```

### Fix 3: Check Browser Settings

1. **Disable "Block third-party cookies"**
   - Chrome: Settings → Privacy → Cookies → Allow all cookies
   - Firefox: Settings → Privacy → Standard
   - Safari: Preferences → Privacy → Uncheck "Prevent cross-site tracking"

2. **Disable browser extensions temporarily**
   - Privacy Badger, uBlock Origin, etc. can block cookies
   - Try in a fresh browser profile or incognito mode (but allow cookies)

3. **Check if cookies are being set**
   - Open DevTools (F12)
   - Go to Application → Cookies → http://localhost:3000
   - Look for cookies starting with `sb-` (Supabase cookies)
   - If no cookies appear after login, that's the problem

### Fix 4: Try a Different Browser

Sometimes browser-specific issues occur. Try:

- Chrome
- Firefox
- Safari
- Edge

### Fix 5: Check .env.local File

Make sure the environment variables are correct:

```bash
# View your .env.local
cat .env.local

# Should show:
NEXT_PUBLIC_SUPABASE_URL=https://kqqowyynjnkvrlcowwod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: These must be EXACTLY the same as the original. No extra spaces, no line breaks.

## Advanced Troubleshooting

### Check 1: Verify Supabase Connection

Open browser console (F12 → Console) and run:

```javascript
// Check if environment variables are loaded
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Has Anon Key:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

If these show `undefined`, your `.env.local` file isn't being loaded.

### Check 2: Test Authentication Manually

1. Go to `/auth-test` page (if it exists)
2. Or open browser console and check:

```javascript
// Check if user is logged in
const {
  data: { user },
} = await supabase.auth.getUser();
console.log("Current user:", user);
```

### Check 3: Inspect Network Requests

1. Open DevTools → Network tab
2. Try logging in
3. Look for requests to `supabase.co`
4. Check if they return 200 status
5. Look for `Set-Cookie` headers in responses

### Check 4: Verify Cookie Domain

In DevTools → Application → Cookies:

- Cookies should be set for `localhost` domain
- Path should be `/`
- SameSite should be `Lax` or `None`

## Platform-Specific Issues

### macOS

```bash
# If using Safari, enable developer mode
defaults write com.apple.Safari IncludeInternalDebugMenu 1

# Clear DNS cache (sometimes helps)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Windows

```bash
# Clear DNS cache
ipconfig /flushdns

# Make sure localhost resolves correctly
ping localhost
# Should show 127.0.0.1
```

### Linux

```bash
# Check /etc/hosts file
cat /etc/hosts
# Should have: 127.0.0.1 localhost

# Clear browser cache
rm -rf ~/.cache/google-chrome
rm -rf ~/.mozilla/firefox/*.default*/cache2
```

## Nuclear Option: Complete Reset

If nothing else works:

```bash
# 1. Stop the dev server
# Press Ctrl+C

# 2. Delete all generated files
rm -rf node_modules
rm -rf .next
rm package-lock.json

# 3. Reinstall everything
npm install

# 4. Clear ALL browser data
# In browser: Settings → Clear browsing data → All time → Everything

# 5. Restart computer (yes, really)

# 6. Start fresh
npm run dev

# 7. Try logging in again
```

## Debugging Checklist

Run through this checklist:

- [ ] `.env.local` file exists in root directory
- [ ] `.env.local` has correct Supabase URL and key
- [ ] Ran `npm install` successfully
- [ ] Using consistent URL (always localhost:3000)
- [ ] Browser cookies are enabled
- [ ] No browser extensions blocking cookies
- [ ] Cleared browser cache and storage
- [ ] Cleared `.next` folder
- [ ] Restarted dev server
- [ ] Hard refreshed browser (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Checked browser console for errors
- [ ] Verified Supabase cookies are being set
- [ ] Tried different browser
- [ ] Tried incognito mode (with cookies enabled)

## Still Not Working?

### Collect This Information:

1. **Operating System**: macOS / Windows / Linux?
2. **Browser**: Chrome / Firefox / Safari / Edge?
3. **Browser Version**: Check in browser settings
4. **Node.js Version**: Run `node --version`
5. **Error Messages**: Any errors in browser console?
6. **Cookies Present**: Are `sb-` cookies visible in DevTools?
7. **Network Requests**: Do auth requests return 200?

### Common Error Messages:

| Error                     | Cause                  | Solution                           |
| ------------------------- | ---------------------- | ---------------------------------- |
| "Invalid API key"         | Wrong .env.local       | Copy correct file                  |
| "CORS error"              | Wrong Supabase URL     | Check .env.local                   |
| "Session expired"         | Cookies not persisting | Clear cache, check cookie settings |
| "User not found"          | Database issue         | Check Supabase dashboard           |
| No error, just logged out | Cookie storage issue   | Try different browser              |

## Prevention Tips

1. **Always use the same URL** - Don't switch between localhost and 127.0.0.1
2. **Keep .env.local in sync** - Use the same file across all team members
3. **Clear cache when switching branches** - Run `rm -rf .next` after git pull
4. **Use a consistent browser** - Pick one browser for development
5. **Don't use incognito mode** - Unless you're testing, use normal mode

## Working Setup Verification

Your setup is working correctly if:

✅ After login, you see your username in the navigation
✅ You can access `/my-posts` without being redirected
✅ Browser DevTools shows `sb-` cookies under Application → Cookies
✅ Refreshing the page keeps you logged in
✅ Opening a new tab shows you as logged in

## Quick Test Script

Run this in your browser console after "logging in":

```javascript
// Test if session is working
const checkAuth = async () => {
  const response = await fetch("/api/auth/session");
  const data = await response.json();
  console.log("Session data:", data);

  // Check cookies
  const cookies = document.cookie.split(";").filter((c) => c.includes("sb-"));
  console.log("Supabase cookies:", cookies);

  if (cookies.length === 0) {
    console.error("❌ No Supabase cookies found! This is the problem.");
  } else {
    console.log("✅ Cookies are present");
  }
};

checkAuth();
```

## Summary

The "not logged in" issue is almost always caused by:

1. **Browser cookies not being stored** (most common)
2. **URL inconsistency** (localhost vs 127.0.0.1)
3. **Browser cache issues**
4. **Wrong .env.local file**

**Quick fix**: Clear everything (cache, cookies, .next folder), restart dev server, use consistent URL, try logging in again.
