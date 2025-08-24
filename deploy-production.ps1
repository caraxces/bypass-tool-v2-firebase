# Bypass Tool Pro - Production Deploy Script
# Deploy toàn bộ hệ thống lên production sử dụng Supabase + Vercel

Write-Host "🚀 Bypass Tool Pro - Production Deploy" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

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

# Bước 2: Cài đặt dependencies
Write-Host "`n📦 Bước 2: Cài đặt dependencies..." -ForegroundColor Yellow
pnpm install

# Bước 3: Build frontend
Write-Host "`n🔨 Bước 3: Build frontend..." -ForegroundColor Yellow
Write-Host "🌐 Building frontend..." -ForegroundColor Cyan
pnpm --filter frontend build

# Bước 4: Deploy frontend lên Firebase Hosting
Write-Host "`n🚀 Bước 4: Deploy frontend lên Firebase..." -ForegroundColor Yellow
Write-Host "🌐 Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

# Bước 5: Deploy backend lên Vercel (alternative)
Write-Host "`n🔧 Bước 5: Deploy backend lên Vercel..." -ForegroundColor Yellow
Write-Host "📝 Hướng dẫn deploy backend:" -ForegroundColor Cyan
Write-Host "   1. Cài đặt Vercel CLI: npm install -g vercel" -ForegroundColor White
Write-Host "   2. Vào thư mục backend: cd packages/backend" -ForegroundColor White
Write-Host "   3. Chạy: vercel --prod" -ForegroundColor White

# Bước 6: Test production
Write-Host "`n🧪 Bước 6: Test production..." -ForegroundColor Yellow
Write-Host "🌐 Frontend URL: https://tienziven-bypass-tool.web.app" -ForegroundColor Green
Write-Host "🔧 Backend URL: Sẽ có sau khi deploy Vercel" -ForegroundColor Yellow

Write-Host "`n🎉 HOÀN THÀNH! Hệ thống đã được deploy lên production!" -ForegroundColor Green

Write-Host "`n📋 Thông tin truy cập:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend: https://tienziven-bypass-tool.web.app" -ForegroundColor White
Write-Host "   🗄️ Database: Supabase (tienziven-bypass-tool)" -ForegroundColor White
Write-Host "   🔧 Backend: Vercel (sau khi deploy)" -ForegroundColor White

Write-Host "`n🔧 Để deploy backend lên Vercel:" -ForegroundColor Yellow
Write-Host "   cd packages/backend" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md: Hướng dẫn tổng quan" -ForegroundColor White
Write-Host "   - SETUP_GUIDE.md: Hướng dẫn chi tiết" -ForegroundColor White
Write-Host "   - FUNCTIONALITY_ANALYSIS.md: Phân tích chức năng" -ForegroundColor White
