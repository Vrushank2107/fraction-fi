# Database Setup Guide

## Problem
The database is not working because:
- No DATABASE_URL environment variable is set in Vercel
- Backend deployment is missing or misconfigured
- Mock database fallback returns empty results

## Solutions

### Option 1: Use Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (fraction-fi)
3. Go to "Storage" tab
4. Click "Create Database"
5. Choose "Postgres" and follow setup
6. Copy the connection string
7. Go to project "Settings" > "Environment Variables"
8. Add `DATABASE_URL` with the connection string

### Option 2: Use Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy the connection string
5. Add `DATABASE_URL` to Vercel environment variables

### Option 3: Use Railway
1. Create account at [railway.app](https://railway.app)
2. Create new PostgreSQL service
3. Get connection string
4. Add `DATABASE_URL` to Vercel environment variables

## Environment Variables Needed
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://fraction-fi.vercel.app
```

## After Setup
1. Redeploy the backend
2. Test database connection
3. Verify registration stores data in database

## Current Status
- Mock API is working for authentication
- Real database connection needs to be established
- Backend deployment needs to be fixed
