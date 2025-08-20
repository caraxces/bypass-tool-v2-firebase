# Firebase Deployment Guide

## Prerequisites

1. **Firebase CLI**: Install globally with `npm install -g firebase-tools`
2. **Firebase Account**: Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
3. **Node.js 18+**: Required for Firebase Functions

## Setup Steps

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase Project
```bash
firebase init
```

Select the following options:
- Choose "Hosting" and "Functions"
- Select your Firebase project
- Use "packages/frontend/out" as public directory
- Configure as single-page app: Yes
- Use existing project: Yes (select your project)

### 3. Update Project ID
Edit `.firebaserc` and replace "bypass-tool-pro" with your actual Firebase project ID.

### 4. Environment Variables
For Firebase Functions, you'll need to set environment variables:
```bash
firebase functions:config:set database.url="YOUR_DATABASE_URL"
```

## Deployment Commands

### Deploy Everything
```bash
pnpm deploy
```

### Deploy Only Frontend (Hosting)
```bash
pnpm deploy:frontend
```

### Deploy Only Backend (Functions)
```bash
pnpm deploy:backend
```

## Database Setup

For production, you'll need a PostgreSQL database. Options:
1. **Supabase** (Free tier available)
2. **Neon** (Free tier available)
3. **Railway** (Free tier available)

Update the DATABASE_URL in Firebase Functions config after deployment.

## Access URLs

After deployment:
- **Frontend**: `https://your-project-id.web.app`
- **Backend API**: `https://your-project-id.cloudfunctions.net/api`

## Local Development

### Start Firebase Emulators
```bash
firebase emulators:start
```

### Test Functions Locally
```bash
cd packages/backend/firebase-functions
npm run serve
```

## Troubleshooting

1. **Build Errors**: Ensure all dependencies are installed with `pnpm install`
2. **Function Timeout**: Increase timeout in Firebase console if needed
3. **CORS Issues**: Check CORS configuration in functions
4. **Database Connection**: Verify DATABASE_URL is accessible from Firebase Functions
