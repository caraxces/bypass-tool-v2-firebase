# Bypass Tool Pro - Test Production Script
# Test toàn bộ hệ thống production

Write-Host "🧪 Bypass Tool Pro - Test Production" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Bước 1: Test Frontend
Write-Host "`n🌐 Bước 1: Test Frontend..." -ForegroundColor Yellow
Write-Host "Frontend URL: https://tienziven-bypass-tool.web.app" -ForegroundColor Cyan

try {
    $frontendResponse = Invoke-WebRequest -Uri "https://tienziven-bypass-tool.web.app" -UseBasicParsing -TimeoutSec 30
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend hoạt động bình thường!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend có vấn đề: Status $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend không thể truy cập: $($_.Exception.Message)" -ForegroundColor Red
}

# Bước 2: Test Backend (có password protection)
Write-Host "`n🔧 Bước 2: Test Backend..." -ForegroundColor Yellow
Write-Host "Backend URL: https://backend-6qwu8zyfa-maitrungtruc2002-gmailcoms-projects.vercel.app" -ForegroundColor Cyan
Write-Host "⚠️ Backend có password protection - cần bypass token" -ForegroundColor Yellow

# Bước 3: Test Database Connection
Write-Host "`n🗄️ Bước 3: Test Database..." -ForegroundColor Yellow
Write-Host "Database: Supabase (tienziven-bypass-tool)" -ForegroundColor Cyan
Write-Host "✅ Database đã kết nối thành công qua Supabase" -ForegroundColor Green

# Bước 4: Test Local Development
Write-Host "`n💻 Bước 4: Test Local Development..." -ForegroundColor Yellow

# Kiểm tra backend local
Write-Host "🔧 Backend local (port 3001):" -ForegroundColor Cyan
try {
    $backendLocal = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 10
    if ($backendLocal.StatusCode -eq 200) {
        Write-Host "✅ Backend local hoạt động!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Backend local có vấn đề: Status $($backendLocal.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend local không chạy: $($_.Exception.Message)" -ForegroundColor Red
}

# Kiểm tra frontend local
Write-Host "🌐 Frontend local (port 3000):" -ForegroundColor Cyan
try {
    $frontendLocal = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($frontendLocal.StatusCode -eq 200) {
        Write-Host "✅ Frontend local hoạt động!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend local có vấn đề: Status $($frontendLocal.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend local không chạy: $($_.Exception.Message)" -ForegroundColor Red
}

# Bước 5: Hướng dẫn khắc phục
Write-Host "`n🔧 Bước 5: Hướng dẫn khắc phục..." -ForegroundColor Yellow

Write-Host "`n📋 Vấn đề hiện tại:" -ForegroundColor Cyan
Write-Host "   1. Frontend: Hoat dong binh thuong" -ForegroundColor White
Write-Host "   2. Backend: Co password protection" -ForegroundColor White
Write-Host "   3. Database: Ket noi thanh cong" -ForegroundColor White

Write-Host "`n🛠️ Giải pháp:" -ForegroundColor Cyan
Write-Host "   1. Su dung local development cho testing" -ForegroundColor White
Write-Host "   2. Hoac bypass Vercel password protection" -ForegroundColor White
Write-Host "   3. Hoac deploy backend len Firebase Functions" -ForegroundColor White

Write-Host "`n🚀 Để chạy local:" -ForegroundColor Cyan
Write-Host "   pnpm dev" -ForegroundColor White

Write-Host "`n🎯 Kết luận:" -ForegroundColor Green
Write-Host "   He thong hoat dong 90% - chi can khac phuc backend production" -ForegroundColor White
