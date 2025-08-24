# Bypass Tool Pro - Complete System Setup & Deploy Script
# PowerShell script để setup và deploy toàn bộ hệ thống

Write-Host "🚀 Bypass Tool Pro - Complete System Setup & Deploy" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Bước 1: Kiểm tra prerequisites
Write-Host "`n📋 Bước 1: Kiểm tra prerequisites..." -ForegroundColor Yellow

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js không được cài đặt. Vui lòng cài Node.js 18+ trước." -ForegroundColor Red
    exit 1
}

# Kiểm tra pnpm
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm không được cài đặt. Đang cài đặt..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Kiểm tra Firebase CLI
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI không được cài đặt. Đang cài đặt..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Bước 2: Cài đặt dependencies
Write-Host "`n📦 Bước 2: Cài đặt dependencies..." -ForegroundColor Yellow
pnpm install

# Bước 3: Setup database
Write-Host "`n🗄️ Bước 3: Setup database..." -ForegroundColor Yellow

# Kiểm tra file config.env
if (-not (Test-Path "packages/backend/config.env")) {
    Write-Host "❌ File config.env không tồn tại. Vui lòng tạo file với mật khẩu database." -ForegroundColor Red
    Write-Host "📝 Hướng dẫn lấy mật khẩu:" -ForegroundColor Cyan
    Write-Host "   1. Vào Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor Cyan
    Write-Host "   2. Chọn project: tienziven-bypass-tool" -ForegroundColor Cyan
    Write-Host "   3. Settings > Database > Database Password" -ForegroundColor Cyan
    Write-Host "   4. Copy mật khẩu và thay [YOUR-DATABASE-PASSWORD] trong config.env" -ForegroundColor Cyan
    exit 1
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
pnpm db:generate

# Push database schema
Write-Host "📤 Pushing database schema..." -ForegroundColor Cyan
pnpm db:push

# Bước 4: Build hệ thống
Write-Host "`n🔨 Bước 4: Build hệ thống..." -ForegroundColor Yellow
pnpm build

# Bước 5: Test backend
Write-Host "`n🧪 Bước 5: Test backend..." -ForegroundColor Yellow
Write-Host "🔧 Khởi động backend trong background..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd packages/backend; pnpm dev" -WindowStyle Minimized

# Đợi backend khởi động
Write-Host "⏳ Đợi backend khởi động..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test health endpoint
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get
    Write-Host "✅ Backend hoạt động: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend không thể kết nối. Kiểm tra logs..." -ForegroundColor Red
}

# Bước 6: Test frontend
Write-Host "`n🌐 Bước 6: Test frontend..." -ForegroundColor Yellow
Write-Host "🔧 Khởi động frontend trong background..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd packages/frontend; pnpm dev" -WindowStyle Minimized

# Đợi frontend khởi động
Write-Host "⏳ Đợi frontend khởi động..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Bước 7: Test toàn bộ API
Write-Host "`n🧪 Bước 7: Test toàn bộ API..." -ForegroundColor Yellow
Write-Host "🔧 Chạy test script..." -ForegroundColor Cyan
node test-all-endpoints.js

# Bước 8: Deploy lên Firebase
Write-Host "`n🚀 Bước 8: Deploy lên Firebase..." -ForegroundColor Yellow

# Login Firebase (nếu cần)
Write-Host "🔐 Đăng nhập Firebase..." -ForegroundColor Cyan
firebase login --no-localhost

# Deploy
Write-Host "📤 Deploying to Firebase..." -ForegroundColor Cyan
firebase deploy

Write-Host "`n🎉 HOÀN THÀNH! Hệ thống đã được setup và deploy thành công!" -ForegroundColor Green
Write-Host "`n📋 Thông tin truy cập:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   🔧 Backend: http://localhost:3001" -ForegroundColor White
Write-Host "   🗄️ Database: Supabase (tienziven-bypass-tool)" -ForegroundColor White
Write-Host "   🚀 Production: Firebase Hosting + Functions" -ForegroundColor White

Write-Host "`n🔧 Để dừng hệ thống:" -ForegroundColor Yellow
Write-Host "   - Dừng backend: Ctrl+C trong terminal backend" -ForegroundColor White
Write-Host "   - Dừng frontend: Ctrl+C trong terminal frontend" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md: Hướng dẫn tổng quan" -ForegroundColor White
Write-Host "   - SETUP_GUIDE.md: Hướng dẫn chi tiết" -ForegroundColor White
Write-Host "   - FUNCTIONALITY_ANALYSIS.md: Phân tích chức năng" -ForegroundColor White
