# Production Deployment Guide

## 🚀 Deploy lên Firebase (Miễn phí)

### Bước 1: Chuẩn bị Firebase Project

1. **Tạo Firebase Project**
   - Truy cập [console.firebase.google.com](https://console.firebase.google.com)
   - Tạo project mới với tên "bypass-tool-pro"
   - Copy Project ID

2. **Cập nhật .firebaserc**
   ```json
   {
     "projects": {
       "default": "YOUR_ACTUAL_PROJECT_ID"
     }
   }
   ```

### Bước 2: Thiết lập Database Production

#### Option 1: Supabase (Khuyến nghị)
1. Tạo account tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào Settings > Database
4. Copy connection string
5. Cập nhật DATABASE_URL trong Firebase Functions config

#### Option 2: Neon
1. Tạo account tại [neon.tech](https://neon.tech)
2. Tạo project mới
3. Copy connection string
4. Cập nhật DATABASE_URL

### Bước 3: Deploy

```bash
# 1. Đăng nhập Firebase
firebase login

# 2. Khởi tạo project (chỉ làm 1 lần)
firebase init
# Chọn:
# - Hosting: Configure files for Firebase Hosting
# - Functions: Configure files for Firebase Functions
# - Use existing project: Yes
# - Public directory: packages/frontend/out
# - Single-page app: Yes
# - Set up automatic builds: No

# 3. Deploy tất cả
pnpm deploy
```

## 🌐 Deploy lên Vercel (Alternative)

### Bước 1: Chuẩn bị
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login
```

### Bước 2: Deploy Frontend
```bash
cd packages/frontend
vercel --prod
```

### Bước 3: Deploy Backend
```bash
cd packages/backend
vercel --prod
```

## 🐳 Deploy với Docker

### Tạo Dockerfile cho Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Tạo Dockerfile cho Frontend
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### Deploy với Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./packages/backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NODE_ENV=production

  frontend:
    build: ./packages/frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
PUPPETEER_HEADLESS=true
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 📊 Monitoring & Logs

### Firebase Functions Logs
```bash
firebase functions:log
```

### Health Check
```bash
curl https://your-project-id.cloudfunctions.net/api/health
```

### Database Monitoring
- **Supabase**: Dashboard tích hợp
- **Neon**: Metrics và logs
- **Railway**: Real-time monitoring

## 🚨 Troubleshooting Production

### Lỗi thường gặp

1. **Function Timeout**
   - Tăng timeout trong Firebase Console
   - Tối ưu hóa code

2. **Memory Issues**
   - Tăng memory allocation
   - Sử dụng streaming cho large data

3. **Database Connection**
   - Kiểm tra connection pool
   - Sử dụng connection pooling

4. **CORS Issues**
   - Cập nhật CORS_ORIGIN
   - Kiểm tra domain whitelist

### Performance Optimization

1. **Backend**
   - Sử dụng caching (Redis)
   - Implement rate limiting
   - Optimize database queries

2. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization

## 🔒 Security

### Environment Variables
- Không commit .env files
- Sử dụng Firebase Functions config
- Rotate secrets regularly

### Database Security
- Sử dụng SSL connections
- Implement row-level security
- Regular backups

### API Security
- Rate limiting
- Input validation
- CORS configuration

## 📈 Scaling

### Firebase Functions
- Auto-scaling built-in
- Cold start optimization
- Memory allocation

### Database
- Connection pooling
- Read replicas
- Sharding (if needed)

---

**Ready for Production! 🚀**
