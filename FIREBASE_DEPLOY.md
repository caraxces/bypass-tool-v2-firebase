# Firebase Deployment Guide - Plan Miễn Phí

## 🆓 Firebase Plan Miễn Phí (Spark Plan)

**Firebase Spark Plan** cung cấp các dịch vụ miễn phí sau:
- **Hosting**: 10GB storage, 360MB/day transfer
- **Functions**: 125K invocations/month, 40K GB-seconds/month
- **Authentication**: 10K users/month
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB/day transfer

## 📋 Prerequisites

1. **Firebase CLI**: Install globally với `npm install -g firebase-tools`
2. **Firebase Account**: Tạo Firebase project tại [console.firebase.google.com](https://console.firebase.google.com)
3. **Node.js 18+**: Bắt buộc cho Firebase Functions
4. **Git**: Để quản lý source code

## 🚀 Setup Steps

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Đặt tên project (ví dụ: `bypass-tool-pro`)
4. Chọn "Continue" (không cần Google Analytics)
5. Chọn "Create project"

### 2. Login Firebase CLI
```bash
firebase login
```

### 3. Khởi tạo Firebase trong dự án
```bash
cd bypass-tool-pro
firebase init
```

**Chọn các options sau:**
- ✅ **Hosting**: Configure files for Firebase Hosting
- ✅ **Functions**: Configure a Cloud Functions directory and its files
- ❌ **Firestore**: Configure security rules and indexes
- ❌ **Storage**: Configure security rules
- ❌ **Emulators**: Set up local emulators

**Cấu hình Hosting:**
- Public directory: `packages/frontend/out`
- Configure as single-page app: `Yes`
- Set up automatic builds and deploys: `No`
- File `packages/frontend/out/404.html` already exists: `Yes`

**Cấu hình Functions:**
- Language: `TypeScript`
- Use ESLint: `Yes`
- Install dependencies: `Yes`

### 4. Cập nhật cấu hình Firebase

**Cập nhật `.firebaserc`:**
```json
{
  "projects": {
    "default": "your-project-id-here"
  }
}
```

**Cập nhật `firebase.json`:**
```json
{
  "hosting": {
    "public": "packages/frontend/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "packages/backend/firebase-functions",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  }
}
```

## 🏗️ Build Frontend

### 1. Cài đặt dependencies
```bash
cd packages/frontend
pnpm install
```

### 2. Build production
```bash
pnpm build
```

**Lưu ý**: Đảm bảo `next.config.js` có cấu hình output static:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

## 🔧 Cấu hình Backend

### 1. Cài đặt dependencies
```bash
cd packages/backend/firebase-functions
npm install
```

### 2. Cập nhật `package.json`:
```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  }
}
```

### 3. Cấu hình environment variables
```bash
firebase functions:config:set database.url="YOUR_DATABASE_URL"
firebase functions:config:set database.user="YOUR_DB_USER"
firebase functions:config:set database.password="YOUR_DB_PASSWORD"
firebase functions:config:set database.host="YOUR_DB_HOST"
firebase functions:config:set database.port="5432"
firebase functions:config:set database.name="YOUR_DB_NAME"
```

## 🚀 Deploy

### 1. Deploy tất cả
```bash
firebase deploy
```

### 2. Deploy riêng lẻ

**Chỉ deploy frontend:**
```bash
firebase deploy --only hosting
```

**Chỉ deploy backend:**
```bash
firebase deploy --only functions
```

## 🌐 Database Setup (Miễn phí)

### Option 1: Supabase (Khuyến nghị)
1. Truy cập [supabase.com](https://supabase.com)
2. Tạo account và project mới
3. Lấy connection string từ Settings > Database
4. Cập nhật Firebase config

### Option 2: Neon
1. Truy cập [neon.tech](https://neon.tech)
2. Tạo account và project
3. Lấy connection string
4. Cập nhật Firebase config

### Option 3: Railway
1. Truy cập [railway.app](https://railway.app)
2. Tạo account và project
3. Deploy PostgreSQL service
4. Lấy connection string

## 📍 URLs sau khi deploy

- **Frontend**: `https://your-project-id.web.app`
- **Backend API**: `https://your-project-id.cloudfunctions.net/api`

## 🔍 Kiểm tra và Monitoring

### 1. Firebase Console
- Truy cập [console.firebase.google.com](https://console.firebase.google.com)
- Chọn project của bạn
- Kiểm tra Hosting và Functions

### 2. Logs
```bash
firebase functions:log
```

### 3. Usage và Billing
- Vào Firebase Console > Usage and billing
- Kiểm tra giới hạn plan miễn phí

## 🚨 Giới hạn Plan Miễn phí

### Hosting
- **Storage**: 10GB
- **Transfer**: 360MB/day
- **Custom domains**: 1 domain

### Functions
- **Invocations**: 125K/month
- **Compute time**: 40K GB-seconds/month
- **Outbound networking**: 5GB/month

### Khi vượt quá giới hạn
1. **Upgrade lên Blaze Plan** (pay-as-you-go)
2. **Tối ưu hóa code** để giảm usage
3. **Implement caching** để giảm function calls

## 🛠️ Troubleshooting

### 1. Build Errors
```bash
# Kiểm tra dependencies
pnpm install

# Clean build
rm -rf packages/frontend/out
pnpm build
```

### 2. Function Timeout
- Tăng timeout trong Firebase Console
- Tối ưu hóa database queries
- Implement connection pooling

### 3. CORS Issues
- Kiểm tra CORS config trong functions
- Cập nhật allowed origins

### 4. Database Connection
- Kiểm tra DATABASE_URL
- Kiểm tra firewall settings
- Test connection từ local

## 📱 Local Development

### 1. Firebase Emulators
```bash
firebase emulators:start
```

### 2. Test Functions locally
```bash
cd packages/backend/firebase-functions
npm run serve
```

### 3. Test Hosting locally
```bash
firebase serve --only hosting
```

## 💡 Tips tối ưu hóa

1. **Implement caching** để giảm function calls
2. **Use CDN** cho static assets
3. **Optimize images** trước khi upload
4. **Monitor usage** thường xuyên
5. **Set up alerts** khi gần đạt giới hạn

## 🔄 Auto-deploy với GitHub Actions

Tạo file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install -g firebase-tools
    - run: npm ci
    - run: npm run build
    - run: firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
```

## 🎯 Kết luận

Với Firebase Spark Plan miễn phí, bạn có thể:
- ✅ Deploy full-stack app
- ✅ Sử dụng hosting và functions
- ✅ Kết nối database bên ngoài
- ✅ Scale khi cần thiết

**Lưu ý**: Luôn monitor usage để tránh vượt quá giới hạn miễn phí!
