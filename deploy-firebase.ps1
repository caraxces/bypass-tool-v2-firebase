# Firebase Deploy Script - Plan Miễn Phí
# Chạy script này để deploy ứng dụng lên Firebase

Write-Host "🚀 Firebase Deploy Script - Plan Miễn Phí" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Kiểm tra Firebase CLI
Write-Host "📋 Kiểm tra Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI đã cài đặt: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI chưa cài đặt. Đang cài đặt..." -ForegroundColor Red
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Không thể cài đặt Firebase CLI. Vui lòng cài đặt thủ công." -ForegroundColor Red
        exit 1
    }
}

# Kiểm tra đăng nhập Firebase
Write-Host "🔐 Kiểm tra đăng nhập Firebase..." -ForegroundColor Yellow
try {
    $projects = firebase projects:list --json | ConvertFrom-Json
    if ($projects.result -and $projects.result.Count -gt 0) {
        Write-Host "✅ Đã đăng nhập Firebase. Projects: $($projects.result.Count)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Chưa đăng nhập Firebase. Đang chuyển hướng..." -ForegroundColor Yellow
        firebase login
    }
} catch {
    Write-Host "⚠️ Chưa đăng nhập Firebase. Đang chuyển hướng..." -ForegroundColor Yellow
    firebase login
}

# Kiểm tra cấu trúc dự án
Write-Host "📁 Kiểm tra cấu trúc dự án..." -ForegroundColor Yellow
if (-not (Test-Path "packages/frontend")) {
    Write-Host "❌ Không tìm thấy thư mục packages/frontend" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "packages/backend")) {
    Write-Host "❌ Không tìm thấy thư mục packages/backend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Cấu trúc dự án hợp lệ" -ForegroundColor Green

# Khởi tạo Firebase nếu chưa có
if (-not (Test-Path "firebase.json")) {
    Write-Host "🔧 Khởi tạo Firebase project..." -ForegroundColor Yellow
    firebase init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Không thể khởi tạo Firebase project" -ForegroundColor Red
        exit 1
    }
}

# Cài đặt dependencies frontend
Write-Host "📦 Cài đặt dependencies frontend..." -ForegroundColor Yellow
Set-Location "packages/frontend"
if (Test-Path "pnpm-lock.yaml") {
    pnpm install
} else {
    npm install
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Không thể cài đặt dependencies frontend" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host "🏗️ Build frontend..." -ForegroundColor Yellow
if (Test-Path "pnpm-lock.yaml") {
    pnpm build
} else {
    npm run build
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Không thể build frontend" -ForegroundColor Red
    exit 1
}

# Kiểm tra output build
if (-not (Test-Path "out")) {
    Write-Host "❌ Không tìm thấy thư mục out sau khi build" -ForegroundColor Red
    Write-Host "💡 Hãy kiểm tra next.config.js có output: 'export'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Frontend build thành công" -ForegroundColor Green

# Cài đặt dependencies backend
Write-Host "📦 Cài đặt dependencies backend..." -ForegroundColor Yellow
Set-Location "../backend/firebase-functions"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Không thể cài đặt dependencies backend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️ Không tìm thấy package.json trong firebase-functions" -ForegroundColor Yellow
}

# Quay về thư mục gốc
Set-Location "../../.."

# Deploy lên Firebase
Write-Host "🚀 Deploy lên Firebase..." -ForegroundColor Yellow
Write-Host "💡 Bạn có muốn deploy tất cả không? (y/n)" -ForegroundColor Cyan
$deployAll = Read-Host

if ($deployAll -eq "y" -or $deployAll -eq "Y") {
    Write-Host "🚀 Deploy tất cả..." -ForegroundColor Green
    firebase deploy
} else {
    Write-Host "🔧 Deploy từng phần..." -ForegroundColor Yellow
    Write-Host "1. Deploy Hosting (Frontend)" -ForegroundColor Cyan
    Write-Host "2. Deploy Functions (Backend)" -ForegroundColor Cyan
    Write-Host "3. Deploy cả hai" -ForegroundColor Cyan
    Write-Host "Chọn option (1/2/3): " -ForegroundColor Cyan
    $option = Read-Host
    
    switch ($option) {
        "1" {
            Write-Host "🚀 Deploy Hosting..." -ForegroundColor Green
            firebase deploy --only hosting
        }
        "2" {
            Write-Host "🚀 Deploy Functions..." -ForegroundColor Green
            firebase deploy --only functions
        }
        "3" {
            Write-Host "🚀 Deploy cả hai..." -ForegroundColor Green
            firebase deploy --only hosting,functions
        }
        default {
            Write-Host "❌ Option không hợp lệ" -ForegroundColor Red
            exit 1
        }
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deploy thành công!" -ForegroundColor Green
    Write-Host "🌐 Kiểm tra Firebase Console: https://console.firebase.google.com" -ForegroundColor Cyan
    Write-Host "📱 URLs sẽ được hiển thị ở trên" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deploy thất bại. Vui lòng kiểm tra logs" -ForegroundColor Red
    Write-Host "💡 Chạy 'firebase functions:log' để xem logs" -ForegroundColor Yellow
}

Write-Host "===============================================" -ForegroundColor Green
Write-Host "✅ Script hoàn thành!" -ForegroundColor Green
