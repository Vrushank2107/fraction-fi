# Quick Fix for Vercel Authentication Issue

## Problem
Your Vercel account has authentication enabled, which redirects all API calls to an authentication page instead of serving the API.

## Solution Options

### Option 1: Disable Vercel Authentication (Recommended)
1. Go to https://vercel.com/dashboard
2. Select each project (fractionfi, fractionfi-api, blockchain)
3. Go to Settings → Protection
4. Disable "Vercel Authentication"
5. Save changes

### Option 2: Use Local Development (Immediate Fix)
Run the backend locally and update frontend to use localhost:

```bash
# Terminal 1: Start backend
cd /Users/vs/Vrushank/FractionFi/backend
npm install
npm run dev

# Terminal 2: Update frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > /Users/vs/Vrushank/FractionFi/frontend/.env.local
cd /Users/vs/Vrushank/FractionFi/frontend
npm run dev
```

### Option 3: Use Alternative Hosting
Deploy to Railway, Render, or other platforms that don't require authentication.

## Current Working URLs (After Disabling Auth)
- Frontend: https://fractionfi-kc1smpwg5-vrushank.vercel.app
- Backend: https://fractionfi-jdawhfz93-vrushank.vercel.app
- Blockchain: https://blockchain-g6ffd74hm-vrushank.vercel.app

## Test Login API
Once authentication is disabled, test with:
```bash
curl -X POST https://fractionfi-jdawhfz93-vrushank.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```
