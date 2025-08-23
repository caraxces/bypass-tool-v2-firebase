# 🚀 Hướng Dẫn Setup Bypass Tool Pro - Kiến Trúc Thống Nhất

## 📋 **TÌNH TRẠNG HIỆN TẠI ĐÃ ĐƯỢC GIẢI QUYẾT:**

✅ **XUNG ĐỘT BACKEND**: Đã thống nhất - cả backend chính và Firebase Functions đều dùng Fastify + Prisma  
✅ **XUNG ĐỘT DATABASE**: Đã thống nhất - PostgreSQL trên Supabase cho cả development và production  
✅ **XUNG ĐỘT DEPLOYMENT**: Đã thống nhất - Firebase Hosting + Firebase Functions  
✅ **XUNG ĐỘT DEPENDENCIES**: Đã thống nhất - Prisma, Fastify, Puppeteer cho cả hai  

## 🎯 **KIẾN TRÚC CUỐI CÙNG:**

```
Bypass Tool Pro
├── Frontend (Next.js) → Firebase Hosting
├── Backend (Fastify + Prisma) → Firebase Functions  
└── Database (PostgreSQL) → Supabase
```

## 🛠️ **BƯỚC 1: THIẾT LẬP SUPABASE DATABASE**

### 1.1 Tạo Supabase Account
- Truy cập [supabase.com](https://supabase.com)
- Đăng ký tài khoản miễn phí
- Tạo project mới

### 1.2 Lấy Database Connection String
- Vào **Settings > Database**
- Copy connection string có dạng:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public
```

### 1.3 Cập nhật Environment Files

**Backend Development:**
```bash
cd packages/backend
cp config.env.example .env
# Cập nhật DATABASE_URL trong .env
```

**Firebase Functions Production:**
```bash
cd packages/backend/firebase-functions  
cp config.env.example .env
# Cập nhật DATABASE_URL trong .env
```

## 🔥 **BƯỚC 2: THIẾT LẬP FIREBASE**

### 2.1 Tạo Firebase Project
- Truy cập [firebase.google.com](https://firebase.google.com)
- Tạo project mới
- Ghi nhớ Project ID

### 2.2 Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2.3 Cập nhật .firebaserc
```json
{
  "projects": {
    "default": "YOUR-PROJECT-ID"
  }
}
```

## 🗄️ **BƯỚC 3: SETUP DATABASE**

### 3.1 Generate Prisma Client
```bash
# Từ thư mục root
pnpm db:generate
```

### 3.2 Push Schema to Database
```bash
pnpm db:push
```

### 3.3 (Tùy chọn) Run Migrations
```bash
pnpm db:migrate
```

## 🚀 **BƯỚC 4: CHẠY ỨNG DỤNG**

### 4.1 Development Mode
```bash
# Chạy cả backend + frontend
pnpm dev

# Hoặc chạy riêng lẻ
pnpm --filter backend dev    # Backend port 3001
pnpm --filter frontend dev   # Frontend port 3000
```

### 4.2 Kiểm tra Kết nối
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🌐 **BƯỚC 5: DEPLOY PRODUCTION**

### 5.1 Deploy Backend (Firebase Functions)
```bash
pnpm deploy:backend
```

### 5.2 Deploy Frontend (Firebase Hosting)
```bash
pnpm deploy:frontend
```

### 5.3 Deploy Tất cả
```bash
pnpm deploy
```

## 📊 **CẤU TRÚC DATABASE HOÀN CHỈNH:**

```sql
-- Bảng Project
Project (id, name, domain, createdAt, updatedAt)

-- Bảng Keyword  
Keyword (id, text, projectId, createdAt, updatedAt)

-- Bảng KeywordRank
KeywordRank (id, position, url, checkedAt, keywordId)
```

## 🔧 **SCRIPTS HỮU ÍCH:**

```bash
# Database Management
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema to database
pnpm db:migrate     # Run migrations
pnpm db:studio      # Open Prisma Studio

# Development
pnpm dev            # Chạy backend + frontend
pnpm build          # Build tất cả packages

# Deployment
pnpm deploy         # Deploy tất cả
pnpm deploy:backend # Deploy backend
pnpm deploy:frontend # Deploy frontend
```

## ✅ **KIỂM TRA HOÀN THÀNH:**

- [ ] Supabase database đã tạo và kết nối được
- [ ] Firebase project đã setup
- [ ] Environment variables đã cập nhật
- [ ] Database schema đã push thành công
- [ ] Ứng dụng chạy được ở local
- [ ] Deploy production thành công

## 🆘 **XỬ LÝ SỰ CỐ THƯỜNG GẶP:**

### Lỗi Database Connection
```bash
# Kiểm tra DATABASE_URL
echo $DATABASE_URL

# Test connection
pnpm db:push
```

### Lỗi Firebase Deploy
```bash
# Kiểm tra project ID
firebase projects:list

# Deploy với verbose
firebase deploy --debug
```

### Lỗi Build
```bash
# Clean và rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

---

## 🎉 **KẾT QUẢ CUỐI CÙNG:**

Bây giờ bạn có một ứng dụng SEO hoàn chỉnh với:
- **Frontend**: Next.js đẹp mắt trên Firebase Hosting
- **Backend**: Fastify API mạnh mẽ trên Firebase Functions  
- **Database**: PostgreSQL ổn định trên Supabase
- **Kiến trúc**: Thống nhất, không xung đột, dễ scale

**Tất cả xung đột đã được giải quyết!** 🚀
