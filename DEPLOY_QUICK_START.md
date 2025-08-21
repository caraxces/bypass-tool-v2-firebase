# 🚀 Deploy Nhanh lên Firebase - Plan Miễn Phí

## ⚡ Deploy trong 5 phút

### 1. Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Đăng nhập Firebase
```bash
firebase login
```

### 3. Chạy script tự động
```bash
# Windows PowerShell
.\deploy-firebase.ps1

# Hoặc chạy từng bước thủ công
```

## 🔧 Deploy thủ công

### Bước 1: Khởi tạo Firebase
```bash
firebase init
```
**Chọn:**
- ✅ Hosting
- ✅ Functions  
- ❌ Firestore, Storage, Emulators

### Bước 2: Build Frontend
```bash
cd packages/frontend
pnpm install
pnpm build
```

### Bước 3: Deploy
```bash
# Deploy tất cả
firebase deploy

# Hoặc deploy riêng lẻ
firebase deploy --only hosting
firebase deploy --only functions
```

## 🌐 Database miễn phí

### Supabase (Khuyến nghị)
1. Tạo account tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy connection string từ Settings > Database
4. Cập nhật Firebase config:
```bash
firebase functions:config:set database.url="YOUR_SUPABASE_URL"
```

## 📱 URLs sau deploy
- **Frontend**: `https://your-project.web.app`
- **Backend**: `https://your-project.cloudfunctions.net/api`

## 🆓 Giới hạn Plan Miễn phí
- **Hosting**: 10GB storage, 360MB/day
- **Functions**: 125K calls/month
- **Database**: Sử dụng Supabase/Neon miễn phí

## 🆘 Gặp vấn đề?

1. **Build lỗi**: Kiểm tra `next.config.js` có `output: 'export'`
2. **Deploy lỗi**: Chạy `firebase functions:log`
3. **Database lỗi**: Kiểm tra connection string

## 📚 Tài liệu chi tiết
Xem file `FIREBASE_DEPLOY.md` để biết thêm chi tiết.
