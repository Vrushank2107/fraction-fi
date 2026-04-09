# Neon Database Setup for Main Domain

## Current Status
- You have a Neon database connection
- Main website: https://fraction-fi.vercel.app/
- Need to configure database to work with main domain

## Steps to Configure Neon Database

### 1. Add Neon Database URL to Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `fraction-fi`
3. Go to Settings > Environment Variables
4. Add these variables:
   ```
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://fraction-fi.vercel.app
   ```

### 2. Neon Database Connection String Format
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### 3. Update Frontend API Configuration
The frontend should call the main domain API endpoints:
- Registration: `https://fraction-fi.vercel.app/api/auth/register`
- Login: `https://fraction-fi.vercel.app/api/auth/login`

### 4. Test Database Connection
After setting up environment variables:
1. Redeploy the project
2. Test registration at https://fraction-fi.vercel.app/register
3. Check Vercel function logs for database connection status

## Current Configuration
- Frontend uses mock API as fallback
- Backend updated to use real database
- CORS configured for main domain
- JWT token generation with fallback secret

## Next Steps
1. Add DATABASE_URL to Vercel environment variables
2. Redeploy to activate database connection
3. Test registration and login with real database storage
