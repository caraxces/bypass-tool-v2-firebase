# Start Bypass Tool Pro Project
Write-Host "Starting Bypass Tool Pro Project..." -ForegroundColor Green

# Check if database is running
Write-Host "Checking database status..." -ForegroundColor Yellow
$dbRunning = docker ps --filter "name=bypass-tool-pro-db" --format "{{.Names}}"

if ($dbRunning -eq "") {
    Write-Host "Database is not running. Starting it..." -ForegroundColor Red
    Write-Host "Please run start-database.ps1 first or start it manually." -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "Database is running!" -ForegroundColor Green

# Build backend
Write-Host "Building backend..." -ForegroundColor Blue
cd packages/backend
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}

# Go back to root
cd ../..

# Start the project
Write-Host "Starting development servers..." -ForegroundColor Blue
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

pnpm dev
