# Bypass Tool Pro - Quick Start Guide

## 🚀 Khởi động nhanh

### 1. Khởi động Database
```powershell
.\start-database.ps1
```

### 2. Khởi động Dự án
```powershell
.\start-project.ps1
```

### 3. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🛠️ Các lệnh hữu ích

### Development
```bash
# Khởi động cả frontend và backend
pnpm dev

# Build backend
pnpm --filter backend build

# Build frontend
pnpm --filter frontend build

# Build tất cả
pnpm build
```

### Database
```bash
# Khởi động database
.\start-database.ps1

# Dừng database
.\stop-database.ps1

# Chạy migration
cd packages/backend
pnpm prisma migrate dev --name init
```

## 🔥 Deploy lên Firebase

### 1. Đăng nhập Firebase
```bash
firebase login
```

### 2. Khởi tạo project (chỉ làm 1 lần)
```bash
firebase init
# Chọn Hosting và Functions
# Chọn project của bạn
# Public directory: packages/frontend/out
# Single-page app: Yes
```

### 3. Deploy
```bash
# Deploy tất cả
pnpm deploy

# Hoặc deploy riêng lẻ
pnpm deploy:frontend  # Chỉ frontend
pnpm deploy:backend   # Chỉ backend
```

## 📊 Database Setup

### Local Development
- Sử dụng Docker PostgreSQL (đã cấu hình sẵn)
- Connection string: `postgresql://postgres:password@localhost:5432/bypass_tool_pro?schema=public`

### Production
- **Supabase** (Miễn phí): https://supabase.com
- **Neon** (Miễn phí): https://neon.tech
- **Railway** (Miễn phí): https://railway.app

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Database không kết nối được**
   - Kiểm tra Docker có chạy không
   - Chạy `.\start-database.ps1`

2. **Port đã được sử dụng**
   - Dừng các service khác đang dùng port 3000/3001
   - Hoặc thay đổi port trong .env

3. **Build lỗi**
   - Chạy `pnpm install` để cài đặt dependencies
   - Kiểm tra TypeScript errors

### Logs
- **Frontend**: Xem console trong browser
- **Backend**: Xem terminal chạy `pnpm dev`
- **Database**: Xem Docker logs

## 📁 Cấu trúc dự án

```
bypass-tool-pro/
├── packages/
│   ├── backend/           # Fastify API + Prisma + Puppeteer
│   │   ├── src/          # Source code
│   │   ├── prisma/       # Database schema
│   │   └── firebase-functions/  # Firebase Functions
│   └── frontend/         # Next.js + Tailwind CSS
│       ├── src/          # Source code
│       └── components/   # UI components
├── scripts/              # PowerShell scripts
├── firebase.json         # Firebase config
└── package.json          # Root package.json
```

## 🌟 Tính năng

- ✅ **Project Management**: Tạo và quản lý dự án
- ✅ **Keyword Tracking**: Theo dõi từ khóa SEO
- ✅ **Automated Ranking**: Tự động kiểm tra thứ hạng Google
- ✅ **Modern UI**: Giao diện đẹp với Tailwind CSS
- ✅ **Real-time Updates**: Cập nhật thời gian thực
- ✅ **Firebase Ready**: Sẵn sàng deploy lên Firebase

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Logs trong terminal
2. Console trong browser
3. Database connection
4. Environment variables

---

**Happy Coding! 🎉**
