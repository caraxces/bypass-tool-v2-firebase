# Bypass Tool Pro - Quick Deploy Script
# Deploy toàn bộ hệ thống lên Firebase ngay lập tức

Write-Host "🚀 Bypass Tool Pro - Quick Deploy to Firebase" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Bước 1: Kiểm tra Firebase login
Write-Host "`n🔐 Bước 1: Kiểm tra Firebase login..." -ForegroundColor Yellow
try {
    $firebaseUser = firebase projects:list
    Write-Host "✅ Đã đăng nhập Firebase" -ForegroundColor Green
} catch {
    Write-Host "❌ Chưa đăng nhập Firebase. Đang đăng nhập..." -ForegroundColor Red
    firebase login --no-localhost
}

# Bước 2: Build hệ thống
Write-Host "`n🔨 Bước 2: Build hệ thống..." -ForegroundColor Yellow
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
pnpm install

Write-Host "🔧 Building backend..." -ForegroundColor Cyan
pnpm --filter backend build

Write-Host "🌐 Building frontend..." -ForegroundColor Cyan
pnpm --filter frontend build

# Bước 3: Deploy lên Firebase
Write-Host "`n🚀 Bước 3: Deploy lên Firebase..." -ForegroundColor Yellow

# Deploy Firebase Functions
Write-Host "🔧 Deploying Firebase Functions..." -ForegroundColor Cyan
firebase deploy --only functions

# Deploy Firebase Hosting
Write-Host "🌐 Deploying Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

# Deploy tất cả
Write-Host "📤 Deploying everything..." -ForegroundColor Cyan
firebase deploy

Write-Host "`n🎉 HOÀN THÀNH! Hệ thống đã được deploy lên Firebase!" -ForegroundColor Green

# Hiển thị thông tin truy cập
Write-Host "`n📋 Thông tin truy cập:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend: https://tienziven-bypass-tool.web.app" -ForegroundColor White
Write-Host "   🔧 Backend: https://us-central1-tienziven-bypass-tool.cloudfunctions.net/api" -ForegroundColor White
Write-Host "   🗄️ Database: Supabase (tienziven-bypass-tool)" -ForegroundColor White

Write-Host "`n🔧 Để kiểm tra trạng thái:" -ForegroundColor Yellow
Write-Host "   firebase projects:list" -ForegroundColor White
Write-Host "   firebase functions:log" -ForegroundColor White
Write-Host "   firebase hosting:channel:list" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - FIREBASE_DEPLOY.md: Hướng dẫn deploy chi tiết" -ForegroundColor White
Write-Host "   - PRODUCTION_DEPLOY.md: Hướng dẫn production" -ForegroundColor White
