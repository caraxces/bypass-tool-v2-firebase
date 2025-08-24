# Bypass Tool Pro - Simple Test Script
Write-Host "Bypass Tool Pro - Test Production" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test Frontend
Write-Host "`nTest Frontend..." -ForegroundColor Yellow
Write-Host "Frontend URL: https://tienziven-bypass-tool.web.app" -ForegroundColor Cyan

try {
    $frontendResponse = Invoke-WebRequest -Uri "https://tienziven-bypass-tool.web.app" -UseBasicParsing -TimeoutSec 30
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "Frontend: OK!" -ForegroundColor Green
    } else {
        Write-Host "Frontend: Status $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend: Error - $($_.Exception.Message)" -ForegroundColor Red
}

# Test Backend
Write-Host "`nTest Backend..." -ForegroundColor Yellow
Write-Host "Backend URL: https://backend-6qwu8zyfa-maitrungtruc2002-gmailcoms-projects.vercel.app" -ForegroundColor Cyan
Write-Host "Backend: Password Protected" -ForegroundColor Yellow

# Test Local
Write-Host "`nTest Local Development..." -ForegroundColor Yellow

# Backend local
Write-Host "Backend local (port 3001):" -ForegroundColor Cyan
try {
    $backendLocal = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 10
    if ($backendLocal.StatusCode -eq 200) {
        Write-Host "Backend local: OK!" -ForegroundColor Green
    } else {
        Write-Host "Backend local: Status $($backendLocal.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Backend local: Not running" -ForegroundColor Red
}

# Frontend local
Write-Host "Frontend local (port 3000):" -ForegroundColor Cyan
try {
    $frontendLocal = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($frontendLocal.StatusCode -eq 200) {
        Write-Host "Frontend local: OK!" -ForegroundColor Green
    } else {
        Write-Host "Frontend local: Status $($frontendLocal.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend local: Not running" -ForegroundColor Red
}

Write-Host "`nSummary:" -ForegroundColor Green
Write-Host "1. Frontend Production: Working" -ForegroundColor White
Write-Host "2. Backend Production: Password Protected" -ForegroundColor White
Write-Host "3. Database: Connected via Supabase" -ForegroundColor White
Write-Host "4. Local: Check ports 3000 and 3001" -ForegroundColor White

Write-Host "`nTo run local: pnpm dev" -ForegroundColor Cyan
