# Bypass Tool Pro

Bypass Tool Pro là ứng dụng full-stack được thiết kế để giúp bạn theo dõi thứ hạng SEO của website trên Google cho các từ khóa cụ thể.

## 🏗️ Kiến trúc Thống nhất

- **Backend**: Fastify API với Prisma ORM
- **Frontend**: Next.js với Tailwind CSS  
- **Database**: Supabase (PostgreSQL managed service)
- **Deployment**: Firebase Hosting + Vercel Backend

## 🚀 Yêu cầu

- Node.js v18+
- pnpm package manager
- Firebase CLI
- Supabase account (PostgreSQL managed service)

## 🛠️ Thiết lập

### 1. Cài đặt
```bash
pnpm install
```

### 2. Thiết lập Supabase
- Tạo project tại supabase.com
- Lấy connection string từ Settings > Database
- Cập nhật DATABASE_URL trong config files
- Database sẽ được tạo tự động qua Prisma

### 3. Thiết lập Firebase
- Tạo project tại firebase.google.com
- Cập nhật .firebaserc với project ID

### 4. Chạy ứng dụng
```bash
pnpm dev
```

## 📊 Database Schema (Supabase)

- **Project**: Quản lý dự án SEO
- **Keyword**: Từ khóa cần theo dõi
- **KeywordRank**: Lịch sử thứ hạng

## 🌐 **Production URLs:**
- **Frontend**: https://tienziven-bypass-tool.web.app
- **Backend**: https://backend-6qwu8zyfa-maitrungtruc2002-gmailcoms-projects.vercel.app
- **Database**: Supabase (tienziven-bypass-tool)

## 🚀 **Quick Start:**
```bash
# Setup hoàn chỉnh
pnpm setup:complete

# Deploy production
pnpm deploy:production

# Chạy local
pnpm dev
```

## 🚀 Deploy

```bash
pnpm deploy          # Deploy tất cả
pnpm deploy:backend  # Deploy backend
pnpm deploy:frontend # Deploy frontend
pnpm deploy:production # Deploy production hoàn chỉnh
```
